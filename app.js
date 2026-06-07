'use strict';

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & DEMO DATA
// ══════════════════════════════════════════════════════════════════════════════

const DB_NAME    = 'lpg-tracer-db';
const DB_VERSION = 2;
const SEED_KEY   = 'seeded-v9';

const DEMO_CYLINDERS = [
  // Vivo LPG (12)
  { id:'E280116060000204C3F04E81', serial:'VLG-2013-001', company:'Vivo LPG', manufactureDate:'2013-03-10', tareWeight:14.5, capacity:12, fillCount:520, lastHydroTest:'2018-03-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E82', serial:'VLG-2015-002', company:'Vivo LPG', manufactureDate:'2015-06-10', tareWeight:14.5, capacity:12, fillCount:461, lastHydroTest:'2020-06-10', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E83', serial:'VLG-2016-003', company:'Vivo LPG', manufactureDate:'2016-01-22', tareWeight:14.5, capacity:12, fillCount:390, lastHydroTest:'2021-01-22', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E84', serial:'VLG-2017-004', company:'Vivo LPG', manufactureDate:'2017-09-05', tareWeight:14.5, capacity:12, fillCount:310, lastHydroTest:'2022-09-05', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04E85', serial:'VLG-2018-005', company:'Vivo LPG', manufactureDate:'2018-04-18', tareWeight:14.5, capacity:12, fillCount:230, lastHydroTest:'2023-04-18', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E86', serial:'VLG-2019-006', company:'Vivo LPG', manufactureDate:'2019-11-30', tareWeight:14.5, capacity:12, fillCount:174, lastHydroTest:'2024-11-30', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E87', serial:'VLG-2020-007', company:'Vivo LPG', manufactureDate:'2020-07-14', tareWeight:14.5, capacity:12, fillCount:118, lastHydroTest:'2025-07-14', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E88', serial:'VLG-2021-008', company:'Vivo LPG', manufactureDate:'2021-03-08', tareWeight:14.5, capacity:12, fillCount:82,  lastHydroTest:'2026-03-08', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EA1', serial:'VLG-2021-009', company:'Vivo LPG', manufactureDate:'2021-08-20', tareWeight:14.5, capacity:12, fillCount:74,  lastHydroTest:'2026-08-20', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EA2', serial:'VLG-2022-010', company:'Vivo LPG', manufactureDate:'2022-02-15', tareWeight:14.5, capacity:12, fillCount:55,  lastHydroTest:'2027-02-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EA3', serial:'VLG-2023-011', company:'Vivo LPG', manufactureDate:'2023-05-01', tareWeight:14.5, capacity:12, fillCount:28,  lastHydroTest:'2028-05-01', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04EA4', serial:'VLG-2024-012', company:'Vivo LPG', manufactureDate:'2024-01-10', tareWeight:14.5, capacity:12, fillCount:9,   lastHydroTest:'2029-01-10', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EF1', serial:'VLG-2012-013', company:'Vivo LPG', manufactureDate:'2012-05-15', tareWeight:14.5, capacity:12, fillCount:640, lastHydroTest:'2017-05-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EF2', serial:'VLG-2014-014', company:'Vivo LPG', manufactureDate:'2014-08-22', tareWeight:14.5, capacity:12, fillCount:490, lastHydroTest:'2019-08-22', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EF3', serial:'VLG-2025-015', company:'Vivo LPG', manufactureDate:'2025-02-01', tareWeight:14.5, capacity:12, fillCount:3,   lastHydroTest:'2030-02-01', status:'in-refill',      notes:'' },
  // Total Energies (15)
  { id:'E280116060000204C3F04E89', serial:'TEN-2014-001', company:'Total Energies', manufactureDate:'2014-02-27', tareWeight:14.5, capacity:12, fillCount:512, lastHydroTest:'2019-02-27', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E8A', serial:'TEN-2015-002', company:'Total Energies', manufactureDate:'2015-08-19', tareWeight:14.5, capacity:12, fillCount:420, lastHydroTest:'2020-08-19', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E8B', serial:'TEN-2016-003', company:'Total Energies', manufactureDate:'2016-05-03', tareWeight:14.5, capacity:12, fillCount:360, lastHydroTest:'2021-05-03', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E8C', serial:'TEN-2017-004', company:'Total Energies', manufactureDate:'2017-01-15', tareWeight:14.5, capacity:12, fillCount:295, lastHydroTest:'2022-01-15', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E8D', serial:'TEN-2018-005', company:'Total Energies', manufactureDate:'2018-07-22', tareWeight:14.5, capacity:12, fillCount:220, lastHydroTest:'2023-07-22', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04E8E', serial:'TEN-2019-006', company:'Total Energies', manufactureDate:'2019-09-10', tareWeight:14.5, capacity:12, fillCount:163, lastHydroTest:'2024-09-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E8F', serial:'TEN-2020-007', company:'Total Energies', manufactureDate:'2020-12-01', tareWeight:14.5, capacity:12, fillCount:101, lastHydroTest:'2025-12-01', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E90', serial:'TEN-2021-008', company:'Total Energies', manufactureDate:'2021-04-15', tareWeight:14.5, capacity:12, fillCount:68,  lastHydroTest:'2026-04-15', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04EB1', serial:'TEN-2021-009', company:'Total Energies', manufactureDate:'2021-10-30', tareWeight:14.5, capacity:12, fillCount:57,  lastHydroTest:'2026-10-30', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EB2', serial:'TEN-2022-010', company:'Total Energies', manufactureDate:'2022-06-18', tareWeight:14.5, capacity:12, fillCount:41,  lastHydroTest:'2027-06-18', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EB3', serial:'TEN-2023-011', company:'Total Energies', manufactureDate:'2023-02-05', tareWeight:14.5, capacity:12, fillCount:23,  lastHydroTest:'2028-02-05', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EB4', serial:'TEN-2024-012', company:'Total Energies', manufactureDate:'2024-03-20', tareWeight:14.5, capacity:12, fillCount:6,   lastHydroTest:'2029-03-20', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EF4', serial:'TEN-2013-013', company:'Total Energies', manufactureDate:'2013-07-10', tareWeight:14.5, capacity:12, fillCount:570, lastHydroTest:'2018-07-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EF5', serial:'TEN-2012-014', company:'Total Energies', manufactureDate:'2012-11-30', tareWeight:14.5, capacity:12, fillCount:610, lastHydroTest:'2017-11-30', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EF6', serial:'TEN-2025-015', company:'Total Energies', manufactureDate:'2025-01-15', tareWeight:14.5, capacity:12, fillCount:2,   lastHydroTest:'2030-01-15', status:'in-refill',      notes:'' },
  // Shell Gas (15)
  { id:'E280116060000204C3F04E91', serial:'SHG-2013-001', company:'Shell Gas', manufactureDate:'2013-06-20', tareWeight:14.5, capacity:12, fillCount:589, lastHydroTest:'2018-06-20', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E92', serial:'SHG-2014-002', company:'Shell Gas', manufactureDate:'2014-11-08', tareWeight:14.5, capacity:12, fillCount:480, lastHydroTest:'2019-11-08', status:'in-refill',      notes:'' },
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
  { id:'E280116060000204C3F04EF7', serial:'SHG-2012-013', company:'Shell Gas', manufactureDate:'2012-09-10', tareWeight:14.5, capacity:12, fillCount:618, lastHydroTest:'2017-09-10', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EF8', serial:'SHG-2015-014', company:'Shell Gas', manufactureDate:'2015-02-20', tareWeight:14.5, capacity:12, fillCount:445, lastHydroTest:'2020-02-20', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EF9', serial:'SHG-2025-015', company:'Shell Gas', manufactureDate:'2025-03-12', tareWeight:14.5, capacity:12, fillCount:4,   lastHydroTest:'2030-03-12', status:'in-refill',      notes:'' },
  // Lake Gas (9)
  { id:'E280116060000204C3F04E99', serial:'LKG-2015-001', company:'Lake Gas', manufactureDate:'2015-04-12', tareWeight:14.5, capacity:12, fillCount:430, lastHydroTest:'2020-04-12', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E9A', serial:'LKG-2016-002', company:'Lake Gas', manufactureDate:'2016-10-30', tareWeight:14.5, capacity:12, fillCount:340, lastHydroTest:'2021-10-30', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E9B', serial:'LKG-2018-003', company:'Lake Gas', manufactureDate:'2018-06-18', tareWeight:14.5, capacity:12, fillCount:238, lastHydroTest:'2023-06-18', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04E9C', serial:'LKG-2019-004', company:'Lake Gas', manufactureDate:'2019-01-09', tareWeight:14.5, capacity:12, fillCount:185, lastHydroTest:'2024-01-09', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04E9D', serial:'LKG-2020-005', company:'Lake Gas', manufactureDate:'2020-05-24', tareWeight:14.5, capacity:12, fillCount:122, lastHydroTest:'2025-05-24', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04E9E', serial:'LKG-2021-006', company:'Lake Gas', manufactureDate:'2021-09-11', tareWeight:14.5, capacity:12, fillCount:78,  lastHydroTest:'2026-09-11', status:'revalidation',   notes:'' },
  { id:'E280116060000204C3F04ED1', serial:'LKG-2022-007', company:'Lake Gas', manufactureDate:'2022-03-15', tareWeight:14.5, capacity:12, fillCount:49,  lastHydroTest:'2027-03-15', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04ED2', serial:'LKG-2023-008', company:'Lake Gas', manufactureDate:'2023-07-22', tareWeight:14.5, capacity:12, fillCount:21,  lastHydroTest:'2028-07-22', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04ED3', serial:'LKG-2024-009', company:'Lake Gas', manufactureDate:'2024-04-05', tareWeight:14.5, capacity:12, fillCount:7,   lastHydroTest:'2029-04-05', status:'in-refill',      notes:'' },
  { id:'E280116060000204C3F04EFA', serial:'LKG-2013-010', company:'Lake Gas', manufactureDate:'2013-04-08', tareWeight:14.5, capacity:12, fillCount:548, lastHydroTest:'2018-04-08', status:'in-circulation', notes:'' },
  { id:'E280116060000204C3F04EFB', serial:'LKG-2014-011', company:'Lake Gas', manufactureDate:'2014-12-15', tareWeight:14.5, capacity:12, fillCount:415, lastHydroTest:'2019-12-15', status:'in-use',         notes:'' },
  { id:'E280116060000204C3F04EFC', serial:'LKG-2025-012', company:'Lake Gas', manufactureDate:'2025-04-20', tareWeight:14.5, capacity:12, fillCount:2,   lastHydroTest:'2030-04-20', status:'in-refill',      notes:'' },
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
  serialCaptureActive: false,
  tagCaptureActive:    false,
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
      // Shipped out ~60 days ago, stuck at distributor (triggers stuck-in-circulation alert)
      const d = rnd(DISTRIBUTORS), r = rnd(RETAILERS);
      const base = now - 60*DAY;
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

  // Misplaced cylinder demo: shipped to ABC Gas, but received by Sunrise Gas (different region)
  const misplacedPairs = [
    { cylId:'E280116060000204C3F04E85', intendedDist:'ABC Gas Distributors',  intendedRegion:'Dar es Salaam', actualDist:'Sunrise Gas Ltd',       actualRegion:'Arusha' },
    { cylId:'E280116060000204C3F04E95', intendedDist:'Capital Gas Supplies',  intendedRegion:'Dodoma',        actualDist:'Southern Highlands Gas', actualRegion:'Mbeya'  },
  ];
  for (const mp of misplacedPairs) {
    const tShip = new Date(now - 10*DAY);
    const tRecv = new Date(now - 8*DAY);
    await txPut('events', { cylinderId:mp.cylId, type:'shipped',       timestamp:tShip.toISOString(), operatorId:'SYSTEM', company:'Vivo LPG', location:'Vivo LPG', destinedFor:mp.intendedDist, destinedRegion:mp.intendedRegion });
    await txPut('events', { cylinderId:mp.cylId, type:'dist-received', timestamp:tRecv.toISOString(), operatorId:'SYSTEM', company:mp.actualDist, location:mp.actualDist, region:mp.actualRegion });
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
const regWaterCapacity  = $('reg-water-capacity');
const regNetWeight      = $('reg-net-weight');
const regGrossWeight    = $('reg-gross-weight');
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
  } else if (role === 'distributor') {
    const dists = DEMO_NETWORK.filter(n => n.type === 'Distributor');
    loginCompSel.innerHTML = dists.map(n => `<option value="${escapeHtml(n.name)}">${escapeHtml(n.name)}</option>`).join('');
    loginCompSel.style.display = '';
  } else if (role === 'retailer') {
    const rets = DEMO_NETWORK.filter(n => n.type === 'Retailer');
    loginCompSel.innerHTML = rets.map(n => `<option value="${escapeHtml(n.name)}">${escapeHtml(n.name)}</option>`).join('');
    loginCompSel.style.display = '';
  } else {
    loginCompText.placeholder = role === 'ewura'          ? 'EWURA'
      : role === 'tra'           ? 'TRA'
      : role === 'revalidator'   ? 'e.g. ProRevalid Ltd'
      : 'e.g. Field Inspection Unit';
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

  const useSelect = ['lpgmc', 'distributor', 'retailer'].includes(_selectedRole);
  const company = useSelect ? loginCompSel.value.trim() : loginCompText.value.trim();

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
    statusBadge.hidden = false;
  } else {
    scannerInput.blur();
    focusBtn.classList.remove('active');
    focusIcon.textContent = '📡';
    focusLabel.textContent = 'Tap to start scanning';
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
    statusBadge.textContent = 'Unfocused';
    statusBadge.className = 'badge badge-scanning';
    statusBadge.hidden = false;
  }
});

scannerInput.addEventListener('focus', () => {
  if (State.focused) {
    statusBadge.textContent = 'Active';
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
  regWaterCapacity.value  = '26.1';
  regTare.value           = '14.5';
  regNetWeight.value      = '12';
  regGrossWeight.value    = '26.5';
  regPressureTest.value   = '';
  regHydrotest.value      = today;
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
    id:                tagId,
    serial:            serial,
    company:           Auth.session.company,
    ownerBrandName:    regBrandName.value.trim(),
    manufacturer:      regManufacturer.value.trim(),
    productName:       regProductName.value.trim(),
    manufactureDate:   regManufDate.value,
    lastRequalDate:    regRequalDate.value,
    requalPlant:       regRequalPlant.value.trim(),
    waterCapacity:     parseFloat(regWaterCapacity.value) || 26.1,
    tareWeight:        parseFloat(regTare.value) || 14.5,
    netWeight:         parseFloat(regNetWeight.value) || 12,
    capacity:          parseFloat(regNetWeight.value) || 12,
    grossWeight:       parseFloat(regGrossWeight.value) || 26.5,
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

  // Filter by company for LPGMC
  if (Auth.session && Auth.session.role === 'lpgmc') {
    _cylAllData = _cylAllData.filter(c => c.company === Auth.session.company);
  }

  // Build last-known-location cache for cylinders not in-use
  const allEvents = await txGetAll('events');
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

  // Stats
  const statuses = { 'in-refill': 0, 'in-circulation': 0, revalidation: 0, 'in-use': 0 };
  _cylAllData.forEach(c => { if (statuses[c.status] !== undefined) statuses[c.status]++; });
  const statLabels = {
    'in-refill':      'In Refill',
    'in-circulation': 'In Circulation',
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
    'revalidation':   'In Revalidation',
    'in-use':         'In Use',
  };

  data.forEach(cyl => {
    const li = document.createElement('li');
    li.className = 'cylinder-item';

    const dotClass  = 'dot-' + (cyl.status || 'in-refill');
    const statClass = 'status-' + (cyl.status || 'in-refill');
    const statLabel = statLabelMap[cyl.status] || cyl.status;

    const locData = cyl.status !== 'in-use' ? _cylLocations[cyl.id] : null;
    const locLine = locData
      ? `<span class="cylinder-meta-item">📍 ${[locData.region, locData.location].filter(Boolean).map(escapeHtml).join(' · ')}</span>`
      : '';

    li.innerHTML = `
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

let _passportMap = null;

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
  // Destroy any previous passport map
  if (_passportMap) { _passportMap.remove(); _passportMap = null; }

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
    </div>
    <div class="passport-section">
      <div class="passport-section-title">Operational</div>
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
            <span class="ph-desc">${escapeHtml(EVENT_LABELS[ev.type] || ev.type)}${ev.company ? ' · ' + escapeHtml(ev.company) : ''}${ev.region ? ' (' + escapeHtml(ev.region) + ')' : ''}${ev.destinedFor ? ' → ' + escapeHtml(ev.destinedFor) : ''}</span>
          </li>`).join('') : '<li><span class="ph-desc">No events.</span></li>'}
      </ul>
    </div>
    ${passportMapPartner ? `
    <div class="passport-section">
      <div class="passport-section-title">Current Location</div>
      <div style="font-size:12px;color:var(--dim);margin-bottom:8px">📍 ${escapeHtml(passportMapPartner.name)} · ${escapeHtml(passportMapPartner.city)}, ${escapeHtml(passportMapPartner.region)}</div>
      <div id="passport-location-map" style="height:200px;border-radius:var(--radius);border:1px solid var(--border);overflow:hidden"></div>
    </div>` : ''}
    ${(() => {
      const acts = getNextActions(cyl, Auth.session?.role || '');
      if (!acts.length) return '';
      return `<div class="passport-section">
        <div class="passport-section-title">Record Action</div>
        <div class="passport-actions">
          ${acts.map(a => `<button class="btn btn-outline passport-action-btn" data-action-type="${escapeHtml(a.type)}" data-cyl-id="${escapeHtml(cyl.id)}" type="button">${a.icon} ${escapeHtml(a.label)}</button>`).join('')}
        </div>
      </div>`;
    })()}`;

  openModal('modal-passport');

  if (passportMapPartner) {
    setTimeout(() => {
      try {
        const el = $('passport-location-map');
        if (!el) return;
        _passportMap = L.map('passport-location-map').setView([passportMapPartner.lat, passportMapPartner.lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors', maxZoom: 18
        }).addTo(_passportMap);
        const color = passportMapPartner.type === 'Distributor' ? '#3b82f6' : '#10b981';
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.4)"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        });
        L.marker([passportMapPartner.lat, passportMapPartner.lng], { icon })
          .addTo(_passportMap)
          .bindPopup(`<strong>${passportMapPartner.name}</strong><br>${passportMapPartner.address}`)
          .openPopup();
        _passportMap.invalidateSize();
      } catch (e) { console.warn('Passport map error:', e); }
    }, 150);
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
  await commitScanEvent(cyl, null, type);
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

    // 3. Stuck in circulation > 45 days
    if (cyl.status === 'in-circulation') {
      const cylEvents = allEvents.filter(e => e.cylinderId === cyl.id)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      const lastEv = cylEvents[0];
      if (lastEv) {
        const days = Math.floor((now - new Date(lastEv.timestamp)) / (24*60*60*1000));
        if (days > 45) {
          _alertsData.push({ severity:'warning', type:'stuck-in-circulation', cylinder:cyl,
            title: `${cyl.serial} — Stuck in Circulation (${days}d)`,
            desc: `Cylinder has been in circulation for ${days} days without returning to refill.` });
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
  if (!data.length) { alertsEmpty.style.display = ''; return; }
  alertsEmpty.style.display = 'none';

  const statLabelMap = {
    'in-refill': 'In Refill', 'in-circulation': 'In Circulation',
    'revalidation': 'In Revalidation', 'in-use': 'In Use',
  };
  data.forEach(al => {
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
    const inCirculation  = cyls.filter(c => c.status === 'in-circulation').length;
    const inRevalidation = cyls.filter(c => c.status === 'revalidation').length;
    const inUse          = cyls.filter(c => c.status === 'in-use').length;
    const total          = inRefill + inCirculation + inRevalidation + inUse;

    // In-circulation breakdown: full vs empty based on last event type
    const CIRC_FULL_EV  = new Set(['shipped', 'dist-received', 'dist-sent-retail', 'ret-received']);
    const CIRC_EMPTY_EV = new Set(['ret-returned-empty', 'dist-returned-empty']);
    const cylInCirc = cyls.filter(c => c.status === 'in-circulation');
    let circFull = 0, circEmpty = 0;
    cylInCirc.forEach(cyl => {
      const lastEv = events
        .filter(e => e.cylinderId === cyl.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      if (!lastEv) return;
      if (CIRC_FULL_EV.has(lastEv.type))  circFull++;
      else if (CIRC_EMPTY_EV.has(lastEv.type)) circEmpty++;
    });

    const refillerCount = LPGMC_COMPANIES.length;
    const distCount     = DEMO_NETWORK.filter(n => n.type === 'Distributor').length;
    const retailCount   = DEMO_NETWORK.filter(n => n.type === 'Retailer').length;

    const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;
    const requalSoon = cyls.filter(c => {
      const baseDate = c.lastRequalDate || c.manufactureDate;
      if (!baseDate) return false;
      const base = new Date(baseDate + 'T00:00:00');
      const dueDate = new Date(base);
      dueDate.setFullYear(dueDate.getFullYear() + 10);
      return (dueDate - new Date()) <= twoYears;
    }).length;

    // Alerts total — compute inline so it doesn't depend on renderAlerts timing
    let alertTotal = requalSoon;
    cyls.forEach(cyl => {
      if (cyl.status === 'in-circulation') {
        const cylEvs = events.filter(e => e.cylinderId === cyl.id)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (cylEvs.length) {
          const days = Math.floor((Date.now() - new Date(cylEvs[0].timestamp)) / 86400000);
          if (days > 45) alertTotal++;
        }
      }
    });

    reportsGrid.innerHTML = `
      <div class="dashboard-section-title">Cylinder Lifecycle</div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--green)">${inRefill}</span>
        <div class="report-card-label">In Refill</div>
      </div>
      <div class="report-card">
        <span class="report-card-value" style="color:var(--blue)">${inCirculation}</span>
        <div class="report-card-label">In Circulation</div>
        <div class="report-card-sub">
          <span style="color:var(--green);font-size:11px">✅ ${circFull} full</span>
          &nbsp;·&nbsp;
          <span style="color:var(--muted);font-size:11px">📭 ${circEmpty} empty</span>
        </div>
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
      </div>
      <div class="dashboard-section-title">Alerts</div>
      <div class="report-card" style="border-color:${requalSoon > 10 ? 'var(--red)' : requalSoon > 5 ? 'var(--amber)' : 'var(--surface-3)'}">
        <span class="report-card-value" style="color:${requalSoon > 10 ? 'var(--red)' : requalSoon > 5 ? 'var(--amber)' : 'var(--green)'}">${requalSoon}</span>
        <div class="report-card-label">Requalification Due (2yr)</div>
      </div>
      <div class="report-card" style="border-color:${alertTotal > 10 ? 'var(--red)' : alertTotal > 0 ? 'var(--amber)' : 'var(--surface-3)'}">
        <span class="report-card-value" style="color:${alertTotal > 10 ? 'var(--red)' : alertTotal > 0 ? 'var(--amber)' : 'var(--green)'}">${alertTotal}</span>
        <div class="report-card-label">Total Alerts</div>
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

    const total    = cyls.length;
    const inRefill = cyls.filter(c => c.status === 'in-refill').length;
    const inCirc   = cyls.filter(c => c.status === 'in-circulation').length;
    const inUse    = cyls.filter(c => c.status === 'in-use').length;

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
        <span class="report-card-value" style="color:var(--purple)">${inUse}</span>
        <div class="report-card-label">In Use</div>
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

async function renderNetwork() {
  const networkList  = $('network-list');
  const networkEmpty = $('network-empty');

  // Current filter
  const activeFilterBtn = document.querySelector('.network-filters .btn-primary');
  const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : '';

  const filtered = activeFilter
    ? DEMO_NETWORK.filter(n => n.type === activeFilter)
    : DEMO_NETWORK;

  // ── Render list (no Leaflet dependency) ──────────────────────────────────
  networkList.innerHTML = '';
  if (!filtered.length) {
    networkEmpty.style.display = '';
  } else {
    networkEmpty.style.display = 'none';
    filtered.forEach(partner => {
      const li = document.createElement('li');
      li.className = 'network-item';
      li.style.cursor = 'pointer';
      li.dataset.id = partner.id;
      const typeClass = 'type-' + partner.type.toLowerCase();
      li.innerHTML = `
        <div class="network-item-header">
          <span class="network-item-name">${escapeHtml(partner.name)}</span>
          <span class="network-type-badge ${escapeHtml(typeClass)}">${escapeHtml(partner.type)}</span>
        </div>
        <div class="network-item-meta">
          📍 ${escapeHtml(partner.city)} · ${escapeHtml(partner.address)}<br>
          📞 ${escapeHtml(partner.contact)} ·
          <span class="network-item-cyls">🛢 ${partner.cylinders} total · <span class="cyl-full">✅ ${partner.full} full</span> · <span class="cyl-empty">📭 ${partner.empty} empty</span></span> ·
          <span class="network-status-${escapeHtml(partner.status)}">${escapeHtml(partner.status)}</span>
        </div>`;
      networkList.appendChild(li);
    });
  }

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

  // Populate stock stats
  $('partner-stat-total').textContent = partner.cylinders ?? '—';
  $('partner-stat-full').textContent  = partner.full  != null ? partner.full  : '—';
  $('partner-stat-empty').textContent = partner.empty != null ? partner.empty : '—';

  // Calculate sales from event history
  const allEvents = await txGetAll('events');
  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart      = new Date(now.getFullYear(), 0, 1);
  const partnerSales   = allEvents.filter(ev => ev.type === 'ret-sold' && ev.company === partner.name);
  const lastMonthSales = partnerSales.filter(ev => { const d = new Date(ev.timestamp); return d >= lastMonthStart && d < lastMonthEnd; }).length;
  const thisYearSales  = partnerSales.filter(ev => new Date(ev.timestamp) >= yearStart).length;
  $('partner-stat-last-month').textContent = lastMonthSales;
  $('partner-stat-this-year').textContent  = thisYearSales;

  // Destroy existing map so size is always fresh on each open
  if (_partnerDetailMap) {
    _partnerDetailMap.remove();
    _partnerDetailMap    = null;
    _partnerDetailMarker = null;
  }

  openModal('modal-partner');

  setTimeout(() => {
    try {
      _partnerDetailMap = L.map('partner-detail-map', { zoomControl: true })
        .setView([partner.lat, partner.lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(_partnerDetailMap);

      const color = partner.type === 'Distributor' ? '#3b82f6' : '#10b981';
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      _partnerDetailMarker = L.marker([partner.lat, partner.lng], { icon })
        .addTo(_partnerDetailMap)
        .bindPopup(`<strong>${partner.name}</strong><br>${partner.address}`)
        .openPopup();

      _partnerDetailMap.invalidateSize();
    } catch (e) {
      console.warn('Partner map error:', e);
    }
  }, 350);
}

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
    'in-refill':      'In Refill',
    'in-circulation': 'In Circulation',
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
    // Default: last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ label: d.toLocaleString('default', { month: 'short', year: '2-digit' }), year: d.getFullYear(), month: d.getMonth(), count: 0 });
    }
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

  // 3. Top 10 partners — by sales count when filtered, else by cylinder stock
  let top5, partnerCardTitle;
  if (filterYear !== null || filterMonth !== null) {
    partnerCardTitle = 'Top 10 Partners by Sales';
    const salesByPartner = {};
    allEvents.forEach(ev => {
      if (ev.type !== 'ret-sold' || !ev.company) return;
      if (!inPeriod(ev.timestamp)) return;
      salesByPartner[ev.company] = (salesByPartner[ev.company] || 0) + 1;
    });
    top5 = Object.entries(salesByPartner)
      .sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([name, count]) => {
        const net = DEMO_NETWORK.find(n => n.name === name);
        return { name, cylinders: count, type: net?.type || 'Retailer' };
      });
  } else {
    partnerCardTitle = 'Top 10 Partners by Cylinder Count';
    top5 = [...DEMO_NETWORK].sort((a, b) => b.cylinders - a.cylinders).slice(0, 10);
  }
  const maxPartnerCyls = top5.length ? Math.max(...top5.map(p => p.cylinders), 1) : 1;
  const partnerBarsHtml = top5.length ? top5.map(p => {
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
  }).join('') : '<p style="font-size:13px;color:var(--dim);padding:8px 0">No sales data for this period.</p>';

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
    : '<p style="font-size:13px;color:var(--dim);padding:8px 0">No sales data yet.</p>';

  grid.innerHTML = `
    <div class="mgmt-card">
      <div class="mgmt-card-title">Cylinders by Status</div>
      ${statusBarsHtml}
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-title">Refills</div>
      ${fillBarsHtml}
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-title">${escapeHtml(partnerCardTitle)}</div>
      ${partnerBarsHtml}
    </div>
    <div class="mgmt-card">
      <div class="mgmt-card-title">Sales by Region</div>
      ${regionBarsHtml}
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

  // Destroy partner detail map
  if (_partnerDetailMap) {
    _partnerDetailMap.remove();
    _partnerDetailMap = null;
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
