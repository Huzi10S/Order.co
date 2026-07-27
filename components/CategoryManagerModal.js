import { useState } from "react";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import { COLLECTIONS } from "../lib/collections";

export default function CategoryManagerModal({ onClose, categories, products }) {
  const [newCat, setNewCat] = useState("");
  const [editingCat, setEditingCat] = useState(null); // original name
  const [editValue, setEditValue] = useState("");
  
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [merging, setMerging] = useState(false);
  const [mergeTarget, setMergeTarget] = useState("");

  const [saving, setSaving] = useState(false);

  // Helper to count products
  const countProducts = (cat) => products.filter(p => p.section === cat).length;

  async function updateCategoriesArray(newArray) {
    await updateDoc(doc(db, COLLECTIONS.settings, "config"), { categories: newArray });
  }

  async function handleCreate(e) {
    e.preventDefault();
    const cat = newCat.trim();
    if (!cat || categories.includes(cat)) return;
    
    setSaving(true);
    try {
      await updateCategoriesArray([...categories, cat]);
      setNewCat("");
    } catch (err) {
      alert("Failed to create category");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat) {
    if (countProducts(cat) > 0) {
      alert(`Cannot delete "${cat}" because it has products. Please move them first.`);
      return;
    }
    if (!confirm(`Delete category "${cat}"?`)) return;
    
    setSaving(true);
    try {
      await updateCategoriesArray(categories.filter(c => c !== cat));
    } catch (err) {
      alert("Failed to delete category");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(cat) {
    setEditingCat(cat);
    setEditValue(cat);
  }

  async function saveEdit(e) {
    e.preventDefault();
    const newName = editValue.trim();
    if (!newName || newName === editingCat) {
      setEditingCat(null);
      return;
    }
    if (categories.includes(newName)) {
      alert("A category with this name already exists.");
      return;
    }

    setSaving(true);
    try {
      const batch = writeBatch(db);
      
      // 1. Update the categories array
      const newArray = categories.map(c => c === editingCat ? newName : c);
      batch.update(doc(db, COLLECTIONS.settings, "config"), { categories: newArray });

      // 2. Update all products in this category
      products.forEach(p => {
        if (p.section === editingCat) {
          batch.update(doc(db, COLLECTIONS.products, p.id), { section: newName });
        }
      });

      await batch.commit();
      setEditingCat(null);
    } catch (err) {
      alert("Failed to rename category");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleMerge(e) {
    e.preventDefault();
    const target = mergeTarget.trim();
    if (!target || selectedCats.size === 0) return;

    const count = products.filter(p => selectedCats.has(p.section)).length;
    if (!confirm(`Merge ${selectedCats.size} categories into "${target}"? This will move ${count} products.`)) return;

    setSaving(true);
    try {
      const batch = writeBatch(db);
      
      // 1. Compute new categories array
      // Remove selected ones, add target if not exists
      let newArray = categories.filter(c => !selectedCats.has(c));
      if (!newArray.includes(target)) {
        newArray.push(target);
      }
      batch.update(doc(db, COLLECTIONS.settings, "config"), { categories: newArray });

      // 2. Move products
      products.forEach(p => {
        if (selectedCats.has(p.section)) {
          batch.update(doc(db, COLLECTIONS.products, p.id), { section: target });
        }
      });

      await batch.commit();
      setMerging(false);
      setSelectedCats(new Set());
    } catch (err) {
      alert("Failed to merge categories");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function toggleCat(cat) {
    setSelectedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  async function moveUp(idx) {
    if (idx === 0) return;
    const newArray = [...categories];
    [newArray[idx - 1], newArray[idx]] = [newArray[idx], newArray[idx - 1]];
    setSaving(true);
    await updateCategoriesArray(newArray);
    setSaving(false);
  }

  async function moveDown(idx) {
    if (idx === categories.length - 1) return;
    const newArray = [...categories];
    [newArray[idx], newArray[idx + 1]] = [newArray[idx + 1], newArray[idx]];
    setSaving(true);
    await updateCategoriesArray(newArray);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface text-ink w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-xl overflow-hidden border border-ink/5">
        <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-gray-50 dark:bg-surface/50 shrink-0">
          <h2 className="font-bold text-lg">Manage Categories</h2>
          <button onClick={onClose} className="text-ink/50 hover:text-ink text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1">
          {/* Create new */}
          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <input 
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="New category name..."
              className="flex-1 border border-ink/15 rounded-lg px-4 py-2 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
            <button type="submit" disabled={saving} className="btn btn-primary px-4 py-2 font-semibold text-sm">Add</button>
          </form>

          {/* Merge UI */}
          {selectedCats.size > 0 && (
            <div className="bg-rust/5 border border-rust/20 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-rust text-sm mb-2">Merge {selectedCats.size} categories</h3>
              <form onSubmit={handleMerge} className="flex flex-col sm:flex-row gap-2">
                <input 
                  value={mergeTarget}
                  onChange={(e) => setMergeTarget(e.target.value)}
                  placeholder="Target category name..."
                  className="flex-1 border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rust"
                  required
                />
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  <button type="button" onClick={() => setSelectedCats(new Set())} className="btn w-full sm:w-auto btn-ghost px-3 py-2 text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="btn w-full sm:w-auto bg-rust text-white font-semibold text-sm px-4 py-2">Merge</button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          <div className="space-y-2">
            {categories.map((cat, idx) => (
              <div key={cat} className="flex items-center gap-3 p-3 border border-ink/10 rounded-lg hover:border-ink/20 transition group">
                <input 
                  type="checkbox"
                  checked={selectedCats.has(cat)}
                  onChange={() => toggleCat(cat)}
                  className="w-4 h-4 rounded border-ink/20 text-navy focus:ring-navy cursor-pointer"
                />
                
                {editingCat === cat ? (
                  <form onSubmit={saveEdit} className="flex-1 flex flex-col sm:flex-row gap-2">
                    <input 
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 border border-ink/15 rounded px-2 py-1 text-sm focus:outline-none focus:border-navy"
                    />
                    <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
                      <button type="button" onClick={() => setEditingCat(null)} className="text-ink/50 text-sm font-semibold px-2 py-1">Cancel</button>
                      <button type="submit" disabled={saving} className="text-navy text-sm font-bold px-2 py-1 bg-navy/5 rounded">Save</button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{cat}</span>
                      <span className="text-xs text-ink/40 bg-ink/5 px-2 py-0.5 rounded-full">{countProducts(cat)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition">
                      <button onClick={() => moveUp(idx)} disabled={idx === 0 || saving} className="p-1 hover:bg-ink/5 rounded disabled:opacity-30" title="Move Up">↑</button>
                      <button onClick={() => moveDown(idx)} disabled={idx === categories.length - 1 || saving} className="p-1 hover:bg-ink/5 rounded disabled:opacity-30" title="Move Down">↓</button>
                      <div className="w-px h-4 bg-ink/10 mx-1"></div>
                      <button onClick={() => startEdit(cat)} className="text-navy text-sm font-semibold hover:underline">Rename</button>
                      <button onClick={() => handleDelete(cat)} disabled={saving} className="text-rust text-sm font-semibold hover:underline ml-2">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center text-ink/40 text-sm py-4">No categories found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
