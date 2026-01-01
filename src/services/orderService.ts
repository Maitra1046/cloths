import { Order, MonthlySalesReport, RevenueStats } from '@/types/order';

export class OrderService {
  private static orders: Order[] = [];
  private static STORAGE_KEY = 'beenas-orders';

  // Initialize orders from localStorage
  static {
    this.loadOrdersFromStorage();
  }

  private static loadOrdersFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.orders = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load orders from storage:', error);
      this.orders = [];
    }
  }

  private static saveOrdersToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders));
    } catch (error) {
      console.error('Failed to save orders to storage:', error);
    }
  }

  static getAllOrders(): Order[] {
    return [...this.orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  static getOrdersByUserId(userId: string): Order[] {
    return this.orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getOrderById(orderId: string): Order | undefined {
    return this.orders.find(order => order.id === orderId);
  }

  static updateOrderStatus(orderId: string, status: Order['status']): boolean {
    const order = this.orders.find(order => order.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      this.saveOrdersToStorage();
      return true;
    }
    return false;
  }

  static getMonthlySalesReport(year: number, month: number): MonthlySalesReport {
    const monthOrders = this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === year && orderDate.getMonth() === month - 1;
    });

    const totalRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    
    const ordersByStatus = {
      pending: monthOrders.filter(o => o.status === 'pending').length,
      processing: monthOrders.filter(o => o.status === 'processing').length,
      shipped: monthOrders.filter(o => o.status === 'shipped').length,
      delivered: monthOrders.filter(o => o.status === 'delivered').length,
      cancelled: monthOrders.filter(o => o.status === 'cancelled').length,
    };

    // Calculate top products
    const productStats = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    monthOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = productStats.get(item.productId) || { 
          name: item.productName, 
          quantity: 0, 
          revenue: 0 
        };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        productStats.set(item.productId, existing);
      });
    });

    const topProducts = Array.from(productStats.entries())
      .map(([productId, stats]) => ({
        productId,
        productName: stats.name,
        quantity: stats.quantity,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
      year,
      totalOrders: monthOrders.length,
      totalRevenue,
      ordersByStatus,
      topProducts
    };
  }

  static getRevenueStats(): RevenueStats {
    if (this.orders.length === 0) {
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        averageOrderValue: 0,
        totalOrders: 0,
        growthRate: 0
      };
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Total revenue
    const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);

    // Monthly revenue (current month)
    const monthlyOrders = this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

    // Yearly revenue (current year)
    const yearlyOrders = this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getFullYear() === currentYear;
    });
    const yearlyRevenue = yearlyOrders.reduce((sum, order) => sum + order.total, 0);

    // Average order value
    const averageOrderValue = this.orders.length > 0 ? totalRevenue / this.orders.length : 0;

    // Growth rate (comparing current month to previous month)
    const previousMonthOrders = this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return orderDate.getFullYear() === prevYear && orderDate.getMonth() === prevMonth;
    });
    const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const growthRate = previousMonthRevenue > 0 
      ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : monthlyRevenue > 0 ? 100 : 0;

    return {
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      averageOrderValue,
      totalOrders: this.orders.length,
      growthRate
    };
  }

  static getOrdersForDateRange(startDate: Date, endDate: Date): Order[] {
    return this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getOrdersForToday(): Order[] {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    return this.getOrdersForDateRange(startOfDay, endOfDay);
  }

  static getOrdersForYesterday(): Order[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const endOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
    return this.getOrdersForDateRange(startOfDay, endOfDay);
  }

  static getOrdersForLastNDays(days: number): Order[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.getOrdersForDateRange(startDate, endDate);
  }

  static getOrdersForCurrentMonth(): Order[] {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return this.getOrdersForDateRange(startOfMonth, endOfMonth);
  }

  static getOrdersForLastMonth(): Order[] {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return this.getOrdersForDateRange(startOfLastMonth, endOfLastMonth);
  }

  static getOrdersForCurrentYear(): Order[] {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    return this.getOrdersForDateRange(startOfYear, endOfYear);
  }

  static createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(newOrder);
    this.saveOrdersToStorage();
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('newOrder', { detail: newOrder }));
    
    return newOrder;
  }

  static deleteOrder(orderId: string): boolean {
    const index = this.orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
      this.orders.splice(index, 1);
      this.saveOrdersToStorage();
      return true;
    }
    return false;
  }

  // Admin methods
  static getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  static getRecentOrders(limit: number = 10): Order[] {
    return this.getAllOrders().slice(0, limit);
  }

  static searchOrders(query: string): Order[] {
    const lowerQuery = query.toLowerCase();
    return this.orders.filter(order => 
      order.id.toLowerCase().includes(lowerQuery) ||
      order.userName.toLowerCase().includes(lowerQuery) ||
      order.userEmail.toLowerCase().includes(lowerQuery) ||
      order.items.some(item => item.productName.toLowerCase().includes(lowerQuery))
    );
  }
}