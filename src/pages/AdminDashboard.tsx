import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderService } from '@/services/orderService';
import { RevenueStats, MonthlySalesReport } from '@/types/order';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { SalesChart, OrdersTable, RevenueCard, MonthlyReportCard } from '@/components/admin';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { formatCurrency } from '@/utils/currency';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlySalesReport | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const stats = OrderService.getRevenueStats();
      setRevenueStats(stats);
      
      const report = OrderService.getMonthlySalesReport(selectedYear, selectedMonth);
      setMonthlyReport(report);
    }

    // Listen for new orders
    const handleNewOrder = (event: CustomEvent) => {
      if (isAuthenticated && isAdmin) {
        // Refresh stats when new order comes in
        const stats = OrderService.getRevenueStats();
        setRevenueStats(stats);
        
        const report = OrderService.getMonthlySalesReport(selectedYear, selectedMonth);
        setMonthlyReport(report);
      }
    };

    window.addEventListener('newOrder', handleNewOrder as EventListener);
    
    return () => {
      window.removeEventListener('newOrder', handleNewOrder as EventListener);
    };
  }, [isAuthenticated, isAdmin, selectedMonth, selectedYear]);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your store and view sales analytics
          </p>
        </div>

        {/* Revenue Overview Cards */}
        {revenueStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <RevenueCard
              title="Total Revenue"
              value={revenueStats.totalRevenue}
              icon={DollarSign}
              trend={revenueStats.growthRate}
            />
            <RevenueCard
              title="Monthly Revenue"
              value={revenueStats.monthlyRevenue}
              icon={TrendingUp}
              trend={revenueStats.growthRate}
            />
            <RevenueCard
              title="Total Orders"
              value={revenueStats.totalOrders}
              icon={ShoppingCart}
              isCount
            />
            <RevenueCard
              title="Avg Order Value"
              value={revenueStats.averageOrderValue}
              icon={Users}
            />
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>
                    Revenue trends over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesChart />
                </CardContent>
              </Card>

              {monthlyReport && (
                <MonthlyReportCard 
                  report={monthlyReport}
                  onMonthChange={handleMonthChange}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Manage and track customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {monthlyReport && (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Sales Report</CardTitle>
                    <CardDescription>
                      Detailed breakdown for {monthlyReport.month} {monthlyReport.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {monthlyReport.totalOrders}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Orders</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(monthlyReport.totalRevenue)}
                        </div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Order Status Breakdown</h4>
                      <div className="space-y-2">
                        {Object.entries(monthlyReport.ordersByStatus).map(([status, count]) => (
                          <div key={status} className="flex justify-between">
                            <span className="capitalize">{status}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Top Products</h4>
                      <div className="space-y-2">
                        {monthlyReport.topProducts.slice(0, 3).map((product) => (
                          <div key={product.productId} className="flex justify-between">
                            <span className="text-sm">{product.productName}</span>
                            <span className="font-medium">{formatCurrency(product.revenue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>
                    Revenue analysis by time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {revenueStats && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>This Month</span>
                        <span className="font-bold">{formatCurrency(revenueStats.monthlyRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>This Year</span>
                        <span className="font-bold">{formatCurrency(revenueStats.yearlyRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>All Time</span>
                        <span className="font-bold">{formatCurrency(revenueStats.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                        <span>Growth Rate</span>
                        <span className={`font-bold ${revenueStats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {revenueStats.growthRate >= 0 ? '+' : ''}{revenueStats.growthRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Detailed performance metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Advanced analytics features coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;