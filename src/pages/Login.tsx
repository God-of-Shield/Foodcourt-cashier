import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';
import hero4 from '@/assets/hero-4.jpg';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('admin_kasir');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = login(
      role === 'super_admin' 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, password: formData.password },
      role
    );

    if (result.success) {
      toast.success(result.message);
      navigate(role === 'super_admin' ? '/super-admin' : '/kasir');
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
            <h1 className="text-3xl font-bold text-foreground">Login</h1>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {role === 'super_admin' ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-dark w-full"
                  placeholder="admin@wbi.com"
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
              Login
            </button>
          </form>

          <p className="text-center mt-6 text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-muted/50 text-sm">
            <p className="font-medium text-foreground mb-2">Demo Login:</p>
            <p className="text-muted-foreground">Super Admin: admin@wbi.com / admin123</p>
          </div>
        </div>

        {/* Right - Pill Shaped Images */}
        <div className="hidden lg:flex items-center justify-center h-[600px] gap-3">
          {/* First column */}
          <div className="flex flex-col gap-3">
            <div className="w-24 h-44 rounded-full overflow-hidden">
              <img 
                src={hero1} 
                alt="Food court" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-56 rounded-full overflow-hidden">
              <img 
                src={hero2} 
                alt="Coffee shop" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Second column - offset */}
          <div className="flex flex-col gap-3 mt-12">
            <div className="w-24 h-56 rounded-full overflow-hidden">
              <img 
                src={hero3} 
                alt="Street food" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-44 rounded-full overflow-hidden">
              <img 
                src={hero4} 
                alt="Restaurant" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Third column */}
          <div className="flex flex-col gap-3 -mt-8">
            <div className="w-24 h-48 rounded-full overflow-hidden">
              <img 
                src={hero2} 
                alt="Cafe" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-24 h-52 rounded-full overflow-hidden">
              <img 
                src={hero1} 
                alt="Food court 2" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
