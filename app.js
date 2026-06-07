'use strict';

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & DEMO DATA
// ══════════════════════════════════════════════════════════════════════════════

const DB_NAME    = 'lpg-tracer-db';
const DB_VERSION = 2;
const SEED_KEY   = 'seeded-v4';

const DEMO_CYLINDERS = [
  { id:'E280116060000204C3F04E81', serial:'LPG-2018-001', company:'Vivo LPG',       manufactureDate:'2018-03-15', tareWeight:14.5, capacity:12, maxFills:500, fillCount:342, lastHydroTest:'2020-12-20', status:'in-refill',       notes:'' },
  { id:'E280116060000204C3F04E82', serial:'LPG-2019-002', company:'Vivo LPG',       manufactureDate:'2019-06-10', tareWeight:14.5, capacity:12, maxFills:500, fillCount:461, lastHydroTest:'2024-06-10', status:'in-circulation',  notes:'' },
  { id:'E280116060000204C3F04E83', serial:'LPG-2020-003', company:'Vivo LPG',       manufactureDate:'2020-01-22', tareWeight:14.5, capacity:12, maxFills:500, fillCount:156, lastHydroTest:'2025-03-20', status:'in-refill',       notes:'' },
  { id:'E280116060000204C3F04E84', serial:'LPG-2018-004', company:'Vivo LPG',       manufactureDate:'2018-09-05', tareWeight:14.5, capacity:12, maxFills:500, fillCount:502, lastHydroTest:'2020-08-12', status:'in-refill',       notes:'' },
  { id:'E280116060000204C3F04E85', serial:'LPG-2021-005', company:'Total Energies', manufactureDate:'2021-04-18', tareWeight:14.5, capacity:12, maxFills:500, fillCount:23,  lastHydroTest:'2026-01-10', status:'in-refill',       notes:'' },
  { id:'E280116060000204C3F04E86', serial:'LPG-2019-006', company:'Total Energies', manufactureDate:'2019-11-30', tareWeight:14.5, capacity:12, maxFills:500, fillCount:298, lastHydroTest:'2024-11-05', status:'in-circulation',  notes:'' },
  { id:'E280116060000204C3F04E87', serial:'LPG-2022-007', company:'Shell Gas',      manufactureDate:'2022-07-14', tareWeight:14.5, capacity:12, maxFills:500, fillCount:89,  lastHydroTest:'2025-09-14', status:'in-refill',       notes:'' },
  { id:'E280116060000204C3F04E88', serial:'LPG-2020-008', company:'Total Energies', manufactureDate:'2020-03-08', tareWeight:14.5, capacity:12, maxFills:500, fillCount:376, lastHydroTest:'2020-05-22', status:'refilling',       notes:'' },
  { id:'E280116060000204C3F04E89', serial:'LPG-2023-009', company:'Shell Gas',      manufactureDate:'2023-02-27', tareWeight:14.5, capacity:12, maxFills:500, fillCount:12,  lastHydroTest:'2026-03-01', status:'in-refill',       notes:'' },
  { id:'E280116060000204C3F04E8A', serial:'LPG-2021-010', company:'Shell Gas',      manufactureDate:'2021-08-19', tareWeight:14.5, capacity:12, maxFills:500, fillCount:478, lastHydroTest:'2024-09-18', status:'in-use',          notes:'' },
  { id:'E280116060000204C3F04E8B', serial:'LPG-2019-011', company:'Shell Gas',      manufactureDate:'2019-05-03', tareWeight:14.5, capacity:12, maxFills:500, fillCount:234, lastHydroTest:'2020-11-15', status:'returning',       notes:'' },
  { id:'E280116060000204C3F04E8C', serial:'LPG-2024-012', company:'Shell Gas',      manufactureDate:'2024-01-15', tareWeight:14.5, capacity:12, maxFills:500, fillCount:5,   lastHydroTest:'2025-11-30', status:'revalidation',    notes:'' },
];

const DEMO_LICENSES = [
  { id:'LIC-001', companyName:'Vivo LPG',        companyType:'LPGMC',         licenseNumber:'LPGMC-2020-001', issuedDate:'2020-01-15', expiryDate:'2027-01-14', status:'active' },
  { id:'LIC-002', companyName:'Total Energies',   companyType:'LPGMC',         licenseNumber:'LPGMC-2019-002', issuedDate:'2019-06-01', expiryDate:'2026-05-31', status:'active' },
  { id:'LIC-003', companyName:'Shell Gas',        companyType:'LPGMC',         licenseNumber:'LPGMC-2021-003', issuedDate:'2021-03-10', expiryDate:'2028-03-09', status:'active' },
  { id:'LIC-004', companyName:'ABC Distributors', companyType:'Distributor',   licenseNumber:'DIST-2022-001',  issuedDate:'2022-07-20', expiryDate:'2025-07-19', status:'expired' },
  { id:'LIC-005', companyName:'QuickGas Retail',  companyType:'Retailer',      licenseNumber:'RET-2023-005',   issuedDate:'2023-02-14', expiryDate:'2026-02-13', status:'expired' },
  { id:'LIC-006', companyName:'ProRevalid Ltd',   companyType:'Revalidator',   licenseNumber:'REVAL-2021-001', issuedDate:'2021-09-01', expiryDate:'2027-08-31', status:'active' },
  { id:'LIC-007', companyName:'CityGas Direct',   companyType:'Retailer',      licenseNumber:'RET-2024-012',   issuedDate:'2024-11-01', expiryDate:'2027-10-31', status:'active' },
];

const DEMO_NETWORK = [
  { id:'NET-001', name:'ABC Gas Distributors',   type:'Distributor', city:'Dar es Salaam', address:'Kariakoo Market Area',      lat:-6.8160, lng:39.2803, contact:'+255 22 218 0001', status:'active',   cylinders:145 },
  { id:'NET-002', name:'Sunrise Gas Ltd',         type:'Distributor', city:'Arusha',        address:'Sokoni Road, Arusha',        lat:-3.3869, lng:36.6830, contact:'+255 27 250 0002', status:'active',   cylinders:98  },
  { id:'NET-003', name:'Lake Gas Distributors',   type:'Distributor', city:'Mwanza',        address:'Pamba Road, Mwanza',          lat:-2.5164, lng:32.9175, contact:'+255 28 250 0003', status:'active',   cylinders:112 },
  { id:'NET-004', name:'Capital Gas Supplies',    type:'Distributor', city:'Dodoma',        address:'Makole Area, Dodoma',         lat:-6.1730, lng:35.7395, contact:'+255 26 232 0004', status:'active',   cylinders:67  },
  { id:'NET-005', name:'Kilimanjaro Gas',         type:'Distributor', city:'Moshi',         address:'Rindi Lane, Moshi',           lat:-3.3537, lng:37.3398, contact:'+255 27 275 0005', status:'active',   cylinders:89  },
  { id:'NET-006', name:'Island Gas Zanzibar',     type:'Distributor', city:'Zanzibar',      address:'Darajani, Zanzibar City',     lat:-6.1630, lng:39.1990, contact:'+255 24 223 0006', status:'inactive', cylinders:43  },
  { id:'NET-007', name:'QuickGas Retail DSM',     type:'Retailer',    city:'Dar es Salaam', address:'Msimbazi Street',             lat:-6.7900, lng:39.2100, contact:'+255 22 211 0007', status:'active',   cylinders:32  },
  { id:'NET-008', name:'CityGas Direct',          type:'Retailer',    city:'Dar es Salaam', address:'Temeke District',             lat:-6.8600, lng:39.2500, contact:'+255 22 215 0008', status:'active',   cylinders:28  },
  { id:'NET-009', name:'Northern Gas Retail',     type:'Retailer',    city:'Arusha',        address:'Ngarenaro, Arusha',           lat:-3.3700, lng:36.6950, contact:'+255 27 254 0009', status:'active',   cylinders:19  },
  { id:'NET-010', name:'Tanga Gas Shop',          type:'Retailer',    city:'Tanga',         address:'Market Street, Tanga',        lat:-5.0710, lng:39.0951, contact:'+255 27 264 0010', status:'active',   cylinders:24  },
  { id:'NET-011', name:'Morogoro Gas Centre',     type:'Retailer',    city:'Morogoro',      address:'Boma Road, Morogoro',         lat:-6.8160, lng:37.6762, contact:'+255 23 261 0011', status:'active',   cylinders:16  },
  { id:'NET-012', name:'Iringa Gas Retail',       type:'Retailer',    city:'Iringa',        address:'Uhuru Avenue, Iringa',        lat:-7.7700, lng:35.6900, contact:'+255 26 270 0012', status:'active',   cylinders:21  },
];

// ── Role configuration ────────────────────────────────────────────────────────

const ROLE_EVENTS = {
  lpgmc: [
    { type: 'registered',        label: 'Registered',          icon: '🆕' },
    { type: 'refilled',          label: 'Refilled',            icon: '🔄' },
    { type: 'shipped',           label: 'Shipped',             icon: '🚚' },
    { type: 'received-empty',    label: 'Received Empty',      icon: '📥' },
    { type: 'sent-revalidation', label: 'Sent Revalidation',   icon: '🔧' },
  ],
  revalidator: [
    { type: 'reval-received',    label: 'Received',            icon: '📥' },
    { type: 'revalidated',       label: 'Revalidated',         icon: '✅' },
    { type: 'reval-returned',    label: 'Returned to LPGMC',   icon: '↩️' },
  ],
  ewura: [
    { type: 'ewura-monitored',   label: 'Supply Monitored',    icon: '📊' },
  ],
  'field-auditor': [
    { type: 'inspected',         label: 'Inspected',           icon: '🔍' },
  ],
  tra: [
    { type: 'tra-verified',      label: 'Refills Verified',    icon: '✔️' },
    { type: 'tra-registered',    label: 'Shipment Registered', icon: '📋' },
  ],
  distributor: [
    { type: 'dist-received',       label: 'Received',          icon: '📦' },
    { type: 'dist-sent-retail',    label: 'Sent to Retail',    icon: '🚚' },
    { type: 'dist-returned-empty', label: 'Returned Empty',    icon: '↩️' },
  ],
  retailer: [
    { type: 'ret-received',        label: 'Received',          icon: '📦' },
    { type: 'ret-sold',            label: 'Sold to Consumer',  icon: '🛒' },
    { type: 'ret-returned-empty',  label: 'Returned Empty',    icon: '↩️' },
  ],
};

const ROLE_TABS = {
  lpgmc:           ['reports', 'cylinders', 'network', 'alerts', 'mgmt-reports'],
  revalidator:     ['reports', 'scan', 'cylinders'],
  ewura:           ['reports', 'cylinders', 'alerts', 'licenses'],
  'field-auditor': ['reports', 'scan', 'cylinders'],
  tra:             ['reports', 'scan', 'cylinders'],
  distributor:     ['reports', 'scan', 'cylinders', 'alerts'],
  retailer:        ['reports', 'scan', 'cylinders'],
};

const ROLE_LABELS = {
  lpgmc:           'LPGMC',
  revalidator:     'Revalidator',
  ewura:           'EWURA',
  'field-auditor': 'Field Auditor',
  tra:             'TRA',
  distributor:     'Distributor',
  retailer:        'Retailer',
};

const LPGMC_COMPANIES = ['Vivo LPG', 'Total Energies', 'Shell Gas', 'Lake Gas'];

// ══════════════════════════════════════════════════════════════════════════════
// AUTH MODULE
// ══════════════════════════════════════════════════════════════════════════════

const Auth = {
  session: null,

  load() {
    try {
      const raw = localStorage.getItem('lpg-session');
      if (raw) this.session = JSON.parse(raw);
    } catch { this.session = null; }
  },

  login(role, company, operatorId) {
    this.session = { role, company, operatorId };
    localStorage.setItem('lpg-session', JSON.stringify(this.session));
    applySession();
    hideLoginOverlay();
  },

  logout() {
    this.session = null;
    localStorage.removeItem('lpg-session');
    showLoginOverlay();
  },

  can(action) {
    if (!this.session) return false;
    const { role } = this.session;
    switch (action) {
      case 'register':  return role === 'lpgmc';
      case 'inspect':   return role === 'field-auditor';
      case 'license':   return role === 'ewura';
      case 'viewAll':   return ['ewura', 'field-auditor', 'tra', 'distributor', 'retailer', 'revalidator'].includes(role);
      case 'alerts':    return ['lpgmc', 'ewura', 'field-auditor', 'distributor'].includes(role);
      default:          return false;
    }
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════════════════════

const State = {
  activeView:        'reports',
  activeEventType:   null,
  batchMode:         false,
  batchQueue:        [],
  focused:           false,
  scanEvents:        [],
  // Serial capture
  serialCaptureActive: false,
  // Passport
  passportCylinderId: null,
};

// ══════════════════════════════════════════════════════════════════════════════
// INDEXED DB
// ══════════════════════════════════════════════════════════════════════════════

let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const d = e.target.result;

      if (!d.objectStoreNames.contains('cylinders')) {
        const cylStore = d.createObjectStore('cylinders', { keyPath: 'id' });
        cylStore.createIndex('serial',  'serial',  { unique: true });
        cylStore.createIndex('company', 'company', { unique: false });
        cylStore.createIndex('status',  'status',  { unique: false });
      }

      if (!d.objectStoreNames.contains('events')) {
        const evStore = d.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
        evStore.createIndex('cylinderId', 'cylinderId', { unique: false });
        evStore.createIndex('timestamp',  'timestamp',  { unique: false });
      }

      if (!d.objectStoreNames.contains('meta')) {
        d.createObjectStore('meta', { keyPath: 'key' });
      }

      if (!d.objectStoreNames.contains('licenses')) {
        const licStore = d.createObjectStore('licenses', { keyPath: 'id' });
        licStore.createIndex('companyType', 'companyType', { unique: false });
        licStore.createIndex('status',      'status',      { unique: false });
      }
    };

    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror   = (e) => reject(e.target.error);
  });
}

function txGet(storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function txGetAll(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function txPut(storeName, record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).put(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function txDelete(storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

function txGetIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const idx = tx.objectStore(storeName).index(indexName);
    const req = idx.getAll(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function seedDemoData() {
  const seeded = await txGet('meta', SEED_KEY);
  if (seeded) return;

  for (const cyl of DEMO_CYLINDERS) {
    await txPut('cylinders', cyl);
  }

  // Generate some historical events
  const now = Date.now();
  for (const cyl of DEMO_CYLINDERS) {
    const regDate = new Date(cyl.manufactureDate);
    await txPut('events', {
      cylinderId: cyl.id,
      type:       'registered',
      timestamp:  regDate.toISOString(),
      operatorId: 'SYSTEM',
      company:    cyl.company,
      notes:      'Initial registration',
    });
    // Add a few fills
    const fills = Math.min(cyl.fillCount, 3);
    for (let i = 0; i < fills; i++) {
      const d = new Date(now - (fills - i) * 30 * 24 * 60 * 60 * 1000);
      await txPut('events', {
        cylinderId: cyl.id,
        type:       'refilled',
        timestamp:  d.toISOString(),
        operatorId: 'SYSTEM',
        company:    cyl.company,
        notes:      '',
      });
    }
  }

  for (const lic of DEMO_LICENSES) {
    await txPut('licenses', lic);
  }

  await txPut('meta', { key: SEED_KEY, value: true });
}

// ══════════════════════════════════════════════════════════════════════════════
// DOM REFS
// ══════════════════════════════════════════════════════════════════════════════

const $ = (id) => document.getElementById(id);

const scannerInput     = $('scanner-input');
const statusBadge      = $('status-badge');
const focusBtn         = $('focus-btn');
const focusIcon        = $('focus-icon');
const focusLabel       = $('focus-label');
const logoutBtn        = $('logout-btn');
const headerRoleBadge  = $('header-role-badge');
const headerOpPill     = $('header-operator-pill');
const headerSubtitle   = $('header-subtitle');
const snackbar         = $('snackbar');

// Login
const loginOverlay     = $('login-overlay');
const roleCards        = $('role-cards');
const loginFormWrapper = $('login-form-wrapper');
const loginBackBtn     = $('login-back-btn');
const loginFormLabel   = $('login-form-role-label');
const loginForm        = $('login-form');
const loginCompSel     = $('login-company-select');
const loginCompText    = $('login-company-text');
const loginOperator    = $('login-operator');

// Scan view
const scanEventBar     = $('scan-event-bar');
const batchModeToggle  = $('batch-mode-toggle');
const lastScanCard     = $('last-scan-card');
const lastScanTime     = $('last-scan-time');
const lastScanTag      = $('last-scan-tag');
const lastScanResult   = $('last-scan-result');
const batchQueueSection= $('batch-queue-section');
const batchCount       = $('batch-count');
const batchList        = $('batch-list');
const batchCommitBtn   = $('batch-commit-btn');
const batchClearBtn    = $('batch-clear-btn');
const eventsList       = $('events-list');
const eventsEmpty      = $('events-empty');
const exportEventsBtn  = $('export-events-btn');

// Cylinders view
const cylSearch        = $('cyl-search');
const cylFilterStatus  = $('cyl-filter-status');
const cylFilterCompany = $('cyl-filter-company');
const cylStats         = $('cyl-stats');
const cylindersList    = $('cylinders-list');
const cylindersEmpty   = $('cylinders-empty');
const registerCylBtn   = $('register-cyl-btn');

// Alerts view
const alertFilterSeverity = $('alert-filter-severity');
const alertFilterType     = $('alert-filter-type');
const alertSummary        = $('alert-summary');
const alertsList          = $('alerts-list');
const alertsEmpty         = $('alerts-empty');

// Reports view
const reportsGrid      = $('reports-grid');
const reportChart      = $('report-chart');
const exportDashboardBtn = $('export-dashboard-btn');

// Licenses view
const licSearch        = $('lic-search');
const licFilterType    = $('lic-filter-type');
const licFilterStatus  = $('lic-filter-status');
const issueLicenseBtn  = $('issue-license-btn');
const licensesList     = $('licenses-list');
const licensesEmpty    = $('licenses-empty');

// Modals
const modalRegister    = $('modal-register');
const regTag           = $('reg-tag');
const regSerial        = $('reg-serial');
const regManufDate     = $('reg-manufacture-date');
const regTare          = $('reg-tare');
const regMaxFills      = $('reg-max-fills');
const regHydrotest     = $('reg-hydrotest');
const regNotes         = $('reg-notes');
const regSubmitBtn     = $('reg-submit-btn');

const regBrandColour    = $('reg-brand-colour');
const regBrandName      = $('reg-brand-name');
const regManufacturer   = $('reg-manufacturer');
const regProductName    = $('reg-product-name');
const regRequalDate     = $('reg-requalification-date');
const regRequalPlant    = $('reg-requalification-plant');
const regWaterCapacity  = $('reg-water-capacity');
const regNetWeight      = $('reg-net-weight');
const regGrossWeight    = $('reg-gross-weight');
const regPressureTest   = $('reg-pressure-test');
const regCompanyBrand   = $('reg-company-brand');
const regCustomerSvc    = $('reg-customer-service');
const regEmergency      = $('reg-emergency-contacts');
const regSerialScanBtn  = $('reg-serial-scan-btn');

const modalPassport    = $('modal-passport');
const passportBody     = $('passport-body');
const passportExportBtn= $('passport-export-btn');

const modalIssueLicense= $('modal-issue-license');
const licCompanyName   = $('lic-company-name');
const licCompanyType   = $('lic-company-type');
const licNumber        = $('lic-number');
const licIssuedDate    = $('lic-issued-date');
const licExpiryDate    = $('lic-expiry-date');
const licStatus        = $('lic-status');
const licSubmitBtn     = $('lic-submit-btn');

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString([], { year:'numeric', month:'short', day:'numeric' });
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}

function nowISO() { return new Date().toISOString(); }

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

let _snackTimer = null;
function showSnackbar(msg, type = '') {
  snackbar.textContent = msg;
  snackbar.className = 'show' + (type ? ' snack-' + type : '');
  clearTimeout(_snackTimer);
  _snackTimer = setTimeout(() => { snackbar.className = ''; }, 2500);
}

function openModal(id) {
  const el = $(id);
  if (el) { el.hidden = false; el.focus(); }
}

function closeModal(id) {
  const el = $(id);
  if (el) el.hidden = true;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSnackbar('Copied!');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showSnackbar('Copied!');
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════════════════════════════════

let _selectedRole = null;

function showLoginOverlay() {
  loginOverlay.classList.remove('hidden');
  // Reset to card selection
  loginFormWrapper.hidden = true;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  loginOperator.value = '';
  loginCompSel.value  = '';
  loginCompText.value = '';
  _selectedRole = null;
}

function hideLoginOverlay() {
  loginOverlay.classList.add('hidden');
}

function selectRole(role) {
  _selectedRole = role;
  document.querySelectorAll('.role-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.role === role);
    c.setAttribute('aria-pressed', String(c.dataset.role === role));
  });

  // Configure company input
  loginFormLabel.textContent = ROLE_LABELS[role] || role;
  loginCompSel.style.display  = 'none';
  loginCompText.style.display = 'none';

  if (role === 'lpgmc') {
    loginCompSel.innerHTML = LPGMC_COMPANIES.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    loginCompSel.style.display = '';
  } else {
    loginCompText.placeholder = role === 'ewura'          ? 'EWURA'
      : role === 'tra'           ? 'TRA'
      : role === 'revalidator'   ? 'e.g. ProRevalid Ltd'
      : role === 'field-auditor' ? 'e.g. Field Inspection Unit'
      : role === 'distributor'   ? 'e.g. ABC Distributors'
      : 'e.g. QuickGas Retail';
    loginCompText.style.display = '';
  }

  loginFormWrapper.hidden = false;
  loginOperator.focus();
}

// Role card clicks
roleCards.addEventListener('click', (e) => {
  const card = e.target.closest('.role-card');
  if (card) selectRole(card.dataset.role);
});
roleCards.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.role-card');
    if (card) { e.preventDefault(); selectRole(card.dataset.role); }
  }
});

loginBackBtn.addEventListener('click', () => {
  loginFormWrapper.hidden = true;
  _selectedRole = null;
  document.querySelectorAll('.role-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!_selectedRole) return;

  const company = _selectedRole === 'lpgmc'
    ? loginCompSel.value.trim()
    : loginCompText.value.trim();

  const operatorId = loginOperator.value.trim();

  if (!company) { showSnackbar('Please enter a company name.', 'error'); return; }
  if (!operatorId) { showSnackbar('Please enter an Operator ID.', 'error'); return; }

  Auth.login(_selectedRole, company, operatorId);
});

// ══════════════════════════════════════════════════════════════════════════════
// SESSION APPLICATION
// ══════════════════════════════════════════════════════════════════════════════

function applySession() {
  const s = Auth.session;
  if (!s) return;

  // Header badges
  headerRoleBadge.textContent = ROLE_LABELS[s.role] || s.role;
  headerRoleBadge.className   = 'header-role-badge role-' + s.role;
  headerRoleBadge.hidden      = false;

  headerOpPill.textContent = s.company + ' · ' + s.operatorId;
  headerOpPill.hidden      = false;

  logoutBtn.hidden = false;

  // Nav tabs
  const allowed = ROLE_TABS[s.role] || [];
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.style.display = allowed.includes(tab.dataset.view) ? '' : 'none';
  });

  // Build event pills
  buildEventPills();

  // Company filter: hide for LPGMC (they see only own)
  cylFilterCompany.style.display = Auth.can('viewAll') ? '' : 'none';

  // Register button: LPGMC only
  if (registerCylBtn) {
    registerCylBtn.style.display = s.role === 'lpgmc' ? '' : 'none';
  }

  // Navigate to dashboard (reset)
  showView('reports');

  // Refresh data-bound views
  renderCylinders();
  renderAlerts();
  renderReports();
  if (s.role === 'ewura') renderLicenses();
}

function buildEventPills() {
  scanEventBar.innerHTML = '';
  const role = Auth.session ? Auth.session.role : null;
  const events = ROLE_EVENTS[role] || [];
  events.forEach((ev, i) => {
    const btn = document.createElement('button');
    btn.className = 'event-pill' + (i === 0 ? ' active' : '');
    btn.dataset.type = ev.type;
    btn.textContent = ev.label;
    btn.type = 'button';
    btn.addEventListener('click', () => {
      document.querySelectorAll('.event-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      State.activeEventType = ev.type;
    });
    scanEventBar.appendChild(btn);
  });
  // Set default active event type
  State.activeEventType = events.length > 0 ? events[0].type : null;
}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW ROUTING
// ══════════════════════════════════════════════════════════════════════════════

function showView(name) {
  const s = Auth.session;
  if (!s) return;

  const allowed = ROLE_TABS[s.role] || [];
  if (!allowed.includes(name)) {
    name = allowed[0] || 'reports';
  }

  State.activeView = name;

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const viewEl = $('view-' + name);
  if (viewEl) viewEl.classList.add('active');

  const tabEl = document.querySelector(`.nav-tab[data-view="${name}"]`);
  if (tabEl) tabEl.classList.add('active');

  headerSubtitle.textContent = {
    scan:          'Scanning',
    cylinders:     'Cylinders',
    alerts:        'Alerts',
    reports:       'Dashboard',
    licenses:      'Licenses',
    network:       'Network',
    'mgmt-reports':'Management Reports',
  }[name] || name;

  // Lazy render
  if (name === 'cylinders')     renderCylinders();
  if (name === 'alerts')        renderAlerts();
  if (name === 'reports')       renderReports();
  if (name === 'licenses')      renderLicenses();
  if (name === 'network')       renderNetwork();
  if (name === 'mgmt-reports')  renderMgmtReports();
}

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => showView(tab.dataset.view));
});

// ══════════════════════════════════════════════════════════════════════════════
// SCANNER INPUT (HID pattern)
// ══════════════════════════════════════════════════════════════════════════════

let inputBuffer = '';
let flushTimer  = null;

function flushBuffer() {
  const data = inputBuffer.trim();
  inputBuffer = '';
  if (data) handleScan(data);
}

scannerInput.addEventListener('input', () => {
  inputBuffer += scannerInput.value;
  scannerInput.value = '';

  if (inputBuffer.includes('\n') || inputBuffer.includes('\r')) {
    clearTimeout(flushTimer);
    flushBuffer();
    return;
  }

  clearTimeout(flushTimer);
  flushTimer = setTimeout(flushBuffer, 300);
});

scannerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    clearTimeout(flushTimer);
    inputBuffer += scannerInput.value;
    scannerInput.value = '';
    flushBuffer();
    e.preventDefault();
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// FOCUS MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

function setFocused(yes) {
  State.focused = yes;
  if (yes) {
    scannerInput.focus();
    focusBtn.classList.add('active');
    focusIcon.textContent = '🟢';
    focusLabel.textContent = 'Scanning active — tap to pause';
    statusBadge.textContent = 'Active';
    statusBadge.className = 'badge badge-active';
  } else {
    scannerInput.blur();
    focusBtn.classList.remove('active');
    focusIcon.textContent = '📡';
    focusLabel.textContent = 'Tap to start scanning';
    statusBadge.textContent = 'Idle';
    statusBadge.className = 'badge badge-idle';
  }
}

focusBtn.addEventListener('click', () => setFocused(!State.focused));

document.addEventListener('click', (e) => {
  if (!State.focused) return;
  const inModal = e.target.closest('.modal-backdrop, .login-overlay, #app-nav, #app-sidebar, .btn, button, input, select, textarea');
  if (!inModal) scannerInput.focus();
});

scannerInput.addEventListener('blur', () => {
  if (State.focused) {
    statusBadge.textContent = 'Unfocused';
    statusBadge.className = 'badge badge-scanning';
  }
});

scannerInput.addEventListener('focus', () => {
  if (State.focused) {
    statusBadge.textContent = 'Active';
    statusBadge.className = 'badge badge-active';
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// SCAN HANDLER
// ══════════════════════════════════════════════════════════════════════════════

async function handleScan(tagId) {
  if (!Auth.session) return;

  // Serial capture mode for register modal
  if (State.serialCaptureActive) {
    $('reg-serial').value = tagId;
    State.serialCaptureActive = false;
    showSnackbar('Serial captured.', 'success');
    return;
  }

  // Only process scans in Scan view
  if (State.activeView !== 'scan') return;

  const ts = nowISO();

  // Show last scan card
  lastScanCard.hidden = false;
  lastScanTime.textContent = formatTime(ts);
  lastScanTag.textContent  = tagId;
  lastScanResult.className = 'last-scan-result';
  lastScanResult.textContent = 'Looking up…';

  // Lookup cylinder
  const cyl = await txGet('cylinders', tagId);

  if (!cyl) {
    // Unknown tag
    if (Auth.can('register')) {
      lastScanResult.className = 'last-scan-result warning';
      lastScanResult.textContent = 'Unknown tag — opening registration…';
      openRegisterModal(tagId);
    } else {
      lastScanResult.className = 'last-scan-result error';
      lastScanResult.textContent = 'Tag not registered.';
    }
    return;
  }

  // LPGMC: filter own cylinders
  if (Auth.session.role === 'lpgmc' && cyl.company !== Auth.session.company) {
    lastScanResult.className = 'last-scan-result error';
    lastScanResult.textContent = `Cylinder belongs to ${escapeHtml(cyl.company)} — not your company.`;
    return;
  }

  if (State.batchMode) {
    // Add to batch queue
    const already = State.batchQueue.find(b => b.id === cyl.id);
    if (already) {
      lastScanResult.className = 'last-scan-result warning';
      lastScanResult.textContent = `${escapeHtml(cyl.serial)} already in batch queue.`;
    } else {
      State.batchQueue.push({ id: cyl.id, serial: cyl.serial, timestamp: ts });
      lastScanResult.className = 'last-scan-result success';
      lastScanResult.textContent = `${escapeHtml(cyl.serial)} added to batch.`;
      renderBatchQueue();
    }
  } else {
    // Immediate commit
    await commitScanEvent(cyl, ts);
  }
}

async function commitScanEvent(cyl, timestamp, overrideType) {
  const eventType = overrideType || State.activeEventType;
  if (!eventType) { showSnackbar('Select an event type first.', 'error'); return; }

  const session = Auth.session;
  const today   = new Date().toISOString().slice(0, 10);
  const event = {
    cylinderId: cyl.id,
    type:       eventType,
    timestamp:  timestamp || nowISO(),
    operatorId: session.operatorId,
    company:    session.company,
    notes:      '',
  };

  await txPut('events', event);

  // Update cylinder status
  const updatedCyl = Object.assign({}, cyl);

  if (eventType === 'refilled') {
    updatedCyl.fillCount = (updatedCyl.fillCount || 0) + 1;
    updatedCyl.status = 'in-refill'; // ready to ship after refill
  } else if (eventType === 'shipped' || eventType === 'dist-received' || eventType === 'ret-received' || eventType === 'dist-sent-retail') {
    updatedCyl.status = 'in-circulation';
  } else if (eventType === 'ret-sold') {
    updatedCyl.status = 'in-use';
  } else if (eventType === 'dist-returned-empty' || eventType === 'ret-returned-empty') {
    updatedCyl.status = 'returning';
  } else if (eventType === 'received-empty') {
    updatedCyl.status = 'refilling';
  } else if (eventType === 'sent-revalidation' || eventType === 'reval-received') {
    updatedCyl.status = 'revalidation';
  } else if (eventType === 'revalidated' || eventType === 'reval-returned') {
    updatedCyl.status = 'in-refill';
    if (eventType === 'revalidated') {
      updatedCyl.fillCount = 0;
      updatedCyl.lastRequalDate = today;
      updatedCyl.requalPlant = session.company;
    }
  }

  await txPut('cylinders', updatedCyl);

  // UI feedback
  lastScanCard.hidden = false;
  lastScanTime.textContent = formatTime(event.timestamp);
  lastScanTag.textContent  = cyl.id;
  lastScanResult.className = 'last-scan-result success';
  lastScanResult.textContent = `${escapeHtml(cyl.serial)} — ${eventType} recorded.`;

  // Prepend to events list
  State.scanEvents.unshift({ ...event, serial: cyl.serial });
  renderScanEvent(State.scanEvents[0], true);
  eventsEmpty.style.display = 'none';

  showSnackbar(`${cyl.serial}: ${eventType}`, 'success');
}

// ══════════════════════════════════════════════════════════════════════════════
// SCAN VIEW RENDERING
// ══════════════════════════════════════════════════════════════════════════════

function renderScanEvent(ev, prepend = false) {
  const li = document.createElement('li');
  li.className = 'scan-event-item';

  const evClass = 'evt-' + ev.type;
  const label   = (ROLE_EVENTS[Auth.session ? Auth.session.role : 'lpgmc'] || [])
    .find(r => r.type === ev.type)?.label || ev.type;

  let meta = formatDateTime(ev.timestamp);
  if (ev.operatorId) meta += ` · ${escapeHtml(ev.operatorId)}`;

  li.innerHTML = `
    <span class="event-type-badge ${escapeHtml(evClass)}">${escapeHtml(label)}</span>
    <div class="event-body">
      <div class="event-serial">${escapeHtml(ev.serial || ev.cylinderId)}</div>
      <div class="event-meta">${meta}</div>
    </div>`;

  if (prepend) eventsList.prepend(li);
  else         eventsList.append(li);
}

function renderBatchQueue() {
  batchQueueSection.hidden = State.batchQueue.length === 0;
  batchCount.textContent   = State.batchQueue.length;
  batchList.innerHTML = '';
  State.batchQueue.forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="tag-serial">${escapeHtml(item.serial)}</span>
      <span class="tag-id">${escapeHtml(item.id)}</span>
      <button class="tag-remove" data-idx="${idx}" type="button" title="Remove">✕</button>`;
    li.querySelector('.tag-remove').addEventListener('click', () => {
      State.batchQueue.splice(idx, 1);
      renderBatchQueue();
    });
    batchList.appendChild(li);
  });
}

batchModeToggle.addEventListener('change', () => {
  State.batchMode = batchModeToggle.checked;
  if (!State.batchMode) {
    State.batchQueue = [];
    renderBatchQueue();
  }
});

batchCommitBtn.addEventListener('click', async () => {
  if (!State.batchQueue.length) return;
  const items = [...State.batchQueue];
  State.batchQueue = [];
  renderBatchQueue();
  let count = 0;
  for (const item of items) {
    const cyl = await txGet('cylinders', item.id);
    if (cyl) { await commitScanEvent(cyl, item.timestamp); count++; }
  }
  showSnackbar(`Committed ${count} events.`, 'success');
});

batchClearBtn.addEventListener('click', () => {
  State.batchQueue = [];
  renderBatchQueue();
});

// Export events CSV
exportEventsBtn.addEventListener('click', () => {
  if (!State.scanEvents.length) { showSnackbar('No events to export.'); return; }
  const header = 'cylinderId,serial,type,timestamp,operatorId,company\n';
  const rows = State.scanEvents.map(ev =>
    `"${ev.cylinderId}","${ev.serial || ''}","${ev.type}","${ev.timestamp}","${ev.operatorId || ''}","${ev.company || ''}"`
  ).join('\n');
  downloadCSV('lpg-events-' + new Date().toISOString().slice(0,10) + '.csv', header + rows);
});

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER CYLINDER MODAL
// ══════════════════════════════════════════════════════════════════════════════

function openRegisterModal(tagId) {
  const company = Auth.session ? Auth.session.company : '';
  const today   = new Date().toISOString().slice(0, 10);
  regTag.value            = tagId || '';
  regSerial.value         = '';
  regBrandColour.value    = '';
  regBrandName.value      = company;
  regManufacturer.value   = company;
  regProductName.value    = 'LPG';
  regManufDate.value      = today;
  regRequalDate.value     = '';
  regRequalPlant.value    = '';
  regWaterCapacity.value  = '26.1';
  regTare.value           = '14.5';
  regNetWeight.value      = '12';
  regGrossWeight.value    = '26.5';
  regMaxFills.value       = '500';
  regPressureTest.value   = '';
  regHydrotest.value      = today;
  regCompanyBrand.value   = company;
  regCustomerSvc.value    = '';
  regEmergency.value      = '';
  regNotes.value          = '';
  openModal('modal-register');
}

// "+ Register" button in cylinders view header (LPGMC only)
if (registerCylBtn) {
  registerCylBtn.addEventListener('click', () => {
    openRegisterModal('');
  });
}

regSubmitBtn.addEventListener('click', async () => {
  const tagId  = regTag.value.trim();
  const serial = regSerial.value.trim();
  if (!serial) { showSnackbar('Serial number is required.', 'error'); return; }

  // Check serial uniqueness
  const allCyls = await txGetAll('cylinders');
  if (allCyls.find(c => c.serial === serial)) {
    showSnackbar('Serial number already exists.', 'error'); return;
  }

  const cyl = {
    id:                   tagId,
    serial:               serial,
    company:              Auth.session.company,
    brandColourMark:      regBrandColour.value.trim(),
    ownerBrandName:       regBrandName.value.trim(),
    manufacturer:         regManufacturer.value.trim(),
    productName:          regProductName.value.trim(),
    manufactureDate:      regManufDate.value,
    lastRequalDate:       regRequalDate.value,
    requalPlant:          regRequalPlant.value.trim(),
    waterCapacity:        parseFloat(regWaterCapacity.value) || 26.1,
    tareWeight:           parseFloat(regTare.value) || 14.5,
    netWeight:            parseFloat(regNetWeight.value) || 12,
    capacity:             parseFloat(regNetWeight.value) || 12,
    grossWeight:          parseFloat(regGrossWeight.value) || 26.5,
    maxFills:             parseInt(regMaxFills.value, 10) || 500,
    fillCount:            0,
    pressureTestValue:    regPressureTest.value.trim(),
    lastHydroTest:        regHydrotest.value,
    companyBrandName:     regCompanyBrand.value.trim(),
    customerServiceNumber: regCustomerSvc.value.trim(),
    emergencyContacts:    regEmergency.value.trim(),
    status:               'in-refill',
    notes:                regNotes.value.trim(),
  };

  await txPut('cylinders', cyl);

  const event = {
    cylinderId: cyl.id,
    type:       'registered',
    timestamp:  nowISO(),
    operatorId: Auth.session.operatorId,
    company:    Auth.session.company,
    notes:      'Newly registered',
  };
  await txPut('events', event);

  if (State.activeView === 'scan') {
    State.scanEvents.unshift({ ...event, serial: cyl.serial });
    renderScanEvent(State.scanEvents[0], true);
    eventsEmpty.style.display = 'none';

    lastScanResult.className  = 'last-scan-result success';
    lastScanResult.textContent = `${serial} registered successfully.`;
  }

  closeModal('modal-register');
  showSnackbar(`${serial} registered.`, 'success');
  renderCylinders();
});

regSerialScanBtn.addEventListener('click', () => {
  State.serialCaptureActive = true;
  scannerInput.focus();
  showSnackbar('Ready — scan the serial barcode now…');
});

// ══════════════════════════════════════════════════════════════════════════════
// CYLINDERS VIEW
// ══════════════════════════════════════════════════════════════════════════════

let _cylAllData = [];

async function renderCylinders() {
  _cylAllData = await txGetAll('cylinders');

  // Filter by company for LPGMC
  if (Auth.session && Auth.session.role === 'lpgmc') {
    _cylAllData = _cylAllData.filter(c => c.company === Auth.session.company);
  }

  applyCylFilters();
}

function applyCylFilters() {
  const q       = cylSearch.value.toLowerCase().trim();
  const statusF = cylFilterStatus.value;
  const compF   = cylFilterCompany.value;

  let data = _cylAllData;
  if (q)       data = data.filter(c => c.serial.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  if (statusF) data = data.filter(c => c.status === statusF);
  if (compF)   data = data.filter(c => c.company === compF);

  // Stats
  const statuses = { 'in-refill': 0, 'in-circulation': 0, refilling: 0, returning: 0, revalidation: 0, 'in-use': 0 };
  _cylAllData.forEach(c => { if (statuses[c.status] !== undefined) statuses[c.status]++; });
  const statLabels = {
    'in-refill':      'In Refill',
    'in-circulation': 'In Circulation',
    'refilling':      'Refilling',
    'returning':      'Returning',
    'revalidation':   'Revalidation',
    'in-use':         'In Use',
  };
  cylStats.innerHTML = Object.entries(statuses).map(([k, v]) =>
    `<div class="stat-chip">
       <span class="stat-chip-value">${v}</span>
       <span class="stat-chip-label">${statLabels[k] || k}</span>
     </div>`
  ).join('');

  cylindersList.innerHTML = '';
  if (!data.length) {
    cylindersEmpty.style.display = '';
    return;
  }
  cylindersEmpty.style.display = 'none';

  const statLabelMap = {
    'in-refill':      'In Refill',
    'in-circulation': 'In Circulation',
    'refilling':      'Refilling',
    'returning':      'Returning',
    'revalidation':   'In Revalidation',
    'in-use':         'In Use',
  };

  data.forEach(cyl => {
    const li = document.createElement('li');
    li.className = 'cylinder-item';

    const fillPct = Math.min(100, Math.round((cyl.fillCount / cyl.maxFills) * 100));
    const fillClass = fillPct >= 95 ? 'crit' : fillPct >= 80 ? 'warn' : '';
    const dotClass  = 'dot-' + (cyl.status || 'in-refill');
    const statClass = 'status-' + (cyl.status || 'in-refill');
    const statLabel = statLabelMap[cyl.status] || cyl.status;

    li.innerHTML = `
      <span class="cylinder-status-dot ${escapeHtml(dotClass)}"></span>
      <div class="cylinder-body">
        <div class="cylinder-serial">${escapeHtml(cyl.serial)}</div>
        <div class="cylinder-tag">${escapeHtml(cyl.id)}</div>
        <div class="cylinder-meta">
          <span class="cylinder-meta-item">${escapeHtml(cyl.company)}</span>
          <span class="cylinder-meta-item">Fills: ${cyl.fillCount}/${cyl.maxFills}</span>
          ${cyl.manufactureDate ? `<span class="cylinder-meta-item">Mfg: ${escapeHtml(cyl.manufactureDate)}</span>` : ''}
        </div>
      </div>
      <div class="cylinder-badges">
        <span class="status-badge ${escapeHtml(statClass)}">${escapeHtml(statLabel)}</span>
        <div class="fill-bar">
          <div class="fill-bar-inner ${escapeHtml(fillClass)}" style="width:${fillPct}%"></div>
        </div>
      </div>`;

    li.addEventListener('click', () => openPassportModal(cyl.id));
    cylindersList.appendChild(li);
  });
}

cylSearch.addEventListener('input',         applyCylFilters);
cylFilterStatus.addEventListener('change',  applyCylFilters);
cylFilterCompany.addEventListener('change', applyCylFilters);

// Export cylinders CSV
if (exportDashboardBtn) {
  exportDashboardBtn.addEventListener('click', async () => {
    let cyls = await txGetAll('cylinders');
    if (Auth.session && Auth.session.role === 'lpgmc') {
      cyls = cyls.filter(c => c.company === Auth.session.company);
    }
    const header = 'id,serial,company,status,fillCount,maxFills,manufactureDate,lastHydroTest\n';
    const rows = cyls.map(c =>
      `"${c.id}","${c.serial}","${c.company}","${c.status}","${c.fillCount}","${c.maxFills}","${c.manufactureDate || ''}","${c.lastHydroTest || ''}"`
    ).join('\n');
    downloadCSV('lpg-cylinders-' + new Date().toISOString().slice(0,10) + '.csv', header + rows);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// CYLINDER PASSPORT MODAL
// ══════════════════════════════════════════════════════════════════════════════

async function openPassportModal(cylId) {
  State.passportCylinderId = cylId;
  const cyl = await txGet('cylinders', cylId);
  if (!cyl) return;

  const events = await txGetIndex('events', 'cylinderId', cylId);
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const fillPct = Math.min(100, Math.round((cyl.fillCount / cyl.maxFills) * 100));

  passportBody.innerHTML = `
    <div class="passport-section">
      <div class="passport-section-title">Identity</div>
      <div class="passport-row">
        <span class="passport-key">Serial</span>
        <span class="passport-value">${escapeHtml(cyl.serial)}</span>
      </div>
      <div class="passport-row">
        <span class="passport-key">RFID Tag</span>
        <span class="passport-value mono">${escapeHtml(cyl.id)}</span>
      </div>
      <div class="passport-row">
        <span class="passport-key">Company</span>
        <span class="passport-value">${escapeHtml(cyl.company)}</span>
      </div>
      <div class="passport-row">
        <span class="passport-key">Status</span>
        <span class="passport-value">${escapeHtml(cyl.status)}</span>
      </div>
    </div>
    <div class="passport-section">
      <div class="passport-section-title">Cylinder Marking</div>
      ${cyl.ownerBrandName ? `<div class="passport-row"><span class="passport-key">Brand Name</span><span class="passport-value">${escapeHtml(cyl.ownerBrandName)}</span></div>` : ''}
      ${cyl.brandColourMark ? `<div class="passport-row"><span class="passport-key">Colour &amp; Mark</span><span class="passport-value">${escapeHtml(cyl.brandColourMark)}</span></div>` : ''}
      ${cyl.manufacturer ? `<div class="passport-row"><span class="passport-key">Manufacturer</span><span class="passport-value">${escapeHtml(cyl.manufacturer)}</span></div>` : ''}
      ${cyl.productName ? `<div class="passport-row"><span class="passport-key">Product</span><span class="passport-value">${escapeHtml(cyl.productName)}</span></div>` : ''}
      ${cyl.pressureTestValue ? `<div class="passport-row"><span class="passport-key">Pressure Test</span><span class="passport-value">${escapeHtml(cyl.pressureTestValue)}</span></div>` : ''}
      ${cyl.lastRequalDate ? `<div class="passport-row"><span class="passport-key">Last Requalification</span><span class="passport-value">${formatDate(cyl.lastRequalDate)}${cyl.requalPlant ? ' · ' + escapeHtml(cyl.requalPlant) : ''}</span></div>` : ''}
      ${cyl.customerServiceNumber ? `<div class="passport-row"><span class="passport-key">Customer Service</span><span class="passport-value">${escapeHtml(cyl.customerServiceNumber)}</span></div>` : ''}
      ${cyl.emergencyContacts ? `<div class="passport-row"><span class="passport-key">Emergency Contacts</span><span class="passport-value">${escapeHtml(cyl.emergencyContacts)}</span></div>` : ''}
    </div>
    <div class="passport-section">
      <div class="passport-section-title">Specifications</div>
      <div class="passport-row">
        <span class="passport-key">Manufacture Date</span>
        <span class="passport-value">${formatDate(cyl.manufactureDate)}</span>
      </div>
      <div class="passport-row">
        <span class="passport-key">Tare Weight</span>
        <span class="passport-value">${cyl.tareWeight} kg</span>
      </div>
      ${cyl.waterCapacity ? `<div class="passport-row"><span class="passport-key">Water Capacity</span><span class="passport-value">${cyl.waterCapacity} L</span></div>` : ''}
      <div class="passport-row">
        <span class="passport-key">Net Weight</span>
        <span class="passport-value">${cyl.netWeight || cyl.capacity} kg</span>
      </div>
      ${cyl.grossWeight ? `<div class="passport-row"><span class="passport-key">Gross Weight</span><span class="passport-value">${cyl.grossWeight} kg</span></div>` : ''}
      <div class="passport-row">
        <span class="passport-key">Max Fills</span>
        <span class="passport-value">${cyl.maxFills}</span>
      </div>
    </div>
    <div class="passport-section">
      <div class="passport-section-title">Operational</div>
      <div class="passport-row">
        <span class="passport-key">Fill Count</span>
        <span class="passport-value">${cyl.fillCount} (${fillPct}%)</span>
      </div>
      <div class="passport-row">
        <span class="passport-key">Last Hydro Test</span>
        <span class="passport-value">${formatDate(cyl.lastHydroTest)}</span>
      </div>
      ${cyl.notes ? `<div class="passport-row"><span class="passport-key">Notes</span><span class="passport-value">${escapeHtml(cyl.notes)}</span></div>` : ''}
    </div>
    <div class="passport-section">
      <div class="passport-section-title">Event History (${events.length})</div>
      <ul class="passport-history">
        ${events.length ? events.map(ev => `
          <li>
            <span class="ph-time">${formatDateTime(ev.timestamp)}</span>
            <span class="ph-desc">${escapeHtml(ev.type)}${ev.operatorId ? ' · ' + escapeHtml(ev.operatorId) : ''}${ev.newTagId ? ' → new tag: ' + escapeHtml(ev.newTagId) : ''}${ev.previousTagId ? ' ← prev tag: ' + escapeHtml(ev.previousTagId) : ''}</span>
          </li>`).join('') : '<li><span class="ph-desc">No events.</span></li>'}
      </ul>
    </div>`;

  openModal('modal-passport');
}

passportExportBtn.addEventListener('click', async () => {
  if (!State.passportCylinderId) return;
  const cyl = await txGet('cylinders', State.passportCylinderId);
  if (!cyl) return;
  const events = await txGetIndex('events', 'cylinderId', cyl.id);
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  let text = `LPG Cylinder Passport\n${'='.repeat(40)}\n`;
  text += `Serial:   ${cyl.serial}\nTag:      ${cyl.id}\nCompany:  ${cyl.company}\nStatus:   ${cyl.status}\n`;
  text += `Fills:    ${cyl.fillCount}/${cyl.maxFills}\nHydro:    ${cyl.lastHydroTest || 'N/A'}\n\nEvents:\n`;
  events.forEach(ev => { text += `  ${ev.timestamp}  ${ev.type}  ${ev.operatorId || ''}\n`; });

  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `passport-${cyl.serial}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
});

// ══════════════════════════════════════════════════════════════════════════════
// ALERTS VIEW
// ══════════════════════════════════════════════════════════════════════════════

let _alertsData = [];

async function renderAlerts() {
  let cyls = await txGetAll('cylinders');
  if (Auth.session?.role === 'lpgmc') {
    cyls = cyls.filter(c => c.company === Auth.session.company);
  }

  const now = new Date();
  const allEvents = await txGetAll('events');
  _alertsData = [];

  for (const cyl of cyls) {
    // 1. Requalification due: 10 years since manufacture or lastRequalDate
    const baseDate = cyl.lastRequalDate || cyl.manufactureDate;
    if (baseDate) {
      const base = new Date(baseDate + 'T00:00:00');
      const dueDate = new Date(base);
      dueDate.setFullYear(dueDate.getFullYear() + 10);
      const daysUntilDue = Math.floor((dueDate - now) / (24*60*60*1000));
      if (daysUntilDue <= 0) {
        _alertsData.push({ severity:'critical', type:'requalification-overdue', cylinder:cyl,
          title: `${cyl.serial} — Requalification Overdue`,
          desc: `Due ${Math.abs(daysUntilDue)} days ago. Last: ${baseDate}.` });
      } else if (daysUntilDue <= 365) {
        _alertsData.push({ severity:'warning', type:'requalification-due', cylinder:cyl,
          title: `${cyl.serial} — Requalification Due Soon`,
          desc: `Due in ${daysUntilDue} days (${dueDate.toISOString().slice(0,10)}).` });
      }
    }

    // 2. Stuck in refilling > 7 days
    if (cyl.status === 'refilling') {
      const cylEvents = allEvents.filter(e => e.cylinderId === cyl.id)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      const lastEv = cylEvents[0];
      if (lastEv) {
        const days = Math.floor((now - new Date(lastEv.timestamp)) / (24*60*60*1000));
        if (days > 7) {
          _alertsData.push({ severity:'critical', type:'stuck-refilling', cylinder:cyl,
            title: `${cyl.serial} — Stuck in Refill (${days}d)`,
            desc: `Cylinder has been at refill station for ${days} days with no update.` });
        }
      }
    }

    // 3. Returning but not received > 3 days
    if (cyl.status === 'returning') {
      const cylEvents = allEvents.filter(e => e.cylinderId === cyl.id)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      const lastEv = cylEvents[0];
      if (lastEv) {
        const days = Math.floor((now - new Date(lastEv.timestamp)) / (24*60*60*1000));
        if (days > 3) {
          _alertsData.push({ severity:'warning', type:'not-received', cylinder:cyl,
            title: `${cyl.serial} — Not Received at Plant (${days}d)`,
            desc: `Reported empty ${days} days ago but not yet received at refilling site.` });
        }
      }
    }
  }

  applyAlertFilters();
}

function applyAlertFilters() {
  const sevF  = alertFilterSeverity.value;
  const typeF = alertFilterType.value;

  let data = _alertsData;
  if (sevF)  data = data.filter(a => a.severity === sevF);
  if (typeF) data = data.filter(a => a.type === typeF);

  // Summary chips
  const counts = { critical: 0, warning: 0, info: 0 };
  _alertsData.forEach(a => { if (counts[a.severity] !== undefined) counts[a.severity]++; });
  alertSummary.innerHTML = Object.entries(counts)
    .filter(([,v]) => v > 0)
    .map(([k, v]) => `<span class="alert-summary-chip chip-${escapeHtml(k)}">${v} ${k}</span>`)
    .join('');

  alertsList.innerHTML = '';
  if (!data.length) { alertsEmpty.style.display = ''; return; }
  alertsEmpty.style.display = 'none';

  data.forEach(al => {
    const li = document.createElement('li');
    li.className = 'alert-item';
    li.innerHTML = `
      <div class="alert-severity-bar sev-${escapeHtml(al.severity)}"></div>
      <div class="alert-body">
        <div class="alert-title">${escapeHtml(al.title)}</div>
        <div class="alert-desc">${escapeHtml(al.desc)}</div>
        <div class="alert-meta">${escapeHtml(al.cylinder.company)} · ${escapeHtml(al.severity)}</div>
      </div>`;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => openPassportModal(al.cylinder.id));
    alertsList.appendChild(li);
  });
}

alertFilterSeverity.addEventListener('change', applyAlertFilters);
alertFilterType.addEventListener('change',     applyAlertFilters);

// ══════════════════════════════════════════════════════════════════════════════
// REPORTS / DASHBOARD VIEW
// ══════════════════════════════════════════════════════════════════════════════

async function renderReports() {
  let cyls   = await txGetAll('cylinders');
  let events = await txGetAll('events');
  const role = Auth.session ? Auth.session.role : null;
  const actSec = $('report-activity-section');

  if (role === 'lpgmc') {
    cyls = cyls.filter(c => c.company === Auth.session.company);
    const ownIds = new Set(cyls.map(c => c.id));
    events = events.filter(e => ownIds.has(e.cylinderId));

    const inRefill       = cyls.filter(c => c.status === 'in-refill').length;
    const refilling      = cyls.filter(c => c.status === 'refilling').length;
    const returning      = cyls.filter(c => c.status === 'returning').length;
    const inCirculation  = cyls.filter(c => c.status === 'in-circulation').length;
    const inRevalidation = cyls.filter(c => c.status === 'revalidation').length;
    const inUse          = cyls.filter(c => c.status === 'in-use').length;
    const total          = inRefill + refilling + returning + inCirculation + inRevalidation + inUse;

    const allLicenses   = await txGetAll('licenses');
    const refillerCount = allLicenses.filter(l => l.companyType === 'LPGMC').length;
    const distCount     = allLicenses.filter(l => l.companyType === 'Distributor').length;
    const retailCount   = allLicenses.filter(l => l.companyType === 'Retailer').length;

    reportsGrid.innerHTML = `
      <div class="dashboard-section-title">Cylinder Lifecycle</div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--green)">${inRefill}</span>
        <div class="report-card-label">In Refill</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--amber)">${refilling}</span>
        <div class="report-card-label">Refilling</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--pink)">${returning}</span>
        <div class="report-card-label">Returning</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--blue)">${inCirculation}</span>
        <div class="report-card-label">In Circulation</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--teal)">${inRevalidation}</span>
        <div class="report-card-label">In Revalidation</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--purple)">${inUse}</span>
        <div class="report-card-label">In Use</div>
      </div>
      <div class="report-card report-card-full">
        <span class="report-card-value">${total}</span>
        <div class="report-card-label">Total Cylinders</div>
      </div>`;

    if (actSec) actSec.style.display = 'none';

    reportChart.innerHTML = `
      <div class="section-header" style="margin-top:8px">
        <span>Supply Chain</span>
      </div>
      <div class="supply-chain-row">
        <div class="supply-chain-card">
          <span class="supply-chain-value">${refillerCount}</span>
          <div class="supply-chain-label">Refilling Sites</div>
        </div>
        <div class="supply-chain-card">
          <span class="supply-chain-value" style="color:var(--amber)">${distCount}</span>
          <div class="supply-chain-label">Distributors</div>
        </div>
        <div class="supply-chain-card">
          <span class="supply-chain-value" style="color:var(--purple)">${retailCount}</span>
          <div class="supply-chain-label">Retailers</div>
        </div>
      </div>`;
  } else {
    if (actSec) actSec.style.display = '';

    const total     = cyls.length;
    const inRefill  = cyls.filter(c => c.status === 'in-refill').length;
    const inCirc    = cyls.filter(c => c.status === 'in-circulation').length;
    const returning = cyls.filter(c => c.status === 'returning').length;

    reportsGrid.innerHTML = `
      <div class="report-card">
        <span class="report-card-value">${total}</span>
        <div class="report-card-label">Total Cylinders</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--green)">${inRefill}</span>
        <div class="report-card-label">In Refill</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--blue)">${inCirc}</span>
        <div class="report-card-label">In Circulation</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--pink)">${returning}</span>
        <div class="report-card-label">Returning</div>
      </div>`;

    const now = Date.now();
    const cutoff = now - 30 * 24 * 60 * 60 * 1000;
    const recentEvents = events.filter(e => new Date(e.timestamp).getTime() >= cutoff);
    const typeCounts = {};
    recentEvents.forEach(e => { typeCounts[e.type] = (typeCounts[e.type] || 0) + 1; });
    const maxCount = Math.max(...Object.values(typeCounts), 1);

    reportChart.innerHTML = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => {
        const pct = Math.round((count / maxCount) * 100);
        return `<div class="chart-row">
          <span class="chart-label">${escapeHtml(type)}</span>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width:${pct}%"><span>${count}</span></div>
          </div>
        </div>`;
      }).join('') || '<p style="padding:16px 0;color:var(--dim);font-size:13px">No activity in last 30 days.</p>';
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// NETWORK VIEW
// ══════════════════════════════════════════════════════════════════════════════

let _networkMap = null;
let _networkMarkers = [];

async function renderNetwork() {
  const networkList = $('network-list');
  const networkEmpty = $('network-empty');

  // Initialize Leaflet map lazily
  if (!_networkMap) {
    _networkMap = L.map('network-map', { zoomControl: true }).setView([-6.3, 35.7], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(_networkMap);
  }

  // Clear old markers
  _networkMarkers.forEach(m => m.remove());
  _networkMarkers = [];

  // Current filter
  const activeFilterBtn = document.querySelector('.network-filters .btn-primary');
  const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : '';

  const filtered = activeFilter
    ? DEMO_NETWORK.filter(n => n.type === activeFilter)
    : DEMO_NETWORK;

  // Render list
  networkList.innerHTML = '';
  if (!filtered.length) {
    networkEmpty.style.display = '';
  } else {
    networkEmpty.style.display = 'none';
    filtered.forEach(partner => {
      const li = document.createElement('li');
      li.className = 'network-item';
      const typeClass = 'type-' + partner.type.toLowerCase();
      li.innerHTML = `
        <div class="network-item-header">
          <span class="network-item-name">${escapeHtml(partner.name)}</span>
          <span class="network-type-badge ${escapeHtml(typeClass)}">${escapeHtml(partner.type)}</span>
        </div>
        <div class="network-item-meta">
          📍 ${escapeHtml(partner.city)} · ${escapeHtml(partner.address)}<br>
          📞 ${escapeHtml(partner.contact)} ·
          <span class="network-item-cyls">🛢 ${partner.cylinders} cylinders</span> ·
          <span class="network-status-${escapeHtml(partner.status)}">${escapeHtml(partner.status)}</span>
        </div>`;
      networkList.appendChild(li);

      // Add marker
      const color = partner.type === 'Distributor' ? '#3b82f6' : '#10b981';
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      const marker = L.marker([partner.lat, partner.lng], { icon })
        .addTo(_networkMap)
        .bindPopup(`<strong>${partner.name}</strong><br>${partner.type}<br>${partner.city}<br>${partner.cylinders} cylinders`);
      _networkMarkers.push(marker);
    });
  }

  // Invalidate map size after DOM paint
  setTimeout(() => { if (_networkMap) _networkMap.invalidateSize(); }, 100);
}

// Network filter buttons
document.querySelectorAll('.network-filters .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.network-filters .btn').forEach(b => {
      b.className = 'btn btn-sm btn-outline';
    });
    btn.className = 'btn btn-sm btn-primary';
    renderNetwork();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// MGMT REPORTS VIEW
// ══════════════════════════════════════════════════════════════════════════════

async function renderMgmtReports() {
  const grid = $('mgmt-reports-grid');
  if (!grid) return;

  const allCyls   = await txGetAll('cylinders');
  const allEvents = await txGetAll('events');
  const role = Auth.session ? Auth.session.role : null;

  let cyls = allCyls;
  if (role === 'lpgmc' && Auth.session) {
    cyls = cyls.filter(c => c.company === Auth.session.company);
  }

  // 1. Cylinders by status
  const statusCounts = {
    'in-refill':      cyls.filter(c => c.status === 'in-refill').length,
    'in-circulation': cyls.filter(c => c.status === 'in-circulation').length,
    'refilling':      cyls.filter(c => c.status === 'refilling').length,
    'returning':      cyls.filter(c => c.status === 'returning').length,
    'revalidation':   cyls.filter(c => c.status === 'revalidation').length,
    'in-use':         cyls.filter(c => c.status === 'in-use').length,
  };
  const statusColors = {
    'in-refill':      'var(--green)',
    'in-circulation': 'var(--blue)',
    'refilling':      'var(--amber)',
    'returning':      'var(--pink)',
    'revalidation':   'var(--teal)',
    'in-use':         'var(--purple)',
  };
  const statusLabels = {
    'in-refill':      'In Refill',
    'in-circulation': 'In Circulation',
    'refilling':      'Refilling',
    'returning':      'Returning',
    'revalidation':   'Revalidation',
    'in-use':         'In Use',
  };
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);
  const statusBarsHtml = Object.entries(statusCounts).map(([k, v]) => {
    const pct = Math.round((v / maxStatusCount) * 100);
    return `<div class="mgmt-bar-row">
      <span class="mgmt-bar-label">${statusLabels[k]}</span>
      <div class="mgmt-bar-track">
        <div class="mgmt-bar-fill" style="width:${pct}%;background:${statusColors[k]}">
          <span>${v}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  // 2. Monthly fills last 6 months
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      year:  d.getFullYear(),
      month: d.getMonth(),
      count: 0,
    });
  }
  allEvents.forEach(ev => {
    if (ev.type !== 'refilled') return;
    const d = new Date(ev.timestamp);
    const m = months.find(mo => mo.year === d.getFullYear() && mo.month === d.getMonth());
    if (m) m.count++;
  });
  const maxFills = Math.max(...months.map(m => m.count), 1);
  const fillBarsHtml = months.map(m => {
    const pct = Math.round((m.count / maxFills) * 100);
    return `<div class="mgmt-bar-row">
      <span class="mgmt-bar-label">${m.label}</span>
      <div class="mgmt-bar-track">
        <div class="mgmt-bar-fill" style="width:${pct}%;background:var(--blue)">
          <span>${m.count}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  // 3. Top 5 partners by cylinder count from DEMO_NETWORK
  const top5 = [...DEMO_NETWORK]
    .sort((a, b) => b.cylinders - a.cylinders)
    .slice(0, 5);
  const maxPartnerCyls = Math.max(...top5.map(p => p.cylinders), 1);
  const partnerBarsHtml = top5.map(p => {
    const pct = Math.round((p.cylinders / maxPartnerCyls) * 100);
    const color = p.type === 'Distributor' ? 'var(--blue)' : 'var(--green)';
    return `<div class="mgmt-bar-row">
      <span class="mgmt-bar-label" title="${p.name}">${p.name.length > 16 ? p.name.slice(0,14) + '…' : p.name}</span>
      <div class="mgmt-bar-track">
        <div class="mgmt-bar-fill" style="width:${pct}%;background:${color}">
          <span>${p.cylinders}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  // 4. Cylinders needing requalification within 2 years
  const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;
  const requalSoon = cyls.filter(c => {
    const baseDate = c.lastRequalDate || c.manufactureDate;
    if (!baseDate) return false;
    const base = new Date(baseDate + 'T00:00:00');
    const dueDate = new Date(base);
    dueDate.setFullYear(dueDate.getFullYear() + 10);
    const msUntilDue = dueDate - now;
    return msUntilDue <= twoYears; // due within 2 years (or overdue)
  }).length;

  grid.innerHTML = `
    <div class="mgmt-card">
      <div class="mgmt-card-title">Cylinders by Status</div>
      ${statusBarsHtml}
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-title">Monthly Fills (Last 6 Months)</div>
      ${fillBarsHtml}
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-title">Top 5 Partners by Cylinder Count</div>
      ${partnerBarsHtml}
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-title">Requalification Due (Next 2 Years)</div>
      <div class="mgmt-stat-big" style="color:${requalSoon > 10 ? 'var(--red)' : requalSoon > 5 ? 'var(--amber)' : 'var(--green)'}">${requalSoon}</div>
      <div class="mgmt-stat-desc">cylinders need requalification within 24 months</div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// LICENSES VIEW (Government only)
// ══════════════════════════════════════════════════════════════════════════════

let _licensesData = [];

async function renderLicenses() {
  if (!Auth.can('license')) return;
  _licensesData = await txGetAll('licenses');
  applyLicenseFilters();
}

function applyLicenseFilters() {
  const q      = licSearch.value.toLowerCase().trim();
  const typeF  = licFilterType.value;
  const statF  = licFilterStatus.value;

  let data = _licensesData;
  if (q)      data = data.filter(l => l.companyName.toLowerCase().includes(q) || l.licenseNumber.toLowerCase().includes(q));
  if (typeF)  data = data.filter(l => l.companyType === typeF);
  if (statF)  data = data.filter(l => l.status === statF);

  licensesList.innerHTML = '';
  if (!data.length) { licensesEmpty.style.display = ''; return; }
  licensesEmpty.style.display = 'none';

  data.forEach(lic => {
    const li = document.createElement('li');
    li.className = 'license-item';
    li.innerHTML = `
      <div class="license-body">
        <div class="license-company">${escapeHtml(lic.companyName)}</div>
        <div class="license-number">${escapeHtml(lic.licenseNumber)}</div>
        <div class="license-dates">Issued: ${formatDate(lic.issuedDate)} · Expires: ${formatDate(lic.expiryDate)}</div>
      </div>
      <div class="license-badges">
        <span class="type-chip type-${escapeHtml(lic.companyType)}">${escapeHtml(lic.companyType)}</span>
        <span class="lic-status-badge lic-${escapeHtml(lic.status)}">${escapeHtml(lic.status)}</span>
      </div>`;
    licensesList.appendChild(li);
  });
}

licSearch.addEventListener('input',         applyLicenseFilters);
licFilterType.addEventListener('change',    applyLicenseFilters);
licFilterStatus.addEventListener('change',  applyLicenseFilters);

issueLicenseBtn.addEventListener('click', () => {
  licCompanyName.value = '';
  licCompanyType.value = 'LPGMC';
  licNumber.value      = '';
  licIssuedDate.value  = new Date().toISOString().slice(0,10);
  licExpiryDate.value  = '';
  licStatus.value      = 'active';
  openModal('modal-issue-license');
});

licSubmitBtn.addEventListener('click', async () => {
  const companyName = licCompanyName.value.trim();
  const companyType = licCompanyType.value;
  const number      = licNumber.value.trim();
  const issued      = licIssuedDate.value;
  const expiry      = licExpiryDate.value;
  const status      = licStatus.value;

  if (!companyName || !number || !issued || !expiry) {
    showSnackbar('Please fill in all required fields.', 'error'); return;
  }

  const lic = {
    id:           'LIC-' + Date.now(),
    companyName,
    companyType,
    licenseNumber: number,
    issuedDate:   issued,
    expiryDate:   expiry,
    status,
  };

  await txPut('licenses', lic);
  closeModal('modal-issue-license');
  showSnackbar(`License ${number} issued.`, 'success');
  renderLicenses();
});

// ══════════════════════════════════════════════════════════════════════════════
// MODAL CLOSE HANDLERS
// ══════════════════════════════════════════════════════════════════════════════

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(btn.dataset.close);
    if (btn.dataset.close === 'modal-register') {
      State.serialCaptureActive = false;
    }
  });
});

// Close modal on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.hidden = true;
      if (backdrop.id === 'modal-register') {
        State.serialCaptureActive = false;
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LOGOUT
// ══════════════════════════════════════════════════════════════════════════════

logoutBtn.addEventListener('click', () => {
  // Reset UI
  State.focused = false;
  setFocused(false);
  State.scanEvents    = [];
  State.batchQueue    = [];
  State.batchMode     = false;
  batchModeToggle.checked = false;

  headerRoleBadge.hidden = true;
  headerOpPill.hidden    = true;
  logoutBtn.hidden       = true;
  eventsList.innerHTML   = '';
  eventsEmpty.style.display = '';
  lastScanCard.hidden    = true;

  // Destroy network map so it re-initializes on next visit
  if (_networkMap) {
    _networkMap.remove();
    _networkMap = null;
  }

  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  Auth.logout();
});

// ══════════════════════════════════════════════════════════════════════════════
// CSV DOWNLOAD HELPER
// ══════════════════════════════════════════════════════════════════════════════

function downloadCSV(filename, content) {
  const blob = new Blob([content], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ══════════════════════════════════════════════════════════════════════════════
// SERVICE WORKER
// ══════════════════════════════════════════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════════════════

async function init() {
  await openDB();
  await seedDemoData();

  Auth.load();

  if (Auth.session) {
    hideLoginOverlay();
    applySession();
  } else {
    showLoginOverlay();
  }
}

init().catch(err => {
  console.error('LPG Tracer init error:', err);
  showSnackbar('Startup error. Please reload.', 'error');
});
