'use strict';

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & DEMO DATA
// ══════════════════════════════════════════════════════════════════════════════

const DB_NAME    = 'lpg-tracer-db';
const DB_VERSION = 2;
const SEED_KEY   = 'seeded-v15';

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
    'ev.inspected':'Inspected by Field Auditor','ev.ewuraMonitored':'Supply Monitored by EWURA',
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
    'login.brandFooter':'EWURA · Tanzania · LPG Sector',
    'login.panelTitle':'Select your profile',
    'login.panelSubtitle':'Choose the role that matches your organisation to continue',
    'login.ewuraDesc':'Regulatory Authority · Grant & Revoke Licences · Monitor Supply Chain',
    'login.lpgmcDesc':'LPG Marketing Company · Register · Refill · Ship · Receive · Send Revalidation',
    'login.distTitle':'Distributor','login.distDesc':'Distribution Company · Receive · Supply to Retailers · Return Empty',
    'login.retailerTitle':'Retailer','login.retailerDesc':'Retail Outlet · Receive Cylinders · Sell · Return Empty',
    'login.revalTitle':'Revalidator','login.revalDesc':'Cylinders Revalidator · Receive · Revalidate & Update · Return to LPGMC',
    'login.auditorTitle':'Field Auditor','login.auditorDesc':'Field Inspection Unit · Inspect Products · View All Cylinders',
    'login.traDesc':'Tanzania Revenue Authority · Cross-check Refills · Register Shipments',
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
    'ev.inspected':'Imekaguliwa na Mkaguzi wa Uwanjani','ev.ewuraMonitored':'Ugavi Unaofuatiliwa na EWURA',
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
    'login.brandFooter':'EWURA · Tanzania · Sekta ya LPG',
    'login.panelTitle':'Chagua wasifu wako',
    'login.panelSubtitle':'Chagua jukumu linalolingana na shirika lako kuendelea',
    'login.ewuraDesc':'Mamlaka ya Udhibiti · Kutoa na Kufuta Leseni · Kufuatilia Mnyororo wa Ugavi',
    'login.lpgmcDesc':'Kampuni ya Uuzaji wa LPG · Sajili · Jaza · Tuma · Pokea · Tuma Uthibitishaji Upya',
    'login.distTitle':'Msambazaji','login.distDesc':'Kampuni ya Usambazaji · Pokea · Saidia Wauzaji · Rudisha Tupu',
    'login.retailerTitle':'Muuzaji','login.retailerDesc':'Duka la Rejareja · Pokea Mitungi · Uza · Rudisha Tupu',
    'login.revalTitle':'Mthibitishaji','login.revalDesc':'Mthibitishaji wa Mitungi · Pokea · Thibitisha Upya · Rudisha kwa LPGMC',
    'login.auditorTitle':'Mkaguzi wa Uwanjani','login.auditorDesc':'Kitengo cha Ukaguzi wa Uwanjani · Kagua Bidhaa · Tazama Mitungi Yote',
    'login.traDesc':'Mamlaka ya Mapato Tanzania · Kagua Kujaza · Sajili Mizigo',
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
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.innerHTML = _lang === 'sw' ? FLAG_SVG_TZ + ' SW' : FLAG_SVG_GB + ' EN';
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
  { id:'BT-001', plate:'T 121 DAR', operator:'Vivo LPG',       capacity:'30,000L', status:'in-transit',   from:'Dar es Salaam Import Terminal', to:'Vivo LPG Refilling Plant',   lat:-6.5200, lng:39.0800, speed:62, lastUpdate:'3 min ago',  routePct:42 },
  { id:'BT-002', plate:'T 344 DAR', operator:'Total Energies', capacity:'22,000L', status:'in-transit',   from:'Dar es Salaam Import Terminal', to:'Total Energies Facility',     lat:-6.2000, lng:38.8000, speed:55, lastUpdate:'7 min ago',  routePct:28 },
  { id:'BT-003', plate:'T 098 ARU', operator:'Shell Gas',      capacity:'18,000L', status:'at-terminal',  from:'Dar es Salaam Import Terminal', to:'Shell Gas Arusha Plant',      lat:-6.7924, lng:39.2083, speed:0,  lastUpdate:'12 min ago', routePct:0  },
  { id:'BT-004', plate:'T 217 MWZ', operator:'Lake Gas',       capacity:'25,000L', status:'delivered',    from:'Dar es Salaam Import Terminal', to:'Lake Gas Mwanza Facility',    lat:-2.5164, lng:32.9175, speed:0,  lastUpdate:'1 hr ago',   routePct:100},
  { id:'BT-005', plate:'T 502 DAR', operator:'Vivo LPG',       capacity:'30,000L', status:'loading',      from:'Dar es Salaam Import Terminal', to:'Vivo LPG Refilling Plant',   lat:-6.8200, lng:39.2900, speed:0,  lastUpdate:'25 min ago', routePct:0  },
  { id:'BT-006', plate:'T 188 MBY', operator:'Total Energies', capacity:'20,000L', status:'in-transit',   from:'Dar es Salaam Import Terminal', to:'Total Energies Mbeya Plant',  lat:-7.5000, lng:36.2000, speed:70, lastUpdate:'5 min ago',  routePct:65 },
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
  ewura:           ['reports', 'cylinders', 'alerts', 'network', 'licenses', 'mgmt-reports', 'bulk-monitor'],
  'field-auditor': ['reports', 'scan', 'cylinders'],
  tra:             ['reports', 'scan', 'cylinders'],
  distributor:     ['reports', 'cylinders', 'alerts', 'mgmt-reports'],
  retailer:        ['reports', 'cylinders', 'mgmt-reports'],
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

function txClearStore(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).clear();
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
  const seeded = await txGet('meta', SEED_KEY);
  if (seeded) return;

  // Clear any stale data from previous seed versions
  await txClearStore('cylinders');
  await txClearStore('events');

  for (const cyl of DEMO_CYLINDERS) {
    await txPut('cylinders', cyl);
  }

  const now   = Date.now();
  const DAY   = 24 * 60 * 60 * 1000;
  const MONTH = 30 * DAY;

  const RETAILERS = [
    { name:'QuickGas Retail DSM North',  region:'Dar es Salaam' },
    { name:'CityGas Direct Temeke',      region:'Dar es Salaam' },
    { name:'Kariakoo Gas Shop',          region:'Dar es Salaam' },
    { name:'Dar North Gas Kijitonyama',  region:'Dar es Salaam' },
    { name:'Northern Gas Retail Arusha', region:'Arusha' },
    { name:'Arusha Clock Tower Gas',     region:'Arusha' },
    { name:'Moshi Gas Outlet',           region:'Kilimanjaro' },
    { name:'Mwanza Lakeside Gas',        region:'Mwanza' },
    { name:'Mwanza Rock City Gas',       region:'Mwanza' },
    { name:'Iringa Gas Retail',          region:'Iringa' },
    { name:'Zanzibar Stone Town Gas',    region:'Zanzibar' },
    { name:'Morogoro Gas Centre',        region:'Morogoro' },
    { name:'Dodoma Central Gas Shop',    region:'Dodoma' },
    { name:'Mbeya Highland Gas Retail',  region:'Mbeya' },
    { name:'Tanga Shoreline Gas',        region:'Tanga' },
    { name:'Tabora Market Gas Shop',     region:'Tabora' },
    { name:'Shinyanga Gas Retail',       region:'Shinyanga' },
  ];
  const DISTRIBUTORS = [
    { name:'ABC Gas Distributors',         region:'Dar es Salaam' },
    { name:'Sunrise Gas Ltd',              region:'Arusha' },
    { name:'Lake Victoria Gas Supply',     region:'Mwanza' },
    { name:'Capital Gas Supplies',         region:'Dodoma' },
    { name:'Kilimanjaro Gas Distributors', region:'Kilimanjaro' },
    { name:'Southern Highlands Gas',       region:'Mbeya' },
    { name:'Coastal Gas Ltd',              region:'Tanga' },
    { name:'Tabora Gas Distributors',      region:'Tabora' },
    { name:'Morogoro Gas Depot',           region:'Morogoro' },
    { name:'Shinyanga Gas Centre',         region:'Shinyanga' },
  ];

  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // Helper: seed one full cycle (registered → refilled → shipped → dist-received →
  // dist-sent-retail → ret-received → ret-sold → ret-returned-empty →
  // dist-returned-empty → received-empty)
  async function seedCompleteCycle(cyl, baseMs) {
    const d = rnd(DISTRIBUTORS), r = rnd(RETAILERS);
    await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(baseMs).toISOString(),             operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
    await txPut('events', { cylinderId:cyl.id, type:'shipped',             timestamp:new Date(baseMs + 7*DAY).toISOString(),     operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
    await txPut('events', { cylinderId:cyl.id, type:'dist-received',       timestamp:new Date(baseMs + 9*DAY).toISOString(),     operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
    await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',    timestamp:new Date(baseMs + 15*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
    await txPut('events', { cylinderId:cyl.id, type:'ret-received',        timestamp:new Date(baseMs + 17*DAY).toISOString(),    operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    await txPut('events', { cylinderId:cyl.id, type:'ret-sold',            timestamp:new Date(baseMs + 22*DAY).toISOString(),    operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    await txPut('events', { cylinderId:cyl.id, type:'ret-returned-empty',  timestamp:new Date(baseMs + 50*DAY).toISOString(),    operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    await txPut('events', { cylinderId:cyl.id, type:'dist-returned-empty', timestamp:new Date(baseMs + 53*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
    await txPut('events', { cylinderId:cyl.id, type:'received-empty',      timestamp:new Date(baseMs + 56*DAY).toISOString(),    operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
  }

  for (const cyl of DEMO_CYLINDERS) {
    const mfgTime = new Date(cyl.manufactureDate).getTime();

    // Step 1: Registration at LPGMC
    await txPut('events', {
      cylinderId:cyl.id, type:'registered',
      timestamp: new Date(mfgTime).toISOString(),
      operatorId:'SYSTEM', company:cyl.company, location:cyl.company, notes:'Initial registration',
    });

    if (cyl.status === 'revalidation') {
      // 1 complete cycle, then sent to revalidation
      await seedCompleteCycle(cyl, now - 18*MONTH);
      await txPut('events', { cylinderId:cyl.id, type:'refilled',          timestamp:new Date(now - 6*MONTH).toISOString(),  operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'sent-revalidation', timestamp:new Date(now - 5*MONTH).toISOString(),  operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'reval-received',    timestamp:new Date(now - 5*MONTH + 3*DAY).toISOString(), operatorId:'SYSTEM', company:'ProRevalid Ltd', location:'ProRevalid Ltd', region:'Dar es Salaam' });
      continue;
    }

    // Older cylinders: seed 2 complete past cycles going back ~30 months
    if (parseInt(cyl.manufactureDate) <= 2020 || cyl.fillCount >= 50) {
      await seedCompleteCycle(cyl, now - 30*MONTH);
      await seedCompleteCycle(cyl, now - 16*MONTH);
    } else if (cyl.fillCount >= 10) {
      await seedCompleteCycle(cyl, now - 12*MONTH);
    }

    // Final state per current cylinder status
    if (cyl.status === 'in-refill') {
      // Most recent event: received-empty a few months ago, then refilled at LPGMC
      const d = rnd(DISTRIBUTORS), r = rnd(RETAILERS);
      const base = now - 4*MONTH;
      await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(base).toISOString(),             operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'shipped',             timestamp:new Date(base + 7*DAY).toISOString(),     operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-received',       timestamp:new Date(base + 9*DAY).toISOString(),     operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',    timestamp:new Date(base + 15*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-received',        timestamp:new Date(base + 17*DAY).toISOString(),    operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-sold',            timestamp:new Date(base + 22*DAY).toISOString(),    operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-returned-empty',  timestamp:new Date(base + 50*DAY).toISOString(),    operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-returned-empty', timestamp:new Date(base + 53*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'received-empty',      timestamp:new Date(base + 56*DAY).toISOString(),    operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      // Now in-refill: refilled recently, awaiting dispatch
      await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(now - 14*DAY).toISOString(),     operatorId:'SYSTEM', company:cyl.company, location:cyl.company });

    } else if (cyl.status === 'in-circulation') {
      // Last event ~98 days ago → triggers Unreported alert (> 90 days threshold)
      const d = rnd(DISTRIBUTORS), r = rnd(RETAILERS);
      const base = now - 110*DAY;
      await txPut('events', { cylinderId:cyl.id, type:'refilled',         timestamp:new Date(base - 7*DAY).toISOString(),  operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'shipped',          timestamp:new Date(base).toISOString(),          operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-received',    timestamp:new Date(base + 2*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail', timestamp:new Date(base + 10*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-received',     timestamp:new Date(base + 12*DAY).toISOString(), operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });

    } else if (cyl.status === 'in-use') {
      // Full cycle ending at ret-sold
      const d = rnd(DISTRIBUTORS), r = rnd(RETAILERS);
      const base = now - 3*MONTH;
      await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(base).toISOString(),             operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'shipped',             timestamp:new Date(base + 7*DAY).toISOString(),     operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-received',       timestamp:new Date(base + 9*DAY).toISOString(),     operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',    timestamp:new Date(base + 15*DAY).toISOString(),    operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-received',        timestamp:new Date(base + 17*DAY).toISOString(),    operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-sold',            timestamp:new Date(base + 22*DAY).toISOString(),    operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    }
  }

  // Seed generated bulk cylinders (300 per LPGMC)
  const generatedCyls = buildGeneratedCylinders();
  for (const cyl of generatedCyls) {
    const existing = await txGet('cylinders', cyl.id);
    if (existing) continue; // already seeded
    await txPut('cylinders', cyl);
    const mfgTime = new Date(cyl.manufactureDate).getTime();
    await txPut('events', {
      cylinderId: cyl.id, type: 'registered',
      timestamp: new Date(mfgTime).toISOString(),
      operatorId: 'SYSTEM', company: cyl.company, location: cyl.company, notes: 'Initial registration',
    });
    // Seed final-state events only (lightweight seeding)
    const now2  = Date.now();
    const idHash = cyl.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const d = rnd(DISTRIBUTORS), r = rnd(RETAILERS);
    if (cyl._seedRefillEmpty) {
      // Empty cylinder returned to LPGMC, awaiting refill — last event is received-empty
      const base = now2 - (5 + (idHash % 20)) * DAY;
      const r2 = rnd(RETAILERS);
      await txPut('events', { cylinderId:cyl.id, type:'refilled',           timestamp:new Date(base - 60*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'shipped',            timestamp:new Date(base - 53*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-received',      timestamp:new Date(base - 51*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',   timestamp:new Date(base - 45*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r2.name, destinedRegion:r2.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-received',       timestamp:new Date(base - 43*DAY).toISOString(), operatorId:'SYSTEM', company:r2.name, location:r2.name, region:r2.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-sold',           timestamp:new Date(base - 38*DAY).toISOString(), operatorId:'SYSTEM', company:r2.name, location:r2.name, region:r2.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-returned-empty', timestamp:new Date(base - 15*DAY).toISOString(), operatorId:'SYSTEM', company:r2.name, location:r2.name, region:r2.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-returned-empty',timestamp:new Date(base - 10*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'received-empty',     timestamp:new Date(base).toISOString(),          operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
    } else if (cyl.status === 'in-refill') {
      const base = now2 - 2 * MONTH;
      await txPut('events', { cylinderId:cyl.id, type:'received-empty', timestamp:new Date(base - 5*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'refilled',       timestamp:new Date(base).toISOString(),          operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
    } else if (cyl._seedEmpty) {
      // Empty cylinder returned to distributor
      const idHash = cyl.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const base = now2 - (20 + (idHash % 30)) * DAY;
      const r = rnd(RETAILERS);
      await txPut('events', { cylinderId:cyl.id, type:'refilled',            timestamp:new Date(base - 30*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'shipped',             timestamp:new Date(base - 22*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-received',       timestamp:new Date(base - 20*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail',    timestamp:new Date(base - 15*DAY).toISOString(), operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-received',        timestamp:new Date(base - 13*DAY).toISOString(), operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-sold',            timestamp:new Date(base - 8*DAY).toISOString(),  operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-returned-empty',  timestamp:new Date(base).toISOString(),          operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    } else if (cyl.status === 'in-circulation') {
      const isStuck = (idHash % 4 === 0);
      const daysAgo = isStuck ? 105 : (8 + (idHash % 30));
      const base = now2 - daysAgo * DAY;
      await txPut('events', { cylinderId:cyl.id, type:'refilled',         timestamp:new Date(base - 7*DAY).toISOString(), operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'shipped',          timestamp:new Date(base).toISOString(),          operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-received',    timestamp:new Date(base + 2*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail', timestamp:new Date(base + 8*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-received',     timestamp:new Date(base + 10*DAY).toISOString(), operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    } else if (cyl.status === 'in-use') {
      const base = now2 - 3 * MONTH;
      await txPut('events', { cylinderId:cyl.id, type:'refilled',         timestamp:new Date(base).toISOString(),           operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'shipped',          timestamp:new Date(base + 7*DAY).toISOString(),   operatorId:'SYSTEM', company:cyl.company, location:cyl.company, destinedFor:d.name, destinedRegion:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-received',    timestamp:new Date(base + 9*DAY).toISOString(),   operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region });
      await txPut('events', { cylinderId:cyl.id, type:'dist-sent-retail', timestamp:new Date(base + 15*DAY).toISOString(),  operatorId:'SYSTEM', company:d.name, location:d.name, region:d.region, destinedFor:r.name, destinedRegion:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-received',     timestamp:new Date(base + 17*DAY).toISOString(),  operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
      await txPut('events', { cylinderId:cyl.id, type:'ret-sold',         timestamp:new Date(base + 22*DAY).toISOString(),  operatorId:'SYSTEM', company:r.name, location:r.name, region:r.region });
    } else if (cyl.status === 'revalidation') {
      await txPut('events', { cylinderId:cyl.id, type:'refilled',          timestamp:new Date(now2 - 6*MONTH).toISOString(),            operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'sent-revalidation', timestamp:new Date(now2 - 5*MONTH).toISOString(),            operatorId:'SYSTEM', company:cyl.company, location:cyl.company });
      await txPut('events', { cylinderId:cyl.id, type:'reval-received',    timestamp:new Date(now2 - 5*MONTH + 3*DAY).toISOString(),    operatorId:'SYSTEM', company:'ProRevalid Ltd', location:'ProRevalid Ltd', region:'Dar es Salaam' });
    }
  }

  // Misplaced cylinder demo: shipped to X but received by Y (different region)
  const misplacedPairs = [
    { cylId:'E280116060000204C3F04E85', company:'Vivo LPG',       intendedDist:'ABC Gas Distributors',         intendedRegion:'Dar es Salaam', actualDist:'Sunrise Gas Ltd',              actualRegion:'Arusha'      },
    { cylId:'E280116060000204C3F04E95', company:'Shell Gas',      intendedDist:'Capital Gas Supplies',         intendedRegion:'Dodoma',        actualDist:'Southern Highlands Gas',       actualRegion:'Mbeya'       },
    { cylId:'E280116060000204C3F04E87', company:'Vivo LPG',       intendedDist:'Kilimanjaro Gas Distributors', intendedRegion:'Kilimanjaro',    actualDist:'ABC Gas Distributors',         actualRegion:'Dar es Salaam'},
    { cylId:'E280116060000204C3F04E8B', company:'Total Energies', intendedDist:'Morogoro Gas Depot',           intendedRegion:'Morogoro',       actualDist:'Tabora Gas Distributors',      actualRegion:'Tabora'      },
    { cylId:'E280116060000204C3F04E91', company:'Shell Gas',      intendedDist:'Coastal Gas Ltd',              intendedRegion:'Tanga',          actualDist:'Sunrise Gas Ltd',              actualRegion:'Arusha'      },
    { cylId:'E280116060000204C3F04E9C', company:'Lake Gas',       intendedDist:'ABC Gas Distributors',         intendedRegion:'Dar es Salaam',  actualDist:'Lake Victoria Gas Supply',     actualRegion:'Mwanza'      },
  ];
  for (const mp of misplacedPairs) {
    const tShip = new Date(now - 10*DAY);
    const tRecv = new Date(now - 8*DAY);
    await txPut('events', { cylinderId:mp.cylId, type:'shipped',       timestamp:tShip.toISOString(), operatorId:'SYSTEM', company:mp.company, location:mp.company, destinedFor:mp.intendedDist, destinedRegion:mp.intendedRegion });
    await txPut('events', { cylinderId:mp.cylId, type:'dist-received', timestamp:tRecv.toISOString(), operatorId:'SYSTEM', company:mp.actualDist, location:mp.actualDist, region:mp.actualRegion });
  }

  // Seed inspection events (Feature 8) spread across 2025-2026
  const INSPECTION_SEED_DATA = [
    // 2025 months (6 months back from June 2026)
    { cylId:'E280116060000204C3F04E81', type:'inspected',      ts:'2025-12-10T10:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E82', type:'inspected',      ts:'2025-12-15T11:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E83', type:'ewura-monitored',ts:'2025-12-20T09:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E89', type:'inspected',      ts:'2026-01-08T14:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E8A', type:'inspected',      ts:'2026-01-15T10:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E8B', type:'ewura-monitored',ts:'2026-01-22T08:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E91', type:'inspected',      ts:'2026-02-05T13:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E92', type:'inspected',      ts:'2026-02-12T09:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E99', type:'inspected',      ts:'2026-02-18T11:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E84', type:'ewura-monitored',ts:'2026-03-03T10:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E85', type:'inspected',      ts:'2026-03-10T14:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E8C', type:'inspected',      ts:'2026-03-20T09:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E9A', type:'inspected',      ts:'2026-04-04T11:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E9B', type:'ewura-monitored',ts:'2026-04-11T10:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E93', type:'inspected',      ts:'2026-04-18T08:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E86', type:'inspected',      ts:'2026-05-06T13:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E94', type:'inspected',      ts:'2026-05-14T10:30:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04EA1', type:'ewura-monitored',ts:'2026-05-22T09:00:00Z', compliant:false },
    { cylId:'E280116060000204C3F04E87', type:'inspected',      ts:'2026-06-02T14:00:00Z', compliant:true  },
    { cylId:'E280116060000204C3F04E95', type:'inspected',      ts:'2026-06-07T11:00:00Z', compliant:true  },
  ];
  for (const s of INSPECTION_SEED_DATA) {
    await txPut('events', {
      cylinderId: s.cylId, type: s.type, timestamp: s.ts,
      operatorId: 'SYSTEM', company: s.type === 'ewura-monitored' ? 'EWURA' : 'Field Inspection Unit',
      compliant: s.compliant,
    });
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
    Auth.login('ewura', 'EWURA', '');
    return;
  }

  // Configure company input
  loginFormLabel.textContent = ROLE_LABELS[role] || role;
  loginCompSel.style.display  = 'none';
  loginCompText.style.display = 'none';

  if (role === 'lpgmc') {
    loginCompSel.innerHTML = LPGMC_COMPANIES.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    loginCompSel.style.display = '';
  } else if (role === 'distributor') {
    const dists = DEMO_NETWORK.filter(n => n.type === 'Distributor');
    loginCompSel.innerHTML = dists.map(n => `<option value="${escapeHtml(n.name)}">${escapeHtml(n.name)}</option>`).join('');
    loginCompSel.style.display = '';
  } else if (role === 'retailer') {
    const rets = DEMO_NETWORK.filter(n => n.type === 'Retailer');
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
    scan:          'Scanning',
    cylinders:     'Cylinders',
    alerts:        'Alerts',
    reports:       'Dashboard',
    licenses:      'Licenses',
    network:       'Network',
    'mgmt-reports':'Management Reports',
    'bulk-monitor':'Bullet Tanks',
  }[name] || name;

  // Lazy render
  if (name === 'cylinders')     renderCylinders();
  if (name === 'alerts')        renderAlerts();
  if (name === 'reports')       renderReports();
  if (name === 'licenses')      renderLicenses();
  if (name === 'network')       renderNetwork();
  if (name === 'mgmt-reports')  renderMgmtReports();
  if (name === 'bulk-monitor') renderBulkMonitor();
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
      lastScanResult.className = 'last-scan-result error';
      lastScanResult.textContent = t('scan.notRegistered');
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

  let text = `LPG Cylinder Passport\n${'='.repeat(40)}\n`;
  text += `Serial:   ${cyl.serial}\nTag:      ${cyl.id}\nCompany:  ${cyl.company}\nStatus:   ${cyl.status}\n`;
  text += `Fills:    ${cyl.fillCount}\nHydro:    ${cyl.lastHydroTest || 'N/A'}\n\nEvents:\n`;
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
  const alertRole = Auth.session?.role;
  if (alertRole === 'lpgmc') {
    cyls = cyls.filter(c => c.company === Auth.session.company);
  } else if (alertRole === 'distributor' || alertRole === 'retailer') {
    // Only show alerts for cylinders currently assigned to this partner
    const allEvForFilter = await txGetAll('events');
    const lastEvMap = {};
    allEvForFilter.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .forEach(ev => { lastEvMap[ev.cylinderId] = ev; });
    const partnerName = Auth.session.company;
    cyls = cyls.filter(c => {
      const ev = lastEvMap[c.id];
      if (!ev) return false;
      return (ev.location || ev.company || '') === partnerName;
    });
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
      }
    }

    // 2. Misplaced cylinder: shipped to X but received at Y
    {
      const cylEvents = allEvents
        .filter(e => e.cylinderId === cyl.id)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
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
    }

    // 3. Unreported: no movement reported in 90+ days
    if (cyl.status === 'in-circulation') {
      const cylEvents = allEvents.filter(e => e.cylinderId === cyl.id)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      const lastEv = cylEvents[0];
      if (lastEv) {
        const days = Math.floor((now - new Date(lastEv.timestamp)) / (24*60*60*1000));
        if (days > 90) {
          _alertsData.push({ severity:'warning', type:'stuck-in-circulation', cylinder:cyl,
            title: `${cyl.serial} — Unreported (${days}d)`,
            desc: `Cylinder has been in circulation for ${days} days without a movement report.` });
        }
      }
    }

  }

  buildCylLocations(cyls, allEvents);
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

// ── Alert view tab toggle ─────────────────────────────────────────────────
document.querySelectorAll('[data-alert-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-alert-tab]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.alertTab;
    $('alert-list-pane').style.display = tab === 'list' ? '' : 'none';
    $('alert-map-pane').style.display  = tab === 'map'  ? '' : 'none';
    if (tab === 'map') renderAlertsMap();
  });
});

const REGION_CENTROIDS = {
  'Dar es Salaam': [-6.7924, 39.2083], 'Arusha': [-3.3869, 36.6830],
  'Mwanza': [-2.5164, 32.9175], 'Dodoma': [-6.1722, 35.7395],
  'Mbeya': [-8.9094, 33.4608], 'Tanga': [-5.0690, 39.0997],
  'Kilimanjaro': [-3.3333, 37.3333], 'Morogoro': [-6.8241, 37.6595],
  'Tabora': [-5.0233, 32.7984], 'Shinyanga': [-3.6605, 33.4199],
  'Iringa': [-7.7676, 35.6938], 'Zanzibar': [-6.1367, 39.3497],
};

// ── Interactive Tanzania map (offline SVG) ─────────────────────────────────
const _IMAP_OUTLINE = '250,20 340,18 433,22 490,60 550,98 530,130 510,155 505,180 513,200 513,223 511,247 525,268 543,286 553,340 559,385 520,420 395,440 340,440 293,413 230,390 147,343 90,320 50,285 30,252 17,210 17,155 40,110 71,66 130,42';
const _IMAP_CITIES = [
  { name:'Dar es Salaam', lat:-6.7924, lng:39.2083 },
  { name:'Arusha',        lat:-3.3869, lng:36.6830 },
  { name:'Mwanza',        lat:-2.5164, lng:32.9175 },
  { name:'Dodoma',        lat:-6.1722, lng:35.7395 },
  { name:'Mbeya',         lat:-8.9094, lng:33.4608 },
  { name:'Tanga',         lat:-5.0690, lng:39.0997 },
  { name:'Mtwara',        lat:-10.274, lng:40.183  },
  { name:'Kigoma',        lat:-4.883,  lng:29.627  },
  { name:'Tabora',        lat:-5.023,  lng:32.798  },
  { name:'Morogoro',      lat:-6.824,  lng:37.660  },
];
const _imapControllers = new Map();

function _lngLatToImap(lat, lng) {
  return [
    Math.round((lng - 29.0) / 12.0 * 600 * 10) / 10,
    Math.round((-0.5 - lat) / 11.2 * 440 * 10) / 10,
  ];
}

function buildInteractiveMap(mapId, markers, legend, height) {
  const cityDots = _IMAP_CITIES.map(c => {
    const [cx, cy] = _lngLatToImap(c.lat, c.lng);
    return `<circle cx="${cx}" cy="${cy}" r="2.5" fill="#1e4a7a"/><text x="${cx+4}" y="${cy+3}" font-size="7.5" fill="#3a6494" font-family="system-ui,sans-serif">${c.name}</text>`;
  }).join('');

  const markersSvg = (markers || []).map((m, idx) => {
    const [mx, my] = _lngLatToImap(m.lat, m.lng);
    const fill = m.color || '#3b82f6';
    const r = m.big ? 11 : 8;
    const pulseRing = m.pulse
      ? `<circle class="imap-pulse-ring" cx="${mx}" cy="${my}" r="${r + 7}" fill="none" stroke="${fill}" stroke-width="1.5"/>`
      : '';
    const sym = m.symbol
      ? `<text x="${mx}" y="${my + 3.5}" font-size="8" text-anchor="middle" fill="white" font-family="system-ui" font-weight="700" pointer-events="none">${m.symbol}</text>`
      : '';
    return `${pulseRing}<circle class="imap-marker" cx="${mx}" cy="${my}" r="${r}" fill="${fill}" stroke="white" stroke-width="2" data-idx="${idx}" style="cursor:pointer"/>${sym}`;
  }).join('');

  const legendHtml = (legend || []).map(l =>
    `<span class="imap-legend-item"><span class="imap-legend-dot" style="background:${l.color}"></span>${escapeHtml(l.label)}</span>`
  ).join('');

  const h = height || 380;
  return `<div class="imap-container" id="${mapId}_imap">
    <div class="imap-toolbar">
      <div class="imap-zoom-group">
        <button class="imap-btn" data-imap-action="zoom-in" type="button" title="Zoom in">+</button>
        <button class="imap-btn" data-imap-action="zoom-out" type="button" title="Zoom out">−</button>
        <button class="imap-btn" data-imap-action="reset" type="button" title="Reset view">⊙</button>
      </div>
      <div class="imap-legend-row">${legendHtml}</div>
      <span class="imap-hint">Scroll/pinch to zoom · Drag to pan · Click marker for info</span>
    </div>
    <div class="imap-body" id="${mapId}_imapbody">
      <svg id="${mapId}_svg" viewBox="0 0 600 440"
           style="width:100%;height:${h}px;background:#050f1e;display:block;cursor:grab"
           xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="imap-sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#060d1f"/>
            <stop offset="100%" stop-color="#091428"/>
          </linearGradient>
          <filter id="imap-glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="600" height="440" fill="url(#imap-sea)"/>
        <polygon points="${_IMAP_OUTLINE}" fill="#0d2540" stroke="#1e4a7a" stroke-width="1.5" stroke-linejoin="round"/>
        ${cityDots}
        ${markersSvg}
      </svg>
      <div class="imap-detail-panel" id="${mapId}_imapdetail" style="display:none">
        <button class="imap-detail-close" data-imap-action="close-detail" type="button" title="Close">✕</button>
        <div id="${mapId}_imapdetailbody" class="imap-detail-body"></div>
      </div>
    </div>
  </div>`;
}

function initInteractiveMap(mapId, markers) {
  const container = $(`${mapId}_imap`);
  const svg       = $(`${mapId}_svg`);
  const detail    = $(`${mapId}_imapdetail`);
  if (!container || !svg) return;

  // Abort previous listeners for this mapId
  const prev = _imapControllers.get(mapId);
  if (prev) prev.abort();
  const controller = new AbortController();
  _imapControllers.set(mapId, controller);
  const { signal } = controller;

  // ViewBox state
  let vx = 0, vy = 0, vw = 600, vh = 440;
  const setView = (x, y, w, h) => {
    vx = Math.max(-80, Math.min(530, x));
    vy = Math.max(-50, Math.min(390, y));
    vw = Math.max(90,  Math.min(750, w));
    vh = Math.max(65,  Math.min(550, h));
    svg.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);
  };

  // Zoom buttons & close
  container.addEventListener('click', e => {
    const action = e.target.closest('[data-imap-action]')?.dataset?.imapAction;
    if (!action) return;
    if (action === 'zoom-in') {
      setView(vx + vw * 0.15, vy + vh * 0.15, vw * 0.7, vh * 0.7);
    } else if (action === 'zoom-out') {
      setView(vx - vw * 0.15, vy - vh * 0.15, vw * 1.3, vh * 1.3);
    } else if (action === 'reset') {
      setView(0, 0, 600, 440);
    } else if (action === 'close-detail' && detail) {
      detail.style.display = 'none';
      svg.querySelectorAll('.imap-marker.imap-selected').forEach(el => el.classList.remove('imap-selected'));
    }
  }, { signal });

  // Scroll to zoom (mouse)
  svg.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = svg.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top)  / rect.height;
    const f  = e.deltaY < 0 ? 0.8 : 1.25;
    const nw = vw * f, nh = vh * f;
    setView(vx + (vw - nw) * px, vy + (vh - nh) * py, nw, nh);
  }, { passive: false, signal });

  // Mouse drag to pan
  let dragging = false, dragX0 = 0, dragY0 = 0, dragVX0 = 0, dragVY0 = 0;
  svg.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    dragging = true;
    dragX0 = e.clientX; dragY0 = e.clientY; dragVX0 = vx; dragVY0 = vy;
    svg.style.cursor = 'grabbing';
    e.preventDefault();
  }, { signal });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const rect = svg.getBoundingClientRect();
    setView(dragVX0 - (e.clientX - dragX0) / rect.width * vw,
            dragVY0 - (e.clientY - dragY0) / rect.height * vh, vw, vh);
  }, { signal });
  window.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; svg.style.cursor = 'grab'; }
  }, { signal });

  // Touch pan + pinch-zoom
  let lastTouches = null;
  svg.addEventListener('touchstart', e => { lastTouches = Array.from(e.touches); }, { passive: true, signal });
  svg.addEventListener('touchmove', e => {
    if (!lastTouches) return;
    e.preventDefault();
    const cur = Array.from(e.touches);
    if (cur.length === 1 && lastTouches.length >= 1) {
      const rect = svg.getBoundingClientRect();
      const dx = (cur[0].clientX - lastTouches[0].clientX) / rect.width  * vw;
      const dy = (cur[0].clientY - lastTouches[0].clientY) / rect.height * vh;
      setView(vx - dx, vy - dy, vw, vh);
    } else if (cur.length === 2 && lastTouches.length === 2) {
      const prevD = Math.hypot(lastTouches[0].clientX - lastTouches[1].clientX, lastTouches[0].clientY - lastTouches[1].clientY);
      const curD  = Math.hypot(cur[0].clientX - cur[1].clientX, cur[0].clientY - cur[1].clientY);
      if (curD > 0) {
        const f = prevD / curD;
        const cx = (cur[0].clientX + cur[1].clientX) / 2;
        const cy = (cur[0].clientY + cur[1].clientY) / 2;
        const rect = svg.getBoundingClientRect();
        const px = (cx - rect.left) / rect.width;
        const py = (cy - rect.top)  / rect.height;
        const nw = vw * f, nh = vh * f;
        setView(vx + (vw - nw) * px, vy + (vh - nh) * py, nw, nh);
      }
    }
    lastTouches = cur;
  }, { passive: false, signal });

  // Floating tooltip
  let tip = document.getElementById('imap-global-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'imap-global-tip';
    tip.className = 'imap-tooltip';
    document.body.appendChild(tip);
  }
  svg.addEventListener('mousemove', e => {
    const circle = e.target.closest('.imap-marker');
    if (!circle) { tip.hidden = true; return; }
    const m = markers[+circle.dataset.idx];
    if (!m) { tip.hidden = true; return; }
    tip.textContent = m.label || '';
    tip.hidden = false;
    tip.style.left = (e.clientX + 14) + 'px';
    tip.style.top  = (e.clientY - 10) + 'px';
  }, { signal });
  svg.addEventListener('mouseleave', () => { tip.hidden = true; }, { signal });

  // Marker click → detail panel
  svg.addEventListener('click', e => {
    if (dragging) return;
    const circle = e.target.closest('.imap-marker');
    if (!circle || !detail) return;
    const m = markers[+circle.dataset.idx];
    if (!m) return;
    const body = $(`${mapId}_imapdetailbody`);
    if (body) body.innerHTML = m.detailHtml || `<strong>${escapeHtml(m.label || '')}</strong>`;
    detail.style.display = '';
    svg.querySelectorAll('.imap-marker.imap-selected').forEach(el => el.classList.remove('imap-selected'));
    circle.classList.add('imap-selected');
    tip.hidden = true;
  }, { signal });
}

let _alertLeafletMap = null;

// ── Lightweight OSM tile map — zoom, pan, hover tooltip ───────────────────
function buildTileMap(mapId, markers, { height = 420, zoom = 6, center, lines = [] } = {}) {
  const el = $(mapId);
  if (!el) return;

  const TS = 256;
  let Z = zoom;
  let C = center ? { ...center }
    : markers.length
      ? { lat: markers.reduce((s,m) => s+m.lat, 0) / markers.length,
          lng: markers.reduce((s,m) => s+m.lng, 0) / markers.length }
      : { lat: -6.5, lng: 35.5 };

  // Abort previous interaction listeners if map is rebuilt in-place
  if (el._tmAC) el._tmAC.abort();
  const ac = new AbortController();
  el._tmAC = ac;
  const sig = ac.signal;

  el.style.cssText = `position:relative;overflow:hidden;height:${height}px;border:1px solid var(--border);border-radius:8px;background:#d4d0cb;cursor:grab;user-select:none`;

  // Web Mercator helpers
  function merc(lat, lng) {
    const N = 1 << Z, sin = Math.sin(lat * Math.PI / 180);
    return { tx: (lng + 180) / 360 * N,
             ty: (1 - Math.log((1+sin)/(1-sin)) / (2*Math.PI)) / 2 * N };
  }
  function tileToLatLng(tx, ty) {
    const N = 1 << Z;
    const n = Math.PI - 2 * Math.PI * ty / N;
    return { lat: 180/Math.PI * Math.atan(0.5*(Math.exp(n)-Math.exp(-n))),
             lng: tx / N * 360 - 180 };
  }

  const btnSt = 'width:28px;height:28px;background:#fff;border:1px solid rgba(0,0,0,0.25);border-radius:4px;font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.2);color:#333;padding:0;font-weight:300';

  function render() {
    const N = 1 << Z, w = el.offsetWidth || 640, h = height;
    const Cp = merc(C.lat, C.lng);
    const cx = Math.floor(Cp.tx), cy = Math.floor(Cp.ty);
    const hw = Math.ceil(w/2/TS)+1, hh = Math.ceil(h/2/TS)+1;

    function pxOf(lat, lng) {
      const p = merc(lat, lng);
      return { x: (p.tx-Cp.tx)*TS + w/2, y: (p.ty-Cp.ty)*TS + h/2 };
    }

    // Tile grid
    let tiles = '';
    for (let dy = -hh; dy <= hh; dy++) for (let dx = -hw; dx <= hw; dx++) {
      const tx = ((cx+dx)%N+N)%N, ty = cy+dy;
      if (ty < 0 || ty >= N) continue;
      const sub = ['a','b','c'][(tx+ty)%3];
      const x = (cx+dx - Cp.tx)*TS + w/2, y = (cy+dy - Cp.ty)*TS + h/2;
      tiles += `<img src="https://${sub}.tile.openstreetmap.org/${Z}/${tx}/${ty}.png" style="position:absolute;left:${x}px;top:${y}px;width:${TS}px;height:${TS}px" loading="eager">`;
    }

    // Route lines (SVG)
    const svgLines = lines.length ? `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">${
      lines.map(({from,to,color='#3b82f6',dash='7 5'}) => {
        const a = pxOf(from.lat,from.lng), b = pxOf(to.lat,to.lng);
        return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${color}" stroke-width="2.5" stroke-opacity="0.55" stroke-dasharray="${dash}"/>`;
      }).join('')
    }</svg>` : '';

    // Markers
    const mkrs = markers.map((m,i) => {
      const {x,y} = pxOf(m.lat, m.lng);
      const sz = m.big ? 30 : 18, fs = m.big ? 13 : 9, col = m.color || '#3b82f6';
      const pulse = m.pulse ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${col};opacity:0.22;animation:imap-pulse 1.4s ease-out infinite;pointer-events:none"></div>` : '';
      return `<div data-tmi="${i}" style="position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;transform:translate(-50%,-50%);z-index:${m.big?10:5};cursor:default">
        ${pulse}<div style="position:relative;width:${sz}px;height:${sz}px;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;font-size:${fs}px;color:#fff;font-weight:700;border:2px solid rgba(255,255,255,0.85);box-shadow:0 2px 6px rgba(0,0,0,0.4)">${escapeHtml(m.symbol||'')}</div>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div data-tml style="position:absolute;inset:0;z-index:1">${tiles}</div>
      <div data-tml style="position:absolute;inset:0;z-index:2;pointer-events:none">${svgLines}</div>
      <div data-tml style="position:absolute;inset:0;z-index:3">${mkrs}</div>
      <div style="position:absolute;top:10px;left:10px;z-index:20;display:flex;flex-direction:column;gap:3px">
        <button data-tmz="1"  style="${btnSt}" title="Zoom in">+</button>
        <button data-tmz="-1" style="${btnSt}" title="Zoom out">−</button>
      </div>
      <div id="${mapId}-tmtip" style="position:absolute;background:#1e293b;color:#fff;font-size:11px;padding:4px 8px;border-radius:4px;pointer-events:none;white-space:nowrap;z-index:50;display:none;max-width:260px;line-height:1.4"></div>
      <div style="position:absolute;bottom:0;right:0;background:rgba(255,255,255,0.72);font-size:10px;padding:2px 5px;z-index:20">© <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:#0077bb">OpenStreetMap</a></div>`;
  }

  render();

  // ── Zoom buttons ──────────────────────────────────────────────────────────
  el.addEventListener('click', e => {
    const btn = e.target.closest('[data-tmz]');
    if (!btn) return;
    Z = Math.max(2, Math.min(18, Z + +btn.dataset.tmz));
    render();
  }, { signal: sig });

  // ── Mouse-wheel zoom ──────────────────────────────────────────────────────
  el.addEventListener('wheel', e => {
    e.preventDefault();
    // Zoom toward cursor position
    const N = 1 << Z, w = el.offsetWidth || 640, h = height;
    const r  = el.getBoundingClientRect();
    const mx = e.clientX - r.left - w/2, my = e.clientY - r.top - h/2;
    const Cp = merc(C.lat, C.lng);
    // Point under cursor in tile coords
    const ptx = Cp.tx + mx/TS, pty = Cp.ty + my/TS;
    const delta = e.deltaY < 0 ? 1 : -1;
    const newZ = Math.max(2, Math.min(18, Z + delta));
    if (newZ === Z) return;
    Z = newZ;
    const scale = (1 << Z) / N;
    // Recompute center so the point under cursor stays fixed
    C = tileToLatLng(ptx*scale - mx/TS, pty*scale - my/TS);
    render();
  }, { passive: false, signal: sig });

  // ── Drag to pan ───────────────────────────────────────────────────────────
  let pd = null;
  el.addEventListener('mousedown', e => {
    if (e.target.closest('[data-tmz]') || e.target.closest('a')) return;
    e.preventDefault();
    el.style.cursor = 'grabbing';
    pd = { sx: e.clientX, sy: e.clientY, lat: C.lat, lng: C.lng };
  }, { signal: sig });

  window.addEventListener('mousemove', e => {
    if (!pd || sig.aborted) return;
    const dx = e.clientX - pd.sx, dy = e.clientY - pd.sy;
    el.querySelectorAll('[data-tml]').forEach(d => d.style.transform = `translate(${dx}px,${dy}px)`);
  }, { signal: sig });

  window.addEventListener('mouseup', e => {
    if (!pd || sig.aborted) return;
    const N = 1 << Z;
    const dx = e.clientX - pd.sx, dy = e.clientY - pd.sy;
    const sin = Math.sin(pd.lat * Math.PI / 180);
    const tx  = (pd.lng + 180) / 360 * N - dx / TS;
    const ty  = (1 - Math.log((1+sin)/(1-sin)) / (2*Math.PI)) / 2 * N - dy / TS;
    C = tileToLatLng(tx, ty);
    pd = null;
    el.style.cursor = 'grab';
    render();
  }, { signal: sig });

  // ── Hover tooltip ─────────────────────────────────────────────────────────
  el.addEventListener('mousemove', e => {
    if (sig.aborted) return;
    const tip = el.querySelector(`#${mapId}-tmtip`);
    if (!tip) return;
    const mk = e.target.closest('[data-tmi]');
    if (mk && !pd) {
      const m = markers[+mk.dataset.tmi];
      if (!m) return;
      tip.textContent = m.label || '';
      tip.style.display = 'block';
      const r = el.getBoundingClientRect(), w = el.offsetWidth;
      let lx = e.clientX - r.left + 12, ly = e.clientY - r.top - 36;
      if (lx + 270 > w) lx = e.clientX - r.left - 270;
      if (ly < 0) ly = e.clientY - r.top + 14;
      tip.style.left = lx + 'px'; tip.style.top = ly + 'px';
    } else {
      tip.style.display = 'none';
    }
  }, { signal: sig });

  el.addEventListener('mouseleave', () => {
    const tip = el.querySelector(`#${mapId}-tmtip`);
    if (tip) tip.style.display = 'none';
  }, { signal: sig });
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
  const markers = _alertsData.map(al => {
    const [lat, lng] = _resolveAlertLatLng(al);
    const isCrit = al.severity === 'critical';
    const cyl = al.cylinder;
    return {
      lat, lng,
      color:  isCrit ? '#dc2626' : '#f59e0b',
      symbol: isCrit ? '!' : '▲',
      pulse:  isCrit,
      label:  al.title + (cyl ? ' · ' + (cyl.serial || '') + ' · ' + (cyl.company || '') : ''),
    };
  });
  buildTileMap('alert-map', markers, { height: 480, zoom: 6, center: { lat: -6.5, lng: 35.5 } });
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
    cyls.forEach(cyl => {
      const baseDate = cyl.lastRequalDate || cyl.manufactureDate;
      if (baseDate) {
        const due = new Date(baseDate + 'T00:00:00');
        due.setFullYear(due.getFullYear() + 10);
        if (due < now) alertRequalOverdue++;
      }
      if (cyl.status === 'in-circulation') {
        const cylEvs = events.filter(e => e.cylinderId === cyl.id)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (cylEvs.length) {
          const days = Math.floor((now - new Date(cylEvs[0].timestamp)) / 86400000);
          if (days > 90) alertStuck++;
        }
      }
    });
    // Misplaced: shipped to X received by Y
    const shipEvs = events.filter(e => e.type === 'shipped' && e.destinedFor);
    shipEvs.forEach(ev => {
      const cylEvs = events.filter(e => e.cylinderId === ev.cylinderId && new Date(e.timestamp) > new Date(ev.timestamp))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const recvEv = cylEvs.find(e => e.type === 'dist-received' || e.type === 'ret-received');
      if (recvEv && recvEv.company && recvEv.company !== ev.destinedFor) alertMisplaced++;
    });

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
      </div>`;
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
    ${role === 'ewura' ? `<div class="mgmt-card">
      <div class="mgmt-card-header">
        <div class="mgmt-card-title">${t('mgmt.opComplianceRanking')}</div>
        <button class="mgmt-card-export-btn" data-export="compliance-ranking" type="button">↓ CSV</button>
      </div>
      ${opRankHtml}
    </div>` : ''}`;
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

let _bulkLeafletMap = null;

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

  const TERMINAL = { lat:-6.7924, lng:39.2083 };

  const allMarkers = [
    { lat: TERMINAL.lat, lng: TERMINAL.lng, color: '#f59e0b', symbol: 'T', big: true,
      label: 'Dar es Salaam Import Terminal' },
    ...DEMO_BULK_TANKERS.map(tk => ({
      lat: tk.lat, lng: tk.lng,
      color:  tankerHexColor[tk.status] || '#64748b',
      symbol: tankerSym[tk.status] || '●',
      pulse:  tk.status === 'in-transit',
      label:  `${tk.plate} — ${tk.operator} (${statusLbl(tk.status)})${tk.routePct > 0 && tk.routePct < 100 ? ' · ' + tk.routePct + '% complete' : ''}`,
    })),
  ];

  const lines = DEMO_BULK_TANKERS
    .filter(tk => tk.status === 'in-transit')
    .map(tk => ({ from: TERMINAL, to: { lat: tk.lat, lng: tk.lng }, color: tankerHexColor['in-transit'] }));

  buildTileMap('bulk-map', allMarkers, { height: 420, zoom: 6, center: { lat: -5.5, lng: 35.5 }, lines });
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

  applyLang();
}

init().catch(err => {
  console.error('LPG Tracer init error:', err);
  showSnackbar('Startup error. Please reload.', 'error');
});
