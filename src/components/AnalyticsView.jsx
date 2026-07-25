import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Download, 
  Building2, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';
import { MOCK_COMPANY, MOCK_DEPARTMENTS } from '../data/mockData';

export function AnalyticsView() {
  const totalAllocated = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.allocated, 0);
  const totalSpent = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.spent, 0);

  const topVendors = [
    { name: 'CDW Direct', spend: 64200, percentage: 39, category: 'IT Hardware' },
    { name: 'Amazon Business', spend: 38400, percentage: 23, category: 'General Supplies' },
    { name: 'AWS Cloud Services', spend: 25000, percentage: 15, category: 'Infrastructure' },
    { name: 'Design Within Reach', spend: 18500, percentage: 11, category: 'Furniture' },
    { name: 'Staples Advantage', spend: 12000, percentage: 7, category: 'Office Supplies' },
    { name: 'Uline Commercial', spend: 6180, percentage: 5, category: 'Packaging' }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Spend Analytics & Executive Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive reporting on multi-department spend, vendor concentration, and AI contract savings.
          </p>
        </div>
        <button className="btn btn-secondary">
          <Download size={16} /> Export Spend Report (CSV)
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Allocated Budget</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0.4rem 0' }}>
            ${totalAllocated.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#34d399' }}>Across 5 active departments</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Actual YTD Spend</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0.4rem 0' }}>
            ${totalSpent.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>64.7% of total budget limit</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>AI Contract Savings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', margin: '0.4rem 0' }}>
            ${MOCK_COMPANY.aiSavingsYTD.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated tier discounts</div>
        </div>
      </div>

      {/* Grid: Vendor Concentration + Department Comparison */}
      <div className="grid-2">
        {/* Vendor Concentration List */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top Vendor Spend Concentration</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spend distribution across major suppliers</p>
            </div>
            <PieChart size={20} color="var(--primary-indigo)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topVendors.map(v => (
              <div key={v.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{v.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({v.category})</span></span>
                  <span style={{ fontWeight: 700 }}>${v.spend.toLocaleString()} ({v.percentage}%)</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${v.percentage * 2}%`, background: 'linear-gradient(90deg, var(--primary-indigo), var(--accent-cyan))' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Detailed Spend Table */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Department Budget vs Actual</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Detailed breakdown by cost center</p>
            </div>
            <BarChart3 size={20} color="#34d399" />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Allocated</th>
                <th style={styles.th}>Spent</th>
                <th style={styles.th}>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DEPARTMENTS.map(d => {
                const rem = d.allocated - d.spent;
                return (
                  <tr key={d.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{d.name}</td>
                    <td style={styles.td}>${d.allocated.toLocaleString()}</td>
                    <td style={{ ...styles.td, fontWeight: 700 }}>${d.spent.toLocaleString()}</td>
                    <td style={{ ...styles.td, color: '#34d399', fontWeight: 700 }}>${rem.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
  th: { padding: '0.75rem 0.85rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' },
  td: { padding: '0.85rem 0.85rem', fontSize: '0.88rem' }
};
