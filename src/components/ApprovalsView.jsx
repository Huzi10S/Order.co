import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Building2, 
  Check, 
  X, 
  RefreshCw, 
  ShieldCheck,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { MOCK_APPROVALS } from '../data/mockData';

export function ApprovalsView({ onNavigate }) {
  const [approvalsList, setApprovalsList] = useState(MOCK_APPROVALS);
  const [selectedReq, setSelectedReq] = useState(MOCK_APPROVALS[0]);
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);

  const handleApprove = (reqId) => {
    setApprovalsList(prev => prev.filter(r => r.id !== reqId));
    if (selectedReq?.id === reqId) {
      const remaining = approvalsList.filter(r => r.id !== reqId);
      setSelectedReq(remaining[0] || null);
    }
    setActionSuccessMessage(`Requisition ${reqId} Approved & Purchase Order Transmitted to Vendor!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleReject = (reqId) => {
    setApprovalsList(prev => prev.filter(r => r.id !== reqId));
    if (selectedReq?.id === reqId) {
      const remaining = approvalsList.filter(r => r.id !== reqId);
      setSelectedReq(remaining[0] || null);
    }
    setActionSuccessMessage(`Requisition ${reqId} Rejected.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div style={styles.container}>
      {actionSuccessMessage && (
        <div style={styles.successToast}>
          <CheckCircle2 size={18} color="#34d399" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Approval Queue & Governance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review pending purchase requisitions against department budgets and corporate spending policies.
          </p>
        </div>
        <div className="badge badge-amber" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Clock size={16} /> {approvalsList.length} Requisitions Pending Review
        </div>
      </div>

      {approvalsList.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CheckCircle2 size={56} color="#10b981" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>All Clear! No Pending Approvals</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            All purchase requisitions for your department have been reviewed and processed into active Purchase Orders.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('pos')}>
            View Active Purchase Orders <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {/* Left Column: Requisition List (1 span) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pending Requisitions</h3>
            {approvalsList.map(req => {
              const isSelected = selectedReq?.id === req.id;
              return (
                <div
                  key={req.id}
                  className="glass-card"
                  onClick={() => setSelectedReq(req)}
                  style={{
                    ...styles.reqCard,
                    ...(isSelected ? styles.activeReqCard : {})
                  }}
                >
                  <div style={styles.reqCardTop}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-indigo)' }}>{req.id}</span>
                    <span className={req.urgency === 'High' ? 'badge badge-rose' : 'badge badge-indigo'}>
                      {req.urgency} Urgency
                    </span>
                  </div>

                  <div style={styles.reqUserRow}>
                    <img src={req.avatar} alt={req.requester} style={styles.userAvatar} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{req.requester}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.department}</div>
                    </div>
                  </div>

                  <div style={styles.reqCardFooter}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{req.itemsCount} line items</span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                      ${req.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Inspector (2 spans) */}
          {selectedReq && (
            <div className="glass-card" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header Info */}
              <div style={styles.detailHeader}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Requisition Details: {selectedReq.id}</h2>
                    <span className="badge badge-amber">Pending Authorization</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Submitted on {selectedReq.dateRequested} by {selectedReq.requester} ({selectedReq.department})
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                    ${selectedReq.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Policy Checks Box */}
              <div style={styles.policyBox}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <ShieldCheck size={20} color="#818cf8" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Automated Policy & Governance Scan</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={styles.policyCheckItem}>
                    <CheckCircle2 size={16} color="#34d399" />
                    <span><strong>Budget Check:</strong> {selectedReq.budgetStatus}</span>
                  </div>
                  <div style={styles.policyCheckItem}>
                    {selectedReq.policyCheck.includes('Warning') || selectedReq.policyCheck.includes('threshold') ? (
                      <AlertTriangle size={16} color="#fbbf24" />
                    ) : (
                      <CheckCircle2 size={16} color="#34d399" />
                    )}
                    <span><strong>Vendor Policy:</strong> {selectedReq.policyCheck}</span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Requested Line Items</h3>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Product Description</th>
                        <th style={styles.th}>Qty</th>
                        <th style={styles.th}>Unit Price</th>
                        <th style={styles.th}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReq.items.map((item, idx) => (
                        <tr key={idx} style={styles.tr}>
                          <td style={{ ...styles.td, fontWeight: 600 }}>{item.name}</td>
                          <td style={styles.td}>{item.qty}</td>
                          <td style={styles.td}>${item.unitPrice.toFixed(2)}</td>
                          <td style={{ ...styles.td, fontWeight: 700 }}>${(item.qty * item.unitPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Decision Action Buttons */}
              <div style={styles.actionRow}>
                <button className="btn btn-secondary" onClick={() => handleReject(selectedReq.id)}>
                  <X size={16} color="var(--accent-rose)" /> Reject Requisition
                </button>
                <button className="btn btn-secondary">
                  <RefreshCw size={16} color="var(--accent-cyan)" /> Request Sourcing Alternative
                </button>
                <button className="btn btn-success" style={{ marginLeft: 'auto', padding: '0.85rem 1.75rem' }} onClick={() => handleApprove(selectedReq.id)}>
                  <Check size={18} /> Approve & Issue PO
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column' },
  successToast: {
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
  reqCard: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    padding: '1.1rem'
  },
  activeReqCard: {
    borderColor: 'var(--primary-indigo)',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
    background: 'rgba(99, 102, 241, 0.08)'
  },
  reqCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  reqUserRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  reqCardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.6rem',
    borderTop: '1px solid var(--border-color)'
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)'
  },
  policyBox: {
    background: 'rgba(99, 102, 241, 0.06)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: 'var(--radius-sm)',
    padding: '1rem 1.25rem'
  },
  policyCheckItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.85rem',
    color: 'var(--text-main)'
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '0.6rem 0.85rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' },
  tr: { borderBottom: '1px solid rgba(255, 255, 255, 0.05)' },
  td: { padding: '0.75rem 0.85rem', fontSize: '0.85rem' },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)'
  }
};
