'use strict';

// ── DB (IndexedDB) ────────────────────────────────────────────────────────────
// Stores:
//   cylinders {id, serial, manufactureDate, tareWeight, capacity, maxFills,
//              fillCount, lastHydroTest, status, notes}
//   events    {id, cylinderId, eventType, operatorId, timestamp, location,
//              batchId, synced}
//   meta      {key, value}

const DB = (() => {
  const DB_NAME = 'lpg-tracer';
  const DB_VER  = 1;
  let _db = null;

  function open() {
    return new Promise((resolve, reject) => {
      if (_db) { resolve(_db); return; }
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('cylinders')) {
          db.createObjectStore('cylinders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('events')) {
          const evStore = db.createObjectStore('events', { keyPath: 'id' });
          evStore.createIndex('cylinderId', 'cylinderId', { unique: false });
          evStore.createIndex('synced',     'synced',     { unique: false });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror   = () => reject(req.error);
    });
  }

  function transaction(storeName, mode = 'readonly') {
    return _db.transaction(storeName, mode).objectStore(storeName);
  }

  function put(storeName, item) {
    return new Promise((resolve, reject) => {
      const store = transaction(storeName, 'readwrite');
      const req = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  function get(storeName, key) {
    return new Promise((resolve, reject) => {
      const req = transaction(storeName).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  function getAll(storeName) {
    return new Promise((resolve, reject) => {
      const req = transaction(storeName).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  function getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const store = transaction(storeName);
      const index = store.index(indexName);
      const req   = index.getAll(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  function putAll(storeName, items) {
    return new Promise((resolve, reject) => {
      const tx    = _db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      items.forEach(item => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  }

  return { open, put, get, getAll, getByIndex, putAll };
})();

// ── DEMO DATA ─────────────────────────────────────────────────────────────────

const DEMO_CYLINDERS = [
  { id:'E280116060000204C3F04E81', serial:'LPG-2018-001', manufactureDate:'2018-03-15', tareWeight:14.5, capacity:12, maxFills:500, fillCount:342, lastHydroTest:'2020-12-20', status:'available', notes:'' },
  { id:'E280116060000204C3F04E82', serial:'LPG-2019-002', manufactureDate:'2019-06-10', tareWeight:14.5, capacity:12, maxFills:500, fillCount:461, lastHydroTest:'2024-06-10', status:'in-use',    notes:'' },
  { id:'E280116060000204C3F04E83', serial:'LPG-2020-003', manufactureDate:'2020-01-22', tareWeight:14.5, capacity:12, maxFills:500, fillCount:156, lastHydroTest:'2025-03-20', status:'available', notes:'' },
  { id:'E280116060000204C3F04E84', serial:'LPG-2018-004', manufactureDate:'2018-09-05', tareWeight:14.5, capacity:12, maxFills:500, fillCount:502, lastHydroTest:'2020-08-12', status:'condemned',  notes:'Exceeded max fills. Condemned 2026-03-01.' },
  { id:'E280116060000204C3F04E85', serial:'LPG-2021-005', manufactureDate:'2021-04-18', tareWeight:14.5, capacity:12, maxFills:500, fillCount:23,  lastHydroTest:'2026-01-10', status:'available', notes:'' },
  { id:'E280116060000204C3F04E86', serial:'LPG-2019-006', manufactureDate:'2019-11-30', tareWeight:14.5, capacity:12, maxFills:500, fillCount:298, lastHydroTest:'2024-11-05', status:'in-use',    notes:'' },
  { id:'E280116060000204C3F04E87', serial:'LPG-2022-007', manufactureDate:'2022-07-14', tareWeight:14.5, capacity:12, maxFills:500, fillCount:89,  lastHydroTest:'2025-09-14', status:'available', notes:'' },
  { id:'E280116060000204C3F04E88', serial:'LPG-2020-008', manufactureDate:'2020-03-08', tareWeight:14.5, capacity:12, maxFills:500, fillCount:376, lastHydroTest:'2020-05-22', status:'available', notes:'' },
  { id:'E280116060000204C3F04E89', serial:'LPG-2023-009', manufactureDate:'2023-02-27', tareWeight:14.5, capacity:12, maxFills:500, fillCount:12,  lastHydroTest:'2026-03-01', status:'available', notes:'' },
  { id:'E280116060000204C3F04E8A', serial:'LPG-2021-010', manufactureDate:'2021-08-19', tareWeight:14.5, capacity:12, maxFills:500, fillCount:478, lastHydroTest:'2024-09-18', status:'in-use',    notes:'' },
  { id:'E280116060000204C3F04E8B', serial:'LPG-2019-011', manufactureDate:'2019-05-03', tareWeight:14.5, capacity:12, maxFills:500, fillCount:234, lastHydroTest:'2020-11-15', status:'available', notes:'' },
  { id:'E280116060000204C3F04E8C', serial:'LPG-2024-012', manufactureDate:'2024-01-15', tareWeight:14.5, capacity:12, maxFills:500, fillCount:5,   lastHydroTest:'2025-11-30', status:'available', notes:'' },
];

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function makeEvents(cylinderId, serial, fillCount, startDateStr, status) {
  const events = [];
  const ops    = ['OP-001', 'OP-002'];
  const paris  = { lat: 48.8566, lng: 2.3522 };

  // Parse start date; first event is registration
  const startMs  = new Date(startDateStr).getTime();
  const nowMs    = new Date('2026-06-05').getTime();
  const rangeMs  = nowMs - startMs;

  // Registration event at manufacture date
  events.push({
    id:          makeId() + 'reg',
    cylinderId,
    eventType:   'registered',
    operatorId:  'OP-001',
    timestamp:   new Date(startMs + 7 * 86400000).toISOString(),
    location:    paris,
    batchId:     null,
    synced:      true,
  });

  // First hydro test shortly after registration
  events.push({
    id:          makeId() + 'ht0',
    cylinderId,
    eventType:   'inspected',
    operatorId:  'OP-002',
    timestamp:   new Date(startMs + 30 * 86400000).toISOString(),
    location:    paris,
    batchId:     null,
    synced:      true,
  });

  // Generate fill cycles spread over the available time
  const cyclesTarget = Math.min(fillCount, 20); // cap demo events at 20 cycles
  const interval = rangeMs / (cyclesTarget + 2);

  for (let i = 0; i < cyclesTarget; i++) {
    const baseMs = startMs + interval * (i + 1);
    const op     = ops[i % 2];
    const loc    = (i % 3 === 0) ? paris : null;

    events.push({
      id:         makeId() + 'f' + i,
      cylinderId,
      eventType:  'filled',
      operatorId: op,
      timestamp:  new Date(baseMs).toISOString(),
      location:   loc,
      batchId:    null,
      synced:     true,
    });

    events.push({
      id:         makeId() + 'd' + i,
      cylinderId,
      eventType:  'dispatched',
      operatorId: op,
      timestamp:  new Date(baseMs + 3600000 * 2).toISOString(),
      location:   loc,
      batchId:    null,
      synced:     true,
    });

    events.push({
      id:         makeId() + 'dv' + i,
      cylinderId,
      eventType:  'delivered',
      operatorId: op,
      timestamp:  new Date(baseMs + 3600000 * 6).toISOString(),
      location:   loc ? { lat: loc.lat + 0.01, lng: loc.lng + 0.01 } : null,
      batchId:    null,
      synced:     true,
    });

    // Return only for most cycles (not the last if in-use)
    if (!(i === cyclesTarget - 1 && status === 'in-use')) {
      events.push({
        id:         makeId() + 'r' + i,
        cylinderId,
        eventType:  'returned',
        operatorId: op,
        timestamp:  new Date(baseMs + 86400000 * 14).toISOString(),
        location:   loc,
        batchId:    null,
        synced:     true,
      });
    }
  }

  // Add condemned event for condemned cylinders
  if (status === 'condemned') {
    events.push({
      id:         makeId() + 'con',
      cylinderId,
      eventType:  'condemned',
      operatorId: 'OP-001',
      timestamp:  new Date('2026-03-01T09:00:00.000Z').toISOString(),
      location:   paris,
      batchId:    null,
      synced:     true,
    });
  }

  // Sort by timestamp ascending
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return events;
}

async function seedDemoData() {
  const meta = await DB.get('meta', 'seeded');
  if (meta && meta.value) return;

  const allEvents = [];
  for (const cyl of DEMO_CYLINDERS) {
    await DB.put('cylinders', cyl);
    const evs = makeEvents(cyl.id, cyl.serial, cyl.fillCount, cyl.manufactureDate, cyl.status);
    allEvents.push(...evs);
  }
  await DB.putAll('events', allEvents);
  await DB.put('meta', { key: 'seeded', value: true });
}

// ── STATE ─────────────────────────────────────────────────────────────────────

const State = {
  currentView:      'scan',
  operator:         '',
  geo:              null,
  batchMode:        false,
  batchItems:       [],   // [{tagId, cylinderId, serial, isDuplicate}]
  batchEventType:   'filled',
  pendingRegisterTag: null,
  focused:          false,
  selectedEventType: 'filled',
  cylFilter:        'all',
  cylSearch:        '',
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (isNaN(d)) return isoStr;
  return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
}

function fmtDateTime(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (isNaN(d)) return isoStr;
  return d.toLocaleString(undefined, {
    year:'numeric', month:'short', day:'numeric',
    hour:'2-digit', minute:'2-digit',
  });
}

function fmtDateShort(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (isNaN(d)) return isoStr;
  return d.toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
}

function detectType(data) {
  return /^[0-9A-Fa-f]{12,}$/i.test(data.trim()) ? 'rfid' : 'barcode';
}

function showSnackbar(msg, duration = 2200) {
  const sb = document.getElementById('snackbar');
  sb.textContent = msg;
  sb.classList.add('show');
  clearTimeout(showSnackbar._t);
  showSnackbar._t = setTimeout(() => sb.classList.remove('show'), duration);
}

// ── GEO MODULE ────────────────────────────────────────────────────────────────

function requestGeo(silent = false) {
  if (!navigator.geolocation) {
    if (!silent) showSnackbar('Geolocation not supported');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      State.geo = {
        lat:      pos.coords.latitude,
        lng:      pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      };
      updateGpsPill();
      if (!silent) showSnackbar(`GPS: ${State.geo.lat.toFixed(4)}, ${State.geo.lng.toFixed(4)}`);
    },
    (err) => {
      State.geo = null;
      updateGpsPill();
      if (!silent) showSnackbar('GPS error: ' + err.message);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function updateGpsPill() {
  const pill  = document.getElementById('gps-pill');
  const label = document.getElementById('gps-pill-label');
  if (State.geo) {
    label.textContent = `${State.geo.lat.toFixed(3)}, ${State.geo.lng.toFixed(3)}`;
    pill.classList.add('gps-active');
  } else {
    label.textContent = 'GPS Off';
    pill.classList.remove('gps-active');
  }
}

// ── CYLINDER UTILS ────────────────────────────────────────────────────────────

const HYDRO_CUTOFF = new Date('2021-06-05'); // 5 years before today

function getCylinderAlerts(cyl) {
  const alerts = [];
  const hydro  = cyl.lastHydroTest ? new Date(cyl.lastHydroTest) : null;

  if (cyl.status === 'condemned') {
    alerts.push({ type: 'condemned', label: 'Cylinder condemned', severity: 'critical' });
  }
  if (hydro && hydro < HYDRO_CUTOFF) {
    const yrs = ((new Date('2026-06-05') - hydro) / (365.25 * 86400000)).toFixed(1);
    alerts.push({ type: 'overdue-hydro', label: `Hydro test overdue (${yrs} yrs ago)`, severity: 'critical' });
  }
  if (cyl.fillCount >= cyl.maxFills) {
    alerts.push({ type: 'max-fills', label: `Max fills reached (${cyl.fillCount}/${cyl.maxFills})`, severity: 'critical' });
  } else if (cyl.fillCount >= cyl.maxFills * 0.9) {
    const pct = Math.round(cyl.fillCount / cyl.maxFills * 100);
    alerts.push({ type: 'near-max', label: `Approaching max fills (${pct}%)`, severity: 'warning' });
  }
  return alerts;
}

function getStatusClass(status) {
  const map = { available: 'status-available', 'in-use': 'status-in-use', condemned: 'status-condemned', registered: 'status-registered' };
  return map[status] || 'status-unknown';
}

function getStatusLabel(status) {
  const map = { available: 'Available', 'in-use': 'In Use', condemned: 'Condemned', registered: 'Registered' };
  return map[status] || status || 'Unknown';
}

function eventTypeIcon(type) {
  const map = { filled:'🔵', dispatched:'🟣', delivered:'🟢', returned:'🟡', inspected:'🩵', condemned:'🔴', registered:'⚪' };
  return map[type] || '⚫';
}

function eventTypeClass(type) {
  const map = { filled:'evt-filled', dispatched:'evt-dispatched', delivered:'evt-delivered', returned:'evt-returned', inspected:'evt-inspected', condemned:'evt-condemned', registered:'evt-registered' };
  return map[type] || '';
}

function eventTypeBgClass(type) {
  const map = { filled:'evt-bg-filled', dispatched:'evt-bg-dispatched', delivered:'evt-bg-delivered', returned:'evt-bg-returned', inspected:'evt-bg-inspected', condemned:'evt-bg-condemned', registered:'evt-bg-registered' };
  return map[type] || 'evt-bg-registered';
}

function cylinderIcon(cyl) {
  if (cyl.status === 'condemned') return '🚫';
  if (cyl.status === 'in-use')    return '🔵';
  return '🟢';
}

function cylinderIconBg(cyl) {
  if (cyl.status === 'condemned') return 'rgba(239,68,68,0.12)';
  if (cyl.status === 'in-use')    return 'rgba(59,130,246,0.12)';
  return 'rgba(16,185,129,0.12)';
}

// ── UNSYNCED BADGE ────────────────────────────────────────────────────────────

async function refreshUnsyncedBadge() {
  const events   = await DB.getAll('events');
  const unsynced = events.filter(e => !e.synced).length;
  const badge    = document.getElementById('unsynced-badge');
  badge.textContent = unsynced;
  badge.style.display = unsynced > 0 ? '' : 'none';
}

// ── SCANNER MODULE ────────────────────────────────────────────────────────────

const scannerInput = document.getElementById('scanner-input');
let inputBuffer = '';
let flushTimer  = null;

function flushBuffer() {
  const data = inputBuffer.replace(/[\r\n]/g, '').trim();
  inputBuffer = '';
  if (data) onScan(data);
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

// Keep scanner input focused when app is focused
document.addEventListener('click', (e) => {
  const ignored = ['modal-overlay', 'form-input', 'btn', 'event-pill', 'filter-pill',
                    'nav-btn', 'focus-btn', 'modal-close', 'link-btn', 'pill'];
  const isIgnored = ignored.some(cls => e.target.classList.contains(cls) || e.target.closest('.' + cls));
  if (State.focused && !isIgnored) {
    scannerInput.focus();
  }
});

// ── VIEW: SCAN ────────────────────────────────────────────────────────────────

function renderScanView() {
  // Event type pills
  document.querySelectorAll('#event-type-pills .event-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === State.selectedEventType);
    btn.addEventListener('click', () => {
      State.selectedEventType = btn.dataset.type;
      State.batchEventType    = btn.dataset.type;
      document.querySelectorAll('#event-type-pills .event-pill').forEach(b =>
        b.classList.toggle('active', b.dataset.type === State.selectedEventType)
      );
    });
  });

  // Batch toggle
  const batchToggle    = document.getElementById('batch-toggle');
  const batchSubmitBtn = document.getElementById('batch-submit-btn');
  const batchSection   = document.getElementById('batch-list-section');

  batchToggle.checked = State.batchMode;
  batchToggle.addEventListener('change', () => {
    State.batchMode  = batchToggle.checked;
    State.batchItems = [];
    renderBatchList();
    batchSubmitBtn.style.display = State.batchMode ? '' : 'none';
    batchSection.style.display   = State.batchMode ? '' : 'none';
    updateBatchCount();
  });

  batchSubmitBtn.addEventListener('click', submitBatch);
  document.getElementById('batch-clear-btn').addEventListener('click', () => {
    State.batchItems = [];
    renderBatchList();
    updateBatchCount();
  });

  // Focus button
  const focusBtn   = document.getElementById('focus-btn');
  const focusIcon  = document.getElementById('focus-icon');
  const focusLabel = document.getElementById('focus-label');

  focusBtn.addEventListener('click', () => {
    State.focused = !State.focused;
    if (State.focused) {
      scannerInput.focus();
      focusBtn.classList.add('active');
      focusIcon.textContent  = '🟢';
      focusLabel.textContent = 'Scanning active — tap to pause';
    } else {
      scannerInput.blur();
      focusBtn.classList.remove('active');
      focusIcon.textContent  = '⌨️';
      focusLabel.textContent = 'Tap to start scanning';
    }
  });
}

function updateBatchCount() {
  const badge = document.getElementById('batch-count-badge');
  if (badge) badge.textContent = State.batchItems.length;
}

function renderBatchList() {
  const ul = document.getElementById('batch-list');
  if (!ul) return;
  ul.innerHTML = '';
  State.batchItems.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'batch-item' + (item.isDuplicate ? ' duplicate' : '');
    li.innerHTML = `
      <div class="batch-item-index">${idx + 1}</div>
      <div class="batch-item-body">
        <div class="batch-item-serial">${escapeHtml(item.serial || 'Unknown')}</div>
        <div class="batch-item-id">${escapeHtml(item.tagId)}</div>
        ${item.isDuplicate ? '<div class="batch-dup-label">⚠ Duplicate scan</div>' : ''}
      </div>
    `;
    ul.appendChild(li);
  });
}

async function onScan(tagId) {
  tagId = tagId.trim();
  if (!tagId) return;

  const type = detectType(tagId);
  let cylinder = null;

  if (type === 'rfid') {
    cylinder = await DB.get('cylinders', tagId);
  } else {
    // barcode — look up by serial
    const all = await DB.getAll('cylinders');
    cylinder  = all.find(c => c.serial.toLowerCase() === tagId.toLowerCase()) || null;
  }

  if (State.batchMode) {
    // Check duplicate
    const isDuplicate = State.batchItems.some(i => i.tagId === tagId);
    State.batchItems.push({
      tagId,
      cylinderId: cylinder ? cylinder.id   : null,
      serial:     cylinder ? cylinder.serial : tagId,
      isDuplicate,
      found:      !!cylinder,
    });
    renderBatchList();
    updateBatchCount();

    const batchSection = document.getElementById('batch-list-section');
    batchSection.style.display = '';
    if (isDuplicate) {
      showSnackbar(`⚠ Duplicate: ${cylinder ? cylinder.serial : tagId}`);
    } else {
      showSnackbar(cylinder ? `Added: ${cylinder.serial}` : `Unknown tag added`);
    }
    return;
  }

  // Single-scan mode
  if (!cylinder) {
    showLastScan({ tagId, found: false });
    State.pendingRegisterTag = tagId;
    setTimeout(() => openRegisterModal(tagId), 400);
    return;
  }

  // Log the event
  const event = {
    id:         makeId(),
    cylinderId: cylinder.id,
    eventType:  State.selectedEventType,
    operatorId: State.operator || 'Unknown',
    timestamp:  new Date().toISOString(),
    location:   State.geo ? { lat: State.geo.lat, lng: State.geo.lng } : null,
    batchId:    null,
    synced:     false,
  };
  await DB.put('events', event);

  // Update cylinder status
  if (State.selectedEventType === 'filled') {
    cylinder.fillCount = (cylinder.fillCount || 0) + 1;
    cylinder.status    = 'available';
  } else if (State.selectedEventType === 'dispatched') {
    cylinder.status = 'in-use';
  } else if (State.selectedEventType === 'delivered') {
    cylinder.status = 'in-use';
  } else if (State.selectedEventType === 'returned') {
    cylinder.status = 'available';
  } else if (State.selectedEventType === 'condemned') {
    cylinder.status = 'condemned';
  }
  await DB.put('cylinders', cylinder);

  showLastScan({ tagId, found: true, cylinder, eventType: State.selectedEventType });
  await refreshUnsyncedBadge();
}

function showLastScan({ tagId, found, cylinder, eventType }) {
  const area = document.getElementById('last-scan-area');
  area.style.display = '';

  if (!found) {
    area.className = 'last-scan-area scan-unknown';
    area.innerHTML = `
      <div class="last-scan-tag">${escapeHtml(tagId)}</div>
      <div class="last-scan-serial">Unknown Tag</div>
      <div class="last-scan-status">Not found in database</div>
      <div class="last-scan-event">Opening registration form…</div>
    `;
    return;
  }

  const alertList = getCylinderAlerts(cylinder);
  const hasAlerts  = alertList.length > 0;

  area.className = 'last-scan-area scan-found';
  area.innerHTML = `
    <div class="last-scan-tag">${escapeHtml(tagId)}</div>
    <div class="last-scan-serial">${escapeHtml(cylinder.serial)}</div>
    <div class="last-scan-status">
      <span class="status-badge ${getStatusClass(cylinder.status)}">${getStatusLabel(cylinder.status)}</span>
      &nbsp; Fills: ${cylinder.fillCount}/${cylinder.maxFills}
    </div>
    <div class="last-scan-event">
      ${eventTypeIcon(eventType)} Logged as <strong>${eventType}</strong>
      ${hasAlerts ? '<br>⚠ ' + alertList.map(a => escapeHtml(a.label)).join(' · ') : ''}
    </div>
  `;

  // Tap to open passport
  area.style.cursor = 'pointer';
  area.onclick = () => openCylinderModal(cylinder.id);
}

async function submitBatch() {
  if (State.batchItems.length === 0) {
    showSnackbar('Batch is empty');
    return;
  }

  const batchId  = makeId();
  const results  = [];
  const eventType = State.batchEventType;

  for (const item of State.batchItems) {
    if (item.isDuplicate) {
      results.push({ ...item, status: 'skip', note: 'Duplicate — skipped' });
      continue;
    }
    if (!item.found || !item.cylinderId) {
      results.push({ ...item, status: 'warn', note: 'Unknown tag — not logged' });
      continue;
    }

    const cylinder = await DB.get('cylinders', item.cylinderId);
    if (!cylinder) {
      results.push({ ...item, status: 'warn', note: 'Cylinder not found' });
      continue;
    }

    const event = {
      id:         makeId(),
      cylinderId: cylinder.id,
      eventType,
      operatorId: State.operator || 'Unknown',
      timestamp:  new Date().toISOString(),
      location:   State.geo ? { lat: State.geo.lat, lng: State.geo.lng } : null,
      batchId,
      synced:     false,
    };
    await DB.put('events', event);

    // Update cylinder
    if (eventType === 'filled') {
      cylinder.fillCount = (cylinder.fillCount || 0) + 1;
      cylinder.status    = 'available';
    } else if (eventType === 'dispatched' || eventType === 'delivered') {
      cylinder.status = 'in-use';
    } else if (eventType === 'returned') {
      cylinder.status = 'available';
    } else if (eventType === 'condemned') {
      cylinder.status = 'condemned';
    }
    await DB.put('cylinders', cylinder);
    results.push({ ...item, status: 'ok', note: `Logged as ${eventType}` });
  }

  // Clear batch
  State.batchItems = [];
  State.batchMode  = false;
  const batchToggle = document.getElementById('batch-toggle');
  if (batchToggle) batchToggle.checked = false;
  const batchSection = document.getElementById('batch-list-section');
  if (batchSection) batchSection.style.display = 'none';
  const batchSubmitBtn = document.getElementById('batch-submit-btn');
  if (batchSubmitBtn) batchSubmitBtn.style.display = 'none';
  renderBatchList();
  updateBatchCount();

  await refreshUnsyncedBadge();
  showBatchSummary(results, eventType);
}

// ── VIEW: CYLINDERS ───────────────────────────────────────────────────────────

async function renderCylindersView() {
  const cylinders = await DB.getAll('cylinders');
  const events    = await DB.getAll('events');

  // Index last event per cylinder
  const lastEventMap = {};
  events.forEach(ev => {
    const prev = lastEventMap[ev.cylinderId];
    if (!prev || ev.timestamp > prev.timestamp) lastEventMap[ev.cylinderId] = ev;
  });

  let filtered = cylinders;

  // Filter
  if (State.cylFilter !== 'all') {
    filtered = filtered.filter(c => c.status === State.cylFilter);
  }

  // Search
  if (State.cylSearch) {
    const q = State.cylSearch.toLowerCase();
    filtered = filtered.filter(c =>
      c.serial.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    );
  }

  // Sort: condemned last, then by serial
  filtered.sort((a, b) => {
    if (a.status === 'condemned' && b.status !== 'condemned') return 1;
    if (b.status === 'condemned' && a.status !== 'condemned') return -1;
    return a.serial.localeCompare(b.serial);
  });

  const ul = document.getElementById('cyl-list');
  ul.innerHTML = '';

  if (filtered.length === 0) {
    ul.innerHTML = `<li style="padding:40px 16px;text-align:center;color:var(--dim);font-size:14px;">No cylinders found</li>`;
    return;
  }

  filtered.forEach(cyl => {
    const lastEv  = lastEventMap[cyl.id];
    const alerts  = getCylinderAlerts(cyl);
    const pct     = Math.round(cyl.fillCount / cyl.maxFills * 100);

    const li = document.createElement('li');
    li.className = 'cyl-item';
    li.innerHTML = `
      <div class="cyl-item-icon" style="background:${cylinderIconBg(cyl)}">${cylinderIcon(cyl)}</div>
      <div class="cyl-item-body">
        <div class="cyl-item-serial">${escapeHtml(cyl.serial)}
          ${alerts.length ? ' <span style="color:var(--amber);font-size:13px;">⚠</span>' : ''}
        </div>
        <div class="cyl-item-meta">
          <span class="status-badge ${getStatusClass(cyl.status)}">${getStatusLabel(cyl.status)}</span>
          ${lastEv ? `<span>Last: ${eventTypeIcon(lastEv.eventType)} ${lastEv.eventType} ${fmtDateShort(lastEv.timestamp)}</span>` : ''}
        </div>
      </div>
      <div class="cyl-item-right">
        <div class="cyl-fill-pct">${cyl.fillCount}/${cyl.maxFills} fills</div>
        <div class="cyl-fill-pct">${pct}%</div>
      </div>
      <div class="cyl-item-chevron">›</div>
    `;
    li.addEventListener('click', () => openCylinderModal(cyl.id));
    ul.appendChild(li);
  });
}

function initCylindersView() {
  const searchInput = document.getElementById('cyl-search');
  searchInput.value = State.cylSearch;
  searchInput.addEventListener('input', () => {
    State.cylSearch = searchInput.value;
    renderCylindersView();
  });

  document.querySelectorAll('#cyl-filter-pills .filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === State.cylFilter);
    btn.addEventListener('click', () => {
      State.cylFilter = btn.dataset.filter;
      document.querySelectorAll('#cyl-filter-pills .filter-pill').forEach(b =>
        b.classList.toggle('active', b.dataset.filter === State.cylFilter)
      );
      renderCylindersView();
    });
  });
}

// ── VIEW: ALERTS ──────────────────────────────────────────────────────────────

async function renderAlertsView() {
  const cylinders  = await DB.getAll('cylinders');
  const container  = document.getElementById('alerts-container');
  container.innerHTML = '';

  // Build alert groups
  const groups = {
    'Overdue Inspection': [],
    'Max Fills':          [],
    'Other Issues':       [],
  };

  cylinders.forEach(cyl => {
    const alerts = getCylinderAlerts(cyl);
    alerts.forEach(alert => {
      if (alert.type === 'overdue-hydro') {
        groups['Overdue Inspection'].push({ cyl, alert });
      } else if (alert.type === 'max-fills' || alert.type === 'near-max' || alert.type === 'condemned') {
        groups['Max Fills'].push({ cyl, alert });
      } else {
        groups['Other Issues'].push({ cyl, alert });
      }
    });
  });

  let totalAlerts = 0;
  Object.values(groups).forEach(g => totalAlerts += g.length);
  updateAlertsBadge(totalAlerts);

  if (totalAlerts === 0) {
    container.innerHTML = `
      <div class="alerts-empty">
        <div class="alerts-empty-icon">✅</div>
        <p>No active alerts.<br>All cylinders are within normal parameters.</p>
      </div>
    `;
    return;
  }

  Object.entries(groups).forEach(([groupName, items]) => {
    if (items.length === 0) return;

    const title = document.createElement('div');
    title.className = 'alerts-group-title';
    title.textContent = `${groupName} (${items.length})`;
    container.appendChild(title);

    items.forEach(({ cyl, alert }) => {
      const card = document.createElement('div');
      card.className = `alert-card alert-${alert.severity}`;
      card.innerHTML = `
        <div class="alert-card-inner">
          <div class="alert-icon">${alert.severity === 'critical' ? '🚨' : '⚠️'}</div>
          <div class="alert-body">
            <div class="alert-title">${escapeHtml(cyl.serial)}</div>
            <div class="alert-subtitle">${escapeHtml(alert.label)}</div>
          </div>
          <div style="color:var(--dim);font-size:18px;">›</div>
        </div>
      `;
      card.addEventListener('click', () => openCylinderModal(cyl.id));
      container.appendChild(card);
    });
  });
}

function updateAlertsBadge(count) {
  const badge = document.getElementById('alerts-nav-badge');
  badge.textContent = count;
  badge.style.display = count > 0 ? '' : 'none';
}

// ── VIEW: REPORTS ─────────────────────────────────────────────────────────────

async function renderReportsView() {
  const cylinders = await DB.getAll('cylinders');
  const events    = await DB.getAll('events');
  const today     = new Date('2026-06-05').toDateString();
  const eventsToday = events.filter(e => new Date(e.timestamp).toDateString() === today);
  const unsynced    = events.filter(e => !e.synced).length;

  const totalAlerts = cylinders.reduce((acc, c) => acc + getCylinderAlerts(c).length, 0);

  const grid = document.getElementById('stats-grid');
  grid.innerHTML = `
    <div class="stat-card stat-accent-blue">
      <div class="stat-label">Total Cylinders</div>
      <div class="stat-value">${cylinders.length}</div>
      <div class="stat-sub">${cylinders.filter(c=>c.status==='available').length} available</div>
    </div>
    <div class="stat-card stat-accent-green">
      <div class="stat-label">Events Today</div>
      <div class="stat-value">${eventsToday.length}</div>
      <div class="stat-sub">of ${events.length} total</div>
    </div>
    <div class="stat-card stat-accent-amber">
      <div class="stat-label">Unsynced</div>
      <div class="stat-value">${unsynced}</div>
      <div class="stat-sub">pending upload</div>
    </div>
    <div class="stat-card stat-accent-red">
      <div class="stat-label">Active Alerts</div>
      <div class="stat-value">${totalAlerts}</div>
      <div class="stat-sub">${cylinders.filter(c=>c.status==='condemned').length} condemned</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">In Use</div>
      <div class="stat-value">${cylinders.filter(c=>c.status==='in-use').length}</div>
      <div class="stat-sub">cylinders dispatched</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Events</div>
      <div class="stat-value">${events.length}</div>
      <div class="stat-sub">${events.filter(e=>e.synced).length} synced</div>
    </div>
  `;

  // Wire report buttons once
  const btnExportEvts  = document.getElementById('btn-export-events');
  const btnExportCyls  = document.getElementById('btn-export-cylinders');
  const btnSync        = document.getElementById('btn-sync');
  const btnPrint       = document.getElementById('btn-print');

  // Replace to remove old listeners
  btnExportEvts.replaceWith(btnExportEvts.cloneNode(true));
  btnExportCyls.replaceWith(btnExportCyls.cloneNode(true));
  btnSync.replaceWith(btnSync.cloneNode(true));
  btnPrint.replaceWith(btnPrint.cloneNode(true));

  document.getElementById('btn-export-events').addEventListener('click',     exportEventsCSV);
  document.getElementById('btn-export-cylinders').addEventListener('click',  exportCylindersCSV);
  document.getElementById('btn-sync').addEventListener('click',              simulateSync);
  document.getElementById('btn-print').addEventListener('click',             () => window.print());
}

async function exportEventsCSV() {
  const events = await DB.getAll('events');
  const header = 'id,cylinderId,eventType,operatorId,timestamp,lat,lng,batchId,synced\n';
  const rows   = events.map(e => [
    e.id, e.cylinderId, e.eventType, e.operatorId, e.timestamp,
    e.location ? e.location.lat : '',
    e.location ? e.location.lng : '',
    e.batchId || '', e.synced ? 'true' : 'false',
  ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');

  downloadCSV(header + rows, `lpg-events-${new Date().toISOString().slice(0,10)}.csv`);
  showSnackbar(`Exported ${events.length} events`);
}

async function exportCylindersCSV() {
  const cylinders = await DB.getAll('cylinders');
  const header    = 'id,serial,manufactureDate,tareWeight,capacity,maxFills,fillCount,lastHydroTest,status,notes\n';
  const rows      = cylinders.map(c => [
    c.id, c.serial, c.manufactureDate, c.tareWeight, c.capacity,
    c.maxFills, c.fillCount, c.lastHydroTest, c.status, c.notes || '',
  ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');

  downloadCSV(header + rows, `lpg-cylinders-${new Date().toISOString().slice(0,10)}.csv`);
  showSnackbar(`Exported ${cylinders.length} cylinders`);
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function simulateSync() {
  const syncStatus = document.getElementById('sync-status');
  syncStatus.style.display = '';
  syncStatus.className     = 'sync-status syncing';
  syncStatus.textContent   = '⏳ Syncing events to server…';

  await new Promise(r => setTimeout(r, 1500));

  const events  = await DB.getAll('events');
  const updated = events.map(e => ({ ...e, synced: true }));
  await DB.putAll('events', updated);

  syncStatus.className   = 'sync-status synced';
  syncStatus.textContent = `✅ Synced ${updated.length} events successfully`;

  await refreshUnsyncedBadge();
  await renderReportsView();

  setTimeout(() => { syncStatus.style.display = 'none'; }, 4000);
}

// ── MODAL: CYLINDER PASSPORT ──────────────────────────────────────────────────

async function openCylinderModal(cylinderId) {
  const cyl    = await DB.get('cylinders', cylinderId);
  if (!cyl) { showSnackbar('Cylinder not found'); return; }

  const events = await DB.getByIndex('events', 'cylinderId', cylinderId);
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // newest first

  const alerts = getCylinderAlerts(cyl);
  const pct    = Math.round(cyl.fillCount / cyl.maxFills * 100);
  const hydro  = cyl.lastHydroTest ? new Date(cyl.lastHydroTest) : null;
  const hydroOverdue = hydro && hydro < HYDRO_CUTOFF;

  const alertsHtml = alerts.map(a => `
    <div class="passport-alert ${a.severity}">
      <span>${a.severity === 'critical' ? '🚨' : '⚠️'}</span>
      <span>${escapeHtml(a.label)}</span>
    </div>
  `).join('');

  const timelineHtml = events.map(ev => `
    <div class="timeline-item">
      <div class="timeline-dot ${eventTypeBgClass(ev.eventType)}"></div>
      <div class="timeline-item-header">
        <span class="timeline-type ${eventTypeClass(ev.eventType)}">${eventTypeIcon(ev.eventType)} ${ev.eventType}</span>
        <span class="timeline-ts">${fmtDateTime(ev.timestamp)}</span>
      </div>
      <div class="timeline-meta">
        <span>👤 ${escapeHtml(ev.operatorId)}</span>
        ${ev.location ? `<span>📍 ${ev.location.lat.toFixed(4)}, ${ev.location.lng.toFixed(4)}</span>` : ''}
        ${ev.batchId  ? `<span>📦 Batch</span>` : ''}
      </div>
    </div>
  `).join('');

  const body = document.getElementById('modal-cylinder-body');
  body.innerHTML = `
    <div class="passport-header">
      <div>
        <div class="passport-serial">${escapeHtml(cyl.serial)}</div>
        <div class="passport-id">${escapeHtml(cyl.id)}</div>
      </div>
      <div>
        <span class="status-badge ${getStatusClass(cyl.status)}">${getStatusLabel(cyl.status)}</span>
      </div>
    </div>

    ${alerts.length ? `<div class="passport-alerts">${alertsHtml}</div>` : ''}

    <div class="passport-grid">
      <div class="passport-field">
        <div class="passport-field-label">Manufacture Date</div>
        <div class="passport-field-value">${fmtDate(cyl.manufactureDate)}</div>
      </div>
      <div class="passport-field">
        <div class="passport-field-label">Capacity</div>
        <div class="passport-field-value">${cyl.capacity} kg</div>
      </div>
      <div class="passport-field">
        <div class="passport-field-label">Tare Weight</div>
        <div class="passport-field-value">${cyl.tareWeight} kg</div>
      </div>
      <div class="passport-field">
        <div class="passport-field-label">Fill Count</div>
        <div class="passport-field-value ${pct >= 100 ? 'danger' : pct >= 90 ? 'warning' : ''}">${cyl.fillCount} / ${cyl.maxFills}</div>
      </div>
      <div class="passport-field">
        <div class="passport-field-label">Max Fills</div>
        <div class="passport-field-value">${cyl.maxFills}</div>
      </div>
      <div class="passport-field">
        <div class="passport-field-label">Last Hydro Test</div>
        <div class="passport-field-value ${hydroOverdue ? 'danger' : ''}">${fmtDate(cyl.lastHydroTest)}</div>
      </div>
    </div>

    ${cyl.notes ? `<div style="margin-bottom:16px;padding:10px 12px;background:var(--bg);border-radius:8px;font-size:13px;color:var(--muted);">${escapeHtml(cyl.notes)}</div>` : ''}

    <div class="timeline-title">Event History (${events.length})</div>
    <div class="timeline">
      ${events.length ? timelineHtml : '<div style="color:var(--dim);font-size:13px;">No events recorded</div>'}
    </div>
  `;

  openModal('modal-cylinder');
}

// ── MODAL: REGISTER ───────────────────────────────────────────────────────────

function openRegisterModal(tagId) {
  document.getElementById('reg-tag-id').value  = tagId;
  document.getElementById('reg-serial').value  = '';
  document.getElementById('reg-mfg-date').value = '';
  document.getElementById('reg-tare').value     = '14.5';
  document.getElementById('reg-capacity').value = '12';
  document.getElementById('reg-maxfills').value = '500';
  document.getElementById('reg-hydrotest').value = '';
  document.getElementById('reg-notes').value    = '';

  const submitBtn = document.getElementById('reg-submit-btn');
  // Remove old listener
  const newBtn = submitBtn.cloneNode(true);
  submitBtn.replaceWith(newBtn);
  newBtn.addEventListener('click', () => submitRegister(tagId));

  openModal('modal-register');
}

async function submitRegister(tagId) {
  const serial    = document.getElementById('reg-serial').value.trim();
  const mfgDate   = document.getElementById('reg-mfg-date').value;
  const tare      = parseFloat(document.getElementById('reg-tare').value)     || 14.5;
  const capacity  = parseFloat(document.getElementById('reg-capacity').value) || 12;
  const maxFills  = parseInt(document.getElementById('reg-maxfills').value)   || 500;
  const hydrotest = document.getElementById('reg-hydrotest').value;
  const notes     = document.getElementById('reg-notes').value.trim();

  if (!serial) { showSnackbar('Serial number is required'); return; }
  if (!mfgDate) { showSnackbar('Manufacture date is required'); return; }

  const cylinder = {
    id:              tagId,
    serial,
    manufactureDate: mfgDate,
    tareWeight:      tare,
    capacity,
    maxFills,
    fillCount:       0,
    lastHydroTest:   hydrotest || null,
    status:          'available',
    notes,
  };

  await DB.put('cylinders', cylinder);

  const event = {
    id:         makeId(),
    cylinderId: tagId,
    eventType:  'registered',
    operatorId: State.operator || 'Unknown',
    timestamp:  new Date().toISOString(),
    location:   State.geo ? { lat: State.geo.lat, lng: State.geo.lng } : null,
    batchId:    null,
    synced:     false,
  };
  await DB.put('events', event);

  closeModal('modal-register');
  showSnackbar(`Registered: ${serial}`);
  await refreshUnsyncedBadge();
  showLastScan({ tagId, found: true, cylinder, eventType: 'registered' });
}

// ── MODAL: OPERATOR ───────────────────────────────────────────────────────────

function openOperatorModal() {
  document.getElementById('op-input').value = State.operator;
  openModal('modal-operator');
  setTimeout(() => document.getElementById('op-input').focus(), 300);
}

function setOperator() {
  const val = document.getElementById('op-input').value.trim();
  if (!val) { showSnackbar('Enter an operator ID'); return; }
  State.operator = val;
  localStorage.setItem('lpg-operator', val);
  updateOperatorPill();
  closeModal('modal-operator');
  showSnackbar(`Operator set: ${val}`);
}

function loadOperator() {
  const saved = localStorage.getItem('lpg-operator');
  if (saved) {
    State.operator = saved;
    updateOperatorPill();
  }
}

function updateOperatorPill() {
  const label = document.getElementById('operator-pill-label');
  const pill  = document.getElementById('operator-pill');
  if (State.operator) {
    label.textContent = State.operator;
    pill.classList.add('has-operator');
  } else {
    label.textContent = 'Set Operator';
    pill.classList.remove('has-operator');
  }
}

// ── MODAL: BATCH SUMMARY ──────────────────────────────────────────────────────

function showBatchSummary(results, eventType) {
  const ok   = results.filter(r => r.status === 'ok').length;
  const warn = results.filter(r => r.status === 'warn').length;
  const skip = results.filter(r => r.status === 'skip').length;

  const listHtml = results.map(r => `
    <li class="batch-result-item">
      <div class="batch-result-dot ${r.status}"></div>
      <div class="batch-result-serial">${escapeHtml(r.serial || r.tagId)}</div>
      <div class="batch-result-note">${escapeHtml(r.note)}</div>
    </li>
  `).join('');

  const body = document.getElementById('modal-batch-body');
  body.innerHTML = `
    <div class="batch-summary-stats">
      <div class="batch-stat">
        <div class="batch-stat-value ok">${ok}</div>
        <div class="batch-stat-label">Logged</div>
      </div>
      <div class="batch-stat">
        <div class="batch-stat-value warn">${warn}</div>
        <div class="batch-stat-label">Unknown</div>
      </div>
      <div class="batch-stat">
        <div class="batch-stat-value skip">${skip}</div>
        <div class="batch-stat-label">Skipped</div>
      </div>
    </div>
    <div style="font-size:13px;color:var(--muted);margin-bottom:10px;">
      Event type: <strong style="color:var(--text)">${eventType}</strong>
    </div>
    <ul class="batch-result-list">${listHtml}</ul>
    <button class="btn btn-primary btn-full" onclick="closeModal('modal-batch')">Done</button>
  `;

  openModal('modal-batch');
}

// ── MODALS (generic open/close) ───────────────────────────────────────────────

function openModal(id) {
  const el = document.getElementById(id);
  el.style.display = '';
  el.addEventListener('click', (e) => {
    if (e.target === el) closeModal(id);
  }, { once: false });
}

function closeModal(id) {
  const el = document.getElementById(id);
  el.style.display = 'none';
}

// Wire all modal close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

// ── ROUTER ────────────────────────────────────────────────────────────────────

async function showView(name) {
  State.currentView = name;

  const views = document.querySelectorAll('.view');
  views.forEach(v => { v.style.display = v.id === `view-${name}` ? '' : 'none'; });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });

  if (name === 'cylinders') {
    initCylindersView();
    await renderCylindersView();
  } else if (name === 'alerts') {
    await renderAlertsView();
  } else if (name === 'reports') {
    await renderReportsView();
  }

  // Re-focus scanner input if on scan view
  if (name === 'scan' && State.focused) {
    scannerInput.focus();
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────────

async function init() {
  await DB.open();
  await seedDemoData();
  loadOperator();

  // Wire operator pill
  document.getElementById('operator-pill').addEventListener('click', openOperatorModal);
  document.getElementById('op-save-btn').addEventListener('click',  setOperator);
  document.getElementById('op-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') setOperator();
  });

  // Wire GPS pill
  document.getElementById('gps-pill').addEventListener('click', () => requestGeo(false));

  // Wire nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  // Init scan view
  renderScanView();

  // Compute and show alerts badge on load
  const cylinders = await DB.getAll('cylinders');
  const totalAlerts = cylinders.reduce((acc, c) => acc + getCylinderAlerts(c).length, 0);
  updateAlertsBadge(totalAlerts);

  // Refresh unsynced badge
  await refreshUnsyncedBadge();

  // Try silent GPS on load
  requestGeo(true);

  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
}

init().catch(err => console.error('LPG Tracer init error:', err));
