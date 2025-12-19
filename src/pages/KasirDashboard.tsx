import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { useStore } from '@/contexts/StoreContext';
import { DollarSign, ShoppingCart, Store } from 'lucide-react';

export default function KasirDashboard() {
  const { tenants } = useStore();

  const totalSales = tenants.reduce((sum, t) => sum + t.totalSales, 0);
  const totalTransactions = tenants.reduce((sum, t) => sum + t.totalTransactions, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="admin_kasir" />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Kasir</span>
            <span>/</span>
            <span className="text-primary">Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Kasir</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Pendapatan"
            value={formatCurrency(totalSales)}
            change={5.5}
            changeLabel="from yesterday"
            icon={<DollarSign className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Total Tenant"
            value={`${tenants.length} Tenant`}
            change={12.5}
            changeLabel="Up from yesterday"
            icon={<Store className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            title="Total Transaksi Hari Ini"
            value={`${totalTransactions} Transaksi`}
            change={8.5}
            changeLabel="Up from yesterday"
            icon={<ShoppingCart className="w-5 h-5" />}
            variant="purple"
          />
        </div>

        {/* Recent Activity */}
        <div className="card-glow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Ringkasan Tenant</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tenant</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Total Penjualan</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                          <img src={tenant.image} alt={tenant.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-foreground">{tenant.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{formatCurrency(tenant.totalSales)}</td>
                    <td className="py-3 px-4 text-foreground">{tenant.totalTransactions} Transaksi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
