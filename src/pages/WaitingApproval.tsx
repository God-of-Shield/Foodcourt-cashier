import { Link } from 'react-router-dom';
import { Clock, UtensilsCrossed } from 'lucide-react';

export default function WaitingApproval() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="card-glow p-12 text-center max-w-md animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-warning/20 mx-auto mb-6 flex items-center justify-center animate-pulse">
          <Clock className="w-10 h-10 text-warning" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-4">Menunggu Persetujuan</h1>
        
        <p className="text-muted-foreground mb-8">
          Akun Anda telah berhasil didaftarkan. Silakan tunggu persetujuan dari Super Admin 
          untuk dapat mengakses sistem.
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-center gap-2 text-warning">
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <span className="font-medium">Status: Pending</span>
            </div>
          </div>

          <Link 
            to="/login" 
            className="btn-glow inline-flex items-center justify-center gap-2 w-full"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
