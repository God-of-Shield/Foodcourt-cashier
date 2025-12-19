import { CartItem } from '@/contexts/StoreContext';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartPanelProps {
  items: CartItem[];
  total: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
  onClear: () => void;
}

export function CartPanel({ items, total, onUpdateQuantity, onRemove, onCheckout, onClear }: CartPanelProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="card-glow h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Total Orders Customer</h3>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-destructive hover:underline"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Keranjang kosong</p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 animate-scale-in"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">{item.name}</h4>
                <p className="text-primary text-sm font-semibold">{formatPrice(item.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-foreground">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className={cn(
            "w-full py-3 rounded-xl font-semibold transition-all",
            items.length > 0 
              ? "btn-glow" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
