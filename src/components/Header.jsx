import React from 'react';
import { 
  Search, 
  MapPin, 
  Bell, 
  ShoppingCart, 
  ChevronDown, 
  Sparkles,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { MOCK_COMPANY } from '../data/mockData';

export function Header({ activeTab, cartCount, onOpenCart }) {
  const budgetPercentage = Math.round((MOCK_COMPANY.monthlySpent / MOCK_COMPANY.monthlyBudget) * 100);
  const remainingBudget = MOCK_COMPANY.monthlyBudget - MOCK_COMPANY.monthlySpent;

  return (
    <header style={styles.header}>
      {/* Search Bar */}
      <div style={styles.searchWrapper}>
        <Search size={18} style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search products, purchase orders, vendors, or GL codes..." 
          style={styles.searchInput}
        />
        <span style={styles.shortcutKey}>⌘ K</span>
      </div>

      {/* Center Stats: Budget Indicator */}
      <div style={styles.budgetWidget}>
        <div style={styles.budgetText}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Monthly Spend Limit</span>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            ${MOCK_COMPANY.monthlySpent.toLocaleString()} <span style={{ color: 'var(--text-muted)' }}>/ ${MOCK_COMPANY.monthlyBudget.toLocaleString()}</span>
          </span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressBar, width: `${budgetPercentage}%` }} />
        </div>
        <span style={styles.budgetBadge}>
          <TrendingDown size={12} /> ${remainingBudget.toLocaleString()} left
        </span>
      </div>

      {/* Right Controls */}
      <div style={styles.rightGroup}>
        {/* Location Switcher */}
        <div style={styles.locationTag}>
          <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span>{MOCK_COMPANY.currentLocation}</span>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Notifications */}
        <button style={styles.iconBtn} title="Notifications">
          <Bell size={18} />
          <span style={styles.notifDot} />
        </button>

        {/* Quick Cart */}
        <button style={styles.cartBtn} onClick={onOpenCart}>
          <ShoppingCart size={18} />
          <span>Requisition</span>
          {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
        </button>

        {/* User Profile */}
        <div style={styles.profileBox}>
          <div style={styles.avatar}>
            <ShieldCheck size={18} color="#6366f1" />
          </div>
          <div style={styles.profileText}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Alex Chen</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>VP Procurement</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: 4 }} />
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.9rem 2rem',
    background: 'rgba(18, 26, 43, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-color)',
    sticky: 'top',
    zIndex: 40,
    gap: '1.5rem'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '380px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)'
  },
  searchInput: {
    width: '100%',
    padding: '0.55rem 3.2rem 0.55rem 2.4rem',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    outline: 'none'
  },
  shortcutKey: {
    position: 'absolute',
    right: '10px',
    fontSize: '0.7rem',
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '2px 6px',
    borderRadius: '4px',
    color: 'var(--text-muted)'
  },
  budgetWidget: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(99, 102, 241, 0.06)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    padding: '0.45rem 1rem',
    borderRadius: 'var(--radius-md)'
  },
  budgetText: {
    display: 'flex',
    flexDirection: 'column'
  },
  progressTrack: {
    width: '110px',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--primary-indigo), var(--accent-cyan))',
    borderRadius: '3px'
  },
  budgetBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#34d399',
    background: 'rgba(16, 185, 129, 0.15)',
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  locationTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-main)',
    background: 'var(--bg-input)',
    padding: '0.45rem 0.8rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer'
  },
  iconBtn: {
    position: 'relative',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  notifDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '7px',
    height: '7px',
    background: 'var(--accent-rose)',
    borderRadius: '50%'
  },
  cartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, var(--primary-indigo) 0%, #4338ca 100%)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    position: 'relative'
  },
  cartBadge: {
    background: 'var(--accent-rose)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.35rem 0.6rem',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.03)'
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(99, 102, 241, 0.3)'
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column'
  }
};
