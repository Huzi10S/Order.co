import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  setDoc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { PRODUCT_SECTIONS } from "../lib/constants";
import { useProducts } from "../lib/useProducts";
import { useSettings } from "../lib/useSettings";


/* ─── Clipboard helper with fallback for older browsers / Android WebViews ─── */
function copyTextWithFallback(text) {
  // Try modern Clipboard API first
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    return navigator.clipboard.writeText(text).then(
      function () { return true; },
      function () { return fallbackCopy(text); }
    );
  }
  // Fallback for older browsers
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    var ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

export default function ShopPage() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = logged out

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) {
    return <div className="min-h-screen bg-cloth flex items-center justify-center text-ink/50">Loading...</div>;
  }
  if (!user) {
    return <LoginScreen />;
  }
  return <Dashboard />;
}

const USER_MAP = {
  "murtaza h": "murtaza.h@shop.com",
  "hamza h": "hamza.h@shop.com",
};

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const email = USER_MAP[username.trim().toLowerCase()];
    if (!email) {
      setError("Unknown username.");
      setBusy(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Incorrect password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-cloth flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-white rounded-xl border border-ink/10 p-8 max-w-sm w-full">
        <p className="text-rust text-xs font-bold tracking-wide uppercase mb-1">Supreme Sanitary</p>
        <h1 className="text-2xl font-bold text-navy mb-1">Shop dashboard</h1>
        <p className="text-ink/50 text-sm mb-6">Log in to see orders and manage products</p>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoCapitalize="words"
          className="w-full border border-ink/15 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-ink/15 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
        />
        {error && <p className="text-rust text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary w-full disabled:opacity-50 rounded-xl py-3.5"
        >
          {busy ? "Logging in..." : "Log in"}
        </button>
        <a href="/" className="block text-center text-ink/40 text-sm mt-5">
          ← Back to customer page
        </a>
      </form>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState("orders");
  const { products, error: prodConnError } = useProducts();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
    }
  }, []);

  function toggleDarkMode() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-cloth">
      <header className="bg-navy text-white sticky top-0 z-20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-lg">Shop dashboard</h1>
          <button onClick={() => signOut(auth)} className="btn btn-ghost text-white/70 text-sm">Log out</button>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-1 pb-2">
          {[
            ["orders", "Orders"],
            ["products", "Products"],
            ["settings", "Settings"],
          ].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn px-4 py-3 text-sm capitalize ${
                tab === t ? "text-white border-b-2 border-white" : "text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {tab === "orders" && <OrdersTab products={products} />}
        {tab === "products" && <ProductsTab products={products} connError={prodConnError} />}
        {tab === "settings" && <SettingsTab darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      </main>
    </div>
    </div>
  );
}

function formatOrderForExcel(order) {
  const lines = order.items.map((it) => {
    const name = it.variant ? `${it.name} (${it.variant})` : it.name;
    return `${name}\t${it.qty}\t${it.unit}`;
  });
  return lines.join("\n");
}

function isToday(timestamp) {
  if (!timestamp?.toDate) return false;
  const d = timestamp.toDate();
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/* ─── Modal for showing copyable text when clipboard APIs both fail ─── */
function CopyFallbackModal({ text, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-ink/10 p-5 max-w-sm w-full">
        <h2 className="font-bold text-navy text-lg mb-2">Copy this text</h2>
        <p className="text-sm text-ink/50 mb-3">Long-press the text below to select and copy it manually.</p>
        <textarea
          readOnly
          value={text}
          className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm h-40 select-all"
          onFocus={(e) => e.target.select()}
        />
        <button
          onClick={onClose}
          className="btn btn-primary w-full rounded-xl py-3 text-sm mt-3"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function playDing() {
  try {
    if (localStorage.getItem("soundEnabled") === "false") return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

function OrdersTab({ products }) {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("new"); // "new" | "later" | "history"
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [fulfillOrder, setFulfillOrder] = useState(null);
  const [fulfillChecks, setFulfillChecks] = useState({});
  const [cancelOrder, setCancelOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [undoData, setUndoData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [connError, setConnError] = useState(null);
  const [fallbackText, setFallbackText] = useState(null);

  useEffect(() => {
    let isInitial = true;
    let loadTime = new Date();

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setConnError(null);

        if (!isInitial) {
          const newOrders = snap.docChanges().filter((c) => c.type === "added").map((c) => c.doc.data());
          newOrders.forEach((o) => {
            if (o.status === "pending" && o.createdAt?.toDate() > loadTime) {
              playDing();
              setToastMessage(`New order from ${o.customerName}`);
              setTimeout(() => setToastMessage(null), 4000);
            }
          });
        }
        isInitial = false;
      },
      (err) => {
        console.error("Orders listener error:", err);
        setConnError("Connection lost, trying to reconnect...");
      }
    );
    return () => unsub();
  }, []);

  const visible = orders.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchItems = o.items?.some((it) => it.name?.toLowerCase().includes(q) || it.variant?.toLowerCase().includes(q));
      if (!matchName && !matchItems) return false;
    } else {
      if (view === "new" && o.status !== "pending") return false;
      if (view === "later" && o.status !== "later") return false;
      if (view === "history" && o.status !== "fulfilled" && o.status !== "cancelled") return false;
    }

    if (dateFilter === "today" && !isToday(o.createdAt)) return false;
    if (dateFilter === "week") {
      if (!o.createdAt) return false;
      const d = o.createdAt.toDate();
      const now = new Date();
      if (now - d > 7 * 24 * 60 * 60 * 1000) return false;
    }
    if (dateFilter === "month") {
      if (!o.createdAt) return false;
      const d = o.createdAt.toDate();
      const now = new Date();
      if (now.getMonth() !== d.getMonth() || now.getFullYear() !== d.getFullYear()) return false;
    }

    return true;
  });

  const todaysOrders = orders.filter((o) => isToday(o.createdAt));
  const todaysItemCount = todaysOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, it) => s + it.qty, 0),
    0
  );

  async function setStatus(id, status) {
    try {
      await updateDoc(doc(db, "orders", id), { status });
    } catch (err) {
      alert("Could not update order. Please check your internet and try again.");
      console.error(err);
    }
  }

  async function copyOrder(order) {
    const text = formatOrderForExcel(order);
    var ok = await copyTextWithFallback(text);
    if (ok) {
      setCopiedId(order.id);
      setTimeout(function () { setCopiedId(null); }, 2000);
    } else {
      setFallbackText(text);
    }
  }

  function openFulfillModal(order) {
    const checks = {};
    order.items.forEach((_, i) => (checks[i] = true));
    setFulfillChecks(checks);
    setFulfillOrder(order);
  }

  async function confirmFulfill() {
    const checkedItems = fulfillOrder.items.filter((_, i) => fulfillChecks[i]);
    var clipMsg = "";
    if (checkedItems.length > 0) {
      const text = checkedItems
        .map((it) => {
          const name = it.variant ? `${it.name} (${it.variant})` : it.name;
          return `${name}\t${it.qty}\t${it.unit}`;
        })
        .join("\n");
      var ok = await copyTextWithFallback(text);
      if (ok) {
        clipMsg = "Copied " + checkedItems.length + " item" + (checkedItems.length > 1 ? "s" : "") + " to your clipboard. Paste into Excel.";
      } else {
        // Show fallback modal after fulfilling
        setFallbackText(text);
      }
    }
    try {
      await setStatus(fulfillOrder.id, "fulfilled");
    } catch (err) {
      // setStatus already alerts
    }
    setFulfillOrder(null);
    if (clipMsg) {
      alert(clipMsg);
    } else if (checkedItems.length === 0) {
      alert("Order marked fulfilled. No items were ticked, so nothing was copied.");
    }
  }

  async function confirmCancel() {
    const previousStatus = cancelOrder.status;
    const id = cancelOrder.id;
    await setStatus(id, "cancelled");
    setCancelOrder(null);

    const timeoutId = setTimeout(() => {
      setUndoData((prev) => (prev?.id === id ? null : prev));
    }, 5000);
    setUndoData({ id, previousStatus, timeoutId });
  }

  async function handleUndo() {
    if (!undoData) return;
    clearTimeout(undoData.timeoutId);
    await setStatus(undoData.id, undoData.previousStatus);
    setUndoData(null);
  }

  async function saveOrderItems(id, items) {
    try {
      await updateDoc(doc(db, "orders", id), { items });
      setEditOrder(null);
    } catch (err) {
      alert("Could not update order.");
      console.error(err);
    }
  }

  const viewLabels = { new: "New orders", later: "Kept for later", history: "Past orders" };

  return (
    <div>
      {connError && (
        <div className="bg-rust/10 text-rust rounded-lg px-4 py-3 mb-4 text-sm font-medium text-center">
          {connError}
        </div>
      )}

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all orders..."
            className="flex-1 border border-ink/15 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
          />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-ink/15 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition text-sm"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>

        {!searchQuery && (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex gap-1 bg-white rounded-lg p-1 border border-ink/10">
              {["new", "later", "history"].map((key) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`btn px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                view === key ? "bg-navy text-white" : "text-ink/60"
              }`}
            >
              {viewLabels[key]}
            </button>
          ))}
            </div>
            <button
              onClick={() => setShowSummary(true)}
              className="btn btn-danger text-sm rounded-xl px-4 py-2.5"
            >
              Summary / Export
            </button>
          </div>
        )}
      </div>

      {visible.length === 0 && (
        <p className="text-ink/50 text-center py-10">
          {searchQuery ? "No orders match your search." :
           view === "new" ? "No new orders right now." :
           view === "later" ? "Nothing kept for later." :
           "No past orders yet."}
        </p>
      )}

      <div className="space-y-4">
        {visible.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-ink/10 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-ink">{order.customerName}</p>
                {order.customerPhone && (
                  <p className="text-xs text-ink/50">{order.customerPhone}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/40">
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString()
                    : "Just now"}
                </p>
                {order.status && order.status !== "pending" && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    order.status === "fulfilled" ? "bg-leaf/10 text-leaf" :
                    order.status === "cancelled" ? "bg-rust/10 text-rust" :
                    "bg-navy/10 text-navy"
                  }`}>
                    {order.status === "later" ? "Later" : order.status === "fulfilled" ? "Fulfilled" : "Cancelled"}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-ink/10 pt-2 mb-3">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm py-0.5">
                  <span>{it.name}{it.variant ? ` — ${it.variant}` : ""}</span>
                  <span className="text-ink/60">{it.qty} {it.unit}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap mt-2">
              <button
                onClick={() => copyOrder(order)}
                className="btn flex-1 bg-cloth border border-ink/15 rounded-lg py-2.5 text-sm font-semibold text-navy min-w-[100px]"
              >
                {copiedId === order.id ? "Copied ✓" : "Copy for Excel"}
              </button>
              {(order.status === "pending" || order.status === "later") && (
                <button
                  onClick={() => openFulfillModal(order)}
                  className="btn flex-1 bg-leaf text-white rounded-lg py-2.5 text-sm font-semibold min-w-[100px]"
                >
                  Fulfill now
                </button>
              )}
              {(order.status === "pending" || order.status === "later") && (
                <button
                  onClick={() => setEditOrder(order)}
                  className="btn flex-1 bg-cloth border border-ink/15 rounded-lg py-2.5 text-sm font-semibold text-navy min-w-[100px]"
                >
                  Edit
                </button>
              )}
              {order.status === "pending" && (
                <button
                  onClick={() => setStatus(order.id, "later")}
                  className="btn flex-1 bg-navy text-white rounded-lg py-2.5 text-sm font-semibold min-w-[100px]"
                >
                  Keep for later
                </button>
              )}
              {(order.status === "pending" || order.status === "later") && (
                <button
                  onClick={() => setCancelOrder(order)}
                  className="btn flex-1 bg-rust text-white rounded-lg py-2.5 text-sm font-semibold min-w-[100px]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showSummary && (
        <DailySummaryModal
          orders={orders}
          onClose={() => setShowSummary(false)}
        />
      )}

      {fulfillOrder && (
        <FulfillModal
          order={fulfillOrder}
          checks={fulfillChecks}
          setChecks={setFulfillChecks}
          onCancel={() => setFulfillOrder(null)}
          onConfirm={confirmFulfill}
        />
      )}

      {editOrder && (
        <EditOrderModal
          order={editOrder}
          products={products}
          onClose={() => setEditOrder(null)}
          onSave={saveOrderItems}
        />
      )}

      {cancelOrder && (
        <ConfirmModal
          title="Cancel this order?"
          message={`This will cancel ${cancelOrder.customerName}'s order.`}
          confirmLabel="Yes, cancel it"
          onConfirm={confirmCancel}
          onClose={() => setCancelOrder(null)}
        />
      )}

      {fallbackText && (
        <CopyFallbackModal
          text={fallbackText}
          onClose={() => setFallbackText(null)}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-navy text-white px-5 py-3 rounded-full text-sm shadow-xl z-50">
          {toastMessage}
        </div>
      )}

      {undoData && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-rust text-white px-5 py-3 rounded-full text-sm shadow-xl z-50 flex items-center gap-4">
          <span>Order cancelled</span>
          <button onClick={handleUndo} className="btn btn-ghost font-bold underline">Undo</button>
        </div>
      )}
    </div>
  );
}

function EditOrderModal({ order, products, onClose, onSave }) {
  const [items, setItems] = useState(order.items || []);
  const [selectedProductId, setSelectedProductId] = useState("");

  function updateQty(idx, qty) {
    const num = Number(qty);
    const next = [...items];
    next[idx].qty = num;
    setItems(next);
  }

  function removeItem(idx) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function addItem() {
    const p = products.find((x) => x.id === selectedProductId);
    if (!p) return;
    setItems([...items, { name: p.name, unit: p.unit, qty: 1 }]);
    setSelectedProductId("");
  }

  async function handleSave() {
    if (items.length === 0) return alert("Order must have at least 1 item.");
    await onSave(order.id, items);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[85vh] flex flex-col border border-ink/10">
        <div className="px-5 py-4 border-b border-ink/10">
          <h2 className="font-bold text-navy text-lg">Edit Order</h2>
          <p className="text-xs text-ink/50">{order.customerName}</p>
        </div>

        <div className="overflow-y-auto px-5 py-3 flex-1 space-y-3">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={it.qty}
                onChange={(e) => updateQty(i, e.target.value)}
                className="w-16 border border-ink/15 rounded-lg px-2 py-2 text-center text-sm focus:outline-none focus:border-navy"
              />
              <span className="flex-1 text-sm text-ink truncate">
                {it.name}{it.variant ? ` — ${it.variant}` : ""}
              </span>
              <button onClick={() => removeItem(i)} className="btn btn-ghost text-rust text-sm font-semibold">
                Remove
              </button>
            </div>
          ))}

          <div className="pt-3 mt-3 border-t border-ink/10 flex gap-2">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="flex-1 border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-navy"
            >
              <option value="">Select product to add...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={addItem}
              disabled={!selectedProductId}
              className="btn bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-ink/10 flex gap-2">
          <button
            onClick={onClose}
            className="btn flex-1 bg-cloth border border-ink/15 rounded-lg py-3 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn bg-leaf text-white rounded-lg py-3 text-sm font-bold"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function FulfillModal({ order, checks, setChecks, onCancel, onConfirm }) {
  const allChecked = order.items.every((_, i) => checks[i]);

  function toggleAll() {
    const next = {};
    order.items.forEach((_, i) => (next[i] = !allChecked));
    setChecks(next);
  }

  function toggleOne(i) {
    setChecks((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  const checkedCount = order.items.filter((_, i) => checks[i]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[85vh] flex flex-col border border-ink/10">
        <div className="px-5 py-4 border-b border-ink/10">
          <h2 className="font-bold text-navy text-lg">Fulfill order</h2>
          <p className="text-xs text-ink/50">
            {order.customerName} — untick anything you couldn't give
          </p>
        </div>

        <div className="overflow-y-auto px-5 py-3 flex-1">
          {order.items.map((it, i) => (
            <label key={i} className="flex items-center gap-3 py-2.5 border-b border-ink/5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!checks[i]}
                onChange={() => toggleOne(i)}
                className="w-5 h-5 accent-leaf shrink-0"
              />
              <span className="flex-1 text-sm text-ink">
                {it.name}{it.variant ? ` — ${it.variant}` : ""}
              </span>
              <span className="text-sm text-ink/60">{it.qty} {it.unit}</span>
            </label>
          ))}

          <button
            onClick={toggleAll}
            className="btn btn-ghost w-full text-sm font-semibold text-navy underline mt-3 py-1"
          >
            {allChecked ? "Untick all" : "Tick all"}
          </button>
        </div>

        <div className="p-5 border-t border-ink/10 flex gap-2">
          <button
            onClick={onCancel}
            className="btn flex-1 bg-cloth border border-ink/15 rounded-lg py-3 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-leaf text-white rounded-lg py-3 text-sm font-bold"
          >
            Fulfill ({checkedCount})
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-ink/10 p-6 max-w-sm w-full">
        <h2 className="font-bold text-navy text-lg mb-2">{title}</h2>
        <p className="text-sm text-ink/60 mb-5">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="btn flex-1 bg-cloth border border-ink/15 rounded-lg py-2.5 text-sm font-semibold"
          >
            No, go back
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-rust text-white rounded-lg py-2.5 text-sm font-semibold"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function DailySummaryModal({ orders, onClose }) {
  const [range, setRange] = useState("today");
  const [subTab, setSubTab] = useState("stats"); // "stats" | "insights"

  const filteredOrders = orders.filter((o) => {
    if (range === "all") return true;
    if (range === "today") return isToday(o.createdAt);
    if (range === "week") {
      if (!o.createdAt) return false;
      const d = o.createdAt.toDate();
      const now = new Date();
      return (now - d) <= 7 * 24 * 60 * 60 * 1000;
    }
    if (range === "month") {
      if (!o.createdAt) return false;
      const d = o.createdAt.toDate();
      const now = new Date();
      return now.getMonth() === d.getMonth() && now.getFullYear() === d.getFullYear();
    }
    return true;
  });

  const itemCount = filteredOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, it) => s + it.qty, 0),
    0
  );
  const fulfilled = filteredOrders.filter((o) => o.status === "fulfilled").length;
  const pending = filteredOrders.filter((o) => o.status === "pending" || o.status === "later").length;

  // Insights Logic
  const topCustomers = {};
  const topProducts = {};
  filteredOrders.forEach((o) => {
    topCustomers[o.customerName] = (topCustomers[o.customerName] || 0) + 1;
    o.items.forEach((it) => {
      const name = it.variant ? `${it.name} (${it.variant})` : it.name;
      topProducts[name] = (topProducts[name] || 0) + it.qty;
    });
  });

  const sortedCustomers = Object.entries(topCustomers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCustomerVal = sortedCustomers.length ? sortedCustomers[0][1] : 1;

  const sortedProducts = Object.entries(topProducts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxProductVal = sortedProducts.length ? sortedProducts[0][1] : 1;

  function exportToExcel() {
    import("xlsx").then((XLSX) => {
      const data = filteredOrders.map(o => ({
        Date: o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString() : "",
        Customer: o.customerName,
        Phone: o.customerPhone || "",
        Status: o.status,
        Items: o.items.map(it => `${it.qty} ${it.unit} x ${it.name}${it.variant ? ` (${it.variant})` : ""}`).join("\n")
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
      XLSX.writeFile(wb, `Orders_${range}.xlsx`);
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[85vh] flex flex-col border border-ink/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h2 className="font-bold text-navy text-lg">Summary & Insights</h2>
          <button onClick={onClose} className="text-ink/50 text-2xl leading-none px-2">×</button>
        </div>

        <div className="px-5 py-3 flex items-center justify-between border-b border-ink/5 flex-wrap gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border border-ink/15 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <div className="flex gap-1 bg-cloth rounded-lg p-1 border border-ink/10">
            {["stats", "insights"].map((st) => (
              <button
                key={st}
                onClick={() => setSubTab(st)}
                className={`btn px-3 py-1.5 rounded-md text-sm capitalize ${
                  subTab === st ? "bg-white text-navy shadow-sm" : "text-ink/60"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex-1">
          {subTab === "stats" ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-cloth rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-navy">{filteredOrders.length}</p>
                  <p className="text-xs text-ink/50">Orders</p>
                </div>
                <div className="bg-cloth rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-navy">{itemCount}</p>
                  <p className="text-xs text-ink/50">Items ordered</p>
                </div>
                <div className="bg-leaf/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-leaf">{fulfilled}</p>
                  <p className="text-xs text-ink/50">Fulfilled</p>
                </div>
                <div className="bg-cloth rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-ink/70">{pending}</p>
                  <p className="text-xs text-ink/50">Still pending</p>
                </div>
              </div>

              {filteredOrders.length === 0 && (
                <p className="text-ink/50 text-center py-6">No orders in this range.</p>
              )}

              <div className="space-y-2">
                {filteredOrders.map((o) => (
                  <div key={o.id} className="flex justify-between text-sm border-b border-ink/5 py-2">
                    <span className="font-medium text-ink truncate w-1/2">{o.customerName}</span>
                    <span className="text-ink/50 text-right w-1/2">
                      {o.items.reduce((s, it) => s + it.qty, 0)} items ·{" "}
                      {o.status === "fulfilled" ? "Fulfilled" : o.status === "cancelled" ? "Cancelled" : o.status === "later" ? "Later" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-ink mb-3 text-sm">Top Customers (by orders)</h3>
                {sortedCustomers.length === 0 ? <p className="text-sm text-ink/50">No data</p> : null}
                <div className="space-y-3">
                  {sortedCustomers.map(([name, count]) => (
                    <div key={name} className="relative">
                      <div className="flex justify-between text-sm mb-1 relative z-10">
                        <span className="font-medium text-ink">{name}</span>
                        <span className="text-ink/60 font-semibold">{count}</span>
                      </div>
                      <div className="h-2 w-full bg-cloth rounded-full overflow-hidden">
                        <div className="h-full bg-navy rounded-full" style={{ width: `${(count / maxCustomerVal) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-ink mb-3 text-sm">Top Products (by qty)</h3>
                {sortedProducts.length === 0 ? <p className="text-sm text-ink/50">No data</p> : null}
                <div className="space-y-3">
                  {sortedProducts.map(([name, qty]) => (
                    <div key={name} className="relative">
                      <div className="flex justify-between text-sm mb-1 relative z-10">
                        <span className="font-medium text-ink truncate w-3/4">{name}</span>
                        <span className="text-ink/60 font-semibold">{qty}</span>
                      </div>
                      <div className="h-2 w-full bg-cloth rounded-full overflow-hidden">
                        <div className="h-full bg-rust rounded-full" style={{ width: `${(qty / maxProductVal) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-ink/10">
          <button
            onClick={exportToExcel}
            className="btn btn-success w-full rounded-lg py-3 text-sm font-semibold"
          >
            Export to Excel (.xlsx)
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products, connError }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  async function saveProduct(p) {
    try {
      const { id, ...rest } = p;
      await updateDoc(doc(db, "products", id), rest);
      setEditing(null);
    } catch (err) {
      alert("Could not save product. Please check your internet and try again.");
      console.error(err);
    }
  }

  async function removeProduct(id) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      alert("Could not delete product. Please check your internet and try again.");
      console.error(err);
    }
  }

  async function createProduct(p) {
    try {
      await addDoc(collection(db, "products"), p);
      setAdding(false);
    } catch (err) {
      alert("Could not add product. Please check your internet and try again.");
      console.error(err);
    }
  }

  return (
    <div>
      {connError && (
        <div className="bg-rust/10 text-rust rounded-lg px-4 py-3 mb-4 text-sm font-medium text-center">
          {connError}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-ink/15 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
        />
        <button
          onClick={() => setAdding(true)}
          className="btn btn-danger rounded-lg px-4 py-3 text-sm font-semibold whitespace-nowrap"
        >
          + Add product
        </button>
      </div>

      {adding && (
        <ProductForm
          onCancel={() => setAdding(false)}
          onSave={createProduct}
        />
      )}

      <div className="space-y-2">
        {filtered.map((p) =>
          editing === p.id ? (
            <ProductForm
              key={p.id}
              product={p}
              onCancel={() => setEditing(null)}
              onSave={saveProduct}
            />
          ) : (
            <div key={p.id} className="bg-white rounded-xl border border-ink/10 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-ink text-sm">{p.name}</p>
                <p className="text-xs text-ink/50">
                  {p.section} · {p.unit}
                  {p.price ? ` · ₹${p.price}` : ""}
                  {p.variants?.length ? ` · ${p.variants.length} sizes` : ""}
                </p>
              </div>
              <div className="flex gap-3 text-sm font-semibold">
                <button onClick={() => setEditing(p.id)} className="btn btn-ghost text-navy">Edit</button>
                <button onClick={() => removeProduct(p.id)} className="btn btn-ghost text-rust">Delete</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ProductForm({ product, onCancel, onSave }) {
  const [name, setName] = useState(product?.name || "");
  const [section, setSection] = useState(product?.section || PRODUCT_SECTIONS[0]);
  const [unit, setUnit] = useState(product?.unit || "pcs");
  const [price, setPrice] = useState(product?.price || "");
  const [variants, setVariants] = useState((product?.variants || []).join(", "));

  function submit(e) {
    e.preventDefault();
    onSave({
      id: product?.id,
      name: name.trim(),
      section,
      unit: unit.trim() || "pcs",
      price: price ? Number(price) : null,
      variants: variants
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-ink/10 p-4 mb-3 space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        required
        className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
      />
      <select
        value={section}
        onChange={(e) => setSection(e.target.value)}
        className="w-full border border-ink/15 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
      >
        {PRODUCT_SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="flex gap-2">
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unit (pcs, box, meter...)"
          className="w-1/2 border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (optional)"
          type="number"
          inputMode="numeric"
          className="w-1/2 border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
        />
      </div>
      <input
        value={variants}
        onChange={(e) => setVariants(e.target.value)}
        placeholder="Sizes, comma separated (optional) e.g. 6in, 8in, 9in"
        className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
      />
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn btn-primary flex-1 rounded-lg py-2 text-sm font-semibold">
          Save
        </button>
        <button type="button" onClick={onCancel} className="btn flex-1 bg-cloth border border-ink/15 rounded-lg py-2 text-sm font-semibold">
          Cancel
        </button>
      </div>
    </form>
  );
}

function SettingsTab({ darkMode, toggleDarkMode }) {
  const { showPrice: showPriceToCustomer, loaded } = useSettings();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Load local settings
    const sound = localStorage.getItem("soundEnabled");
    if (sound === "false") {
      setSoundEnabled(false);
    }
  }, []);

  async function toggleShowPrice() {
    const next = !showPriceToCustomer;
    // We update Firestore; the onSnapshot listener in useSettings will trigger UI updates
    try {
      await setDoc(doc(db, "settings", "config"), { showPriceToCustomer: next }, { merge: true });
    } catch (err) {
      alert("Could not save setting. Please check your internet and try again.");
      console.error(err);
    }
  }


  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("soundEnabled", next ? "true" : "false");
  }

  if (!loaded) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-ink/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink">Show prices to customers</p>
            <p className="text-xs text-ink/50 max-w-xs">
              If off, prices are only visible to you here for billing reference.
            </p>
          </div>
          <button
            onClick={toggleShowPrice}
            className={`btn w-12 h-7 rounded-full relative ${showPriceToCustomer ? "bg-leaf" : "bg-ink/20"}`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                showPriceToCustomer ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-ink/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink">Dark mode</p>
            <p className="text-xs text-ink/50 max-w-xs">
              Switch the dashboard and customer page to a dark theme.
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`btn w-12 h-7 rounded-full relative ${darkMode ? "bg-leaf" : "bg-ink/20"}`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                darkMode ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-ink/10 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink">New order sound</p>
            <p className="text-xs text-ink/50 max-w-xs">
              Play a subtle notification ding when a new order arrives.
            </p>
          </div>
          <button
            onClick={toggleSound}
            className={`btn w-12 h-7 rounded-full relative ${soundEnabled ? "bg-leaf" : "bg-ink/20"}`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                soundEnabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
