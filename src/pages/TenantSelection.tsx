import { Sidebar } from '@/components/Sidebar';
import { useStore } from '@/contexts/StoreContext';
import { useNavigate } from 'react-router-dom';

export default function TenantSelection() {
  const { tenants, selectedTenant, selectTenant } = useStore();
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleSelectTenant = (tenant: typeof tenants[0]) => {
    selectTenant(tenant);
    navigate('/kasir/tenant-menu');
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="admin_kasir" />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Kasir</span>
            <span>/</span>
            <span className="text-primary">Tenant</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pilih Tenant</h1>
          <p className="text-muted-foreground mt-2">Pilih tenant untuk mulai mengelola menu dan transaksi</p>
        </div>

        {/* Tenant Selection Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => handleSelectTenant(tenant)}
              className={`card-glow p-6 text-left transition-all hover:scale-[1.02] ${
                selectedTenant?.id === tenant.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted">
                  <img src={tenant.image} alt={tenant.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Total Omzet</p>
                  <p className="text-primary font-semibold">{formatCurrency(tenant.totalSales)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {tenants.length === 0 && (
          <div className="card-glow p-12 text-center">
            <p className="text-muted-foreground">Belum ada tenant yang tersedia.</p>
            <p className="text-sm text-muted-foreground mt-2">Hubungi Super Admin untuk menambahkan tenant.</p>
          </div>
        )}
      </main>
    </div>
  );
}
