'use strict';

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & DEMO DATA
// ══════════════════════════════════════════════════════════════════════════════

const DB_NAME    = 'lpg-tracer-db';
const DB_VERSION = 2;
const SEED_KEY   = 'seeded-v2';

const DEMO_CYLINDERS = [
  { id:'E280116060000204C3F04E81', serial:'LPG-2018-001', company:'Vivo LPG',       manufactureDate:'2018-03-15', tareWeight:14.5, capacity:12, maxFills:500, fillCount:342, lastHydroTest:'2020-12-20', status:'available',  notes:'' },
  { id:'E280116060000204C3F04E82', serial:'LPG-2019-002', company:'Vivo LPG',       manufactureDate:'2019-06-10', tareWeight:14.5, capacity:12, maxFills:500, fillCount:461, lastHydroTest:'2024-06-10', status:'in-use',     notes:'' },
  { id:'E280116060000204C3F04E83', serial:'LPG-2020-003', company:'Vivo LPG',       manufactureDate:'2020-01-22', tareWeight:14.5, capacity:12, maxFills:500, fillCount:156, lastHydroTest:'2025-03-20', status:'available',  notes:'' },
  { id:'E280116060000204C3F04E84', serial:'LPG-2018-004', company:'Vivo LPG',       manufactureDate:'2018-09-05', tareWeight:14.5, capacity:12, maxFills:500, fillCount:502, lastHydroTest:'2020-08-12', status:'condemned',  notes:'Exceeded max fills. Condemned 2026-03-01.' },
  { id:'E280116060000204C3F04E85', serial:'LPG-2021-005', company:'Total Energies', manufactureDate:'2021-04-18', tareWeight:14.5, capacity:12, maxFills:500, fillCount:23,  lastHydroTest:'2026-01-10', status:'available',  notes:'' },
  { id:'E280116060000204C3F04E86', serial:'LPG-2019-006', company:'Total Energies', manufactureDate:'2019-11-30', tareWeight:14.5, capacity:12, maxFills:500, fillCount:298, lastHydroTest:'2024-11-05', status:'in-use',     notes:'' },
  { id:'E280116060000204C3F04E87', serial:'LPG-2022-007', company:'Shell Gas',      manufactureDate:'2022-07-14', tareWeight:14.5, capacity:12, maxFills:500, fillCount:89,  lastHydroTest:'2025-09-14', status:'available',  notes:'' },
  { id:'E280116060000204C3F04E88', serial:'LPG-2020-008', company:'Total Energies', manufactureDate:'2020-03-08', tareWeight:14.5, capacity:12, maxFills:500, fillCount:376, lastHydroTest:'2020-05-22', status:'available',  notes:'' },
  { id:'E280116060000204C3F04E89', serial:'LPG-2023-009', company:'Shell Gas',      manufactureDate:'2023-02-27', tareWeight:14.5, capacity:12, maxFills:500, fillCount:12,  lastHydroTest:'2026-03-01', status:'available',  notes:'' },
  { id:'E280116060000204C3F04E8A', serial:'LPG-2021-010', company:'Shell Gas',      manufactureDate:'2021-08-19', tareWeight:14.5, capacity:12, maxFills:500, fillCount:478, lastHydroTest:'2024-09-18', status:'in-use',     notes:'' },
  { id:'E280116060000204C3F04E8B', serial:'LPG-2019-011', company:'Shell Gas',      manufactureDate:'2019-05-03', tareWeight:14.5, capacity:12, maxFills:500, fillCount:234, lastHydroTest:'2020-11-15', status:'available',  notes:'' },
  { id:'E280116060000204C3F04E8C', serial:'LPG-2024-012', company:'Shell Gas',      manufactureDate:'2024-01-15', tareWeight:14.5, capacity:12, maxFills:500, fillCount:5,   lastHydroTest:'2025-11-30', status:'available',  notes:'' },
];

const DEMO_LICENSES = [
  { id:'LIC-001', companyName:'Vivo LPG',        companyType:'LPGMC',         licenseNumber:'LPGMC-2020-001', issuedDate:'2020-01-15', expiryDate:'2027-01-14', status:'active' },
  { id:'LIC-002', companyName:'Total Energies',   companyType:'LPGMC',         licenseNumber:'LPGMC-2019-002', issuedDate:'2019-06-01', expiryDate:'2026-05-31', status:'active' },
  { id:'LIC-003', companyName:'Shell Gas',        companyType:'LPGMC',         licenseNumber:'LPGMC-2021-003', issuedDate:'2021-03-10', expiryDate:'2028-03-09', status:'active' },
  { id:'LIC-004', companyName:'ABC Distributors', companyType:'Distributor',   licenseNumber:'DIST-2022-001',  issuedDate:'2022-07-20', expiryDate:'2025-07-19', status:'expired' },
  { id:'LIC-005', companyName:'QuickGas Retail',  companyType:'Retailer',      licenseNumber:'RET-2023-005',   issuedDate:'2023-02-14', expiryDate:'2026-02-13', status:'expired' },
  { id:'LIC-006', companyName:'ProRevalid Ltd',   companyType:'Revalidation',  licenseNumber:'REVAL-2021-001', issuedDate:'2021-09-01', expiryDate:'2027-08-31', status:'active' },
  { id:'LIC-007', companyName:'CityGas Direct',   companyType:'Retailer',      licenseNumber:'RET-2024-012',   issuedDate:'2024-11-01', expiryDate:'2027-10-31', status:'active' },
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
    { type: 'ret-returned-empty',  label: 'Returned Empty',    icon: '↩️' },
  ],
};

const ROLE_TABS = {
  lpgmc:           ['scan', 'cylinders', 'alerts', 'reports'],
  revalidator:     ['scan', 'cylinders', 'reports'],
  ewura:           ['scan', 'cylinders', 'alerts', 'reports', 'licenses'],
  'field-auditor': ['scan', 'cylinders', 'reports'],
  tra:             ['scan', 'cylinders', 'reports'],
  distributor:     ['scan', 'cylinders', 'alerts', 'reports'],
  retailer:        ['scan', 'cylinders', 'reports'],
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
  activeView:        'scan',
  activeEventType:   null,
  batchMode:         false,
  batchQueue:        [],
  focused:           false,
  scanEvents:        [],
  syncStatus:        'idle',   // idle | syncing | synced | error
  lastSyncTime:      null,
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

// Alerts view
const alertFilterSeverity = $('alert-filter-severity');
const alertFilterType     = $('alert-filter-type');
const alertSummary        = $('alert-summary');
const alertsList          = $('alerts-list');
const alertsEmpty         = $('alerts-empty');

// Reports view
const reportsGrid      = $('reports-grid');
const reportChart      = $('report-chart');
const exportReportBtn  = $('export-report-btn');
const syncBtn          = $('sync-btn');
const syncStatusText   = $('sync-status-text');
const syncIndicator    = $('sync-indicator');

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

function hydroTestDaysOverdue(lastHydroTest) {
  if (!lastHydroTest) return Infinity;
  const tested = new Date(lastHydroTest + 'T00:00:00');
  const fiveYears = 5 * 365 * 24 * 60 * 60 * 1000;
  const due = new Date(tested.getTime() + fiveYears);
  const now = new Date();
  return Math.floor((now - due) / (24 * 60 * 60 * 1000));
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

  // Licenses view visibility
  const licView = $('view-licenses');
  licView.style.display = s.role === 'ewura' ? '' : 'none';

  // Build event pills
  buildEventPills();

  // Company filter: hide for LPGMC (they see only own)
  cylFilterCompany.style.display = Auth.can('viewAll') ? '' : 'none';

  // Navigate to scan (reset)
  showView('scan');

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
    name = allowed[0] || 'scan';
  }

  State.activeView = name;

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const viewEl = $('view-' + name);
  if (viewEl) viewEl.classList.add('active');

  const tabEl = document.querySelector(`.nav-tab[data-view="${name}"]`);
  if (tabEl) tabEl.classList.add('active');

  headerSubtitle.textContent = {
    scan:      'Scanning',
    cylinders: 'Cylinders',
    alerts:    'Alerts',
    reports:   'Reports',
    licenses:  'Licenses',
  }[name] || name;

  // Lazy render
  if (name === 'cylinders') renderCylinders();
  if (name === 'alerts')    renderAlerts();
  if (name === 'reports')   renderReports();
  if (name === 'licenses')  renderLicenses();
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
  const tag = e.target.tagName;
  const inModal = e.target.closest('.modal-backdrop, .login-overlay, #app-nav, .btn, button, input, select, textarea');
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
    } else if (Auth.session.role === 'government') {
      lastScanResult.className = 'last-scan-result error';
      lastScanResult.textContent = 'Tag not registered. Contact LPGMC to register.';
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
    if (updatedCyl.fillCount >= updatedCyl.maxFills) {
      updatedCyl.status = 'condemned';
    }
  } else if (eventType === 'sent-revalidation' || eventType === 'reval-received') {
    updatedCyl.status = 'revalidation';
  } else if (eventType === 'revalidated') {
    updatedCyl.status = 'available';
    updatedCyl.fillCount = 0;
    updatedCyl.lastRequalDate = new Date().toISOString().slice(0, 10);
    updatedCyl.requalPlant = session.company;
  } else if (eventType === 'reval-returned') {
    updatedCyl.status = 'available';
  } else if (eventType === 'shipped' || eventType === 'dist-sent-retail') {
    updatedCyl.status = 'in-use';
  } else if (eventType === 'received-empty' || eventType === 'dist-returned-empty' || eventType === 'ret-returned-empty') {
    updatedCyl.status = 'available';
  } else if (eventType === 'dist-received' || eventType === 'ret-received') {
    updatedCyl.status = 'in-use';
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
  regTag.value            = tagId;
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
    status:               'available',
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

  State.scanEvents.unshift({ ...event, serial: cyl.serial });
  renderScanEvent(State.scanEvents[0], true);
  eventsEmpty.style.display = 'none';

  lastScanResult.className  = 'last-scan-result success';
  lastScanResult.textContent = `${serial} registered successfully.`;

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
  const statuses = { available: 0, 'in-use': 0, condemned: 0, revalidation: 0 };
  _cylAllData.forEach(c => { if (statuses[c.status] !== undefined) statuses[c.status]++; });
  cylStats.innerHTML = Object.entries(statuses).map(([k, v]) =>
    `<div class="stat-chip">
       <span class="stat-chip-value">${v}</span>
       <span class="stat-chip-label">${k}</span>
     </div>`
  ).join('');

  cylindersList.innerHTML = '';
  if (!data.length) {
    cylindersEmpty.style.display = '';
    return;
  }
  cylindersEmpty.style.display = 'none';

  data.forEach(cyl => {
    const li = document.createElement('li');
    li.className = 'cylinder-item';

    const fillPct = Math.min(100, Math.round((cyl.fillCount / cyl.maxFills) * 100));
    const fillClass = fillPct >= 95 ? 'crit' : fillPct >= 80 ? 'warn' : '';
    const dotClass  = 'dot-' + (cyl.status || 'available');
    const statClass = 'status-' + (cyl.status || 'available');
    const statLabel = { available:'Available', 'in-use':'In Use', condemned:'Condemned', revalidation:'Revalidation' }[cyl.status] || cyl.status;

    const hydroDays = hydroTestDaysOverdue(cyl.lastHydroTest);
    const hydroBadge = hydroDays > 0
      ? `<span class="cylinder-meta-item" style="color:var(--red)">Hydro overdue ${hydroDays}d</span>`
      : '';

    li.innerHTML = `
      <span class="cylinder-status-dot ${escapeHtml(dotClass)}"></span>
      <div class="cylinder-body">
        <div class="cylinder-serial">${escapeHtml(cyl.serial)}</div>
        <div class="cylinder-tag">${escapeHtml(cyl.id)}</div>
        <div class="cylinder-meta">
          <span class="cylinder-meta-item">${escapeHtml(cyl.company)}</span>
          <span class="cylinder-meta-item">Fills: ${cyl.fillCount}/${cyl.maxFills}</span>
          ${hydroBadge}
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
  const hydroDays = hydroTestDaysOverdue(cyl.lastHydroTest);

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
      ${cyl.waterCapacity ? `<div class="passport-row"><span class="passport-key">Water Capacity</span><span class="passport-value">${cyl.waterCapacity || '—'} L</span></div>` : ''}
      <div class="passport-row">
        <span class="passport-key">Net Weight</span>
        <span class="passport-value">${cyl.netWeight || cyl.capacity} kg</span>
      </div>
      ${cyl.grossWeight ? `<div class="passport-row"><span class="passport-key">Gross Weight</span><span class="passport-value">${cyl.grossWeight || '—'} kg</span></div>` : ''}
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
        <span class="passport-value" style="${hydroDays > 0 ? 'color:var(--red)' : ''}">${formatDate(cyl.lastHydroTest)}${hydroDays > 0 ? ' ⚠️ Overdue' : ''}</span>
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
  text += `Fills:    ${cyl.fillCount}/${cyl.maxFills}\nHydro:    ${cyl.lastHydroTest}\n\nEvents:\n`;
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

  // LPGMC: only own
  if (Auth.session && Auth.session.role === 'lpgmc') {
    cyls = cyls.filter(c => c.company === Auth.session.company);
  }

  _alertsData = [];

  cyls.forEach(cyl => {
    const fillPct = Math.round((cyl.fillCount / cyl.maxFills) * 100);
    const hydroDays = hydroTestDaysOverdue(cyl.lastHydroTest);

    if (cyl.status === 'condemned') {
      _alertsData.push({ severity:'critical', type:'condemned', cylinder: cyl,
        title: `${cyl.serial} — Condemned`,
        desc:  cyl.notes || 'Cylinder has been condemned.' });
    }
    if (cyl.fillCount > cyl.maxFills) {
      _alertsData.push({ severity:'critical', type:'exceeded-capacity', cylinder: cyl,
        title: `${cyl.serial} — Exceeded Max Fills`,
        desc:  `Fill count ${cyl.fillCount} exceeds max ${cyl.maxFills}.` });
    }
    if (hydroDays > 0) {
      _alertsData.push({ severity:'critical', type:'overdue-hydrotest', cylinder: cyl,
        title: `${cyl.serial} — Overdue Hydro Test`,
        desc:  `Last test: ${cyl.lastHydroTest}. Overdue by ${hydroDays} days.` });
    } else if (hydroDays > -180) {
      _alertsData.push({ severity:'warning', type:'overdue-hydrotest', cylinder: cyl,
        title: `${cyl.serial} — Hydro Test Due Soon`,
        desc:  `Last test: ${cyl.lastHydroTest}. Due in ${-hydroDays} days.` });
    }
    if (fillPct >= 95 && cyl.status !== 'condemned') {
      _alertsData.push({ severity:'warning', type:'near-capacity', cylinder: cyl,
        title: `${cyl.serial} — Near Fill Capacity`,
        desc:  `${cyl.fillCount}/${cyl.maxFills} fills (${fillPct}%).` });
    }
  });

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
// REPORTS VIEW
// ══════════════════════════════════════════════════════════════════════════════

async function renderReports() {
  let cyls   = await txGetAll('cylinders');
  let events = await txGetAll('events');

  // LPGMC: filter own
  if (Auth.session && Auth.session.role === 'lpgmc') {
    cyls   = cyls.filter(c => c.company === Auth.session.company);
    const ownIds = new Set(cyls.map(c => c.id));
    events = events.filter(e => ownIds.has(e.cylinderId));
  }

  const total     = cyls.length;
  const available = cyls.filter(c => c.status === 'available').length;
  const inUse     = cyls.filter(c => c.status === 'in-use').length;
  const condemned = cyls.filter(c => c.status === 'condemned').length;

  reportsGrid.innerHTML = `
    <div class="report-card">
      <span class="report-card-value">${total}</span>
      <div class="report-card-label">Total Cylinders</div>
    </div>
    <div class="report-card">
      <span class="report-card-value" style="color:var(--green)">${available}</span>
      <div class="report-card-label">Available</div>
    </div>
    <div class="report-card">
      <span class="report-card-value" style="color:var(--blue)">${inUse}</span>
      <div class="report-card-label">In Use</div>
    </div>
    <div class="report-card">
      <span class="report-card-value" style="color:var(--red)">${condemned}</span>
      <div class="report-card-label">Condemned</div>
    </div>`;

  // Activity chart — last 30 days by event type
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
    }).join('') || '<p style="padding:16px;color:var(--dim);font-size:13px">No activity in last 30 days.</p>';

  // Sync status
  renderSyncStatus();
}

function renderSyncStatus() {
  const labels = {
    idle:    'Not synced yet.',
    syncing: 'Syncing…',
    synced:  State.lastSyncTime ? `Last synced: ${formatDateTime(State.lastSyncTime)}` : 'Synced.',
    error:   'Sync failed. Check connection.',
  };
  syncStatusText.textContent = labels[State.syncStatus] || '';
  syncIndicator.className = 'sync-indicator ' + (State.syncStatus === 'idle' ? '' : State.syncStatus);
}

syncBtn.addEventListener('click', async () => {
  State.syncStatus = 'syncing';
  renderSyncStatus();
  // Simulate async sync
  await new Promise(r => setTimeout(r, 1500));
  State.syncStatus  = 'synced';
  State.lastSyncTime = nowISO();
  renderSyncStatus();
  showSnackbar('Sync complete.', 'success');
});

exportReportBtn.addEventListener('click', async () => {
  let cyls = await txGetAll('cylinders');
  if (Auth.session && Auth.session.role === 'lpgmc') {
    cyls = cyls.filter(c => c.company === Auth.session.company);
  }
  const header = 'id,serial,company,status,fillCount,maxFills,manufactureDate,lastHydroTest\n';
  const rows = cyls.map(c =>
    `"${c.id}","${c.serial}","${c.company}","${c.status}","${c.fillCount}","${c.maxFills}","${c.manufactureDate}","${c.lastHydroTest}"`
  ).join('\n');
  downloadCSV('lpg-report-' + new Date().toISOString().slice(0,10) + '.csv', header + rows);
});

function downloadCSV(filename, content) {
  const blob = new Blob([content], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
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

  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  Auth.logout();
});

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
