'use strict';

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & DEMO DATA
// ══════════════════════════════════════════════════════════════════════════════

const DB_NAME    = 'lpg-tracer-db';
const DB_VERSION = 3;
const SEED_KEY   = 'seeded-v17';

// ── Firebase / Firestore ──────────────────────────────────────────────────────
// All data stores live in Firestore under /countries/{country}/; meta stays in IndexedDB for fast local seed-guard.
const FS_STORES = new Set(['cylinders', 'events', 'licenses', 'inspections']);
let _fdb = null;
let _activeCountry = localStorage.getItem('lpg-country') || 'TZ';

function _fsColl(storeName) {
  return _fdb.collection('countries').doc(_activeCountry).collection(storeName);
}

let _seedBatch = null;

function initFirebase() {
  try {
    if (typeof firebase === 'undefined') return;
    firebase.initializeApp({
      apiKey:            'AIzaSyA4wH-NyfGRI4le03vAYUBKrmMVdy9GnzY',
      authDomain:        'lpgtracking-f3050.firebaseapp.com',
      projectId:         'lpgtracking-f3050',
      storageBucket:     'lpgtracking-f3050.firebasestorage.app',
      messagingSenderId: '639111115983',
      appId:             '1:639111115983:web:b3499c57c946829a3c73ba',
    });
    _fdb = firebase.firestore();
    // Enable offline persistence so Firestore works without a network connection
    // after the first online load. Errors are non-fatal.
    _fdb.enablePersistence({ synchronizeTabs: true }).catch(() => {});
  } catch (e) {
    console.warn('Firebase init failed — using local IndexedDB only:', e);
    _fdb = null;
  }
}

async function _fsBatchFlush() {
  if (!_seedBatch || _seedBatch.length === 0) return;
  const batch = _fdb.batch();
  _seedBatch.forEach(({ ref, data }) => batch.set(ref, data));
  await batch.commit();
  _seedBatch = [];
}

async function _fsBatchAdd(storeName, record) {
  let ref;
  if (record.id != null) {
    ref = _fsColl(storeName).doc(String(record.id));
  } else {
    ref = _fsColl(storeName).doc();
    record = { ...record, id: ref.id };
  }
  _seedBatch.push({ ref, data: record });
  if (_seedBatch.length >= 500) await _fsBatchFlush();
  return record;
}

// ── i18n ─────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    'nav.dashboard':'Dashboard','nav.scan':'Scan','nav.cylinders':'Cylinders',
    'nav.network':'Network','nav.alerts':'Alerts','nav.reports':'Reports','nav.licenses':'Licenses',
    'login.subtitle':'Select your role to continue','login.enter':'Enter App →',
    'login.company':'Company','login.back':'‹ Back',
    'page.dashboard':'📊 Dashboard','page.scan':'📡 Scan','page.cylinders':'🔥 Cylinders',
    'page.network':'Network','page.alerts':'🔔 Alerts','page.reports':'📈 Management Reports','page.licenses':'📋 Licenses',
    'dash.lifecycle':'Cylinder Lifecycle','dash.supplychain':'Supply Chain','dash.alerts':'Alerts',
    'kpi.inrefill':'In Refill','kpi.incirc':'In Circulation','kpi.inreval':'In Revalidation','kpi.inuse':'In Use',
    'kpi.total':'Total','kpi.distributors':'Distributors','kpi.retailers':'Retailers',
    'filter.allTypes':'All Types','filter.allStatuses':'All statuses','filter.allYears':'All years','filter.allMonths':'All months',
    'btn.exportCsv':'↓ Export CSV','btn.exportPdf':'↓ Print / PDF',
    'mgmt.status':'Cylinders by Status','mgmt.refills':'Refills by Month','mgmt.salesRegion':'Sales by Region',
    'mgmt.topPartners':'Top 10 Partners by Sales','mgmt.topPartnersAll':'Top 10 Partners by Cylinder Count',
    'alert.requalOverdue':'Requalification Overdue',
    'alert.stuck':'Unreported','alert.misplaced':'Misplaced',
    'status.active':'active','status.inactive':'inactive',
    'status.inRefill':'In Refill','status.inCirc':'In Circulation','status.inReval':'In Revalidation','status.inUse':'In Use',
    'status.registered':'Registered','status.refilled':'Refilled','status.shipped':'Shipped','status.distReceived':'Dist. Received',
    'status.distSentRetail':'Sent to Retailer','status.retReceived':'Retailer Received','status.retSold':'Sold',
    'status.retReturnedEmpty':'Returned Empty (Retailer)','status.distReturnedEmpty':'Returned Empty (Dist.)','status.receivedEmpty':'Received Empty',
    'dash.totalAlerts':'Total Alerts','dash.refillingSites':'Refilling Sites',
    'dash.marketCompliance':'Field Inspection','mgmt.complianceRate':'Compliance Rate',
    'mgmt.lifecycleFunnel':'Cylinder Lifecycle Funnel',
    'funnel.registered':'Registered','funnel.inRefill':'In Refill','funnel.inCirculation':'In Circulation','funnel.inUse':'In Use','funnel.returned':'Returned',
    'alert.recall':'⚠️ RECALL',
    'recall.initiate':'Initiate Recall','recall.operator':'Operator','recall.dateFrom':'Manufacture From','recall.dateTo':'Manufacture To','recall.reason':'Reason / Safety Notice','recall.submit':'Issue Recall','recall.saved':'Recall issued — affected cylinders now flagged in alerts.',
    'dash.avgRefillCycle':'Avg Refill Cycle','dash.utilisationRate':'Utilisation Rate',
    'dash.daysLabel':'days received→refilled','dash.utilLabel':'in-use + in-circ / total',
    'kpi.filled':'filled','kpi.empty':'empty','kpi.full':'full',
    'kpi.activeDistributors':'Active Distributors','kpi.activeRetailers':'Active Retailers',
    'passport.eventHistory':'Event History','passport.sortNewest':'Newest first','passport.sortOldest':'Oldest first',
    'ev.registered':'Cylinder Created & Registered','ev.refilled':'Refilled at Plant',
    'ev.shipped':'Shipped to Distributor/Retailer','ev.receivedEmpty':'Empty Received at Refill Site',
    'ev.sentRevalidation':'Sent for Revalidation','ev.revalReceived':'Received at Revalidation Centre',
    'ev.revalidated':'Revalidated & Approved','ev.revalReturned':'Returned after Revalidation',
    'ev.distReceived':'Received by Distributor','ev.distSentRetail':'Sent to Retailer',
    'ev.distReturnedEmpty':'Returned Empty by Distributor','ev.retReceived':'Received by Retailer',
    'ev.retSold':'Sold to Consumer','ev.retReturnedEmpty':'Returned Empty by Consumer',
    'ev.inspected':'Inspected by Field Auditor','ev.ewuraMonitored':'Supply Monitored by Regulator',
    'ev.traVerified':'Refills Verified by TRA','ev.traRegistered':'Shipment Registered by TRA',
    'dash.activityTitle':'Activity — Last 30 Days','dash.salesByMonth':'Sales by Month',
    'kpi.cylsInStock':'Cylinders in Stock','kpi.assignedAlerts':'Alerts',
    'kpi.cylAssigned':'Cylinders Assigned',
    'kpi.yourStock':'Your Stock',
    'dash.noActivity':'No activity in last 30 days.',
    'license.company':'Company',
    'license.number':'License No.',
    'license.issued':'Issued',
    'license.expires':'Expires',
    'license.status':'Status',
    'license.details':'License Details',
    'license.location':'Location Info',
    'mgmt.inspections':'Inspections & Scans',
    'mgmt.compliant':'Compliant',
    'mgmt.nonCompliant':'Non-Compliant',
    'mgmt.salesByWeight':'Sales by SKU',
    'mgmt.weightKg':'kg cylinders',
    'kpi.totalInactive':'total',
    'login.brandTitle':'LPG Traceability Platform',
    'login.feat1':'LPG cylinder lifecycle management',
    'login.feat2':'Real-time supply chain visibility',
    'login.feat3':'Multi-stakeholder regulatory compliance',
    'login.feat4':'Field inspection alerts',
    'login.feat5':'Consumer engagement',
    'login.brandFooter':'Regulator · LPG Sector',
    'login.regulatorTitle':'Regulator',
    'login.panelTitle':'Select your profile',
    'login.panelSubtitle':'Choose the role that matches your organisation to continue',
    'login.ewuraDesc':'Regulatory Authority · Grant & Revoke Licences · Monitor Supply Chain',
    'login.lpgmcDesc':'LPG Marketing Company · Register · Refill · Ship · Receive · Send Revalidation',
    'login.distTitle':'Distributor','login.distDesc':'Distribution Company · Receive · Supply to Retailers · Return Empty',
    'login.retailerTitle':'Retailer','login.retailerDesc':'Retail Outlet · Receive Cylinders · Sell · Return Empty',
    'login.revalTitle':'Revalidator','login.revalDesc':'Cylinders Revalidator · Receive · Revalidate & Update · Return to LPGMC',
    'login.auditorTitle':'Field Auditor','login.auditorDesc':'Field Inspection Unit · Inspect Products · View All Cylinders',
    'login.traDesc':'Revenue Authority · Cross-check Refills · Register Shipments',
    'mgmt.netSalesTop10':'Network Sales — Top 10 Partners',
    'mgmt.fieldInspByRegion':'Field Inspection by Region',
    'mgmt.alertsByRegion':'Cylinder Alerts by Region',
    'mgmt.totalCylAlerts':'Total cylinders with alerts',
    'mgmt.totalInsp':'Total inspections',
    'mgmt.opComplianceRanking':'Operator Compliance Ranking',
    'msg.noInspData':'No inspection data yet.',
    'msg.noSalesData':'No sales data yet.',
    'msg.noActiveAlerts':'No active alerts.',
    'msg.noInspPeriod':'No inspection data for this period.',
    'msg.noSalesPeriod':'No sales data for this period.',
    'word.inspections':'inspections',
    'word.critical':'critical',
    'word.warning':'warning',
    'status.inTransit':'In Transit',
    'status.atTerminal':'At Terminal',
    'status.delivered':'Delivered',
    'status.loading':'Loading',
    'nav.bulletTanks':'Bullet Tanks',
    'page.bulletTanks':'🚛 Bullet Tanks',
    'btn.register':'Register','btn.shipment':'Shipment','btn.reception':'Reception',
    'btn.commitAll':'Commit All','btn.clear':'Clear','btn.logout':'← Exit',
    'word.list':'List','word.map':'Map','word.info':'Info',
    'word.misplacedCyl':'Misplaced Cylinder',
    'filter.allCompanies':'All companies','filter.allSeverities':'All severities',
    'batch.mode':'Batch mode',
    'scan.keepFocus':'Keep this app in focus while scanning',
    'scan.lastScan':'Last Scan','scan.recentEvents':'Recent Events',
    'scan.noEvents':'No events yet. Start scanning.',
    'scan.batchQueue':'Batch Queue',
    'scan.startHint':'Tap to start scanning',
    'scan.pauseHint':'Scanning active — tap to pause',
    'scan.lookingUp':'Looking up…',
    'scan.unknownTag':'Unknown tag — opening registration…',
    'scan.notRegistered':'Tag not registered.',
    'scan.active':'Active','scan.unfocused':'Unfocused','status.idle':'Idle',
    'cyl.searchPlaceholder':'Search serial / tag…',
    'cyl.notFound':'No cylinders found.','alert.noneFound':'No alerts.',
    'nav.inspections':'Inspections','nav.marketIntel':'Market Intel',
    'page.inspections':'🔍 Field Inspections','page.marketIntel':'📊 Market Intelligence',
    'btn.newInspection':'+ New Inspection','btn.bulkRegister':'Bulk Register',
    'btn.scheduleInspection':'Schedule','btn.registerCylinders':'Register Cylinders',
    'insp.company':'Company / Operator','insp.region':'Region','insp.auditor':'Auditor',
    'insp.date':'Scheduled Date','insp.notes':'Notes','insp.newTitle':'Schedule Inspection',
    'insp.status.overdue':'overdue','insp.status.scheduled':'scheduled','insp.status.completed':'completed',
    'bulk.title':'Bulk Cylinder Registration','bulk.uploadLabel':'Upload CSV / TXT file',
    'bulk.pasteLabel':'Or paste cylinder IDs (one per line, 22-char E280116060… format)',
    'bulk.validIds':'valid IDs found','bulk.noValidIds':'No valid IDs found',
    'counterfeit.title':'COUNTERFEIT ALERT','counterfeit.body':'is not registered in the national LPG database.',
    'counterfeit.sub':'This may indicate a counterfeit or unregistered cylinder.',
    'counterfeit.report':'Report to Regulator','counterfeit.reported':'Reported ✓',
    'counterfeit.submitted':'Counterfeit report submitted to Regulator',
    'alert.stockShortage':'Stock Shortage','alert.stockSurplus':'Stock Surplus',
    'alert.counterfeit':'Counterfeit Alert',
    'marketIntel.summary':'National Summary','marketIntel.totalCyls':'Total Cylinders',
    'marketIntel.activeOps':'Active Operators','marketIntel.activeLic':'Active Licences',
    'marketIntel.totalEvents':'Total Events','marketIntel.byRegion':'Cylinders by Region',
    'marketIntel.opShare':'Operator Market Share','marketIntel.scanVolume':'Monthly Scan Volume (last 6 months)',
    'marketIntel.statusBreakdown':'Cylinder Status Breakdown',
    'marketIntel.atRefill':'At Refill Plant','marketIntel.inDist':'In Distribution',
    'marketIntel.inReval':'In Revalidation','marketIntel.withConsumer':'With Consumer',
    'returnRate.title':'Return Rate by Retailer','returnRate.noData':'No dispatch data available.',
    'audit.exported':'Audit trail exported',
    'consumer.title':'Cylinder Status Check','consumer.subtitle':'LPG Cylinder Verification',
    'consumer.registered':'Registered Cylinder','consumer.notRegistered':'Not Registered',
    'consumer.notRegisteredDesc':'is not registered in the national LPG database. This may be a counterfeit or unregistered cylinder — do not use and report to the Regulator.',
    'consumer.closeLogin':'Close & Login',
    'insp.scheduledOk':'Inspection scheduled.',
    'licApp.newUser':'New to the platform?',
    'licApp.btnLabel':'📋 Apply for LPG Distribution Licence',
    'licApp.title':'LPG Distribution Licence Application',
    'licApp.subtitle':'Regulatory Application — Petroleum (LPG Operations) Rules',
    'licApp.allRequired':'All fields marked * are required',
    'licApp.completeness':'Application completeness',
    'licApp.back':'← Back','licApp.cancel':'Cancel',
    'licApp.saveDraft':'💾 Save Draft','licApp.draftSaved':'✓ Draft saved',
    'licApp.submit':'Submit Application →',
    'licApp.sec1':'1. Applicant Information',
    'licApp.sec2':'2. Corporate / Registration Documents',
    'licApp.sec2sub':'Certified copies in PDF or image format (max 10 MB each)',
    'licApp.sec3':'3. Land & Facility Documents',
    'licApp.sec3sub':'Documents for the premises where LPG operations will be conducted',
    'licApp.sec4':'4. Technical Requirements',
    'licApp.sec4sub':'Operational and commercial capability documentation',
    'licApp.sec5':'5. Financial Proof',
    'licApp.sec5note':'(at least one required)',
    'licApp.sec5sub':'Submit at least one of the following documents demonstrating sufficient financial capacity',
    'licApp.sec6':'6. Health, Safety & Environment',
    'licApp.sec6sub':'Valid certificates from the relevant regulatory bodies',
    'licApp.sec7':'7. Administrative & Compliance Documents',
    'licApp.sec7sub':'Declarations, pledges and proof of payment',
    'licApp.companyName':'Company Name (as registered)',
    'licApp.companyNamePlh':'Full legal name of the company',
    'licApp.tin':'TIN Number','licApp.tinPlh':'e.g. 100-123-456',
    'licApp.vat':'VAT Registration Number','licApp.vatPlh':'If registered for VAT',
    'licApp.contact':'Contact Person','licApp.contactPlh':'Full name',
    'licApp.designation':'Designation / Title','licApp.designationPlh':'e.g. Managing Director',
    'licApp.email':'Email Address','licApp.emailPlh':'official@company.com',
    'licApp.phone':'Phone Number','licApp.phonePlh':'+255 …',
    'licApp.address':'Physical / Registered Address','licApp.addressPlh':'Street address, city',
    'licApp.region':'Region','licApp.selectRegion':'Select region…',
    'licApp.companyType':'Company Type','licApp.local':'Local Company','licApp.foreign':'Foreign Company',
    'licApp.optional':'optional','licApp.attachFile':'Attach file','licApp.noFile':'No file selected',
    'licApp.processTitle':'ℹ Regulatory Application Process',
    'licApp.proc1':'Applications are submitted online via the Regulator\'s licence portal',
    'licApp.proc2':'Regulator publishes a public notice to solicit comments within <strong>14 days</strong>',
    'licApp.proc3':'Regulator must decide within <strong>60 days</strong> of a complete application whether to grant, deny, or refer back',
    'licApp.proc4':'A pre-licensing facility inspection is conducted before the licence is granted',
    'licApp.proc5':'Licence term: <strong>5 years</strong> &nbsp;·&nbsp; Application fee is non-refundable',
    'licApp.successTitle':'Application Submitted',
    'licApp.successMsg1':'Your LPG Distribution Licence application for <strong>{{company}}</strong> has been received.',
    'licApp.successMsg2':'Regulator will publish a public notice within <strong>14 days</strong> and issue a decision within <strong>60 days</strong> of a complete application. A pre-licensing facility inspection will be arranged.',
    'licApp.successNext':'<strong>Next step:</strong> Submit your physical application documents to the Regulator\'s licence portal or visit the Regulator offices.',
    'licApp.backToLogin':'Back to Login',
    'licApp.noCompany':'Please enter your company name before submitting.',
    'licApp.noFinancial':'Please attach at least one financial proof document (Section 5).',
    'word.cancel':'Cancel','word.close':'Close','word.optional':'(optional)',
    'word.allStatuses':'All statuses','word.allTypes':'All Types',
    'word.active':'Active','word.inactive':'Inactive','word.revalidator':'Revalidator',
    'status.suspended':'Suspended','status.expired':'Expired',
    'license.company':'Company Name','license.number':'License Number',
    'license.status':'Status',
    'lic.issueTitle':'Issue New License','lic.companyPlh':'e.g. Sunrise Gas Ltd',
    'lic.numberPlh':'e.g. LPGMC-2026-008','lic.issuedDate':'Issued Date','lic.expiryDate':'Expiry Date',
    'lic.issueBtn':'Issue License','lic.issueViewBtn':'+ Issue License',
    'lic.searchPlh':'Search company…','lic.noLicenses':'No licenses found.',
    'lic.detailTitle':'License Details','lic.revoke':'Revoke License','lic.renew':'Renew License',
    'lic.cylStock':'Cylinder Stock','lic.history':'License History',
    'lic.typeLabel':'Type','lic.issuedRenewed':'Issued / Renewed','lic.lastInspection':'Last Inspection',
    'ship.title':'New Shipment','ship.consumer':'Consumer sales',
    'ship.consumerId':'Consumer ID','ship.consumerIdPlh':'National ID, phone, or account number…',
    'ship.dest':'Destination','ship.cylinders':'Batch Scan Cylinders (RFID)',
    'ship.rfidPlh':'Scan RFID tag…','ship.add':'Add',
    'ship.noCylinders':'No cylinders scanned yet.',
    'ship.notes':'Notes','ship.notesPlh':'Add shipment notes…','ship.invoice':'Invoice',
    'ship.cancel':'Cancel','ship.confirm':'Confirm Shipment',
    'recv.title':'Reception','recv.scanLabel':'Scan or enter cylinder tag',
    'recv.scanPlh':'Scan RFID / barcode or type tag ID…','recv.add':'Add',
    'recv.noCylinders':'No cylinders scanned yet.','recv.notes':'Notes',
    'recv.notesPlh':'e.g. delivery reference, condition remarks…',
    'recv.cancel':'Cancel','recv.confirm':'Confirm Reception',
    'net.noPartners':'No partners found.',
    'net.sortName':'Sort: Name A–Z','net.sortStockDesc':'Stock: High → Low','net.sortStockAsc':'Stock: Low → High',
    'net.sortFullDesc':'Full: High → Low','net.sortEmptyDesc':'Empty: High → Low',
    'net.distributor':'Distributor','net.retailer':'Retailer',
    'recall.title':'⚠️ Cylinder Recalls','recall.newBtn':'+ Initiate Recall',
    'recall.modalTitle':'Initiate Cylinder Recall',
    'recall.warning':'A recall will trigger safety alerts across the network. Ensure all details are verified before issuing.',
    'recall.ref':'Recall Reference','recall.refPlh':'Auto-generated',
    'recall.selectOp':'— Select operator —',
    'recall.batch':'Batch Number','recall.batchPlh':'e.g. BATCH-2026-041',
    'recall.severity':'Severity',
    'recall.sevCritical':'🔴 Critical — Immediate withdrawal required',
    'recall.sevHigh':'🟠 High — Withdraw within 48 hours',
    'recall.sevMedium':'🟡 Medium — Controlled recall',
    'recall.reasonPlh':'Describe the defect, hazard, or safety concern…',
    'recall.affectedLocs':'Affected Cylinder Locations','recall.previewBtn':'🗺 Preview on Map',
    'recall.badgeCritical':'🔴 Critical','recall.badgeHigh':'🟠 High','recall.badgeMedium':'🟡 Medium',
    'recall.allBatches':'All batches','recall.batchLabel':'Batch:','recall.mfrPeriod':'Manufacture period:',
    'recall.delete':'Delete','recall.noRecalls':'No recalls issued.',
    'recall.deleted':'Recall deleted.','recall.required':'Operator and reason are required.',
    'month.jan':'January','month.feb':'February','month.mar':'March','month.apr':'April',
    'month.may':'May','month.jun':'June','month.jul':'July','month.aug':'August',
    'month.sep':'September','month.oct':'October','month.nov':'November','month.dec':'December',
    'page.licenses':'📋 Licenses','page.reports':'📈 Management Reports',
    'signup.title':'Create Account','signup.desc':'Enter your activation details to get started.',
    'signup.license':'License Key','signup.licensePlh':'e.g. LIC-2026-XXXX',
    'signup.fullname':'Full Name','signup.fullnamePlh':'Your full name',
    'signup.email':'Email','signup.emailPlh':'you@company.com',
    'signup.password':'Password','signup.passwordPlh':'Min 8 characters',
    'signup.confirm':'Confirm Password','signup.confirmPlh':'Repeat password',
    'signup.submit':'Create Account','signup.alreadyLicensed':'Already licensed?','signup.openBtn':'🔑 Sign Up — Register Platform Credentials',
    'signup.allRequired':'All fields are required.',
    'signup.pwNoMatch':'Passwords do not match.','signup.pwShort':'Password must be at least 8 characters.',
    'signup.emailExists':'An account with this email already exists.',
    'signup.submitted':'Account created! You can now log in.',
    'reg.title':'Register Cylinder','reg.rfidSerial':'RFID Tag Serial',
    'reg.rfidTag':'RFID Tag','reg.rfidTagPlh':'Scan or enter 22-char EPC…','reg.scan':'Scan',
    'reg.serial':'Cylinder Serial Number','reg.serialPlh':'e.g. TZ-2024-00142','reg.scanBarcode':'Scan Barcode',
    'reg.marking':'Cylinder Marking / Specification',
    'reg.brand':'Brand','reg.brandPlh':'e.g. K-Gas','reg.manufacturer':'Manufacturer',
    'reg.product':'Product Type','reg.dates':'Manufacture & Requalification Dates',
    'reg.mfgDate':'Manufacture Date','reg.lastRequalDate':'Last Requalification Date',
    'reg.requalPlant':'Requalification Plant',
    'reg.specs':'Physical Specifications','reg.tare':'Tare Weight (kg)','reg.net':'Net Weight (kg)',
    'reg.pressure':'Test Pressure (bar)','reg.pressurePlh':'e.g. 30',
    'reg.hydroDate':'Hydrostatic Test Date',
    'reg.notes':'Notes','reg.notesPlh':'Optional notes…',
    'reg.cancel':'Cancel','reg.submit':'Register Cylinder',
    'reg.serialRequired':'Serial number is required.','reg.serialExists':'Serial already registered.',
    'reg.ready':'Ready to register:','reg.readySerial':'Serial:',
    'partner.location':'Location','partner.region':'Region','partner.city':'City',
    'partner.address':'Address','partner.contact':'Contact','partner.contactPerson':'Contact Person',
    'partner.status':'Status','partner.coords':'Coordinates',
    'partner.totalCyls':'Total Cylinders','partner.fullStock':'Full (in stock)',
    'partner.emptyStock':'Empty (in stock)','partner.inspect':'🔍 Inspect','partner.close':'Close',
    'insp.fieldTitle':'Field Inspection','insp.scanTag':'Scan RFID Tag',
    'insp.scanPlh':'Scan or enter tag ID…','insp.check':'Check',
    'insp.scannedSession':'SCANNED THIS SESSION','insp.done':'Done',
    'insp.auditorLabel':'Auditor:','insp.dateLabel':'Date:',
    'passport.title':'Cylinder Passport','passport.close':'Close','passport.export':'Export PDF',
    'passport.identity':'Identity','passport.serial':'Serial No.',
    'passport.rfid':'RFID Tag','passport.company':'Company','passport.status':'Status',
    'passport.level':'Fill Level','passport.unknown':'Unknown',
    'passport.filled':'Filled','passport.empty':'Empty',
    'passport.specs':'Physical Specs','passport.mfgDate':'Manufacture Date',
    'passport.tare':'Tare Weight','passport.net':'Net Weight','passport.location':'Last Known Location',
    'map.locations':'locations','map.location':'location','map.clickHint':'Click a pin for details',
    'page.prev':'← Prev','page.next':'Next →',
    'mgmt.currentStock':'Current Stock','mgmt.stockAge':'Stock Age',
    'mgmt.noDataPeriod':'No data for this period.',
    'mgmt.dispatchesByMonth':'Dispatches by Month',
    'mgmt.ageFresh':'Fresh','mgmt.ageNormal':'Normal','mgmt.ageSlow':'Slow-moving','mgmt.ageAging':'Aging stock',
    'scan.selectEventFirst':'Select an event first.','scan.noEventsExport':'No events to export.',
  },
  sw: {
    'nav.dashboard':'Dashibodi','nav.scan':'Changanua','nav.cylinders':'Mitungi',
    'nav.network':'Mtandao','nav.alerts':'Tahadhari','nav.reports':'Ripoti','nav.licenses':'Leseni',
    'login.subtitle':'Chagua jukumu lako kuendelea','login.enter':'Ingia →',
    'login.company':'Kampuni','login.back':'‹ Rudi',
    'page.dashboard':'📊 Dashibodi','page.scan':'📡 Changanua','page.cylinders':'🔥 Mitungi',
    'page.network':'Mtandao','page.alerts':'🔔 Tahadhari','page.reports':'📈 Ripoti za Usimamizi','page.licenses':'📋 Leseni',
    'dash.lifecycle':'Mzunguko wa Mitungi','dash.supplychain':'Mnyororo wa Ugavi','dash.alerts':'Tahadhari',
    'kpi.inrefill':'Kwenye Kujaza','kpi.incirc':'Kwenye Mzunguko','kpi.inreval':'Kwenye Uhakiki Upya','kpi.inuse':'Inatumika',
    'kpi.total':'Jumla','kpi.distributors':'Wasambazaji','kpi.retailers':'Wauzaji',
    'filter.allTypes':'Aina Zote','filter.allStatuses':'Hali Zote','filter.allYears':'Miaka Yote','filter.allMonths':'Miezi Yote',
    'btn.exportCsv':'↓ Hamisha CSV','btn.exportPdf':'↓ Chapisha / PDF',
    'mgmt.status':'Mitungi kwa Hali','mgmt.refills':'Kujaza kwa Mwezi','mgmt.salesRegion':'Mauzo kwa Mkoa',
    'mgmt.topPartners':'Washirika 10 Bora kwa Mauzo','mgmt.topPartnersAll':'Washirika 10 Bora kwa Idadi ya Mitungi',
    'alert.requalOverdue':'Uhakiki Upya Umechelewa',
    'alert.stuck':'Haikutangazwa','alert.misplaced':'Imepotea',
    'status.active':'hai','status.inactive':'haifanyi kazi',
    'status.inRefill':'Kwenye Kujaza','status.inCirc':'Kwenye Mzunguko','status.inReval':'Kwenye Uhakiki Upya','status.inUse':'Inatumika',
    'status.registered':'Imesajiliwa','status.refilled':'Imejazwa','status.shipped':'Imetumwa','status.distReceived':'Imepokelewa (Msambazaji)',
    'status.distSentRetail':'Imetumwa kwa Muuzaji','status.retReceived':'Imepokelewa (Muuzaji)','status.retSold':'Imeuzwa',
    'status.retReturnedEmpty':'Imerudishwa Tupu (Muuzaji)','status.distReturnedEmpty':'Imerudishwa Tupu (Msambazaji)','status.receivedEmpty':'Imepokelewa Tupu',
    'dash.totalAlerts':'Tahadhari Zote','dash.refillingSites':'Vituo vya Kujaza',
    'dash.marketCompliance':'Ukaguzi wa Uwanjani','mgmt.complianceRate':'Kiwango cha Kuzingatia',
    'mgmt.lifecycleFunnel':'Mzunguko wa Silinda',
    'funnel.registered':'Zilizosajiliwa','funnel.inRefill':'Zinajazwa','funnel.inCirculation':'Zinazunguka','funnel.inUse':'Zinatumika','funnel.returned':'Zilizorudishwa',
    'alert.recall':'⚠️ RECALL',
    'recall.initiate':'Anzisha Kumbukumbu','recall.operator':'Mwendeshaji','recall.dateFrom':'Tarehe ya Uzalishaji (Kutoka)','recall.dateTo':'Tarehe ya Uzalishaji (Hadi)','recall.reason':'Sababu / Taarifa ya Usalama','recall.submit':'Toa Recall','recall.saved':'Recall imetolewa — silinda zilizoathiriwa zimeonyeshwa katika tahadhari.',
    'dash.avgRefillCycle':'Wastani wa Kujaza','dash.utilisationRate':'Kiwango cha Matumizi',
    'dash.daysLabel':'siku (zilipokelewa→kujazwa)','dash.utilLabel':'inatumika + mzunguko / jumla',
    'kpi.filled':'imejazwa','kpi.empty':'tupu','kpi.full':'kamili',
    'kpi.activeDistributors':'Wasambazaji Wanaofanya Kazi','kpi.activeRetailers':'Wauzaji Wanaofanya Kazi',
    'passport.eventHistory':'Historia ya Matukio','passport.sortNewest':'Mpya kwanza','passport.sortOldest':'Kongwe kwanza',
    'ev.registered':'Mtungi Umeundwa na Kusajiliwa','ev.refilled':'Imejazwa Kiwandani',
    'ev.shipped':'Imetumwa kwa Msambazaji/Muuzaji','ev.receivedEmpty':'Mtungi Tupu Umepokelewa Kituo cha Kujaza',
    'ev.sentRevalidation':'Imetumwa kwa Uthibitishaji Upya','ev.revalReceived':'Imepokelewa Kituo cha Uthibitishaji',
    'ev.revalidated':'Imethibitishwa na Kukubaliwa','ev.revalReturned':'Imerudishwa baada ya Uthibitishaji',
    'ev.distReceived':'Imepokelewa na Msambazaji','ev.distSentRetail':'Imetumwa kwa Muuzaji',
    'ev.distReturnedEmpty':'Mtungi Tupu Umerudishwa na Msambazaji','ev.retReceived':'Imepokelewa na Muuzaji',
    'ev.retSold':'Imeuzwa kwa Mnunuzi','ev.retReturnedEmpty':'Mtungi Tupu Umerudishwa na Mnunuzi',
    'ev.inspected':'Imekaguliwa na Mkaguzi wa Uwanjani','ev.ewuraMonitored':'Ugavi Unaofuatiliwa na Msimamizi',
    'ev.traVerified':'Kujaza Kuthibitishwa na TRA','ev.traRegistered':'Mzigo Umesajiliwa na TRA',
    'dash.activityTitle':'Shughuli — Siku 30 Zilizopita',
    'kpi.cylAssigned':'Mitungi Iliyokasimiwa','dash.salesByMonth':'Mauzo kwa Mwezi',
    'kpi.cylsInStock':'Mitungi Kwenye Hifadhi','kpi.assignedAlerts':'Tahadhari',
    'kpi.yourStock':'Hifadhi Yako',
    'dash.noActivity':'Hakuna shughuli katika siku 30 zilizopita.',
    'license.company':'Kampuni',
    'license.number':'Nambari ya Leseni',
    'license.issued':'Ilitolewa',
    'license.expires':'Inaisha',
    'license.status':'Hali',
    'license.details':'Maelezo ya Leseni',
    'license.location':'Maelezo ya Eneo',
    'mgmt.inspections':'Ukaguzi na Uchanganuzi',
    'mgmt.compliant':'Inakidhi',
    'mgmt.nonCompliant':'Haikusidhi',
    'mgmt.salesByWeight':'Mauzo kwa SKU',
    'mgmt.weightKg':'kg mitungi',
    'kpi.totalInactive':'jumla',
    'login.brandTitle':'Jukwaa la Ufuatiliaji wa LPG',
    'login.feat1':'Usimamizi wa mzunguko wa maisha wa mitungi ya LPG',
    'login.feat2':'Mwonekano wa mnyororo wa ugavi kwa wakati halisi',
    'login.feat3':'Kuzingatia kanuni kwa wadau wengi',
    'login.feat4':'Tahadhari za ukaguzi wa uwanjani',
    'login.feat5':'Ushirikiano wa watumiaji',
    'login.brandFooter':'Msimamizi · Sekta ya LPG',
    'login.regulatorTitle':'Msimamizi',
    'login.panelTitle':'Chagua wasifu wako',
    'login.panelSubtitle':'Chagua jukumu linalolingana na shirika lako kuendelea',
    'login.ewuraDesc':'Mamlaka ya Udhibiti · Kutoa na Kufuta Leseni · Kufuatilia Mnyororo wa Ugavi',
    'login.lpgmcDesc':'Kampuni ya Uuzaji wa LPG · Sajili · Jaza · Tuma · Pokea · Tuma Uthibitishaji Upya',
    'login.distTitle':'Msambazaji','login.distDesc':'Kampuni ya Usambazaji · Pokea · Saidia Wauzaji · Rudisha Tupu',
    'login.retailerTitle':'Muuzaji','login.retailerDesc':'Duka la Rejareja · Pokea Mitungi · Uza · Rudisha Tupu',
    'login.revalTitle':'Mthibitishaji','login.revalDesc':'Mthibitishaji wa Mitungi · Pokea · Thibitisha Upya · Rudisha kwa LPGMC',
    'login.auditorTitle':'Mkaguzi wa Uwanjani','login.auditorDesc':'Kitengo cha Ukaguzi wa Uwanjani · Kagua Bidhaa · Tazama Mitungi Yote',
    'login.traDesc':'Mamlaka ya Mapato · Kagua Kujaza · Sajili Mizigo',
    'mgmt.netSalesTop10':'Mauzo ya Mtandao — Washirika 10 Bora',
    'mgmt.fieldInspByRegion':'Ukaguzi wa Uwanjani kwa Mkoa',
    'mgmt.alertsByRegion':'Tahadhari za Mitungi kwa Mkoa',
    'mgmt.totalCylAlerts':'Jumla ya mitungi yenye tahadhari',
    'mgmt.totalInsp':'Jumla ya ukaguzi',
    'mgmt.opComplianceRanking':'Daraja la Uzingatiaji wa Waendeshaji',
    'msg.noInspData':'Hakuna data ya ukaguzi bado.',
    'msg.noSalesData':'Hakuna data ya mauzo bado.',
    'msg.noActiveAlerts':'Hakuna tahadhari zinazoendelea.',
    'msg.noInspPeriod':'Hakuna data ya ukaguzi kwa kipindi hiki.',
    'msg.noSalesPeriod':'Hakuna data ya mauzo kwa kipindi hiki.',
    'word.inspections':'ukaguzi',
    'word.critical':'muhimu',
    'word.warning':'onyo',
    'status.inTransit':'Safarini',
    'status.atTerminal':'Kitengelani',
    'status.delivered':'Imefikishwa',
    'status.loading':'Inapakia',
    'nav.bulletTanks':'Matangi Makubwa',
    'page.bulletTanks':'🚛 Matangi Makubwa',
    'btn.register':'Sajili','btn.shipment':'Tuma','btn.reception':'Pokea',
    'btn.commitAll':'Thibitisha Zote','btn.clear':'Futa','btn.logout':'← Toka',
    'word.list':'Orodha','word.map':'Ramani','word.info':'Taarifa',
    'word.misplacedCyl':'Mtungi Uliopotea',
    'filter.allCompanies':'Kampuni Zote','filter.allSeverities':'Uzito Wote',
    'batch.mode':'Hali ya Kundi',
    'scan.keepFocus':'Weka programu hii mbele unapochanga',
    'scan.lastScan':'Uchanganuzi wa Mwisho','scan.recentEvents':'Matukio ya Hivi Karibuni',
    'scan.noEvents':'Hakuna matukio bado. Anza kuchanganua.',
    'scan.batchQueue':'Foleni ya Kundi',
    'scan.startHint':'Bonyeza kuanza kuchanganua',
    'scan.pauseHint':'Uchanganuzi unaendelea — bonyeza kusimamisha',
    'scan.lookingUp':'Inatafuta…',
    'scan.unknownTag':'Lebo isiyojulikana — inafungua usajili…',
    'scan.notRegistered':'Lebo haijasajiliwa.',
    'scan.active':'Inafanya kazi','scan.unfocused':'Haijalenga','status.idle':'Kimya',
    'cyl.searchPlaceholder':'Tafuta nambari / lebo…',
    'cyl.notFound':'Hakuna mitungi iliyopatikana.','alert.noneFound':'Hakuna tahadhari.',
    'nav.inspections':'Ukaguzi','nav.marketIntel':'Akili ya Soko',
    'page.inspections':'🔍 Ukaguzi wa Uwanjani','page.marketIntel':'📊 Akili ya Soko',
    'btn.newInspection':'+ Ukaguzi Mpya','btn.bulkRegister':'Sajili Kwa Wingi',
    'btn.scheduleInspection':'Panga Ratiba','btn.registerCylinders':'Sajili Mitungi',
    'insp.company':'Kampuni / Mwendeshaji','insp.region':'Mkoa','insp.auditor':'Mkaguzi',
    'insp.date':'Tarehe ya Ukaguzi','insp.notes':'Maelezo','insp.newTitle':'Panga Ukaguzi',
    'insp.status.overdue':'imechelewa','insp.status.scheduled':'imepangwa','insp.status.completed':'imekamilika',
    'bulk.title':'Usajili wa Mitungi kwa Wingi','bulk.uploadLabel':'Pakia faili la CSV / TXT',
    'bulk.pasteLabel':'Au bandika vitambulisho vya mitungi (kimoja kwa mstari, muundo E280116060… wa herufi 22)',
    'bulk.validIds':'vitambulisho sahihi vimepatikana','bulk.noValidIds':'Hakuna vitambulisho sahihi',
    'counterfeit.title':'TAHADHARI YA BANDIA','counterfeit.body':'haijasajiliwa katika hifadhidata ya kitaifa ya LPG.',
    'counterfeit.sub':'Hii inaweza kuashiria mtungi bandia au ambao haujasajiliwa.',
    'counterfeit.report':'Ripoti kwa Msimamizi','counterfeit.reported':'Imeripotiwa ✓',
    'counterfeit.submitted':'Ripoti ya mtungi bandia imetumwa kwa Msimamizi',
    'alert.stockShortage':'Upungufu wa Hifadhi','alert.stockSurplus':'Ziada ya Hifadhi',
    'alert.counterfeit':'Tahadhari ya Bandia',
    'marketIntel.summary':'Muhtasari wa Kitaifa','marketIntel.totalCyls':'Jumla ya Mitungi',
    'marketIntel.activeOps':'Waendeshaji Wanaofanya Kazi','marketIntel.activeLic':'Leseni Zinazofanya Kazi',
    'marketIntel.totalEvents':'Jumla ya Matukio','marketIntel.byRegion':'Mitungi kwa Mkoa',
    'marketIntel.opShare':'Sehemu ya Soko ya Waendeshaji','marketIntel.scanVolume':'Kiasi cha Uchanganuzi kwa Mwezi (miezi 6 iliyopita)',
    'marketIntel.statusBreakdown':'Mgawanyo wa Hali za Mitungi',
    'marketIntel.atRefill':'Kituo cha Kujaza','marketIntel.inDist':'Kwenye Usambazaji',
    'marketIntel.inReval':'Kwenye Uthibitishaji','marketIntel.withConsumer':'Kwa Mnunuzi',
    'returnRate.title':'Kiwango cha Urudishaji kwa Muuzaji','returnRate.noData':'Hakuna data ya usafirishaji.',
    'audit.exported':'Rekodi ya ukaguzi imehamiishwa',
    'consumer.title':'Ukaguzi wa Hali ya Mtungi','consumer.subtitle':'Uhakiki wa Mitungi ya LPG',
    'consumer.registered':'Mtungi Uliosajiliwa','consumer.notRegistered':'Haujasajiliwa',
    'consumer.notRegisteredDesc':'haujasajiliwa katika hifadhidata ya kitaifa ya LPG. Hii inaweza kuwa mtungi bandia — usitumie na ripoti kwa Msimamizi.',
    'consumer.closeLogin':'Funga na Ingia',
    'insp.scheduledOk':'Ukaguzi umepangwa.',
    'licApp.newUser':'Mgeni kwenye jukwaa?',
    'licApp.btnLabel':'📋 Omba Leseni ya Usambazaji wa LPG',
    'licApp.title':'Maombi ya Leseni ya Usambazaji wa LPG',
    'licApp.subtitle':'Maombi ya Udhibiti — Kanuni za Petroli (Uendeshaji wa LPG)',
    'licApp.allRequired':'Sehemu zote zenye alama * zinahitajika',
    'licApp.completeness':'Ukamilishaji wa maombi',
    'licApp.back':'← Rudi','licApp.cancel':'Ghairi',
    'licApp.saveDraft':'💾 Hifadhi Rasimu','licApp.draftSaved':'✓ Rasimu imehifadhiwa',
    'licApp.submit':'Wasilisha Maombi →',
    'licApp.sec1':'1. Taarifa za Mwombaji',
    'licApp.sec2':'2. Hati za Kampuni / Usajili',
    'licApp.sec2sub':'Nakala zilizoidhinishwa katika muundo wa PDF au picha (hadi MB 10 kila moja)',
    'licApp.sec3':'3. Hati za Ardhi na Jengo',
    'licApp.sec3sub':'Hati za eneo ambapo shughuli za LPG zitafanyika',
    'licApp.sec4':'4. Mahitaji ya Kiufundi',
    'licApp.sec4sub':'Nyaraka za uwezo wa uendeshaji na biashara',
    'licApp.sec5':'5. Uthibitisho wa Fedha',
    'licApp.sec5note':'(angalau moja inahitajika)',
    'licApp.sec5sub':'Wasilisha angalau moja ya hati zifuatazo zinazoonyesha uwezo wa kutosha wa fedha',
    'licApp.sec6':'6. Afya, Usalama na Mazingira',
    'licApp.sec6sub':'Vyeti halali kutoka kwa mamlaka husika za udhibiti',
    'licApp.sec7':'7. Hati za Kiutawala na Uzingatiaji',
    'licApp.sec7sub':'Tangazo, ahadi na uthibitisho wa malipo',
    'licApp.companyName':'Jina la Kampuni (kama ilivyosajiliwa)',
    'licApp.companyNamePlh':'Jina kamili la kisheria la kampuni',
    'licApp.tin':'Nambari ya TIN','licApp.tinPlh':'mfano: 100-123-456',
    'licApp.vat':'Nambari ya Usajili wa VAT','licApp.vatPlh':'Ikiwa imesajiliwa kwa VAT',
    'licApp.contact':'Mtu wa Kuwasiliana Naye','licApp.contactPlh':'Jina kamili',
    'licApp.designation':'Cheo / Wadhifa','licApp.designationPlh':'mfano: Mkurugenzi Mtendaji',
    'licApp.email':'Anwani ya Barua Pepe','licApp.emailPlh':'rasmi@kampuni.com',
    'licApp.phone':'Nambari ya Simu','licApp.phonePlh':'+255 …',
    'licApp.address':'Anwani ya Makao Makuu / Iliyosajiliwa','licApp.addressPlh':'Mtaa, mji',
    'licApp.region':'Mkoa','licApp.selectRegion':'Chagua mkoa…',
    'licApp.companyType':'Aina ya Kampuni','licApp.local':'Kampuni ya Ndani','licApp.foreign':'Kampuni ya Kigeni',
    'licApp.optional':'ya hiari','licApp.attachFile':'Ambatanisha faili','licApp.noFile':'Hakuna faili lililochaguliwa',
    'licApp.processTitle':'ℹ Mchakato wa Maombi wa Msimamizi',
    'licApp.proc1':'Maombi yanawasilishwa mtandaoni kupitia tovuti ya leseni ya Msimamizi',
    'licApp.proc2':'Msimamizi huchapisha tangazo la umma kupata maoni ndani ya <strong>siku 14</strong>',
    'licApp.proc3':'Msimamizi lazima afanye uamuzi ndani ya <strong>siku 60</strong> baada ya maombi kamili kutoa, kukataa, au kurudisha',
    'licApp.proc4':'Ukaguzi wa awali wa kituo unafanywa kabla ya kutoa leseni',
    'licApp.proc5':'Muda wa leseni: <strong>miaka 5</strong> &nbsp;·&nbsp; Ada ya maombi hairejeshe',
    'licApp.successTitle':'Maombi Yamewasilishwa',
    'licApp.successMsg1':'Maombi yako ya Leseni ya Usambazaji wa LPG kwa <strong>{{company}}</strong> yamepokelewa.',
    'licApp.successMsg2':'Msimamizi atachapisha tangazo la umma ndani ya <strong>siku 14</strong> na kutoa uamuzi ndani ya <strong>siku 60</strong> baada ya maombi kamili. Ukaguzi wa awali wa kituo utaratibiwa.',
    'licApp.successNext':'<strong>Hatua inayofuata:</strong> Wasilisha hati zako za maombi ya kimwili kwenye tovuti ya leseni ya Msimamizi au tembelea ofisi za Msimamizi.',
    'licApp.backToLogin':'Rudi kwenye Kuingia',
    'licApp.noCompany':'Tafadhali ingiza jina la kampuni yako kabla ya kuwasilisha.',
    'licApp.noFinancial':'Tafadhali ambatanisha angalau hati moja ya uthibitisho wa fedha (Sehemu ya 5).',
    'word.cancel':'Ghairi','word.close':'Funga','word.optional':'(ya hiari)',
    'word.allStatuses':'Hali Zote','word.allTypes':'Aina Zote',
    'word.active':'Inafanya Kazi','word.inactive':'Haifanyi Kazi','word.revalidator':'Mthibitishaji',
    'status.suspended':'Imesimamishwa','status.expired':'Imeisha',
    'license.company':'Jina la Kampuni','license.number':'Nambari ya Leseni',
    'license.status':'Hali',
    'lic.issueTitle':'Toa Leseni Mpya','lic.companyPlh':'mfano: Sunrise Gas Ltd',
    'lic.numberPlh':'mfano: LPGMC-2026-008','lic.issuedDate':'Tarehe ya Kutolewa','lic.expiryDate':'Tarehe ya Kumalizika',
    'lic.issueBtn':'Toa Leseni','lic.issueViewBtn':'+ Toa Leseni',
    'lic.searchPlh':'Tafuta kampuni…','lic.noLicenses':'Hakuna leseni zilizopatikana.',
    'lic.detailTitle':'Maelezo ya Leseni','lic.revoke':'Futa Leseni','lic.renew':'Rejesha Leseni',
    'lic.cylStock':'Hifadhi ya Mitungi','lic.history':'Historia ya Leseni',
    'lic.typeLabel':'Aina','lic.issuedRenewed':'Imetolewa / Imehuishwa','lic.lastInspection':'Ukaguzi wa Mwisho',
    'ship.title':'Mzigo Mpya','ship.consumer':'Mauzo kwa Watumiaji',
    'ship.consumerId':'Kitambulisho cha Mnunuzi','ship.consumerIdPlh':'Kitambulisho cha taifa, simu, au nambari ya akaunti…',
    'ship.dest':'Marudio','ship.cylinders':'Changanua Mitungi kwa Kundi (RFID)',
    'ship.rfidPlh':'Changanua lebo ya RFID…','ship.add':'Ongeza',
    'ship.noCylinders':'Hakuna mitungi iliyochanganuliwa bado.',
    'ship.notes':'Maelezo','ship.notesPlh':'Ongeza maelezo ya mzigo…','ship.invoice':'Ankara',
    'ship.cancel':'Ghairi','ship.confirm':'Thibitisha Mzigo',
    'recv.title':'Mapokezi','recv.scanLabel':'Changanua au ingiza lebo ya mtungi',
    'recv.scanPlh':'Changanua RFID / msimbo au chapa kitambulisho…','recv.add':'Ongeza',
    'recv.noCylinders':'Hakuna mitungi iliyochanganuliwa bado.','recv.notes':'Maelezo',
    'recv.notesPlh':'mfano: kumbukumbu ya uwasilishaji, maelezo ya hali…',
    'recv.cancel':'Ghairi','recv.confirm':'Thibitisha Mapokezi',
    'net.noPartners':'Hakuna washirika waliopatikana.',
    'net.sortName':'Panga: Jina A–Z','net.sortStockDesc':'Hifadhi: Juu → Chini','net.sortStockAsc':'Hifadhi: Chini → Juu',
    'net.sortFullDesc':'Kamili: Juu → Chini','net.sortEmptyDesc':'Tupu: Juu → Chini',
    'net.distributor':'Msambazaji','net.retailer':'Muuzaji',
    'recall.title':'⚠️ Kumbukumbu za Mitungi','recall.newBtn':'+ Anzisha Kumbukumbu',
    'recall.modalTitle':'Anzisha Kumbukumbu ya Mtungi',
    'recall.warning':'Kumbukumbu itasababisha tahadhari za usalama kwenye mtandao. Hakikisha maelezo yote yamethibitishwa kabla ya kutoa.',
    'recall.ref':'Kumbukumbu ya Rejea','recall.refPlh':'Inazalishwa kiotomatiki',
    'recall.selectOp':'— Chagua mwendeshaji —',
    'recall.batch':'Nambari ya Kundi','recall.batchPlh':'mfano: BATCH-2026-041',
    'recall.severity':'Uzito',
    'recall.sevCritical':'🔴 Muhimu — Kuondolewa mara moja kunahitajika',
    'recall.sevHigh':'🟠 Juu — Ondoa ndani ya masaa 48',
    'recall.sevMedium':'🟡 Wastani — Kumbukumbu inayodhibitiwa',
    'recall.reasonPlh':'Elezea kasoro, hatari, au wasiwasi wa usalama…',
    'recall.affectedLocs':'Maeneo ya Mitungi Iliyoathiriwa','recall.previewBtn':'🗺 Angalia kwenye Ramani',
    'recall.badgeCritical':'🔴 Muhimu','recall.badgeHigh':'🟠 Juu','recall.badgeMedium':'🟡 Wastani',
    'recall.allBatches':'Makundi yote','recall.batchLabel':'Kundi:','recall.mfrPeriod':'Kipindi cha Uzalishaji:',
    'recall.delete':'Futa','recall.noRecalls':'Hakuna kumbukumbu zilizotolewa.',
    'recall.deleted':'Kumbukumbu imefutwa.','recall.required':'Mwendeshaji na sababu zinahitajika.',
    'month.jan':'Januari','month.feb':'Februari','month.mar':'Machi','month.apr':'Aprili',
    'month.may':'Mei','month.jun':'Juni','month.jul':'Julai','month.aug':'Agosti',
    'month.sep':'Septemba','month.oct':'Oktoba','month.nov':'Novemba','month.dec':'Desemba',
    'page.licenses':'📋 Leseni','page.reports':'📈 Ripoti za Usimamizi',
    'signup.title':'Fungua Akaunti','signup.desc':'Ingiza maelezo yako ya uanzishaji kuanza.',
    'signup.license':'Funguo ya Leseni','signup.licensePlh':'mfano: EWURA-2026-XXXX',
    'signup.fullname':'Jina Kamili','signup.fullnamePlh':'Jina lako kamili',
    'signup.email':'Barua pepe','signup.emailPlh':'wewe@kampuni.com',
    'signup.password':'Nywila','signup.passwordPlh':'Angalau herufi 8',
    'signup.confirm':'Thibitisha Nywila','signup.confirmPlh':'Rudia nywila',
    'signup.submit':'Fungua Akaunti','signup.alreadyLicensed':'Una leseni tayari?','signup.openBtn':'🔑 Jiandikishe — Sajili Akaunti',
    'signup.allRequired':'Sehemu zote zinahitajika.',
    'signup.pwNoMatch':'Nywila hazifanani.','signup.pwShort':'Nywila iwe na angalau herufi 8.',
    'signup.emailExists':'Akaunti yenye barua pepe hii tayari ipo.',
    'signup.submitted':'Akaunti imeundwa! Sasa unaweza kuingia.',
    'reg.title':'Sajili Mtungi','reg.rfidSerial':'Nambari ya Mfululizo ya RFID',
    'reg.rfidTag':'Lebo ya RFID','reg.rfidTagPlh':'Changanua au ingiza EPC ya herufi 22…','reg.scan':'Changanua',
    'reg.serial':'Nambari ya Mfululizo ya Mtungi','reg.serialPlh':'mfano: TZ-2024-00142','reg.scanBarcode':'Changanua Msimbo',
    'reg.marking':'Alama / Vipimo vya Mtungi',
    'reg.brand':'Chapa','reg.brandPlh':'mfano: K-Gas','reg.manufacturer':'Mtengenezaji',
    'reg.product':'Aina ya Bidhaa','reg.dates':'Tarehe za Utengenezaji na Uhakiki Upya',
    'reg.mfgDate':'Tarehe ya Utengenezaji','reg.lastRequalDate':'Tarehe ya Uhakiki Upya wa Mwisho',
    'reg.requalPlant':'Kiwanda cha Uhakiki Upya',
    'reg.specs':'Vipimo vya Kimwili','reg.tare':'Uzito wa Chombo Tupu (kg)','reg.net':'Uzito wa Gesi (kg)',
    'reg.pressure':'Shinikizo la Majaribio (bar)','reg.pressurePlh':'mfano: 30',
    'reg.hydroDate':'Tarehe ya Majaribio ya Maji',
    'reg.notes':'Maelezo','reg.notesPlh':'Maelezo ya hiari…',
    'reg.cancel':'Ghairi','reg.submit':'Sajili Mtungi',
    'reg.serialRequired':'Nambari ya mfululizo inahitajika.','reg.serialExists':'Nambari ya mfululizo tayari imesajiliwa.',
    'reg.ready':'Tayari kusajili:','reg.readySerial':'Nambari ya Mfululizo:',
    'partner.location':'Mahali','partner.region':'Mkoa','partner.city':'Mji',
    'partner.address':'Anwani','partner.contact':'Mawasiliano','partner.contactPerson':'Mtu wa Mawasiliano',
    'partner.status':'Hali','partner.coords':'Kuratibu',
    'partner.totalCyls':'Mitungi Yote','partner.fullStock':'Kamili (kwenye hifadhi)',
    'partner.emptyStock':'Tupu (kwenye hifadhi)','partner.inspect':'🔍 Kagua','partner.close':'Funga',
    'insp.fieldTitle':'Ukaguzi wa Uwanjani','insp.scanTag':'Changanua Lebo ya RFID',
    'insp.scanPlh':'Changanua au ingiza kitambulisho cha lebo…','insp.check':'Angalia',
    'insp.scannedSession':'VILIVYOCHANGANULIWA KATIKA KIKAO HIKI','insp.done':'Imekamilika',
    'insp.auditorLabel':'Mkaguzi:','insp.dateLabel':'Tarehe:',
    'passport.title':'Pasipoti ya Mtungi','passport.close':'Funga','passport.export':'Hamisha PDF',
    'passport.identity':'Utambulisho','passport.serial':'Nambari ya Mfululizo',
    'passport.rfid':'Lebo ya RFID','passport.company':'Kampuni','passport.status':'Hali',
    'passport.level':'Kiwango cha Kujaza','passport.unknown':'Haijulikani',
    'passport.filled':'Imejazwa','passport.empty':'Tupu',
    'passport.specs':'Vipimo vya Kimwili','passport.mfgDate':'Tarehe ya Utengenezaji',
    'passport.tare':'Uzito Tupu','passport.net':'Uzito wa Gesi','passport.location':'Mahali pa Mwisho Kujulikana',
    'map.locations':'maeneo','map.location':'mahali','map.clickHint':'Bonyeza pin kwa maelezo',
    'page.prev':'← Iliyotangulia','page.next':'Inayofuata →',
    'mgmt.currentStock':'Hifadhi ya Sasa','mgmt.stockAge':'Umri wa Hifadhi',
    'mgmt.noDataPeriod':'Hakuna data kwa kipindi hiki.',
    'mgmt.dispatchesByMonth':'Usafirishaji kwa Mwezi',
    'mgmt.ageFresh':'Mpya','mgmt.ageNormal':'Kawaida','mgmt.ageSlow':'Inasogea polepole','mgmt.ageAging':'Inakaribia Kumalizika',
    'scan.selectEventFirst':'Chagua tukio kwanza.','scan.noEventsExport':'Hakuna matukio ya kusafirisha.',
  },
};

let _lang = localStorage.getItem('lpg-lang') || 'en';
function t(key) { return (TRANSLATIONS[_lang] || TRANSLATIONS.en)[key] || TRANSLATIONS.en[key] || key; }

const FLAG_SVG_GB = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 14' width='20' height='14' style='display:inline-block;vertical-align:middle;border-radius:2px;margin-right:3px'><rect width='20' height='14' fill='#012169'/><line x1='0' y1='0' x2='20' y2='14' stroke='white' stroke-width='4'/><line x1='20' y1='0' x2='0' y2='14' stroke='white' stroke-width='4'/><line x1='0' y1='0' x2='20' y2='14' stroke='#C8102E' stroke-width='2.5'/><line x1='20' y1='0' x2='0' y2='14' stroke='#C8102E' stroke-width='2.5'/><rect x='0' y='5.5' width='20' height='3' fill='white'/><rect x='8.5' y='0' width='3' height='14' fill='white'/><rect x='0' y='6' width='20' height='2' fill='#C8102E'/><rect x='9' y='0' width='2' height='14' fill='#C8102E'/></svg>`;
const FLAG_SVG_TZ = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 14' width='20' height='14' style='display:inline-block;vertical-align:middle;border-radius:2px;margin-right:3px'><rect width='20' height='14' fill='#1EB53A'/><polygon points='20,0 20,14 0,14' fill='#00A3DD'/><polygon points='0,10.34 14.77,0 20,0 20,3.66 5.23,14 0,14' fill='#FCD116'/><polygon points='0,12.17 17.38,0 20,0 20,1.83 2.62,14 0,14' fill='#231F20'/></svg>`;

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.innerHTML = _lang === 'sw' ? FLAG_SVG_TZ + ' SW' : FLAG_SVG_GB + ' EN';
  });
  document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === _lang);
  });
  const cylSearch = $('cyl-search');
  if (cylSearch) cylSearch.placeholder = t('cyl.searchPlaceholder');
  // Re-render current view if it uses dynamic text
  const activeView = document.querySelector('.view.active');
  if (activeView) {
    const viewName = activeView.id.replace('view-','');
    if (viewName === 'reports')       renderReports().catch(() => {});
    if (viewName === 'mgmt-reports')  renderMgmtReports().catch(() => {});
    if (viewName === 'network')       renderNetwork().catch(() => {});
    if (viewName === 'alerts')        renderAlerts().catch(() => {});
  }
}

const DEMO_CYLINDERS = [
  // Vivo LPG (12)
  { id:'E280116060000204C3F04E81', serial:'VLG-2013-001', company:'Vivo LPG', manufactureDate:'2013-03-10', tareWeight:8.0, capacity:6, fillCount:520, lastHydroTest:'2018-03-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E82', serial:'VLG-2015-002', company:'Vivo LPG', manufactureDate:'2015-06-10', tareWeight:8.0, capacity:6, fillCount:461, lastHydroTest:'2020-06-10', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E83', serial:'VLG-2016-003', company:'Vivo LPG', manufactureDate:'2016-01-22', tareWeight:8.0, capacity:6, fillCount:390, lastHydroTest:'2021-01-22', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E84', serial:'VLG-2017-004', company:'Vivo LPG', manufactureDate:'2017-09-05', tareWeight:14.5, capacity:12, fillCount:310, lastHydroTest:'2022-09-05', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04E85', serial:'VLG-2018-005', company:'Vivo LPG', manufactureDate:'2018-04-18', tareWeight:14.5, capacity:12, fillCount:230, lastHydroTest:'2023-04-18', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E86', serial:'VLG-2019-006', company:'Vivo LPG', manufactureDate:'2019-11-30', tareWeight:14.5, capacity:12, fillCount:174, lastHydroTest:'2024-11-30', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E87', serial:'VLG-2020-007', company:'Vivo LPG', manufactureDate:'2020-07-14', tareWeight:14.5, capacity:12, fillCount:118, lastHydroTest:'2025-07-14', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E88', serial:'VLG-2021-008', company:'Vivo LPG', manufactureDate:'2021-03-08', tareWeight:14.5, capacity:12, fillCount:82,  lastHydroTest:'2026-03-08', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EA1', serial:'VLG-2021-009', company:'Vivo LPG', manufactureDate:'2021-08-20', tareWeight:14.5, capacity:12, fillCount:74,  lastHydroTest:'2026-08-20', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EA2', serial:'VLG-2022-010', company:'Vivo LPG', manufactureDate:'2022-02-15', tareWeight:14.5, capacity:12, fillCount:55,  lastHydroTest:'2027-02-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EA3', serial:'VLG-2023-011', company:'Vivo LPG', manufactureDate:'2023-05-01', tareWeight:14.5, capacity:12, fillCount:28,  lastHydroTest:'2028-05-01', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04EA4', serial:'VLG-2024-012', company:'Vivo LPG', manufactureDate:'2024-01-10', tareWeight:14.5, capacity:12, fillCount:9,   lastHydroTest:'2029-01-10', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EF1', serial:'VLG-2012-013', company:'Vivo LPG', manufactureDate:'2012-05-15', tareWeight:28.5, capacity:38, fillCount:640, lastHydroTest:'2017-05-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EF2', serial:'VLG-2014-014', company:'Vivo LPG', manufactureDate:'2014-08-22', tareWeight:28.5, capacity:38, fillCount:490, lastHydroTest:'2019-08-22', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EF3', serial:'VLG-2025-015', company:'Vivo LPG', manufactureDate:'2025-02-01', tareWeight:14.5, capacity:12, fillCount:3,   lastHydroTest:'2030-02-01', status:'in-refill',      notes:'' },
  // Total Energies (15)
  { id:'E280116060000204C3F04E89', serial:'TEN-2014-001', company:'Total Energies', manufactureDate:'2014-02-27', tareWeight:8.0, capacity:6, fillCount:512, lastHydroTest:'2019-02-27', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E8A', serial:'TEN-2015-002', company:'Total Energies', manufactureDate:'2015-08-19', tareWeight:8.0, capacity:6, fillCount:420, lastHydroTest:'2020-08-19', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E8B', serial:'TEN-2016-003', company:'Total Energies', manufactureDate:'2016-05-03', tareWeight:8.0, capacity:6, fillCount:360, lastHydroTest:'2021-05-03', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E8C', serial:'TEN-2017-004', company:'Total Energies', manufactureDate:'2017-01-15', tareWeight:14.5, capacity:12, fillCount:295, lastHydroTest:'2022-01-15', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E8D', serial:'TEN-2018-005', company:'Total Energies', manufactureDate:'2018-07-22', tareWeight:14.5, capacity:12, fillCount:220, lastHydroTest:'2023-07-22', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04E8E', serial:'TEN-2019-006', company:'Total Energies', manufactureDate:'2019-09-10', tareWeight:14.5, capacity:12, fillCount:163, lastHydroTest:'2024-09-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E8F', serial:'TEN-2020-007', company:'Total Energies', manufactureDate:'2020-12-01', tareWeight:14.5, capacity:12, fillCount:101, lastHydroTest:'2025-12-01', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E90', serial:'TEN-2021-008', company:'Total Energies', manufactureDate:'2021-04-15', tareWeight:14.5, capacity:12, fillCount:68,  lastHydroTest:'2026-04-15', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04EB1', serial:'TEN-2021-009', company:'Total Energies', manufactureDate:'2021-10-30', tareWeight:14.5, capacity:12, fillCount:57,  lastHydroTest:'2026-10-30', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EB2', serial:'TEN-2022-010', company:'Total Energies', manufactureDate:'2022-06-18', tareWeight:14.5, capacity:12, fillCount:41,  lastHydroTest:'2027-06-18', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EB3', serial:'TEN-2023-011', company:'Total Energies', manufactureDate:'2023-02-05', tareWeight:14.5, capacity:12, fillCount:23,  lastHydroTest:'2028-02-05', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EB4', serial:'TEN-2024-012', company:'Total Energies', manufactureDate:'2024-03-20', tareWeight:14.5, capacity:12, fillCount:6,   lastHydroTest:'2029-03-20', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EF4', serial:'TEN-2013-013', company:'Total Energies', manufactureDate:'2013-07-10', tareWeight:28.5, capacity:38, fillCount:570, lastHydroTest:'2018-07-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EF5', serial:'TEN-2012-014', company:'Total Energies', manufactureDate:'2012-11-30', tareWeight:28.5, capacity:38, fillCount:610, lastHydroTest:'2017-11-30', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EF6', serial:'TEN-2025-015', company:'Total Energies', manufactureDate:'2025-01-15', tareWeight:14.5, capacity:12, fillCount:2,   lastHydroTest:'2030-01-15', status:'in-refill',      notes:'' },
  // Shell Gas (15)
  { id:'E280116060000204C3F04E91', serial:'SHG-2013-001', company:'Shell Gas', manufactureDate:'2013-06-20', tareWeight:8.0, capacity:6, fillCount:589, lastHydroTest:'2018-06-20', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E92', serial:'SHG-2014-002', company:'Shell Gas', manufactureDate:'2014-11-08', tareWeight:8.0, capacity:6, fillCount:480, lastHydroTest:'2019-11-08', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E93', serial:'SHG-2016-003', company:'Shell Gas', manufactureDate:'2016-03-25', tareWeight:14.5, capacity:12, fillCount:355, lastHydroTest:'2021-03-25', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E94', serial:'SHG-2017-004', company:'Shell Gas', manufactureDate:'2017-08-14', tareWeight:14.5, capacity:12, fillCount:280, lastHydroTest:'2022-08-14', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04E95', serial:'SHG-2018-005', company:'Shell Gas', manufactureDate:'2018-02-28', tareWeight:14.5, capacity:12, fillCount:212, lastHydroTest:'2023-02-28', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E96', serial:'SHG-2019-006', company:'Shell Gas', manufactureDate:'2019-07-17', tareWeight:14.5, capacity:12, fillCount:159, lastHydroTest:'2024-07-17', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E97', serial:'SHG-2020-007', company:'Shell Gas', manufactureDate:'2020-10-05', tareWeight:14.5, capacity:12, fillCount:108, lastHydroTest:'2025-10-05', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04E98', serial:'SHG-2021-008', company:'Shell Gas', manufactureDate:'2021-01-20', tareWeight:14.5, capacity:12, fillCount:77,  lastHydroTest:'2026-01-20', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EC1', serial:'SHG-2022-009', company:'Shell Gas', manufactureDate:'2022-04-12', tareWeight:14.5, capacity:12, fillCount:48,  lastHydroTest:'2027-04-12', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EC2', serial:'SHG-2022-010', company:'Shell Gas', manufactureDate:'2022-09-28', tareWeight:14.5, capacity:12, fillCount:35,  lastHydroTest:'2027-09-28', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EC3', serial:'SHG-2023-011', company:'Shell Gas', manufactureDate:'2023-07-04', tareWeight:14.5, capacity:12, fillCount:18,  lastHydroTest:'2028-07-04', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EC4', serial:'SHG-2024-012', company:'Shell Gas', manufactureDate:'2024-02-14', tareWeight:14.5, capacity:12, fillCount:5,   lastHydroTest:'2029-02-14', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EF7', serial:'SHG-2012-013', company:'Shell Gas', manufactureDate:'2012-09-10', tareWeight:28.5, capacity:38, fillCount:618, lastHydroTest:'2017-09-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EF8', serial:'SHG-2015-014', company:'Shell Gas', manufactureDate:'2015-02-20', tareWeight:14.5, capacity:12, fillCount:445, lastHydroTest:'2020-02-20', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EF9', serial:'SHG-2025-015', company:'Shell Gas', manufactureDate:'2025-03-12', tareWeight:14.5, capacity:12, fillCount:4,   lastHydroTest:'2030-03-12', status:'in-refill',      notes:'' },
  // Lake Gas (9)
  { id:'E280116060000204C3F04E99', serial:'LKG-2015-001', company:'Lake Gas', manufactureDate:'2015-04-12', tareWeight:8.0, capacity:6, fillCount:430, lastHydroTest:'2020-04-12', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E9A', serial:'LKG-2016-002', company:'Lake Gas', manufactureDate:'2016-10-30', tareWeight:14.5, capacity:12, fillCount:340, lastHydroTest:'2021-10-30', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E9B', serial:'LKG-2018-003', company:'Lake Gas', manufactureDate:'2018-06-18', tareWeight:14.5, capacity:12, fillCount:238, lastHydroTest:'2023-06-18', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04E9C', serial:'LKG-2019-004', company:'Lake Gas', manufactureDate:'2019-01-09', tareWeight:14.5, capacity:12, fillCount:185, lastHydroTest:'2024-01-09', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E9D', serial:'LKG-2020-005', company:'Lake Gas', manufactureDate:'2020-05-24', tareWeight:14.5, capacity:12, fillCount:122, lastHydroTest:'2025-05-24', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E9E', serial:'LKG-2021-006', company:'Lake Gas', manufactureDate:'2021-09-11', tareWeight:14.5, capacity:12, fillCount:78,  lastHydroTest:'2026-09-11', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04ED1', serial:'LKG-2022-007', company:'Lake Gas', manufactureDate:'2022-03-15', tareWeight:14.5, capacity:12, fillCount:49,  lastHydroTest:'2027-03-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04ED2', serial:'LKG-2023-008', company:'Lake Gas', manufactureDate:'2023-07-22', tareWeight:14.5, capacity:12, fillCount:21,  lastHydroTest:'2028-07-22', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04ED3', serial:'LKG-2024-009', company:'Lake Gas', manufactureDate:'2024-04-05', tareWeight:14.5, capacity:12, fillCount:7,   lastHydroTest:'2029-04-05', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EFA', serial:'LKG-2013-010', company:'Lake Gas', manufactureDate:'2013-04-08', tareWeight:28.5, capacity:38, fillCount:548, lastHydroTest:'2018-04-08', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EFB', serial:'LKG-2014-011', company:'Lake Gas', manufactureDate:'2014-12-15', tareWeight:28.5, capacity:38, fillCount:415, lastHydroTest:'2019-12-15', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EFC', serial:'LKG-2025-012', company:'Lake Gas', manufactureDate:'2025-04-20', tareWeight:14.5, capacity:12, fillCount:2,   lastHydroTest:'2030-04-20', status:'in-refill',      notes:'' },
];

const DEMO_LICENSES = [
  { id:'LIC-001', companyName:'Vivo LPG',        companyType:'LPGMC',         licenseNumber:'LPGMC-2020-001', issuedDate:'2020-01-15', expiryDate:'2027-01-14', status:'active',  history:[{type:'granted', date:'2020-01-15', by:'EWURA', note:'Initial license granted'}] },
  { id:'LIC-002', companyName:'Total Energies',   companyType:'LPGMC',         licenseNumber:'LPGMC-2019-002', issuedDate:'2019-06-01', expiryDate:'2026-05-31', status:'active',  history:[{type:'granted', date:'2019-06-01', by:'EWURA', note:'Initial license granted'},{type:'renewed', date:'2023-06-01', by:'EWURA', note:'License renewed for 3 years'}] },
  { id:'LIC-003', companyName:'Shell Gas',        companyType:'LPGMC',         licenseNumber:'LPGMC-2021-003', issuedDate:'2021-03-10', expiryDate:'2028-03-09', status:'active',  history:[{type:'granted', date:'2021-03-10', by:'EWURA', note:'Initial license granted'}] },
  { id:'LIC-004', companyName:'ABC Distributors', companyType:'Distributor',   licenseNumber:'DIST-2022-001',  issuedDate:'2022-07-20', expiryDate:'2025-07-19', status:'expired', history:[{type:'granted', date:'2022-07-20', by:'EWURA', note:'Initial license granted'}] },
  { id:'LIC-005', companyName:'QuickGas Retail',  companyType:'Retailer',      licenseNumber:'RET-2023-005',   issuedDate:'2023-02-14', expiryDate:'2026-02-13', status:'expired', history:[{type:'granted', date:'2023-02-14', by:'EWURA', note:'Initial license granted'}] },
  { id:'LIC-006', companyName:'ProRevalid Ltd',   companyType:'Revalidator',   licenseNumber:'REVAL-2021-001', issuedDate:'2021-09-01', expiryDate:'2027-08-31', status:'active',  history:[{type:'granted', date:'2021-09-01', by:'EWURA', note:'Initial license granted'}] },
  { id:'LIC-007', companyName:'CityGas Direct',   companyType:'Retailer',      licenseNumber:'RET-2024-012',   issuedDate:'2024-11-01', expiryDate:'2027-10-31', status:'active',  history:[{type:'granted', date:'2024-11-01', by:'EWURA', note:'Initial license granted'}] },
];

const DEMO_INSPECTIONS = [
  { id:'INS-001', company:'Vivo LPG',                region:'Dar es Salaam', auditor:'John Msaki',    scheduledDate:'2026-05-10', status:'completed', notes:'Full compliance check. All cylinders tagged and verified.' },
  { id:'INS-002', company:'Sunrise Gas Ltd',          region:'Arusha',        auditor:'Amina Waweru',  scheduledDate:'2026-05-28', status:'completed', notes:'Minor labelling issues found. Follow-up scheduled.' },
  { id:'INS-003', company:'ABC Gas Distributors',     region:'Dar es Salaam', auditor:'Peter Oloo',    scheduledDate:'2026-06-25', status:'scheduled', notes:'Routine annual inspection.' },
  { id:'INS-004', company:'Total Energies',           region:'Mwanza',        auditor:'Grace Makundi', scheduledDate:'2026-07-05', status:'scheduled', notes:'New facility inspection — first visit.' },
  { id:'INS-005', company:'Lake Victoria Gas Supply', region:'Mwanza',        auditor:'David Kimaro',  scheduledDate:'2026-04-15', status:'overdue',   notes:'Inspection not completed — auditor unavailable.' },
  { id:'INS-006', company:'CityGas Direct',           region:'Dodoma',        auditor:'Salma Hamisi',  scheduledDate:'2026-05-01', status:'overdue',   notes:'No response from operator. Second notice sent.' },
];

const DEMO_NETWORK = [
  // Distributors (12)
  { id:'NET-001', name:'ABC Gas Distributors',          type:'Distributor', region:'Dar es Salaam', city:'Dar es Salaam', address:'Kariakoo Market Area',        lat:-6.8160, lng:39.2803, contact:'+255 22 218 0001', contactPerson:'James Mwangi',      status:'active',   cylinders:145, full:87,  empty:58  },
  { id:'NET-002', name:'Sunrise Gas Ltd',               type:'Distributor', region:'Arusha',        city:'Arusha',        address:'Sokoni Road, Arusha',          lat:-3.3869, lng:36.6830, contact:'+255 27 250 0002', contactPerson:'Amina Njoroge',      status:'active',   cylinders:98,  full:61,  empty:37  },
  { id:'NET-003', name:'Lake Victoria Gas Supply',      type:'Distributor', region:'Mwanza',        city:'Mwanza',        address:'Pamba Road, Mwanza',           lat:-2.5164, lng:32.9175, contact:'+255 28 250 0003', contactPerson:'Peter Odhiambo',     status:'active',   cylinders:112, full:70,  empty:42  },
  { id:'NET-004', name:'Capital Gas Supplies',          type:'Distributor', region:'Dodoma',        city:'Dodoma',        address:'Makole Area, Dodoma',          lat:-6.1730, lng:35.7395, contact:'+255 26 232 0004', contactPerson:'Grace Makundi',      status:'active',   cylinders:67,  full:39,  empty:28  },
  { id:'NET-005', name:'Kilimanjaro Gas Distributors',  type:'Distributor', region:'Kilimanjaro',   city:'Moshi',         address:'Rindi Lane, Moshi',            lat:-3.3537, lng:37.3398, contact:'+255 27 275 0005', contactPerson:'David Kimaro',       status:'active',   cylinders:89,  full:52,  empty:37  },
  { id:'NET-006', name:'Island Gas Zanzibar',           type:'Distributor', region:'Zanzibar',      city:'Zanzibar',      address:'Darajani, Zanzibar City',      lat:-6.1630, lng:39.1990, contact:'+255 24 223 0006', contactPerson:'Fatuma Said',        status:'inactive', cylinders:43,  full:20,  empty:23  },
  { id:'NET-007', name:'Southern Highlands Gas',        type:'Distributor', region:'Mbeya',         city:'Mbeya',         address:'Sisimba Road, Mbeya',          lat:-8.9094, lng:33.4607, contact:'+255 25 250 0007', contactPerson:'Robert Mlowoka',     status:'active',   cylinders:76,  full:45,  empty:31  },
  { id:'NET-008', name:'Coastal Gas Ltd',               type:'Distributor', region:'Tanga',         city:'Tanga',         address:'Usagara Area, Tanga',          lat:-5.0710, lng:39.0951, contact:'+255 27 264 0008', contactPerson:'Salma Hamisi',       status:'active',   cylinders:54,  full:33,  empty:21  },
  { id:'NET-009', name:'Tabora Gas Distributors',       type:'Distributor', region:'Tabora',        city:'Tabora',        address:'Market Street, Tabora',        lat:-5.0167, lng:32.8000, contact:'+255 26 260 0009', contactPerson:'Charles Nyundo',     status:'active',   cylinders:41,  full:24,  empty:17  },
  { id:'NET-010', name:'Lindi Gas Supply Co.',          type:'Distributor', region:'Lindi',         city:'Lindi',         address:'Mvua Road, Lindi',             lat:-9.9965, lng:39.7142, contact:'+255 23 220 0010', contactPerson:'Mary Chilumba',      status:'inactive', cylinders:28,  full:12,  empty:16  },
  { id:'NET-023', name:'Morogoro Gas Depot',            type:'Distributor', region:'Morogoro',      city:'Morogoro',      address:'Kingo Road, Morogoro',         lat:-6.8240, lng:37.6580, contact:'+255 23 261 0023', contactPerson:'Hassan Mgeni',       status:'active',   cylinders:62,  full:38,  empty:24  },
  { id:'NET-024', name:'Shinyanga Gas Centre',          type:'Distributor', region:'Shinyanga',     city:'Shinyanga',     address:'Kambarage Road, Shinyanga',    lat:-3.6604, lng:33.4231, contact:'+255 28 276 0024', contactPerson:'Veronica Shija',     status:'active',   cylinders:48,  full:29,  empty:19  },
  // Retailers (18)
  { id:'NET-011', name:'QuickGas Retail DSM North',     type:'Retailer',    region:'Dar es Salaam', city:'Dar es Salaam', address:'Msimbazi Street, Kinondoni',   lat:-6.7900, lng:39.2100, contact:'+255 22 211 0011', contactPerson:'Ali Juma',           status:'active',   cylinders:32,  full:20,  empty:12  },
  { id:'NET-012', name:'CityGas Direct Temeke',         type:'Retailer',    region:'Dar es Salaam', city:'Dar es Salaam', address:'Temeke District',              lat:-6.8600, lng:39.2500, contact:'+255 22 215 0012', contactPerson:'Neema Kileo',        status:'active',   cylinders:28,  full:16,  empty:12  },
  { id:'NET-013', name:'Kariakoo Gas Shop',             type:'Retailer',    region:'Dar es Salaam', city:'Dar es Salaam', address:'Kariakoo, Ilala',              lat:-6.8235, lng:39.2695, contact:'+255 22 218 0013', contactPerson:'Ibrahim Rashid',     status:'active',   cylinders:45,  full:27,  empty:18  },
  { id:'NET-014', name:'Mbagala Gas Point',             type:'Retailer',    region:'Dar es Salaam', city:'Dar es Salaam', address:'Mbagala Road, Temeke',         lat:-6.9010, lng:39.2850, contact:'+255 22 216 0014', contactPerson:'Lucy Msigwa',        status:'active',   cylinders:22,  full:13,  empty:9   },
  { id:'NET-015', name:'Northern Gas Retail Arusha',    type:'Retailer',    region:'Arusha',        city:'Arusha',        address:'Ngarenaro, Arusha',            lat:-3.3700, lng:36.6950, contact:'+255 27 254 0015', contactPerson:'John Lema',          status:'active',   cylinders:19,  full:11,  empty:8   },
  { id:'NET-016', name:'Moshi Gas Outlet',              type:'Retailer',    region:'Kilimanjaro',   city:'Moshi',         address:'Kibo Road, Moshi',             lat:-3.3450, lng:37.3410, contact:'+255 27 275 0016', contactPerson:'Agnes Moshi',        status:'active',   cylinders:17,  full:10,  empty:7   },
  { id:'NET-017', name:'Morogoro Gas Centre',           type:'Retailer',    region:'Morogoro',      city:'Morogoro',      address:'Boma Road, Morogoro',          lat:-6.8160, lng:37.6762, contact:'+255 23 261 0017', contactPerson:'Omari Saleh',        status:'active',   cylinders:16,  full:9,   empty:7   },
  { id:'NET-018', name:'Iringa Gas Retail',             type:'Retailer',    region:'Iringa',        city:'Iringa',        address:'Uhuru Avenue, Iringa',         lat:-7.7700, lng:35.6900, contact:'+255 26 270 0018', contactPerson:'Joyce Mtitu',        status:'active',   cylinders:21,  full:13,  empty:8   },
  { id:'NET-019', name:'Zanzibar Stone Town Gas',       type:'Retailer',    region:'Zanzibar',      city:'Zanzibar',      address:'Stone Town, Unguja',           lat:-6.1659, lng:39.1989, contact:'+255 24 223 0019', contactPerson:'Khadija Vuai',       status:'active',   cylinders:14,  full:8,   empty:6   },
  { id:'NET-020', name:'Mwanza Lakeside Gas',           type:'Retailer',    region:'Mwanza',        city:'Mwanza',        address:'Capri Point, Mwanza',          lat:-2.5000, lng:32.9000, contact:'+255 28 252 0020', contactPerson:'Samuel Mwita',       status:'active',   cylinders:26,  full:16,  empty:10  },
  { id:'NET-021', name:'Dodoma Central Gas Shop',       type:'Retailer',    region:'Dodoma',        city:'Dodoma',        address:'Jamatini Area, Dodoma',        lat:-6.1800, lng:35.7400, contact:'+255 26 232 0021', contactPerson:'Florence Mwenda',    status:'active',   cylinders:18,  full:11,  empty:7   },
  { id:'NET-022', name:'Mbeya Highland Gas Retail',     type:'Retailer',    region:'Mbeya',         city:'Mbeya',         address:'Forest Hill Area, Mbeya',      lat:-8.9150, lng:33.4550, contact:'+255 25 250 0022', contactPerson:'Patrick Mwale',      status:'active',   cylinders:23,  full:14,  empty:9   },
  { id:'NET-025', name:'Tabora Market Gas Shop',        type:'Retailer',    region:'Tabora',        city:'Tabora',        address:'Ipuli Road, Tabora',           lat:-5.0200, lng:32.8100, contact:'+255 26 260 0025', contactPerson:'Sophia Nkulu',       status:'active',   cylinders:12,  full:7,   empty:5   },
  { id:'NET-026', name:'Tanga Shoreline Gas',           type:'Retailer',    region:'Tanga',         city:'Tanga',         address:'Ocean Road, Tanga',            lat:-5.0640, lng:39.1010, contact:'+255 27 264 0026', contactPerson:'Emmanuel Msuya',     status:'active',   cylinders:15,  full:9,   empty:6   },
  { id:'NET-027', name:'Dar North Gas Kijitonyama',     type:'Retailer',    region:'Dar es Salaam', city:'Dar es Salaam', address:'Kijitonyama, Kinondoni',       lat:-6.7680, lng:39.2430, contact:'+255 22 277 0027', contactPerson:'Rehema Kondo',       status:'active',   cylinders:20,  full:12,  empty:8   },
  { id:'NET-028', name:'Mwanza Rock City Gas',          type:'Retailer',    region:'Mwanza',        city:'Mwanza',        address:'Nyamagana, Mwanza',            lat:-2.5150, lng:32.9080, contact:'+255 28 250 0028', contactPerson:'Bernard Nyerere',    status:'active',   cylinders:11,  full:6,   empty:5   },
  { id:'NET-029', name:'Arusha Clock Tower Gas',        type:'Retailer',    region:'Arusha',        city:'Arusha',        address:'Clock Tower Area, Arusha',     lat:-3.3660, lng:36.6870, contact:'+255 27 250 0029', contactPerson:'Winnie Kimani',      status:'active',   cylinders:16,  full:10,  empty:6   },
  { id:'NET-030', name:'Shinyanga Gas Retail',          type:'Retailer',    region:'Shinyanga',     city:'Shinyanga',     address:'Kahama Road, Shinyanga',       lat:-3.6650, lng:33.4280, contact:'+255 28 276 0030', contactPerson:'Terence Bundala',    status:'active',   cylinders:9,   full:5,   empty:4   },
];

const DEMO_BULK_TANKERS = [
  { id:'BT-001', plate:'T 121 DAR', operator:'Vivo LPG',       capacity:'30,000L', status:'in-transit',  from:'Dar es Salaam Import Terminal', to:'Vivo LPG Refilling Plant',       lat:-6.5200, lng:39.0800, speed:62, lastUpdate:'3 min ago',  routePct:42,  fromLat:-6.7924, fromLng:39.2083, toLat:-6.5000, toLng:39.1200 },
  { id:'BT-002', plate:'T 344 DAR', operator:'Total Energies', capacity:'22,000L', status:'in-transit',  from:'Dar es Salaam Import Terminal', to:'Total Energies Facility',         lat:-6.2000, lng:38.8000, speed:55, lastUpdate:'7 min ago',  routePct:28,  fromLat:-6.7924, fromLng:39.2083, toLat:-6.4500, toLng:38.7000 },
  { id:'BT-003', plate:'T 098 ARU', operator:'Shell Gas',      capacity:'18,000L', status:'at-terminal', from:'Dar es Salaam Import Terminal', to:'Shell Gas Arusha Plant',          lat:-6.7924, lng:39.2083, speed:0,  lastUpdate:'12 min ago', routePct:0,   fromLat:-6.7924, fromLng:39.2083, toLat:-3.3869, toLng:36.6830 },
  { id:'BT-004', plate:'T 217 MWZ', operator:'Lake Gas',       capacity:'25,000L', status:'delivered',   from:'Dar es Salaam Import Terminal', to:'Lake Gas Mwanza Facility',        lat:-2.5164, lng:32.9175, speed:0,  lastUpdate:'1 hr ago',   routePct:100, fromLat:-6.7924, fromLng:39.2083, toLat:-2.5164, toLng:32.9175 },
  { id:'BT-005', plate:'T 502 DAR', operator:'Vivo LPG',       capacity:'30,000L', status:'loading',     from:'Dar es Salaam Import Terminal', to:'Vivo LPG Refilling Plant',       lat:-6.8200, lng:39.2900, speed:0,  lastUpdate:'25 min ago', routePct:0,   fromLat:-6.7924, fromLng:39.2083, toLat:-6.5000, toLng:39.1200 },
  { id:'BT-006', plate:'T 188 MBY', operator:'Total Energies', capacity:'20,000L', status:'in-transit',  from:'Dar es Salaam Import Terminal', to:'Total Energies Mbeya Plant',      lat:-7.5000, lng:36.2000, speed:70, lastUpdate:'5 min ago',  routePct:65,  fromLat:-6.7924, fromLng:39.2083, toLat:-8.9094, toLng:33.4607 },
  { id:'BT-007', plate:'T 310 ARU', operator:'Shell Gas',      capacity:'18,000L', status:'delivered',   from:'Arusha Distribution Hub',      to:'Shell Gas Kilimanjaro Depot',     lat:-3.3534, lng:37.3380, speed:0,  lastUpdate:'2 hr ago',   routePct:100, fromLat:-3.3869, fromLng:36.6830, toLat:-3.3534, toLng:37.3380 },
  { id:'BT-008', plate:'T 440 DOD', operator:'Lake Gas',       capacity:'22,000L', status:'in-transit',  from:'Dodoma Central Depot',         to:'Lake Gas Tabora Plant',           lat:-5.0220, lng:33.9980, speed:58, lastUpdate:'9 min ago',  routePct:51,  fromLat:-6.1730, fromLng:35.7395, toLat:-5.0167, toLng:32.8000 },
  { id:'BT-009', plate:'T 071 TNG', operator:'Vivo LPG',       capacity:'25,000L', status:'at-terminal', from:'Tanga Port Terminal',          to:'Vivo LPG Tanga Plant',            lat:-5.0693, lng:39.0997, speed:0,  lastUpdate:'18 min ago', routePct:0,   fromLat:-5.0693, fromLng:39.0997, toLat:-5.0600, toLng:39.0700 },
  { id:'BT-010', plate:'T 625 IRG', operator:'Total Energies', capacity:'20,000L', status:'in-transit',  from:'Dar es Salaam Import Terminal', to:'Total Energies Iringa Depot',     lat:-7.7669, lng:35.6940, speed:66, lastUpdate:'11 min ago', routePct:78,  fromLat:-6.7924, fromLng:39.2083, toLat:-7.7669, toLng:35.6940 },
  { id:'BT-011', plate:'T 282 MOR', operator:'Shell Gas',      capacity:'18,000L', status:'loading',     from:'Morogoro Depot',               to:'Shell Gas Dodoma Plant',          lat:-6.8218, lng:37.6595, speed:0,  lastUpdate:'30 min ago', routePct:0,   fromLat:-6.8218, fromLng:37.6595, toLat:-6.1730, toLng:35.7395 },
  { id:'BT-012', plate:'T 193 ZNZ', operator:'Lake Gas',       capacity:'15,000L', status:'delivered',   from:'Zanzibar Port',                to:'Lake Gas Zanzibar Retail Hub',    lat:-6.1659, lng:39.2026, speed:0,  lastUpdate:'45 min ago', routePct:100, fromLat:-6.1500, fromLng:39.3200, toLat:-6.1659, toLng:39.2026 },
];

const EVENT_LABELS = {
  'registered':          'Cylinder Created & Registered',
  'refilled':            'Refilled at Plant',
  'shipped':             'Shipped (Full) to Distributor/Retailer',
  'received-empty':      'Empty Cylinder Received at Refill Site',
  'sent-revalidation':   'Sent for Revalidation',
  'reval-received':      'Received at Revalidation Centre',
  'revalidated':         'Revalidated & Approved',
  'reval-returned':      'Returned to Refill Site after Revalidation',
  'dist-received':       'Received (Full) by Distributor',
  'dist-sent-retail':    'Sent from Distributor to Retailer',
  'dist-returned-empty': 'Empty Cylinder Returned by Distributor',
  'ret-received':        'Received (Full) by Retailer',
  'ret-sold':            'Sold to Consumer',
  'ret-returned-empty':  'Empty Cylinder Returned by Consumer',
  'inspected':           'Inspected by Field Auditor',
  'ewura-monitored':     'Supply Monitored by EWURA',
  'tra-verified':        'Refills Verified by TRA',
  'tra-registered':      'Shipment Registered by TRA',
};

const EV_TYPE_I18N = {
  'registered': 'ev.registered', 'refilled': 'ev.refilled', 'shipped': 'ev.shipped',
  'received-empty': 'ev.receivedEmpty', 'sent-revalidation': 'ev.sentRevalidation',
  'reval-received': 'ev.revalReceived', 'revalidated': 'ev.revalidated',
  'reval-returned': 'ev.revalReturned', 'dist-received': 'ev.distReceived',
  'dist-sent-retail': 'ev.distSentRetail', 'dist-returned-empty': 'ev.distReturnedEmpty',
  'ret-received': 'ev.retReceived', 'ret-sold': 'ev.retSold',
  'ret-returned-empty': 'ev.retReturnedEmpty', 'inspected': 'ev.inspected',
  'ewura-monitored': 'ev.ewuraMonitored', 'tra-verified': 'ev.traVerified',
  'tra-registered': 'ev.traRegistered',
};
function tEvent(type) {
  const key = EV_TYPE_I18N[type];
  return key ? t(key) : (EVENT_LABELS[type] || type);
}

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
  ewura:           ['reports', 'cylinders', 'alerts', 'inspections', 'recalls', 'licenses', 'mgmt-reports', 'network', 'bulk-monitor'],
  'field-auditor': ['reports', 'scan', 'cylinders'],
  tra:             ['reports', 'scan', 'cylinders'],
  distributor:     ['reports', 'cylinders', 'alerts', 'mgmt-reports'],
  retailer:        ['reports', 'cylinders', 'mgmt-reports'],
};

const ROLE_LABELS = {
  lpgmc:           'LPGMC',
  revalidator:     'Revalidator',
  ewura:           'Regulator',
  'field-auditor': 'Field Auditor',
  tra:             'TRA',
  distributor:     'Distributor',
  retailer:        'Retailer',
};

const LPGMC_COMPANIES = ['Vivo LPG', 'Total Energies', 'Shell Gas', 'Lake Gas'];

const DEMO_LPGMC_INFO = {
  'Vivo LPG':       { region:'Dar es Salaam', city:'Dar es Salaam', address:'Ubungo Industrial Area, Dar es Salaam', contact:'+255 22 286 0101', contactPerson:'George Mtambo',   lat:-6.7924, lng:39.2083 },
  'Total Energies': { region:'Dar es Salaam', city:'Dar es Salaam', address:'Mikocheni Light Industrial Area',       contact:'+255 22 277 0202', contactPerson:'Sophie Munisi',    lat:-6.7700, lng:39.2400 },
  'Shell Gas':      { region:'Dar es Salaam', city:'Dar es Salaam', address:'Chang\'ombe Industrial Area',            contact:'+255 22 285 0303', contactPerson:'Richard Kijazi',   lat:-6.8370, lng:39.2560 },
  'Lake Gas':       { region:'Mwanza',        city:'Mwanza',        address:'Isamilo Road, Mwanza',                  contact:'+255 28 254 0404', contactPerson:'Catherine Masebo', lat:-2.5200, lng:32.9100 },
};

const DEMO_LICENSE_EXTRA_INFO = {
  'ABC Distributors': { region:'Dar es Salaam', city:'Dar es Salaam', address:'Pugu Road Industrial Area, Ilala',    contact:'+255 22 218 0441', contactPerson:'Henry Msomi'    },
  'QuickGas Retail':  { region:'Dar es Salaam', city:'Dar es Salaam', address:'Changanyikeni, Kinondoni District',  contact:'+255 22 211 0552', contactPerson:'Rose Kimaro'     },
  'ProRevalid Ltd':   { region:'Dar es Salaam', city:'Dar es Salaam', address:'Nyerere Road Industrial Zone',       contact:'+255 22 286 0663', contactPerson:'Daniel Odero'    },
  'CityGas Direct':   { region:'Dar es Salaam', city:'Dar es Salaam', address:'Msongola, Ilala District',          contact:'+255 22 213 0774', contactPerson:'Stella Mwamba'   },
};

// ── Kenya dataset ─────────────────────────────────────────────────────────────

const LPGMC_COMPANIES_KE = ['Total Energies Kenya', 'Vivo Energy Kenya', 'Africa Gas & Oil', 'Hashi Energy'];

const DEMO_CYLINDERS_KE = [
  // Total Energies Kenya — 15 entries
  { id:'E280116060000204C3F04F81', serial:'TEK-2014-001', company:'Total Energies Kenya', manufactureDate:'2014-03-15', tareWeight:8.0,  capacity:6,  fillCount:510, lastHydroTest:'2019-03-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04F82', serial:'TEK-2015-002', company:'Total Energies Kenya', manufactureDate:'2015-07-20', tareWeight:8.0,  capacity:6,  fillCount:430, lastHydroTest:'2020-07-20', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04F83', serial:'TEK-2016-003', company:'Total Energies Kenya', manufactureDate:'2016-02-10', tareWeight:8.0,  capacity:6,  fillCount:372, lastHydroTest:'2021-02-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04F84', serial:'TEK-2017-004', company:'Total Energies Kenya', manufactureDate:'2017-05-22', tareWeight:14.5, capacity:12, fillCount:298, lastHydroTest:'2022-05-22', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04F85', serial:'TEK-2018-005', company:'Total Energies Kenya', manufactureDate:'2018-09-08', tareWeight:14.5, capacity:12, fillCount:225, lastHydroTest:'2023-09-08', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04F86', serial:'TEK-2019-006', company:'Total Energies Kenya', manufactureDate:'2019-01-15', tareWeight:14.5, capacity:12, fillCount:168, lastHydroTest:'2024-01-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04F87', serial:'TEK-2020-007', company:'Total Energies Kenya', manufactureDate:'2020-06-30', tareWeight:14.5, capacity:12, fillCount:112, lastHydroTest:'2025-06-30', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04F88', serial:'TEK-2021-008', company:'Total Energies Kenya', manufactureDate:'2021-02-18', tareWeight:14.5, capacity:12, fillCount:78,  lastHydroTest:'2026-02-18', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04F89', serial:'TEK-2021-009', company:'Total Energies Kenya', manufactureDate:'2021-11-05', tareWeight:14.5, capacity:12, fillCount:59,  lastHydroTest:'2026-11-05', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04F8A', serial:'TEK-2022-010', company:'Total Energies Kenya', manufactureDate:'2022-04-20', tareWeight:14.5, capacity:12, fillCount:42,  lastHydroTest:'2027-04-20', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04F8B', serial:'TEK-2023-011', company:'Total Energies Kenya', manufactureDate:'2023-08-12', tareWeight:14.5, capacity:12, fillCount:21,  lastHydroTest:'2028-08-12', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04F8C', serial:'TEK-2024-012', company:'Total Energies Kenya', manufactureDate:'2024-02-28', tareWeight:14.5, capacity:12, fillCount:7,   lastHydroTest:'2029-02-28', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04F8D', serial:'TEK-2013-013', company:'Total Energies Kenya', manufactureDate:'2013-06-15', tareWeight:28.5, capacity:38, fillCount:575, lastHydroTest:'2018-06-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04F8E', serial:'TEK-2012-014', company:'Total Energies Kenya', manufactureDate:'2012-10-25', tareWeight:28.5, capacity:38, fillCount:618, lastHydroTest:'2017-10-25', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04F8F', serial:'TEK-2025-015', company:'Total Energies Kenya', manufactureDate:'2025-03-01', tareWeight:14.5, capacity:12, fillCount:3,   lastHydroTest:'2030-03-01', status:'in-refill',      notes:'' },
  // Vivo Energy Kenya — 15 entries
  { id:'E280116060000204C3F04FA1', serial:'VEK-2013-001', company:'Vivo Energy Kenya', manufactureDate:'2013-04-10', tareWeight:8.0,  capacity:6,  fillCount:528, lastHydroTest:'2018-04-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FA2', serial:'VEK-2015-002', company:'Vivo Energy Kenya', manufactureDate:'2015-05-22', tareWeight:8.0,  capacity:6,  fillCount:468, lastHydroTest:'2020-05-22', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FA3', serial:'VEK-2016-003', company:'Vivo Energy Kenya', manufactureDate:'2016-11-15', tareWeight:8.0,  capacity:6,  fillCount:385, lastHydroTest:'2021-11-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FA4', serial:'VEK-2017-004', company:'Vivo Energy Kenya', manufactureDate:'2017-07-08', tareWeight:14.5, capacity:12, fillCount:312, lastHydroTest:'2022-07-08', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FA5', serial:'VEK-2018-005', company:'Vivo Energy Kenya', manufactureDate:'2018-03-20', tareWeight:14.5, capacity:12, fillCount:238, lastHydroTest:'2023-03-20', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FA6', serial:'VEK-2019-006', company:'Vivo Energy Kenya', manufactureDate:'2019-10-14', tareWeight:14.5, capacity:12, fillCount:177, lastHydroTest:'2024-10-14', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FA7', serial:'VEK-2020-007', company:'Vivo Energy Kenya', manufactureDate:'2020-08-05', tareWeight:14.5, capacity:12, fillCount:119, lastHydroTest:'2025-08-05', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FA8', serial:'VEK-2021-008', company:'Vivo Energy Kenya', manufactureDate:'2021-01-25', tareWeight:14.5, capacity:12, fillCount:83,  lastHydroTest:'2026-01-25', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FA9', serial:'VEK-2022-009', company:'Vivo Energy Kenya', manufactureDate:'2022-05-10', tareWeight:14.5, capacity:12, fillCount:52,  lastHydroTest:'2027-05-10', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FAA', serial:'VEK-2022-010', company:'Vivo Energy Kenya', manufactureDate:'2022-11-18', tareWeight:14.5, capacity:12, fillCount:38,  lastHydroTest:'2027-11-18', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FAB', serial:'VEK-2023-011', company:'Vivo Energy Kenya', manufactureDate:'2023-06-02', tareWeight:14.5, capacity:12, fillCount:19,  lastHydroTest:'2028-06-02', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04FAC', serial:'VEK-2024-012', company:'Vivo Energy Kenya', manufactureDate:'2024-01-16', tareWeight:14.5, capacity:12, fillCount:8,   lastHydroTest:'2029-01-16', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FAD', serial:'VEK-2012-013', company:'Vivo Energy Kenya', manufactureDate:'2012-07-20', tareWeight:28.5, capacity:38, fillCount:645, lastHydroTest:'2017-07-20', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FAE', serial:'VEK-2014-014', company:'Vivo Energy Kenya', manufactureDate:'2014-09-12', tareWeight:28.5, capacity:38, fillCount:492, lastHydroTest:'2019-09-12', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FAF', serial:'VEK-2025-015', company:'Vivo Energy Kenya', manufactureDate:'2025-01-08', tareWeight:14.5, capacity:12, fillCount:2,   lastHydroTest:'2030-01-08', status:'in-refill',      notes:'' },
  // Africa Gas & Oil (AGOL) — 15 entries
  { id:'E280116060000204C3F04FB1', serial:'AGL-2014-001', company:'Africa Gas & Oil', manufactureDate:'2014-05-18', tareWeight:8.0,  capacity:6,  fillCount:495, lastHydroTest:'2019-05-18', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FB2', serial:'AGL-2015-002', company:'Africa Gas & Oil', manufactureDate:'2015-09-30', tareWeight:8.0,  capacity:6,  fillCount:420, lastHydroTest:'2020-09-30', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FB3', serial:'AGL-2016-003', company:'Africa Gas & Oil', manufactureDate:'2016-04-12', tareWeight:14.5, capacity:12, fillCount:362, lastHydroTest:'2021-04-12', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FB4', serial:'AGL-2017-004', company:'Africa Gas & Oil', manufactureDate:'2017-10-08', tareWeight:14.5, capacity:12, fillCount:288, lastHydroTest:'2022-10-08', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FB5', serial:'AGL-2018-005', company:'Africa Gas & Oil', manufactureDate:'2018-06-25', tareWeight:14.5, capacity:12, fillCount:215, lastHydroTest:'2023-06-25', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FB6', serial:'AGL-2019-006', company:'Africa Gas & Oil', manufactureDate:'2019-02-14', tareWeight:14.5, capacity:12, fillCount:158, lastHydroTest:'2024-02-14', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FB7', serial:'AGL-2020-007', company:'Africa Gas & Oil', manufactureDate:'2020-09-20', tareWeight:14.5, capacity:12, fillCount:104, lastHydroTest:'2025-09-20', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FB8', serial:'AGL-2021-008', company:'Africa Gas & Oil', manufactureDate:'2021-04-05', tareWeight:14.5, capacity:12, fillCount:71,  lastHydroTest:'2026-04-05', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FB9', serial:'AGL-2022-009', company:'Africa Gas & Oil', manufactureDate:'2022-01-22', tareWeight:14.5, capacity:12, fillCount:46,  lastHydroTest:'2027-01-22', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FBA', serial:'AGL-2022-010', company:'Africa Gas & Oil', manufactureDate:'2022-08-14', tareWeight:14.5, capacity:12, fillCount:33,  lastHydroTest:'2027-08-14', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FBB', serial:'AGL-2023-011', company:'Africa Gas & Oil', manufactureDate:'2023-04-18', tareWeight:14.5, capacity:12, fillCount:17,  lastHydroTest:'2028-04-18', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FBC', serial:'AGL-2024-012', company:'Africa Gas & Oil', manufactureDate:'2024-03-10', tareWeight:14.5, capacity:12, fillCount:6,   lastHydroTest:'2029-03-10', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FBD', serial:'AGL-2013-013', company:'Africa Gas & Oil', manufactureDate:'2013-08-22', tareWeight:28.5, capacity:38, fillCount:555, lastHydroTest:'2018-08-22', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FBE', serial:'AGL-2012-014', company:'Africa Gas & Oil', manufactureDate:'2012-12-05', tareWeight:28.5, capacity:38, fillCount:602, lastHydroTest:'2017-12-05', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FBF', serial:'AGL-2025-015', company:'Africa Gas & Oil', manufactureDate:'2025-02-20', tareWeight:14.5, capacity:12, fillCount:4,   lastHydroTest:'2030-02-20', status:'in-refill',      notes:'' },
  // Hashi Energy — 12 entries
  { id:'E280116060000204C3F04FC1', serial:'HSH-2015-001', company:'Hashi Energy', manufactureDate:'2015-03-28', tareWeight:8.0,  capacity:6,  fillCount:440, lastHydroTest:'2020-03-28', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FC2', serial:'HSH-2016-002', company:'Hashi Energy', manufactureDate:'2016-08-15', tareWeight:14.5, capacity:12, fillCount:345, lastHydroTest:'2021-08-15', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FC3', serial:'HSH-2018-003', company:'Hashi Energy', manufactureDate:'2018-05-20', tareWeight:14.5, capacity:12, fillCount:245, lastHydroTest:'2023-05-20', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FC4', serial:'HSH-2019-004', company:'Hashi Energy', manufactureDate:'2019-02-14', tareWeight:14.5, capacity:12, fillCount:188, lastHydroTest:'2024-02-14', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FC5', serial:'HSH-2020-005', company:'Hashi Energy', manufactureDate:'2020-07-08', tareWeight:14.5, capacity:12, fillCount:125, lastHydroTest:'2025-07-08', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FC6', serial:'HSH-2021-006', company:'Hashi Energy', manufactureDate:'2021-10-22', tareWeight:14.5, capacity:12, fillCount:81,  lastHydroTest:'2026-10-22', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04FC7', serial:'HSH-2022-007', company:'Hashi Energy', manufactureDate:'2022-04-05', tareWeight:14.5, capacity:12, fillCount:50,  lastHydroTest:'2027-04-05', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FC8', serial:'HSH-2023-008', company:'Hashi Energy', manufactureDate:'2023-09-12', tareWeight:14.5, capacity:12, fillCount:24,  lastHydroTest:'2028-09-12', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FC9', serial:'HSH-2024-009', company:'Hashi Energy', manufactureDate:'2024-05-18', tareWeight:14.5, capacity:12, fillCount:8,   lastHydroTest:'2029-05-18', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04FCA', serial:'HSH-2013-010', company:'Hashi Energy', manufactureDate:'2013-01-30', tareWeight:28.5, capacity:38, fillCount:562, lastHydroTest:'2018-01-30', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04FCB', serial:'HSH-2014-011', company:'Hashi Energy', manufactureDate:'2014-11-10', tareWeight:28.5, capacity:38, fillCount:418, lastHydroTest:'2019-11-10', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04FCC', serial:'HSH-2025-012', company:'Hashi Energy', manufactureDate:'2025-05-05', tareWeight:14.5, capacity:12, fillCount:1,   lastHydroTest:'2030-05-05', status:'in-refill',      notes:'' },
];

const DEMO_LICENSES_KE = [
  { id:'LIC-KE-001', companyName:'Total Energies Kenya', companyType:'LPGMC',       licenseNumber:'EPRA/LPGMC/001/2020', issuedDate:'2020-02-10', expiryDate:'2027-02-09', status:'active',
    history:[{type:'granted', date:'2020-02-10', by:'EPRA', note:'Initial license granted'}] },
  { id:'LIC-KE-002', companyName:'Vivo Energy Kenya',    companyType:'LPGMC',       licenseNumber:'EPRA/LPGMC/002/2019', issuedDate:'2019-07-15', expiryDate:'2026-07-14', status:'active',
    history:[{type:'granted', date:'2019-07-15', by:'EPRA', note:'Initial license granted'},{type:'renewed', date:'2023-07-15', by:'EPRA', note:'License renewed for 3 years'}] },
  { id:'LIC-KE-003', companyName:'Africa Gas & Oil',     companyType:'LPGMC',       licenseNumber:'EPRA/LPGMC/003/2021', issuedDate:'2021-04-20', expiryDate:'2028-04-19', status:'active',
    history:[{type:'granted', date:'2021-04-20', by:'EPRA', note:'Initial license granted'}] },
  { id:'LIC-KE-004', companyName:'Hashi Energy',         companyType:'LPGMC',       licenseNumber:'EPRA/LPGMC/004/2022', issuedDate:'2022-09-01', expiryDate:'2029-08-31', status:'active',
    history:[{type:'granted', date:'2022-09-01', by:'EPRA', note:'Initial license granted'}] },
  { id:'LIC-KE-005', companyName:'Nairobi Gas Supplies', companyType:'Distributor', licenseNumber:'EPRA/DIST/001/2022',  issuedDate:'2022-05-18', expiryDate:'2025-05-17', status:'expired',
    history:[{type:'granted', date:'2022-05-18', by:'EPRA', note:'Initial license granted'}] },
  { id:'LIC-KE-006', companyName:'Mombasa Gas Direct',   companyType:'Retailer',    licenseNumber:'EPRA/RET/001/2023',   issuedDate:'2023-03-10', expiryDate:'2026-03-09', status:'active',
    history:[{type:'granted', date:'2023-03-10', by:'EPRA', note:'Initial license granted'}] },
  { id:'LIC-KE-007', companyName:'Kenya Reval Services', companyType:'Revalidator', licenseNumber:'EPRA/REVAL/001/2021', issuedDate:'2021-10-05', expiryDate:'2028-10-04', status:'active',
    history:[{type:'granted', date:'2021-10-05', by:'EPRA', note:'Initial license granted'}] },
];

const DEMO_INSPECTIONS_KE = [
  { id:'INS-KE-001', company:'Total Energies Kenya',  region:'Nairobi',  auditor:'James Kariuki',    scheduledDate:'2026-05-12', status:'completed', notes:'Full compliance check. All cylinders tagged and verified.' },
  { id:'INS-KE-002', company:'Vivo Energy Kenya',     region:'Mombasa',  auditor:'Fatuma Mwangi',    scheduledDate:'2026-05-25', status:'completed', notes:'Minor labelling issues found. Follow-up scheduled.' },
  { id:'INS-KE-003', company:'Africa Gas & Oil',      region:'Kisumu',   auditor:'Peter Odhiambo',   scheduledDate:'2026-06-18', status:'scheduled', notes:'Routine annual inspection.' },
  { id:'INS-KE-004', company:'Hashi Energy',          region:'Nakuru',   auditor:'Grace Njoroge',    scheduledDate:'2026-07-10', status:'scheduled', notes:'New facility inspection — first visit.' },
  { id:'INS-KE-005', company:'Nairobi Gas Supplies',  region:'Nairobi',  auditor:'David Kamau',      scheduledDate:'2026-04-20', status:'overdue',   notes:'Inspection not completed — auditor unavailable.' },
  { id:'INS-KE-006', company:'Mombasa Gas Direct',    region:'Mombasa',  auditor:'Salma Hassan',     scheduledDate:'2026-05-05', status:'overdue',   notes:'No response from operator. Second notice sent.' },
];

const DEMO_NETWORK_KE = [
  { id:'KE-NET-001', name:'Nairobi Gas Supplies',      type:'Distributor', region:'Nairobi',      city:'Nairobi',  address:'Industrial Area, Enterprise Road, Nairobi',    lat:-1.3028, lng:36.8588, contact:'+254 20 222 0101', contactPerson:'James Mwangi',     status:'active',   cylinders:152, full:91, empty:61 },
  { id:'KE-NET-002', name:'Mombasa Gas Depot',         type:'Distributor', region:'Mombasa',      city:'Mombasa',  address:'Port Reitz Road, Changamwe, Mombasa',          lat:-4.0435, lng:39.6682, contact:'+254 41 222 0202', contactPerson:'Fatuma Ali',       status:'active',   cylinders:104, full:65, empty:39 },
  { id:'KE-NET-003', name:'Kisumu Gas Supplies',       type:'Distributor', region:'Kisumu',       city:'Kisumu',   address:'Kondele Area, Kisumu',                         lat:-0.0917, lng:34.7680, contact:'+254 57 222 0303', contactPerson:'George Odhiambo',  status:'active',   cylinders:86,  full:54, empty:32 },
  { id:'KE-NET-004', name:'Nakuru Gas Centre',         type:'Distributor', region:'Nakuru',       city:'Nakuru',   address:'Nakuru Industrial Area, Kenyatta Avenue',      lat:-0.3031, lng:36.0800, contact:'+254 51 222 0404', contactPerson:'Mary Njoroge',     status:'active',   cylinders:72,  full:43, empty:29 },
  { id:'KE-NET-005', name:'Eldoret Gas Distributors',  type:'Distributor', region:'Uasin Gishu',  city:'Eldoret',  address:'Huruma Estate, Eldoret',                       lat:0.5143,  lng:35.2698, contact:'+254 53 222 0505', contactPerson:'John Rotich',      status:'active',   cylinders:65,  full:40, empty:25 },
  { id:'KE-NET-006', name:'Mt Kenya Gas Ltd',          type:'Distributor', region:'Nyeri',        city:'Nyeri',    address:'Nyeri Town Centre, Hospital Road',              lat:-0.4167, lng:36.9500, contact:'+254 61 222 0606', contactPerson:'Ann Wanjiku',      status:'inactive', cylinders:38,  full:18, empty:20 },
  { id:'KE-NET-007', name:'Thika Gas Supplies',        type:'Distributor', region:'Kiambu',       city:'Thika',    address:'Thika Industrial Area, Kenyatta Highway',      lat:-1.0332, lng:37.0693, contact:'+254 67 222 0707', contactPerson:'Peter Kamau',      status:'active',   cylinders:58,  full:35, empty:23 },
  { id:'KE-NET-008', name:'Machakos Gas Distributors', type:'Distributor', region:'Machakos',     city:'Machakos', address:'Machakos Town, Mwatu wa Ngoma Road',           lat:-1.5177, lng:37.2634, contact:'+254 44 222 0808', contactPerson:'Ruth Mutua',       status:'active',   cylinders:43,  full:26, empty:17 },
  { id:'KE-NET-009', name:'Meru Gas Centre',           type:'Distributor', region:'Meru',         city:'Meru',     address:'Meru Town, Kenyatta Highway',                  lat:0.0467,  lng:37.6495, contact:'+254 64 222 0909', contactPerson:'Simon Murungi',    status:'active',   cylinders:37,  full:22, empty:15 },
  { id:'KE-NET-010', name:'Garissa Gas Supply Co.',    type:'Distributor', region:'Garissa',      city:'Garissa',  address:'Garissa Town, Jogoo Road',                     lat:-0.4532, lng:39.6461, contact:'+254 46 222 1010', contactPerson:'Hassan Aden',      status:'inactive', cylinders:24,  full:10, empty:14 },
  { id:'KE-NET-011', name:'Malindi Gas Depot',         type:'Distributor', region:'Kilifi',       city:'Malindi',  address:'Malindi Town, Galana Road',                    lat:-3.2175, lng:40.1169, contact:'+254 42 222 1111', contactPerson:'Aisha Mwachiru',   status:'active',   cylinders:31,  full:19, empty:12 },
  { id:'KE-NET-012', name:'Kisii Gas Distributors',    type:'Distributor', region:'Kisii',        city:'Kisii',    address:'Kisii Town, Hospital Road',                    lat:-0.6817, lng:34.7667, contact:'+254 58 222 1212', contactPerson:'Caroline Nyamari', status:'active',   cylinders:29,  full:17, empty:12 },
  { id:'KE-NET-013', name:'Westlands Gas Shop',        type:'Retailer',    region:'Nairobi',      city:'Nairobi',  address:'Westlands Commercial Centre, Waiyaki Way',     lat:-1.2675, lng:36.8100, contact:'+254 20 222 1301', contactPerson:'Wanjiku Kamau',    status:'active',   cylinders:35,  full:22, empty:13 },
  { id:'KE-NET-014', name:'Eastleigh Gas Outlet',      type:'Retailer',    region:'Nairobi',      city:'Nairobi',  address:'2nd Avenue, Eastleigh, Nairobi',               lat:-1.2787, lng:36.8526, contact:'+254 20 222 1401', contactPerson:'Mohamed Abdi',     status:'active',   cylinders:28,  full:17, empty:11 },
  { id:'KE-NET-015', name:'Kibera Gas Point',          type:'Retailer',    region:'Nairobi',      city:'Nairobi',  address:'Olympic Market, Kibera Drive',                 lat:-1.3127, lng:36.7940, contact:'+254 20 222 1501', contactPerson:'Jane Akinyi',      status:'active',   cylinders:22,  full:13, empty:9  },
  { id:'KE-NET-016', name:'Karen Gas Retail',          type:'Retailer',    region:'Nairobi',      city:'Nairobi',  address:'Karen Shopping Centre, Ngong Road',            lat:-1.3467, lng:36.7088, contact:'+254 20 222 1601', contactPerson:'Evelyn Njeri',     status:'active',   cylinders:18,  full:11, empty:7  },
  { id:'KE-NET-017', name:'Mtwapa Gas Shop',           type:'Retailer',    region:'Mombasa',      city:'Mombasa',  address:'Mtwapa Town Centre, Mombasa-Malindi Road',     lat:-3.9574, lng:39.7320, contact:'+254 41 222 1701', contactPerson:'Suleiman Omar',    status:'active',   cylinders:20,  full:12, empty:8  },
  { id:'KE-NET-018', name:'Nyali Gas Direct',          type:'Retailer',    region:'Mombasa',      city:'Mombasa',  address:'Nyali Centre, Links Road',                     lat:-4.0200, lng:39.7200, contact:'+254 41 222 1801', contactPerson:'Amina Hassan',     status:'active',   cylinders:16,  full:9,  empty:7  },
  { id:'KE-NET-019', name:'Kisumu Milimani Gas',       type:'Retailer',    region:'Kisumu',       city:'Kisumu',   address:'Milimani Estate, Kisumu',                      lat:-0.0800, lng:34.7600, contact:'+254 57 222 1901', contactPerson:'Grace Otieno',     status:'active',   cylinders:19,  full:11, empty:8  },
  { id:'KE-NET-020', name:'Nakuru Central Gas Shop',   type:'Retailer',    region:'Nakuru',       city:'Nakuru',   address:'Nakuru Central Market, Geoffrey Kamau Way',    lat:-0.2833, lng:36.0667, contact:'+254 51 222 2001', contactPerson:'Simon Kimani',     status:'active',   cylinders:15,  full:9,  empty:6  },
  { id:'KE-NET-021', name:'Eldoret Pioneer Gas',       type:'Retailer',    region:'Uasin Gishu',  city:'Eldoret',  address:'Pioneer Estate, Uganda Road, Eldoret',         lat:0.5200,  lng:35.2750, contact:'+254 53 222 2101', contactPerson:'Chebet Korir',     status:'active',   cylinders:14,  full:8,  empty:6  },
  { id:'KE-NET-022', name:'Nyeri Gas Corner',          type:'Retailer',    region:'Nyeri',        city:'Nyeri',    address:'Nyeri Town, Kimathi Way',                      lat:-0.4200, lng:36.9500, contact:'+254 61 222 2201', contactPerson:'Lucy Wanjiku',     status:'active',   cylinders:13,  full:8,  empty:5  },
  { id:'KE-NET-023', name:'Thika Gas Retail',          type:'Retailer',    region:'Kiambu',       city:'Thika',    address:'Thika Town Centre, Kenyatta Highway',           lat:-1.0400, lng:37.0800, contact:'+254 67 222 2301', contactPerson:'Daniel Mwangi',    status:'active',   cylinders:17,  full:10, empty:7  },
  { id:'KE-NET-024', name:'Machakos Gas Shop',         type:'Retailer',    region:'Machakos',     city:'Machakos', address:'Machakos Central, Muindi Mbingu Street',       lat:-1.5100, lng:37.2700, contact:'+254 44 222 2401', contactPerson:'Mary Mwende',      status:'active',   cylinders:12,  full:7,  empty:5  },
  { id:'KE-NET-025', name:'Meru Tigania Gas',          type:'Retailer',    region:'Meru',         city:'Meru',     address:'Meru Town, Makandara Road',                    lat:0.0500,  lng:37.6500, contact:'+254 64 222 2501', contactPerson:'Agnes Muriithi',   status:'active',   cylinders:11,  full:6,  empty:5  },
  { id:'KE-NET-026', name:'Kisii Central Gas',         type:'Retailer',    region:'Kisii',        city:'Kisii',    address:'Kisii Central Market, Robert Ouko Road',       lat:-0.6800, lng:34.7700, contact:'+254 58 222 2601', contactPerson:'Beatrice Omari',   status:'active',   cylinders:10,  full:6,  empty:4  },
  { id:'KE-NET-027', name:'Malindi Seaside Gas',       type:'Retailer',    region:'Kilifi',       city:'Malindi',  address:'Malindi Town, Lamu Road',                      lat:-3.2200, lng:40.1200, contact:'+254 42 222 2701', contactPerson:'Zuhura Bakari',    status:'active',   cylinders:14,  full:8,  empty:6  },
  { id:'KE-NET-028', name:'Nairobi CBD Gas',           type:'Retailer',    region:'Nairobi',      city:'Nairobi',  address:'Tom Mboya Street, Nairobi CBD',                lat:-1.2867, lng:36.8200, contact:'+254 20 222 2801', contactPerson:'Kevin Otieno',     status:'active',   cylinders:21,  full:13, empty:8  },
  { id:'KE-NET-029', name:'Gigiri Gas Point',          type:'Retailer',    region:'Nairobi',      city:'Nairobi',  address:'Gigiri Estate, UN Avenue',                     lat:-1.2350, lng:36.8020, contact:'+254 20 222 2901', contactPerson:'Purity Wachira',   status:'active',   cylinders:16,  full:10, empty:6  },
  { id:'KE-NET-030', name:'Rongai Gas Retail',         type:'Retailer',    region:'Kajiado',      city:'Rongai',   address:'Rongai Town Centre, Nakuru Highway',            lat:-1.3940, lng:36.7436, contact:'+254 20 222 3001', contactPerson:'Francis Maina',    status:'active',   cylinders:13,  full:7,  empty:6  },
];

const DEMO_LPGMC_INFO_KE = {
  'Total Energies Kenya': { region:'Nairobi', city:'Nairobi', address:'Industrial Area, Enterprise Road, Nairobi', contact:'+254 20 286 0101', contactPerson:'Samuel Waweru',  lat:-1.3028, lng:36.8588 },
  'Vivo Energy Kenya':    { region:'Mombasa', city:'Mombasa', address:'Port Reitz Road, Changamwe, Mombasa',       contact:'+254 41 277 0202', contactPerson:'Fatuma Said',    lat:-4.0435, lng:39.6682 },
  'Africa Gas & Oil':     { region:'Nairobi', city:'Nairobi', address:'Baba Dogo Road, Ruaraka, Nairobi',          contact:'+254 20 285 0303', contactPerson:'Peter Omondi',   lat:-1.2550, lng:36.8700 },
  'Hashi Energy':         { region:'Nairobi', city:'Nairobi', address:'Likoni Road, Industrial Area, Nairobi',     contact:'+254 20 254 0404', contactPerson:'Hassan Ibrahim', lat:-1.3100, lng:36.8350 },
};

const DEMO_LICENSE_EXTRA_INFO_KE = {
  'Nairobi Gas Supplies': { region:'Nairobi', city:'Nairobi', address:'Industrial Area, Enterprise Road, Nairobi', contact:'+254 20 218 0441', contactPerson:'James Mwangi'  },
  'Mombasa Gas Direct':   { region:'Mombasa', city:'Mombasa', address:'Nyali Centre, Links Road, Mombasa',         contact:'+254 41 211 0552', contactPerson:'Amina Hassan'   },
  'Kenya Reval Services': { region:'Nairobi', city:'Nairobi', address:'Industrial Area, Baba Dogo Road, Nairobi',  contact:'+254 20 286 0663', contactPerson:'Charles Oduya'  },
};

function buildKenyaCylinders() {
  const companies = [
    { name:'Total Energies Kenya', prefix:'TEK', code:'05' },
    { name:'Vivo Energy Kenya',    prefix:'VEK', code:'06' },
    { name:'Africa Gas & Oil',     prefix:'AGL', code:'07' },
    { name:'Hashi Energy',         prefix:'HSH', code:'08' },
  ];
  const statusCycle = ['in-use','in-circulation','in-refill','in-use','in-circ-empty','in-use','in-refill-empty','in-use','in-circulation','revalidation','in-use','in-refill','in-use','in-circulation','in-circ-empty','in-use','in-use','in-refill','in-use','in-use'];
  const capacities  = [12,12,15,12,12,12,15,12,12,12];
  const result = [];
  const existingCounts = { 'Total Energies Kenya':15, 'Vivo Energy Kenya':15, 'Africa Gas & Oil':15, 'Hashi Energy':12 };
  companies.forEach((co, ci) => {
    const needed = 500 - (existingCounts[co.name] || 0);
    for (let i = 1; i <= needed; i++) {
      const isOld = (i % 40 === 0);
      const year = isOld ? (2017 + (Math.floor(i/40) % 4)) : (2016 + (i % 10));
      const month = String(((i + ci * 3) % 12) + 1).padStart(2,'0');
      const day   = String(((i + ci) % 28) + 1).padStart(2,'0');
      const mfgDate   = `${year}-${month}-${day}`;
      const hydroDate = `${year + 5}-${month}-${day}`;
      const age = 2026 - year;
      const fillCount = Math.max(1, age * 30 + (i % 50));
      const rawStatus = statusCycle[i % statusCycle.length];
      const resolvedStatus = rawStatus === 'in-circ-empty' ? 'in-circulation' : rawStatus === 'in-refill-empty' ? 'in-refill' : rawStatus;
      result.push({
        id: `E280116060${co.code}${String(i).padStart(10,'0')}`,
        serial: `${co.prefix}-${year}-G${String(i).padStart(3,'0')}`,
        company: co.name,
        manufactureDate: mfgDate,
        tareWeight: 14.5,
        capacity: capacities[i % capacities.length],
        fillCount,
        lastHydroTest: hydroDate,
        status: resolvedStatus,
        _seedEmpty: rawStatus === 'in-circ-empty',
        _seedRefillEmpty: rawStatus === 'in-refill-empty',
        notes: '',
      });
    }
  });
  return result;
}

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
  serialCaptureActive: false,
  tagCaptureActive:    false,
  passportCylinderId: null,
};

const PAGE_SIZE_CYLS    = 10;
const PAGE_SIZE_NETWORK = 10;
const PAGE_SIZE_ALERTS  = 10;

let _cylPage  = 1;
let _netPage  = 1;
let _alertPage = 1;
let _passportEvPage = 1;
let _passportEvSort = 'desc';
const PAGE_SIZE_PASSPORT_EVTS = 10;

function renderPagination(containerId, total, page, pageSize, onPageChange) {
  const el = $(containerId);
  if (!el) return;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);
  el.innerHTML = `
    <div class="pagination">
      <button class="pg-btn" ${page <= 1 ? 'disabled' : ''} data-dir="-1">‹ Prev</button>
      <span class="pg-info">${start}–${end} of ${total}</span>
      <button class="pg-btn" ${page >= totalPages ? 'disabled' : ''} data-dir="1">Next ›</button>
    </div>`;
  el.querySelectorAll('.pg-btn').forEach(btn => {
    btn.addEventListener('click', () => onPageChange(page + parseInt(btn.dataset.dir)));
  });
}

function renderPassportEvents(allEvents) {
  const listEl = $('passport-ev-list');
  const pagEl  = $('passport-ev-pagination');
  if (!listEl) return;
  const sorted = allEvents.slice().sort((a, b) =>
    _passportEvSort === 'desc'
      ? new Date(b.timestamp) - new Date(a.timestamp)
      : new Date(a.timestamp) - new Date(b.timestamp)
  );
  const start = (_passportEvPage - 1) * PAGE_SIZE_PASSPORT_EVTS;
  const pageEvts = sorted.slice(start, start + PAGE_SIZE_PASSPORT_EVTS);
  listEl.innerHTML = pageEvts.length
    ? pageEvts.map((ev, idx) => `
        <li>
          <span class="ph-step">${start + idx + 1}</span>
          <span class="ph-time">${formatDateTime(ev.timestamp)}</span>
          <span class="ph-desc">${escapeHtml(tEvent(ev.type))}${ev.company ? ' · ' + escapeHtml(ev.company) : ''}${ev.region ? ' (' + escapeHtml(ev.region) + ')' : ''}${ev.destinedFor ? ' → ' + escapeHtml(ev.destinedFor) : ''}${ev.stampCode ? ' · Stamp: ' + escapeHtml(ev.stampCode) : ''}</span>
        </li>`).join('')
    : '<li><span class="ph-desc">No events.</span></li>';
  if (pagEl) renderPagination('passport-ev-pagination', allEvents.length, _passportEvPage, PAGE_SIZE_PASSPORT_EVTS, (p) => {
    _passportEvPage = p;
    renderPassportEvents(allEvents);
  });
}

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

      if (!d.objectStoreNames.contains('inspections')) {
        const insStore = d.createObjectStore('inspections', { keyPath: 'id' });
        insStore.createIndex('status',  'status',  { unique: false });
        insStore.createIndex('company', 'company', { unique: false });
      }
    };

    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror   = (e) => reject(e.target.error);
  });
}

// ── IndexedDB helpers (used for non-Firestore stores) ────────────────────────
function _idbGet(storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function _idbGetAll(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function _idbPut(storeName, record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).put(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function _idbDelete(storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

function _idbClearStore(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).clear();
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

function _idbGetIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const idx = tx.objectStore(storeName).index(indexName);
    const req = idx.getAll(value);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

// ── In-memory cache for txGetAll — keyed by "storeName:country" ──────────────
// Invalidated on every txPut / txDelete / txClearStore so reads stay consistent.
const _txCache = {};
function _cacheKey(storeName) { return storeName + ':' + _activeCountry; }
function _cacheInvalidate(storeName) { delete _txCache[_cacheKey(storeName)]; }

// ── Public tx* API — routes FS_STORES to Firestore under /countries/{_activeCountry}/ ──
async function txGet(storeName, key) {
  if (_fdb && FS_STORES.has(storeName)) {
    const snap = await _fsColl(storeName).doc(String(key)).get();
    return snap.exists ? snap.data() : undefined;
  }
  return _idbGet(storeName, key);
}

async function txGetAll(storeName) {
  if (_fdb && FS_STORES.has(storeName)) {
    const k = _cacheKey(storeName);
    if (_txCache[k]) return _txCache[k];
    const snap = await _fsColl(storeName).get();
    _txCache[k] = snap.docs.map(d => d.data());
    return _txCache[k];
  }
  return _idbGetAll(storeName);
}

async function txPut(storeName, record) {
  _cacheInvalidate(storeName);
  if (_fdb && FS_STORES.has(storeName)) {
    if (_seedBatch !== null) return _fsBatchAdd(storeName, record);
    if (record.id != null) {
      await _fsColl(storeName).doc(String(record.id)).set(record);
      return record.id;
    } else {
      const ref = await _fsColl(storeName).add(record);
      record.id = ref.id;
      return ref.id;
    }
  }
  return _idbPut(storeName, record);
}

async function txDelete(storeName, key) {
  _cacheInvalidate(storeName);
  if (_fdb && FS_STORES.has(storeName)) {
    await _fsColl(storeName).doc(String(key)).delete();
    return;
  }
  return _idbDelete(storeName, key);
}

async function txClearStore(storeName) {
  _cacheInvalidate(storeName);
  if (_fdb && FS_STORES.has(storeName)) {
    const snap = await _fsColl(storeName).get();
    for (let i = 0; i < snap.docs.length; i += 500) {
      const batch = _fdb.batch();
      snap.docs.slice(i, i + 500).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
    return;
  }
  return _idbClearStore(storeName);
}

async function txGetIndex(storeName, indexName, value) {
  if (_fdb && FS_STORES.has(storeName)) {
    const snap = await _fsColl(storeName).where(indexName, '==', value).get();
    return snap.docs.map(d => d.data());
  }
  return _idbGetIndex(storeName, indexName, value);
}

function buildGeneratedCylinders() {
  const companies = [
    { name:'Vivo LPG',       prefix:'VLG', code:'01' },
    { name:'Total Energies', prefix:'TEN', code:'02' },
    { name:'Shell Gas',      prefix:'SHG', code:'03' },
    { name:'Lake Gas',       prefix:'LKG', code:'04' },
  ];
  // 'in-circ-empty' = status in-circulation, last event ret-returned-empty (empty, waiting at retailer)
  // 'in-refill-empty' = status in-refill, last event received-empty (empty, arrived at LPGMC for refill)
  const statusCycle = ['in-use','in-circulation','in-refill','in-use','in-circ-empty','in-use','in-refill-empty','in-use','in-circulation','revalidation','in-use','in-refill','in-use','in-circulation','in-circ-empty','in-use','in-use','in-refill','in-use','in-use'];
  const capacities  = [12,12,15,12,12,12,15,12,12,12];
  const result = [];
  // Existing demo cylinders: Vivo LPG 15, TEN 15, SHG 15, LKG 12 → generate to reach 500 each
  const existingCounts = { 'Vivo LPG':15, 'Total Energies':15, 'Shell Gas':15, 'Lake Gas':12 };
  companies.forEach((co, ci) => {
    const needed = 500 - (existingCounts[co.name] || 0);
    for (let i = 1; i <= needed; i++) {
      // ~2.5% slightly older cylinders, years 2017-2020 only → no generated requalOverdue alerts
      const isOld = (i % 40 === 0);
      const year = isOld ? (2017 + (Math.floor(i/40) % 4)) : (2016 + (i % 10));
      const month = String(((i + ci * 3) % 12) + 1).padStart(2,'0');
      const day   = String(((i + ci) % 28) + 1).padStart(2,'0');
      const mfgDate  = `${year}-${month}-${day}`;
      const hydroDate = `${year + 5}-${month}-${day}`;
      const age = 2026 - year;
      const fillCount = Math.max(1, age * 30 + (i % 50));
      const rawStatus = statusCycle[i % statusCycle.length];
      const cylStatus = (rawStatus === 'in-circ-empty' || rawStatus === 'in-refill-empty')
        ? rawStatus.replace('-empty','').replace('in-circ','in-circulation').replace('in-refill','in-refill')
        : rawStatus;
      const resolvedStatus = rawStatus === 'in-circ-empty' ? 'in-circulation' : rawStatus === 'in-refill-empty' ? 'in-refill' : rawStatus;
      result.push({
        id: `E280116060${co.code}${String(i).padStart(10,'0')}`,
        serial: `${co.prefix}-${year}-G${String(i).padStart(3,'0')}`,
        company: co.name,
        manufactureDate: mfgDate,
        tareWeight: 14.5,
        capacity: capacities[i % capacities.length],
        fillCount,
        lastHydroTest: hydroDate,
        status: resolvedStatus,
        _seedEmpty: rawStatus === 'in-circ-empty',
        _seedRefillEmpty: rawStatus === 'in-refill-empty',
        notes: '',
      });
    }
  });
  return result;
}

async function seedDemoData() {
  const localSeeded = await _idbGet('meta', SEED_KEY);
  if (localSeeded) return;

  // Global guard: if TZ already seeded in Firestore on another device, skip
  if (_fdb) {
    try {
      const snap = await _fdb.collection('countries').doc('TZ').collection('cylinders').limit(1).get();
      if (!snap.empty) {
        await _idbPut('meta', { key: SEED_KEY, value: true });
        return;
      }
    } catch (e) { /* offline — fall through */ }
  }

  const hadFirestore = !!_fdb;
  try {
    await _doSeed();
  } catch (seedErr) {
    console.error('Seeding failed:', seedErr);
    if (hadFirestore) {
      console.warn('Firestore seeding failed — retrying with IndexedDB only');
      _fdb = null; // keep null: reads must also come from IDB, not empty Firestore
      await seedDemoData();
    }
  }
}

async function _doSeed() {
  const now   = Date.now();
  const DAY   = 24 * 60 * 60 * 1000;
  const MONTH = 30 * DAY;
  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // Helper: one full usage cycle
  async function seedCompleteCycle(cyl, baseMs, distributors, retailers) {
    const d = rnd(distributors), r = rnd(retailers);
    await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(baseMs).toISOString(),          operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
    await txPut('events', { cylinderId:cyl.id, type:'shipped',             timestamp:new Date(baseMs+7*DAY).toISOString(),    operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
    await txPut('events', { cylinderId:cyl.id, type:'dist-received',       timestamp:new Date(baseMs+9*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
    await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',    timestamp:new Date(baseMs+15*DAY).toISOString(),   operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
    await txPut('events', { cylinderId:cyl.id, type:'ret-received',        timestamp:new Date(baseMs+17*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    await txPut('events', { cylinderId:cyl.id, type:'ret-sold',            timestamp:new Date(baseMs+22*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    await txPut('events', { cylinderId:cyl.id, type:'ret-returned-empty',  timestamp:new Date(baseMs+50*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    await txPut('events', { cylinderId:cyl.id, type:'dist-returned-empty', timestamp:new Date(baseMs+53*DAY).toISOString(),   operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
    await txPut('events', { cylinderId:cyl.id, type:'received-empty',      timestamp:new Date(baseMs+56*DAY).toISOString(),   operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
  }

  // Helper: seed event lifecycle for named (hand-coded) cylinders
  async function seedNamedCylEvents(cylinders, distributors, retailers, revalName, revalCity) {
    for (const cyl of cylinders) {
      const mfgTime = new Date(cyl.manufactureDate).getTime();
      await txPut('events', { cylinderId:cyl.id, type:'registered', timestamp:new Date(mfgTime).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company, notes:'Initial registration' });
      if (cyl.status === 'revalidation') {
        await seedCompleteCycle(cyl, now - 18*MONTH, distributors, retailers);
        await txPut('events', { cylinderId:cyl.id, type:'refilled',          timestamp:new Date(now-6*MONTH).toISOString(),        operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'sent-revalidation', timestamp:new Date(now-5*MONTH).toISOString(),        operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'reval-received',    timestamp:new Date(now-5*MONTH+3*DAY).toISOString(),  operatorId:'SYSTEM', company:revalName, location:revalName, region:revalCity });
        continue;
      }
      if (parseInt(cyl.manufactureDate) <= 2020 || cyl.fillCount >= 50) {
        await seedCompleteCycle(cyl, now-30*MONTH, distributors, retailers);
        await seedCompleteCycle(cyl, now-16*MONTH, distributors, retailers);
      } else if (cyl.fillCount >= 10) {
        await seedCompleteCycle(cyl, now-12*MONTH, distributors, retailers);
      }
      if (cyl.status === 'in-refill') {
        const d = rnd(distributors), r = rnd(retailers);
        const base = now - 4*MONTH;
        await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(base).toISOString(),          operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'shipped',             timestamp:new Date(base+7*DAY).toISOString(),    operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-received',       timestamp:new Date(base+9*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',    timestamp:new Date(base+15*DAY).toISOString(),   operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-received',        timestamp:new Date(base+17*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-sold',            timestamp:new Date(base+22*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-returned-empty',  timestamp:new Date(base+50*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-returned-empty', timestamp:new Date(base+53*DAY).toISOString(),   operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'received-empty',      timestamp:new Date(base+56*DAY).toISOString(),   operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(now-14*DAY).toISOString(),    operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      } else if (cyl.status === 'in-circulation') {
        const d = rnd(distributors), r = rnd(retailers);
        const base = now - 110*DAY;
        await txPut('events', { cylinderId:cyl.id, type:'refilled',         timestamp:new Date(base-7*DAY).toISOString(),  operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'shipped',          timestamp:new Date(base).toISOString(),        operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-received',    timestamp:new Date(base+2*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail', timestamp:new Date(base+10*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-received',     timestamp:new Date(base+12*DAY).toISOString(), operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      } else if (cyl.status === 'in-use') {
        const d = rnd(distributors), r = rnd(retailers);
        const base = now - 3*MONTH;
        await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(base).toISOString(),          operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'shipped',             timestamp:new Date(base+7*DAY).toISOString(),    operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-received',       timestamp:new Date(base+9*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',    timestamp:new Date(base+15*DAY).toISOString(),   operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-received',        timestamp:new Date(base+17*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-sold',            timestamp:new Date(base+22*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      }
    }
  }

  // Helper: seed event lifecycle for generated (bulk) cylinders
  async function seedGeneratedCylEvents(generatedCyls, distributors, retailers, revalName, revalCity) {
    for (const cyl of generatedCyls) {
      await txPut('cylinders', cyl);
      const mfgTime = new Date(cyl.manufactureDate).getTime();
      await txPut('events', { cylinderId:cyl.id, type:'registered', timestamp:new Date(mfgTime).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company, notes:'Initial registration' });
      const now2   = Date.now();
      const idHash = cyl.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const d = rnd(distributors), r = rnd(retailers);
      if (cyl._seedRefillEmpty) {
        const base = now2 - (5 + (idHash % 20)) * DAY;
        const r2 = rnd(retailers);
        await txPut('events', { cylinderId:cyl.id, type:'refilled',           timestamp:new Date(base-60*DAY).toISOString(),  operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'shipped',            timestamp:new Date(base-53*DAY).toISOString(),  operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-received',      timestamp:new Date(base-51*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',   timestamp:new Date(base-45*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r2.name, destinedRegion:r2.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-received',       timestamp:new Date(base-43*DAY).toISOString(),  operatorId:'SYSTEM', company:r2.name, location:r2.name, region:r2.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-sold',           timestamp:new Date(base-38*DAY).toISOString(),  operatorId:'SYSTEM', company:r2.name, location:r2.name, region:r2.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-returned-empty', timestamp:new Date(base-15*DAY).toISOString(),  operatorId:'SYSTEM', company:r2.name, location:r2.name, region:r2.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-returned-empty',timestamp:new Date(base-10*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'received-empty',     timestamp:new Date(base).toISOString(),         operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      } else if (cyl.status === 'in-refill') {
        const base = now2 - 2*MONTH;
        await txPut('events', { cylinderId:cyl.id, type:'received-empty', timestamp:new Date(base-5*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'refilled',       timestamp:new Date(base).toISOString(),       operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      } else if (cyl._seedEmpty) {
        const base = now2 - (20 + (idHash % 30)) * DAY;
        const r3 = rnd(retailers);
        await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(base-30*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'shipped',             timestamp:new Date(base-22*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-received',       timestamp:new Date(base-20*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',    timestamp:new Date(base-15*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r3.name, destinedRegion:r3.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-received',        timestamp:new Date(base-13*DAY).toISOString(), operatorId:'SYSTEM', company:r3.name, location:r3.name, region:r3.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-sold',            timestamp:new Date(base-8*DAY).toISOString(),  operatorId:'SYSTEM', company:r3.name, location:r3.name, region:r3.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-returned-empty',  timestamp:new Date(base).toISOString(),        operatorId:'SYSTEM', company:r3.name, location:r3.name, region:r3.region });
      } else if (cyl.status === 'in-circulation') {
        const isStuck = (idHash % 4 === 0);
        const daysAgo = isStuck ? 105 : (8 + (idHash % 30));
        const base = now2 - daysAgo * DAY;
        await txPut('events', { cylinderId:cyl.id, type:'refilled',         timestamp:new Date(base-7*DAY).toISOString(),  operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'shipped',          timestamp:new Date(base).toISOString(),        operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-received',    timestamp:new Date(base+2*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail', timestamp:new Date(base+8*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-received',     timestamp:new Date(base+10*DAY).toISOString(), operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      } else if (cyl.status === 'in-use') {
        const base = now2 - 3*MONTH;
        await txPut('events', { cylinderId:cyl.id, type:'refilled',         timestamp:new Date(base).toISOString(),          operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'shipped',          timestamp:new Date(base+7*DAY).toISOString(),    operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-received',    timestamp:new Date(base+9*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
        await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail', timestamp:new Date(base+15*DAY).toISOString(),   operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-received',     timestamp:new Date(base+17*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
        await txPut('events', { cylinderId:cyl.id, type:'ret-sold',         timestamp:new Date(base+22*DAY).toISOString(),   operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      } else if (cyl.status === 'revalidation') {
        await txPut('events', { cylinderId:cyl.id, type:'refilled',          timestamp:new Date(now2-6*MONTH).toISOString(),       operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'sent-revalidation', timestamp:new Date(now2-5*MONTH).toISOString(),       operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
        await txPut('events', { cylinderId:cyl.id, type:'reval-received',    timestamp:new Date(now2-5*MONTH+3*DAY).toISOString(), operatorId:'SYSTEM', company:revalName, location:revalName, region:revalCity });
      }
    }
  }

  // ── Tanzania (TZ) ─────────────────────────────────────────────────────────
  _activeCountry = 'TZ';
  if (_fdb) _seedBatch = [];

  await txClearStore('cylinders');
  await txClearStore('events');

  for (const cyl of DEMO_CYLINDERS) { await txPut('cylinders', cyl); }

  const TZ_RETAILERS = [
    { name:'QuickGas Retail DSM North',  region:'Dar es Salaam' },
    { name:'CityGas Direct Temeke',      region:'Dar es Salaam' },
    { name:'Kariakoo Gas Shop',          region:'Dar es Salaam' },
    { name:'Dar North Gas Kijitonyama',  region:'Dar es Salaam' },
    { name:'Northern Gas Retail Arusha', region:'Arusha'        },
    { name:'Arusha Clock Tower Gas',     region:'Arusha'        },
    { name:'Moshi Gas Outlet',           region:'Kilimanjaro'   },
    { name:'Mwanza Lakeside Gas',        region:'Mwanza'        },
    { name:'Mwanza Rock City Gas',       region:'Mwanza'        },
    { name:'Iringa Gas Retail',          region:'Iringa'        },
    { name:'Zanzibar Stone Town Gas',    region:'Zanzibar'      },
    { name:'Morogoro Gas Centre',        region:'Morogoro'      },
    { name:'Dodoma Central Gas Shop',    region:'Dodoma'        },
    { name:'Mbeya Highland Gas Retail',  region:'Mbeya'         },
    { name:'Tanga Shoreline Gas',        region:'Tanga'         },
    { name:'Tabora Market Gas Shop',     region:'Tabora'        },
    { name:'Shinyanga Gas Retail',       region:'Shinyanga'     },
  ];
  const TZ_DISTRIBUTORS = [
    { name:'ABC Gas Distributors',         region:'Dar es Salaam' },
    { name:'Sunrise Gas Ltd',              region:'Arusha'        },
    { name:'Lake Victoria Gas Supply',     region:'Mwanza'        },
    { name:'Capital Gas Supplies',         region:'Dodoma'        },
    { name:'Kilimanjaro Gas Distributors', region:'Kilimanjaro'   },
    { name:'Southern Highlands Gas',       region:'Mbeya'         },
    { name:'Coastal Gas Ltd',              region:'Tanga'         },
    { name:'Tabora Gas Distributors',      region:'Tabora'        },
    { name:'Morogoro Gas Depot',           region:'Morogoro'      },
    { name:'Shinyanga Gas Centre',         region:'Shinyanga'     },
  ];

  await seedNamedCylEvents(DEMO_CYLINDERS, TZ_DISTRIBUTORS, TZ_RETAILERS, 'ProRevalid Ltd', 'Dar es Salaam');
  await seedGeneratedCylEvents(buildGeneratedCylinders(), TZ_DISTRIBUTORS, TZ_RETAILERS, 'ProRevalid Ltd', 'Dar es Salaam');

  const tzMisplacedPairs = [
    { cylId:'E280116060000204C3F04E85', company:'Vivo LPG',       intendedDist:'ABC Gas Distributors',         intendedRegion:'Dar es Salaam', actualDist:'Sunrise Gas Ltd',          actualRegion:'Arusha'       },
    { cylId:'E280116060000204C3F04E95', company:'Shell Gas',      intendedDist:'Capital Gas Supplies',         intendedRegion:'Dodoma',        actualDist:'Southern Highlands Gas',   actualRegion:'Mbeya'        },
    { cylId:'E280116060000204C3F04E87', company:'Vivo LPG',       intendedDist:'Kilimanjaro Gas Distributors', intendedRegion:'Kilimanjaro',    actualDist:'ABC Gas Distributors',     actualRegion:'Dar es Salaam' },
    { cylId:'E280116060000204C3F04E8B', company:'Total Energies', intendedDist:'Morogoro Gas Depot',           intendedRegion:'Morogoro',       actualDist:'Tabora Gas Distributors',  actualRegion:'Tabora'       },
    { cylId:'E280116060000204C3F04E91', company:'Shell Gas',      intendedDist:'Coastal Gas Ltd',              intendedRegion:'Tanga',          actualDist:'Sunrise Gas Ltd',          actualRegion:'Arusha'       },
    { cylId:'E280116060000204C3F04E9C', company:'Lake Gas',       intendedDist:'ABC Gas Distributors',         intendedRegion:'Dar es Salaam',  actualDist:'Lake Victoria Gas Supply', actualRegion:'Mwanza'       },
  ];
  for (const mp of tzMisplacedPairs) {
    const tShip = new Date(now - 10*DAY), tRecv = new Date(now - 8*DAY);
    await txPut('events', { cylinderId:mp.cylId, type:'shipped',       timestamp:tShip.toISOString(), operatorId:'SYSTEM', company:mp.company,     location:mp.company,     destinedFor:mp.intendedDist,  destinedRegion:mp.intendedRegion });
    await txPut('events', { cylinderId:mp.cylId, type:'dist-received', timestamp:tRecv.toISOString(), operatorId:'SYSTEM', company:mp.actualDist,  location:mp.actualDist,  region:mp.actualRegion });
  }

  const TZ_INSP_SEED = [
    { cylId:'E280116060000204C3F04E81', type:'inspected',       ts:'2025-12-10T10:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E82', type:'inspected',       ts:'2025-12-15T11:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E83', type:'ewura-monitored', ts:'2025-12-20T09:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E89', type:'inspected',       ts:'2026-01-08T14:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E8A', type:'inspected',       ts:'2026-01-15T10:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E8B', type:'ewura-monitored', ts:'2026-01-22T08:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E91', type:'inspected',       ts:'2026-02-05T13:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E92', type:'inspected',       ts:'2026-02-12T09:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E99', type:'inspected',       ts:'2026-02-18T11:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E84', type:'ewura-monitored', ts:'2026-03-03T10:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E85', type:'inspected',       ts:'2026-03-10T14:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E8C', type:'inspected',       ts:'2026-03-20T09:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E9A', type:'inspected',       ts:'2026-04-04T11:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E9B', type:'ewura-monitored', ts:'2026-04-11T10:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E93', type:'inspected',       ts:'2026-04-18T08:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E86', type:'inspected',       ts:'2026-05-06T13:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E94', type:'inspected',       ts:'2026-05-14T10:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04EA1', type:'ewura-monitored', ts:'2026-05-22T09:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E87', type:'inspected',       ts:'2026-06-02T14:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E95', type:'inspected',       ts:'2026-06-07T11:00:00Z', compliant:true  },
  ];
  for (const s of TZ_INSP_SEED) {
    await txPut('events', { cylinderId:s.cylId, type:s.type, timestamp:s.ts, operatorId:'SYSTEM', company:s.type==='ewura-monitored'?'EWURA':'Field Inspection Unit', compliant:s.compliant });
  }

  if (_fdb && _seedBatch !== null) { await _fsBatchFlush(); _seedBatch = null; }
  for (const lic of DEMO_LICENSES)     { await txPut('licenses',     lic); }
  for (const ins of DEMO_INSPECTIONS)  { await txPut('inspections',  ins); }

  // ── Kenya (KE) ────────────────────────────────────────────────────────────
  _activeCountry = 'KE';
  if (_fdb) _seedBatch = [];

  await txClearStore('cylinders');
  await txClearStore('events');

  for (const cyl of DEMO_CYLINDERS_KE) { await txPut('cylinders', cyl); }

  const KE_RETAILERS = [
    { name:'Westlands Gas Shop',      region:'Nairobi'     },
    { name:'Eastleigh Gas Outlet',    region:'Nairobi'     },
    { name:'Kibera Gas Point',        region:'Nairobi'     },
    { name:'Karen Gas Retail',        region:'Nairobi'     },
    { name:'Nairobi CBD Gas',         region:'Nairobi'     },
    { name:'Gigiri Gas Point',        region:'Nairobi'     },
    { name:'Mtwapa Gas Shop',         region:'Mombasa'     },
    { name:'Nyali Gas Direct',        region:'Mombasa'     },
    { name:'Kisumu Milimani Gas',     region:'Kisumu'      },
    { name:'Nakuru Central Gas Shop', region:'Nakuru'      },
    { name:'Eldoret Pioneer Gas',     region:'Uasin Gishu' },
    { name:'Nyeri Gas Corner',        region:'Nyeri'       },
    { name:'Thika Gas Retail',        region:'Kiambu'      },
    { name:'Rongai Gas Retail',       region:'Kajiado'     },
    { name:'Malindi Seaside Gas',     region:'Kilifi'      },
    { name:'Kisii Central Gas',       region:'Kisii'       },
  ];
  const KE_DISTRIBUTORS = [
    { name:'Nairobi Gas Supplies',      region:'Nairobi'     },
    { name:'Mombasa Gas Depot',         region:'Mombasa'     },
    { name:'Kisumu Gas Supplies',       region:'Kisumu'      },
    { name:'Nakuru Gas Centre',         region:'Nakuru'      },
    { name:'Eldoret Gas Distributors',  region:'Uasin Gishu' },
    { name:'Thika Gas Supplies',        region:'Kiambu'      },
    { name:'Machakos Gas Distributors', region:'Machakos'    },
    { name:'Meru Gas Centre',           region:'Meru'        },
    { name:'Malindi Gas Depot',         region:'Kilifi'      },
    { name:'Kisii Gas Distributors',    region:'Kisii'       },
  ];

  await seedNamedCylEvents(DEMO_CYLINDERS_KE, KE_DISTRIBUTORS, KE_RETAILERS, 'Kenya Reval Services', 'Nairobi');
  await seedGeneratedCylEvents(buildKenyaCylinders(), KE_DISTRIBUTORS, KE_RETAILERS, 'Kenya Reval Services', 'Nairobi');

  const keMisplacedPairs = [
    { cylId:'E280116060000204C3F04F85', company:'Total Energies Kenya', intendedDist:'Nairobi Gas Supplies',     intendedRegion:'Nairobi',      actualDist:'Mombasa Gas Depot',         actualRegion:'Mombasa'   },
    { cylId:'E280116060000204C3F04FA5', company:'Vivo Energy Kenya',    intendedDist:'Kisumu Gas Supplies',      intendedRegion:'Kisumu',       actualDist:'Nakuru Gas Centre',         actualRegion:'Nakuru'    },
    { cylId:'E280116060000204C3F04FB4', company:'Africa Gas & Oil',     intendedDist:'Thika Gas Supplies',       intendedRegion:'Kiambu',       actualDist:'Machakos Gas Distributors', actualRegion:'Machakos'  },
    { cylId:'E280116060000204C3F04F88', company:'Total Energies Kenya', intendedDist:'Eldoret Gas Distributors', intendedRegion:'Uasin Gishu',  actualDist:'Nairobi Gas Supplies',      actualRegion:'Nairobi'   },
  ];
  for (const mp of keMisplacedPairs) {
    const tShip = new Date(now - 10*DAY), tRecv = new Date(now - 8*DAY);
    await txPut('events', { cylinderId:mp.cylId, type:'shipped',       timestamp:tShip.toISOString(), operatorId:'SYSTEM', company:mp.company,    location:mp.company,    destinedFor:mp.intendedDist, destinedRegion:mp.intendedRegion });
    await txPut('events', { cylinderId:mp.cylId, type:'dist-received', timestamp:tRecv.toISOString(), operatorId:'SYSTEM', company:mp.actualDist, location:mp.actualDist, region:mp.actualRegion });
  }

  const KE_INSP_SEED = [
    { cylId:'E280116060000204C3F04F81', type:'inspected',      ts:'2025-12-12T10:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04F82', type:'inspected',      ts:'2025-12-18T11:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04F83', type:'epra-monitored', ts:'2025-12-22T09:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04F8D', type:'inspected',      ts:'2026-01-10T14:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04F8E', type:'inspected',      ts:'2026-01-18T10:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FA1', type:'epra-monitored', ts:'2026-01-25T08:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04FA2', type:'inspected',      ts:'2026-02-08T13:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FA3', type:'inspected',      ts:'2026-02-14T09:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FC1', type:'inspected',      ts:'2026-02-20T11:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04F84', type:'epra-monitored', ts:'2026-03-05T10:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04F85', type:'inspected',      ts:'2026-03-12T14:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FB1', type:'inspected',      ts:'2026-03-22T09:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FC2', type:'inspected',      ts:'2026-04-06T11:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FC3', type:'epra-monitored', ts:'2026-04-14T10:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04FB2', type:'inspected',      ts:'2026-04-20T08:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04F86', type:'inspected',      ts:'2026-05-08T13:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FB3', type:'inspected',      ts:'2026-05-16T10:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FA4', type:'epra-monitored', ts:'2026-05-24T09:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04F87', type:'inspected',      ts:'2026-06-04T14:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04FA5', type:'inspected',      ts:'2026-06-09T11:00:00Z', compliant:true  },
  ];
  for (const s of KE_INSP_SEED) {
    await txPut('events', { cylinderId:s.cylId, type:s.type, timestamp:s.ts, operatorId:'SYSTEM', company:s.type==='epra-monitored'?'EPRA':'Field Inspection Unit', compliant:s.compliant });
  }

  if (_fdb && _seedBatch !== null) { await _fsBatchFlush(); _seedBatch = null; }
  for (const lic of DEMO_LICENSES_KE)    { await txPut('licenses',    lic); }
  for (const ins of DEMO_INSPECTIONS_KE) { await txPut('inspections', ins); }

  _activeCountry = 'TZ';
  await _idbPut('meta', { key: SEED_KEY, value: true });
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

// Mgmt reports filters
const mgmtFilterYear   = $('mgmt-filter-year');
const mgmtFilterMonth  = $('mgmt-filter-month');

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
const regTagScanBtn    = $('reg-tag-scan-btn');
const regSerial        = $('reg-serial');
const regSerialScanBtn = $('reg-serial-scan-btn');
const regManufDate     = $('reg-manufacture-date');
const regTare          = $('reg-tare');
const regHydrotest     = $('reg-hydrotest');
const regNotes         = $('reg-notes');
const regSubmitBtn     = $('reg-submit-btn');

const regBrandName      = $('reg-brand-name');
const regManufacturer   = $('reg-manufacturer');
const regProductName    = $('reg-product-name');
const regRequalDate     = $('reg-requalification-date');
const regRequalPlant    = $('reg-requalification-plant');
const regNetWeight      = $('reg-net-weight');
const regPressureTest   = $('reg-pressure-test');

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
  loginCompSel.value  = '';
  loginCompText.value = '';
  _selectedRole = null;
  const countryPill = $('header-country-pill');
  if (countryPill) countryPill.hidden = true;
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

  // EWURA: auto-login immediately, no form needed
  if (role === 'ewura') {
    Auth.login('ewura', 'Regulator', '');
    return;
  }

  // Configure company input
  loginFormLabel.textContent = ROLE_LABELS[role] || role;
  loginCompSel.style.display  = 'none';
  loginCompText.style.display = 'none';

  const _network   = _activeCountry === 'KE' ? DEMO_NETWORK_KE   : DEMO_NETWORK;
  const _lpgmcList = _activeCountry === 'KE' ? LPGMC_COMPANIES_KE : LPGMC_COMPANIES;

  if (role === 'lpgmc') {
    loginCompSel.innerHTML = _lpgmcList.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    loginCompSel.style.display = '';
  } else if (role === 'distributor') {
    const dists = _network.filter(n => n.type === 'Distributor');
    loginCompSel.innerHTML = dists.map(n => `<option value="${escapeHtml(n.name)}">${escapeHtml(n.name)}</option>`).join('');
    loginCompSel.style.display = '';
  } else if (role === 'retailer') {
    const rets = _network.filter(n => n.type === 'Retailer');
    loginCompSel.innerHTML = rets.map(n => `<option value="${escapeHtml(n.name)}">${escapeHtml(n.name)}</option>`).join('');
    loginCompSel.style.display = '';
  } else {
    loginCompText.placeholder = role === 'tra'           ? 'TRA'
      : role === 'revalidator'   ? 'e.g. ProRevalid Ltd'
      : 'e.g. Field Inspection Unit';
    loginCompText.style.display = '';
  }

  loginFormWrapper.hidden = false;
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

  const useSelect = ['lpgmc', 'distributor', 'retailer'].includes(_selectedRole);
  const company = useSelect ? loginCompSel.value.trim() : loginCompText.value.trim();

  if (!company) { showSnackbar('Please enter a company name.', 'error'); return; }

  Auth.login(_selectedRole, company, '');
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

  headerOpPill.textContent = s.company;
  headerOpPill.hidden      = false;

  const countryPill = $('header-country-pill');
  if (countryPill) {
    countryPill.textContent = _activeCountry === 'KE' ? '🇰🇪 Kenya' : '🇹🇿 Tanzania';
    countryPill.hidden = false;
  }

  logoutBtn.hidden = false;
  if (_hamburger) _hamburger.hidden = false;

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
  // Bulk register button: LPGMC only
  const _bulkBtn = $('bulk-register-btn');
  if (_bulkBtn) _bulkBtn.style.display = s.role === 'lpgmc' ? '' : 'none';
  // Reception button: LPGMC, distributor, retailer
  const _recBtn = $('reception-btn');
  if (_recBtn) _recBtn.style.display = ['lpgmc', 'distributor', 'retailer'].includes(s.role) ? '' : 'none';
  // Shipment button: LPGMC, distributor, retailer
  const _shipBtn = $('shipment-btn');
  if (_shipBtn) _shipBtn.style.display = ['lpgmc', 'distributor', 'retailer'].includes(s.role) ? '' : 'none';

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
    scan:           'Scanning',
    cylinders:      'Cylinders',
    alerts:         'Alerts',
    reports:        'Dashboard',
    licenses:       'Licenses',
    network:        'Network',
    'mgmt-reports': 'Management Reports',
    'bulk-monitor': 'Bullet Tanks',
    'market-intel': 'Market Intelligence',
    inspections:    'Field Inspections',
    recalls:        'Cylinder Recalls',
  }[name] || name;

  // Lazy render
  if (name === 'cylinders')     renderCylinders();
  if (name === 'alerts')        renderAlerts();
  if (name === 'reports')       renderReports();
  if (name === 'licenses')      renderLicenses();
  if (name === 'network')       renderNetwork();
  if (name === 'mgmt-reports')  renderMgmtReports();
  if (name === 'bulk-monitor')  renderBulkMonitor();
  if (name === 'market-intel')  renderMarketIntel();
  if (name === 'inspections')   renderInspections();
  if (name === 'recalls')       renderRecalls();

  // Invalidate Leaflet map sizes after view becomes visible
  requestAnimationFrame(() => {
    _leafletMaps.forEach(map => { try { map.invalidateSize(); } catch(e) {} });
  });
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
    focusLabel.textContent = t('scan.pauseHint');
    statusBadge.textContent = t('scan.active');
    statusBadge.className = 'badge badge-active';
    statusBadge.hidden = false;
  } else {
    scannerInput.blur();
    focusBtn.classList.remove('active');
    focusIcon.textContent = '📡';
    focusLabel.textContent = t('scan.startHint');
    statusBadge.hidden = true;
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
    statusBadge.textContent = t('scan.unfocused');
    statusBadge.className = 'badge badge-scanning';
    statusBadge.hidden = false;
  }
});

scannerInput.addEventListener('focus', () => {
  if (State.focused) {
    statusBadge.textContent = t('scan.active');
    statusBadge.className = 'badge badge-active';
    statusBadge.hidden = false;
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// SCAN HANDLER
// ══════════════════════════════════════════════════════════════════════════════

async function handleScan(tagId) {
  if (!Auth.session) return;

  // Tag capture mode for register modal
  if (State.tagCaptureActive) {
    regTag.value = tagId;
    State.tagCaptureActive = false;
    showSnackbar('Tag captured.', 'success');
    return;
  }

  // Serial capture mode for register modal
  if (State.serialCaptureActive) {
    regSerial.value = tagId;
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
  lastScanResult.textContent = t('scan.lookingUp');

  // Lookup cylinder
  const cyl = await txGet('cylinders', tagId);

  if (!cyl) {
    // Unknown tag
    if (Auth.can('register')) {
      lastScanResult.className = 'last-scan-result warning';
      lastScanResult.textContent = t('scan.unknownTag');
      openRegisterModal(tagId);
    } else {
      lastScanResult.className = 'last-scan-result';
      lastScanResult.innerHTML = `
        <div style="background:#fef2f2;border:2px solid #ef4444;border-radius:8px;padding:16px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#dc2626">&#9888; ${t('counterfeit.title')}</div>
          <div style="margin:8px 0">${t('scan.lastScan').replace('Scan','').trim() || 'Cylinder'} <strong>${escapeHtml(tagId)}</strong> ${t('counterfeit.body')}</div>
          <div style="color:#6b7280;font-size:13px">${t('counterfeit.sub')}</div>
          <button id="report-counterfeit-btn" style="margin-top:12px;background:#dc2626;color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-size:14px">${t('counterfeit.report')}</button>
        </div>`;
      document.getElementById('report-counterfeit-btn')?.addEventListener('click', () => {
        const reports = JSON.parse(localStorage.getItem('lpg-counterfeits') || '[]');
        reports.push({ tagId, timestamp: nowISO(), reportedBy: Auth.session?.company || 'unknown', role: Auth.session?.role || 'unknown' });
        localStorage.setItem('lpg-counterfeits', JSON.stringify(reports));
        showSnackbar(t('counterfeit.submitted'), 'success');
        document.getElementById('report-counterfeit-btn').disabled = true;
        document.getElementById('report-counterfeit-btn').textContent = t('counterfeit.reported');
      });
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

async function commitScanEvent(cyl, timestamp, overrideType, extraFields = {}) {
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
    ...extraFields,
  };

  await txPut('events', event);

  // Update cylinder status
  const updatedCyl = Object.assign({}, cyl);

  if (eventType === 'refilled') {
    updatedCyl.fillCount = (updatedCyl.fillCount || 0) + 1;
    updatedCyl.status = 'in-refill'; // ready to ship after refill
    if (extraFields.stampCode) updatedCyl.lastStampCode = extraFields.stampCode;
  } else if (eventType === 'shipped' || eventType === 'dist-received' || eventType === 'ret-received' || eventType === 'dist-sent-retail') {
    updatedCyl.status = 'in-circulation';
  } else if (eventType === 'ret-sold') {
    updatedCyl.status = 'in-use';
  } else if (eventType === 'dist-returned-empty' || eventType === 'ret-returned-empty' || eventType === 'received-empty') {
    updatedCyl.status = 'in-refill';
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
  regBrandName.value      = company;
  regManufacturer.value   = company;
  regProductName.value    = 'LPG';
  regManufDate.value      = today;
  regRequalDate.value     = '';
  regRequalPlant.value    = '';
  regTare.value           = '14.5';
  regNetWeight.value      = '12';
  regPressureTest.value   = '';
  regHydrotest.value      = today;
  regNotes.value          = '';
  openModal('modal-register');
  // Focus RFID tag input on open; if tag already supplied, go straight to serial
  setTimeout(() => {
    if (tagId) { regSerial.focus(); } else { regTag.focus(); }
  }, 80);
}

// "+ Register" button in cylinders view header (LPGMC only)
if (registerCylBtn) {
  registerCylBtn.addEventListener('click', () => {
    openRegisterModal('');
  });
}

// Auto-advance: RFID tag → serial number on Enter or when scanner fills the field
regTag.addEventListener('keydown', e => {
  if (e.key === 'Enter' && regTag.value.trim()) {
    e.preventDefault();
    regSerial.focus();
  }
});
// RFID scanners emit the value instantly then fire an 'input' event; detect by
// checking that the field gained content without the user being in the middle of
// typing (scanner input arrives fast and is followed by Enter, but we also handle
// the case where the scanner sends no Enter by advancing on blur when filled).
regTag.addEventListener('blur', () => {
  if (regTag.value.trim() && !regSerial.value.trim()) {
    regSerial.focus();
  }
});

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
    id:                tagId,
    serial:            serial,
    company:           Auth.session.company,
    ownerBrandName:    regBrandName.value.trim(),
    manufacturer:      regManufacturer.value.trim(),
    productName:       regProductName.value.trim(),
    manufactureDate:   regManufDate.value,
    lastRequalDate:    regRequalDate.value,
    requalPlant:       regRequalPlant.value.trim(),
    tareWeight:        parseFloat(regTare.value) || 14.5,
    netWeight:         parseFloat(regNetWeight.value) || 12,
    capacity:          parseFloat(regNetWeight.value) || 12,
    fillCount:         0,
    pressureTestValue: regPressureTest.value.trim(),
    lastHydroTest:     regHydrotest.value,
    status:            'in-refill',
    notes:             regNotes.value.trim(),
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

if (regTagScanBtn) {
  regTagScanBtn.addEventListener('click', () => {
    State.tagCaptureActive = true;
    scannerInput.focus();
    showSnackbar('Ready — scan the RFID tag now…');
  });
}

regSerialScanBtn.addEventListener('click', () => {
  State.serialCaptureActive = true;
  scannerInput.focus();
  showSnackbar('Ready — scan the serial barcode now…');
});

// ══════════════════════════════════════════════════════════════════════════════
// CYLINDERS VIEW
// ══════════════════════════════════════════════════════════════════════════════

let _cylAllData = [];
let _cylLocations = {}; // cylinderId → { location, region }
function renderCylindersMap(cyls) {
  const mapEl = $('cyl-map');
  if (!mapEl) return;
  const statusColor = { 'in-refill':'#3b82f6', 'in-circulation':'#22c55e', 'revalidation':'#f59e0b', 'in-use':'#a855f7' };
  const markers = [];
  cyls.forEach(cyl => {
    let lat, lng;
    const locData = _cylLocations[cyl.id];
    if (locData?.location) {
      const net = DEMO_NETWORK.find(n => n.name === locData.location);
      if (net) { lat = net.lat; lng = net.lng; }
    }
    if (!lat) {
      const lpgmc = DEMO_LPGMC_INFO[cyl.company];
      if (lpgmc) { lat = lpgmc.lat; lng = lpgmc.lng; }
    }
    if (!lat && locData?.region) {
      const c = REGION_CENTROIDS[locData.region];
      if (c) { lat = c[0]; lng = c[1]; }
    }
    if (!lat) return;
    markers.push({ lat, lng, color: statusColor[cyl.status] || '#6b7280', label: cyl.serial, tooltip: `${cyl.serial} · ${cyl.company} · ${cyl.status}` });
  });
  const legend = [
    { color:'#3b82f6', label:'In Refill' }, { color:'#22c55e', label:'In Circulation' },
    { color:'#f59e0b', label:'Revalidation' }, { color:'#a855f7', label:'In Use' },
  ];
  mapEl.innerHTML = buildInteractiveMap('cylmap', markers, legend, 280);
  initInteractiveMap('cylmap', markers);
}

function buildLifecycleFunnelHtml(allCyls, allEvents) {
  const total    = allCyls.length || 1;
  const inRefill = allCyls.filter(c => c.status === 'in-refill').length;
  const inCirc   = allCyls.filter(c => c.status === 'in-circulation').length;
  const inUse    = allCyls.filter(c => c.status === 'in-use').length;
  const retIds   = new Set(allEvents.filter(e => e.type === 'ret-returned-empty' || e.type === 'dist-returned-empty').map(e => e.cylinderId));
  const returned = retIds.size;
  const stages = [
    { key:'registered',   count: total,    color:'#3b82f6' },
    { key:'inRefill',     count: inRefill, color:'#a855f7' },
    { key:'inCirculation',count: inCirc,   color:'#22c55e' },
    { key:'inUse',        count: inUse,    color:'#f59e0b' },
    { key:'returned',     count: returned, color:'#14b8a6' },
  ];
  const stagesHtml = stages.map((s, i) => {
    const pct = Math.round((s.count / total) * 100);
    const arrow = i < stages.length - 1 ? `<div style="color:var(--muted);font-size:18px;align-self:center;padding:0 6px;padding-bottom:18px">→</div>` : '';
    return `<div style="text-align:center;min-width:72px;flex:1">
      <div style="font-size:22px;font-weight:700;color:${s.color}">${s.count}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px">${escapeHtml(t('funnel.' + s.key))}</div>
      <div style="font-size:10px;color:var(--dim);margin-top:1px">${pct}%</div>
    </div>${arrow}`;
  }).join('');
  return `<div class="mgmt-card">
    <div class="mgmt-card-header"><div class="mgmt-card-title">${t('mgmt.lifecycleFunnel')}</div></div>
    <div style="display:flex;align-items:flex-start;overflow-x:auto;padding:10px 0 4px">${stagesHtml}</div>
  </div>`;
}

async function renderCylinders() {
  _cylAllData = await txGetAll('cylinders');
  const allEvents = await txGetAll('events');

  // Filter by company for LPGMC
  if (Auth.session && Auth.session.role === 'lpgmc') {
    _cylAllData = _cylAllData.filter(c => c.company === Auth.session.company);
  } else if (Auth.session && (Auth.session.role === 'distributor' || Auth.session.role === 'retailer')) {
    // Show only cylinders currently at this partner's location
    const lastEvMap = {};
    allEvents.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .forEach(ev => { lastEvMap[ev.cylinderId] = ev; });
    const partnerName = Auth.session.company;
    _cylAllData = _cylAllData.filter(c => {
      const ev = lastEvMap[c.id];
      if (!ev) return false;
      return (ev.location || ev.company || '') === partnerName;
    });
  }

  // Build last-known-location cache for cylinders not in-use
  buildCylLocations(_cylAllData, allEvents);

  applyCylFilters();
  renderCylindersMap(_cylAllData);
}

function buildCylLocations(cyls, allEvents) {
  _cylLocations = {};
  const CIRC_FULL_TYPES  = new Set(['shipped', 'dist-received', 'dist-sent-retail', 'ret-received']);
  const CIRC_EMPTY_TYPES = new Set(['ret-returned-empty', 'dist-returned-empty']);
  const REVAL_TYPES      = new Set(['sent-revalidation', 'reval-received']);

  cyls.forEach(cyl => {
    if (cyl.status === 'in-use') return;

    if (cyl.status === 'in-refill') {
      _cylLocations[cyl.id] = { location: cyl.company, region: 'Refill Site' };
      return;
    }

    const cylEvs = allEvents
      .filter(e => e.cylinderId === cyl.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (cyl.status === 'in-circulation') {
      const locEv = cylEvs.find(e => CIRC_FULL_TYPES.has(e.type) || CIRC_EMPTY_TYPES.has(e.type));
      if (locEv) {
        const isReturn = CIRC_EMPTY_TYPES.has(locEv.type);
        _cylLocations[cyl.id] = {
          location: locEv.location || locEv.company || '',
          region:   locEv.region || '',
          empty:    isReturn,
        };
      }
      return;
    }

    if (cyl.status === 'revalidation') {
      const locEv = cylEvs.find(e => REVAL_TYPES.has(e.type));
      _cylLocations[cyl.id] = {
        location: (locEv?.location || locEv?.company) || 'Revalidation Centre',
        region:   locEv?.region || '',
      };
    }
  });
}

function applyCylFilters() {
  const q       = cylSearch.value.toLowerCase().trim();
  const statusF = cylFilterStatus.value;
  const compF   = cylFilterCompany.value;

  let data = _cylAllData;
  if (q)       data = data.filter(c => c.serial.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  if (statusF) data = data.filter(c => c.status === statusF);
  if (compF)   data = data.filter(c => c.company === compF);

  cylStats.innerHTML = '';

  cylindersList.innerHTML = '';
  if (!data.length) {
    cylindersEmpty.style.display = '';
    renderPagination('cyl-pagination', 0, 1, PAGE_SIZE_CYLS, () => {});
    return;
  }
  cylindersEmpty.style.display = 'none';

  const totalCyls = data.length;
  _cylPage = Math.min(_cylPage, Math.ceil(totalCyls / PAGE_SIZE_CYLS));
  const pageData = data.slice((_cylPage - 1) * PAGE_SIZE_CYLS, _cylPage * PAGE_SIZE_CYLS);

  const statLabelMap = {
    'in-refill':      'In Refill',
    'in-circulation': 'In Circulation',
    'revalidation':   'In Revalidation',
    'in-use':         'In Use',
  };

  pageData.forEach(cyl => {
    const li = document.createElement('li');
    li.className = 'cylinder-item';

    const dotClass  = 'dot-' + (cyl.status || 'in-refill');
    const statClass = 'status-' + (cyl.status || 'in-refill');
    const statLabel = statLabelMap[cyl.status] || cyl.status;

    const locData = cyl.status !== 'in-use' ? _cylLocations[cyl.id] : null;
    const locLine = locData
      ? `<span class="cylinder-meta-item">📍 ${[locData.region, locData.location].filter(Boolean).map(escapeHtml).join(' · ')}</span>`
      : '';

    const hasAlert = _alertsData.some(a => a.cylinder?.id === cyl.id);

    const isLpgmc = Auth.session?.role === 'lpgmc';

    li.innerHTML = `
      ${hasAlert ? '<span class="cyl-side-bar"></span>' : '<span class="cyl-side-bar-empty"></span>'}
      <span class="cylinder-status-dot ${escapeHtml(dotClass)}"></span>
      <div class="cylinder-body">
        <div class="cylinder-serial">${escapeHtml(cyl.serial)}</div>
        <div class="cylinder-tag">${escapeHtml(cyl.id)}</div>
        <div class="cylinder-meta">
          <span class="cylinder-meta-item">${escapeHtml(cyl.company)}</span>
          ${cyl.lastHydroTest ? `<span class="cylinder-meta-item">Hydro: ${escapeHtml(cyl.lastHydroTest)}</span>` : ''}
          ${cyl.manufactureDate ? `<span class="cylinder-meta-item">Mfg: ${escapeHtml(cyl.manufactureDate)}</span>` : ''}
          ${locLine}
        </div>
      </div>
      <div class="cylinder-badges">
        <span class="status-badge ${escapeHtml(statClass)}">${escapeHtml(statLabel)}</span>
        ${isLpgmc ? `<button class="cyl-delete-btn" data-id="${escapeHtml(cyl.id)}" title="Remove cylinder" type="button">🗑</button>` : ''}
      </div>`;

    li.addEventListener('click', e => {
      if (e.target.closest('.cyl-delete-btn')) return;
      openPassportModal(cyl.id);
    });
    cylindersList.appendChild(li);
  });

  renderPagination('cyl-pagination', totalCyls, _cylPage, PAGE_SIZE_CYLS, (p) => {
    _cylPage = p;
    applyCylFilters();
  });
}

cylSearch.addEventListener('input',         () => { _cylPage = 1; applyCylFilters(); });
cylFilterStatus.addEventListener('change',  () => { _cylPage = 1; applyCylFilters(); });
cylFilterCompany.addEventListener('change', () => { _cylPage = 1; applyCylFilters(); });

// Delete cylinder (LPGMC only) — delegated on the list
cylindersList.addEventListener('click', async e => {
  const btn = e.target.closest('.cyl-delete-btn');
  if (!btn) return;
  e.stopPropagation();
  const cylId = btn.dataset.id;
  if (!cylId) return;
  const cyl = _cylAllData.find(c => c.id === cylId);
  const label = cyl ? cyl.serial : cylId;
  if (!confirm(`Remove cylinder "${label}" and all its history?\nThis cannot be undone.`)) return;
  await txDelete('cylinders', cylId);
  const allEvs = await txGetAll('events');
  for (const ev of allEvs.filter(e => e.cylinderId === cylId)) {
    await txDelete('events', ev.id);
  }
  showSnackbar(`Cylinder ${label} removed.`, 'success');
  renderCylinders();
});

// Export cylinders CSV
if (exportDashboardBtn) {
  exportDashboardBtn.addEventListener('click', async () => {
    let cyls = await txGetAll('cylinders');
    if (Auth.session && Auth.session.role === 'lpgmc') {
      cyls = cyls.filter(c => c.company === Auth.session.company);
    }
    const header = 'id,serial,company,status,fillCount,manufactureDate,lastHydroTest\n';
    const rows = cyls.map(c =>
      `"${c.id}","${c.serial}","${c.company}","${c.status}","${c.fillCount}","${c.manufactureDate || ''}","${c.lastHydroTest || ''}"`
    ).join('\n');
    downloadCSV('lpg-cylinders-' + new Date().toISOString().slice(0,10) + '.csv', header + rows);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// CYLINDER PASSPORT MODAL
// ══════════════════════════════════════════════════════════════════════════════

function buildOsmEmbed(lat, lng) {
  const d = 0.018;
  return `<iframe
    src="https://www.openstreetmap.org/export/embed.html?bbox=${(lng-d).toFixed(6)},${(lat-d).toFixed(6)},${(lng+d).toFixed(6)},${(lat+d).toFixed(6)}&layer=mapnik&marker=${lat.toFixed(6)},${lng.toFixed(6)}"
    style="width:100%;height:100%;border:0;border-radius:inherit"
    loading="lazy"
    title="Location map"
  ></iframe>`;
}

function getNextActions(cyl, role) {
  const s = cyl.status;
  const validByStatus = {
    'in-refill':      ['refilled', 'shipped', 'sent-revalidation', 'inspected', 'ewura-monitored', 'tra-verified', 'tra-registered'],
    'in-circulation': ['dist-received', 'dist-sent-retail', 'ret-received', 'received-empty', 'inspected', 'ewura-monitored', 'tra-verified', 'tra-registered'],
    'in-use':         ['ret-sold', 'ret-returned-empty', 'dist-returned-empty', 'inspected', 'ewura-monitored'],
    'revalidation':   ['reval-received', 'revalidated', 'reval-returned'],
  };
  const validTypes = new Set(validByStatus[s] || []);
  return (ROLE_EVENTS[role] || []).filter(e => validTypes.has(e.type));
}

async function openPassportModal(cylId) {
  State.passportCylinderId = cylId;
  const cyl = await txGet('cylinders', cylId);
  if (!cyl) return;

  const events = await txGetIndex('events', 'cylinderId', cylId);
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Resolve last known network partner location (shown on map when not in-use)
  let passportMapPartner = null;
  if (cyl.status !== 'in-use') {
    for (const ev of events) {
      const locName = ev.location || ev.company;
      if (locName) {
        const match = DEMO_NETWORK.find(n => n.name === locName);
        if (match) { passportMapPartner = match; break; }
      }
    }
  }

  // Show alerts only if this cylinder appears in the global _alertsData list
  const _cylAlerts = _alertsData
    .filter(a => a.cylinder?.id === cyl.id)
    .map(a => ({ sev: a.severity, msg: a.title + (a.desc ? ' — ' + a.desc : '') }));

  passportBody.innerHTML = `
    ${_cylAlerts.length ? `<div class="passport-section" style="background:rgba(239,68,68,0.06);border-left:3px solid var(--amber);padding:12px 14px">
      <div class="passport-section-title" style="color:var(--amber);margin-bottom:6px">⚠ Alerts</div>
      ${_cylAlerts.map(a => `<div style="font-size:12px;color:${a.sev === 'critical' ? 'var(--red)' : 'var(--amber)'};padding:2px 0">● ${escapeHtml(a.msg)}</div>`).join('')}
    </div>` : ''}
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
      <div class="passport-row">
        <span class="passport-key">Level</span>
        <span class="passport-value">${(() => {
          if (cyl.status === 'in-use') return 'Unknown';
          const lastEv = events[0];
          const filledTypes = new Set(['refilled','shipped','dist-received','ret-received','dist-sent-retail']);
          return lastEv && filledTypes.has(lastEv.type) ? 'Filled' : 'Empty';
        })()}</span>
      </div>
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
      <div class="passport-row">
        <span class="passport-key">Net Weight</span>
        <span class="passport-value">${cyl.netWeight || cyl.capacity} kg</span>
      </div>
    </div>
    <div class="passport-section">
      <div class="passport-section-title" style="display:flex;align-items:center;justify-content:space-between">
        <span>${t('passport.eventHistory')} (${events.length})</span>
        <select id="passport-ev-sort" class="filter-select" style="font-size:11px;padding:2px 6px;height:auto">
          <option value="desc">${t('passport.sortNewest')}</option>
          <option value="asc">${t('passport.sortOldest')}</option>
        </select>
      </div>
      <ul class="passport-history" id="passport-ev-list"></ul>
      <div id="passport-ev-pagination"></div>
    </div>
    ${passportMapPartner ? `
    <div class="passport-section">
      <div class="passport-section-title">Current Location</div>
      <div style="font-size:12px;color:var(--dim);margin-bottom:8px">📍 ${escapeHtml(passportMapPartner.name)} · ${escapeHtml(passportMapPartner.city)}, ${escapeHtml(passportMapPartner.region)}</div>
      <div id="passport-location-map" style="height:200px;border-radius:var(--radius);border:1px solid var(--border);overflow:hidden"></div>
    </div>` : ''}
`;

  openModal('modal-passport');

  _passportEvPage = 1;
  _passportEvSort = 'desc';
  const _passportAllEvents = events.slice();
  renderPassportEvents(_passportAllEvents);

  const evSortSel = $('passport-ev-sort');
  if (evSortSel) {
    evSortSel.value = 'desc';
    evSortSel.addEventListener('change', () => {
      _passportEvSort = evSortSel.value;
      _passportEvPage = 1;
      renderPassportEvents(_passportAllEvents);
    });
  }

  if (passportMapPartner) {
    requestAnimationFrame(() => {
      const el = $('passport-location-map');
      if (el) el.innerHTML = buildOsmEmbed(passportMapPartner.lat, passportMapPartner.lng);
    });
  }
}

passportBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-action-type]');
  if (!btn || !Auth.session) return;
  const cylId = btn.dataset.cylId;
  const type  = btn.dataset.actionType;
  if (!cylId || !type) return;
  const cyl = await txGet('cylinders', cylId);
  if (!cyl) return;

  const extraFields = {};

  if (type === 'shipped') {
    const sel = btn.dataset.partnerSelect ? document.getElementById(btn.dataset.partnerSelect) : null;
    if (!sel || !sel.value) { showSnackbar('Select a destination partner first.', 'error'); return; }
    const partner = DEMO_NETWORK.find(n => n.name === sel.value);
    extraFields.destinedFor    = sel.value;
    extraFields.destinedRegion = partner ? partner.region : '';
  }

  if (type === 'refilled') {
    const input = btn.dataset.stampInput ? document.getElementById(btn.dataset.stampInput) : null;
    if (!input || !input.value.trim()) { showSnackbar('Enter a stamp code first.', 'error'); return; }
    extraFields.stampCode = input.value.trim();
  }

  await commitScanEvent(cyl, null, type, extraFields);
  await openPassportModal(cylId);
});

passportExportBtn.addEventListener('click', async () => {
  if (!State.passportCylinderId) return;
  const cyl = await txGet('cylinders', State.passportCylinderId);
  if (!cyl) return;
  const events = await txGetIndex('events', 'cylinderId', cyl.id);
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  function csvCell(v) {
    const s = String(v == null ? '' : v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  const rows = [];
  rows.push(['Field', 'Value']);
  rows.push(['CylinderID', cyl.id]);
  rows.push(['Serial', cyl.serial]);
  rows.push(['Size', cyl.size || '']);
  rows.push(['Company', cyl.company || '']);
  rows.push(['Status', cyl.status || '']);
  rows.push(['FillCount', cyl.fillCount || 0]);
  rows.push(['LastHydroTest', cyl.lastHydroTest || '']);
  rows.push([]);
  rows.push(['EventNum', 'Type', 'Date', 'By', 'Notes']);
  events.forEach((ev, i) => rows.push([i + 1, ev.type, ev.timestamp, ev.operatorId || ev.company || '', ev.notes || '']));

  const csv = rows.map(r => r.map(csvCell).join(',')).join('\r\n');
  const today = new Date().toISOString().slice(0, 10);
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `audit-trail-${cyl.serial}-${today}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showSnackbar(t('audit.exported'), 'success');
});

// ══════════════════════════════════════════════════════════════════════════════
// ALERTS VIEW
// ══════════════════════════════════════════════════════════════════════════════

let _alertsData = [];

async function renderAlerts() {
  let cyls = await txGetAll('cylinders');
  // Fetch events once; build index by cylinderId (sorted ascending by timestamp)
  const allEvents = await txGetAll('events');
  const evsByCyl = {};
  for (const ev of allEvents) {
    (evsByCyl[ev.cylinderId] || (evsByCyl[ev.cylinderId] = [])).push(ev);
  }
  for (const id of Object.keys(evsByCyl)) {
    evsByCyl[id].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
  }

  const alertRole = Auth.session?.role;
  if (alertRole === 'lpgmc') {
    cyls = cyls.filter(c => c.company === Auth.session.company);
  } else if (alertRole === 'distributor' || alertRole === 'retailer') {
    const partnerName = Auth.session.company;
    cyls = cyls.filter(c => {
      const evs = evsByCyl[c.id];
      if (!evs || !evs.length) return false;
      const last = evs[evs.length - 1];
      return (last.location || last.company || '') === partnerName;
    });
  }

  const now = new Date();
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
      }
    }

    const cylEvents = evsByCyl[cyl.id] || [];

    // 2. Misplaced cylinder: shipped to X but received at Y
    for (let i = cylEvents.length - 1; i >= 0; i--) {
      const ev = cylEvents[i];
      if (ev.type === 'shipped' && ev.destinedFor) {
        const recvEv = cylEvents.slice(i + 1).find(e =>
          e.type === 'dist-received' || e.type === 'ret-received'
        );
        if (recvEv && recvEv.company && recvEv.company !== ev.destinedFor) {
          _alertsData.push({
            severity: 'critical', type: 'misplaced', cylinder: cyl,
            title: `${cyl.serial} — Misplaced Cylinder`,
            desc: `Shipped to "${ev.destinedFor}" but received by "${recvEv.company}".`,
          });
        }
        break;
      }
    }

    // 3. Unreported: no movement reported in 90+ days
    if (cyl.status === 'in-circulation' && cylEvents.length) {
      const lastEv = cylEvents[cylEvents.length - 1];
      const days = Math.floor((now - new Date(lastEv.timestamp)) / 86400000);
      if (days > 90) {
        _alertsData.push({ severity:'warning', type:'stuck-in-circulation', cylinder:cyl,
          title: `${cyl.serial} — Unreported (${days}d)`,
          desc: `Cylinder has been in circulation for ${days} days without a movement report.` });
      }
    }
  }

  buildCylLocations(cyls, allEvents);

  // Shortage / Surplus stock alerts — reuse already-loaded data
  const stockRole = Auth.session?.role;
  if (stockRole === 'distributor' || stockRole === 'lpgmc') {
    if (stockRole === 'distributor') {
      // cyls is already filtered to this distributor's cylinders above
      const company = Auth.session.company;
      const total = cyls.length;
      if (total < 15) {
        _alertsData.unshift({ severity:'warning', type:'stock-shortage', cylinder:{ id:'stock-shortage', serial:'Stock', company, status:'in-circulation' },
          title:`${t('alert.stockShortage')} — only ${total} cylinders at ${company}`,
          desc:`Current stock is below the minimum threshold of 15 cylinders. Consider placing a replenishment order.` });
      } else if (total > 120) {
        _alertsData.unshift({ severity:'info', type:'stock-surplus', cylinder:{ id:'stock-surplus', serial:'Stock', company, status:'in-circulation' },
          title:`${t('alert.stockSurplus')} — ${total} cylinders at ${company}`,
          desc:`Current stock exceeds 120 cylinders. Consider redistributing to other network partners.` });
      }
    } else if (stockRole === 'lpgmc') {
      const company = Auth.session.company;
      const inRefill = cyls.filter(c => c.status === 'in-refill').length;
      if (inRefill < 30) {
        _alertsData.unshift({ severity:'warning', type:'stock-shortage', cylinder:{ id:'stock-inrefill', serial:'In-Refill', company, status:'in-refill' },
          title:`${t('alert.stockShortage')} — only ${inRefill} cylinders in refill at ${company}`,
          desc:`In-refill inventory is below the minimum threshold of 30 cylinders.` });
      }
    }
  }

  // Counterfeit reports for EWURA
  if (Auth.session?.role === 'ewura') {
    const reports = JSON.parse(localStorage.getItem('lpg-counterfeits') || '[]');
    reports.slice().reverse().forEach(r => {
      _alertsData.unshift({ severity:'critical', type:'counterfeit', cylinder:{ id:r.tagId, serial:r.tagId, company:r.reportedBy || 'Unknown', status:'in-circulation' },
        title:`${t('alert.counterfeit')} — Tag ${r.tagId}`,
        desc:`Unregistered cylinder reported by ${r.reportedBy || 'unknown'} (${r.role || ''}) on ${r.timestamp ? r.timestamp.slice(0,10) : ''}` });
    });
  }

  // Recall alerts — surface for all roles whose cylinders match a recall batch
  const recalls = JSON.parse(localStorage.getItem('lpg-recalls') || '[]');
  if (recalls.length) {
    const existingIds = new Set(_alertsData.filter(a => a.type === 'recall').map(a => a.cylinder?.id));
    cyls.forEach(cyl => {
      if (existingIds.has(cyl.id)) return;
      const matched = recalls.find(r =>
        r.operator === cyl.company &&
        (!cyl.manufactureDate || (cyl.manufactureDate >= r.dateFrom && cyl.manufactureDate <= r.dateTo))
      );
      if (matched) {
        _alertsData.unshift({
          severity:'critical', type:'recall', cylinder: cyl,
          title:`${t('alert.recall')} — ${escapeHtml(cyl.serial)}`,
          desc:`${escapeHtml(matched.operator)} recall issued by EWURA. Reason: ${escapeHtml(matched.reason)}. Recall ID: ${escapeHtml(matched.id)}`
        });
      }
    });
  }

  applyAlertFilters();
  requestAnimationFrame(() => renderAlertsMap());
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
  if (!data.length) {
    alertsEmpty.style.display = '';
    renderPagination('alert-pagination', 0, 1, PAGE_SIZE_ALERTS, () => {});
    return;
  }
  alertsEmpty.style.display = 'none';

  const totalAlerts = data.length;
  _alertPage = Math.min(_alertPage, Math.ceil(totalAlerts / PAGE_SIZE_ALERTS));
  const pageAlerts = data.slice((_alertPage - 1) * PAGE_SIZE_ALERTS, _alertPage * PAGE_SIZE_ALERTS);

  const statLabelMap = {
    'in-refill': t('status.inRefill'), 'in-circulation': t('status.inCirc'),
    'revalidation': t('status.inReval'), 'in-use': t('status.inUse'),
  };
  pageAlerts.forEach(al => {
    const cyl = al.cylinder;
    const statClass = 'status-' + (cyl.status || 'in-refill');
    const statLabel = statLabelMap[cyl.status] || cyl.status;
    const locData   = cyl.status !== 'in-use' ? _cylLocations[cyl.id] : null;
    const locLine   = locData
      ? `<span class="cylinder-meta-item">📍 ${[locData.region, locData.location].filter(Boolean).map(escapeHtml).join(' · ')}</span>`
      : '';

    const li = document.createElement('li');
    li.className = 'alert-item';
    li.innerHTML = `
      <div class="alert-severity-bar sev-${escapeHtml(al.severity)}"></div>
      <div class="alert-body">
        <div class="alert-title">${escapeHtml(al.title)}</div>
        <div class="alert-desc">${escapeHtml(al.desc)}</div>
        <div class="alert-meta">${escapeHtml(cyl.company)} · ${locLine}</div>
      </div>
      <div class="cylinder-badges">
        <span class="status-badge ${escapeHtml(statClass)}">${escapeHtml(statLabel)}</span>
      </div>`;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => openPassportModal(cyl.id));
    alertsList.appendChild(li);
  });

  renderPagination('alert-pagination', totalAlerts, _alertPage, PAGE_SIZE_ALERTS, (p) => {
    _alertPage = p;
    applyAlertFilters();
  });
}

alertFilterSeverity.addEventListener('change', () => { _alertPage = 1; applyAlertFilters(); });
alertFilterType.addEventListener('change',     () => { _alertPage = 1; applyAlertFilters(); });

// Alert map is now always shown inline above the list (no tab toggle needed)

const REGION_CENTROIDS = {
  'Dar es Salaam': [-6.7924, 39.2083], 'Arusha': [-3.3869, 36.6830],
  'Mwanza': [-2.5164, 32.9175], 'Dodoma': [-6.1722, 35.7395],
  'Mbeya': [-8.9094, 33.4608], 'Tanga': [-5.0690, 39.0997],
  'Kilimanjaro': [-3.3333, 37.3333], 'Morogoro': [-6.8241, 37.6595],
  'Tabora': [-5.0233, 32.7984], 'Shinyanga': [-3.6605, 33.4199],
  'Iringa': [-7.7676, 35.6938], 'Zanzibar': [-6.1367, 39.3497],
};

// ── Interactive map (Leaflet + OpenStreetMap) ──────────────────────────────
const _leafletMaps = new Map(); // mapId → L.map instance

function _lngLatToImap(lat, lng) {
  return [
    Math.round((lng - 29.0) / 12.0 * 600 * 10) / 10,
    Math.round((-0.5 - lat) / 11.2 * 440 * 10) / 10,
  ];
}

function buildInteractiveMap(mapId, markers, legend, height) {
  const legendHtml = (legend || []).map(l =>
    `<span class="imap-legend-item"><span class="imap-legend-dot" style="background:${l.color}"></span>${escapeHtml(l.label)}</span>`
  ).join('');
  const count = markers ? markers.length : 0;
  const h = height || 380;
  return `<div class="imap-container" id="${mapId}_imap">
    <div class="imap-toolbar">
      <div class="imap-legend-row">${legendHtml}</div>
      <span class="imap-hint">${count} location${count !== 1 ? 's' : ''} · Click marker for details</span>
    </div>
    <div id="${mapId}_lmap" style="height:${h}px;width:100%"></div>
  </div>`;
}

function initInteractiveMap(mapId, markers) {
  const el = document.getElementById(`${mapId}_lmap`);
  if (!el) return;

  // If Leaflet CDN/bundle hasn't loaded yet, retry once it does
  if (typeof L === 'undefined') {
    const script = document.querySelector('script[src*="leaflet"]');
    if (script) {
      script.addEventListener('load', () => initInteractiveMap(mapId, markers), { once: true });
    } else {
      el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:13px">Map requires an internet connection to load.</div>';
    }
    return;
  }

  // Destroy previous instance if view was re-rendered
  const prev = _leafletMaps.get(mapId);
  if (prev) { prev.remove(); _leafletMaps.delete(mapId); }

  const map = L.map(`${mapId}_lmap`, { zoomControl: true, attributionControl: true });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const latlngs = [];
  (markers || []).forEach(m => {
    if (m.lat == null || m.lng == null) return;
    latlngs.push([m.lat, m.lng]);
    const fill  = m.color || '#3b82f6';
    const r     = m.big ? 13 : 9;
    const circle = L.circleMarker([m.lat, m.lng], {
      radius: r,
      fillColor: fill,
      color: 'white',
      weight: 2.5,
      opacity: 1,
      fillOpacity: 0.92
    }).addTo(map);

    const popupContent = m.detailHtml ||
      `<div style="min-width:160px"><strong>${escapeHtml(m.label || '')}</strong></div>`;
    circle.bindPopup(popupContent, { maxWidth: 320, className: 'imap-popup' });

    if (m.label) circle.bindTooltip(escapeHtml(m.label), { direction: 'top', offset: [0, -r] });

    if (m.pulse) {
      const ring = L.circleMarker([m.lat, m.lng], {
        radius: r + 10,
        fillColor: 'transparent',
        color: fill,
        weight: 2,
        opacity: 0.5,
        className: 'imap-pulse-ring'
      }).addTo(map);
    }
  });

  if (latlngs.length > 1) {
    map.fitBounds(latlngs, { padding: [40, 40], maxZoom: 10 });
  } else if (latlngs.length === 1) {
    map.setView(latlngs[0], 9);
  } else {
    map.setView([-6.5, 35.0], 5);
  }

  _leafletMaps.set(mapId, map);
}

function _resolveAlertLatLng(al) {
  const cyl = al.cylinder;
  let lat = -6.5, lng = 35.5;
  if (cyl) {
    const netEntry = DEMO_NETWORK.find(n => n.name === cyl.company);
    if (netEntry) { lat = netEntry.lat; lng = netEntry.lng; }
    else {
      const lpgmcInfo = DEMO_LPGMC_INFO && DEMO_LPGMC_INFO[cyl.company];
      if (lpgmcInfo) { lat = lpgmcInfo.lat; lng = lpgmcInfo.lng; }
      else {
        const locData = _cylLocations && _cylLocations[cyl.id];
        const region  = locData ? locData.region : null;
        const c       = region ? REGION_CENTROIDS[region] : null;
        if (c) { lat = c[0]; lng = c[1]; }
      }
    }
  }
  return [lat + (Math.random() - 0.5) * 0.3, lng + (Math.random() - 0.5) * 0.3];
}

function renderAlertsMap() {
  const mapEl = $('alert-map');
  if (!mapEl) return;

  if (!_alertsData.length) {
    mapEl.innerHTML = `<p style="color:var(--muted);padding:8px 0;font-size:13px">${t('msg.noActiveAlerts')}</p>`;
    return;
  }

  const markers = _alertsData.map(al => {
    const [lat, lng] = _resolveAlertLatLng(al);
    const isCrit = al.severity === 'critical';
    return { lat, lng, color: isCrit ? '#dc2626' : '#f59e0b', pulse: isCrit,
      tooltip: al.title, label: isCrit ? '!' : '⚠' };
  });
  const legend = [{ color:'#dc2626', label:'Critical' }, { color:'#f59e0b', label:'Warning' }];
  mapEl.innerHTML = buildInteractiveMap('alertmap', markers, legend, 280);
  initInteractiveMap('alertmap', markers);
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORTS / DASHBOARD VIEW
// ══════════════════════════════════════════════════════════════════════════════

function renderPartnerSalesChart(events, partnerEntry, yearSel) {
  const reportChart = $('report-chart');
  if (!reportChart) return;
  const year = yearSel ? parseInt(yearSel.value) : new Date().getFullYear();
  const partnerName = partnerEntry ? partnerEntry.name : '';
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const counts = Array(12).fill(0);
  events.filter(ev => {
    if (ev.type !== 'ret-sold') return false;
    if (partnerName && (ev.company || ev.location) !== partnerName) return false;
    const d = new Date(ev.timestamp);
    return d.getFullYear() === year;
  }).forEach(ev => { counts[new Date(ev.timestamp).getMonth()]++; });
  const maxC = Math.max(...counts, 1);
  reportChart.innerHTML = `<div class="v-chart" style="height:120px;padding-bottom:20px">
    ${counts.map((c, i) => {
      const pct = Math.round((c / maxC) * 100);
      return `<div class="v-chart-col">
        <div class="v-chart-bar-wrap">
          <div class="v-chart-bar" style="height:${pct}%;background:var(--blue)">
            ${c ? `<span class="v-chart-val">${c}</span>` : ''}
          </div>
        </div>
        <div class="v-chart-label">${MONTH_NAMES[i]}</div>
      </div>`;
    }).join('')}
  </div>`;
}

async function renderReports() {
  let cyls   = await txGetAll('cylinders');
  let events = await txGetAll('events');
  const role = Auth.session ? Auth.session.role : null;
  const actSec = $('report-activity-section');

  if (role === 'lpgmc' || role === 'ewura') {
    // Reset sales year selector (only used by dist/retailer)
    const salesYearSelR = $('report-sales-year');
    if (salesYearSelR) salesYearSelR.style.display = 'none';
    const actTitleElR = $('report-activity-title');
    if (actTitleElR) actTitleElR.textContent = t('dash.activityTitle');

    // For lpgmc: filter to own company. For ewura: use all cylinders.
    if (role === 'lpgmc') {
      cyls = cyls.filter(c => c.company === Auth.session.company);
      const ownIds = new Set(cyls.map(c => c.id));
      events = events.filter(e => ownIds.has(e.cylinderId));
    }
    // ewura: no filter, sees all companies

    const inRefill       = cyls.filter(c => c.status === 'in-refill').length;
    const inCirculation  = cyls.filter(c => c.status === 'in-circulation').length;
    const inRevalidation = cyls.filter(c => c.status === 'revalidation').length;
    const inUse          = cyls.filter(c => c.status === 'in-use').length;
    const total          = inRefill + inCirculation + inRevalidation + inUse;

    // Compute full/empty breakdown from actual events for both in-refill and in-circulation
    const REFILL_FULL_EV = new Set(['refilled']);
    const REFILL_EMPTY_EV = new Set(['received-empty', 'registered']);
    const CIRC_FULL_EV   = new Set(['shipped', 'dist-received', 'dist-sent-retail', 'ret-received']);
    const CIRC_EMPTY_EV  = new Set(['ret-returned-empty', 'dist-returned-empty']);

    // Build a map of last-event-type per cylinder for quick lookup
    const lastEvType = {};
    const sortedEvs = events.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    sortedEvs.forEach(e => { lastEvType[e.cylinderId] = e.type; });

    let refillFull = 0, refillEmpty = 0;
    cyls.filter(c => c.status === 'in-refill').forEach(c => {
      const evType = lastEvType[c.id];
      if (REFILL_FULL_EV.has(evType))  refillFull++;
      else                              refillEmpty++;
    });

    let circFull = 0, circEmpty = 0;
    cyls.filter(c => c.status === 'in-circulation').forEach(c => {
      const evType = lastEvType[c.id];
      if (CIRC_FULL_EV.has(evType))        circFull++;
      else if (CIRC_EMPTY_EV.has(evType))  circEmpty++;
    });

    const refillerCount  = LPGMC_COMPANIES.length;
    const distCount      = DEMO_NETWORK.filter(n => n.type === 'Distributor' && n.status === 'active').length;
    const retailCount    = DEMO_NETWORK.filter(n => n.type === 'Retailer'    && n.status === 'active').length;
    const distTotal      = DEMO_NETWORK.filter(n => n.type === 'Distributor').length;
    const retailTotal    = DEMO_NETWORK.filter(n => n.type === 'Retailer').length;
    const distInactive   = distTotal - distCount;
    const retailInactive = retailTotal - retailCount;

    // Refill Cycle Time: avg days from received-empty → next refilled
    const cylEventsMap = {};
    events.forEach(ev => {
      if (!cylEventsMap[ev.cylinderId]) cylEventsMap[ev.cylinderId] = [];
      cylEventsMap[ev.cylinderId].push(ev);
    });
    const refillCycleDays = [];
    Object.values(cylEventsMap).forEach(evs => {
      const sorted = evs.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      sorted.forEach((ev, i) => {
        if (ev.type === 'received-empty') {
          const nextRefill = sorted.slice(i + 1).find(e => e.type === 'refilled');
          if (nextRefill) {
            const days = (new Date(nextRefill.timestamp) - new Date(ev.timestamp)) / 86400000;
            if (days > 0 && days < 365) refillCycleDays.push(days);
          }
        }
      });
    });
    const avgRefillCycle = refillCycleDays.length
      ? Math.round(refillCycleDays.reduce((a, b) => a + b, 0) / refillCycleDays.length)
      : 0;

    // Utilisation: (in-use + in-circulation) / total
    const activeCyls = inUse + (circFull + circEmpty);
    const utilisationRate = total > 0 ? Math.round((activeCyls / total) * 100) : 0;

    // Alerts — compute inline per type
    const now = new Date();
    let alertRequalOverdue = 0, alertStuck = 0, alertMisplaced = 0;
    // Pre-index events by cylinderId (sorted ascending) to avoid O(N×M) scans
    const _evsByCylR = {};
    for (const ev of events) {
      (_evsByCylR[ev.cylinderId] || (_evsByCylR[ev.cylinderId] = [])).push(ev);
    }
    for (const id of Object.keys(_evsByCylR)) {
      _evsByCylR[id].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
    }
    cyls.forEach(cyl => {
      const baseDate = cyl.lastRequalDate || cyl.manufactureDate;
      if (baseDate) {
        const due = new Date(baseDate + 'T00:00:00');
        due.setFullYear(due.getFullYear() + 10);
        if (due < now) alertRequalOverdue++;
      }
      if (cyl.status === 'in-circulation') {
        const cylEvs = _evsByCylR[cyl.id];
        if (cylEvs && cylEvs.length) {
          const days = Math.floor((now - new Date(cylEvs[cylEvs.length - 1].timestamp)) / 86400000);
          if (days > 90) alertStuck++;
        }
      }
    });
    // Misplaced: shipped to X received by Y — walk each cylinder's sorted events once
    for (const [cylId, cylEvs] of Object.entries(_evsByCylR)) {
      for (let i = cylEvs.length - 1; i >= 0; i--) {
        const ev = cylEvs[i];
        if (ev.type === 'shipped' && ev.destinedFor) {
          const recvEv = cylEvs.slice(i + 1).find(e => e.type === 'dist-received' || e.type === 'ret-received');
          if (recvEv && recvEv.company && recvEv.company !== ev.destinedFor) alertMisplaced++;
          break;
        }
      }
    }

    const totalAlerts = alertRequalOverdue + alertStuck + alertMisplaced;

    reportsGrid.innerHTML = `
      <div class="dashboard-section-title">${t('dash.lifecycle')}</div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--green)">${inRefill}</span>
        <div class="report-card-label">${t('kpi.inrefill')}</div>
        <div class="report-card-sub">
          <span style="color:var(--green);font-size:11px">🧯 ${refillFull} ${t('kpi.filled')}</span>
          &nbsp;·&nbsp;
          <span style="color:var(--muted);font-size:11px">📭 ${refillEmpty} ${t('kpi.empty')}</span>
        </div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--blue)">${circFull + circEmpty}</span>
        <div class="report-card-label">${t('kpi.incirc')}</div>
        <div class="report-card-sub">
          <span style="color:var(--green);font-size:11px">🧯 ${circFull} ${t('kpi.full')}</span>
          &nbsp;·&nbsp;
          <span style="color:var(--muted);font-size:11px">📭 ${circEmpty} ${t('kpi.empty')}</span>
        </div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--teal)">${inRevalidation}</span>
        <div class="report-card-label">${t('kpi.inreval')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--purple)">${inUse}</span>
        <div class="report-card-label">${t('kpi.inuse')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value">${total}</span>
        <div class="report-card-label">${t('kpi.total')}</div>
      </div>
      <div class="dashboard-section-title">${t('dash.alerts')}</div>
      <div class="report-card" style="border-color:${alertRequalOverdue > 0 ? 'var(--red)' : 'var(--surface-3)'}">
        <span class="report-card-value" style="color:${alertRequalOverdue > 0 ? 'var(--red)' : 'var(--green)'}">${alertRequalOverdue}</span>
        <div class="report-card-label">${t('alert.requalOverdue')}</div>
      </div>
      <div class="report-card" style="border-color:${alertStuck > 0 ? 'var(--amber)' : 'var(--surface-3)'}">
        <span class="report-card-value" style="color:${alertStuck > 0 ? 'var(--amber)' : 'var(--green)'}">${alertStuck}</span>
        <div class="report-card-label">${t('alert.stuck')}</div>
      </div>
      <div class="report-card" style="border-color:${alertMisplaced > 0 ? 'var(--red)' : 'var(--surface-3)'}">
        <span class="report-card-value" style="color:${alertMisplaced > 0 ? 'var(--red)' : 'var(--green)'}">${alertMisplaced}</span>
        <div class="report-card-label">${t('alert.misplaced')}</div>
      </div>
      <div class="report-card" style="border-color:${totalAlerts > 0 ? 'var(--amber)' : 'var(--surface-3)'}">
        <span class="report-card-value" style="color:${totalAlerts > 0 ? 'var(--amber)' : 'var(--green)'}">${totalAlerts}</span>
        <div class="report-card-label">${t('dash.totalAlerts')}</div>
      </div>
      <div class="dashboard-section-title">${t('dash.supplychain')}</div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--blue)">${refillerCount}</span>
        <div class="report-card-label">${t('dash.refillingSites')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--amber)">${distCount}</span>
        <div class="report-card-label">${t('kpi.distributors')}</div>
        <div class="report-card-sub" style="font-size:11px;color:var(--muted)">${distCount} ${t('status.active')} · ${distInactive} ${t('status.inactive')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--purple)">${retailCount}</span>
        <div class="report-card-label">${t('kpi.retailers')}</div>
        <div class="report-card-sub" style="font-size:11px;color:var(--muted)">${retailCount} ${t('status.active')} · ${retailInactive} ${t('status.inactive')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--teal)">${avgRefillCycle}</span>
        <div class="report-card-label">${t('dash.avgRefillCycle')}</div>
        <div class="report-card-sub" style="font-size:11px;color:var(--muted)">${t('dash.daysLabel')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--blue)">${utilisationRate}%</span>
        <div class="report-card-label">${t('dash.utilisationRate')}</div>
        <div class="report-card-sub" style="font-size:11px;color:var(--muted)">${t('dash.utilLabel')}</div>
      </div>
      ${role === 'ewura' ? (() => {
        const INSP_TYPES_D = new Set(['inspected','ewura-monitored']);
        const inspEvsD = events.filter(e => INSP_TYPES_D.has(e.type));
        const inspCompD = inspEvsD.filter(e => e.compliant !== false).length;
        const inspRateD = inspEvsD.length ? Math.round(inspCompD / inspEvsD.length * 100) : 0;
        return `<div class="report-card">
          <span class="report-card-value" style="color:${inspRateD >= 80 ? 'var(--green)' : inspRateD >= 60 ? 'var(--amber)' : 'var(--red)'}">${inspRateD}%</span>
          <div class="report-card-label">${t('dash.marketCompliance')}</div>
          <div class="report-card-sub" style="font-size:11px;color:var(--muted)">${t('mgmt.complianceRate')}</div>
        </div>`;
      })() : ''}
      `;

    // Both lpgmc and ewura: hide activity section
    reportChart.innerHTML = '';
    if (actSec) actSec.style.display = 'none';
  } else if (role === 'distributor' || role === 'retailer') {
    const partnerEntry = DEMO_NETWORK.find(n => n.name === Auth.session.company);
    const CIRC_FULL_TYPES  = new Set(['shipped', 'dist-received', 'dist-sent-retail', 'ret-received']);
    const CIRC_EMPTY_TYPES = new Set(['ret-returned-empty', 'dist-returned-empty']);
    const lastEvByTypeP = {};
    events.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .forEach(ev => { lastEvByTypeP[ev.cylinderId] = ev; });

    let partnerTotal = 0, partnerFull = 0, partnerEmpty = 0;
    const partnerCylIds = new Set();
    if (partnerEntry) {
      cyls.filter(c => c.status === 'in-circulation').forEach(c => {
        const ev = lastEvByTypeP[c.id];
        if (!ev) return;
        const loc = ev.location || ev.company || '';
        if (loc !== partnerEntry.name) return;
        partnerTotal++;
        partnerCylIds.add(c.id);
        if (CIRC_FULL_TYPES.has(ev.type))       partnerFull++;
        else if (CIRC_EMPTY_TYPES.has(ev.type)) partnerEmpty++;
      });
    }

    // Alerts for assigned cylinders only
    const pNow = new Date();
    let pAlertCrit = 0;
    cyls.filter(c => partnerCylIds.has(c.id)).forEach(cyl => {
      const baseDate = cyl.lastRequalDate || cyl.manufactureDate;
      if (baseDate) {
        const due = new Date(baseDate + 'T00:00:00');
        due.setFullYear(due.getFullYear() + 10);
        const days = Math.floor((due - pNow) / 86400000);
        if (days <= 0) pAlertCrit++;
      }
    });
    const pAlertTotal = pAlertCrit;

    reportsGrid.innerHTML = `
      <div class="dashboard-section-title">${t('kpi.cylsInStock')}</div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--amber)">${partnerTotal}</span>
        <div class="report-card-label">${t('kpi.total')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--green)">${partnerFull}</span>
        <div class="report-card-label">${t('kpi.full')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--muted)">${partnerEmpty}</span>
        <div class="report-card-label">${t('kpi.empty')}</div>
      </div>
      <div class="dashboard-section-title">${t('dash.alerts')}</div>
      <div class="report-card" style="border-color:${pAlertCrit > 0 ? 'var(--red)' : 'var(--surface-3)'}">
        <span class="report-card-value" style="color:${pAlertCrit > 0 ? 'var(--red)' : 'var(--green)'}">${pAlertCrit}</span>
        <div class="report-card-label">${t('alert.requalOverdue')}</div>
      </div>
      <div class="report-card" style="border-color:${pAlertTotal > 0 ? 'var(--amber)' : 'var(--surface-3)'}">
        <span class="report-card-value" style="color:${pAlertTotal > 0 ? 'var(--amber)' : 'var(--green)'}">${pAlertTotal}</span>
        <div class="report-card-label">${t('dash.totalAlerts')}</div>
      </div>`;

    // Sales by Month chart hidden
    if (actSec) actSec.style.display = 'none';
    const actTitleEl = $('report-activity-title');
    if (actTitleEl) actTitleEl.textContent = t('dash.salesByMonth');

    const salesYearSel = $('report-sales-year');
    if (salesYearSel) {
      salesYearSel.style.display = '';
      const salesYears = new Set();
      events.forEach(ev => { if (ev.type === 'ret-sold') salesYears.add(new Date(ev.timestamp).getFullYear()); });
      const curYear = new Date().getFullYear();
      salesYears.add(curYear);
      if (salesYearSel.children.length === 0 || salesYearSel.dataset.role !== role) {
        salesYearSel.innerHTML = '';
        salesYearSel.dataset.role = role;
        [...salesYears].sort((a, b) => b - a).forEach(y => {
          const o = document.createElement('option');
          o.value = y; o.textContent = y;
          salesYearSel.appendChild(o);
        });
        salesYearSel.value = curYear;
        salesYearSel.onchange = () => renderPartnerSalesChart(events, partnerEntry, salesYearSel);
      }
      renderPartnerSalesChart(events, partnerEntry, salesYearSel);
    }
  } else {
    if (actSec) actSec.style.display = 'none';

    const total    = cyls.length;
    const inRefill = cyls.filter(c => c.status === 'in-refill').length;
    const inCirc   = cyls.filter(c => c.status === 'in-circulation').length;
    const inUse    = cyls.filter(c => c.status === 'in-use').length;

    reportsGrid.innerHTML = `
      <div class="report-card">
        <span class="report-card-value">${total}</span>
        <div class="report-card-label">${t('kpi.total')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--green)">${inRefill}</span>
        <div class="report-card-label">${t('kpi.inrefill')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--blue)">${inCirc}</span>
        <div class="report-card-label">${t('kpi.incirc')}</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--purple)">${inUse}</span>
        <div class="report-card-label">${t('kpi.inuse')}</div>
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
      }).join('') || `<p style="padding:16px 0;color:var(--dim);font-size:13px">${t('dash.noActivity')}</p>`;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// NETWORK VIEW
// ══════════════════════════════════════════════════════════════════════════════

async function renderNetwork() {
  const networkList  = $('network-list');
  const networkEmpty = $('network-empty');

  const typeFilter   = $('net-filter-type')   ? $('net-filter-type').value   : '';
  const statusFilter = $('net-filter-status') ? $('net-filter-status').value : '';
  const filtered = DEMO_NETWORK.filter(n =>
    (!typeFilter   || n.type   === typeFilter) &&
    (!statusFilter || n.status === statusFilter)
  );

  // Build per-partner full/empty counts from actual cylinder events
  const [allCyls, allEvs] = await Promise.all([txGetAll('cylinders'), txGetAll('events')]);
  const CIRC_FULL_TYPES  = new Set(['shipped', 'dist-received', 'dist-sent-retail', 'ret-received']);
  const CIRC_EMPTY_TYPES = new Set(['ret-returned-empty', 'dist-returned-empty']);

  const lastEvByType = {};
  allEvs.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .forEach(ev => { lastEvByType[ev.cylinderId] = ev; });

  const partnerCounts = {};
  allCyls.filter(c => c.status === 'in-circulation').forEach(c => {
    const ev = lastEvByType[c.id];
    if (!ev) return;
    const loc = ev.location || ev.company || '';
    if (!loc) return;
    if (!partnerCounts[loc]) partnerCounts[loc] = { total: 0, full: 0, empty: 0 };
    partnerCounts[loc].total++;
    if (CIRC_FULL_TYPES.has(ev.type))       partnerCounts[loc].full++;
    else if (CIRC_EMPTY_TYPES.has(ev.type)) partnerCounts[loc].empty++;
  });

  // ── Sort ─────────────────────────────────────────────────────────────────
  const sortVal = $('net-sort') ? $('net-sort').value : '';
  const sorted = filtered.slice().sort((a, b) => {
    const ca = partnerCounts[a.name] || { total:0, full:0, empty:0 };
    const cb = partnerCounts[b.name] || { total:0, full:0, empty:0 };
    if (sortVal === 'stock-desc') return cb.total - ca.total;
    if (sortVal === 'stock-asc')  return ca.total - cb.total;
    if (sortVal === 'full-desc')  return cb.full  - ca.full;
    if (sortVal === 'empty-desc') return cb.empty - ca.empty;
    return a.name.localeCompare(b.name);
  });

  // ── Render list with pagination ──────────────────────────────────────────
  networkList.innerHTML = '';
  if (!sorted.length) {
    networkEmpty.style.display = '';
    renderPagination('net-pagination', 0, 1, PAGE_SIZE_NETWORK, () => {});
    return;
  }
  networkEmpty.style.display = 'none';
  _netPage = Math.min(_netPage, Math.ceil(sorted.length / PAGE_SIZE_NETWORK));
  const pageNet = sorted.slice((_netPage - 1) * PAGE_SIZE_NETWORK, _netPage * PAGE_SIZE_NETWORK);

  pageNet.forEach(partner => {
    const counts = partnerCounts[partner.name] || { total: 0, full: 0, empty: 0 };
    const li = document.createElement('li');
    li.className = 'network-item';
    li.style.cursor = 'pointer';
    li.dataset.id = partner.id;
    const typeClass = 'type-' + partner.type.toLowerCase();
    li.innerHTML = `
      <div class="network-item-header">
        <span class="network-item-name">${escapeHtml(partner.name)}</span>
        <div class="network-item-badges">
          <span class="network-type-badge ${escapeHtml(typeClass)}">${escapeHtml(partner.type)}</span>
          <span class="network-status-${escapeHtml(partner.status)}">${escapeHtml(partner.status)}</span>
        </div>
      </div>
      <div class="network-item-meta">
        📍 ${escapeHtml(partner.city)} · ${escapeHtml(partner.address)}<br>
        📞 ${escapeHtml(partner.contact)} ·
        <span class="network-item-cyls">🔥 ${counts.total} total · <span class="cyl-full">🧯 ${counts.full} full</span> · <span class="cyl-empty">📭 ${counts.empty} empty</span></span>
      </div>`;
    networkList.appendChild(li);
  });

  renderPagination('net-pagination', sorted.length, _netPage, PAGE_SIZE_NETWORK, (p) => {
    _netPage = p;
    renderNetwork();
  });

  const netMapEl = $('network-map');
  if (netMapEl) {
    const netMarkers = DEMO_NETWORK.map(n => ({
      lat: n.lat, lng: n.lng,
      color: n.type === 'Distributor' ? '#3b82f6' : '#22c55e',
      pulse: n.status === 'inactive',
      tooltip: `${n.name} · ${n.type} · ${n.city}`,
    }));
    const netLegend = [{ color:'#3b82f6', label:'Distributor' }, { color:'#22c55e', label:'Retailer' }];
    netMapEl.innerHTML = buildInteractiveMap('netmap', netMarkers, netLegend, 300);
    initInteractiveMap('netmap', netMarkers);
  }
}

// Network filters — type dropdown + status dropdown + sort
const netFilterType   = $('net-filter-type');
const netFilterStatus = $('net-filter-status');
const netSort         = $('net-sort');
if (netFilterType)   netFilterType.addEventListener('change',   () => { _netPage = 1; renderNetwork(); });
if (netFilterStatus) netFilterStatus.addEventListener('change', () => { _netPage = 1; renderNetwork(); });
if (netSort)         netSort.addEventListener('change',         () => { _netPage = 1; renderNetwork(); });

// Network item click → open partner modal
$('network-list').addEventListener('click', e => {
  const item = e.target.closest('.network-item');
  if (item) openPartnerModal(item.dataset.id);
});

let _partnerDetailMap = null;
let _partnerDetailMarker = null;

async function openPartnerModal(partnerId) {
  const partner = DEMO_NETWORK.find(n => n.id === partnerId);
  if (!partner) return;

  $('partner-modal-name').textContent          = partner.name;
  $('partner-modal-region').textContent        = partner.region;
  $('partner-modal-city').textContent          = partner.city;
  $('partner-modal-address').textContent       = partner.address;
  $('partner-modal-contact').textContent       = partner.contact;
  $('partner-modal-contact-person').textContent = partner.contactPerson || '—';
  $('partner-modal-coords').textContent        = `${partner.lat.toFixed(4)}, ${partner.lng.toFixed(4)}`;

  const typeBadge = $('partner-modal-type-badge');
  typeBadge.textContent  = partner.type;
  typeBadge.className    = 'network-type-badge type-' + partner.type.toLowerCase();

  const statusEl = $('partner-modal-status');
  statusEl.textContent  = partner.status;
  statusEl.style.color  = partner.status === 'active' ? 'var(--green)' : 'var(--red)';

  // Compute stock stats from actual cylinder events
  const [allCylinders, allEvents] = await Promise.all([txGetAll('cylinders'), txGetAll('events')]);
  const MODAL_FULL_TYPES  = new Set(['shipped', 'dist-received', 'dist-sent-retail', 'ret-received']);
  const MODAL_EMPTY_TYPES = new Set(['ret-returned-empty', 'dist-returned-empty']);
  const lastEvModal = {};
  allEvents.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .forEach(ev => { lastEvModal[ev.cylinderId] = ev; });
  let pTotal = 0, pFull = 0, pEmpty = 0;
  allCylinders.filter(c => c.status === 'in-circulation').forEach(c => {
    const ev = lastEvModal[c.id];
    if (!ev) return;
    const loc = ev.location || ev.company || '';
    if (loc !== partner.name) return;
    pTotal++;
    if (MODAL_FULL_TYPES.has(ev.type))       pFull++;
    else if (MODAL_EMPTY_TYPES.has(ev.type)) pEmpty++;
  });
  $('partner-stat-total').textContent = pTotal;
  $('partner-stat-full').textContent  = pFull;
  $('partner-stat-empty').textContent = pEmpty;

  // Monthly sales chart for current year
  const chartYear = new Date().getFullYear();
  const partnerSales = allEvents.filter(ev => ev.type === 'ret-sold' && ev.company === partner.name);
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyCounts = Array.from({ length: 12 }, (_, i) => ({
    label: MONTH_NAMES[i],
    count: partnerSales.filter(ev => {
      const d = new Date(ev.timestamp);
      return d.getFullYear() === chartYear && d.getMonth() === i;
    }).length,
  }));
  const maxCount = Math.max(...monthlyCounts.map(m => m.count), 1);
  const chartHtml = `<div class="v-chart">
  ${monthlyCounts.map(m => {
    const pct = Math.round((m.count / maxCount) * 100);
    return `<div class="v-chart-col">
      <div class="v-chart-bar-wrap">
        <div class="v-chart-bar" style="height:${pct}%;background:var(--blue)">
          ${m.count ? `<span class="v-chart-val">${m.count}</span>` : ''}
        </div>
      </div>
      <div class="v-chart-label">${m.label}</div>
    </div>`;
  }).join('')}
</div>`;
  const salesChartEl = $('partner-sales-chart');
  if (salesChartEl) {
    salesChartEl.innerHTML = `
      <div class="passport-section-title" style="margin-bottom:10px">Sales by Month (${chartYear})</div>
      ${chartHtml}`;
  }

  // Cylinders in stock list (EWURA only)
  const stockSection = $('partner-stock-section');
  const inspBtn = $('partner-inspect-btn');
  if (Auth.session?.role === 'ewura') {
    if (stockSection) stockSection.style.display = '';
    if (inspBtn) inspBtn.style.display = '';
    // Build list of cylinders currently at this partner
    const inStockCyls = allCylinders.filter(c => {
      const ev = lastEvModal[c.id];
      return ev && (ev.location || ev.company) === partner.name;
    }).sort((a, b) => a.serial.localeCompare(b.serial));

    const PAGE_STOCK = 8;
    let _stockPage = 1;
    function renderStockList() {
      const ul = $('partner-cylinders-list');
      if (!ul) return;
      const page = inStockCyls.slice((_stockPage-1)*PAGE_STOCK, _stockPage*PAGE_STOCK);
      if (!page.length) { ul.innerHTML = '<li style="padding:10px;color:var(--muted);font-size:13px">No cylinders currently in stock at this location.</li>'; return; }
      ul.innerHTML = page.map(c => {
        const ev = lastEvModal[c.id];
        const daysAgo = ev ? Math.floor((Date.now() - new Date(ev.timestamp)) / 86400000) : '?';
        const alertBadge = _alertsData.some(a => a.cylinder?.id === c.id) ? '<span style="color:var(--amber);font-size:11px;margin-left:6px">⚠ Alert</span>' : '';
        return `<li style="padding:8px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div>
            <span class="font-mono" style="font-size:13px;font-weight:600">${escapeHtml(c.serial)}</span>${alertBadge}
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${escapeHtml(c.id.slice(-8))} · ${escapeHtml(c.company)} · ${daysAgo}d ago</div>
          </div>
          <span class="cylinder-status-dot ${c.status === 'in-circulation' ? 'dot-blue' : 'dot-grey'}"></span>
        </li>`;
      }).join('');
      renderPagination('partner-cyl-pagination', inStockCyls.length, _stockPage, PAGE_STOCK, p => { _stockPage = p; renderStockList(); });
    }
    renderStockList();
    if (inspBtn) {
      inspBtn.onclick = () => openInspectModal(partner, inStockCyls, lastEvModal);
    }
  } else {
    if (stockSection) stockSection.style.display = 'none';
    if (inspBtn) inspBtn.style.display = 'none';
  }

  openModal('modal-partner');
  requestAnimationFrame(() => {
    const mapEl = $('partner-detail-map');
    if (mapEl) mapEl.innerHTML = buildOsmEmbed(partner.lat, partner.lng);
  });
}

// ── INSPECT MODAL (EWURA) ──────────────────────────────────────────────────
let _inspectPartner = null;
let _inspectStockCyls = [];
let _inspectLastEvMap = {};
let _inspectScanned = [];

function openInspectModal(partner, inStockCyls, lastEvModal) {
  _inspectPartner = partner;
  _inspectStockCyls = inStockCyls;
  _inspectLastEvMap = lastEvModal;
  _inspectScanned = [];
  $('inspect-location-label').textContent = `Location: ${partner.name} · ${partner.city}`;
  $('inspect-scan-input').value = '';
  $('inspect-result').innerHTML = '';
  $('inspect-scanned-list').innerHTML = '';
  openModal('modal-inspect');
  setTimeout(() => $('inspect-scan-input')?.focus(), 100);
}

function doInspectCheck() {
  const input = $('inspect-scan-input');
  const tagId = input?.value.trim();
  if (!tagId) return;
  input.value = '';

  const cyl = _inspectStockCyls.find(c => c.id === tagId || c.serial === tagId) || null;

  const resultEl = $('inspect-result');
  const listEl = $('inspect-scanned-list');

  let found = false, inStock = false, statusHtml = '';

  if (cyl) {
    found = true;
    inStock = true;
    statusHtml = `<div style="padding:12px;background:rgba(34,197,94,0.1);border:1px solid var(--green);border-radius:8px">
      <div style="color:var(--green);font-weight:600;font-size:14px">✓ Found at this location</div>
      <div style="font-size:13px;color:var(--text);margin-top:4px">${escapeHtml(cyl.serial)} · ${escapeHtml(cyl.company)}</div>
    </div>`;
  } else {
    statusHtml = `<div style="padding:12px;background:rgba(239,68,68,0.1);border:1px solid var(--red);border-radius:8px">
      <div style="color:var(--red);font-weight:600;font-size:14px">✗ Not found at this location</div>
      <div style="font-size:13px;color:var(--muted);margin-top:4px">Tag ${escapeHtml(tagId)} not in stock at ${escapeHtml(_inspectPartner?.name || '')}.</div>
    </div>`;
  }

  resultEl.innerHTML = statusHtml;

  _inspectScanned.unshift({ tagId, found: inStock, serial: cyl?.serial || tagId });
  listEl.innerHTML = _inspectScanned.slice(0, 20).map(s => `
    <li style="padding:6px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;font-size:12px">
      <span style="color:${s.found ? 'var(--green)' : 'var(--red)'}">${s.found ? '✓' : '✗'}</span>
      <span class="font-mono">${escapeHtml(s.serial)}</span>
    </li>`).join('');
}

$('inspect-check-btn')?.addEventListener('click', doInspectCheck);
$('inspect-scan-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') doInspectCheck(); });

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

  // Populate year filter from event data (first call only)
  const yearSel = $('mgmt-filter-year');
  if (yearSel && yearSel.children.length <= 1) {
    const years = new Set();
    allEvents.forEach(ev => { years.add(new Date(ev.timestamp).getFullYear()); });
    [...years].sort((a, b) => b - a).forEach(y => {
      const opt = document.createElement('option');
      opt.value = y; opt.textContent = y;
      yearSel.appendChild(opt);
    });
    // Default to 2026
    if ([...yearSel.options].some(o => o.value === '2026')) {
      yearSel.value = '2026';
    }
  }

  const filterYear  = yearSel?.value ? parseInt(yearSel.value) : null;
  const monthSel    = $('mgmt-filter-month');
  const filterMonth = monthSel?.value !== '' ? parseInt(monthSel.value) : null;

  // For distributor/retailer: show simplified own-company reports and return early
  if (role === 'distributor' || role === 'retailer') {
    const company = Auth.session?.company || '';
    const nowMs = Date.now();

    const lastEvByCyl = {};
    allEvents.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .forEach(e => { lastEvByCyl[e.cylinderId] = e; });
    const myCyls   = allCyls.filter(c => { const last = lastEvByCyl[c.id]; return last && last.company === company; });
    const FILLED_EV = new Set(['dist-received', 'dist-sent-retail', 'ret-received', 'shipped']);
    const EMPTY_EV  = new Set(['ret-returned-empty', 'dist-returned-empty', 'ret-sold']);
    const myFilled  = myCyls.filter(c => FILLED_EV.has(lastEvByCyl[c.id]?.type)).length;
    const myEmpty   = myCyls.filter(c => EMPTY_EV.has(lastEvByCyl[c.id]?.type)).length;
    const myTotal   = myCyls.length;

    // ── Sales / Dispatches by Month ───────────────────────────────────────────
    const salesEvType = role === 'retailer' ? 'ret-sold' : 'dist-sent-retail';
    const smMonths2 = [];
    if (filterYear !== null) {
      for (let mo = 0; mo < 12; mo++) {
        smMonths2.push({ label: new Date(filterYear, mo, 1).toLocaleString('default', { month: 'short' }), year: filterYear, month: mo, count: 0 });
      }
    } else {
      const smYearSet2 = new Set();
      allEvents.forEach(ev => { if (ev.type === salesEvType && ev.company === company) smYearSet2.add(new Date(ev.timestamp).getFullYear()); });
      if (!smYearSet2.size) smYearSet2.add(new Date().getFullYear());
      [...smYearSet2].sort().forEach(y => smMonths2.push({ label: String(y), year: y, month: -1, count: 0 }));
    }
    allEvents.forEach(ev => {
      if (ev.type !== salesEvType || ev.company !== company) return;
      const d = new Date(ev.timestamp);
      const m = smMonths2.find(mo => mo.year === d.getFullYear() && (mo.month === -1 || mo.month === d.getMonth()));
      if (m) m.count++;
    });
    const maxSM2 = Math.max(...smMonths2.map(m => m.count), 1);
    const salesLabel = role === 'retailer' ? 'Sales by Month' : 'Dispatches by Month';
    const salesMonthBars2 = smMonths2.map(m => {
      const pct = Math.round((m.count / maxSM2) * 100);
      return `<div class="mgmt-bar-row">
        <span class="mgmt-bar-label">${m.label}</span>
        <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${pct}%;background:var(--green)"><span>${m.count}</span></div></div>
      </div>`;
    }).join('');

    // ── Stock Age ─────────────────────────────────────────────────────────────
    const inStockTypes = role === 'retailer' ? new Set(['ret-received']) : new Set(['dist-received']);
    const inStockCyls  = myCyls.filter(c => {
      const ev = lastEvByCyl[c.id];
      return ev && inStockTypes.has(ev.type) && ev.company === company;
    });
    const stockAges = inStockCyls.map(c => Math.floor((nowMs - new Date(lastEvByCyl[c.id].timestamp)) / 86400000));
    const ageFresh  = stockAges.filter(d => d < 7).length;
    const ageNormal = stockAges.filter(d => d >= 7  && d <= 30).length;
    const ageSlow   = stockAges.filter(d => d >  30 && d <= 60).length;
    const ageStale  = stockAges.filter(d => d >  60).length;
    const ageTotal  = inStockCyls.length;
    const avgAge    = ageTotal ? Math.round(stockAges.reduce((s, d) => s + d, 0) / ageTotal) : 0;

    const ageBlocks = [
      { label: '< 7 days',   count: ageFresh,  color: 'var(--green)',  note: 'Fresh'        },
      { label: '7 – 30 days',count: ageNormal, color: 'var(--blue)',   note: 'Normal'       },
      { label: '31 – 60 days',count: ageSlow,  color: 'var(--amber)',  note: 'Slow-moving'  },
      { label: '> 60 days',  count: ageStale,  color: 'var(--red)',    note: 'Aging stock'  },
    ];
    const ageMaxCount = Math.max(...ageBlocks.map(b => b.count), 1);
    const ageHtml = ageBlocks.map(b => {
      const pct = Math.round((b.count / ageMaxCount) * 100);
      return `<div class="mgmt-bar-row">
        <span class="mgmt-bar-label" style="min-width:80px">${b.label}</span>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px">
          <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${pct}%;background:${b.color}"><span>${b.count}</span></div></div>
          <div style="font-size:10px;color:var(--dim);padding-left:2px">${b.note}</div>
        </div>
      </div>`;
    }).join('');

    grid.innerHTML = `
      <div class="mgmt-card">
        <div class="mgmt-card-header"><div class="mgmt-card-title">Current Stock</div></div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px">
          <div style="background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--amber)">${myTotal}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px">Total</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--green)">${myFilled}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px">Filled</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--muted)">${myEmpty}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px">Empty</div>
          </div>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-card-header"><div class="mgmt-card-title">${salesLabel}</div></div>
        ${salesMonthBars2 || '<p style="font-size:13px;color:var(--dim);padding:8px 0">No data for this period.</p>'}
      </div>
      <div class="mgmt-card">
        <div class="mgmt-card-header">
          <div class="mgmt-card-title">Stock Age</div>
        </div>
        <div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap">
          <div style="font-size:12px;color:var(--muted)">In stock: <strong style="color:var(--text)">${ageTotal}</strong></div>
          <div style="font-size:12px;color:var(--muted)">Avg age: <strong style="color:${avgAge > 30 ? 'var(--amber)' : 'var(--text)'}">${avgAge}d</strong></div>
        </div>
        ${ageTotal > 0 ? ageHtml : '<p style="font-size:13px;color:var(--dim);padding:8px 0">No cylinders currently in stock.</p>'}
      </div>
      ${role === 'distributor' ? (() => {
        // Return Rate by Retailer
        const sentMap = {};
        const returnedMap = {};
        allEvents.forEach(ev => {
          if (ev.company !== company) return;
          if (ev.type === 'dist-sent-retail') sentMap[ev.location || ''] = (sentMap[ev.location || ''] || 0) + 1;
          if (ev.type === 'dist-returned-empty') returnedMap[ev.location || ''] = (returnedMap[ev.location || ''] || 0) + 1;
        });
        const retailers = Object.keys(sentMap).filter(r => r);
        if (!retailers.length) return `<div class="mgmt-card"><div class="mgmt-card-header"><div class="mgmt-card-title">${t('returnRate.title')}</div></div><p style="font-size:13px;color:var(--dim);padding:8px 0">${t('returnRate.noData')}</p></div>`;
        const rrData = retailers.map(r => ({
          name: r,
          sent: sentMap[r] || 0,
          returned: returnedMap[r] || 0,
          rate: sentMap[r] ? Math.round(((returnedMap[r] || 0) / sentMap[r]) * 100) : 0,
        })).sort((a, b) => a.rate - b.rate);
        const rrBars = rrData.map(r => {
          const color = r.rate >= 70 ? 'var(--green)' : r.rate >= 40 ? 'var(--amber)' : 'var(--red)';
          return `<div class="mgmt-bar-row">
            <span class="mgmt-bar-label" style="min-width:120px;font-size:11px">${escapeHtml(r.name.replace(' Gas','').replace(' Retail',''))}</span>
            <div class="mgmt-bar-track" style="flex:1"><div class="mgmt-bar-fill" style="width:${r.rate}%;background:${color}"><span>${r.rate}%</span></div></div>
            <span style="font-size:11px;color:var(--muted);min-width:50px;text-align:right">${r.returned}/${r.sent}</span>
          </div>`;
        }).join('');
        return `<div class="mgmt-card"><div class="mgmt-card-header"><div class="mgmt-card-title">${t('returnRate.title')}</div></div>${rrBars}</div>`;
      })() : ''}`;
    return;
  }

  function inPeriod(ts) {
    if (filterYear === null && filterMonth === null) return true;
    const d = new Date(ts);
    if (filterYear  !== null && d.getFullYear() !== filterYear)  return false;
    if (filterMonth !== null && d.getMonth()    !== filterMonth) return false;
    return true;
  }

  // 1. Cylinders by status
  const statusCounts = {
    'in-refill':      cyls.filter(c => c.status === 'in-refill').length,
    'in-circulation': cyls.filter(c => c.status === 'in-circulation').length,
    'revalidation':   cyls.filter(c => c.status === 'revalidation').length,
    'in-use':         cyls.filter(c => c.status === 'in-use').length,
  };
  const statusColors = {
    'in-refill':      'var(--green)',
    'in-circulation': 'var(--blue)',
    'revalidation':   'var(--teal)',
    'in-use':         'var(--purple)',
  };
  const statusLabels = {
    'in-refill':      t('status.inRefill'),
    'in-circulation': t('status.inCirc'),
    'revalidation':   t('status.inReval'),
    'in-use':         t('status.inUse'),
  };
  // Compute filled/empty sub-counts for in-refill and in-circulation
  const _lastEvByStat = {};
  allEvents.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .forEach(e => { _lastEvByStat[e.cylinderId] = e; });
  const STAT_FILL_EV  = new Set(['refilled', 'shipped', 'dist-received', 'dist-sent-retail', 'ret-received']);
  const STAT_EMPTY_EV = new Set(['received-empty', 'ret-returned-empty', 'dist-returned-empty', 'registered']);
  function cylFillSplit(status) {
    return cyls.filter(c => c.status === status).reduce((acc, c) => {
      const ev = _lastEvByStat[c.id];
      if (ev && STAT_FILL_EV.has(ev.type))  acc.filled++;
      else if (ev && STAT_EMPTY_EV.has(ev.type)) acc.empty++;
      else acc.other++;
      return acc;
    }, { filled: 0, empty: 0, other: 0 });
  }
  const inRefillSplit = cylFillSplit('in-refill');
  const inCircSplit   = cylFillSplit('in-circulation');

  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);
  const statusBarsHtml = Object.entries(statusCounts).map(([k, v]) => {
    const pct = Math.round((v / maxStatusCount) * 100);
    const hasSplit = k === 'in-refill' || k === 'in-circulation';
    const split = k === 'in-refill' ? inRefillSplit : k === 'in-circulation' ? inCircSplit : null;
    return `<div class="mgmt-bar-row">
      <span class="mgmt-bar-label">${statusLabels[k]}</span>
      <div style="flex:1;display:flex;flex-direction:column;gap:2px">
        <div class="mgmt-bar-track">
          <div class="mgmt-bar-fill" style="width:${pct}%;background:${statusColors[k]}"><span>${v}</span></div>
        </div>
        ${hasSplit && split ? `<div style="font-size:10px;color:var(--dim);padding-left:2px">${split.filled} filled · ${split.empty} empty${split.other > 0 ? ` · ${split.other} other` : ''}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  // 2. Refills — axes depend on filter selection
  const now = new Date();
  const months = [];
  if (filterYear !== null && filterMonth !== null) {
    // Single month/year → one bar
    months.push({ label: new Date(filterYear, filterMonth, 1).toLocaleString('default', { month: 'long' }) + ' ' + filterYear, year: filterYear, month: filterMonth, count: 0 });
  } else if (filterYear !== null) {
    // Year selected → all 12 months of that year
    for (let mo = 0; mo < 12; mo++) {
      months.push({ label: new Date(filterYear, mo, 1).toLocaleString('default', { month: 'short' }), year: filterYear, month: mo, count: 0 });
    }
  } else if (filterMonth !== null) {
    // Month selected → show that month across last 5 years
    for (let y = now.getFullYear() - 4; y <= now.getFullYear(); y++) {
      months.push({ label: `${new Date(y, filterMonth, 1).toLocaleString('default', { month: 'short' })}'${String(y).slice(2)}`, year: y, month: filterMonth, count: 0 });
    }
  } else {
    // All years: one bar per year found in data
    const yearSet = new Set();
    allEvents.forEach(ev => { if (ev.type === 'refilled') yearSet.add(new Date(ev.timestamp).getFullYear()); });
    [...yearSet].sort().forEach(y => months.push({ label: String(y), year: y, month: -1, count: 0 }));
    if (!months.length) {
      const d0 = new Date(now.getFullYear(), now.getMonth(), 1);
      months.push({ label: String(d0.getFullYear()), year: d0.getFullYear(), month: -1, count: 0 });
    }
  }
  allEvents.forEach(ev => {
    if (ev.type !== 'refilled') return;
    const d = new Date(ev.timestamp);
    const m = months.find(mo => mo.year === d.getFullYear() && (mo.month === -1 || mo.month === d.getMonth()));
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

  // 3. Field Inspection by Region
  // Pre-compute last known region per cylinder from location-bearing events
  const cylLastRegion = {};
  allEvents
    .filter(e => e.region)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .forEach(e => { cylLastRegion[e.cylinderId] = e.region; });

  const inspByRegion = {};
  allEvents.forEach(ev => {
    if (!['inspected','ewura-monitored'].includes(ev.type)) return;
    if (!inPeriod(ev.timestamp)) return;
    const reg = ev.region || (DEMO_NETWORK.find(n => n.name === ev.company)?.region) || cylLastRegion[ev.cylinderId] || 'Unknown';
    if (!inspByRegion[reg]) inspByRegion[reg] = { total: 0, compliant: 0 };
    inspByRegion[reg].total++;
    if (ev.compliant !== false) inspByRegion[reg].compliant++;
  });
  const inspRegEntries = Object.entries(inspByRegion).sort((a, b) => b[1].total - a[1].total);
  const maxInspReg = Math.max(...inspRegEntries.map(([,v]) => v.total), 1);
  const inspRegBarsHtml = inspRegEntries.length
    ? inspRegEntries.map(([region, data]) => {
        const pct  = Math.round((data.total / maxInspReg) * 100);
        const rate = data.total ? Math.round(data.compliant / data.total * 100) : 0;
        return `<div class="mgmt-bar-row">
          <span class="mgmt-bar-label">${escapeHtml(region)}</span>
          <div class="mgmt-bar-track">
            <div class="mgmt-bar-fill" style="width:${pct}%;background:var(--teal)">
              <span>${data.total}</span>
            </div>
          </div>
          <span style="font-size:11px;color:var(--muted);min-width:40px;text-align:right">${rate}%</span>
        </div>`;
      }).join('')
    : `<p style="font-size:13px;color:var(--dim);padding:8px 0">${t('msg.noInspData')}</p>`;

  // 5. Sales by region (filtered by period)
  const regionSales = {};
  allEvents.forEach(ev => {
    if (ev.type !== 'ret-sold') return;
    if (!inPeriod(ev.timestamp)) return;
    const r = ev.region || ev.company || 'Unknown';
    regionSales[r] = (regionSales[r] || 0) + 1;
  });
  const regionEntries = Object.entries(regionSales).sort((a, b) => b[1] - a[1]);
  const maxRegion = Math.max(...regionEntries.map(([,v]) => v), 1);
  const regionBarsHtml = regionEntries.length
    ? regionEntries.map(([region, count]) => {
        const pct = Math.round((count / maxRegion) * 100);
        return `<div class="mgmt-bar-row">
          <span class="mgmt-bar-label">${escapeHtml(region)}</span>
          <div class="mgmt-bar-track">
            <div class="mgmt-bar-fill" style="width:${pct}%;background:var(--purple)">
              <span>${count}</span>
            </div>
          </div>
        </div>`;
      }).join('')
    : `<p style="font-size:13px;color:var(--dim);padding:8px 0">${t('msg.noSalesData')}</p>`;

  // Sales by SKU removed

  // Field Inspection compliance
  const INSP_TYPES_M = new Set(['inspected', 'ewura-monitored', 'tra-verified']);
  const inspEventsM  = allEvents.filter(ev => INSP_TYPES_M.has(ev.type) && inPeriod(ev.timestamp));
  const inspCompM    = inspEventsM.filter(ev => ev.compliant !== false).length;
  const inspNonM     = inspEventsM.filter(ev => ev.compliant === false).length;
  const inspRateM    = inspEventsM.length ? Math.round(inspCompM / inspEventsM.length * 100) : 0;

  // Alerts by Region — derive each alerted cylinder's last known region from events
  const _cylLastRegionM = {};
  allEvents
    .filter(e => e.region)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .forEach(e => { _cylLastRegionM[e.cylinderId] = e.region; });
  const _alertsByRegion = {};
  _alertsData.forEach(al => {
    const cyl = al.cylinder;
    if (!cyl) return;
    const region = _cylLastRegionM[cyl.id]
      || DEMO_NETWORK.find(n => n.name === cyl.company)?.region
      || 'Unknown';
    if (!_alertsByRegion[region]) _alertsByRegion[region] = { critical: new Set(), warning: new Set() };
    (al.severity === 'critical' ? _alertsByRegion[region].critical : _alertsByRegion[region].warning).add(cyl.id);
  });
  const alertRegionEntries = Object.entries(_alertsByRegion)
    .map(([region, sets]) => ({ region, critical: sets.critical.size, warning: sets.warning.size, total: sets.critical.size + sets.warning.size }))
    .sort((a, b) => b.total - a.total);
  const maxAlertRegion = Math.max(...alertRegionEntries.map(e => e.total), 1);
  const alertRegionBarsHtml = alertRegionEntries.length
    ? alertRegionEntries.map(({ region, critical, warning, total }) => {
        const pct = Math.round((total / maxAlertRegion) * 100);
        const barColor = critical > 0 ? 'var(--red)' : 'var(--amber)';
        const detail = [critical > 0 ? `${critical} ${t('word.critical')}` : '', warning > 0 ? `${warning} ${t('word.warning')}` : ''].filter(Boolean).join(' · ');
        return `<div class="mgmt-bar-row">
          <span class="mgmt-bar-label">${escapeHtml(region)}</span>
          <div style="flex:1;display:flex;flex-direction:column;gap:2px">
            <div class="mgmt-bar-track">
              <div class="mgmt-bar-fill" style="width:${pct}%;background:${barColor}"><span>${total}</span></div>
            </div>
            <div style="font-size:10px;color:var(--dim);padding-left:2px">${escapeHtml(detail)}</div>
          </div>
        </div>`;
      }).join('')
    : `<p style="font-size:13px;color:var(--dim);padding:8px 0">${t('msg.noActiveAlerts')}</p>`;

  // Operator Compliance Ranking — EWURA only
  // Group by the cylinder's owning company (the operator under inspection),
  // not ev.company which is always the inspector ('Field Inspection Unit').
  const _cylCoMap = {};
  allCyls.forEach(c => { _cylCoMap[c.id] = c.company; });
  const opCompliance = {};
  if (role === 'ewura') {
    allEvents.forEach(ev => {
      if (!['inspected','ewura-monitored','tra-verified'].includes(ev.type)) return;
      if (!inPeriod(ev.timestamp)) return;
      const co = _cylCoMap[ev.cylinderId] || ev.company || 'Unknown';
      if (!opCompliance[co]) opCompliance[co] = { pass: 0, total: 0 };
      opCompliance[co].total++;
      if (ev.compliant !== false) opCompliance[co].pass++;
    });
  }
  const opRankEntries = Object.entries(opCompliance)
    .map(([co, d]) => ({ co, rate: d.total ? Math.round(d.pass/d.total*100) : 0, total: d.total, pass: d.pass }))
    .sort((a, b) => a.rate - b.rate)  // lowest compliance first (most problematic operators)
    .slice(0, 10);
  const opRankHtml = opRankEntries.length
    ? opRankEntries.map(({ co, rate, total, pass }) => {
        const barColor = rate >= 80 ? 'var(--green)' : rate >= 50 ? 'var(--amber)' : 'var(--red)';
        const short = co.length > 22 ? co.slice(0,20)+'…' : co;
        return `<div class="mgmt-bar-row">
          <span class="mgmt-bar-label" title="${escapeHtml(co)}">${escapeHtml(short)}</span>
          <div style="flex:1;display:flex;flex-direction:column;gap:2px">
            <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${rate}%;background:${barColor}"><span>${rate}%</span></div></div>
            <div style="font-size:10px;color:var(--dim);padding-left:2px">${pass}/${total} ${t('word.inspections')}</div>
          </div>
        </div>`;
      }).join('')
    : `<p style="font-size:13px;color:var(--dim);padding:8px 0">${t('msg.noInspPeriod')}</p>`;

  grid.innerHTML = `
    <div class="mgmt-card">
      <div class="mgmt-card-header">
        <div class="mgmt-card-title">${t('mgmt.status')}</div>
        <button class="mgmt-card-export-btn" data-export="status" type="button">↓ CSV</button>
      </div>
      ${statusBarsHtml}
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-header">
        <div class="mgmt-card-title">${t('mgmt.refills')}</div>
        <button class="mgmt-card-export-btn" data-export="refills" type="button">↓ CSV</button>
      </div>
      ${fillBarsHtml}
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-header">
        <div class="mgmt-card-title">${t('mgmt.salesRegion')}</div>
        <button class="mgmt-card-export-btn" data-export="regions" type="button">↓ CSV</button>
      </div>
      ${regionBarsHtml}
    </div>
    ${role === 'lpgmc' ? (() => {
      const cylIds = new Set(cyls.map(c => c.id));
      // Build months axis using same logic as fillBarsHtml so all months show for selected year
      const smMonths = [];
      if (filterYear !== null && filterMonth !== null) {
        smMonths.push({ label: new Date(filterYear, filterMonth, 1).toLocaleString('default', { month: 'long' }) + ' ' + filterYear, year: filterYear, month: filterMonth, count: 0 });
      } else if (filterYear !== null) {
        for (let mo = 0; mo < 12; mo++) {
          smMonths.push({ label: new Date(filterYear, mo, 1).toLocaleString('default', { month: 'short' }), year: filterYear, month: mo, count: 0 });
        }
      } else if (filterMonth !== null) {
        for (let y = now.getFullYear() - 4; y <= now.getFullYear(); y++) {
          smMonths.push({ label: new Date(y, filterMonth, 1).toLocaleString('default', { month: 'short' }) + "'" + String(y).slice(2), year: y, month: filterMonth, count: 0 });
        }
      } else {
        const smYearSet = new Set();
        allEvents.forEach(ev => { if (ev.type === 'ret-sold' && cylIds.has(ev.cylinderId)) smYearSet.add(new Date(ev.timestamp).getFullYear()); });
        if (!smYearSet.size) smYearSet.add(now.getFullYear());
        [...smYearSet].sort().forEach(y => smMonths.push({ label: String(y), year: y, month: -1, count: 0 }));
      }
      allEvents.forEach(ev => {
        if (ev.type !== 'ret-sold' || !cylIds.has(ev.cylinderId)) return;
        const d = new Date(ev.timestamp);
        const m = smMonths.find(mo => mo.year === d.getFullYear() && (mo.month === -1 || mo.month === d.getMonth()));
        if (m) m.count++;
      });
      const maxSM = Math.max(...smMonths.map(m => m.count), 1);
      const salesMonthBarsHtml = smMonths.map(m => {
        const pct = Math.round((m.count / maxSM) * 100);
        return `<div class="mgmt-bar-row">
          <span class="mgmt-bar-label">${m.label}</span>
          <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${pct}%;background:var(--green)"><span>${m.count}</span></div></div>
        </div>`;
      }).join('');
      const netSalesMap = {};
      allEvents.forEach(ev => {
        if (ev.type !== 'ret-sold' || !ev.company || !inPeriod(ev.timestamp)) return;
        if (!cylIds.has(ev.cylinderId)) return;
        netSalesMap[ev.company] = (netSalesMap[ev.company] || 0) + 1;
      });
      const netTop = Object.entries(netSalesMap).sort((a,b) => b[1]-a[1]).slice(0,10);
      const maxNet = netTop.length ? Math.max(...netTop.map(([,v]) => v), 1) : 1;
      const netSalesBarsHtml = netTop.length
        ? netTop.map(([name,count]) => {
            const pct = Math.round((count/maxNet)*100);
            const short = name.length > 20 ? name.slice(0,18)+'…' : name;
            return `<div class="mgmt-bar-row">
              <span class="mgmt-bar-label" title="${escapeHtml(name)}">${escapeHtml(short)}</span>
              <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${pct}%;background:var(--purple)"><span>${count}</span></div></div>
            </div>`;
          }).join('')
        : `<p style="font-size:13px;color:var(--dim);padding:8px 0">${t('msg.noSalesPeriod')}</p>`;
      return `
        <div class="mgmt-card">
          <div class="mgmt-card-header">
            <div class="mgmt-card-title">${t('dash.salesByMonth')}</div>
            <button class="mgmt-card-export-btn" data-export="sales-month" type="button">↓ CSV</button>
          </div>
          ${salesMonthBarsHtml}
        </div>
        <div class="mgmt-card">
          <div class="mgmt-card-header">
            <div class="mgmt-card-title">${t('mgmt.netSalesTop10')}</div>
            <button class="mgmt-card-export-btn" data-export="network-sales" type="button">↓ CSV</button>
          </div>
          ${netSalesBarsHtml}
        </div>`;
    })() : ''}
    ${role !== 'lpgmc' ? `<div class="mgmt-card">
      <div class="mgmt-card-header">
        <div class="mgmt-card-title">${t('dash.marketCompliance')}</div>
        <button class="mgmt-card-export-btn" data-export="field-inspection" type="button">↓ CSV</button>
      </div>
      <div style="margin-bottom:12px;font-size:13px;color:var(--muted)">${t('mgmt.totalInsp')}: <strong style="color:var(--text)">${inspEventsM.length}</strong></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:100px;background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
          <div style="font-size:28px;font-weight:700;color:var(--green)">${inspCompM}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px">✓ ${t('mgmt.compliant')}</div>
        </div>
        <div style="flex:1;min-width:100px;background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
          <div style="font-size:28px;font-weight:700;color:var(--red)">${inspNonM}</div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px">✗ ${t('mgmt.nonCompliant')}</div>
        </div>
        ${inspEventsM.length > 0 ? `<div style="flex:1;min-width:100px;background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
          <div style="font-size:28px;font-weight:700;color:var(--blue)">${inspRateM}%</div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px">${t('mgmt.complianceRate')}</div>
        </div>` : ''}
      </div>
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-header">
        <div class="mgmt-card-title">${t('mgmt.fieldInspByRegion')}</div>
        <button class="mgmt-card-export-btn" data-export="insp-region" type="button">↓ CSV</button>
      </div>
      <div style="margin-bottom:12px;font-size:13px;color:var(--muted)">${t('mgmt.totalInsp')}: <strong style="color:var(--text)">${inspRegEntries.reduce((s,[,v])=>s+v.total,0)}</strong></div>
      ${inspRegBarsHtml}
    </div>` : ''}
    <div class="mgmt-card">
      <div class="mgmt-card-header">
        <div class="mgmt-card-title">${t('mgmt.alertsByRegion')}</div>
        <button class="mgmt-card-export-btn" data-export="alerts-region" type="button">↓ CSV</button>
      </div>
      <div style="margin-bottom:12px;font-size:13px;color:var(--muted)">
        ${t('mgmt.totalCylAlerts')}: <strong style="color:var(--text)">${_alertsData.length ? new Set(_alertsData.map(a => a.cylinder?.id).filter(Boolean)).size : 0}</strong>
      </div>
      ${alertRegionBarsHtml}
    </div>
    ${role === 'ewura' ? (() => {
      const opShareM = LPGMC_COMPANIES.map(c => ({ name: c, count: allCyls.filter(cy => cy.company === c).length }));
      const maxOpM = Math.max(...opShareM.map(o => o.count), 1);
      const totalCylsM = allCyls.length || 1;
      const opColorsM = ['var(--blue)', 'var(--green)', 'var(--purple)', 'var(--amber)'];
      const opBarsM = opShareM.map((o, i) => {
        const pct = Math.round((o.count / maxOpM) * 100);
        const share = Math.round((o.count / totalCylsM) * 100);
        return `<div class="mgmt-bar-row">
          <span class="mgmt-bar-label" style="min-width:110px">${escapeHtml(o.name)}</span>
          <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${pct}%;background:${opColorsM[i % opColorsM.length]}"><span>${o.count} (${share}%)</span></div></div>
        </div>`;
      }).join('');
      return `<div class="mgmt-card">
        <div class="mgmt-card-header">
          <div class="mgmt-card-title">${t('mgmt.opComplianceRanking')}</div>
          <button class="mgmt-card-export-btn" data-export="compliance-ranking" type="button">↓ CSV</button>
        </div>
        ${opRankHtml}
      </div>
      <div class="mgmt-card">
        <div class="mgmt-card-header"><div class="mgmt-card-title">${t('marketIntel.opShare')}</div></div>
        ${opBarsM}
      </div>`;
    })() : ''}`;
}

// Per-card CSV export buttons
const mgmtGrid = $('mgmt-reports-grid');
if (mgmtGrid) {
  mgmtGrid.addEventListener('click', async (e) => {
    const btn = e.target.closest('.mgmt-card-export-btn');
    if (!btn) return;
    const type = btn.dataset.export;
    const allCyls   = await txGetAll('cylinders');
    const allEvents = await txGetAll('events');
    const yearSel   = $('mgmt-filter-year');
    const monthSel  = $('mgmt-filter-month');
    const fy = yearSel?.value ? parseInt(yearSel.value) : null;
    const fm = monthSel?.value !== '' ? parseInt(monthSel.value) : null;
    function inP(ts) {
      const d = new Date(ts);
      if (fy !== null && d.getFullYear() !== fy) return false;
      if (fm !== null && d.getMonth() !== fm) return false;
      return true;
    }
    const date = new Date().toISOString().slice(0,10);
    let csv = '';
    if (type === 'status') {
      csv = 'Status,Count\n' + ['in-refill','in-circulation','revalidation','in-use']
        .map(s => `"${s}",${allCyls.filter(c => c.status === s).length}`).join('\n');
      downloadCSV(`lpg-status-${date}.csv`, csv);
    } else if (type === 'refills') {
      csv = 'Timestamp,CylinderID,Company\n' +
        allEvents.filter(ev => ev.type === 'refilled' && inP(ev.timestamp))
          .map(ev => `"${ev.timestamp}","${ev.cylinderId}","${ev.company || ''}"`).join('\n');
      downloadCSV(`lpg-refills-${date}.csv`, csv);
    } else if (type === 'partners') {
      const salesMap = {};
      allEvents.filter(ev => ev.type === 'ret-sold' && inP(ev.timestamp))
        .forEach(ev => { salesMap[ev.company] = (salesMap[ev.company] || 0) + 1; });
      csv = 'Partner,Sales\n' + Object.entries(salesMap).sort((a,b) => b[1]-a[1])
        .map(([n,c]) => `"${n}",${c}`).join('\n');
      downloadCSV(`lpg-partners-${date}.csv`, csv);
    } else if (type === 'regions') {
      const regMap = {};
      allEvents.filter(ev => ev.type === 'ret-sold' && inP(ev.timestamp))
        .forEach(ev => { const r = ev.region || ev.company || 'Unknown'; regMap[r] = (regMap[r] || 0) + 1; });
      csv = 'Region,Sales\n' + Object.entries(regMap).sort((a,b) => b[1]-a[1])
        .map(([r,c]) => `"${r}",${c}`).join('\n');
      downloadCSV(`lpg-regions-${date}.csv`, csv);
    } else if (type === 'insp-region') {
      const cylRegMap = {};
      allEvents.filter(e => e.region).sort((a,b) => new Date(a.timestamp)-new Date(b.timestamp)).forEach(e => { cylRegMap[e.cylinderId] = e.region; });
      const regMap = {};
      allEvents.filter(ev => ['inspected','ewura-monitored'].includes(ev.type) && inP(ev.timestamp)).forEach(ev => {
        const reg = ev.region || (DEMO_NETWORK.find(n => n.name === ev.company)?.region) || cylRegMap[ev.cylinderId] || 'Unknown';
        if (!regMap[reg]) regMap[reg] = { total: 0, compliant: 0 };
        regMap[reg].total++;
        if (ev.compliant !== false) regMap[reg].compliant++;
      });
      csv = 'Region,Total,Compliant,ComplianceRate\n' +
        Object.entries(regMap).sort((a,b)=>b[1].total-a[1].total)
          .map(([r,d]) => `"${r}",${d.total},${d.compliant},${d.total?Math.round(d.compliant/d.total*100):0}%`).join('\n');
      downloadCSV(`lpg-insp-by-region-${date}.csv`, csv);
    } else if (type === 'inspections' || type === 'field-inspection') {
      const INSP_TYPES = new Set(['inspected', 'ewura-monitored', 'tra-verified']);
      csv = 'Timestamp,CylinderID,Type,Company,Compliant\n' +
        allEvents.filter(ev => INSP_TYPES.has(ev.type) && inP(ev.timestamp))
          .map(ev => `"${ev.timestamp}","${ev.cylinderId}","${ev.type}","${ev.company || ''}","${ev.compliant !== false ? 'true' : 'false'}"`).join('\n');
      downloadCSV(`lpg-field-inspection-${date}.csv`, csv);
    } else if (type === 'sales-month') {
      const rolE = Auth.session?.role;
      const cE = rolE === 'lpgmc' ? allCyls.filter(c => c.company === (Auth.session?.company || '')) : allCyls;
      const cIds = new Set(cE.map(c => c.id));
      const smMap = {};
      allEvents.filter(ev => ev.type === 'ret-sold' && inP(ev.timestamp) && cIds.has(ev.cylinderId)).forEach(ev => {
        const d = new Date(ev.timestamp);
        const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        smMap[k] = (smMap[k] || 0) + 1;
      });
      csv = 'Month,Sales\n' + Object.entries(smMap).sort((a,b) => a[0].localeCompare(b[0])).map(([k,v]) => `"${k}",${v}`).join('\n');
      downloadCSV(`lpg-sales-by-month-${date}.csv`, csv);
    } else if (type === 'network-sales') {
      const nsMap = {};
      allEvents.filter(ev => ev.type === 'ret-sold' && ev.company && inP(ev.timestamp)).forEach(ev => { nsMap[ev.company] = (nsMap[ev.company] || 0) + 1; });
      csv = 'Partner,Sales\n' + Object.entries(nsMap).sort((a,b) => b[1]-a[1]).map(([n,c]) => `"${n}",${c}`).join('\n');
      downloadCSV(`lpg-network-sales-${date}.csv`, csv);
    } else if (type === 'sales-weight') {
      csv = 'Timestamp,CylinderID,NetWeight_kg,Company\n' +
        allEvents.filter(ev => ev.type === 'ret-sold' && inP(ev.timestamp)).map(ev => {
          const cyl = allCyls.find(c => c.id === ev.cylinderId);
          const w = cyl ? (cyl.netWeight || cyl.capacity || 12) : 12;
          return `"${ev.timestamp}","${ev.cylinderId}",${w},"${ev.company || ''}"`;
        }).join('\n');
      downloadCSV(`lpg-sales-by-sku-${date}.csv`, csv);
    } else if (type === 'alerts-region') {
      const cylLastReg = {};
      allEvents.filter(e => e.region).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .forEach(e => { cylLastReg[e.cylinderId] = e.region; });
      const rows = _alertsData.map(al => {
        const cyl = al.cylinder;
        const region = cyl ? (cylLastReg[cyl.id] || DEMO_NETWORK.find(n => n.name === cyl?.company)?.region || 'Unknown') : 'Unknown';
        return `"${region}","${al.severity}","${al.type}","${cyl?.serial || ''}","${cyl?.id || ''}","${al.title.replace(/"/g, '""')}"`;
      });
      csv = 'Region,Severity,Type,Serial,CylinderID,Title\n' + rows.join('\n');
      downloadCSV(`lpg-alerts-by-region-${date}.csv`, csv);
    } else if (type === 'compliance-ranking') {
      const _cmap = {}; allCyls.forEach(c => { _cmap[c.id] = c.company; });
      const ops = {};
      allEvents.filter(ev => ['inspected','ewura-monitored','tra-verified'].includes(ev.type) && inP(ev.timestamp))
        .forEach(ev => {
          const co = _cmap[ev.cylinderId] || ev.company || 'Unknown';
          if (!ops[co]) ops[co] = { pass:0, total:0 };
          ops[co].total++;
          if (ev.compliant !== false) ops[co].pass++;
        });
      csv = 'Operator,PassCount,TotalInspections,ComplianceRate%\n' +
        Object.entries(ops).map(([co,d]) => `"${co}",${d.pass},${d.total},${d.total?Math.round(d.pass/d.total*100):0}`).join('\n');
      downloadCSV(`lpg-compliance-ranking-${date}.csv`, csv);
    }
  });
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
    li.dataset.licId = lic.id;
    li.style.cursor = 'pointer';
    li.innerHTML = `
      <span class="lic-side-bar ${lic.status === 'active' ? 'bar-green' : 'bar-red'}"></span>
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

licensesList.addEventListener('click', (e) => {
  const item = e.target.closest('.license-item[data-lic-id]');
  if (item) openLicenseDetailModal(item.dataset.licId);
});

let _licDetailCurrentId = null;

async function openLicenseDetailModal(licId) {
  const lic = _licensesData.find(l => l.id === licId);
  if (!lic) return;

  _licDetailCurrentId = licId;
  const detailBody = $('license-detail-body');
  if (!detailBody) return;

  // Look up location info from DEMO_NETWORK (dist/retailer) or DEMO_LPGMC_INFO (LPGMC)
  const netEntry   = DEMO_NETWORK.find(n => n.name === lic.companyName);
  const lpgmcInfo  = DEMO_LPGMC_INFO[lic.companyName];
  const extraInfo  = DEMO_LICENSE_EXTRA_INFO[lic.companyName];
  const infoEntry  = netEntry || lpgmcInfo || extraInfo || null;

  const [allCylsL, allEvsL] = await Promise.all([txGetAll('cylinders'), txGetAll('events')]);

  // Compute cylinder stock for any company type
  let lTotal = 0, lFull = 0, lEmpty = 0;
  const sortedEvsL = allEvsL.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const lastEvL = {};
  sortedEvsL.forEach(ev => { lastEvL[ev.cylinderId] = ev; });

  if (netEntry) {
    const LFULL  = new Set(['shipped', 'dist-received', 'dist-sent-retail', 'ret-received']);
    const LEMPTY = new Set(['ret-returned-empty', 'dist-returned-empty']);
    allCylsL.filter(c => c.status === 'in-circulation').forEach(c => {
      const ev = lastEvL[c.id];
      if (!ev || (ev.location || ev.company || '') !== netEntry.name) return;
      lTotal++;
      if (LFULL.has(ev.type))       lFull++;
      else if (LEMPTY.has(ev.type)) lEmpty++;
    });
  } else {
    const FILL_EV  = new Set(['refilled', 'shipped', 'dist-received', 'ret-received', 'dist-sent-retail']);
    const EMPTY_EV = new Set(['received-empty', 'registered', 'sent-revalidation', 'reval-received']);
    allCylsL.filter(c => c.company === lic.companyName).forEach(c => {
      lTotal++;
      const evType = (lastEvL[c.id] || {}).type;
      if (FILL_EV.has(evType))       lFull++;
      else if (EMPTY_EV.has(evType)) lEmpty++;
    });
  }

  // Last inspection for this company's cylinders
  const companyCylIds = new Set(allCylsL.filter(c => c.company === lic.companyName || (netEntry && (lastEvL[c.id]?.company || '') === netEntry.name)).map(c => c.id));
  const inspEventsL = allEvsL.filter(e => e.type === 'inspected' && companyCylIds.has(e.cylinderId));
  const lastInspEv  = inspEventsL.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const lastInspDate = lastInspEv ? formatDate(lastInspEv.timestamp) : '-';

  const stockHtml = `
    <div class="passport-section-title" style="margin-top:16px">Cylinder Stock</div>
    <div class="partner-stats-row" style="margin:8px 0 4px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
      <div class="partner-stat-card"><span class="partner-stat-value" style="color:var(--amber)">${lTotal}</span><div class="partner-stat-label">Total</div></div>
      <div class="partner-stat-card"><span class="partner-stat-value" style="color:var(--green)">${lFull}</span><div class="partner-stat-label">${t('kpi.full')}</div></div>
      <div class="partner-stat-card"><span class="partner-stat-value" style="color:var(--muted)">${lEmpty}</span><div class="partner-stat-label">${t('kpi.empty')}</div></div>
    </div>`;

  const locationHtml = `
    <div class="passport-section-title" style="margin-top:16px">${t('license.location')}</div>
    <div class="passport-row"><span class="passport-key">Region</span><span class="passport-value">${escapeHtml(infoEntry?.region || '—')}</span></div>
    <div class="passport-row"><span class="passport-key">City</span><span class="passport-value">${escapeHtml(infoEntry?.city || '—')}</span></div>
    <div class="passport-row"><span class="passport-key">Address</span><span class="passport-value">${escapeHtml(infoEntry?.address || '—')}</span></div>
    <div class="passport-row"><span class="passport-key">Contact</span><span class="passport-value">${escapeHtml(infoEntry?.contact || '—')}</span></div>
    <div class="passport-row"><span class="passport-key">Contact Person</span><span class="passport-value">${escapeHtml(infoEntry?.contactPerson || '—')}</span></div>
    ${infoEntry?.lat != null ? `<div class="passport-row"><span class="passport-key">Coordinates</span><span class="passport-value" style="font-family:var(--font-mono);font-size:12px">${infoEntry.lat.toFixed(4)}, ${infoEntry.lng.toFixed(4)}</span></div>
    <div id="license-detail-map" style="height:260px;border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;margin-top:12px"></div>` : ''}
  `;

  // License history timeline
  const history = lic.history || [];
  const historyHtml = history.length ? `
    <div class="passport-section-title" style="margin-top:16px">License History</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
      ${history.slice().reverse().map(ev => {
        const evColor = ev.type === 'granted' ? 'var(--green)' : ev.type === 'revoked' ? 'var(--red)' : ev.type === 'renewed' ? 'var(--blue)' : 'var(--muted)';
        const evIcon  = ev.type === 'granted' ? '✓' : ev.type === 'revoked' ? '✕' : ev.type === 'renewed' ? '↻' : '•';
        return `<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 10px;background:var(--surface2);border-radius:6px;border-left:3px solid ${evColor}">
          <span style="color:${evColor};font-weight:700;font-size:14px;flex-shrink:0">${evIcon}</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600;color:var(--text);text-transform:capitalize">${escapeHtml(ev.type)}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${formatDate(ev.date)} · by ${escapeHtml(ev.by)}</div>
            ${ev.note ? `<div style="font-size:12px;color:var(--dim);margin-top:2px">${escapeHtml(ev.note)}</div>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>` : '';

  // Compute last inspection date for this company
  const _licInspEvs = allEvsL.filter(ev =>
    (ev.type === 'inspected' || ev.type === 'ewura-monitored') && ev.company === lic.companyName
  );
  const _licLastInspDate = _licInspEvs.length
    ? _licInspEvs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp.slice(0, 10)
    : null;

  const statusColor = lic.status === 'active' ? 'var(--green)' : lic.status === 'revoked' ? 'var(--red)' : lic.status === 'expired' ? 'var(--amber)' : 'var(--muted)';

  detailBody.innerHTML = `
    <div class="passport-section-title">${t('license.details')}</div>
    <div class="passport-row"><span class="passport-key">${t('license.company')}</span><span class="passport-value">${escapeHtml(lic.companyName)}</span></div>
    <div class="passport-row"><span class="passport-key">${t('license.number')}</span><span class="passport-value" style="font-family:var(--font-mono)">${escapeHtml(lic.licenseNumber)}</span></div>
    <div class="passport-row"><span class="passport-key">Type</span><span class="passport-value">${escapeHtml(lic.companyType)}</span></div>
    <div class="passport-row"><span class="passport-key">Issued / Renewed</span><span class="passport-value">${formatDate(lic.issuedDate)}</span></div>
    <div class="passport-row"><span class="passport-key">${t('license.expires')}</span><span class="passport-value">${formatDate(lic.expiryDate)}</span></div>
    <div class="passport-row"><span class="passport-key">Last Inspection</span><span class="passport-value">${_licLastInspDate ? formatDate(_licLastInspDate) : '—'}</span></div>
    <div class="passport-row"><span class="passport-key">${t('license.status')}</span><span class="passport-value" style="color:${statusColor};font-weight:600">${escapeHtml(lic.status)}</span></div>
    <div class="passport-row"><span class="passport-key">Last Inspection</span><span class="passport-value">${lastInspDate}</span></div>
    ${locationHtml}
    ${stockHtml}
    ${historyHtml}`;

  // Show/hide revoke & renew buttons for EWURA
  const revokeBtn = $('lic-detail-revoke-btn');
  const renewBtn  = $('lic-detail-renew-btn');
  const isEwura   = Auth.session?.role === 'ewura';
  if (revokeBtn) revokeBtn.style.display = isEwura && lic.status !== 'revoked' ? '' : 'none';
  if (renewBtn)  renewBtn.style.display  = isEwura && (lic.status === 'revoked' || lic.status === 'expired') ? '' : 'none';

  openModal('modal-license-detail');

  if (infoEntry) {
    requestAnimationFrame(() => {
      const mapEl = $('license-detail-map');
      if (mapEl) mapEl.innerHTML = buildOsmEmbed(infoEntry.lat, infoEntry.lng);
    });
  }
}

// License detail: Revoke / Renew
$('lic-detail-revoke-btn')?.addEventListener('click', async () => {
  if (!_licDetailCurrentId) return;
  const idx = _licensesData.findIndex(l => l.id === _licDetailCurrentId);
  if (idx < 0) return;
  if (!confirm(`Revoke license for ${_licensesData[idx].companyName}? This will set the company status to inactive.`)) return;
  const today = new Date().toISOString().slice(0, 10);
  _licensesData[idx].status = 'revoked';
  _licensesData[idx].revokedDate = today;
  if (!_licensesData[idx].history) _licensesData[idx].history = [];
  _licensesData[idx].history.push({ type: 'revoked', date: today, by: Auth.session?.company || 'EWURA', note: 'License revoked by EWURA' });
  await txPut('licenses', _licensesData[idx]);
  // Mark associated network entry inactive
  const netEntry = DEMO_NETWORK.find(n => n.name === _licensesData[idx].companyName);
  if (netEntry) netEntry.status = 'inactive';
  showSnackbar('License revoked. Company set to inactive.', 'error');
  renderLicenses();
  await openLicenseDetailModal(_licDetailCurrentId);
});

$('lic-detail-renew-btn')?.addEventListener('click', async () => {
  if (!_licDetailCurrentId) return;
  const idx = _licensesData.findIndex(l => l.id === _licDetailCurrentId);
  if (idx < 0) return;
  const today = new Date().toISOString().slice(0, 10);
  const newExpiry = new Date();
  newExpiry.setFullYear(newExpiry.getFullYear() + 3);
  _licensesData[idx].status = 'active';
  _licensesData[idx].expiryDate = newExpiry.toISOString().slice(0, 10);
  if (!_licensesData[idx].history) _licensesData[idx].history = [];
  _licensesData[idx].history.push({ type: 'renewed', date: today, by: Auth.session?.company || 'EWURA', note: `License renewed. New expiry: ${newExpiry.toISOString().slice(0, 10)}` });
  await txPut('licenses', _licensesData[idx]);
  const netEntry = DEMO_NETWORK.find(n => n.name === _licensesData[idx].companyName);
  if (netEntry) netEntry.status = 'active';
  showSnackbar('License renewed for 3 years.', 'success');
  renderLicenses();
  await openLicenseDetailModal(_licDetailCurrentId);
});

mgmtFilterYear?.addEventListener('change',  renderMgmtReports);
mgmtFilterMonth?.addEventListener('change', renderMgmtReports);


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
    history: [{ type: 'granted', date: issued, by: Auth.session?.company || 'EWURA', note: 'License granted' }],
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
    if (btn.dataset.close === 'modal-recall') {
      if (_recallPreviewMap) { _recallPreviewMap.remove(); _recallPreviewMap = null; }
      const pane = $('recall-preview-map'); if (pane) pane.style.display = 'none';
      const info = $('recall-preview-info'); if (info) info.textContent = '';
      const ref2 = $('recall-ref'); if (ref2) ref2.value = '';
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
// SHIPMENT MODAL
// ══════════════════════════════════════════════════════════════════════════════

let _shipmentScannedCyls = []; // [{ id, cyl }]

function openShipmentModal() {
  const role = Auth.session?.role;
  if (!role) return;
  _shipmentScannedCyls = [];

  // Reset form fields
  const notesEl = $('shipment-notes'); if (notesEl) notesEl.value = '';
  const invoiceEl = $('shipment-invoice'); if (invoiceEl) invoiceEl.value = '';
  const consumerChk = $('shipment-consumer-sale-chk'); if (consumerChk) consumerChk.checked = false;
  const consumerIdEl = $('shipment-consumer-id'); if (consumerIdEl) consumerIdEl.value = '';
  const consumerSection = $('shipment-consumer-section');
  const consumerIdWrap = $('shipment-consumer-id-wrap');
  const destGroup = $('shipment-dest-group');
  if (consumerSection) consumerSection.style.display = role === 'retailer' ? '' : 'none';
  if (consumerIdWrap) consumerIdWrap.style.display = 'none';
  if (destGroup) destGroup.style.display = '';
  if (consumerChk) {
    const _onCS = () => {
      const checked = consumerChk.checked;
      if (consumerIdWrap) consumerIdWrap.style.display = checked ? '' : 'none';
      if (destGroup && role === 'retailer') destGroup.style.display = checked ? 'none' : '';
    };
    consumerChk.removeEventListener('change', consumerChk._csHandler);
    consumerChk._csHandler = _onCS;
    consumerChk.addEventListener('change', _onCS);
  }
  const shipmentScanIn  = $('shipment-scan-input');
  const shipmentList    = $('shipment-cylinder-list');
  const shipmentDest    = $('shipment-dest');
  if (shipmentList)   shipmentList.innerHTML = '<p style="font-size:13px;color:var(--dim);padding:8px 0">No cylinders scanned yet.</p>';
  if (shipmentScanIn) shipmentScanIn.value = '';

  const opts = [];
  if (role === 'lpgmc') {
    DEMO_NETWORK.filter(n => (n.type === 'Distributor' || n.type === 'Retailer') && n.status === 'active')
      .forEach(n => opts.push({ name:n.name, type:n.type, region:n.region }));
    (_licensesData || []).filter(l => l.companyType === 'Revalidator' && l.status === 'active')
      .forEach(l => opts.push({ name:l.companyName, type:'Revalidator', region:'' }));
  } else if (role === 'distributor') {
    LPGMC_COMPANIES.forEach(c => opts.push({ name:c, type:'LPGMC', region:'' }));
    DEMO_NETWORK.filter(n => n.type === 'Retailer' && n.status === 'active')
      .forEach(n => opts.push({ name:n.name, type:n.type, region:n.region }));
  } else if (role === 'retailer') {
    LPGMC_COMPANIES.forEach(c => opts.push({ name:c, type:'LPGMC', region:'' }));
    DEMO_NETWORK.filter(n => n.type === 'Distributor' && n.status === 'active')
      .forEach(n => opts.push({ name:n.name, type:n.type, region:n.region }));
  }

  if (shipmentDest) {
    shipmentDest.innerHTML = '<option value="">— Select destination —</option>' +
      opts.map(o => `<option value="${escapeHtml(o.name)}" data-type="${escapeHtml(o.type)}" data-region="${escapeHtml(o.region)}">${escapeHtml(o.name)} (${escapeHtml(o.type)}${o.region ? ' · '+o.region : ''})</option>`).join('');
  }
  openModal('modal-shipment');
  if (shipmentScanIn) setTimeout(() => shipmentScanIn.focus(), 100);
}

function renderShipmentList() {
  const shipmentList = $('shipment-cylinder-list');
  if (!shipmentList) return;
  if (!_shipmentScannedCyls.length) {
    shipmentList.innerHTML = '<p style="font-size:13px;color:var(--dim);padding:8px 0">No cylinders scanned yet.</p>';
    return;
  }
  const statusLabels = { 'in-stock':'In Stock','in-refill':'In Refill','in-circulation':'In Circulation','revalidation':'Revalidation','in-use':'In Use','retired':'Retired' };
  shipmentList.innerHTML = _shipmentScannedCyls.map(({id, cyl}, idx) => {
    const statusLabel = statusLabels[cyl?.status] || cyl?.status || '—';
    return `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--surface2);border-radius:6px;margin-bottom:6px">
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-family:var(--font-mono);color:var(--text)">${escapeHtml(id)}</div>
        ${cyl ? `<div style="font-size:11px;color:var(--dim);margin-top:2px">${escapeHtml(cyl.serial || '—')} · ${escapeHtml(cyl.ownerCompany || cyl.company || '—')} · <span style="color:var(--text-secondary)">${escapeHtml(statusLabel)}</span></div>` : ''}
      </div>
      <button class="btn btn-sm" style="background:none;color:var(--red);padding:2px 8px;min-width:0" data-remove-idx="${idx}">✕</button>
    </div>`;
  }).join('');
  shipmentList.querySelectorAll('[data-remove-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      _shipmentScannedCyls.splice(parseInt(btn.dataset.removeIdx), 1);
      renderShipmentList();
    });
  });
}

async function addToShipment(tagId) {
  if (!tagId) return;
  if (_shipmentScannedCyls.some(c => c.id === tagId)) { showSnackbar('Already in shipment list.', 'warning'); return; }
  const cyl = await txGet('cylinders', tagId);
  if (!cyl) { showSnackbar(`Tag "${tagId}" not found.`, 'error'); return; }
  _shipmentScannedCyls.push({ id: tagId, cyl });
  renderShipmentList();
  const inp = $('shipment-scan-input');
  if (inp) { inp.value = ''; inp.focus(); }
}

const _shipmentBtnEl = $('shipment-btn');
if (_shipmentBtnEl) _shipmentBtnEl.addEventListener('click', openShipmentModal);

const _shipmentAddBtn = $('shipment-add-btn');
if (_shipmentAddBtn) _shipmentAddBtn.addEventListener('click', () => {
  const inp = $('shipment-scan-input');
  if (inp) addToShipment(inp.value.trim());
});

const _shipmentScanInput = $('shipment-scan-input');
if (_shipmentScanInput) _shipmentScanInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); addToShipment(_shipmentScanInput.value.trim()); }
});

const _shipmentConfirmBtn = $('shipment-confirm-btn');
if (_shipmentConfirmBtn) _shipmentConfirmBtn.addEventListener('click', async () => {
  const dest = $('shipment-dest')?.value?.trim();
  if (!dest) { showSnackbar('Please select a destination.', 'error'); return; }
  if (!_shipmentScannedCyls.length) { showSnackbar('No cylinders scanned.', 'error'); return; }
  const destOpt = $('shipment-dest')?.querySelector(`option[value="${CSS.escape(dest)}"]`);
  const destRegion = destOpt?.dataset.region || '';
  const ts = new Date().toISOString();
  const company = Auth.session?.company || '';
  const notes = $('shipment-notes')?.value?.trim() || '';
  const isConsumerSale = $('shipment-consumer-sale-chk')?.checked || false;
  const consumerId = $('shipment-consumer-id')?.value?.trim() || '';
  for (const { id: tagId } of _shipmentScannedCyls) {
    const cyl = await txGet('cylinders', tagId);
    if (!cyl) continue;
    const evType = isConsumerSale ? 'ret-sold' : 'shipped';
    const evRecord = {
      id: crypto.randomUUID(), cylinderId: tagId, type: evType, timestamp: ts,
      operatorId: Auth.session?.operatorId || 'SYSTEM',
      company, location: company, destinedFor: dest, destinedRegion: destRegion,
    };
    if (notes) evRecord.notes = notes;
    if (isConsumerSale && consumerId) evRecord.consumerId = consumerId;
    await txPut('events', evRecord);
    cyl.status = isConsumerSale ? 'in-use' : 'in-circulation';
    await txPut('cylinders', cyl);
  }
  const count = _shipmentScannedCyls.length;
  const label = isConsumerSale ? `Consumer sale of ${count} cylinder(s) to ${dest} confirmed.` : `Shipment of ${count} cylinder(s) to ${dest} confirmed.`;
  showSnackbar(label, 'success');
  closeModal('modal-shipment');
  renderCylinders();
});

// ══════════════════════════════════════════════════════════════════════════════
// LOGOUT
// ══════════════════════════════════════════════════════════════════════════════

document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    _lang = _lang === 'en' ? 'sw' : 'en';
    localStorage.setItem('lpg-lang', _lang);
    applyLang();
  });
});

document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    _lang = btn.dataset.lang;
    localStorage.setItem('lpg-lang', _lang);
    applyLang();
  });
});

document.querySelectorAll('.country-btn[data-country]').forEach(btn => {
  btn.classList.toggle('active', btn.dataset.country === _activeCountry);
  btn.addEventListener('click', () => {
    localStorage.setItem('lpg-country', btn.dataset.country);
    location.reload();
  });
});

// ── Mobile nav drawer ──────────────────────────────────────────────────────
const _hamburger = $('nav-hamburger');
const _navBackdrop = $('nav-backdrop');
function _openNav()  { document.body.classList.add('nav-open'); }
function _closeNav() { document.body.classList.remove('nav-open'); }
if (_hamburger) _hamburger.addEventListener('click', () =>
  document.body.classList.toggle('nav-open'));
if (_navBackdrop) _navBackdrop.addEventListener('click', _closeNav);
document.querySelectorAll('.nav-tab').forEach(tab =>
  tab.addEventListener('click', _closeNav));

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
  if (_hamburger) _hamburger.hidden = true;
  _closeNav();
  eventsList.innerHTML   = '';
  eventsEmpty.style.display = '';
  lastScanCard.hidden    = true;

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
// RECEPTION MODAL
// ══════════════════════════════════════════════════════════════════════════════

let _receptionScannedCyls = []; // [{ id, cyl }]

function openReceptionModal() {
  if (!Auth.session?.role) return;
  _receptionScannedCyls = [];
  const notesEl = $('reception-notes'); if (notesEl) notesEl.value = '';
  const scanIn  = $('reception-scan-input'); if (scanIn) scanIn.value = '';
  renderReceptionList();
  openModal('modal-reception');
  if (scanIn) setTimeout(() => scanIn.focus(), 100);
}

function renderReceptionList() {
  const list = $('reception-cylinder-list');
  if (!list) return;
  if (!_receptionScannedCyls.length) {
    list.innerHTML = '<p style="font-size:13px;color:var(--dim);padding:8px 4px">No cylinders scanned yet.</p>';
    return;
  }
  const statusLabels = { 'in-stock':'In Stock','in-refill':'In Refill','in-circulation':'In Circulation','revalidation':'Revalidation','in-use':'In Use','retired':'Retired' };
  list.innerHTML = _receptionScannedCyls.map(({ id, cyl }, idx) => {
    const sl = statusLabels[cyl?.status] || cyl?.status || '—';
    return `<div style="display:flex;align-items:center;gap:10px;padding:7px 8px;background:var(--surface2);border-radius:6px;margin-bottom:4px">
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-family:var(--font-mono);color:var(--text)">${escapeHtml(id)}</div>
        ${cyl ? `<div style="font-size:11px;color:var(--dim);margin-top:2px">${escapeHtml(cyl.serial||'—')} · ${escapeHtml(cyl.ownerCompany||cyl.company||'—')} · ${escapeHtml(sl)}</div>` : ''}
      </div>
      <button class="btn btn-sm" style="background:none;color:var(--red);padding:2px 8px;min-width:0" data-rec-remove="${idx}">✕</button>
    </div>`;
  }).join('');
  list.querySelectorAll('[data-rec-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      _receptionScannedCyls.splice(parseInt(btn.dataset.recRemove), 1);
      renderReceptionList();
    });
  });
}

async function addToReception(tagId) {
  if (!tagId) return;
  if (_receptionScannedCyls.some(c => c.id === tagId)) { showSnackbar('Already in reception list.', 'warning'); return; }
  const cyl = await txGet('cylinders', tagId);
  if (!cyl) { showSnackbar(`Tag "${tagId}" not found.`, 'error'); return; }
  _receptionScannedCyls.push({ id: tagId, cyl });
  renderReceptionList();
  const inp = $('reception-scan-input');
  if (inp) { inp.value = ''; inp.focus(); }
}

const _recBtnEl = $('reception-btn');
if (_recBtnEl) _recBtnEl.addEventListener('click', openReceptionModal);

const _recAddBtn = $('reception-add-btn');
if (_recAddBtn) _recAddBtn.addEventListener('click', () => {
  const inp = $('reception-scan-input');
  if (inp) addToReception(inp.value.trim());
});

const _recScanInput = $('reception-scan-input');
if (_recScanInput) _recScanInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); addToReception(_recScanInput.value.trim()); }
});

const _recConfirmBtn = $('reception-confirm-btn');
if (_recConfirmBtn) _recConfirmBtn.addEventListener('click', async () => {
  if (!_receptionScannedCyls.length) { showSnackbar('No cylinders scanned.', 'error'); return; }
  const role    = Auth.session?.role;
  const company = Auth.session?.company || '';
  const notes   = $('reception-notes')?.value?.trim() || '';
  const ts      = new Date().toISOString();
  const evType  = role === 'retailer' ? 'ret-received' : role === 'distributor' ? 'dist-received' : 'received-empty';
  for (const { id: tagId } of _receptionScannedCyls) {
    const cyl = await txGet('cylinders', tagId);
    if (!cyl) continue;
    const ev = {
      id: crypto.randomUUID(), cylinderId: tagId, type: evType, timestamp: ts,
      operatorId: Auth.session?.operatorId || 'SYSTEM',
      company, location: company,
    };
    if (notes) ev.notes = notes;
    await txPut('events', ev);
    cyl.status = 'in-stock';
    await txPut('cylinders', cyl);
  }
  showSnackbar(`Reception of ${_receptionScannedCyls.length} cylinder(s) confirmed.`, 'success');
  closeModal('modal-reception');
  renderCylinders();
});

// ══════════════════════════════════════════════════════════════════════════════
// BULLET TANKS VIEW (EWURA)
// ══════════════════════════════════════════════════════════════════════════════


async function renderBulkMonitor() {
  const listEl = $('bulk-tanker-list');
  if (!listEl) return;

  const statusCssColor = { 'in-transit':'var(--blue)', 'at-terminal':'var(--amber)', 'delivered':'var(--green)', 'loading':'var(--purple)' };
  const tankerHexColor = { 'in-transit':'#3b82f6', 'delivered':'#22c55e', 'loading':'#a855f7', 'at-terminal':'#f59e0b' };
  const tankerSym      = { 'in-transit':'▶', 'at-terminal':'H', 'delivered':'✓', 'loading':'↑' };
  function statusLbl(s) { return t('status.' + { 'in-transit':'inTransit', 'at-terminal':'atTerminal', 'delivered':'delivered', 'loading':'loading' }[s]) || s; }

  listEl.innerHTML = DEMO_BULK_TANKERS.map(tk => `
    <li class="network-item" style="cursor:default">
      <div class="network-item-header">
        <span class="network-item-name">${escapeHtml(tk.plate)}</span>
        <span class="network-type-badge" style="background:${statusCssColor[tk.status]||'var(--muted)'};color:#fff">${statusLbl(tk.status)}</span>
      </div>
      <div class="network-item-meta">
        🏭 ${escapeHtml(tk.operator)} · 🛢 ${escapeHtml(tk.capacity)}<br>
        📍 ${escapeHtml(tk.from)} → ${escapeHtml(tk.to)}<br>
        🚀 ${tk.speed > 0 ? tk.speed + ' km/h · ' : ''}Updated: ${escapeHtml(tk.lastUpdate)}
        ${tk.routePct > 0 && tk.routePct < 100 ? `· <span style="color:var(--blue)">${tk.routePct}% route complete</span>` : ''}
      </div>
    </li>`).join('');

  const mapEl = $('bulk-map');
  if (!mapEl) return;

  const markers = DEMO_BULK_TANKERS.map(tk => ({
    lat: tk.lat, lng: tk.lng,
    color: tankerHexColor[tk.status] || '#6b7280',
    symbol: tankerSym[tk.status] || '●',
    pulse: tk.status === 'in-transit',
    big: true,
    tooltip: `${tk.plate} · ${tk.operator} · ${statusLbl(tk.status)} · ${tk.capacity}`,
  }));
  const legend = [
    { color:'#3b82f6', label:'In Transit' }, { color:'#f59e0b', label:'At Terminal' },
    { color:'#22c55e', label:'Delivered' },  { color:'#a855f7', label:'Loading' },
  ];
  mapEl.innerHTML = buildInteractiveMap('bulkmap', markers, legend, 360);
  initInteractiveMap('bulkmap', markers);
}

// ══════════════════════════════════════════════════════════════════════════════
// LPG DISTRIBUTION LICENCE APPLICATION
// ══════════════════════════════════════════════════════════════════════════════

(function initLicenceApp() {
  const overlay   = document.getElementById('license-apply-overlay');
  const openBtn   = document.getElementById('license-apply-open-btn');
  const backBtn   = document.getElementById('license-apply-back-btn');
  const backBtn2  = document.getElementById('license-apply-back-btn2');
  const saveBtn   = document.getElementById('license-apply-save-btn');
  const submitBtn = document.getElementById('license-apply-submit-btn');
  if (!overlay) return;

  const SECTIONS = {
    'la-docs-corp': [
      { id:'corp-biz',  label:'Business Licence',                                    required:true  },
      { id:'corp-inc',  label:'Certificate of Incorporation',                         required:true  },
      { id:'corp-comp', label:'Certificate of Compliance',                            required:false, note:'Required for foreign companies' },
      { id:'corp-maa',  label:'Memorandum and Articles of Association',               required:true  },
      { id:'corp-tin',  label:'TIN Certificate',                                      required:true  },
      { id:'corp-vat',  label:'VAT Certificate',                                      required:true  },
    ],
    'la-docs-land': [
      { id:'land-permit',label:'Building Permit',                                     required:true  },
      { id:'land-title', label:'Land Title Deed',                                     required:true  },
      { id:'land-lease', label:'Lease Agreement',                                     required:false, note:'Required if applicant is not the land owner' },
    ],
    'la-docs-tech': [
      { id:'tech-plant', label:'Proof of Ownership or Hospitality Agreement for Filling Plant & Storage Depot', required:true  },
      { id:'tech-staff', label:'Personnel Profile (demonstrating adequate skilled personnel)',                   required:true  },
      { id:'tech-deal',  label:'Dealership Agreement with a licensed LPG Wholesaler',                           required:true  },
      { id:'tech-list',  label:'List of LPG Dealers with Dealership Agreements',                                required:true  },
    ],
    'la-docs-fin': [
      { id:'fin-audit',  label:'Audited Financial Statement',                                                   required:false },
      { id:'fin-bank',   label:'Bank Statement',                                                                 required:false },
      { id:'fin-guar',   label:'Bank Guarantee or Credit Facility',                                              required:false },
      { id:'fin-letter', label:'Letter of Comfort from Licensed Bank / Financial Institution',                  required:false },
    ],
    'la-docs-hse': [
      { id:'hse-eia',    label:'EIA Certificate from NEMC (Environmental Impact Assessment)',                   required:true  },
      { id:'hse-osha',   label:'OSHA Certificate',                                                              required:true  },
      { id:'hse-fire',   label:'Fire Safety Certificate (from Fire Department)',                                 required:true  },
    ],
    'la-docs-admin': [
      { id:'adm-pledge', label:'Integrity Pledge Form — Form No. 3 (duly filled and signed)',                   required:true  },
      { id:'adm-fee',    label:'Proof of Payment of non-refundable Application Fee',                            required:true  },
      { id:'adm-mou',    label:'Memoranda of Understanding (governing commercial transactions)',                 required:false, note:'If applicable' },
    ],
  };

  function buildDocRow(doc) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9';
    row.innerHTML = `
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:${doc.note ? '2px' : '0'}">
          <span style="font-size:13px;font-weight:500;color:#1e293b">${escapeHtml(doc.label)}</span>
          ${doc.required ? '<span style="color:#ef4444;font-size:11px;font-weight:600">*</span>' : `<span style="font-size:10px;color:#94a3b8;background:#f1f5f9;padding:1px 6px;border-radius:4px">${t('licApp.optional')}</span>`}
        </div>
        ${doc.note ? `<div style="font-size:11px;color:#94a3b8;margin-bottom:4px">${escapeHtml(doc.note)}</div>` : ''}
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
          <label style="display:inline-flex;align-items:center;gap:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:12px;color:#475569;white-space:nowrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            ${t('licApp.attachFile')}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="display:none" data-doc-id="${escapeHtml(doc.id)}" class="la-file-input" />
          </label>
          <span class="la-file-name" data-for="${escapeHtml(doc.id)}" style="font-size:11px;color:#94a3b8;font-style:italic">${t('licApp.noFile')}</span>
        </div>
      </div>
      <div style="flex-shrink:0;width:22px;height:22px;margin-top:2px">
        <svg class="la-doc-check" data-doc="${escapeHtml(doc.id)}" width="22" height="22" viewBox="0 0 22 22" style="display:none">
          <circle cx="11" cy="11" r="10" fill="#22c55e" opacity="0.15"/>
          <circle cx="11" cy="11" r="10" fill="none" stroke="#22c55e" stroke-width="1.5"/>
          <polyline points="6,11 10,15 16,7" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg class="la-doc-empty" data-doc="${escapeHtml(doc.id)}" width="22" height="22" viewBox="0 0 22 22">
          <circle cx="11" cy="11" r="10" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
        </svg>
      </div>`;
    return row;
  }

  Object.entries(SECTIONS).forEach(([containerId, docs]) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    docs.forEach(doc => el.appendChild(buildDocRow(doc)));
  });

  overlay.addEventListener('change', e => {
    const inp = e.target;
    if (!inp.classList.contains('la-file-input')) return;
    const docId = inp.dataset.docId;
    const nameEl = overlay.querySelector(`.la-file-name[data-for="${docId}"]`);
    const checkEl = overlay.querySelector(`.la-doc-check[data-doc="${docId}"]`);
    const emptyEl = overlay.querySelector(`.la-doc-empty[data-doc="${docId}"]`);
    if (inp.files && inp.files[0]) {
      if (nameEl) { nameEl.textContent = inp.files[0].name; nameEl.style.color = '#22c55e'; nameEl.style.fontStyle = 'normal'; nameEl.style.fontWeight = '500'; }
      if (checkEl) checkEl.style.display = '';
      if (emptyEl) emptyEl.style.display = 'none';
    } else {
      if (nameEl) { nameEl.textContent = t('licApp.noFile'); nameEl.style.color = '#94a3b8'; nameEl.style.fontStyle = 'italic'; nameEl.style.fontWeight = ''; }
      if (checkEl) checkEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = '';
    }
    updateProgress();
  });

  overlay.addEventListener('input', e => { if (e.target.hasAttribute('data-la-required')) updateProgress(); });

  function updateProgress() {
    const reqFields = overlay.querySelectorAll('[data-la-required]');
    let filledFields = 0;
    reqFields.forEach(f => { if (f.value && f.value.trim()) filledFields++; });

    const finInputs = overlay.querySelectorAll('#la-docs-fin .la-file-input');
    let finAttached = 0;
    finInputs.forEach(i => { if (i.files && i.files[0]) finAttached++; });

    let reqDocs = 0, attachedDocs = 0;
    Object.entries(SECTIONS).forEach(([, docs]) => {
      docs.filter(d => d.required).forEach(doc => {
        if (doc.id.startsWith('fin-')) return;
        reqDocs++;
        const inp = overlay.querySelector(`input[data-doc-id="${doc.id}"]`);
        if (inp && inp.files && inp.files[0]) attachedDocs++;
      });
    });

    const total = reqFields.length + reqDocs + 1;
    const done  = filledFields + attachedDocs + (finAttached > 0 ? 1 : 0);
    const pct   = Math.round(done / total * 100);
    const bar   = document.getElementById('license-apply-bar');
    const pctEl = document.getElementById('license-apply-pct');
    if (bar) { bar.style.width = pct + '%'; bar.style.background = pct === 100 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#3b82f6'; }
    if (pctEl) { pctEl.textContent = pct + '%'; pctEl.style.color = pct === 100 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#3b82f6'; }
  }

  function openOverlay() { overlay.style.display = 'block'; overlay.scrollTop = 0; updateProgress(); applyLang(); }
  function closeOverlay() { overlay.style.display = 'none'; }

  if (openBtn)  openBtn.addEventListener('click', openOverlay);
  if (backBtn)  backBtn.addEventListener('click', closeOverlay);
  if (backBtn2) backBtn2.addEventListener('click', closeOverlay);

  if (saveBtn) saveBtn.addEventListener('click', () => {
    const draft = {};
    overlay.querySelectorAll('[id^="la-"]').forEach(el => { if (el.type !== 'file' && el.id) draft[el.id] = el.value || ''; });
    localStorage.setItem('lpg-licence-draft', JSON.stringify(draft));
    const orig = saveBtn.textContent;
    saveBtn.textContent = t('licApp.draftSaved');
    saveBtn.style.color = '#22c55e';
    setTimeout(() => { saveBtn.textContent = t('licApp.saveDraft'); saveBtn.style.color = ''; }, 2000);
  });

  const savedDraft = localStorage.getItem('lpg-licence-draft');
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      Object.entries(draft).forEach(([id, val]) => { const el = document.getElementById(id); if (el && el.type !== 'file') el.value = val; });
    } catch {}
  }

  if (submitBtn) submitBtn.addEventListener('click', () => {
    const company = (document.getElementById('la-company') || {}).value?.trim();
    if (!company) { alert(t('licApp.noCompany')); document.getElementById('la-company')?.focus(); return; }
    const finInputs = overlay.querySelectorAll('#la-docs-fin .la-file-input');
    let finAttached = 0;
    finInputs.forEach(i => { if (i.files && i.files[0]) finAttached++; });
    if (finAttached === 0) { alert(t('licApp.noFinancial')); document.getElementById('la-docs-fin')?.scrollIntoView({ behavior: 'smooth' }); return; }

    const safeCompany = escapeHtml(company);
    overlay.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px">
        <div style="max-width:520px;text-align:center">
          <div style="font-size:56px;margin-bottom:20px">✅</div>
          <h2 style="font-size:22px;font-weight:700;color:#0f172a;margin:0 0 12px" data-i18n="licApp.successTitle">${t('licApp.successTitle')}</h2>
          <p style="font-size:14px;color:#475569;margin:0 0 8px">${t('licApp.successMsg1').replace('{{company}}', safeCompany)}</p>
          <p style="font-size:13px;color:#64748b;margin:0 0 28px">${t('licApp.successMsg2')}</p>
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;font-size:12px;color:#1d4ed8;margin-bottom:28px;text-align:left">${t('licApp.successNext')}</div>
          <button type="button" onclick="document.getElementById('license-apply-overlay').style.display='none'" style="background:#3b82f6;color:#fff;border:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">
            ${t('licApp.backToLogin')}
          </button>
        </div>
      </div>`;
    overlay.scrollTop = 0;
    localStorage.removeItem('lpg-licence-draft');
  });
})();

// ══════════════════════════════════════════════════════════════════════════════
// MARKET INTELLIGENCE (EWURA)
// ══════════════════════════════════════════════════════════════════════════════

async function renderMarketIntel() {
  const el = $('view-market-intel');
  if (!el) return;
  const cyls = await txGetAll('cylinders');
  const events = await txGetAll('events');

  const regions = ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Tanga'];
  const regCounts = {};
  regions.forEach(r => { regCounts[r] = 0; });
  DEMO_NETWORK.forEach(n => { if (regCounts[n.region] !== undefined) regCounts[n.region] += (n.cylinders || 0); });
  const maxReg = Math.max(...Object.values(regCounts), 1);
  const regionBars = regions.map(r => {
    const pct = Math.round((regCounts[r] / maxReg) * 100);
    return `<div class="mgmt-bar-row">
      <span class="mgmt-bar-label" style="min-width:110px">${escapeHtml(r)}</span>
      <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${pct}%;background:var(--blue)"><span>${regCounts[r]}</span></div></div>
    </div>`;
  }).join('');

  const statusCounts = { 'in-refill': 0, 'in-circulation': 0, 'revalidation': 0, 'in-use': 0 };
  cyls.forEach(c => { if (statusCounts[c.status] !== undefined) statusCounts[c.status]++; });
  const statusColors2 = { 'in-refill':'var(--green)', 'in-circulation':'var(--blue)', 'revalidation':'var(--teal,#0d9488)', 'in-use':'var(--purple)' };
  const statusLabels2 = { 'in-refill':t('marketIntel.atRefill'), 'in-circulation':t('marketIntel.inDist'), 'revalidation':t('marketIntel.inReval'), 'in-use':t('marketIntel.withConsumer') };
  const maxStat = Math.max(...Object.values(statusCounts), 1);
  const statBars = Object.entries(statusCounts).map(([k, v]) => {
    const pct = Math.round((v / maxStat) * 100);
    return `<div class="mgmt-bar-row">
      <span class="mgmt-bar-label" style="min-width:130px">${escapeHtml(statusLabels2[k])}</span>
      <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${pct}%;background:${statusColors2[k]}"><span>${v}</span></div></div>
    </div>`;
  }).join('');

  const now = new Date();
  // Single-pass month bucketing instead of 6 separate filter calls
  const _monthCounts = {};
  for (const ev of events) {
    const ed = new Date(ev.timestamp);
    const k = ed.getFullYear() * 100 + ed.getMonth();
    _monthCounts[k] = (_monthCounts[k] || 0) + 1;
  }
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    const count = _monthCounts[d.getFullYear() * 100 + d.getMonth()] || 0;
    months.push({ label, count });
  }
  const maxScan = Math.max(...months.map(m => m.count), 1);
  const scanBars = months.map(m => {
    const pct = Math.round((m.count / maxScan) * 100);
    return `<div class="mgmt-bar-row">
      <span class="mgmt-bar-label" style="min-width:40px">${escapeHtml(m.label)}</span>
      <div class="mgmt-bar-track"><div class="mgmt-bar-fill" style="width:${pct}%;background:var(--blue)"><span>${m.count}</span></div></div>
    </div>`;
  }).join('');

  const activeOps = DEMO_NETWORK.filter(n => n.status === 'active').length;
  const licActive = (await txGetAll('licenses')).filter(l => l.status === 'active').length;

  const body = el.querySelector('#market-intel-body');
  if (!body) return;
  body.innerHTML = `
    <div class="mgmt-grid">
      <div class="mgmt-card" style="grid-column:span 2">
        <div class="mgmt-card-header">
          <div class="mgmt-card-title">${t('marketIntel.summary')}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
          <div style="background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--blue)">${cyls.length}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">${t('marketIntel.totalCyls')}</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--green)">${activeOps}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">${t('marketIntel.activeOps')}</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--amber)">${licActive}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">${t('marketIntel.activeLic')}</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:28px;font-weight:700;color:var(--purple)">${events.length}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">${t('marketIntel.totalEvents')}</div>
          </div>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-card-header"><div class="mgmt-card-title">${t('marketIntel.byRegion')}</div></div>
        ${regionBars}
      </div>
      <div class="mgmt-card">
        <div class="mgmt-card-header"><div class="mgmt-card-title">${t('marketIntel.scanVolume')}</div></div>
        ${scanBars}
      </div>
      <div class="mgmt-card">
        <div class="mgmt-card-header"><div class="mgmt-card-title">${t('marketIntel.statusBreakdown')}</div></div>
        ${statBars}
      </div>
    </div>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// FIELD INSPECTIONS (EWURA)
// ══════════════════════════════════════════════════════════════════════════════

async function renderInspections() {
  const listEl = $('inspections-list');
  if (!listEl) return;
  const inspections = await txGetAll('inspections');
  const statusOrder = { overdue: 0, scheduled: 1, completed: 2 };
  const sorted = [...inspections].sort((a, b) => {
    const so = (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
    if (so !== 0) return so;
    return new Date(a.scheduledDate) - new Date(b.scheduledDate);
  });
  const statusPill = s => {
    const colors = { overdue: 'background:#fef2f2;color:#dc2626;border:1px solid #fca5a5', scheduled: 'background:#eff6ff;color:#2563eb;border:1px solid #93c5fd', completed: 'background:#f0fdf4;color:#16a34a;border:1px solid #86efac' };
    const label = t('insp.status.' + s) || s;
    return `<span style="padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;${colors[s] || ''}">${escapeHtml(label)}</span>`;
  };
  listEl.innerHTML = sorted.map(ins => `
    <li style="background:var(--surface2);border-radius:10px;padding:14px 16px;margin-bottom:10px;list-style:none;display:flex;gap:12px;align-items:flex-start">
      <div style="flex:1">
        <div style="font-weight:600;margin-bottom:4px">${escapeHtml(ins.company)} <span style="color:var(--muted);font-weight:400">· ${escapeHtml(ins.region)}</span></div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:4px">Auditor: ${escapeHtml(ins.auditor)} &nbsp;·&nbsp; Date: ${escapeHtml(ins.scheduledDate)}</div>
        <div style="font-size:12px;color:var(--dim)">${escapeHtml(ins.notes)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">${statusPill(ins.status)}<span style="font-size:11px;color:var(--muted)">${escapeHtml(ins.id)}</span></div>
    </li>`).join('');

  const inspMapEl = $('inspections-map');
  if (inspMapEl) {
    const statusColor = { overdue:'#dc2626', scheduled:'#3b82f6', completed:'#22c55e' };
    const inspMarkers = inspections.map(ins => {
      const net = DEMO_NETWORK.find(n => n.name === ins.company || n.region === ins.region);
      const rc  = REGION_CENTROIDS[ins.region];
      if (!net && !rc) return null;
      const lat = net ? net.lat : rc[0];
      const lng = net ? net.lng : rc[1];
      return { lat, lng, color: statusColor[ins.status] || '#6b7280', pulse: ins.status === 'overdue',
        tooltip: `${ins.company} · ${ins.region} · ${ins.status} · ${ins.scheduledDate}` };
    }).filter(Boolean);
    const inspLegend = [{ color:'#dc2626', label:'Overdue' }, { color:'#3b82f6', label:'Scheduled' }, { color:'#22c55e', label:'Completed' }];
    inspMapEl.innerHTML = buildInteractiveMap('inspmap', inspMarkers, inspLegend, 280);
    initInteractiveMap('inspmap', inspMarkers);
  }
}

$('new-inspection-btn')?.addEventListener('click', () => { openModal('modal-new-inspection'); });

$('save-inspection-btn')?.addEventListener('click', async () => {
  const company  = $('insp-company')?.value.trim();
  const region   = $('insp-region')?.value.trim();
  const auditor  = $('insp-auditor')?.value.trim();
  const date     = $('insp-date')?.value;
  const notes    = $('insp-notes')?.value.trim();
  if (!company || !date) { showSnackbar('Company and date are required.', 'error'); return; }
  const all = await txGetAll('inspections');
  const newId = 'INS-' + String(all.length + 1).padStart(3, '0');
  await txPut('inspections', { id: newId, company, region, auditor, scheduledDate: date, status: 'scheduled', notes: notes || '' });
  closeModal('modal-new-inspection');
  renderInspections();
  showSnackbar(t('insp.scheduledOk'), 'success');
});

// ══════════════════════════════════════════════════════════════════════════════
// BULK CYLINDER REGISTRATION (LPGMC)
// ══════════════════════════════════════════════════════════════════════════════

$('bulk-register-btn')?.addEventListener('click', () => {
  const textarea = $('bulk-register-ids');
  if (textarea) textarea.value = '';
  const preview = $('bulk-register-preview');
  if (preview) preview.textContent = '';
  openModal('modal-bulk-register');
});

function parseBulkIds(text) {
  return [...new Set(
    text.split(/[\r\n,;\t ]+/).map(s => s.trim()).filter(s => s.length === 22 && s.startsWith('E280116060'))
  )];
}

$('bulk-register-ids')?.addEventListener('input', function() {
  const ids = parseBulkIds(this.value);
  const preview = $('bulk-register-preview');
  if (preview) preview.textContent = ids.length ? `${ids.length} ${t('bulk.validIds')}` : t('bulk.noValidIds');
});

$('bulk-register-file')?.addEventListener('change', async function() {
  const file = this.files?.[0];
  if (!file) return;
  const text = await file.text();
  const ta = $('bulk-register-ids');
  if (ta) { ta.value = text; ta.dispatchEvent(new Event('input')); }
});

$('bulk-register-confirm-btn')?.addEventListener('click', async () => {
  const ta = $('bulk-register-ids');
  const ids = parseBulkIds(ta?.value || '');
  if (!ids.length) { showSnackbar('No valid cylinder IDs found.', 'error'); return; }
  const today = new Date().toISOString().slice(0, 10);
  let registered = 0;
  for (const id of ids) {
    const existing = await txGet('cylinders', id);
    if (existing) continue;
    const serial = 'CYL-' + id.slice(-8);
    await txPut('cylinders', { id, serial, company: Auth.session?.company || 'LPGMC', size: '13kg', status: 'in-refill', fillCount: 0, manufactureDate: today });
    await txPut('events', { cylinderId: id, type: 'registered', timestamp: nowISO(), operatorId: Auth.session?.operatorId, company: Auth.session?.company, notes: 'Bulk registered via CSV' });
    registered++;
  }
  closeModal('modal-bulk-register');
  showSnackbar(`${registered} cylinder${registered !== 1 ? 's' : ''} registered`, 'success');
  renderCylinders();
});

// ══════════════════════════════════════════════════════════════════════════════
// CYLINDER RECALL WORKFLOW (EWURA)
// ══════════════════════════════════════════════════════════════════════════════

const _RECALL_SEEDS_TZ = [
  { id:'RCL-TZ-2024-117', operator:'Vivo LPG',       batch:'BATCH-2024-117', dateFrom:'2023-01-01', dateTo:'2023-06-30', severity:'critical', reason:'Valve manufacturing defect detected — risk of gas leakage under pressure. Immediate withdrawal from all distribution points required.', timestamp:'2024-03-15T08:30:00Z' },
  { id:'RCL-TZ-2025-042', operator:'Total Energies',  batch:'BATCH-2025-042', dateFrom:'2024-07-01', dateTo:'2024-12-31', severity:'high',     reason:'Cylinder neck thread non-conformance identified during quality audit. Withdraw within 48 hours and return to manufacturer for inspection.', timestamp:'2025-01-22T10:00:00Z' },
  { id:'RCL-TZ-2025-088', operator:'Shell Gas',       batch:'BATCH-2025-088', dateFrom:'',           dateTo:'',           severity:'medium',    reason:'Incorrect tare weight stamping on a sub-batch of 6 kg cylinders. Controlled recall for re-stamping — no immediate safety risk.', timestamp:'2025-06-05T14:15:00Z' },
  { id:'RCL-TZ-2025-201', operator:'Lake Gas',        batch:'BATCH-2025-201', dateFrom:'2025-01-01', dateTo:'2025-03-31', severity:'high',     reason:'Pressure relief valve spring fatigue identified in a production batch. Potential over-pressurisation risk — withdraw within 48 hours.', timestamp:'2025-08-10T09:00:00Z' },
];

const _RECALL_SEEDS_KE = [
  { id:'RCL-KE-2024-031', operator:'Total Energies Kenya', batch:'BATCH-KE-2024-031', dateFrom:'2023-03-01', dateTo:'2023-09-30', severity:'critical', reason:'Weld seam integrity failure detected on 13 kg cylinders manufactured in this period. Risk of sudden rupture. Immediate withdrawal required.', timestamp:'2024-06-12T07:45:00Z' },
  { id:'RCL-KE-2025-018', operator:'Vivo Energy Kenya',    batch:'BATCH-KE-2025-018', dateFrom:'2024-08-01', dateTo:'2024-11-30', severity:'high',     reason:'Foot ring detachment risk due to incorrect welding parameter during production run. Withdraw within 48 hours for inspection.', timestamp:'2025-02-28T11:30:00Z' },
  { id:'RCL-KE-2025-055', operator:'Africa Gas & Oil',     batch:'BATCH-KE-2025-055', dateFrom:'',           dateTo:'',           severity:'medium',    reason:'Tare weight label discrepancy on 6 kg cylinders — incorrect net weight printed. Controlled recall for re-labelling, no safety risk.', timestamp:'2025-05-19T13:00:00Z' },
  { id:'RCL-KE-2025-091', operator:'Hashi Energy',         batch:'BATCH-KE-2025-091', dateFrom:'2025-02-01', dateTo:'2025-04-30', severity:'high',     reason:'Batch of valve handwheels found with sub-specification torque rating. Withdraw from retailers within 48 hours for valve replacement.', timestamp:'2025-07-30T08:15:00Z' },
];

function _recallKey() { return 'lpg-recalls-' + _activeCountry; }

function renderRecalls() {
  const container = $('recalls-container');
  if (!container) return;

  // Seed demo data once per country
  const seeds = _activeCountry === 'KE' ? _RECALL_SEEDS_KE : _RECALL_SEEDS_TZ;
  let recalls = JSON.parse(localStorage.getItem(_recallKey()) || 'null');
  if (!recalls) {
    recalls = seeds.slice();
    localStorage.setItem(_recallKey(), JSON.stringify(recalls));
  }

  const sevColor  = { critical:'#dc2626', high:'#ea580c', medium:'#d97706' };
  const sevLabel  = { critical:'🔴 Critical', high:'🟠 High', medium:'🟡 Medium' };
  const impactHtml = recalls.length ? recalls.slice().reverse().map((r, revIdx) => {
    const sev   = r.severity || 'high';
    const color = sevColor[sev] || '#dc2626';
    const origIdx = recalls.length - 1 - revIdx;
    const dateRange = (r.dateFrom && r.dateTo) ? `${escapeHtml(r.dateFrom)} → ${escapeHtml(r.dateTo)}` : (r.dateFrom || r.dateTo || 'All batches');
    return `<div style="background:var(--surface2);border-radius:10px;padding:14px 16px;margin-bottom:10px;border-left:4px solid ${color}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <span style="font-weight:700;font-family:monospace;font-size:13px">${escapeHtml(r.id)}</span>
            <span style="background:${color}22;color:${color};border:1px solid ${color}55;border-radius:20px;padding:1px 8px;font-size:11px;font-weight:600">${sevLabel[sev] || sev}</span>
          </div>
          <div style="font-weight:600;margin-bottom:4px">${escapeHtml(r.operator)}</div>
          ${r.batch ? `<div style="font-size:12px;color:var(--muted);margin-bottom:2px">Batch: <span style="font-family:monospace">${escapeHtml(r.batch)}</span></div>` : ''}
          <div style="font-size:12px;color:var(--muted);margin-bottom:6px">Manufacture period: ${dateRange}</div>
          <div style="font-size:13px;color:var(--text)">${escapeHtml(r.reason)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">
          <span style="font-size:11px;color:var(--muted)">${r.timestamp ? r.timestamp.slice(0,10) : ''}</span>
          <button class="btn btn-outline recall-delete-btn" data-recall-idx="${origIdx}" type="button" style="font-size:11px;padding:3px 9px;color:var(--red);border-color:var(--red)">Delete</button>
        </div>
      </div>
    </div>`;
  }).join('') : `<p style="color:var(--muted);font-size:13px">No recalls issued.</p>`;

  container.innerHTML = impactHtml;

  container.querySelectorAll('.recall-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = +btn.dataset.recallIdx;
      const list = JSON.parse(localStorage.getItem(_recallKey()) || '[]');
      list.splice(idx, 1);
      localStorage.setItem(_recallKey(), JSON.stringify(list));
      renderRecalls();
      showSnackbar('Recall deleted.', 'success');
    });
  });
}

$('recall-new-btn')?.addEventListener('click', () => {
  const yr  = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 900) + 100);
  const ref = $('recall-ref');
  if (ref) ref.value = `RCL-${_activeCountry}-${yr}-${seq}`;

  // Populate operator list for active country
  const opSel = $('recall-operator');
  if (opSel) {
    const companies = _activeCountry === 'KE' ? LPGMC_COMPANIES_KE : LPGMC_COMPANIES;
    opSel.innerHTML = `<option value="" data-i18n="recall.selectOp">${t('recall.selectOp')}</option>` +
      companies.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  }

  openModal('modal-recall');
});

// Preview map for recall modal
let _recallPreviewMap = null;
$('recall-preview-btn')?.addEventListener('click', () => {
  const operator = $('recall-operator')?.value;
  const pane = $('recall-preview-map');
  const info = $('recall-preview-info');
  if (!pane) return;

  pane.style.display = 'block';

  if (_recallPreviewMap) { _recallPreviewMap.remove(); _recallPreviewMap = null; }

  const _net = _activeCountry === 'KE' ? DEMO_NETWORK_KE : DEMO_NETWORK;
  const locs = _net.filter(n => !operator || n.owner === operator || n.name.includes(operator));
  const allLocs = locs.length ? locs : _net.slice(0, 8);

  if (typeof L === 'undefined') {
    pane.innerHTML = '<div style="height:240px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px">Map requires an internet connection.</div>';
    return;
  }

  _recallPreviewMap = L.map('recall-preview-lmap', { zoomControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(_recallPreviewMap);

  const latlngs = [];
  allLocs.forEach(n => {
    if (!n.lat || !n.lng) return;
    latlngs.push([n.lat, n.lng]);
    L.circleMarker([n.lat, n.lng], { radius: 9, fillColor:'#dc2626', color:'white', weight:2.5, fillOpacity:0.9 })
      .bindTooltip(escapeHtml(n.name + ' · ' + (n.city || '')), { direction:'top' })
      .addTo(_recallPreviewMap);
  });

  if (latlngs.length > 1) _recallPreviewMap.fitBounds(latlngs, { padding:[30,30], maxZoom:9 });
  else if (latlngs.length === 1) _recallPreviewMap.setView(latlngs[0], 9);
  else _recallPreviewMap.setView([-6.5, 35], 5);

  if (info) info.textContent = `${allLocs.length} location${allLocs.length !== 1 ? 's' : ''} tracked in the platform${operator ? ' for ' + operator : ''}.`;
});

$('recall-submit-btn')?.addEventListener('click', () => {
  const operator  = $('recall-operator')?.value;
  const batch     = $('recall-batch')?.value.trim();
  const dateFrom  = $('recall-date-from')?.value;
  const dateTo    = $('recall-date-to')?.value;
  const severity  = $('recall-severity')?.value || 'high';
  const reason    = $('recall-reason')?.value.trim();
  const ref       = $('recall-ref')?.value || ('RCL-' + new Date().getFullYear() + '-' + Date.now());
  if (!operator || !reason) {
    showSnackbar('Operator and reason are required.', 'error'); return;
  }
  const recalls = JSON.parse(localStorage.getItem(_recallKey()) || '[]');
  recalls.push({ id: ref, operator, batch, dateFrom, dateTo, severity, reason, timestamp: new Date().toISOString() });
  localStorage.setItem(_recallKey(), JSON.stringify(recalls));
  // Reset preview state
  if (_recallPreviewMap) { _recallPreviewMap.remove(); _recallPreviewMap = null; }
  const pane = $('recall-preview-map'); if (pane) pane.style.display = 'none';
  const info = $('recall-preview-info'); if (info) info.textContent = '';
  const ref2 = $('recall-ref'); if (ref2) ref2.value = '';
  closeModal('modal-recall');
  showSnackbar(t('recall.saved'), 'success');
  renderRecalls();
  renderAlerts().catch(() => {});
});

// ══════════════════════════════════════════════════════════════════════════════
// SIGN UP (already-licensed users registering platform credentials)
// ══════════════════════════════════════════════════════════════════════════════

$('signup-open-btn')?.addEventListener('click', () => openModal('modal-signup'));

$('signup-submit-btn')?.addEventListener('click', () => {
  const license  = $('signup-license')?.value.trim();
  const fullname = $('signup-fullname')?.value.trim();
  const email    = $('signup-email')?.value.trim();
  const pw       = $('signup-password')?.value;
  const pw2      = $('signup-password2')?.value;
  if (!license || !fullname || !email || !pw) {
    showSnackbar('All fields are required.', 'error'); return;
  }
  if (pw !== pw2) {
    showSnackbar('Passwords do not match.', 'error'); return;
  }
  if (pw.length < 8) {
    showSnackbar('Password must be at least 8 characters.', 'error'); return;
  }
  // Store registration (demo — no real auth backend)
  const registrations = JSON.parse(localStorage.getItem('lpg-registrations') || '[]');
  if (registrations.find(r => r.email === email)) {
    showSnackbar('An account with this email already exists.', 'error'); return;
  }
  registrations.push({ license, fullname, email, timestamp: new Date().toISOString() });
  localStorage.setItem('lpg-registrations', JSON.stringify(registrations));
  closeModal('modal-signup');
  ['signup-license','signup-fullname','signup-email','signup-password','signup-password2'].forEach(id => { const el = $(id); if (el) el.value = ''; });
  showSnackbar('Registration submitted! Your account is pending EWURA approval.', 'success');
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
  initFirebase();
  await openDB();
  await seedDemoData();

  // Consumer QR code scan — handle ?cylinder=ID without login
  const urlParams = new URLSearchParams(window.location.search);
  const consumerCylId = urlParams.get('cylinder');
  if (consumerCylId) {
    const overlay = $('consumer-scan-overlay');
    const contentEl = $('consumer-scan-content');
    if (overlay && contentEl) {
      const cyl = await txGet('cylinders', consumerCylId);
      const events = cyl ? await txGetIndex('events', 'cylinderId', cyl.id) : [];
      const lastEv = events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      if (cyl) {
        contentEl.innerHTML = `
          <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:24px;text-align:center;max-width:320px;margin:0 auto">
            <div style="font-size:36px;margin-bottom:8px">✅</div>
            <div style="font-size:18px;font-weight:700;color:#15803d;margin-bottom:12px">${t('consumer.registered')}</div>
            <div style="text-align:left;font-size:13px;color:#374151">
              <div style="margin-bottom:6px"><strong>ID:</strong> ${escapeHtml(cyl.id)}</div>
              <div style="margin-bottom:6px"><strong>Serial:</strong> ${escapeHtml(cyl.serial)}</div>
              <div style="margin-bottom:6px"><strong>Size:</strong> ${escapeHtml(cyl.size || 'N/A')}</div>
              <div style="margin-bottom:6px"><strong>Company:</strong> ${escapeHtml(cyl.company || 'N/A')}</div>
              <div style="margin-bottom:6px"><strong>Status:</strong> ${escapeHtml(cyl.status || 'N/A')}</div>
              ${lastEv ? `<div><strong>Last Scan:</strong> ${escapeHtml(lastEv.timestamp.slice(0,10))}</div>` : ''}
            </div>
          </div>`;
      } else {
        contentEl.innerHTML = `
          <div style="background:#fef2f2;border:2px solid #ef4444;border-radius:12px;padding:24px;text-align:center;max-width:320px;margin:0 auto">
            <div style="font-size:36px;margin-bottom:8px">⚠️</div>
            <div style="font-size:18px;font-weight:700;color:#dc2626;margin-bottom:12px">${t('consumer.notRegistered')}</div>
            <div style="font-size:13px;color:#374151">${t('kpi.total').replace('Total','Cylinder').replace('Jumla','Mtungi') || 'Cylinder'} <strong>${escapeHtml(consumerCylId)}</strong> ${t('consumer.notRegisteredDesc')}</div>
          </div>`;
      }
      overlay.style.display = 'flex';
    }
    return;
  }

  Auth.load();

  if (Auth.session) {
    hideLoginOverlay();
    applySession();
  } else {
    showLoginOverlay();
  }

  applyLang();
}

init().catch(err => {
  console.error('LPG Tracer init error:', err);
  showSnackbar('Startup error. Please reload.', 'error');
});
