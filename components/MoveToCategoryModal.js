import { useState } from "react";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import { COLLECTIONS } from "../lib/collections";

export default function MoveToCategoryModal({ onClose, products, selectedIds, clearSelection, categories }) {
  const [targetCategory, setTargetCategory] = useState(categories[0] || "");
  const [moving, setMoving] = useState(false);

  async function handleMove(e) {
    e.preventDefault();
    if (!targetCategory || selectedIds.size === 0) return;
    
    setMoving(true);
    try {
      const batch = writeBatch(db);
      
      products.forEach(p => {
        if (selectedIds.has(p.id)) {
          batch.update(doc(db, COLLECTIONS.products, p.id), { section: targetCategory });
        }
      });
      
      await batch.commit();
      clearSelection();
      onClose();
    } catch (err) {
      alert("Failed to move products. Please try again.");
      console.error(err);
      setMoving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface text-ink w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-ink/5">
        <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-gray-50 dark:bg-surface/50">
          <h2 className="font-bold text-lg">Move to Category</h2>
          <button onClick={onClose} className="text-ink/50 hover:text-ink text-2xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleMove} className="p-5">
          <p className="mb-4 text-sm font-medium">Moving {selectedIds.size} product(s) to:</p>
          
          <select 
            value={targetCategory}
            onChange={(e) => setTargetCategory(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition mb-6"
            required
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-ghost px-5 py-2 text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={moving} className="btn btn-primary px-5 py-2 text-sm font-semibold">
              {moving ? "Moving..." : "Move"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
