import React, { useState } from 'react';
import { 
  Receipt, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileSpreadsheet, 
  ArrowRight, 
  Building2, 
  Clock,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { MOCK_INVOICES } from '../data/mockData';

export function InvoicesView() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState(MOCK_INVOICES[0]);
  const [paymentApprovedToast, setPaymentApprovedToast] = useState(null);

  const handleApprovePayment = (invId) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invId) {
        return { ...inv, matchStatus: 'Paid & Reconciled', confidenceScore: 100, discrepancy: null };
      }
      return inv;
    }));
    setPaymentApprovedToast(`Invoice ${invId} approved & scheduled for Net-30 payment.`);
    setTimeout(() => setPaymentApprovedToast(null), 4000);
  };

  return (
    <div style={styles.container}>
      {paymentApprovedToast && (
        <div style={styles.toast}>
          <CheckCircle2 size={18} color="#34d399" />
          <span>{paymentApprovedToast}</span>
        </div>
      )}

      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AP Automation & 3-Way Matching</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            AI-driven comparison between Purchase Orders, Receiving Slips, and Vendor Invoices to eliminate overbillings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="badge badge-emerald" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Sparkles size={14} /> 100% Automated Coding
          </div>
        </div>
      </div>

      <div className="grid-3">
        {/* Left Column: Invoices Feed (1 span) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Vendor Invoices Queue</h3>
          {invoices.map(inv => {
            const isSelected = selectedInvoice?.id === inv.id;
            const isMatch = inv.confidenceScore === 100;
            return (
              <div
                key={inv.id}
                className="glass-card"
                onClick={() => setSelectedInvoice(inv)}
                style={{
                  ...styles.invCard,
                  ...(isSelected ? styles.activeInvCard : {})
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-indigo)' }}>{inv.invoiceNumber}</span>
                  <span className={isMatch ? 'badge badge-emerald' : 'badge badge-rose'}>
                    {inv.matchStatus}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{inv.vendor}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PO Ref: {inv.poNumber} • Due: {inv.dueDate}</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match Confidence: {inv.confidenceScore}%</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>${inv.amount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: 3-Way Match Inspector (2 spans) */}
        {selectedInvoice && (
          <div className="glass-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Bar */}
            <div style={styles.inspectorHeader}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>3-Way Reconciliation Inspector</h2>
                  <span className={selectedInvoice.confidenceScore === 100 ? 'badge badge-emerald' : 'badge badge-rose'}>
                    {selectedInvoice.matchStatus} ({selectedInvoice.confidenceScore}% Match)
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Invoice: {selectedInvoice.invoiceNumber} | Vendor: {selectedInvoice.vendor}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Invoice Total</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  ${selectedInvoice.amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Discrepancy Alert Box if variance exists */}
            {selectedInvoice.discrepancy && (
              <div style={styles.varianceAlert}>
                <AlertTriangle size={20} color="#fb7185" />
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#fb7185' }}>Automated Discrepancy Flag:</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {selectedInvoice.discrepancy}
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm" style={{ color: '#fb7185' }}>
                  Dispute with Vendor
                </button>
              </div>
            )}

            {/* 3-Way Comparison Columns */}
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>
                Triangulation Analysis (PO vs Goods Receipt vs Invoice)
              </h3>
              
              <div style={styles.triangulationGrid}>
                {/* Column 1: Approved PO */}
                <div style={styles.triColumn}>
                  <div style={styles.triColHeader}>
                    <FileSpreadsheet size={16} color="var(--primary-indigo)" />
                    <span>1. Approved PO ({selectedInvoice.poNumber})</span>
                  </div>
                  <div style={styles.triColBody}>
                    {selectedInvoice.poItems.map((item, idx) => (
                      <div key={idx} style={styles.triItem}>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.qty} units @ ${item.unitPrice.toFixed(2)}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-indigo)' }}>${item.subtotal.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Warehouse Goods Receipt */}
                <div style={styles.triColumn}>
                  <div style={styles.triColHeader}>
                    <CheckCircle2 size={16} color="#34d399" />
                    <span>2. Warehouse Receipt</span>
                  </div>
                  <div style={styles.triColBody}>
                    {selectedInvoice.poItems.map((item, idx) => (
                      <div key={idx} style={styles.triItem}>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#34d399' }}>Verified Received</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.qty} units inspected</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Dock Receipt #RCV-8902</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Vendor Invoice */}
                <div style={styles.triColumn}>
                  <div style={styles.triColHeader}>
                    <Receipt size={16} color="var(--accent-cyan)" />
                    <span>3. Billed Invoice</span>
                  </div>
                  <div style={styles.triColBody}>
                    {selectedInvoice.invoiceItems.map((item, idx) => (
                      <div key={idx} style={{
                        ...styles.triItem,
                        borderLeft: item.name.includes('Freight') ? '3px solid var(--accent-rose)' : '3px solid var(--accent-cyan)'
                      }}>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.qty} units @ ${item.unitPrice.toFixed(2)}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>${item.subtotal.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions & GL Auto Coding */}
            <div style={styles.bottomBar}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated GL Account Code:</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#818cf8' }}>{selectedInvoice.glAccount}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary">
                  Override GL Code
                </button>
                <button className="btn btn-success" onClick={() => handleApprovePayment(selectedInvoice.id)}>
                  <CheckCircle2 size={16} /> Approve & Schedule Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column' },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'rgba(16, 185, 129, 0.95)',
    color: '#fff',
    padding: '0.85rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontWeight: 600,
    zIndex: 100,
    fontSize: '0.9rem'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  },
  invCard: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem'
  },
  activeInvCard: {
    borderColor: 'var(--primary-indigo)',
    background: 'rgba(99, 102, 241, 0.08)',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.15)'
  },
  inspectorHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)'
  },
  varianceAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(244, 63, 94, 0.1)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.85rem 1rem'
  },
  triangulationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  },
  triColumn: {
    background: 'var(--bg-input)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
    overflow: 'hidden'
  },
  triColHeader: {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '0.65rem 0.85rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#fff'
  },
  triColBody: {
    padding: '0.85rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  triItem: {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.6rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)'
  }
};
