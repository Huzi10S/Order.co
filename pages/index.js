import { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { COLLECTIONS } from "../lib/collections";
import { useProducts } from "../lib/useProducts";
import { useSettings } from "../lib/useSettings";
import { CategorySkeleton } from "../components/Skeleton";

function cartKey(productId, variant) {
  return variant ? `${productId}::${variant}` : productId;
}

export default function CustomerPage() {
  const { products, loading, error: connError } = useProducts();
  const { showPrice, settings, categories } = useSettings();
  const [cart, setCart] = useState({}); // key -> { product, variant, qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState({});
  const [loadSlow, setLoadSlow] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const lastOrderTime = useRef(0);

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
      : categories.filter((s) => bySection[s]);
    for (const s of Object.keys(bySection)) {
      if (!order.includes(s)) order.push(s);
    }
    return order.map((s) => ({ section: s, items: bySection[s] }));
  }, [products, search, categories]);

  const isSearching = search.trim().length > 0;

  function toggleSection(section) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  const cartItems = Object.values(cart)
    .map(c => {
      const liveProd = products.find(p => p.id === c.product.id) || c.product;
      return { ...c, product: liveProd };
    })
    .filter(c => c.product.inStock !== false);
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
    // Honeypot: if the hidden field is filled, silently "succeed" without writing
    if (honeypot) {
      setPlaced(true);
      setCart({});
      return;
    }
    // Cooldown: 30 seconds between orders
    const now = Date.now();
    const elapsed = now - lastOrderTime.current;
    if (elapsed < 30000) {
      const wait = Math.ceil((30000 - elapsed) / 1000);
      alert(`Please wait ${wait} seconds before placing another order.`);
      return;
    }
    setPlacing(true);
    try {
      await addDoc(collection(db, COLLECTIONS.orders), {
        customerName: customerName.trim().slice(0, 100),
        customerPhone: customerPhone.trim().slice(0, 20) || "",
        status: "pending",
        createdAt: serverTimestamp(),
        items: cartItems.slice(0, 50).map((c) => ({
          productId: c.product.id,
          name: c.product.name,
          variant: c.variant || null,
          unit: c.product.unit || "pcs",
          qty: Math.max(1, Math.min(Number(c.qty) || 1, 99999)),
          price: c.product.price || null,
        })),
      });
      lastOrderTime.current = Date.now();
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
        <div className="max-w-3xl mx-auto px-4 py-3 md:py-4 flex flex-col gap-4">
          
          {/* Top Row: Title, Tagline & Login */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm mb-0.5">
                {settings?.shopName || "Supreme Sanitary"}
              </h1>
              <p className="text-white/60 text-[11px] sm:text-xs leading-snug max-w-[280px] sm:max-w-xl">
                Sanitary Pipes · Plumbing Pipes · Fittings · Chamber Covers · Garden & Suction Hose · Water Tanks & Bathroom Accessories
              </p>
            </div>
            <a
              href="/shop"
              className="text-xs text-white/50 border border-white/20 hover:text-white hover:border-white/50 transition rounded-full px-3 py-1.5 whitespace-nowrap shrink-0 mt-0.5 md:mt-1"
            >
              Shop login
            </a>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            
            {/* Address */}
            <div className="flex items-start gap-2.5 text-white/70">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span className="text-[11px] sm:text-xs leading-snug max-w-sm">
                {settings?.address || "Shop No.1, Happy Apartment, Rajiv Gandhi Civic Centre, Near Lokendra Talkies, New Road, Ratlam (457001) M.P."}
              </span>
            </div>

            {/* Phone Numbers */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-5 shrink-0 text-[13px] sm:text-sm text-white/90">
              {(() => {
                const pString = settings?.phone || "+91 8770341266 (WhatsApp), +91 9111293990";
                const names = (settings?.ownerName || "Murtaza Haveliwala / Mustafa Haveliwala").split("/");
                const name1 = names[0]?.trim().split(" ")[0] || "Murtaza";
                const name2 = names[1]?.trim().split(" ")[0] || "Mustafa";
                
                const nums = pString.replace(/\s+/g, '').match(/\+?\d{10,13}/g) || ["+918770341266", "+919111293990"];
                const n1 = nums[0];
                const n2 = nums[1] || nums[0];
                
                return (
                  <>
                    <a href={`https://wa.me/${n1.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white transition group">
                      <svg className="w-4 h-4 text-[#25D366] shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <span className="tracking-wide font-medium">{name1}: {n1}</span>
                    </a>
                    <a href={`tel:${n2}`} className="flex items-center gap-2.5 hover:text-white transition group">
                      <svg className="w-4 h-4 text-white/50 shrink-0 group-hover:text-white group-hover:scale-110 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      <span className="tracking-wide font-medium">{name2}: {n2}</span>
                    </a>
                  </>
                );
              })()}
            </div>
          </div>
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
          <div className="space-y-3">
            <CategorySkeleton />
            <CategorySkeleton />
            <CategorySkeleton />
            {loadSlow && (
              <div className="mt-3 text-center">
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
          honeypot={honeypot}
          setHoneypot={setHoneypot}
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
  const outOfStock = product.inStock === false;

  function setQty(newQty) {
    if (outOfStock) return;
    onChange(product, variant, newQty);
  }

  function changeVariant(newVariant) {
    if (qty > 0) onChange(product, variant, 0);
    setVariant(newVariant);
  }

  return (
    <div className={`bg-white rounded-xl border border-ink/10 p-4 flex flex-col gap-3 transition-opacity ${outOfStock ? 'opacity-70' : ''}`}>
      <div>
        <p className="font-semibold text-ink leading-snug">
          {product.name}
          {outOfStock && (
            <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rust/10 text-rust uppercase tracking-wide align-middle">
              Out of stock
            </span>
          )}
        </p>
        <p className="text-xs text-ink/50 mt-0.5">
          {product.unit}
          {showPrice && product.price ? ` · ₹${Number(product.price).toLocaleString('en-IN')}` : ""}
        </p>
      </div>

      {hasVariants && (
        <select
          value={variant}
          onChange={(e) => changeVariant(e.target.value)}
          disabled={outOfStock}
          className="border border-ink/15 rounded-lg px-2.5 py-2 text-sm bg-cloth disabled:opacity-50"
        >
          {product.variants.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto">
        {outOfStock ? (
          <div className="text-sm font-semibold text-rust mt-1">Currently unavailable</div>
        ) : (
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
        )}
        {qty > 0 && !outOfStock && (
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
  setCustomerName, setCustomerPhone, honeypot, setHoneypot,
  onRemove, onClose, onPlaceOrder, placing,
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
                    {showPrice && c.product.price ? ` · ₹${Number(c.product.price * c.qty).toLocaleString('en-IN')}` : ""}
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
                maxLength={100}
                className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
              />
            </div>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone number (optional)"
              type="tel"
              inputMode="tel"
              maxLength={20}
              className="w-full border border-ink/15 rounded-lg px-4 py-3 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition"
            />
            {/* Honeypot field — hidden from real users, filled by bots */}
            <input
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0 }}
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
