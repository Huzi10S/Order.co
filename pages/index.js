import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { PRODUCT_SECTIONS } from "../lib/constants";
import { useProducts } from "../lib/useProducts";
import { useSettings } from "../lib/useSettings";

function cartKey(productId, variant) {
  return variant ? `${productId}::${variant}` : productId;
}

export default function CustomerPage() {
  const { products, loading, error: connError } = useProducts();
  const { showPrice } = useSettings();
  const [cart, setCart] = useState({}); // key -> { product, variant, qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState({});
  const [loadSlow, setLoadSlow] = useState(false);

  useEffect(() => {
    if (loading) {
      const slowTimer = setTimeout(() => setLoadSlow(true), 8000);
      return () => clearTimeout(slowTimer);
    } else {
      setLoadSlow(false);
    }
  }, [loading]);

  const sections = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? products.filter((p) => p.name.toLowerCase().includes(q))
      : products;
    const bySection = {};
    for (const p of filtered) {
      const s = p.section || "Other";
      if (!bySection[s]) bySection[s] = [];
      bySection[s].push(p);
    }
    const order = q
      ? Object.keys(bySection)
      : PRODUCT_SECTIONS.filter((s) => bySection[s]);
    for (const s of Object.keys(bySection)) {
      if (!order.includes(s)) order.push(s);
    }
    return order.map((s) => ({ section: s, items: bySection[s] }));
  }, [products, search]);

  const isSearching = search.trim().length > 0;

  function toggleSection(section) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((sum, c) => sum + c.qty, 0);

  function updateCart(product, variant, qty) {
    const key = cartKey(product.id, variant);
    setCart((prev) => {
      const next = { ...prev };
      if (!qty || qty <= 0) {
        delete next[key];
      } else {
        next[key] = { product, variant, qty };
      }
      return next;
    });
  }

  function removeFromCart(key) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function placeOrder() {
    if (cartItems.length === 0) return;
    if (!customerName.trim()) {
      alert("Please enter your name so the shop knows who placed the order.");
      return;
    }
    setPlacing(true);
    try {
      await addDoc(collection(db, "orders"), {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || "",
        status: "pending",
        createdAt: serverTimestamp(),
        items: cartItems.map((c) => ({
          productId: c.product.id,
          name: c.product.name,
          variant: c.variant || null,
          unit: c.product.unit || "pcs",
          qty: c.qty,
          price: c.product.price || null,
        })),
      });
      setPlaced(true);
      setCart({});
    } catch (e) {
      alert("Could not send the order. Please check your internet and try again.");
      console.error(e);
    } finally {
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="min-h-screen bg-cloth flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-xl border border-ink/10 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-leaf/10 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l5 5L20 6" stroke="#1F8A5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-navy mb-2">Order sent</h1>
          <p className="text-ink/70 mb-6">
            The shop has received your order and will prepare it shortly.
          </p>
          <button
            onClick={() => setPlaced(false)}
            className="btn btn-primary w-full rounded-xl py-3"
          >
            Place another order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloth pb-28">
      <header className="bg-navy text-white sticky top-0 z-20 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Supreme Sanitary</h1>
            <p className="text-white/60 text-sm">Select what you need, then send your order</p>
          </div>
          <a
            href="/shop"
            className="text-xs text-white/50 border border-white/20 rounded-full px-3 py-1.5 whitespace-nowrap mt-0.5"
          >
            Shop login
          </a>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition"
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {connError && (
          <div className="bg-rust/10 text-rust rounded-lg px-4 py-3 mb-4 text-sm font-medium text-center">
            {connError}
          </div>
        )}

        {loading && (
          <div className="text-center py-10">
            <p className="text-ink/50 mb-2">Loading products...</p>
            {loadSlow && (
              <div className="mt-3">
                <p className="text-ink/40 text-sm mb-3">
                  Taking longer than usual. Check your internet connection.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary rounded-lg px-5 py-2 text-sm"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
        {!loading && sections.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-ink/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-ink/50">No products found.</p>
          </div>
        )}

        {sections.map(({ section, items }) => {
          const isOpen = isSearching || !!openSections[section];
          return (
            <section key={section} id={`section-${section}`} className="mb-3 scroll-mt-32">
              <button
                onClick={() => toggleSection(section)}
                className="btn w-full flex items-center justify-between bg-white rounded-xl border border-ink/10 px-4 py-4 mb-2"
              >
                <span className="text-navy font-semibold text-base flex items-center gap-2">
                  {section} <span className="bg-ink/5 text-ink/60 text-xs py-0.5 px-2 rounded-full">{items.length}</span>
                </span>
                <span className={`text-navy/50 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      showPrice={showPrice}
                      cart={cart}
                      onChange={updateCart}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 pb-safe">
          <div className="max-w-3xl mx-auto px-4 pb-4">
            <button
              onClick={() => setCartOpen(true)}
              className="btn btn-danger w-full rounded-xl py-4 flex items-center justify-between px-6"
            >
              <span>{totalItems} item{totalItems > 1 ? "s" : ""} selected</span>
              <span>View order →</span>
            </button>
          </div>
        </div>
      )}

      {cartOpen && (
        <CartDrawer
          items={cartItems}
          showPrice={showPrice}
          customerName={customerName}
          customerPhone={customerPhone}
          setCustomerName={setCustomerName}
          setCustomerPhone={setCustomerPhone}
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
          onPlaceOrder={placeOrder}
          placing={placing}
        />
      )}
    </div>
  );
}

function ProductCard({ product, showPrice, cart, onChange }) {
  const hasVariants = product.variants && product.variants.length > 0;
  const [variant, setVariant] = useState(hasVariants ? product.variants[0] : null);
  const key = cartKey(product.id, variant);
  const qty = cart[key]?.qty || 0;

  function setQty(newQty) {
    onChange(product, variant, newQty);
  }

  function changeVariant(newVariant) {
    if (qty > 0) onChange(product, variant, 0);
    setVariant(newVariant);
  }

  return (
    <div className="bg-white rounded-xl border border-ink/10 p-4 flex flex-col gap-3">
      <div>
        <p className="font-semibold text-ink leading-snug">{product.name}</p>
        <p className="text-xs text-ink/50 mt-0.5">
          {product.unit}
          {showPrice && product.price ? ` · ₹${product.price}` : ""}
        </p>
      </div>

      {hasVariants && (
        <select
          value={variant}
          onChange={(e) => changeVariant(e.target.value)}
          className="border border-ink/15 rounded-lg px-2.5 py-2 text-sm bg-cloth"
        >
          {product.variants.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center border border-ink/15 rounded-lg overflow-hidden h-10">
          <button
            onClick={() => setQty(Math.max(0, qty - 1))}
            className="btn w-10 h-full text-lg text-navy bg-cloth/30"
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={qty}
            onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-12 h-full text-center outline-none bg-transparent"
          />
          <button
            onClick={() => setQty(qty + 1)}
            className="btn w-10 h-full text-lg text-navy bg-cloth/30"
          >
            +
          </button>
        </div>
        {qty > 0 && (
          <span className="text-xs font-semibold text-leaf bg-leaf/10 rounded-md px-2 py-1">
            Added
          </span>
        )}
      </div>
    </div>
  );
}

function CartDrawer({
  items, showPrice, customerName, customerPhone,
  setCustomerName, setCustomerPhone, onRemove, onClose, onPlaceOrder, placing,
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl max-h-[85vh] flex flex-col border border-ink/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h2 className="font-bold text-navy text-lg">Your order</h2>
          <button onClick={onClose} className="btn btn-ghost text-ink/50 text-2xl leading-none px-2">×</button>
        </div>

        <div className="overflow-y-auto px-5 py-3 flex-1">
          {items.length === 0 && <p className="text-ink/50 py-6 text-center">No items yet.</p>}
          {items.map((c) => {
            const key = cartKey(c.product.id, c.variant);
            return (
              <div key={key} className="flex items-center justify-between py-2.5 border-b border-ink/5">
                <div>
                  <p className="font-medium text-ink text-sm">
                    {c.product.name}{c.variant ? ` — ${c.variant}` : ""}
                  </p>
                  <p className="text-xs text-ink/50">
                    {c.qty} {c.product.unit}
                    {showPrice && c.product.price ? ` · ₹${c.product.price * c.qty}` : ""}
                  </p>
                </div>
                <button onClick={() => onRemove(key)} className="btn btn-ghost text-rust text-sm px-2">
                  Remove
                </button>
              </div>
            );
          })}

          <div className="mt-4 space-y-3">
            <div>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name (required)"
                required
                className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
              />
            </div>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone number (optional)"
              type="tel"
              inputMode="tel"
              className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
            />
          </div>
        </div>

        <div className="p-5 border-t border-ink/10 pb-safe">
          <button
            onClick={onPlaceOrder}
            disabled={items.length === 0 || placing || !customerName.trim()}
            className="btn btn-primary w-full disabled:opacity-40 rounded-xl py-3.5"
          >
            {placing ? "Sending..." : "Place order"}
          </button>
          {!customerName.trim() && (
            <p className="text-xs text-rust text-center mt-2">Enter your name to place the order</p>
          )}
        </div>
      </div>
    </div>
  );
}
