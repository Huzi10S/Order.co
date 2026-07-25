import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  CheckCircle2,
  Building2,
  Tag
} from 'lucide-react';
import { MOCK_CATALOG, MOCK_DEPARTMENTS } from '../data/mockData';

export function CatalogView({ cart, setCart, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('eng');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [orderSubmittedAlert, setOrderSubmittedAlert] = useState(false);

  const categories = ['All', 'IT Hardware', 'Office Furniture', 'Peripherals', 'Breakroom Supplies', 'Packaging & Warehouse'];
  const vendors = ['All', 'CDW Direct', 'Amazon Business', 'Staples Advantage', 'Design Within Reach', 'Uline Commercial'];

  const filteredProducts = MOCK_CATALOG.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prod.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesVendor = selectedVendor === 'All' || prod.vendor === selectedVendor;
    return matchesSearch && matchesCategory && matchesVendor;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setShowCartDrawer(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalSavings = cart.reduce((sum, item) => sum + (item.savings * item.qty), 0);

  const currentDeptObj = MOCK_DEPARTMENTS.find(d => d.id === selectedDepartment) || MOCK_DEPARTMENTS[0];
  const deptRemaining = currentDeptObj.allocated - currentDeptObj.spent;
  const isOverDeptBudget = cartTotal > deptRemaining;

  const handleSubmitRequisition = () => {
    setOrderSubmittedAlert(true);
    setCart([]);
    setShowCartDrawer(false);
    setTimeout(() => setOrderSubmittedAlert(false), 5000);
  };

  return (
    <div style={styles.container}>
      {/* Alert Banner on Requisition Submission */}
      {orderSubmittedAlert && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={20} color="#34d399" />
          <div style={{ flex: 1 }}>
            <strong>Requisition Successfully Submitted!</strong> Order sent to Approval Queue for {currentDeptObj.name}.
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('approvals')}>
            View in Approvals <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Centralized Vendor Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Pre-approved e-commerce products from contracted enterprise suppliers with volume pricing discounts.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCartDrawer(!showCartDrawer)}>
          <ShoppingCart size={18} />
          <span>Requisition Basket ({cart.reduce((a, b) => a + b.qty, 0)})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by product name, SKU code, or vendor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Vendor Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vendor:</span>
            <select 
              value={selectedVendor} 
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="input-field"
              style={{ width: '180px', padding: '0.55rem 0.8rem' }}
            >
              {vendors.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                background: selectedCategory === cat ? 'var(--primary-indigo)' : 'var(--bg-input)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid-3">
        {filteredProducts.map(product => {
          const inCart = cart.find(c => c.id === product.id);
          return (
            <div key={product.id} className="glass-card" style={styles.productCard}>
              <div style={styles.imgWrapper}>
                <img src={product.image} alt={product.name} style={styles.productImg} />
                <span style={styles.vendorBadge}>
                  <Building2 size={12} /> {product.vendor}
                </span>
                {product.savings > 0 && (
                  <span style={styles.savingsBadge}>
                    <Sparkles size={12} /> Save ${product.savings.toFixed(2)}
                  </span>
                )}
              </div>

              <div style={styles.cardContent}>
                <div style={styles.categoryRow}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>SKU: {product.sku}</span>
                </div>

                <h3 style={styles.productTitle}>{product.name}</h3>
                <p style={styles.productDesc}>{product.description}</p>

                <div style={styles.glRow}>
                  <Tag size={12} color="var(--primary-indigo)" />
                  <span>{product.glCode}</span>
                </div>

                <div style={styles.priceRow}>
                  <div>
                    <div style={styles.priceValue}>${product.price.toFixed(2)}</div>
                    {product.originalPrice > product.price && (
                      <div style={styles.strikePrice}>${product.originalPrice.toFixed(2)}</div>
                    )}
                  </div>
                  <button 
                    className={`btn ${inCart ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => addToCart(product)}
                  >
                    {inCart ? (
                      <>
                        <Check size={16} /> Added ({inCart.qty})
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> Add to Requisition
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requisition Basket Drawer Side Modal */}
      {showCartDrawer && (
        <div style={styles.drawerOverlay} onClick={() => setShowCartDrawer(false)}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} color="var(--primary-indigo)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Requisition Basket</h2>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowCartDrawer(false)}>×</button>
            </div>

            {/* Department Selection */}
            <div style={styles.deptSelectorBox}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Allocate to Department:
              </label>
              <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="input-field"
                style={{ marginTop: '0.35rem' }}
              >
                {MOCK_DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} (${(d.allocated - d.spent).toLocaleString()} budget left)
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div style={styles.drawerBody}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>Your requisition basket is empty.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Add items from the catalog above to build an order.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <img src={item.image} alt={item.name} style={styles.cartItemImg} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.vendor} • ${item.price.toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button style={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}><Minus size={12} /></button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.qty}</span>
                      <button style={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}><Plus size={12} /></button>
                      <button style={styles.removeBtn} onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Summary */}
            {cart.length > 0 && (
              <div style={styles.drawerFooter}>
                {totalSavings > 0 && (
                  <div style={styles.savingsNotice}>
                    <Sparkles size={14} color="#34d399" />
                    <span>Order.co contract discounts save <strong>${totalSavings.toFixed(2)}</strong></span>
                  </div>
                )}

                {isOverDeptBudget && (
                  <div style={styles.warningNotice}>
                    <ShieldAlert size={16} color="#f43f5e" />
                    <span>Warning: Total exceeds department remaining balance. Will trigger Director Review.</span>
                  </div>
                )}

                <div style={styles.totalRow}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Requisition Amount:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>${cartTotal.toFixed(2)}</span>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} onClick={handleSubmitRequisition}>
                  Submit for Approval <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column' },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
    color: '#fff',
    fontSize: '0.9rem'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 0
  },
  imgWrapper: {
    position: 'relative',
    height: '180px',
    width: '100%',
    overflow: 'hidden',
    background: '#0f172a'
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  vendorBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(8px)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  savingsBadge: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'rgba(16, 185, 129, 0.9)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  cardContent: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.4rem'
  },
  productTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.35,
    marginBottom: '0.5rem'
  },
  productDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    marginBottom: '0.85rem'
  },
  glRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.74rem',
    color: '#818cf8',
    background: 'rgba(99, 102, 241, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    width: 'fit-content',
    marginBottom: '1rem'
  },
  priceRow: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border-color)'
  },
  priceValue: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#fff',
    fontFamily: 'var(--font-heading)'
  },
  strikePrice: {
    fontSize: '0.75rem',
    color: 'var(--text-subtle)',
    textDecoration: 'line-through'
  },
  drawerOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(6px)',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  drawer: {
    width: '440px',
    background: 'var(--bg-card-solid)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-md)'
  },
  drawerHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  deptSelectorBox: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(255, 255, 255, 0.02)'
  },
  drawerBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    background: 'var(--bg-input)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)'
  },
  cartItemImg: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    objectFit: 'cover'
  },
  qtyBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#fff',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-rose)',
    cursor: 'pointer',
    marginLeft: '0.4rem'
  },
  drawerFooter: {
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid var(--border-color)',
    background: 'rgba(12, 18, 30, 0.95)'
  },
  savingsNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#34d399',
    background: 'rgba(16, 185, 129, 0.12)',
    padding: '0.5rem 0.8rem',
    borderRadius: '6px',
    marginBottom: '0.75rem'
  },
  warningNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#fb7185',
    background: 'rgba(244, 63, 94, 0.12)',
    padding: '0.5rem 0.8rem',
    borderRadius: '6px',
    marginBottom: '0.75rem'
  },
  totalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  }
};
