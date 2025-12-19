import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { DollarSign, Store, Users } from 'lucide-react';

export default function SuperAdminDashboard() {
  const { pendingAdmins } = useAuth();
  const { tenants, transactions } = useStore();

  const totalSales = tenants.reduce((sum, t) => sum + t.totalSales, 0);
  const totalTransactions = transactions.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="super_admin" />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-primary">Beranda</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Selamat Datang, Super Admin!</h1>
        </div>

        {/* Quick Filter */}
        <div className="flex gap-3 mb-8">
          {['Hari ini', 'Minggu ini', 'Bulan ini'].map((filter) => (
            <button 
              key={filter}
              className="px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Total Pendapatan/Net Revenue"
            value={formatCurrency(totalSales)}
            change={4.5}
            changeLabel="Up from yesterday"
            icon={<DollarSign className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Today Transaction"
            value={totalTransactions}
            change={1.8}
            changeLabel="Up from yesterday"
            icon={<Store className="w-5 h-5" />}
            variant="warning"
          />
        </div>

        {/* Charts & Tables Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Popular Products */}
          <div className="card-glow p-6">
            <h3 className="font-semibold text-foreground mb-4">Popular Product</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm text-muted-foreground pb-2 border-b border-border">
                <span>#</span>
                <span>Nama</span>
                <span>Harga</span>
                <span>Status</span>
              </div>
              {[
                { name: 'Bakso Urat', price: 25000, status: 'Tersedia' },
                { name: 'Mie Ayam Biasa', price: 18000, status: 'Tersedia' },
                { name: 'Geprek Original', price: 20000, status: 'Tersedia' },
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-4 text-sm items-center py-2">
                  <span className="text-muted-foreground">{i + 1}</span>
                  <span className="text-foreground font-medium">{item.name}</span>
                  <span className="text-foreground">{formatCurrency(item.price)}</span>
                  <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs w-fit">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Pending Approvals */}
        {pendingAdmins.length > 0 && (
          <div className="mt-6 card-glow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-foreground">Menunggu Persetujuan</h3>
              <span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs font-medium">
                {pendingAdmins.length}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Ada {pendingAdmins.length} admin kasir yang menunggu persetujuan.{' '}
              <a href="/super-admin/admins" className="text-primary hover:underline">
                Lihat semua →
              </a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
