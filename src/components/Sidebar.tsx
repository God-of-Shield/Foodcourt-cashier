import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  UtensilsCrossed, 
  BarChart3, 
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: 'super_admin' | 'admin_kasir';
}

const superAdminMenu = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/super-admin' },
  { icon: Users, label: 'Admin Kasir', path: '/super-admin/admins' },
  { icon: Store, label: 'Tenant', path: '/super-admin/tenants' },
  { icon: BarChart3, label: 'Laporan', path: '/super-admin/reports' },
];

const adminKasirMenu = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/kasir' },
  { icon: Store, label: 'Tenant', path: '/kasir/tenant' },
  { icon: BarChart3, label: 'Laporan', path: '/kasir/laporan' },
];

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const menu = role === 'super_admin' ? superAdminMenu : adminKasirMenu;

  return (
    <aside className={cn(
      "h-screen bg-sidebar sticky top-0 flex flex-col border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-foreground">FOODCOURT</h1>
              <p className="text-xs text-muted-foreground">WBI System</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item",
                isActive && "active"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {!collapsed && (
          <div className="px-4 py-2 animate-fade-in">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name || user?.username || 'User'}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {role.replace('_', ' ')}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="sidebar-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full justify-center"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
