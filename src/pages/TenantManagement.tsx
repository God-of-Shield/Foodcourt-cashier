import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useStore, Tenant } from '@/contexts/StoreContext';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { toast } from 'sonner';

export default function TenantManagement() {
  const { tenants, addTenant, updateTenant, deleteTenant } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '/placeholder.svg'
  });

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const openModal = (tenant?: Tenant) => {
    if (tenant) {
      setEditingTenant(tenant);
      setFormData({
        name: tenant.name,
        description: tenant.description,
        image: tenant.image
      });
    } else {
      setEditingTenant(null);
      setFormData({ name: '', description: '', image: '/placeholder.svg' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
    setFormData({ name: '', description: '', image: '/placeholder.svg' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTenant) {
      updateTenant(editingTenant.id, formData);
      toast.success('Tenant berhasil diperbarui!');
    } else {
      addTenant(formData);
      toast.success('Tenant berhasil ditambahkan!');
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus tenant ini?')) {
      deleteTenant(id);
      toast.success('Tenant berhasil dihapus!');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="super_admin" />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-primary">Kelola Tenant</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Kelola Tenant</h1>
            <button onClick={() => openModal()} className="btn-glow flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Tenant
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card-glow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tenant..."
              className="input-dark w-full pl-12"
            />
          </div>
        </div>

        {/* Tenant Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <div key={tenant.id} className="card-glow p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted">
                  <img src={tenant.image} alt={tenant.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(tenant)}
                    className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tenant.id)}
                    className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-semibold text-foreground mb-1">{tenant.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tenant.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Total Penjualan</p>
                  <p className="font-semibold text-foreground">{formatCurrency(tenant.totalSales)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transaksi</p>
                  <p className="font-semibold text-foreground">{tenant.totalTransactions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card-glow p-6 w-full max-w-md animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {editingTenant ? 'Edit Tenant' : 'Tambah Tenant'}
                </h2>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nama Tenant</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-dark w-full"
                    placeholder="Masukkan nama tenant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-dark w-full h-24 resize-none"
                    placeholder="Deskripsi singkat tenant"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
                    Batal
                  </button>
                  <button type="submit" className="flex-1 btn-glow">
                    {editingTenant ? 'Simpan' : 'Tambah'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
