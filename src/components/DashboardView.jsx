import React from 'react';
import { 
  DollarSign, 
  Sparkles, 
  Clock, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { 
  MOCK_COMPANY, 
  MOCK_DEPARTMENTS, 
  MOCK_APPROVALS, 
  MOCK_PURCHASE_ORDERS,
  MOCK_AI_INSIGHTS 
} from '../data/mockData';

export function DashboardView({ onNavigate, onOpenCart }) {
  const activePOs = MOCK_PURCHASE_ORDERS.filter(po => po.status === 'In Transit');

  return (
    <div style={styles.container}>
      {/* Top Welcome Banner */}
      <div style={styles.heroBanner}>
        <div>
          <div style={styles.heroTitleRow}>
            <h1 style={styles.heroTitle}>Spend & Procurement Overview</h1>
            <span style={styles.liveBadge}>
              <span className="pulse-dot" /> Live System Action
            </span>
          </div>
          <p style={styles.heroSub}>
            Centralized purchasing control, automated 3-way invoice matching, and AI cost optimization across all 42 vendors.
          </p>
        </div>
        <div style={styles.heroActionGroup}>
          <button className="btn btn-secondary" onClick={() => onNavigate('cards')}>
            Issue Virtual Card
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>
            <Plus size={16} /> New Requisition
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Monthly Total Spend</span>
            <div style={{ ...styles.iconBox, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={styles.metricValue}>${MOCK_COMPANY.monthlySpent.toLocaleString()}</div>
          <div style={styles.metricSub}>
            <span style={{ color: '#34d399', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
              <TrendingUp size={14} style={{ marginRight: 4 }} /> 65.7%
            </span> of $250k budget used
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>AI Sourcing Savings YTD</span>
            <div style={{ ...styles.iconBox, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div style={styles.metricValue}>${MOCK_COMPANY.aiSavingsYTD.toLocaleString()}</div>
          <div style={styles.metricSub}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>14.2% cost reduction</span> vs vendor list price
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard} onClick={() => onNavigate('approvals')}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Pending Approvals</span>
            <div style={{ ...styles.iconBox, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={styles.metricValue}>{MOCK_APPROVALS.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>orders</span></div>
          <div style={styles.metricSub}>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Requires action</span> from Department Leads
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard} onClick={() => onNavigate('pos')}>
          <div style={styles.metricHeader}>
            <span style={styles.metricLabel}>Active Orders in Transit</span>
            <div style={{ ...styles.iconBox, background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={styles.metricValue}>{activePOs.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>shipments</span></div>
          <div style={styles.metricSub}>
            <span style={{ color: '#22d3ee', fontWeight: 600 }}>UPS Ground</span> • Delivery expected in 2 days
          </div>
        </div>
      </div>

      {/* Main Grid Section: Department Budget + AI Sourcing Feed */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {/* Left Column: Department Budget Progress (2 spans wide) */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Department Spend Allocation</h3>
              <p style={styles.sectionSub}>Budget limit utilization across company departments</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('analytics')}>
              Full Report <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={styles.deptList}>
            {MOCK_DEPARTMENTS.map(dept => {
              const pct = Math.round((dept.spent / dept.allocated) * 100);
              return (
                <div key={dept.id} style={styles.deptItem}>
                  <div style={styles.deptInfo}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dept.name}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      ${dept.spent.toLocaleString()} / <strong style={{ color: 'var(--text-main)' }}>${dept.allocated.toLocaleString()}</strong> ({pct}%)
                    </span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div style={{
                      ...styles.progressBar,
                      width: `${pct}%`,
                      background: dept.color
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Insights & Automation Notifications */}
        <div className="glass-card">
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="#818cf8" />
              <h3 style={styles.sectionTitle}>Order.co AI Action Feed</h3>
            </div>
          </div>

          <div style={styles.aiFeed}>
            {MOCK_AI_INSIGHTS.map(insight => (
              <div key={insight.id} style={styles.insightCard}>
                <div style={styles.insightTop}>
                  <span style={styles.insightTitle}>{insight.title}</span>
                  <span className="badge badge-indigo">{insight.badge}</span>
                </div>
                <p style={styles.insightDesc}>{insight.description}</p>
                <span style={styles.insightTime}>{insight.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Purchase Orders Stream */}
      <div className="glass-card">
        <div style={styles.sectionHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Recent Purchase Orders</h3>
            <p style={styles.sectionSub}>Real-time fulfillment and shipping status updates</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('pos')}>
            View All Orders <ChevronRight size={14} />
          </button>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PO Number</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Tracking / Carrier</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PURCHASE_ORDERS.map(po => (
                <tr key={po.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: 700, color: 'var(--primary-indigo)' }}>{po.id}</td>
                  <td style={styles.td}>{po.vendor}</td>
                  <td style={styles.td}>{po.department}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>${po.total.toLocaleString()}</td>
                  <td style={styles.td}>
                    {po.status === 'In Transit' && <span className="badge badge-cyan">In Transit</span>}
                    {po.status === 'Delivered' && <span className="badge badge-emerald">Delivered</span>}
                    {po.status === 'Invoiced' && <span className="badge badge-indigo">Invoiced</span>}
                  </td>
                  <td style={{ ...styles.td, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {po.trackingNumber}
                  </td>
                  <td style={styles.td}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('pos')}>
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  heroBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, rgba(18, 26, 43, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.75rem 2rem',
    marginBottom: '2rem',
    gap: '2rem'
  },
  heroTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.4rem'
  },
  heroTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#fff'
  },
  liveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  heroSub: {
    color: 'var(--text-muted)',
    fontSize: '0.92rem',
    maxWidth: '750px',
    lineHeight: 1.5
  },
  heroActionGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  metricCard: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem'
  },
  metricLabel: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-muted)'
  },
  iconBox: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricValue: {
    fontSize: '1.85rem',
    fontWeight: 800,
    color: '#fff',
    fontFamily: 'var(--font-heading)',
    marginBottom: '0.5rem'
  },
  metricSub: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff'
  },
  sectionSub: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  deptList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem'
  },
  deptItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  deptInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  progressTrack: {
    height: '8px',
    background: 'var(--bg-input)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  aiFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  insightCard: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.85rem'
  },
  insightTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.35rem'
  },
  insightTitle: {
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#fff'
  },
  insightDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    marginBottom: '0.4rem'
  },
  insightTime: {
    fontSize: '0.7rem',
    color: 'var(--text-subtle)'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '0.75rem 1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border-color)'
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  td: {
    padding: '0.85rem 1rem',
    fontSize: '0.88rem'
  }
};
