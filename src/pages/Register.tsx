import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>('admin_kasir');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = register(formData, role);

    if (result.success) {
      toast.success(result.message);
      if (role === 'super_admin') {
        navigate('/super-admin');
      } else {
        navigate('/waiting-approval');
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left - Form */}
        <div className="card-glow p-8 lg:p-12 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
              <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Register</h1>
            <p className="text-muted-foreground mt-2">Buat akun baru</p>
          </div>

          {/* Role Tabs */}
          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-8">
            <button
              onClick={() => setRole('admin_kasir')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-all",
                role === 'admin_kasir' 
                  ? "bg-primary text-primary-foreground shadow-glow" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Admin Kasir
            </button>
            <button
              onClick={() => setRole('super_admin')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-all",
                role === 'super_admin' 
                  ? "bg-primary text-primary-foreground shadow-glow" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Super Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {role === 'super_admin' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-dark w-full"
                  placeholder="Masukkan nama"
                  required
                />
              </div>
            )}

            {role === 'super_admin' ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-dark w-full"
                  placeholder="email@example.com"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-dark w-full"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-dark w-full pr-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-glow w-full">
              Register
            </button>
          </form>

          <p className="text-center mt-6 text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>

        {/* Right - Decorative */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative">
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-44 rounded-full overflow-hidden bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/30"
                  style={{ 
                    transform: `rotate(${(i - 2.5) * 8}deg)`
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-transparent" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center animate-pulse-glow p-6 rounded-2xl bg-background/80 backdrop-blur">
                <UtensilsCrossed className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="font-bold text-primary">WBI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
