import { useState, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MenuCard } from '@/components/MenuCard';
import { CartPanel } from '@/components/CartPanel';
import { useStore, MenuItem } from '@/contexts/StoreContext';
import { Plus, X, Search, ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function TenantMenu() {
  const navigate = useNavigate();
  const { 
    selectedTenant, 
    getMenuByTenant, 
    addMenuItem, 
    updateMenuItem,
    deleteMenuItem,
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    checkout
  } = useStore();
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'Cash' | 'QRIS' | null>(null);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'Makanan',
    image: '/placeholder.svg'
  });
  const receiptRef = useRef<HTMLDivElement>(null);

  const menuItems = selectedTenant ? getMenuByTenant(selectedTenant.id) : [];
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date);
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', price: 0, category: 'Makanan', image: '/placeholder.svg' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    
    if (editingItem) {
      updateMenuItem(editingItem.id, formData);
      toast.success('Menu berhasil diperbarui!');
    } else {
      addMenuItem({ ...formData, tenantId: selectedTenant.id });
      toast.success('Menu berhasil ditambahkan!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (item: MenuItem) => {
    if (confirm(`Hapus menu "${item.name}"?`)) {
      deleteMenuItem(item.id);
      toast.success('Menu berhasil dihapus!');
    }
  };

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const selectPaymentMethod = (method: 'Cash' | 'QRIS') => {
    setSelectedPayment(method);
    const transaction = checkout(method);
    setLastTransaction(transaction);
    setIsPaymentModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handlePrintReceipt = () => {
    setIsSuccessModalOpen(false);
    setIsReceiptModalOpen(true);
  };

  const handleCloseReceipt = () => {
    setIsReceiptModalOpen(false);
    setLastTransaction(null);
    setSelectedPayment(null);
    toast.success('Pesanan selesai!');
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContent = receiptRef.current.innerHTML;
      const printWindow = window.open('', '', 'width=400,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Struk Pembayaran</title>
              <style>
                body { font-family: 'Courier New', monospace; padding: 20px; font-size: 12px; }
                .header { text-align: center; margin-bottom: 20px; }
                .divider { border-top: 1px dashed #000; margin: 10px 0; }
                .item { display: flex; justify-content: space-between; margin: 5px 0; }
                .total { font-weight: bold; font-size: 14px; }
                .footer { text-align: center; margin-top: 20px; font-size: 10px; }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  if (!selectedTenant) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar role="admin_kasir" />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Pilih tenant terlebih dahulu</p>
            <button onClick={() => navigate('/kasir')} className="btn-glow inline-block">
              Pilih Tenant
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role="admin_kasir" />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="flex gap-6 h-[calc(100vh-4rem)]">
          {/* Left - Menu Grid */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <button 
                onClick={() => navigate('/kasir')} 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Dashboard</span>
              </button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>Kasir</span>
                <span>/</span>
                <span className="text-primary">{selectedTenant.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Menu {selectedTenant.name}</h1>
                <button onClick={() => openModal()} className="btn-glow flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Menu
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari menu..."
                className="input-dark w-full pl-12"
              />
            </div>

            {/* Menu Grid */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    onEdit={openModal}
                    onDelete={handleDelete}
                    showEditButton
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Cart */}
          <div className="w-80 flex-shrink-0">
            <CartPanel
              items={cart}
              total={cartTotal}
              onUpdateQuantity={updateCartQuantity}
              onRemove={removeFromCart}
              onCheckout={handleCheckout}
              onClear={clearCart}
            />
          </div>
        </div>
      </main>

      {/* Add/Edit Menu Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card-glow p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingItem ? 'Edit Menu' : 'Tambah Menu'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nama Menu</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-dark w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Harga</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="input-dark w-full"
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-dark w-full"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-muted text-foreground font-medium">
                  Batal
                </button>
                <button type="submit" className="flex-1 btn-glow">
                  {editingItem ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card-glow p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Pilih Metode Pembayaran</h2>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg p-4 bg-muted/50 rounded-xl">
                <span className="text-muted-foreground">Total Pembayaran</span>
                <span className="font-bold text-primary">{formatCurrency(cartTotal)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => selectPaymentMethod('Cash')}
                  className="py-6 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-all flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">💵</span>
                  <span>Cash</span>
                </button>
                <button
                  onClick={() => selectPaymentMethod('QRIS')}
                  className="py-6 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">📱</span>
                  <span>QRIS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && lastTransaction && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card-glow p-6 w-full max-w-md animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Pesanan Berhasil Dibuat!</h2>
              <p className="text-muted-foreground">Transaksi telah dicatat dengan metode {lastTransaction.paymentMethod}</p>
            </div>

            <div className="space-y-3 p-4 bg-muted/50 rounded-xl mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">No. Transaksi</span>
                <span className="text-foreground font-mono">#{lastTransaction.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tenant</span>
                <span className="text-foreground">{lastTransaction.tenantName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Metode Pembayaran</span>
                <span className="text-foreground">{lastTransaction.paymentMethod}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-bold text-primary">{formatCurrency(lastTransaction.total)}</span>
              </div>
            </div>

            <button
              onClick={handlePrintReceipt}
              className="btn-glow w-full flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Cetak Struk
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {isReceiptModalOpen && lastTransaction && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card-glow p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Struk Pembayaran</h2>
              <button onClick={handleCloseReceipt} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div ref={receiptRef} className="bg-white text-black p-6 rounded-xl mb-4 font-mono text-sm">
              <div className="header text-center mb-4">
                <h3 className="font-bold text-lg">{lastTransaction.tenantName}</h3>
                <p className="text-xs text-gray-600">FOODCOURT WBI</p>
                <div className="divider border-t border-dashed border-gray-400 my-3"></div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-600">No: #{lastTransaction.id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-600">{formatDate(new Date(lastTransaction.date))}</p>
              </div>

              <div className="divider border-t border-dashed border-gray-400 my-3"></div>

              <div className="space-y-2">
                {lastTransaction.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <span>{item.name}</span>
                      <span className="text-gray-600 text-xs ml-2">x{item.quantity}</span>
                    </div>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="divider border-t border-dashed border-gray-400 my-3"></div>

              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{formatCurrency(lastTransaction.total)}</span>
              </div>

              <div className="mt-2 flex justify-between text-xs">
                <span>Metode Pembayaran:</span>
                <span className="font-semibold">{lastTransaction.paymentMethod}</span>
              </div>

              <div className="divider border-t border-dashed border-gray-400 my-3"></div>

              <div className="footer text-center text-xs text-gray-600">
                <p>Terima Kasih</p>
                <p>Selamat Menikmati!</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseReceipt}
                className="flex-1 py-3 rounded-xl bg-muted text-foreground font-medium"
              >
                Tutup
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 btn-glow flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
