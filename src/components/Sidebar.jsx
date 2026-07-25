import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CheckSquare, 
  Package, 
  Receipt, 
  CreditCard, 
  BarChart3, 
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';
import { MOCK_APPROVALS, MOCK_PURCHASE_ORDERS } from '../data/mockData';

export function Sidebar({ activeTab, setActiveTab }) {
  const pendingApprovalsCount = MOCK_APPROVALS.length;
  const activePOsCount = MOCK_PURCHASE_ORDERS.filter(po => po.status === 'In Transit').length;

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Central Catalog', icon: ShoppingBag },
    { id: 'approvals', label: 'Approval Queue', icon: CheckSquare, badge: pendingApprovalsCount, badgeColor: 'var(--accent-amber)' },
    { id: 'pos', label: 'Purchase Orders', icon: Package, badge: activePOsCount, badgeColor: 'var(--accent-cyan)' },
    { id: 'invoices', label: 'AP 3-Way Matching', icon: Receipt },
    { id: 'cards', label: 'Virtual Cards', icon: CreditCard },
    { id: 'analytics', label: 'Spend Analytics', icon: BarChart3 }
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Logo Header */}
      <div style={styles.brandHeader}>
        <div style={styles.logoBadge}>
          <Building2 size={20} color="#fff" />
        </div>
        <div style={styles.brandText}>
          <div style={styles.brandTitle}>Order.co</div>
          <div style={styles.brandSub}>Enterprise Procurement</div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav style={styles.nav}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navBtn,
                ...(isActive ? styles.activeNavBtn : {})
              }}
            >
              <Icon size={19} style={{ color: isActive ? 'var(--primary-indigo)' : 'var(--text-muted)' }} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{ ...styles.badge, background: item.badgeColor || 'var(--primary-indigo)' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Order.co AI Feature Card */}
      <div style={styles.aiWidget}>
        <div style={styles.aiHeader}>
          <Sparkles size={16} color="#818cf8" />
          <span style={styles.aiTitle}>Order.co AI</span>
        </div>
        <p style={styles.aiDesc}>
          AI agents automatically sourcing out-of-stock items & matching vendor invoices.
        </p>
        <div style={styles.aiStat}>
          <Zap size={14} color="#10b981" />
          <span>$34,850 saved YTD</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    background: 'rgba(12, 18, 30, 0.95)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem 1rem',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0.5rem 1.25rem 0.5rem',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '1rem'
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--primary-indigo) 0%, #4338ca 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandTitle: {
    fontFamily: 'var(--font-heading)',
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#fff',
    letterSpacing: '-0.03em'
  },
  brandSub: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: 500
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flex: 1
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  },
  activeNavBtn: {
    background: 'rgba(99, 102, 241, 0.12)',
    color: '#fff',
    fontWeight: 600,
    border: '1px solid rgba(99, 102, 241, 0.25)'
  },
  badge: {
    color: '#000',
    fontWeight: 700,
    fontSize: '0.7rem',
    padding: '2px 7px',
    borderRadius: 'var(--radius-full)'
  },
  aiWidget: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: 'auto'
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  aiTitle: {
    fontWeight: 700,
    fontSize: '0.85rem',
    color: '#fff'
  },
  aiDesc: {
    fontSize: '0.74rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4
  },
  aiStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#34d399',
    marginTop: '0.2rem'
  }
};
