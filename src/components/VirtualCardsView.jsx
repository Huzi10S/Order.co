import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2, 
  CheckCircle2, 
  TrendingUp,
  RefreshCw,
  X
} from 'lucide-react';
import { MOCK_VIRTUAL_CARDS, MOCK_DEPARTMENTS } from '../data/mockData';

export function VirtualCardsView() {
  const [cards, setCards] = useState(MOCK_VIRTUAL_CARDS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCvvId, setShowCvvId] = useState(null);

  // New card form state
  const [vendorName, setVendorName] = useState('');
  const [cardName, setCardName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [cardType, setCardType] = useState('Merchant Locked');
  const [department, setDepartment] = useState('Engineering & IT');

  const handleCreateCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: `VC-${Date.now().toString().slice(-3)}`,
      vendorName,
      cardName: cardName || `${vendorName} Spend Card`,
      cardNumber: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expDate: '08/28',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      monthlyLimit: Number(monthlyLimit),
      spentThisMonth: 0,
      status: 'Active',
      cardType,
      department,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setCards([newCard, ...cards]);
    setShowCreateModal(false);

    // Reset form
    setVendorName('');
    setCardName('');
    setMonthlyLimit(5000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Vendor Virtual Cards & Spend Controls</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Issue merchant-locked or single-use virtual corporate cards with automated line-item reconciliation.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Issue Virtual Card
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid-3">
        {cards.map(card => {
          const spentPct = Math.round((card.spentThisMonth / card.monthlyLimit) * 100);
          const isShowingCvv = showCvvId === card.id;

          return (
            <div key={card.id} className="glass-card" style={styles.virtualCardWrapper}>
              {/* Card Surface Visual */}
              <div style={{
                ...styles.cardSurface,
                background: card.cardType === 'Single Use' 
                  ? 'linear-gradient(135deg, #334155 0%, #0f172a 100%)' 
                  : 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)'
              }}>
                <div style={styles.cardHeader}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>
                      {card.vendorName}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{card.cardName}</div>
                  </div>
                  <span className={card.status === 'Active' ? 'badge badge-emerald' : 'badge badge-rose'}>
                    {card.status}
                  </span>
                </div>

                <div style={styles.chipRow}>
                  <div style={styles.cardChip} />
                  <span style={styles.cardTypeBadge}>
                    <Lock size={10} /> {card.cardType}
                  </span>
                </div>

                <div style={styles.cardNumber}>{card.cardNumber}</div>

                <div style={styles.cardFooterRow}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)' }}>EXP DATE</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{card.expDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)' }}>CVV</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isShowingCvv ? card.cvv : '•••'}
                      <button 
                        style={styles.eyeBtn} 
                        onClick={() => setShowCvvId(isShowingCvv ? null : card.id)}
                      >
                        {isShowingCvv ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)' }}>VISA CORPORATE</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Order.co</div>
                  </div>
                </div>
              </div>

              {/* Spend Control & Progress Bar */}
              <div style={styles.cardControls}>
                <div style={styles.limitInfo}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Spend</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    ${card.spentThisMonth.toLocaleString()} / <strong style={{ color: 'var(--text-main)' }}>${card.monthlyLimit.toLocaleString()}</strong>
                  </span>
                </div>

                <div style={styles.progressTrack}>
                  <div style={{
                    ...styles.progressBar,
                    width: `${spentPct}%`,
                    background: spentPct > 85 ? 'var(--accent-amber)' : 'linear-gradient(90deg, var(--primary-indigo), var(--accent-cyan))'
                  }} />
                </div>

                <div style={styles.cardDetailsRow}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Dept: {card.department}</span>
                  <button className="btn btn-secondary btn-sm">
                    <RefreshCw size={12} /> Adjust Limit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Virtual Card Modal Form */}
      {showCreateModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--primary-indigo)" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Issue Vendor Virtual Card</h2>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateCard} style={styles.formBody}>
              <div>
                <label style={styles.label}>Target Vendor Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. AWS, CDW, Google Ads, Staples" 
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={styles.label}>Card Nickname</label>
                <input 
                  type="text" 
                  placeholder="e.g. Q3 Marketing Campaign Card" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={styles.label}>Monthly Spend Limit ($)</label>
                  <input 
                    type="number" 
                    required
                    min="100"
                    step="100"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={styles.label}>Card Authorization Type</label>
                  <select 
                    value={cardType} 
                    onChange={(e) => setCardType(e.target.value)}
                    className="input-field"
                  >
                    <option value="Merchant Locked">Merchant Locked</option>
                    <option value="Single Use">Single Use (One Transaction)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={styles.label}>Department Allocation</label>
                <select 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-field"
                >
                  {MOCK_DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Issue Card Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column' },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  },
  virtualCardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.25rem'
  },
  cardSurface: {
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '190px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  chipRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0.5rem 0'
  },
  cardChip: {
    width: '32px',
    height: '24px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  cardTypeBadge: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  cardNumber: {
    fontFamily: 'monospace',
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#fff',
    margin: '0.4rem 0'
  },
  cardFooterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  eyeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    padding: 0
  },
  cardControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  limitInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  progressTrack: {
    height: '6px',
    background: 'var(--bg-input)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: '3px'
  },
  cardDetailsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.2rem'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(6px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    width: '480px',
    background: 'var(--bg-card-solid)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  modalHeader: {
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
  formBody: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.35rem'
  }
};
