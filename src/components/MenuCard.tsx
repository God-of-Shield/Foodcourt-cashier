import { MenuItem } from '@/contexts/StoreContext';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
  showEditButton?: boolean;
}

export function MenuCard({ item, onAddToCart, onEdit, onDelete, showEditButton }: MenuCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="menu-card group">
      <div className="relative mb-4">
        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-muted border-2 border-border group-hover:border-primary transition-colors">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        {showEditButton && (
          <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="w-7 h-7 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="w-7 h-7 rounded-full bg-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-foreground text-sm truncate">{item.name}</h3>
        <p className="text-primary font-bold">{formatPrice(item.price)}</p>
        
        <button
          onClick={() => onAddToCart(item)}
          className={cn(
            "w-full py-2 rounded-xl text-sm font-medium transition-all",
            "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
            "flex items-center justify-center gap-2"
          )}
        >
          <Plus className="w-4 h-4" />
          <span>Keranjang</span>
        </button>
      </div>
    </div>
  );
}
