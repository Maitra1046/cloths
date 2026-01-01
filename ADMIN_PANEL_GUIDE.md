# Admin Panel & User System Guide

## Overview

This project now includes a complete panel-wise system with separate user and admin roles, featuring comprehensive sales reporting and revenue tracking.

## Features

### 🔐 Authentication System

- **Role-based authentication** (User & Admin)
- **Secure login/signup** with form validation
- **Persistent sessions** using localStorage
- **Protected routes** based on user roles

### 👤 User Panel (`/account`)

Users have access to:
- **Order History**: View all past orders with status tracking
- **My Measurements**: Save custom measurements for tailored orders
- **Wishlist**: Save favorite products
- **Saved Addresses**: Manage shipping addresses
- **Profile Management**: Update personal information

### 👨‍💼 Admin Dashboard (`/admin`)

Admins have access to:

#### 📊 Overview Tab
- **Revenue Cards**: Total revenue, monthly revenue, total orders, average order value
- **Sales Chart**: 6-month revenue trend visualization
- **Monthly Report**: Current month's sales breakdown

#### 📦 Orders Tab
- **Orders Table**: View and manage all customer orders
- **Status Management**: Update order status (pending, processing, shipped, delivered, cancelled)
- **Order Details**: View customer information and order items

#### 🛍️ Products Tab
- **Product Management**: Complete CRUD operations for products
- **Collection Management**: Create, edit, and organize product collections
- **Bulk Operations**: Select multiple products for bulk actions
- **Image Management**: Add unlimited photos per product
- **Specifications**: Manage sizes, colors, materials, care instructions, features
- **Inventory Tracking**: Stock management and availability
- **Search & Filter**: Advanced filtering by category, collection, status
- **Product Statistics**: Overview of product counts and categories

**Product Management Features:**
- ✅ **Add New Products**: Complete product form with multiple tabs
- ✅ **Edit Existing Products**: Update all product information
- ✅ **Delete Products**: Remove products with confirmation
- ✅ **Duplicate Products**: Clone products for variations
- ✅ **Move Between Collections**: Drag products to different collections
- ✅ **Bulk Actions**: Select multiple products for mass operations
- ✅ **Image Gallery**: Add unlimited product photos with drag-and-drop ordering
- ✅ **Specifications Management**: 
  - Sizes (XS, S, M, L, XL, XXL, Custom)
  - Colors (custom color picker/input)
  - Materials (Silk, Cotton, Linen, Wool, Cashmere, etc.)
  - Care instructions (custom list)
  - Product features (custom list)
- ✅ **Collection Management**: Create and organize product collections
- ✅ **Inventory Control**: Stock counts and availability status
- ✅ **Product Status**: New, Best Seller, On Sale flags
- ✅ **Advanced Search**: Search by name, description, category, materials
- ✅ **Grid/Table Views**: Switch between visual and detailed views

#### 📈 Reports Tab
- **Monthly Sales Report**:
  - Total orders and revenue for selected month
  - Order status breakdown
  - Top-selling products
- **Revenue Breakdown**:
  - Monthly, yearly, and all-time revenue
  - Growth rate comparison

#### 📉 Analytics Tab
- Placeholder for advanced analytics features

## Demo Credentials

### Admin Access
- **Email**: `admin@beenas.com`
- **Password**: `password`

### User Access
- **Email**: `user@example.com`
- **Password**: `password`

## Technical Implementation

### File Structure

```
src/
├── types/
│   ├── user.ts              # User type definitions
│   ├── order.ts             # Order and report type definitions
│   └── product.ts           # Product and collection type definitions
├── services/
│   ├── orderService.ts      # Order management and reporting logic
│   └── productService.ts    # Product and collection management
├── data/
│   ├── mockOrders.ts        # Mock order data (50+ orders)
│   └── products.ts          # Product catalog data
├── context/
│   └── AuthContext.tsx      # Enhanced authentication context
├── pages/
│   ├── AdminDashboard.tsx   # Admin panel main page
│   ├── Account.tsx          # User account page
│   ├── Login.tsx            # Login page
│   └── Signup.tsx           # Signup page
└── components/
    ├── admin/
    │   ├── RevenueCard.tsx       # Revenue metric cards
    │   ├── SalesChart.tsx        # Sales visualization
    │   ├── OrdersTable.tsx       # Orders management table
    │   ├── MonthlyReportCard.tsx # Monthly report widget
    │   ├── ProductManagement.tsx # Main product management interface
    │   ├── ProductForm.tsx       # Product creation/editing form
    │   ├── ProductCard.tsx       # Product grid view card
    │   ├── CollectionManager.tsx # Collection management
    │   └── BulkActions.tsx       # Bulk operations interface
    └── layout/
        └── Header.tsx        # Updated with role-based navigation
```

### Key Features

#### 1. Order Service
The `OrderService` class provides:
- `getAllOrders()`: Get all orders
- `getOrdersByUserId(userId)`: Get user-specific orders
- `updateOrderStatus(orderId, status)`: Update order status
- `getMonthlySalesReport(year, month)`: Generate monthly reports
- `getRevenueStats()`: Calculate revenue statistics
- `getOrdersForDateRange(start, end)`: Filter orders by date

#### 2. Product Service
The `ProductService` class provides:
- `getAllProducts()`: Get all products
- `getProductById(id)`: Get specific product
- `getProductsByCollection(collectionId)`: Filter by collection
- `getProductsByCategory(category)`: Filter by category
- `createProduct(data, images)`: Add new product
- `updateProduct(id, data, images)`: Update existing product
- `deleteProduct(id)`: Remove product
- `duplicateProduct(id)`: Clone product
- `moveProductToCollection(productId, collectionId)`: Move between collections
- `bulkUpdateProducts(ids, updates)`: Bulk operations
- `bulkMoveToCollection(ids, collectionId)`: Bulk move
- `bulkDelete(ids)`: Bulk delete
- `searchProducts(query)`: Text search
- `filterProducts(filters)`: Advanced filtering
- `getProductStats()`: Statistics and analytics

#### 3. Collection Management
- `getAllCollections()`: Get all collections
- `createCollection(name, description, image)`: Create new collection
- `updateCollection(id, name, description, image)`: Update collection
- `deleteCollection(id)`: Remove collection (moves products to uncategorized)

#### 4. Revenue Statistics
- Total revenue (all-time)
- Monthly revenue (current month)
- Yearly revenue (current year)
- Average order value
- Growth rate (month-over-month)

#### 5. Monthly Sales Reports
- Total orders and revenue
- Order status breakdown (pending, processing, shipped, delivered, cancelled)
- Top 5 products by revenue
- Month/year selector

#### 6. Mock Data
- 50+ generated orders across multiple months
- Realistic order data with various statuses
- Multiple products and customers
- Date range: October - December 2024

## Usage

### Starting the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Accessing the Panels

1. **User Panel**:
   - Sign up at `/signup` or login at `/login`
   - Access your account at `/account`
   - View orders, manage profile, save measurements

2. **Admin Panel**:
   - Login with admin credentials at `/login`
   - Automatically redirected to `/admin`
   - Access via Settings icon in header (when logged in as admin)

### Navigation

- **Header**: Shows different options based on user role
  - Admin users see a Settings icon linking to admin dashboard
  - User dropdown shows role badge
  - Mobile menu includes role-specific links

## Customization

### Adding New Order Statuses

Edit `src/types/order.ts`:
```typescript
status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'your-new-status';
```

### Modifying Revenue Calculations

Edit `src/services/orderService.ts` in the `getRevenueStats()` method.

### Adding New Report Types

Create new methods in `OrderService` class and add corresponding UI components in the admin dashboard.

### Customizing Mock Data

Edit `src/data/mockOrders.ts` to add more orders or modify existing ones.

## Future Enhancements

Potential features to add:
- Real backend API integration
- Advanced analytics with more charts
- Export reports to PDF/Excel
- Email notifications for order updates
- Product inventory management
- Customer management panel
- Discount/coupon system
- Multi-currency support
- Real-time order tracking

## Security Notes

⚠️ **Important**: This is a demo implementation with mock authentication. For production:
- Implement proper backend authentication (JWT, OAuth, etc.)
- Use secure password hashing (bcrypt, argon2)
- Add CSRF protection
- Implement rate limiting
- Use HTTPS only
- Add proper session management
- Implement role-based access control (RBAC) on the backend
- Validate all inputs server-side
- Add audit logging for admin actions

## Support

For issues or questions:
1. Check the console for error messages
2. Verify you're using the correct credentials
3. Clear localStorage if experiencing auth issues
4. Ensure all dependencies are installed

## License

This project is part of the BEENAS e-commerce platform.
