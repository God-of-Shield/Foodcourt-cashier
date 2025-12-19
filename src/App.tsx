import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { StoreProvider } from "./contexts/StoreContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import WaitingApproval from "./pages/WaitingApproval";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminManagement from "./pages/AdminManagement";
import TenantManagement from "./pages/TenantManagement";
import KasirDashboard from "./pages/KasirDashboard";
import TenantSelection from "./pages/TenantSelection";
import TenantMenu from "./pages/TenantMenu";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'super_admin' | 'admin_kasir' }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'super_admin' ? '/super-admin' : '/kasir'} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'super_admin' ? '/super-admin' : '/kasir'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'super_admin' ? '/super-admin' : '/kasir'} /> : <Register />} />
      <Route path="/waiting-approval" element={<WaitingApproval />} />

      {/* Super Admin routes */}
      <Route path="/super-admin" element={<ProtectedRoute requiredRole="super_admin"><SuperAdminDashboard /></ProtectedRoute>} />
      <Route path="/super-admin/admins" element={<ProtectedRoute requiredRole="super_admin"><AdminManagement /></ProtectedRoute>} />
      <Route path="/super-admin/tenants" element={<ProtectedRoute requiredRole="super_admin"><TenantManagement /></ProtectedRoute>} />
      <Route path="/super-admin/reports" element={<ProtectedRoute requiredRole="super_admin"><Reports role="super_admin" /></ProtectedRoute>} />
      <Route path="/super-admin/settings" element={<ProtectedRoute requiredRole="super_admin"><SuperAdminDashboard /></ProtectedRoute>} />

      {/* Admin Kasir routes */}
      <Route path="/kasir" element={<ProtectedRoute requiredRole="admin_kasir"><KasirDashboard /></ProtectedRoute>} />
      <Route path="/kasir/tenant" element={<ProtectedRoute requiredRole="admin_kasir"><TenantSelection /></ProtectedRoute>} />
      <Route path="/kasir/tenant-menu" element={<ProtectedRoute requiredRole="admin_kasir"><TenantMenu /></ProtectedRoute>} />
      <Route path="/kasir/laporan" element={<ProtectedRoute requiredRole="admin_kasir"><Reports role="admin_kasir" /></ProtectedRoute>} />
      <Route path="/kasir/settings" element={<ProtectedRoute requiredRole="admin_kasir"><KasirDashboard /></ProtectedRoute>} />

      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
