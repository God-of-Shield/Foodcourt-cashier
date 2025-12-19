import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'super_admin' | 'admin_kasir';
export type AdminStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name?: string;
  email?: string;
  username?: string;
  role: UserRole;
  status?: AdminStatus;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email?: string; username?: string; password: string }, role: UserRole) => { success: boolean; message: string };
  register: (data: { name?: string; email?: string; username?: string; password: string }, role: UserRole) => { success: boolean; message: string };
  logout: () => void;
  approveAdmin: (adminId: string) => void;
  rejectAdmin: (adminId: string) => void;
  pendingAdmins: User[];
  allAdmins: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy data for simulation
const DUMMY_SUPER_ADMINS = [
  { id: '1', name: 'Super Admin', email: 'admin@wbi.com', password: 'admin123', role: 'super_admin' as UserRole }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admins, setAdmins] = useState<(User & { password: string })[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('wbi_user');
    const savedAdmins = localStorage.getItem('wbi_admins');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAdmins) {
      setAdmins(JSON.parse(savedAdmins));
    }
  }, []);

  const login = (credentials: { email?: string; username?: string; password: string }, role: UserRole) => {
    if (role === 'super_admin') {
      const found = DUMMY_SUPER_ADMINS.find(
        a => a.email === credentials.email && a.password === credentials.password
      );
      if (found) {
        const userData = { id: found.id, name: found.name, email: found.email, role: found.role };
        setUser(userData);
        localStorage.setItem('wbi_user', JSON.stringify(userData));
        return { success: true, message: 'Login berhasil!' };
      }
      return { success: false, message: 'Email atau password salah' };
    } else {
      const found = admins.find(
        a => a.username === credentials.username && a.password === credentials.password
      );
      if (found) {
        if (found.status === 'pending') {
          return { success: false, message: 'Akun Anda masih menunggu persetujuan' };
        }
        if (found.status === 'rejected') {
          return { success: false, message: 'Akun Anda ditolak. Silakan hubungi Super Admin.' };
        }
        const userData = { id: found.id, username: found.username, role: found.role, status: found.status };
        setUser(userData);
        localStorage.setItem('wbi_user', JSON.stringify(userData));
        return { success: true, message: 'Login berhasil!' };
      }
      return { success: false, message: 'Username atau password salah' };
    }
  };

  const register = (data: { name?: string; email?: string; username?: string; password: string }, role: UserRole) => {
    if (role === 'super_admin') {
      const exists = DUMMY_SUPER_ADMINS.some(a => a.email === data.email);
      if (exists) {
        return { success: false, message: 'Email sudah terdaftar' };
      }
      const userData = { id: Date.now().toString(), name: data.name!, email: data.email!, role };
      setUser(userData);
      localStorage.setItem('wbi_user', JSON.stringify(userData));
      return { success: true, message: 'Registrasi berhasil!' };
    } else {
      const exists = admins.some(a => a.username === data.username);
      if (exists) {
        return { success: false, message: 'Username sudah terdaftar' };
      }
      const newAdmin = {
        id: Date.now().toString(),
        username: data.username!,
        password: data.password,
        role,
        status: 'pending' as AdminStatus
      };
      const updatedAdmins = [...admins, newAdmin];
      setAdmins(updatedAdmins);
      localStorage.setItem('wbi_admins', JSON.stringify(updatedAdmins));
      return { success: true, message: 'Registrasi berhasil! Menunggu persetujuan Super Admin.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wbi_user');
  };

  const approveAdmin = (adminId: string) => {
    const updated = admins.map(a => a.id === adminId ? { ...a, status: 'approved' as AdminStatus } : a);
    setAdmins(updated);
    localStorage.setItem('wbi_admins', JSON.stringify(updated));
  };

  const rejectAdmin = (adminId: string) => {
    const updated = admins.map(a => a.id === adminId ? { ...a, status: 'rejected' as AdminStatus } : a);
    setAdmins(updated);
    localStorage.setItem('wbi_admins', JSON.stringify(updated));
  };

  const pendingAdmins = admins.filter(a => a.status === 'pending');
  const allAdmins = admins;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, approveAdmin, rejectAdmin, pendingAdmins, allAdmins }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
