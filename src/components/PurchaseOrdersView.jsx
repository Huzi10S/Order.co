import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  X,
  Building2,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';
import { MOCK_PURCHASE_ORDERS, MOCK_COMPANY } from '../data/mockData';

export function PurchaseOrdersView() {
  const [poList, setPoList] = useState(MOCK_PURCHASE_ORDERS);
  const [selectedPo, setSelectedPo] = useState(MOCK_PURCHASE_ORDERS[0]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPoModal, setShowPoModal] = useState(false);

  const filteredPos = poList.filter(po => {
    const matchesStatus = filterStatus === 'All' || po.status === filterStatus;
    const matchesSearch = po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          po.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          po.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Purchase Order Management & Tracking</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track multi-vendor orders, carrier logistics, and official PO documentation in real time.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => setShowPoModal(true)}>
          <FileText size={16} /> Official PO Document View
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by PO#, vendor, or department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'In Transit', 'Delivered', 'Invoiced'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                background: filterStatus === status ? 'var(--primary-indigo)' : 'var(--bg-input)',
                color: filterStatus === status ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Selected Order Tracker + PO Table */}
      <div className="grid-3">
        {/* PO Table (2 spans) */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>All Purchase Orders</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>PO Number</th>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Order Date</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPos.map(po => {
                  const isSelected = selectedPo?.id === po.id;
                  return (
                    <tr 
                      key={po.id} 
                      onClick={() => setSelectedPo(po)}
                      style={{
                        ...styles.tr,
                        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ ...styles.td, fontWeight: 700, color: 'var(--primary-indigo)' }}>{po.id}</td>
                      <td style={styles.td}>{po.vendor}</td>
                      <td style={styles.td}>{po.department}</td>
                      <td style={styles.td}>{po.orderDate}</td>
                      <td style={{ ...styles.td, fontWeight: 700 }}>${po.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td style={styles.td}>
                        {po.status === 'In Transit' && <span className="badge badge-cyan">In Transit</span>}
                        {po.status === 'Delivered' && <span className="badge badge-emerald">Delivered</span>}
                        {po.status === 'Invoiced' && <span className="badge badge-indigo">Invoiced</span>}
                      </td>
                      <td style={styles.td}>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPo(po);
                            setShowPoModal(true);
                          }}
                        >
                          View PO
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Tracking Sidebar (1 span) */}
        {selectedPo && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Tracker</span>
                {selectedPo.status === 'In Transit' && <span className="badge badge-cyan">In Transit</span>}
                {selectedPo.status === 'Delivered' && <span className="badge badge-emerald">Delivered</span>}
                {selectedPo.status === 'Invoiced' && <span className="badge badge-indigo">Invoiced</span>}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-indigo)' }}>{selectedPo.id}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Supplier: <strong>{selectedPo.vendor}</strong></p>
            </div>

            {/* Carrier Logistics Box */}
            <div style={styles.logisticsBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Truck size={18} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedPo.carrier}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tracking #: <span style={{ color: '#fff', fontFamily: 'monospace' }}>{selectedPo.trackingNumber}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Estimated Delivery: <strong style={{ color: '#34d399' }}>{selectedPo.deliveryDate}</strong>
              </div>
            </div>

            {/* Lifecycle Timeline Steps */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                Lifecycle Progression
              </h4>
              <div style={styles.timelineList}>
                {selectedPo.steps.map((step, idx) => (
                  <div key={idx} style={styles.timelineItem}>
                    <div style={{
                      ...styles.timelineDot,
                      background: step.done ? 'var(--accent-emerald)' : 'var(--bg-input)',
                      border: step.done ? 'none' : '1px solid var(--border-color)'
                    }}>
                      {step.done && <CheckCircle2 size={12} color="#fff" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: step.done ? 600 : 400, color: step.done ? '#fff' : 'var(--text-muted)' }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => setShowPoModal(true)}>
              <FileText size={16} /> Open Detailed PO Document
            </button>
          </div>
        )}
      </div>

      {/* Official PO Document Viewer Modal */}
      {showPoModal && selectedPo && (
        <div style={styles.modalOverlay} onClick={() => setShowPoModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--primary-indigo)" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Purchase Order Document - {selectedPo.id}</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Print
                </button>
                <button className="btn btn-primary btn-sm">
                  <Download size={14} /> Export PDF
                </button>
                <button style={styles.closeBtn} onClick={() => setShowPoModal(false)}>×</button>
              </div>
            </div>

            {/* Printable Document Sheet Body */}
            <div style={styles.poSheet}>
              <div style={styles.poSheetHeader}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-indigo)' }}>Order.co</h1>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise Procurement Network</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tax ID: 94-3829104</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>PURCHASE ORDER</h2>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-indigo)' }}>{selectedPo.id}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {selectedPo.orderDate}</p>
                </div>
              </div>

              {/* Vendor & Delivery Addresses */}
              <div style={styles.poAddressesGrid}>
                <div style={styles.addressBox}>
                  <h4 style={styles.addressTitle}>VENDOR</h4>
                  <div style={{ fontWeight: 700 }}>{selectedPo.vendor}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise Fulfillment Center</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>vendor-orders@net.order.co</div>
                </div>

                <div style={styles.addressBox}>
                  <h4 style={styles.addressTitle}>SHIP TO / RECEIVING</h4>
                  <div style={{ fontWeight: 700 }}>{MOCK_COMPANY.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{MOCK_COMPANY.currentLocation}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dept: {selectedPo.department}</div>
                </div>
              </div>

              {/* PO Line Items Table */}
              <table style={{ ...styles.table, marginTop: '1.5rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-input)' }}>
                    <th style={styles.th}>SKU</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Qty</th>
                    <th style={styles.th}>Unit Price</th>
                    <th style={styles.th}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPo.items.map((item, idx) => (
                    <tr key={idx} style={styles.tr}>
                      <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.sku}</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{item.name}</td>
                      <td style={styles.td}>{item.qty}</td>
                      <td style={styles.td}>${item.unitPrice.toFixed(2)}</td>
                      <td style={{ ...styles.td, fontWeight: 700 }}>${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & Approval Footer */}
              <div style={styles.poFooterRow}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GL Accounting Code:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-indigo)' }}>{selectedPo.glCode}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Approved By: {selectedPo.approvedBy}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subtotal: ${selectedPo.total.toFixed(2)}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tax & Freight: $0.00 (Contract Included)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                    Total: ${selectedPo.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
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
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' },
  tr: { borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' },
  td: { padding: '0.85rem 1rem', fontSize: '0.88rem' },
  logisticsBox: {
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.25)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.85rem 1rem'
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  timelineDot: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  modalContent: {
    width: '750px',
    maxHeight: '90vh',
    background: 'var(--bg-card-solid)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  modalHeader: {
    padding: '1rem 1.5rem',
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
    cursor: 'pointer',
    marginLeft: '0.5rem'
  },
  poSheet: {
    padding: '2rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  poSheetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)'
  },
  poAddressesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem'
  },
  addressBox: {
    background: 'var(--bg-input)',
    padding: '1rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)'
  },
  addressTitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 700,
    marginBottom: '0.4rem'
  },
  poFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)'
  }
};
