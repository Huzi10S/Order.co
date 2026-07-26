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

const SECTION_OPTIONS = [
  "Pipes", "Elbows", "Tees", "Sockets", "Shoes", "Reducers & Bushings",
  "Unions", "End Caps & Plugs", "Valves", "Adapters & Nipples", "Saddles",
  "Vent Cowls", "Traps & Bends", "Taps & Showers", "Sanitaryware",
  "Bathroom Accessories", "Adhesives & Chemicals", "Other",
];

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

export default function UnclePage() {
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
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-card p-8 max-w-sm w-full">
        <p className="text-rust text-xs font-bold tracking-wide uppercase mb-1">Supreme Sanitary</p>
        <h1 className="text-xl font-bold text-navy mb-1">Shop dashboard</h1>
        <p className="text-ink/50 text-sm mb-6">Log in to see orders and manage products</p>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoCapitalize="words"
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 mb-3"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 mb-4"
        />
        {error && <p className="text-rust text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-navy text-white rounded-xl py-3 font-semibold disabled:opacity-50"
        >
          {busy ? "Logging in..." : "Log in"}
        </button>
        <a href="/" className="block text-center text-ink/40 text-xs mt-4">
          ← Back to customer page
        </a>
      </form>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState("orders");

  return (
    <div className="min-h-screen bg-cloth">
      <header className="bg-navy text-white sticky top-0 z-20 shadow-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-lg">Shop dashboard</h1>
          <button onClick={() => signOut(auth)} className="text-white/70 text-sm">Log out</button>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-1 pb-2">
          {[
            ["orders", "Orders"],
            ["products", "Products"],
            ["settings", "Settings"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                tab === key ? "bg-white text-navy" : "text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {tab === "orders" && <OrdersTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
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
      <div className="relative bg-white rounded-2xl shadow-card p-5 max-w-sm w-full">
        <h2 className="font-bold text-navy text-lg mb-2">Copy this text</h2>
        <p className="text-xs text-ink/50 mb-3">Long-press the text below to select and copy it manually.</p>
        <textarea
          readOnly
          value={text}
          className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm h-40 select-all"
          onFocus={(e) => e.target.select()}
        />
        <button
          onClick={onClose}
          className="w-full bg-navy text-white rounded-lg py-2.5 text-sm font-semibold mt-3"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("new"); // "new" | "later" | "history"
  const [copiedId, setCopiedId] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [fulfillOrder, setFulfillOrder] = useState(null);
  const [fulfillChecks, setFulfillChecks] = useState({});
  const [cancelOrder, setCancelOrder] = useState(null);
  const [connError, setConnError] = useState(null);
  const [fallbackText, setFallbackText] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setConnError(null);
      },
      (err) => {
        console.error("Orders listener error:", err);
        setConnError("Connection lost, trying to reconnect...");
      }
    );
    return () => unsub();
  }, []);

  const visible = orders.filter((o) => {
    if (view === "new") return o.status === "pending";
    if (view === "later") return o.status === "later";
    return o.status === "fulfilled" || o.status === "cancelled";
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
    await setStatus(cancelOrder.id, "cancelled");
    setCancelOrder(null);
  }

  const viewLabels = { new: "New orders", later: "Kept for later", history: "Past orders" };

  return (
    <div>
      {connError && (
        <div className="bg-rust/10 text-rust rounded-lg px-4 py-3 mb-4 text-sm font-medium text-center">
          {connError}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-card">
          {["new", "later", "history"].map((key) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                view === key ? "bg-navy text-white" : "text-ink/60"
              }`}
            >
              {viewLabels[key]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowSummary(true)}
          className="text-sm font-semibold bg-rust text-white rounded-lg px-4 py-2"
        >
          Today's summary
        </button>
      </div>

      {visible.length === 0 && (
        <p className="text-ink/50 text-center py-10">
          {view === "new" && "No new orders right now."}
          {view === "later" && "Nothing kept for later."}
          {view === "history" && "No past orders yet."}
        </p>
      )}

      <div className="space-y-3">
        {visible.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-card p-4">
            <div className="flex items-start justify-between mb-2">
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

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => copyOrder(order)}
                className="flex-1 bg-cloth border border-ink/15 rounded-lg py-2 text-sm font-semibold text-navy min-w-[100px]"
              >
                {copiedId === order.id ? "Copied ✓" : "Copy for Excel"}
              </button>
              {(view === "new" || view === "later") && (
                <button
                  onClick={() => openFulfillModal(order)}
                  className="flex-1 bg-leaf text-white rounded-lg py-2 text-sm font-semibold min-w-[100px]"
                >
                  Fulfill now
                </button>
              )}
              {view === "new" && (
                <button
                  onClick={() => setStatus(order.id, "later")}
                  className="flex-1 bg-navy text-white rounded-lg py-2 text-sm font-semibold min-w-[100px]"
                >
                  Keep for later
                </button>
              )}
              {(view === "new" || view === "later") && (
                <button
                  onClick={() => setCancelOrder(order)}
                  className="flex-1 bg-rust text-white rounded-lg py-2 text-sm font-semibold min-w-[100px]"
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
          orders={todaysOrders}
          itemCount={todaysItemCount}
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

      {cancelOrder && (
        <ConfirmModal
          title="Cancel this order?"
          message={`This will cancel ${cancelOrder.customerName}'s order. It'll move to Past Orders marked as cancelled.`}
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
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-card">
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
            className="w-full text-sm font-semibold text-navy underline mt-3 py-1"
          >
            {allChecked ? "Untick all" : "Tick all"}
          </button>
        </div>

        <div className="p-5 border-t border-ink/10 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-cloth border border-ink/15 rounded-lg py-3 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-leaf text-white rounded-lg py-3 text-sm font-bold"
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
      <div className="relative bg-white rounded-2xl shadow-card p-6 max-w-sm w-full">
        <h2 className="font-bold text-navy text-lg mb-2">{title}</h2>
        <p className="text-sm text-ink/60 mb-5">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-cloth border border-ink/15 rounded-lg py-2.5 text-sm font-semibold"
          >
            No, go back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-rust text-white rounded-lg py-2.5 text-sm font-semibold"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function DailySummaryModal({ orders, itemCount, onClose }) {
  const fulfilled = orders.filter((o) => o.status === "fulfilled").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const pending = orders.filter((o) => o.status === "pending" || o.status === "later").length;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h2 className="font-bold text-navy text-lg">Today's summary</h2>
          <button onClick={onClose} className="text-ink/50 text-2xl leading-none px-2">×</button>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex-1">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-cloth rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-navy">{orders.length}</p>
              <p className="text-xs text-ink/50">Orders today</p>
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

          {orders.length === 0 && (
            <p className="text-ink/50 text-center py-6">No orders yet today.</p>
          )}

          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex justify-between text-sm border-b border-ink/5 py-2">
                <span className="font-medium text-ink">{o.customerName}</span>
                <span className="text-ink/50">
                  {o.items.reduce((s, it) => s + it.qty, 0)} items ·{" "}
                  {o.status === "fulfilled" ? "Fulfilled" : o.status === "cancelled" ? "Cancelled" : o.status === "later" ? "Later" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [connError, setConnError] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setConnError(null);
      },
      (err) => {
        console.error("Products listener error:", err);
        setConnError("Connection lost, trying to reconnect...");
      }
    );
    return () => unsub();
  }, []);

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
          className="flex-1 border border-ink/15 rounded-lg px-3 py-2.5 bg-white"
        />
        <button
          onClick={() => setAdding(true)}
          className="bg-rust text-white rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap"
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
            <div key={p.id} className="bg-white rounded-xl shadow-card p-3.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-ink text-sm">{p.name}</p>
                <p className="text-xs text-ink/50">
                  {p.section} · {p.unit}
                  {p.price ? ` · ₹${p.price}` : ""}
                  {p.variants?.length ? ` · ${p.variants.length} sizes` : ""}
                </p>
              </div>
              <div className="flex gap-3 text-sm font-semibold">
                <button onClick={() => setEditing(p.id)} className="text-navy">Edit</button>
                <button onClick={() => removeProduct(p.id)} className="text-rust">Delete</button>
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
  const [section, setSection] = useState(product?.section || SECTION_OPTIONS[0]);
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
    <form onSubmit={submit} className="bg-white rounded-xl shadow-card p-4 mb-3 space-y-2.5">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        required
        className="w-full border border-ink/15 rounded-lg px-3 py-2"
      />
      <select
        value={section}
        onChange={(e) => setSection(e.target.value)}
        className="w-full border border-ink/15 rounded-lg px-3 py-2 bg-white"
      >
        {SECTION_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="flex gap-2">
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unit (pcs, box, meter...)"
          className="w-1/2 border border-ink/15 rounded-lg px-3 py-2"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (optional)"
          type="number"
          inputMode="numeric"
          className="w-1/2 border border-ink/15 rounded-lg px-3 py-2"
        />
      </div>
      <input
        value={variants}
        onChange={(e) => setVariants(e.target.value)}
        placeholder="Sizes, comma separated (optional) e.g. 6in, 8in, 9in"
        className="w-full border border-ink/15 rounded-lg px-3 py-2"
      />
      <div className="flex gap-2 pt-1">
        <button type="submit" className="flex-1 bg-navy text-white rounded-lg py-2 text-sm font-semibold">
          Save
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-cloth border border-ink/15 rounded-lg py-2 text-sm font-semibold">
          Cancel
        </button>
      </div>
    </form>
  );
}

function SettingsTab() {
  const [showPriceToCustomer, setShowPriceToCustomer] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "settings", "config"))
      .then((s) => {
        if (s.exists()) setShowPriceToCustomer(!!s.data().showPriceToCustomer);
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Settings fetch error:", err);
        setLoaded(true);
      });
  }, []);

  async function toggle() {
    const next = !showPriceToCustomer;
    setShowPriceToCustomer(next);
    try {
      await setDoc(doc(db, "settings", "config"), { showPriceToCustomer: next }, { merge: true });
    } catch (err) {
      alert("Could not save setting. Please check your internet and try again.");
      setShowPriceToCustomer(!next); // revert
      console.error(err);
    }
  }

  if (!loaded) return null;

  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-ink">Show prices to customers</p>
          <p className="text-xs text-ink/50 max-w-xs">
            If off, prices are only visible to you here for billing reference.
          </p>
        </div>
        <button
          onClick={toggle}
          className={`w-12 h-7 rounded-full transition relative ${showPriceToCustomer ? "bg-leaf" : "bg-ink/20"}`}
        >
          <span
            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
              showPriceToCustomer ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
