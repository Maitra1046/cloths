import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface RevenueCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  isCount?: boolean;
}

export const RevenueCard = ({ title, value, icon: Icon, trend, isCount = false }: RevenueCardProps) => {
  const formatValue = (val: number) => {
    if (isCount) {
      return val.toLocaleString();
    }
    return formatCurrency(val);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {trend !== undefined && (
          <p className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};