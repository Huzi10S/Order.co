export const MOCK_COMPANY = {
  name: "Acme Enterprise Solutions",
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
  currentLocation: "HQ - San Francisco, CA",
  monthlyBudget: 250000,
  monthlySpent: 164280,
  aiSavingsYTD: 34850,
  activeVendorsCount: 42
};

export const MOCK_DEPARTMENTS = [
  { id: 'eng', name: 'Engineering & IT', allocated: 85000, spent: 62400, color: '#6366f1' },
  { id: 'ops', name: 'Operations & Facilities', allocated: 70000, spent: 51200, color: '#06b6d4' },
  { id: 'mkt', name: 'Marketing & Design', allocated: 45000, spent: 28900, color: '#8b5cf6' },
  { id: 'sales', name: 'Sales & Growth', allocated: 30000, spent: 14600, color: '#10b981' },
  { id: 'hr', name: 'HR & Workplace', allocated: 20000, spent: 7180, color: '#f59e0b' }
];

export const MOCK_CATALOG = [
  {
    id: 'prod-101',
    name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
    category: 'IT Hardware',
    vendor: 'CDW Direct',
    sku: 'CDW-893021',
    price: 549.99,
    originalPrice: 629.99,
    savings: 80.00,
    rating: 4.9,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
    description: 'IPS Black panel with 2000:1 contrast ratio, 90W power delivery via USB-C, daisy-chaining support.',
    glCode: 'GL-6420 (IT Capital Equipment)'
  },
  {
    id: 'prod-102',
    name: 'Herman Miller Aeron Ergonomic Chair (Size B, Onyx)',
    category: 'Office Furniture',
    vendor: 'Design Within Reach',
    sku: 'DWR-HM-AERON-B',
    price: 1295.00,
    originalPrice: 1450.00,
    savings: 155.00,
    rating: 4.95,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=400&auto=format&fit=crop&q=80',
    description: 'PostureFit SL back support, fully adjustable arms, 8Z Pellicle breathable mesh suspension.',
    glCode: 'GL-6100 (Furniture & Fixtures)'
  },
  {
    id: 'prod-103',
    name: 'Apple MacBook Pro 16" (M3 Max, 36GB RAM, 1TB SSD)',
    category: 'IT Hardware',
    vendor: 'Amazon Business',
    sku: 'AMZ-APL-MBP16',
    price: 3499.00,
    originalPrice: 3699.00,
    savings: 200.00,
    rating: 5.0,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
    description: 'Space Black finish, liquid retina XDR display, up to 22 hours battery life for software engineering.',
    glCode: 'GL-6420 (IT Capital Equipment)'
  },
  {
    id: 'prod-104',
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    category: 'Peripherals',
    vendor: 'Staples Advantage',
    sku: 'STP-LOG-MX3S',
    price: 99.99,
    originalPrice: 109.99,
    savings: 10.00,
    rating: 4.8,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80',
    description: '8K DPI tracking on any surface, quiet clicks, MagSpeed electromagnetic scrolling.',
    glCode: 'GL-6410 (Computer Supplies)'
  },
  {
    id: 'prod-105',
    name: 'Brevada Organic Espresso Whole Beans (5 lb Bag)',
    category: 'Breakroom Supplies',
    vendor: 'Amazon Business',
    sku: 'AMZ-COFFEE-5LB',
    price: 64.50,
    originalPrice: 72.00,
    savings: 7.50,
    rating: 4.7,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop&q=80',
    description: '100% Arabica artisanal roast for office breakrooms and espresso machines.',
    glCode: 'GL-6250 (Employee Hospitality & Perks)'
  },
  {
    id: 'prod-106',
    name: 'Heavy Duty Shipping Boxes (18x18x18 Inches, Pack of 25)',
    category: 'Packaging & Warehouse',
    vendor: 'Uline Commercial',
    sku: 'ULN-S-4321',
    price: 89.00,
    originalPrice: 98.00,
    savings: 9.00,
    rating: 4.6,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
    description: '200 lb test corrugated kraft boxes for secure product distribution and operations.',
    glCode: 'GL-6300 (Packaging Materials)'
  }
];

export const MOCK_APPROVALS = [
  {
    id: 'REQ-4092',
    requester: 'Sarah Jenkins',
    department: 'Engineering & IT',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    itemsCount: 4,
    totalAmount: 3798.98,
    vendor: 'CDW Direct & Amazon',
    dateRequested: '2026-07-22 10:15 AM',
    urgency: 'High',
    budgetStatus: 'Within Budget ($22.6k remaining)',
    policyCheck: 'All 3 items match pre-approved vendor policy.',
    items: [
      { name: 'Apple MacBook Pro 16" M3 Max', qty: 1, unitPrice: 3499.00 },
      { name: 'Logitech MX Master 3S Mouse', qty: 3, unitPrice: 99.99 }
    ]
  },
  {
    id: 'REQ-4089',
    requester: 'Marcus Vance',
    department: 'Marketing & Design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    itemsCount: 2,
    totalAmount: 2590.00,
    vendor: 'Design Within Reach',
    dateRequested: '2026-07-21 04:45 PM',
    urgency: 'Normal',
    budgetStatus: 'Over Threshold Warning (Requires Director Approval)',
    policyCheck: 'Furniture purchase over $2,000 threshold.',
    items: [
      { name: 'Herman Miller Aeron Ergonomic Chair', qty: 2, unitPrice: 1295.00 }
    ]
  }
];

export const MOCK_PURCHASE_ORDERS = [
  {
    id: 'PO-9405',
    vendor: 'CDW Direct',
    department: 'Engineering & IT',
    orderDate: '2026-07-20',
    deliveryDate: '2026-07-24 (Estimated)',
    total: 4399.92,
    status: 'In Transit',
    trackingNumber: '1Z9999999999999999',
    carrier: 'UPS Ground',
    glCode: 'GL-6420',
    approvedBy: 'Alex Chen (VP Eng)',
    steps: [
      { name: 'Requisition Created', done: true, time: 'Jul 20, 09:00 AM' },
      { name: 'Policy & Budget Approved', done: true, time: 'Jul 20, 09:45 AM' },
      { name: 'PO Transmitted to CDW', done: true, time: 'Jul 20, 10:15 AM' },
      { name: 'Vendor Shipped (UPS)', done: true, time: 'Jul 21, 02:30 PM' },
      { name: 'Delivered & 3-Way Matched', done: false, time: 'Pending' }
    ],
    items: [
      { sku: 'CDW-893021', name: 'Dell UltraSharp 27" 4K Monitor', qty: 4, unitPrice: 549.99, total: 2199.96 },
      { sku: 'CDW-774012', name: 'Cisco Meraki MX67 Router', qty: 2, unitPrice: 1100.00, total: 2199.96 }
    ]
  },
  {
    id: 'PO-9404',
    vendor: 'Uline Commercial',
    department: 'Operations & Facilities',
    orderDate: '2026-07-18',
    deliveryDate: '2026-07-21',
    total: 1246.00,
    status: 'Delivered',
    trackingNumber: 'FedEx 781920394012',
    carrier: 'FedEx Express',
    glCode: 'GL-6300',
    approvedBy: 'David Miller (Ops Dir)',
    steps: [
      { name: 'Requisition Created', done: true, time: 'Jul 18, 08:30 AM' },
      { name: 'Policy & Budget Approved', done: true, time: 'Jul 18, 08:50 AM' },
      { name: 'PO Transmitted to Uline', done: true, time: 'Jul 18, 09:10 AM' },
      { name: 'Vendor Shipped (FedEx)', done: true, time: 'Jul 19, 04:00 PM' },
      { name: 'Delivered & 3-Way Matched', done: true, time: 'Jul 21, 11:20 AM' }
    ],
    items: [
      { sku: 'ULN-S-4321', name: 'Heavy Duty Shipping Boxes (Pack of 25)', qty: 10, unitPrice: 89.00, total: 890.00 },
      { sku: 'ULN-S-9011', name: 'Industrial Stretch Wrap 18"', qty: 6, unitPrice: 59.33, total: 356.00 }
    ]
  },
  {
    id: 'PO-9403',
    vendor: 'Staples Advantage',
    department: 'HR & Workplace',
    orderDate: '2026-07-16',
    deliveryDate: '2026-07-19',
    total: 450.00,
    status: 'Invoiced',
    trackingNumber: 'STP-LOCAL-88392',
    carrier: 'Staples Delivery Fleet',
    glCode: 'GL-6410',
    approvedBy: 'Rachel Adams (HR Mgr)',
    steps: [
      { name: 'Requisition Created', done: true, time: 'Jul 16, 02:00 PM' },
      { name: 'Policy & Budget Approved', done: true, time: 'Jul 16, 02:15 PM' },
      { name: 'PO Transmitted to Staples', done: true, time: 'Jul 16, 02:30 PM' },
      { name: 'Vendor Shipped', done: true, time: 'Jul 17, 08:00 AM' },
      { name: 'Delivered & 3-Way Matched', done: true, time: 'Jul 19, 01:15 PM' }
    ],
    items: [
      { sku: 'STP-PAPER-A4', name: 'Multipurpose Copy Paper (10 Reams)', qty: 5, unitPrice: 65.00, total: 325.00 },
      { sku: 'STP-PEN-G2', name: 'Pilot G2 Gel Pens (Pack of 12)', qty: 10, unitPrice: 12.50, total: 125.00 }
    ]
  }
];

export const MOCK_INVOICES = [
  {
    id: 'INV-88901',
    vendor: 'CDW Direct',
    invoiceNumber: 'CDW-INV-2026-99',
    poNumber: 'PO-9405',
    invoiceDate: '2026-07-21',
    dueDate: '2026-08-20',
    amount: 4399.92,
    matchStatus: '100% Matched',
    confidenceScore: 100,
    glAccount: 'GL-6420 (IT Capital)',
    discrepancy: null,
    poItems: [
      { name: 'Dell UltraSharp 27" 4K Monitor', qty: 4, unitPrice: 549.99, subtotal: 2199.96 },
      { name: 'Cisco Meraki MX67 Router', qty: 2, unitPrice: 1100.00, subtotal: 2199.96 }
    ],
    invoiceItems: [
      { name: 'Dell UltraSharp 27" 4K Monitor', qty: 4, unitPrice: 549.99, subtotal: 2199.96 },
      { name: 'Cisco Meraki MX67 Router', qty: 2, unitPrice: 1100.00, subtotal: 2199.96 }
    ]
  },
  {
    id: 'INV-88902',
    vendor: 'Staples Advantage',
    invoiceNumber: 'STP-2026-78401',
    poNumber: 'PO-9403',
    invoiceDate: '2026-07-19',
    dueDate: '2026-08-18',
    amount: 485.00,
    matchStatus: 'Variance Flagged',
    confidenceScore: 82,
    glAccount: 'GL-6410 (Office Supplies)',
    discrepancy: 'Freight fee of $35.00 added by vendor not present in original Purchase Order.',
    poItems: [
      { name: 'Multipurpose Copy Paper (10 Reams)', qty: 5, unitPrice: 65.00, subtotal: 325.00 },
      { name: 'Pilot G2 Gel Pens (Pack of 12)', qty: 10, unitPrice: 12.50, subtotal: 125.00 }
    ],
    invoiceItems: [
      { name: 'Multipurpose Copy Paper (10 Reams)', qty: 5, unitPrice: 65.00, subtotal: 325.00 },
      { name: 'Pilot G2 Gel Pens (Pack of 12)', qty: 10, unitPrice: 12.50, subtotal: 125.00 },
      { name: 'Unscheduled Freight Charge', qty: 1, unitPrice: 35.00, subtotal: 35.00 }
    ]
  }
];

export const MOCK_VIRTUAL_CARDS = [
  {
    id: 'VC-101',
    vendorName: 'AWS Cloud Services',
    cardName: 'Engineering AWS Recurring Infrastructure',
    cardNumber: '•••• •••• •••• 4912',
    expDate: '09/28',
    cvv: '***',
    monthlyLimit: 25000,
    spentThisMonth: 18450,
    status: 'Active',
    cardType: 'Merchant Locked',
    department: 'Engineering & IT',
    createdDate: '2026-01-15'
  },
  {
    id: 'VC-102',
    vendorName: 'Google Ads & Marketing',
    cardName: 'Q3 Growth Campaign Card',
    cardNumber: '•••• •••• •••• 8104',
    expDate: '12/26',
    cvv: '***',
    monthlyLimit: 15000,
    spentThisMonth: 11200,
    status: 'Active',
    cardType: 'Merchant Locked',
    department: 'Marketing & Design',
    createdDate: '2026-06-01'
  },
  {
    id: 'VC-103',
    vendorName: 'Design Within Reach',
    cardName: 'Single-Use Exec Office Furnishing',
    cardNumber: '•••• •••• •••• 3390',
    expDate: '08/26',
    cvv: '***',
    monthlyLimit: 3000,
    spentThisMonth: 2590,
    status: 'Locked',
    cardType: 'Single Use',
    department: 'Operations & Facilities',
    createdDate: '2026-07-21'
  }
];

export const MOCK_AI_INSIGHTS = [
  {
    id: 'AI-1',
    title: 'Out-of-Stock Alternative Sourced',
    type: 'Savings Alert',
    description: 'Order.co AI located 15x Dell UltraSharp monitors at CDW for $549.99 ($80 below list price), saving your team $1,200 total.',
    timestamp: '2 hours ago',
    badge: '12% Savings'
  },
  {
    id: 'AI-2',
    title: 'Duplicate Invoice Prevented',
    type: 'Risk Guard',
    description: 'AI 3-Way Match caught duplicate invoice #INV-88901 submitted by CDW before payment processing.',
    timestamp: 'Yesterday',
    badge: 'Risk Mitigated'
  },
  {
    id: 'AI-3',
    title: 'Consolidated Billing Optimization',
    type: 'Process Efficiency',
    description: '14 orders across 5 vendors consolidated into 1 monthly Net-30 statement, saving 6 hours of AP processing.',
    timestamp: '3 days ago',
    badge: 'Automated'
  }
];
