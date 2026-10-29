import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowDownRight, 
  ArrowUpRight, 
  Boxes, 
  History, 
  Package, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Search, 
  Layers, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  Info,
  Users,
  ShieldCheck,
  Lock,
  UserCheck,
  Trash2,
  Wheat,
  Settings,
  Download,
  Printer,
  Calendar,
  Filter,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

// MASTER PRODUCTS (Tepung Tapioka Fixed Variations)
const TAPIOKA_PRODUCTS = [
  { id: 'PROD-TT50', sku: 'TT-KRG-50', name: 'Tepung Tapioka - Karung 50kg', packType: 'Karung', weightKg: 50, minStock: 40 },
  { id: 'PROD-TT25', sku: 'TT-KRG-25', name: 'Tepung Tapioka - Karung 25kg', packType: 'Karung', weightKg: 25, minStock: 60 },
  { id: 'PROD-TT10', sku: 'TT-KDS-10', name: 'Tepung Tapioka - Kardus 10kg (1kg x 10)', packType: 'Kardus', weightKg: 10, minStock: 100 }
];

// INITIAL USERS
const INITIAL_USERS = [
  { id: 'USR-01', name: 'H. Sadulur', email: 'owner@tanisadulur.co.id', role: 'Pemilik', status: 'Aktif' },
  { id: 'USR-02', name: 'Ahmad Operator', email: 'ahmad@tanisadulur.co.id', role: 'Admin', status: 'Aktif' },
  { id: 'USR-03', name: 'Budi Gudang', email: 'budi@tanisadulur.co.id', role: 'Admin', status: 'Aktif' }
];

// INITIAL DUMMY BATCHES WITH VARIOUS AGES FOR DEMONSTRATION
// Assuming current simulated date is ~late 2026 / November 2026
const INITIAL_BATCHES = [
  // Kritis (> 10 Bulan): Tgl masuk Nov/Des 2025
  { id: 'B-5001', productId: 'PROD-TT50', batchNo: 'LOT-20251110-K50', entryDate: '2025-11-10', originalQty: 100, remainingQty: 20, location: 'RAK-A1', supplier: 'Pabrik Tapioka Lampung' },
  // Mendekati Batas (6-10 Bulan): Tgl masuk Mar/Apr 2026
  { id: 'B-5002', productId: 'PROD-TT50', batchNo: 'LOT-20260315-K50', entryDate: '2026-03-15', originalQty: 150, remainingQty: 80, location: 'RAK-A2', supplier: 'Pabrik Tapioka Subang' },
  // Aman (< 6 Bulan): Tgl masuk Sep/Okt 2026
  { id: 'B-5003', productId: 'PROD-TT50', batchNo: 'LOT-20261001-K50', entryDate: '2026-10-01', originalQty: 200, remainingQty: 200, location: 'RAK-A3', supplier: 'Pabrik Tapioka Pati' },

  // Batch Karung 25kg
  { id: 'B-2501', productId: 'PROD-TT25', batchNo: 'LOT-20251201-K25', entryDate: '2025-12-01', originalQty: 150, remainingQty: 25, location: 'RAK-B1', supplier: 'Pabrik Tapioka Lampung' },
  { id: 'B-2502', productId: 'PROD-TT25', batchNo: 'LOT-20260410-K25', entryDate: '2026-04-10', originalQty: 200, remainingQty: 120, location: 'RAK-B2', supplier: 'Pabrik Tapioka Pati' },
  { id: 'B-2503', productId: 'PROD-TT25', batchNo: 'LOT-20260920-K25', entryDate: '2026-09-20', originalQty: 250, remainingQty: 250, location: 'RAK-B3', supplier: 'Pabrik Tapioka Subang' },

  // Batch Kardus 10kg
  { id: 'B-1001', productId: 'PROD-TT10', batchNo: 'LOT-20260215-KD10', entryDate: '2026-02-15', originalQty: 300, remainingQty: 40, location: 'RAK-C1', supplier: 'Pabrik Tapioka Subang' },
  { id: 'B-1002', productId: 'PROD-TT10', batchNo: 'LOT-20261010-KD10', entryDate: '2026-10-10', originalQty: 300, remainingQty: 280, location: 'RAK-C2', supplier: 'Pabrik Tapioka Lampung' }
];

// INITIAL HISTORY
const INITIAL_HISTORY = [
  { id: 'HIST-001', type: 'INBOUND', date: '2025-11-10 08:30', sku: 'TT-KRG-50', productName: 'Tepung Tapioka - Karung 50kg', qty: 100, batchNo: 'LOT-20251110-K50', user: 'Ahmad Operator', note: 'Penerimaan Stok Awal Lampung' },
  { id: 'HIST-002', type: 'INBOUND', date: '2026-03-15 09:15', sku: 'TT-KRG-50', productName: 'Tepung Tapioka - Karung 50kg', qty: 150, batchNo: 'LOT-20260315-K50', user: 'Budi Gudang', note: 'Pasokan Tambahan Subang' },
  { id: 'HIST-003', type: 'OUTBOUND', date: '2026-09-01 14:00', sku: 'TT-KRG-50', productName: 'Tepung Tapioka - Karung 50kg', qty: 80, customer: 'PT Kerupuk Nusantara', user: 'Ahmad Operator', note: 'Pengeluaran FIFO Batch LOT-20251110-K50' },
  { id: 'HIST-004', type: 'INBOUND', date: '2026-10-01 10:00', sku: 'TT-KRG-50', productName: 'Tepung Tapioka - Karung 50kg', qty: 200, batchNo: 'LOT-20261001-K50', user: 'Ahmad Operator', note: 'Stock In Pati' },
  { id: 'HIST-005', type: 'OUTBOUND', date: '2026-10-15 11:30', sku: 'TT-KRG-25', productName: 'Tepung Tapioka - Karung 25kg', qty: 125, customer: 'Toko Tani Makmur', user: 'Budi Gudang', note: 'DO #9910 Pengeluaran FIFO' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // CURRENT LOGGED IN USER
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]); // Default: Pemilik
  
  const [users, setUsers] = useState(INITIAL_USERS);
  const [products] = useState(TAPIOKA_PRODUCTS);
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [history, setHistory] = useState(INITIAL_HISTORY);

  // CONFIGURABLE AGING SETTINGS (In Months)
  const [agingSettings, setAgingSettings] = useState({
    warningMonths: 6,   // > 6 Bulan = Mendekati Batas
    criticalMonths: 10  // > 10 Bulan = Kritis
  });

  // FILTER & REPORTING STATE
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'ALL',
    productId: 'ALL',
    search: ''
  });

  // Inbound Form
  const [inboundForm, setInboundForm] = useState({
    productId: TAPIOKA_PRODUCTS[0].id,
    batchNo: '',
    entryDate: new Date().toISOString().split('T')[0],
    quantity: '',
    location: 'RAK-A1',
    supplier: 'Pabrik Tapioka Lampung',
    note: ''
  });

  // Outbound Form
  const [outboundForm, setOutboundForm] = useState({
    productId: TAPIOKA_PRODUCTS[0].id,
    customer: '',
    quantity: '',
    note: ''
  });

  // User Form Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Admin' });

  // Inventory Search Filter
  const [inventorySearch, setInventorySearch] = useState('');

  // -------------------------------------------------------------
  // HELPER: CALCULATE AGE & STACK AGING STATUS
  // -------------------------------------------------------------
  const calculateBatchAge = (entryDateStr) => {
    const entryDate = new Date(entryDateStr);
    const today = new Date('2026-10-28'); // Simulated anchor date (or current date)
    
    // Difference in months
    const diffTime = Math.abs(today - entryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = +(diffDays / 30.44).toFixed(1);

    let status = 'AMAN'; // Green
    if (diffMonths >= agingSettings.criticalMonths) {
      status = 'KRITIS'; // Red
    } else if (diffMonths >= agingSettings.warningMonths) {
      status = 'MENDEKATI_BATAS'; // Yellow
    }

    return { diffDays, diffMonths, status };
  };

  // -------------------------------------------------------------
  // CALCULATED METRICS & AGING
  // -------------------------------------------------------------
  const batchesWithAge = useMemo(() => {
    return batches.map(b => {
      const ageInfo = calculateBatchAge(b.entryDate);
      return {
        ...b,
        ageMonths: ageInfo.diffMonths,
        ageDays: ageInfo.diffDays,
        agingStatus: ageInfo.status
      };
    });
  }, [batches, agingSettings]);

  const productStockMap = useMemo(() => {
    const map = {};
    products.forEach(p => { map[p.id] = 0; });
    batches.forEach(b => {
      if (map[b.productId] !== undefined) {
        map[b.productId] += b.remainingQty;
      }
    });
    return map;
  }, [products, batches]);

  const totalStockInKg = useMemo(() => {
    let totalKg = 0;
    products.forEach(p => {
      const count = productStockMap[p.id] || 0;
      totalKg += count * p.weightKg;
    });
    return totalKg;
  }, [products, productStockMap]);

  const totalStockPacks = useMemo(() => {
    return Object.values(productStockMap).reduce((a, b) => a + b, 0);
  }, [productStockMap]);

  // Aging Summary Counts
  const agingSummary = useMemo(() => {
    let aman = 0;
    let warning = 0;
    let kritis = 0;

    batchesWithAge.filter(b => b.remainingQty > 0).forEach(b => {
      if (b.agingStatus === 'KRITIS') kritis++;
      else if (b.agingStatus === 'MENDEKATI_BATAS') warning++;
      else aman++;
    });

    return { aman, warning, kritis };
  }, [batchesWithAge]);

  // FIFO Priority List (Oldest active batch per product)
  const fifoPriorityBatches = useMemo(() => {
    const sorted = [...batchesWithAge]
      .filter(b => b.remainingQty > 0)
      .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));

    const productSeen = new Set();
    const result = [];
    
    sorted.forEach(b => {
      if (!productSeen.has(b.productId)) {
        productSeen.add(b.productId);
        const prod = products.find(p => p.id === b.productId);
        result.push({
          ...b,
          productName: prod ? prod.name : 'Unknown',
          sku: prod ? prod.sku : '-'
        });
      }
    });
    return result;
  }, [batchesWithAge, products]);

  // Outbound Allocation Calculation Preview
  const fifoOutboundAllocation = useMemo(() => {
    const qty = parseInt(outboundForm.quantity, 10);
    if (!outboundForm.productId || isNaN(qty) || qty <= 0) return { batchesToTake: [], sufficient: true, totalAvailable: 0 };

    const availableBatches = batchesWithAge
      .filter(b => b.productId === outboundForm.productId && b.remainingQty > 0)
      .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));

    const totalAvailable = availableBatches.reduce((sum, b) => sum + b.remainingQty, 0);

    let needed = qty;
    const allocation = [];

    for (const b of availableBatches) {
      if (needed <= 0) break;
      const take = Math.min(needed, b.remainingQty);
      allocation.push({
        batchId: b.id,
        batchNo: b.batchNo,
        entryDate: b.entryDate,
        location: b.location,
        available: b.remainingQty,
        takeQty: take,
        agingStatus: b.agingStatus,
        ageMonths: b.ageMonths
      });
      needed -= take;
    }

    return {
      batchesToTake: allocation,
      sufficient: totalAvailable >= qty,
      totalAvailable
    };
  }, [outboundForm.productId, outboundForm.quantity, batchesWithAge]);

  // Filtered History Report
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // Type Filter
      if (reportFilters.type !== 'ALL' && item.type !== reportFilters.type) return false;
      
      // Product Filter
      if (reportFilters.productId !== 'ALL') {
        const prod = products.find(p => p.id === reportFilters.productId);
        if (prod && item.sku !== prod.sku) return false;
      }

      // Search Query
      if (reportFilters.search) {
        const q = reportFilters.search.toLowerCase();
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchName = item.productName.toLowerCase().includes(q);
        const matchBatch = item.batchNo ? item.batchNo.toLowerCase().includes(q) : false;
        const matchNote = item.note ? item.note.toLowerCase().includes(q) : false;
        if (!matchSku && !matchName && !matchBatch && !matchNote) return false;
      }

      // Date Range Filter
      if (reportFilters.startDate) {
        const itemDate = new Date(item.date.split(' ')[0]);
        const startDate = new Date(reportFilters.startDate);
        if (itemDate < startDate) return false;
      }

      if (reportFilters.endDate) {
        const itemDate = new Date(item.date.split(' ')[0]);
        const endDate = new Date(reportFilters.endDate);
        if (itemDate > endDate) return false;
      }

      return true;
    });
  }, [history, reportFilters, products]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleInboundSubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(inboundForm.quantity, 10);
    if (!qty || qty <= 0) return;

    const selectedProduct = products.find(p => p.id === inboundForm.productId);
    const dateStr = inboundForm.entryDate.replace(/-/g, '');
    const defaultLotNo = `LOT-${dateStr}-${selectedProduct.sku.replace('TT-', '')}`;
    const batchNumber = inboundForm.batchNo.trim() || defaultLotNo;

    const newBatch = {
      id: `B-${Date.now().toString().slice(-4)}`,
      productId: inboundForm.productId,
      batchNo: batchNumber,
      entryDate: inboundForm.entryDate,
      originalQty: qty,
      remainingQty: qty,
      location: inboundForm.location,
      supplier: inboundForm.supplier
    };

    setBatches([newBatch, ...batches]);

    const newHist = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      type: 'INBOUND',
      date: new Date().toLocaleString('id-ID'),
      sku: selectedProduct ? selectedProduct.sku : '-',
      productName: selectedProduct ? selectedProduct.name : '-',
      qty: qty,
      batchNo: batchNumber,
      user: currentUser.name,
      note: inboundForm.note || `Masuk dari ${inboundForm.supplier}`
    };

    setHistory([newHist, ...history]);
    setInboundForm({ ...inboundForm, batchNo: '', quantity: '', note: '' });
    alert(`✅ Penerimaan Tepung Tapioka (${selectedProduct.name}) berhasil dicatat.`);
  };

  const handleOutboundSubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(outboundForm.quantity, 10);
    if (!qty || qty <= 0) return;

    if (!fifoOutboundAllocation.sufficient) {
      alert('❌ Stok Kemasan Tepung Tapioka ini tidak mencukupi!');
      return;
    }

    let remainingToDeduct = qty;
    const updatedBatches = batches.map(b => {
      if (b.productId === outboundForm.productId && b.remainingQty > 0 && remainingToDeduct > 0) {
        const deduct = Math.min(remainingToDeduct, b.remainingQty);
        remainingToDeduct -= deduct;
        return { ...b, remainingQty: b.remainingQty - deduct };
      }
      return b;
    });

    setBatches(updatedBatches);

    const selectedProduct = products.find(p => p.id === outboundForm.productId);
    const batchSummary = fifoOutboundAllocation.batchesToTake
      .map(b => `${b.batchNo} (${b.takeQty} unit)`)
      .join(', ');

    const newHist = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      type: 'OUTBOUND',
      date: new Date().toLocaleString('id-ID'),
      sku: selectedProduct ? selectedProduct.sku : '-',
      productName: selectedProduct ? selectedProduct.name : '-',
      qty: qty,
      customer: outboundForm.customer || 'Pembeli Umum',
      user: currentUser.name,
      note: `FIFO Deduction: ${batchSummary}. ${outboundForm.note ? '(' + outboundForm.note + ')' : ''}`
    };

    setHistory([newHist, ...history]);
    setOutboundForm({ productId: products[0]?.id || '', customer: '', quantity: '', note: '' });
    alert('🚀 Barang Keluar Berhasil! Stok Tepung Tapioka dipotong otomatis mengikut aturan FIFO.');
  };

  // User Management
  const handleAddUser = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'Pemilik') {
      alert('Akses Ditolak: Hanya Pemilik yang dapat menambah pengguna.');
      return;
    }
    if (!userForm.name || !userForm.email) return;

    const newUser = {
      id: `USR-${String(users.length + 1).padStart(2, '0')}`,
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      status: 'Aktif'
    };

    setUsers([...users, newUser]);
    setShowAddUserModal(false);
    setUserForm({ name: '', email: '', role: 'Admin' });
    alert(`User ${newUser.name} (${newUser.role}) berhasil ditambahkan!`);
  };

  const handleDeleteUser = (id) => {
    if (currentUser.role !== 'Pemilik') return;
    if (users.length <= 1) {
      alert('TIDAK BISA MENGHAPUS: Minimal harus ada 1 pengguna.');
      return;
    }
    setUsers(users.filter(u => u.id !== id));
  };

  const handleToggleUserRole = (id) => {
    if (currentUser.role !== 'Pemilik') return;
    setUsers(users.map(u => u.id === id ? { ...u, role: u.role === 'Pemilik' ? 'Admin' : 'Pemilik' } : u));
  };

  // EXPORT EXCEL (HTML Spreadsheet format)
  const exportToExcel = () => {
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/><title>Laporan Mutasi CV Tani Sadulur</title></head>
      <body>
        <h2>LAPORAN MUTASI GUDANG TEPUNG TAPIOKA - CV TANI SADULUR</h2>
        <p>Tanggal Cetak: ${new Date().toLocaleString('id-ID')}</p>
        <table border="1" style="border-collapse:collapse;">
          <thead>
            <tr style="background-color:#065f46; color:#ffffff;">
              <th>No</th>
              <th>Waktu Transaksi</th>
              <th>Tipe Mutasi</th>
              <th>SKU</th>
              <th>Kemasan Tapioka</th>
              <th>Jumlah (Pack/Karung)</th>
              <th>No Batch / Lot</th>
              <th>Petugas</th>
              <th>Keterangan / Tujuan</th>
            </tr>
          </thead>
          <tbody>`;

    filteredHistory.forEach((h, index) => {
      html += `<tr>
        <td>${index + 1}</td>
        <td>${h.date}</td>
        <td>${h.type}</td>
        <td>${h.sku}</td>
        <td>${h.productName}</td>
        <td>${h.qty}</td>
        <td>${h.batchNo || '-'}</td>
        <td>${h.user || '-'}</td>
        <td>${h.note || '-'}</td>
      </tr>`;
    });

    html += `</tbody></table></body></html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Mutasi_Gudang_Tapioka_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PRINT / EXPORT PDF
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-emerald-950 text-slate-300 flex flex-col justify-between shrink-0 shadow-xl border-r border-emerald-900 print:hidden">
        <div>
          {/* Logo Branding CV Tani Sadulur */}
          <div className="p-5 flex items-center space-x-3 border-b border-emerald-900/80 bg-emerald-900/40">
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg ring-2 ring-emerald-400/30">
              <Wheat size={22} />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base leading-tight tracking-wide">CV Tani Sadulur</h1>
              <span className="text-[11px] text-emerald-400 font-medium">WMS Tepung Tapioka</span>
            </div>
          </div>

          {/* Current User Switcher Widget */}
          <div className="mx-3 my-4 p-3 bg-emerald-900/60 rounded-xl border border-emerald-800/80">
            <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold mb-1 flex items-center justify-between">
              <span>Pengguna Aktif:</span>
              <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${currentUser.role === 'Pemilik' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'}`}>
                {currentUser.role}
              </span>
            </div>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = users.find(u => u.id === e.target.value);
                if (found) setCurrentUser(found);
              }}
              className="w-full text-xs bg-emerald-950 border border-emerald-700 text-white rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          {/* Nav Items */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('inbound')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'inbound' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <ArrowDownRight size={18} />
              <span>Inbound Tapioka</span>
            </button>

            <button
              onClick={() => setActiveTab('outbound')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'outbound' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <ArrowUpRight size={18} />
              <span>Outbound (FIFO)</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'inventory' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <Layers size={18} />
              <span>Stok & Batch FIFO</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'reports' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <History size={18} />
              <span>Laporan & Export</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <Settings size={18} />
              <span>Pengaturan Umur Stok</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-900/50 hover:text-white'
              } ${currentUser.role !== 'Pemilik' ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <Users size={18} />
                <span>Kelola Pengguna</span>
              </div>
              {currentUser.role !== 'Pemilik' && <Lock size={14} className="text-amber-400" />}
            </button>
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-emerald-900 text-[11px] text-emerald-400/80">
          <div className="flex items-center space-x-1.5 text-amber-400 font-semibold mb-1">
            <Info size={14} />
            <span>Sistem Gudang FIFO</span>
          </div>
          Monitoring umur stok Tepung Tapioka otomatis (Aman / Mendekati Batas / Kritis).
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm print:hidden">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Dashboard Gudang Tapioka'}
              {activeTab === 'inbound' && 'Penerimaan Tepung Tapioka (Inbound)'}
              {activeTab === 'outbound' && 'Pengeluaran Barang (Outbound) - System FIFO'}
              {activeTab === 'inventory' && 'Inventaris Batch & Status Umur Stok'}
              {activeTab === 'reports' && 'Laporan Mutasi & Filter Export'}
              {activeTab === 'settings' && 'Pengaturan Ambang Batas Umur Stok'}
              {activeTab === 'users' && 'Manajemen Pengguna (Khusus Pemilik)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">CV Tani Sadulur — Pendistribusian Tepung Tapioka Karung & Kardus</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <UserCheck size={16} className="text-emerald-600" />
              <div>
                <div className="font-bold text-slate-800">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500">Role: <span className="font-bold text-emerald-700">{currentUser.role}</span></div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 print:p-0">
          {/* =============================================================== */}
          {/* DASHBOARD TAB */}
          {/* =============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Berat Stok</p>
                    <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
                      {(totalStockInKg / 1000).toFixed(2)} <span className="text-sm font-semibold text-slate-600">Ton</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">({totalStockInKg.toLocaleString()} kg)</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100">
                    <Wheat size={26} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Kemasan (Packs)</p>
                    <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{totalStockPacks} <span className="text-xs font-normal text-slate-500">Unit</span></h3>
                    <p className="text-[10px] text-slate-400 font-medium">Karung & Kardus</p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100">
                    <Boxes size={26} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok Kritis ({'>'}{agingSettings.criticalMonths} Bln)</p>
                    <h3 className={`text-2xl font-extrabold mt-1 ${agingSummary.kritis > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {agingSummary.kritis} <span className="text-xs font-normal text-slate-500">Batch</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Wajib segera keluar</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${agingSummary.kritis > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    <AlertTriangle size={26} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mendekati Batas ({agingSettings.warningMonths}-{agingSettings.criticalMonths} Bln)</p>
                    <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                      {agingSummary.warning} <span className="text-xs font-normal text-slate-500">Batch</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Status Warning</p>
                  </div>
                  <div className="bg-amber-50 text-amber-600 p-3 rounded-xl border border-amber-100">
                    <Clock size={26} />
                  </div>
                </div>
              </div>

              {/* STACK AGING STATUS OVERVIEW BANNER */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Layers size={18} className="text-emerald-700" />
                    Status Umur Stok Gudang Saat Ini (Configured: Warning {'>'}{agingSettings.warningMonths} Bln, Kritis {'>'}{agingSettings.criticalMonths} Bln)
                  </h3>
                  <button onClick={() => setActiveTab('settings')} className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                    <Settings size={14} /> Ubah Pengaturan
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="text-xs font-semibold text-emerald-800">AMAN ({'<'} {agingSettings.warningMonths} Bulan)</div>
                    <div className="text-xl font-extrabold text-emerald-700 mt-1">{agingSummary.aman} Batch</div>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-xs font-semibold text-amber-800">MENDEKATI BATAS ({agingSettings.warningMonths} - {agingSettings.criticalMonths} Bulan)</div>
                    <div className="text-xl font-extrabold text-amber-700 mt-1">{agingSummary.warning} Batch</div>
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                    <div className="text-xs font-semibold text-rose-800">KRITIS ({'>'} {agingSettings.criticalMonths} Bulan)</div>
                    <div className="text-xl font-extrabold text-rose-700 mt-1">{agingSummary.kritis} Batch</div>
                  </div>
                </div>
              </div>

              {/* FIFO Priority Focus & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Clock className="text-amber-500" size={18} />
                        Prioritas Pengeluaran FIFO (Batch Terlama)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Disusun berdasarkan aturan FIFO dan indikator aging stok.</p>
                    </div>
                    <button onClick={() => setActiveTab('inventory')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                      Lihat Semua Batch <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                          <th className="p-3">Kemasan Tapioka</th>
                          <th className="p-3">No Batch / Lot</th>
                          <th className="p-3">Tgl Masuk</th>
                          <th className="p-3">Umur Stok</th>
                          <th className="p-3">Sisa Stok</th>
                          <th className="p-3">Status Aging</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {fifoPriorityBatches.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-800">
                              {b.productName}
                              <div className="text-[10px] text-slate-400 font-mono">{b.sku}</div>
                            </td>
                            <td className="p-3 font-mono font-bold text-emerald-700">{b.batchNo}</td>
                            <td className="p-3 font-medium text-slate-600">{b.entryDate}</td>
                            <td className="p-3 text-slate-700 font-bold">{b.ageMonths} Bulan</td>
                            <td className="p-3 font-bold text-slate-900">{b.remainingQty} Pack</td>
                            <td className="p-3">
                              {b.agingStatus === 'KRITIS' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  🚨 Kritis ({b.ageMonths} Bln)
                                </span>
                              )}
                              {b.agingStatus === 'MENDEKATI_BATAS' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  ⚠️ Mendekati Batas
                                </span>
                              )}
                              {b.agingStatus === 'AMAN' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ✅ Aman
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-emerald-800">
                    <h4 className="font-bold text-sm mb-1 text-emerald-300">CV Tani Sadulur Operasional</h4>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      Kelola alur penerimaan dan pengeluaran barang dengan aturan FIFO terotomatisasi.
                    </p>
                    <div className="space-y-2">
                      <button onClick={() => setActiveTab('inbound')} className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow">
                        <ArrowDownRight size={15} /> Input Inbound Tapioka
                      </button>
                      <button onClick={() => setActiveTab('outbound')} className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow">
                        <ArrowUpRight size={15} /> Process Outbound FIFO
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* INBOUND TAB */}
          {/* =============================================================== */}
          {activeTab === 'inbound' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ArrowDownRight className="text-emerald-600" size={20} />
                  Penerimaan Tepung Tapioka
                </h3>

                <form onSubmit={handleInboundSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Jenis Kemasan</label>
                    <select
                      value={inboundForm.productId}
                      onChange={(e) => setInboundForm({ ...inboundForm, productId: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Nomor Batch / Lot Pabrik <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: LOT-20261028-K50"
                      value={inboundForm.batchNo}
                      onChange={(e) => setInboundForm({ ...inboundForm, batchNo: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Masuk</label>
                      <input
                        type="date"
                        value={inboundForm.entryDate}
                        onChange={(e) => setInboundForm({ ...inboundForm, entryDate: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Kemasan</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Jumlah pack/karung"
                        value={inboundForm.quantity}
                        onChange={(e) => setInboundForm({ ...inboundForm, quantity: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Pemasok / Pabrik Asal</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pabrik Tapioka Lampung"
                      value={inboundForm.supplier}
                      onChange={(e) => setInboundForm({ ...inboundForm, supplier: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi Rak Gudang</label>
                    <input
                      type="text"
                      placeholder="Contoh: RAK-A1"
                      value={inboundForm.location}
                      onChange={(e) => setInboundForm({ ...inboundForm, location: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Catatan Inbound</label>
                    <textarea
                      rows="2"
                      placeholder="Keterangan penerimaan..."
                      value={inboundForm.note}
                      onChange={(e) => setInboundForm({ ...inboundForm, note: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Simpan Penerimaan Barang
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Riwayat Penerimaan Terakhir</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                          <th className="p-2.5">Waktu</th>
                          <th className="p-2.5">Kemasan</th>
                          <th className="p-2.5">No Batch</th>
                          <th className="p-2.5">Jumlah Masuk</th>
                          <th className="p-2.5">Petugas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {history.filter(h => h.type === 'INBOUND').map(h => (
                          <tr key={h.id}>
                            <td className="p-2.5 text-slate-500">{h.date}</td>
                            <td className="p-2.5 font-semibold text-slate-800">{h.productName}</td>
                            <td className="p-2.5 font-mono text-emerald-700">{h.batchNo}</td>
                            <td className="p-2.5 font-bold text-emerald-700">+{h.qty} Pack</td>
                            <td className="p-2.5 text-slate-600">{h.user}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* OUTBOUND TAB */}
          {/* =============================================================== */}
          {activeTab === 'outbound' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ArrowUpRight className="text-rose-600" size={20} />
                  Pengeluaran Tepung Tapioka
                </h3>

                <form onSubmit={handleOutboundSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Jenis Kemasan</label>
                    <select
                      value={outboundForm.productId}
                      onChange={(e) => setOutboundForm({ ...outboundForm, productId: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      required
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          [{p.sku}] {p.name} (Stok: {productStockMap[p.id] || 0} Pack)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Dikeluarkan (Pack/Karung)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Masukkan jumlah unit"
                      value={outboundForm.quantity}
                      onChange={(e) => setOutboundForm({ ...outboundForm, quantity: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tujuan / Nama Pembeli</label>
                    <input
                      type="text"
                      placeholder="Contoh: PT Kerupuk Nusantara"
                      value={outboundForm.customer}
                      onChange={(e) => setOutboundForm({ ...outboundForm, customer: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Catatan DO / Surat Jalan</label>
                    <textarea
                      rows="2"
                      placeholder="Keterangan tambahan..."
                      value={outboundForm.note}
                      onChange={(e) => setOutboundForm({ ...outboundForm, note: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={!fifoOutboundAllocation.sufficient}
                    className={`w-full py-2.5 font-semibold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-2 ${
                      fifoOutboundAllocation.sufficient 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 size={16} /> Eksekusi Pengeluaran (FIFO)
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="text-emerald-700" size={18} />
                    Preview Alokasi Pemotongan FIFO
                  </h3>

                  {outboundForm.quantity > 0 ? (
                    <div className="space-y-4">
                      {!fifoOutboundAllocation.sufficient && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-medium">
                          ⚠️ Stok tidak mencukupi! Diminta: {outboundForm.quantity} unit, Tersedia: {fifoOutboundAllocation.totalAvailable} unit.
                        </div>
                      )}

                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                              <th className="p-3">Prioritas FIFO</th>
                              <th className="p-3">No Batch / Lot</th>
                              <th className="p-3">Tgl Masuk</th>
                              <th className="p-3">Umur Stok</th>
                              <th className="p-3">Status Aging</th>
                              <th className="p-3 bg-amber-50 text-amber-900 font-bold">Qty Dipotong</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {fifoOutboundAllocation.batchesToTake.map((item, idx) => (
                              <tr key={item.batchId} className="hover:bg-slate-50">
                                <td className="p-3 font-bold text-emerald-700">Urutan #{idx + 1}</td>
                                <td className="p-3 font-mono font-bold text-slate-800">{item.batchNo}</td>
                                <td className="p-3 text-slate-600">{item.entryDate}</td>
                                <td className="p-3 text-slate-700 font-bold">{item.ageMonths} Bulan</td>
                                <td className="p-3">
                                  {item.agingStatus === 'KRITIS' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800">Kritis</span>}
                                  {item.agingStatus === 'MENDEKATI_BATAS' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">Warning</span>}
                                  {item.agingStatus === 'AMAN' && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">Aman</span>}
                                </td>
                                <td className="p-3 bg-amber-50 font-bold text-amber-900 border-l border-amber-200">
                                  -{item.takeQty} Pack
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Pilih produk dan kuantitas untuk melihat alokasi batch otomatis.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* INVENTORY & AGING STACK TAB */}
          {/* =============================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Cari jenis kemasan, SKU, atau lot batch..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  Pelacakan Stok & Indikator Umur Stok (Aging)
                </div>
              </div>

              <div className="space-y-6">
                {products
                  .filter(p => p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || p.sku.toLowerCase().includes(inventorySearch.toLowerCase()))
                  .map(prod => {
                    const prodBatches = batchesWithAge
                      .filter(b => b.productId === prod.id && b.remainingQty > 0)
                      .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));

                    const totalPacks = productStockMap[prod.id] || 0;

                    return (
                      <div key={prod.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-emerald-950 text-white p-4 flex justify-between items-center border-b border-emerald-900">
                          <div className="flex items-center space-x-3">
                            <span className="bg-emerald-600 text-white p-2 rounded font-mono font-bold text-xs">{prod.sku}</span>
                            <div>
                              <h4 className="font-bold text-sm">{prod.name}</h4>
                              <span className="text-xs text-emerald-300/80">Kemasan {prod.packType} ({prod.weightKg} kg)</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-emerald-300 block">Total Stok Active</span>
                            <span className="font-extrabold text-base text-emerald-400">{totalPacks} Pack</span>
                          </div>
                        </div>

                        <div className="p-4">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                                <th className="p-2.5">FIFO Priority</th>
                                <th className="p-2.5">No Batch / Lot</th>
                                <th className="p-2.5">Tgl Masuk</th>
                                <th className="p-2.5">Umur Stok</th>
                                <th className="p-2.5">Status Aging</th>
                                <th className="p-2.5">Sisa Stok</th>
                                <th className="p-2.5">Rak</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {prodBatches.map((b, index) => (
                                <tr key={b.id} className={index === 0 ? 'bg-amber-50/60' : ''}>
                                  <td className="p-2.5 font-bold text-emerald-700">#{index + 1}</td>
                                  <td className="p-2.5 font-mono font-bold text-slate-800">{b.batchNo}</td>
                                  <td className="p-2.5 text-slate-600">{b.entryDate}</td>
                                  <td className="p-2.5 font-bold text-slate-800">{b.ageMonths} Bulan</td>
                                  <td className="p-2.5">
                                    {b.agingStatus === 'KRITIS' && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                        🚨 KRITIS ({'>'}{agingSettings.criticalMonths} Bln)
                                      </span>
                                    )}
                                    {b.agingStatus === 'MENDEKATI_BATAS' && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                        ⚠️ WARNING ({agingSettings.warningMonths}-{agingSettings.criticalMonths} Bln)
                                      </span>
                                    )}
                                    {b.agingStatus === 'AMAN' && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                        ✅ AMAN ({'<'} {agingSettings.warningMonths} Bln)
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2.5 font-bold text-slate-900">{b.remainingQty} Pack</td>
                                  <td className="p-2.5 font-mono text-slate-600">{b.location}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* REPORTS & EXPORT TAB */}
          {/* =============================================================== */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 print:hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <Filter size={18} className="text-emerald-700" />
                    Filter Riwayat Transaksi & Laporan Mutasi
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={exportToExcel}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow flex items-center gap-1.5 transition-colors"
                    >
                      <FileSpreadsheet size={15} /> Export Excel (.xls)
                    </button>
                    <button
                      onClick={handlePrintReport}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg shadow flex items-center gap-1.5 transition-colors"
                    >
                      <Printer size={15} /> Cetak Laporan / PDF
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tipe Mutasi</label>
                    <select
                      value={reportFilters.type}
                      onChange={(e) => setReportFilters({ ...reportFilters, type: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="ALL">Semua Mutasi</option>
                      <option value="INBOUND">Inbound (Masuk)</option>
                      <option value="OUTBOUND">Outbound (Keluar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jenis Kemasan</label>
                    <select
                      value={reportFilters.productId}
                      onChange={(e) => setReportFilters({ ...reportFilters, productId: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="ALL">Semua Kemasan</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dari Tanggal</label>
                    <input
                      type="date"
                      value={reportFilters.startDate}
                      onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sampai Tanggal</label>
                    <input
                      type="date"
                      value={reportFilters.endDate}
                      onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cari Kata Kunci</label>
                    <input
                      type="text"
                      placeholder="No Batch, Customer..."
                      value={reportFilters.search}
                      onChange={(e) => setReportFilters({ ...reportFilters, search: e.target.value })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Printable Report Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:shadow-none print:border-none">
                <div className="hidden print:block mb-6 border-b border-slate-300 pb-4">
                  <h1 className="text-xl font-bold text-slate-900">CV TANI SADULUR — LAPORAN MUTASI GUDANG TAPIOKA</h1>
                  <p className="text-xs text-slate-600">Sistem Informasi Manajemen Gudang Berbasis FIFO</p>
                  <p className="text-[11px] text-slate-500 mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-slate-500">
                    Menampilkan <strong>{filteredHistory.length}</strong> transaksi mutasi.
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Tipe</th>
                        <th className="p-3">Kemasan Tapioka</th>
                        <th className="p-3">Jumlah Unit</th>
                        <th className="p-3">No Batch / Lot</th>
                        <th className="p-3">Petugas</th>
                        <th className="p-3">Keterangan / Tujuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map(h => (
                        <tr key={h.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-500">{h.date}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              h.type === 'INBOUND' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {h.type}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{h.productName}</td>
                          <td className={`p-3 font-bold ${h.type === 'INBOUND' ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {h.type === 'INBOUND' ? `+${h.qty}` : `-${h.qty}`} Pack
                          </td>
                          <td className="p-3 font-mono text-emerald-800">{h.batchNo || '-'}</td>
                          <td className="p-3 text-slate-700">{h.user}</td>
                          <td className="p-3 text-slate-600">{h.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* CONFIGURABLE AGING SETTINGS TAB */}
          {/* =============================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="text-emerald-700" size={20} />
                  Pengaturan Threshold Umur Stok (Stock Aging Configuration)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atur ambang batas (dalam bulan) untuk kategori indikator umur stok Tepung Tapioka di seluruh sistem.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                  <label className="block text-xs font-bold text-amber-900">
                    Batas Batas Awal Mendekati Batas / Warning (Dalam Bulan)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={agingSettings.warningMonths}
                      onChange={(e) => setAgingSettings({ ...agingSettings, warningMonths: parseInt(e.target.value, 10) || 1 })}
                      className="w-28 text-xs p-2 bg-white border border-amber-300 rounded font-bold text-amber-900 focus:outline-none"
                    />
                    <span className="text-xs text-amber-800 font-medium">Bulan sejak barang masuk. (Default: 6 Bulan)</span>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                  <label className="block text-xs font-bold text-rose-900">
                    Batas Batas Kritis / Critical (Dalam Bulan)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="1"
                      max="36"
                      value={agingSettings.criticalMonths}
                      onChange={(e) => setAgingSettings({ ...agingSettings, criticalMonths: parseInt(e.target.value, 10) || 1 })}
                      className="w-28 text-xs p-2 bg-white border border-rose-300 rounded font-bold text-rose-900 focus:outline-none"
                    />
                    <span className="text-xs text-rose-800 font-medium">Bulan sejak barang masuk. (Default: 10 Bulan)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-600">
                  <div className="font-bold text-slate-800">Skema Indikator Otomatis Berdasarkan Setting:</div>
                  <div>• <strong>Aman (Green):</strong> Umur batch kurang dari <strong>{agingSettings.warningMonths} bulan</strong>.</div>
                  <div>• <strong>Mendekati Batas (Yellow):</strong> Umur batch <strong>{agingSettings.warningMonths} s/d {agingSettings.criticalMonths} bulan</strong>.</div>
                  <div>• <strong>Kritis (Red):</strong> Umur batch melebihi <strong>{agingSettings.criticalMonths} bulan</strong>.</div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* USER MANAGEMENT TAB (PEMILIK ONLY) */}
          {/* =============================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {currentUser.role !== 'Pemilik' ? (
                <div className="bg-white rounded-xl border border-rose-200 p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto my-12">
                  <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                    <Lock size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Akses Dibatasi — Khusus Pemilik</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Anda sedang login sebagai <strong>{currentUser.name}</strong> dengan role <strong>Admin (Operator Gudang)</strong>. 
                    Modul Kelola Pengguna hanya dapat diakses oleh role <strong>Pemilik (Owner)</strong>.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                        <ShieldCheck className="text-emerald-700" size={20} />
                        Kelola Pengguna Aplikasi Gudang
                      </h3>
                      <p className="text-xs text-slate-500">Tambah, edit role, atau hapus akun pengguna Admin & Pemilik.</p>
                    </div>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow flex items-center gap-1.5 transition-colors"
                    >
                      <Plus size={16} /> Tambah User Baru
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                          <th className="p-4">ID User</th>
                          <th className="p-4">Nama Lengkap</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role Akses</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Aksi Kelola</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50">
                            <td className="p-4 font-mono font-bold text-slate-500">{u.id}</td>
                            <td className="p-4 font-bold text-slate-800">{u.name}</td>
                            <td className="p-4 text-slate-600">{u.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                u.role === 'Pemilik' 
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {u.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleToggleUserRole(u.id)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                              >
                                Switch Role
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </main>

      {/* MODAL: ADD USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Tambah Pengguna Baru</h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama User"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="user@tanisadulur.co.id"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Role Pengguna</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                >
                  <option value="Admin">Admin (Operator Gudang)</option>
                  <option value="Pemilik">Pemilik (Owner)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}