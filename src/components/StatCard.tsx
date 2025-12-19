import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'purple';
}

const variantStyles = {
  default: 'from-card to-card',
  success: 'from-emerald-500/20 to-emerald-600/10',
  warning: 'from-amber-500/20 to-amber-600/10',
  purple: 'from-purple-500/20 to-purple-600/10',
};

const iconBgStyles = {
  default: 'bg-primary/20 text-primary',
  success: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  purple: 'bg-purple-500/20 text-purple-400',
};

export function StatCard({ title, value, change, changeLabel, icon, variant = 'default' }: StatCardProps) {
  const isPositive = change && change > 0;
  
  return (
    <div className={cn(
      "card-glow p-6 bg-gradient-to-br animate-fade-in",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBgStyles[variant])}>
            {icon}
          </div>
        )}
      </div>
      
      <p className="text-2xl font-bold text-foreground mb-2">{value}</p>
      
      {change !== undefined && (
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex items-center gap-1 text-sm font-medium",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
