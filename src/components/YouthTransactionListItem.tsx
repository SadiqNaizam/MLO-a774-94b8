import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpCircle, ArrowDownCircle, ShoppingBag } from 'lucide-react'; // Example icons

interface YouthTransactionListItemProps {
  id: string | number;
  date: string; // Could be Date object, formatted string for display
  description: string;
  amount: number;
  type: 'credit' | 'debit' | 'transfer';
  category?: string;
  icon?: React.ReactNode; // Custom icon
  onClick?: (id: string | number) => void;
}

const YouthTransactionListItem: React.FC<YouthTransactionListItemProps> = ({
  id,
  date,
  description,
  amount,
  type,
  category,
  icon,
  onClick,
}) => {
  console.log(`Rendering YouthTransactionListItem: ${description}`);

  const isCredit = type === 'credit';
  const amountColor = isCredit ? 'text-green-600' : 'text-red-600';
  const TypeIcon = icon ? icon : (isCredit ? <ArrowUpCircle className="h-5 w-5 text-green-500" /> : <ArrowDownCircle className="h-5 w-5 text-red-500" />);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors",
        onClick ? "cursor-pointer" : ""
      )}
      onClick={() => onClick?.(id)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick(id) : undefined}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-full">
          {TypeIcon || <ShoppingBag className="h-5 w-5 text-gray-600" />}
        </div>
        <div>
          <p className="font-medium text-sm">{description}</p>
          <p className="text-xs text-gray-500">
            {date} {category && `• ${category}`}
          </p>
        </div>
      </div>
      <p className={cn("font-semibold text-sm", amountColor)}>
        {isCredit ? '+' : '-'}${Math.abs(amount).toFixed(2)}
      </p>
    </div>
  );
};

export default YouthTransactionListItem;