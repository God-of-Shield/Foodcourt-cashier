import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useStore } from '@/contexts/StoreContext';
import { Search, Calendar, ChevronDown } from 'lucide-react';

interface ReportsProps {
  role: 'super_admin' | 'admin_kasir';
}

const MONTHS = [
  { value: 0, label: 'Januari' },
  { value: 1, label: 'Februari' },
  { value: 2, label: 'Maret' },
  { value: 3, label: 'April' },
  { value: 4, label: 'Mei' },
  { value: 5, label: 'Juni' },
  { value: 6, label: 'Juli' },
  { value: 7, label: 'Agustus' },
  { value: 8, label: 'September' },
  { value: 9, label: 'Oktober' },
  { value: 10, label: 'November' },
  { value: 11, label: 'Desember' },
];

export default function Reports({ role }: ReportsProps) {
  const { transactions, selectedTenant } = useStore();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    transactions.forEach(t => {
      const year = new Date(t.date).getFullYear();
      years.add(year);
    });
    // Add current year if no transactions
    if (years.size === 0) {
      years.add(new Date().getFullYear());
    }
    // Add a few years range
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.add(i);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.tenantName.toLowerCase().includes(search.toLowerCase());
      const matchesTenant = role === 'admin_kasir' && selectedTenant ? t.tenantId === selectedTenant.id : true;
      
      // Date filtering
      const transactionDate = new Date(t.date);
      const today = new Date();
      
      let matchesDateFilter = true;
      
      if (dateFilter === 'today') {
        matchesDateFilter = transactionDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        matchesDateFilter = transactionDate >= weekAgo;
      } else if (dateFilter === 'month') {
        // If specific month/year selected, use those
        if (selectedMonth !== null && selectedYear !== null) {
          matchesDateFilter = 
            transactionDate.getMonth() === selectedMonth && 
            transactionDate.getFullYear() === selectedYear;
        } else if (selectedMonth !== null) {
          matchesDateFilter = transactionDate.getMonth() === selectedMonth;
        } else if (selectedYear !== null) {
          matchesDateFilter = transactionDate.getFullYear() === selectedYear;
        } else {
          // Default: current month
          matchesDateFilter = 
            transactionDate.getMonth() === today.getMonth() && 
            transactionDate.getFullYear() === today.getFullYear();
        }
      } else if (dateFilter === 'all') {
        // If year is selected in "all" mode, still filter by year
        if (selectedYear !== null) {
          matchesDateFilter = transactionDate.getFullYear() === selectedYear;
          if (selectedMonth !== null) {
            matchesDateFilter = matchesDateFilter && transactionDate.getMonth() === selectedMonth;
          }
        }
      }
      
      return matchesSearch && matchesTenant && matchesDateFilter;
    });
  }, [transactions, search, role, selectedTenant, dateFilter, selectedMonth, selectedYear]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);

  const handleMonthYearFilter = () => {
    setDateFilter('month');
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role={role} />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-primary">Laporan</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Laporan Penjualan</h1>
        </div>

        {/* Summary Card */}
        <div className="card-glow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Pendapatan</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Transaksi</p>
              <p className="text-2xl font-bold text-foreground">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rata-rata per Transaksi</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(filteredTransactions.length > 0 ? totalRevenue / filteredTransactions.length : 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-glow p-4 mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari..."
                className="input-dark w-full pl-12"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'today', 'week', 'month'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setDateFilter(filter);
                    if (filter !== 'month' && filter !== 'all') {
                      setSelectedMonth(null);
                      setSelectedYear(null);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    dateFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter === 'all' ? 'Semua' : filter === 'today' ? 'Hari Ini' : filter === 'week' ? 'Minggu Ini' : 'Bulanan'}
                </button>
              ))}
            </div>
          </div>

          {/* Month & Year Selectors */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter:</span>
            </div>
            
            <div className="relative">
              <select
                value={selectedMonth ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedMonth(val === '' ? null : parseInt(val));
                  handleMonthYearFilter();
                }}
                className="input-dark pr-10 min-w-[140px] appearance-none cursor-pointer"
              >
                <option value="">Semua Bulan</option>
                {MONTHS.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedYear ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedYear(val === '' ? null : parseInt(val));
                  handleMonthYearFilter();
                }}
                className="input-dark pr-10 min-w-[120px] appearance-none cursor-pointer"
              >
                <option value="">Semua Tahun</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {(selectedMonth !== null || selectedYear !== null) && (
              <button
                onClick={() => {
                  setSelectedMonth(null);
                  setSelectedYear(null);
                  setDateFilter('all');
                }}
                className="text-sm text-primary hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="card-glow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID Transaksi</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tenant</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tanggal</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Metode</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-4 text-foreground font-mono">#{transaction.id.slice(-6)}</td>
                      <td className="p-4 text-foreground">{transaction.tenantName}</td>
                      <td className="p-4 text-muted-foreground">{transaction.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.paymentMethod === 'Cash' 
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold text-foreground">{formatCurrency(transaction.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}