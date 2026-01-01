import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonthlySalesReport } from '@/types/order';
import { formatCurrency } from '@/utils/currency';

interface MonthlyReportCardProps {
  report: MonthlySalesReport;
  onMonthChange: (month: number, year: number) => void;
}

export const MonthlyReportCard = ({ report, onMonthChange }: MonthlyReportCardProps) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Monthly Report
          <div className="flex space-x-2">
            <Select
              value={months.indexOf(report.month).toString()}
              onValueChange={(value) => onMonthChange(parseInt(value) + 1, report.year)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={report.year.toString()}
              onValueChange={(value) => onMonthChange(months.indexOf(report.month) + 1, parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-xl font-bold text-primary">{report.totalOrders}</div>
            <div className="text-sm text-muted-foreground">Orders</div>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-xl font-bold text-primary">{formatCurrency(report.totalRevenue)}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-sm">Order Status</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Delivered:</span>
              <span className="font-medium text-green-600">{report.ordersByStatus.delivered}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipped:</span>
              <span className="font-medium text-blue-600">{report.ordersByStatus.shipped}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing:</span>
              <span className="font-medium text-yellow-600">{report.ordersByStatus.processing}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-medium text-orange-600">{report.ordersByStatus.pending}</span>
            </div>
          </div>
        </div>

        {report.topProducts.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm">Top Products</h4>
            <div className="space-y-1">
              {report.topProducts.slice(0, 3).map((product, index) => (
                <div key={product.productId} className="flex justify-between text-sm">
                  <span className="truncate">
                    {index + 1}. {product.productName}
                  </span>
                  <span className="font-medium">{formatCurrency(product.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};