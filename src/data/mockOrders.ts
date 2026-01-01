import { Order } from '@/types/order';

// Mock orders data for demonstration
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-1',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    items: [
      {
        productId: 'prod-1',
        productName: 'Elegant Evening Dress',
        quantity: 1,
        price: 299.99,
        size: 'M',
        color: 'Black'
      }
    ],
    total: 299.99,
    status: 'delivered',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-20'),
    shippingAddress: {
      fullName: 'Sarah Johnson',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1-555-0123'
    },
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-002',
    userId: 'user-2',
    userName: 'Emily Davis',
    userEmail: 'emily@example.com',
    items: [
      {
        productId: 'prod-2',
        productName: 'Silk Blouse',
        quantity: 2,
        price: 149.99,
        size: 'S',
        color: 'White'
      }
    ],
    total: 299.98,
    status: 'shipped',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-03'),
    shippingAddress: {
      fullName: 'Emily Davis',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
      phone: '+1-555-0456'
    },
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-003',
    userId: 'user-3',
    userName: 'Jessica Wilson',
    userEmail: 'jessica@example.com',
    items: [
      {
        productId: 'prod-3',
        productName: 'Designer Coat',
        quantity: 1,
        price: 499.99,
        size: 'L',
        color: 'Navy'
      }
    ],
    total: 499.99,
    status: 'processing',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
    shippingAddress: {
      fullName: 'Jessica Wilson',
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      phone: '+1-555-0789'
    },
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-004',
    userId: 'user-4',
    userName: 'Amanda Brown',
    userEmail: 'amanda@example.com',
    items: [
      {
        productId: 'prod-1',
        productName: 'Elegant Evening Dress',
        quantity: 1,
        price: 299.99,
        size: 'S',
        color: 'Red'
      },
      {
        productId: 'prod-2',
        productName: 'Silk Blouse',
        quantity: 1,
        price: 149.99,
        size: 'M',
        color: 'Cream'
      }
    ],
    total: 449.98,
    status: 'delivered',
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-05'),
    shippingAddress: {
      fullName: 'Amanda Brown',
      address: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
      phone: '+1-555-0321'
    },
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-005',
    userId: 'user-5',
    userName: 'Lisa Garcia',
    userEmail: 'lisa@example.com',
    items: [
      {
        productId: 'prod-4',
        productName: 'Casual Dress',
        quantity: 3,
        price: 89.99,
        size: 'M',
        color: 'Blue'
      }
    ],
    total: 269.97,
    status: 'pending',
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18'),
    shippingAddress: {
      fullName: 'Lisa Garcia',
      address: '654 Maple Ave',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      phone: '+1-555-0654'
    },
    paymentMethod: 'Debit Card'
  }
];

// Generate more mock orders for better reporting data
const generateMockOrders = (): Order[] => {
  const additionalOrders: Order[] = [];
  const products = [
    { id: 'prod-1', name: 'Elegant Evening Dress', price: 299.99 },
    { id: 'prod-2', name: 'Silk Blouse', price: 149.99 },
    { id: 'prod-3', name: 'Designer Coat', price: 499.99 },
    { id: 'prod-4', name: 'Casual Dress', price: 89.99 },
    { id: 'prod-5', name: 'Summer Top', price: 79.99 },
  ];

  const statuses: Order['status'][] = ['delivered', 'shipped', 'processing', 'pending'];
  const months = [10, 11, 12]; // Oct, Nov, Dec 2024

  for (let i = 6; i <= 50; i++) {
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;

    additionalOrders.push({
      id: `ORD-${i.toString().padStart(3, '0')}`,
      userId: `user-${i}`,
      userName: `Customer ${i}`,
      userEmail: `customer${i}@example.com`,
      items: [{
        productId: randomProduct.id,
        productName: randomProduct.name,
        quantity,
        price: randomProduct.price,
        size: ['S', 'M', 'L'][Math.floor(Math.random() * 3)],
        color: ['Black', 'White', 'Navy', 'Red'][Math.floor(Math.random() * 4)]
      }],
      total: randomProduct.price * quantity,
      status: randomStatus,
      createdAt: new Date(2024, randomMonth - 1, randomDay),
      updatedAt: new Date(2024, randomMonth - 1, randomDay + 2),
      shippingAddress: {
        fullName: `Customer ${i}`,
        address: `${i} Test St`,
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA',
        phone: `+1-555-${i.toString().padStart(4, '0')}`
      },
      paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'PayPal'
    });
  }

  return additionalOrders;
};

export const allMockOrders = [...mockOrders, ...generateMockOrders()];