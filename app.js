'use strict';

// ── State ─────────────────────────────────────────────────────────────────────

const state = {
  results: [],
  focused: false,
  nextId: 1,
};

// ── DOM refs ──────────────────────────────────────────────────────────────────

const scannerInput  = document.getElementById('scanner-input');
const statusBadge   = document.getElementById('status-badge');
const focusBtn      = document.getElementById('focus-btn');
const focusIcon     = document.getElementById('focus-icon');
const focusLabel    = document.getElementById('focus-label');
const setupBanner   = document.getElementById('setup-banner');
const resultsList   = document.getElementById('results-list');
const emptyState    = document.getElementById('empty-state');
const resultCount   = document.getElementById('result-count');
const clearBtn      = document.getElementById('clear-btn');
const exportBtn     = document.getElementById('export-btn');
const snackbar      = document.getElementById('snackbar');

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectType(data) {
  return /^[0-9A-Fa-f]{12,}$/.test(data.trim()) ? 'rfid' : 'barcode';
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function showSnackbar(msg) {
  snackbar.textContent = msg;
  snackbar.classList.add('show');
  clearTimeout(showSnackbar._t);
  showSnackbar._t = setTimeout(() => snackbar.classList.remove('show'), 2000);
}

// ── Scan input handling ───────────────────────────────────────────────────────

let inputBuffer = '';
let flushTimer  = null;

function flushBuffer() {
  const data = inputBuffer.trim();
  inputBuffer = '';
  if (data) addResult(data);
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

// ── Focus management ──────────────────────────────────────────────────────────

function setFocused(yes) {
  state.focused = yes;
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
    focusIcon.textContent = '⌨️';
    focusLabel.textContent = 'Tap to start scanning';
    statusBadge.textContent = 'Ready';
    statusBadge.className = 'badge badge-idle';
  }
}

focusBtn.addEventListener('click', () => setFocused(!state.focused));

document.addEventListener('click', (e) => {
  if (state.focused && e.target !== focusBtn && e.target !== clearBtn &&
      e.target !== exportBtn && !e.target.closest('.result-copy')) {
    scannerInput.focus();
  }
});

scannerInput.addEventListener('blur', () => {
  if (state.focused) {
    statusBadge.textContent = 'Unfocused';
    statusBadge.className = 'badge badge-scanning';
  }
});

scannerInput.addEventListener('focus', () => {
  if (state.focused) {
    statusBadge.textContent = 'Active';
    statusBadge.className = 'badge badge-active';
  }
});

// ── Results ───────────────────────────────────────────────────────────────────

function addResult(data) {
  const result = {
    id: state.nextId++,
    data: data.trim(),
    type: detectType(data),
    timestamp: new Date(),
  };
  state.results.unshift(result);

  if (state.results.length === 1) {
    setupBanner.style.display = 'none';
  }

  renderResult(result, true);
  updateControls();
}

function renderResult(result, prepend = false) {
  emptyState.style.display = 'none';

  const li = document.createElement('li');
  li.className = 'result-item';
  li.dataset.id = result.id;

  const typeLabel = result.type === 'rfid' ? 'RFID' : 'BCODE';
  const typeClass = result.type === 'rfid' ? 'type-rfid' : 'type-barcode';

  li.innerHTML = `
    <span class="type-badge ${typeClass}">${typeLabel}</span>
    <div class="result-body">
      <div class="result-data">${escapeHtml(result.data)}</div>
      <div class="result-meta">
        <span>${formatTime(result.timestamp)}</span>
        <span>#${result.id}</span>
      </div>
    </div>
    <button class="result-copy" title="Copy" aria-label="Copy scan data">⎘</button>
  `;

  li.querySelector('.result-copy').addEventListener('click', (e) => {
    e.stopPropagation();
    copyToClipboard(result.data);
  });

  if (prepend) {
    resultsList.prepend(li);
  } else {
    resultsList.append(li);
  }
}

function updateControls() {
  const count = state.results.length;
  resultCount.textContent = `(${count})`;
  clearBtn.style.display  = count > 0 ? '' : 'none';
  exportBtn.style.display = count > 0 ? '' : 'none';
  if (count === 0) emptyState.style.display = '';
}

function clearResults() {
  state.results = [];
  resultsList.innerHTML = '';
  updateControls();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Copy to clipboard ─────────────────────────────────────────────────────────

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSnackbar('Copied!');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showSnackbar('Copied!');
  }
}

// ── CSV export ────────────────────────────────────────────────────────────────

function exportCSV() {
  const header = 'id,type,data,timestamp\n';
  const rows = state.results.map(r =>
    `${r.id},${r.type},"${r.data.replace(/"/g,'""')}","${r.timestamp.toISOString()}"`
  ).join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `rfid-scans-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Wire up buttons ───────────────────────────────────────────────────────────

clearBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  clearResults();
  if (state.focused) scannerInput.focus();
});

exportBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  exportCSV();
  if (state.focused) scannerInput.focus();
});

// ── Service worker registration ───────────────────────────────────────────────

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
