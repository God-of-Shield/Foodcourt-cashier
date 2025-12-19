import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminManagement() {
  const { allAdmins, approveAdmin, rejectAdmin } = useAuth();
  const [search, setSearch] = useState('');

  const filteredAdmins = allAdmins.filter(admin => 
    admin.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (adminId: string) => {
    approveAdmin(adminId);
    toast.success('Admin berhasil disetujui!');
  };

  const handleReject = (adminId: string) => {
    rejectAdmin(adminId);
    toast.error('Admin ditolak.');
  };

  const handleResetPassword = (adminId: string) => {
    toast.info(`Password untuk admin ${adminId} telah direset ke default.`);
  };

  const statusStyles = {
    pending: 'bg-warning/20 text-warning',
    approved: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-destructive/20 text-destructive'
  };

  const statusLabels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak'
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="super_admin" />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-primary">Kelola Admin Kasir</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Kelola Admin Kasir</h1>
        </div>

        {/* Search */}
        <div className="card-glow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari admin..."
              className="input-dark w-full pl-12"
            />
          </div>
        </div>

        {/* Admin List */}
        <div className="card-glow overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-muted-foreground border-b border-border">
            <span>Username</span>
            <span>Status</span>
            <span>Tanggal Daftar</span>
            <span>Aksi</span>
          </div>

          {filteredAdmins.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Belum ada admin kasir terdaftar.</p>
            </div>
          ) : (
            filteredAdmins.map((admin) => (
              <div 
                key={admin.id} 
                className="grid grid-cols-4 gap-4 p-4 items-center border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <span className="text-foreground font-medium">{admin.username}</span>
                <span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    statusStyles[admin.status || 'pending']
                  )}>
                    {statusLabels[admin.status || 'pending']}
                  </span>
                </span>
                <span className="text-muted-foreground text-sm">
                  {new Date().toLocaleDateString('id-ID')}
                </span>
                <div className="flex gap-2">
                  {admin.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(admin.id)}
                        className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        title="Setujui"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(admin.id)}
                        className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                        title="Tolak"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {admin.status === 'approved' && (
                    <button
                      onClick={() => handleResetPassword(admin.id)}
                      className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                      title="Reset Password"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
