import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import foodBakso from '@/assets/food-bakso.jpg';
import foodGeprek from '@/assets/food-geprek.jpg';
import foodMieAyam from '@/assets/food-mie-ayam.jpg';
import foodEsTeh from '@/assets/food-es-teh.jpg';

export interface Tenant {
  id: string;
  name: string;
  description: string;
  image: string;
  totalSales: number;
  totalTransactions: number;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Transaction {
  id: string;
  tenantId: string;
  tenantName: string;
  items: CartItem[];
  total: number;
  date: string;
  paymentMethod: string;
}

interface StoreContextType {
  tenants: Tenant[];
  menuItems: MenuItem[];
  cart: CartItem[];
  transactions: Transaction[];
  selectedTenant: Tenant | null;
  addTenant: (tenant: Omit<Tenant, 'id' | 'totalSales' | 'totalTransactions'>) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (paymentMethod: string) => Transaction;
  selectTenant: (tenant: Tenant | null) => void;
  getMenuByTenant: (tenantId: string) => MenuItem[];
  getTransactionsByTenant: (tenantId: string) => Transaction[];
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DUMMY_TENANTS: Tenant[] = [
  { id: '1', name: 'Bakso Pak Kumis', description: 'Bakso legendaris sejak 1990', image: '/placeholder.svg', totalSales: 23560000, totalTransactions: 230 },
  { id: '2', name: 'Ayam Geprek Bu Sri', description: 'Geprek super pedas', image: '/placeholder.svg', totalSales: 15500350, totalTransactions: 180 },
  { id: '3', name: 'Mie Ayam Cak Man', description: 'Mie ayam spesial', image: '/placeholder.svg', totalSales: 12300000, totalTransactions: 150 },
];

const DUMMY_MENU_ITEMS: MenuItem[] = [
  { id: '1', tenantId: '1', name: 'Bakso Urat', price: 25000, image: foodBakso, category: 'Makanan' },
  { id: '2', tenantId: '1', name: 'Bakso Besar', price: 30000, image: foodBakso, category: 'Makanan' },
  { id: '3', tenantId: '1', name: 'Bakso Koreng', price: 20000, image: foodBakso, category: 'Makanan' },
  { id: '4', tenantId: '1', name: 'Pangsit Goreng', price: 15000, image: foodBakso, category: 'Makanan' },
  { id: '5', tenantId: '1', name: 'Pangsit Kuah', price: 18000, image: foodBakso, category: 'Makanan' },
  { id: '6', tenantId: '1', name: 'Es Teh Manis', price: 8000, image: foodEsTeh, category: 'Minuman' },
  { id: '7', tenantId: '2', name: 'Geprek Original', price: 20000, image: foodGeprek, category: 'Makanan' },
  { id: '8', tenantId: '2', name: 'Geprek Sambal Matah', price: 25000, image: foodGeprek, category: 'Makanan' },
  { id: '9', tenantId: '3', name: 'Mie Ayam Biasa', price: 18000, image: foodMieAyam, category: 'Makanan' },
  { id: '10', tenantId: '3', name: 'Mie Ayam Bakso', price: 25000, image: foodMieAyam, category: 'Makanan' },
];

const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: '1', tenantId: '1', tenantName: 'Bakso Pak Kumis', items: [], total: 75000, date: '2024-12-09', paymentMethod: 'Cash' },
  { id: '2', tenantId: '1', tenantName: 'Bakso Pak Kumis', items: [], total: 50000, date: '2024-12-08', paymentMethod: 'QRIS' },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    const savedTenants = localStorage.getItem('wbi_tenants');
    const savedMenuItems = localStorage.getItem('wbi_menu');
    const savedTransactions = localStorage.getItem('wbi_transactions');
    
    setTenants(savedTenants ? JSON.parse(savedTenants) : DUMMY_TENANTS);
    setMenuItems(savedMenuItems ? JSON.parse(savedMenuItems) : DUMMY_MENU_ITEMS);
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : DUMMY_TRANSACTIONS);
  }, []);

  const saveToStorage = (key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addTenant = (tenant: Omit<Tenant, 'id' | 'totalSales' | 'totalTransactions'>) => {
    const newTenant = { ...tenant, id: Date.now().toString(), totalSales: 0, totalTransactions: 0 };
    const updated = [...tenants, newTenant];
    setTenants(updated);
    saveToStorage('wbi_tenants', updated);
  };

  const updateTenant = (id: string, tenant: Partial<Tenant>) => {
    const updated = tenants.map(t => t.id === id ? { ...t, ...tenant } : t);
    setTenants(updated);
    saveToStorage('wbi_tenants', updated);
  };

  const deleteTenant = (id: string) => {
    const updated = tenants.filter(t => t.id !== id);
    setTenants(updated);
    saveToStorage('wbi_tenants', updated);
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    saveToStorage('wbi_menu', updated);
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    const updated = menuItems.map(m => m.id === id ? { ...m, ...item } : m);
    setMenuItems(updated);
    saveToStorage('wbi_menu', updated);
  };

  const deleteMenuItem = (id: string) => {
    const updated = menuItems.filter(m => m.id !== id);
    setMenuItems(updated);
    saveToStorage('wbi_menu', updated);
  };

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(c => c.id === itemId ? { ...c, quantity } : c));
    }
  };

  const clearCart = () => setCart([]);

  const checkout = (paymentMethod: string) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      tenantId: selectedTenant?.id || '',
      tenantName: selectedTenant?.name || '',
      items: [...cart],
      total: cartTotal,
      date: new Date().toISOString().split('T')[0],
      paymentMethod
    };
    const updated = [transaction, ...transactions];
    setTransactions(updated);
    saveToStorage('wbi_transactions', updated);
    
    // Update tenant sales
    if (selectedTenant) {
      updateTenant(selectedTenant.id, {
        totalSales: selectedTenant.totalSales + cartTotal,
        totalTransactions: selectedTenant.totalTransactions + 1
      });
    }
    
    clearCart();
    return transaction;
  };

  const selectTenant = (tenant: Tenant | null) => setSelectedTenant(tenant);

  const getMenuByTenant = (tenantId: string) => menuItems.filter(m => m.tenantId === tenantId);

  const getTransactionsByTenant = (tenantId: string) => transactions.filter(t => t.tenantId === tenantId);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      tenants, menuItems, cart, transactions, selectedTenant,
      addTenant, updateTenant, deleteTenant,
      addMenuItem, updateMenuItem, deleteMenuItem,
      addToCart, removeFromCart, updateCartQuantity, clearCart, checkout,
      selectTenant, getMenuByTenant, getTransactionsByTenant, cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
