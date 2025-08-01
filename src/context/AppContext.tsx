import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { SupabaseService } from '../services/supabaseService';
import { User, Product, Order, SupportTicket, Promotion, Analytics, ReturnRequest, PendingUser, WholesalerAnalytics } from '../types';

interface PlatformSettings {
  userRegistrationEnabled: boolean;
  emailNotificationsEnabled: boolean;
  autoApprovePromotions: boolean;
  maintenanceMode: boolean;
  commissionRate: number;
  minimumOrderValue: number;
  maxProductsPerWholesaler: number;
  supportResponseTime: number;
  twoFactorRequired: boolean;
  dataEncryptionEnabled: boolean;
  auditLoggingEnabled: boolean;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  pendingUsers: PendingUser[];
  products: Product[];
  orders: Order[];
  tickets: SupportTicket[];
  promotions: Promotion[];
  returnRequests: ReturnRequest[];
  analytics: Analytics;
  wholesalerAnalytics: WholesalerAnalytics[];
  platformSettings: PlatformSettings;
  systemStats: {
    serverUptime: number;
    responseTime: number;
    activeSessions: number;
    dailyTransactions: number;
    transactionSuccessRate: number;
    failedPayments: number;
    dailyActiveUsers: number;
    newRegistrations: number;
    bounceRate: number;
  };
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'ADD_PENDING_USER'; payload: PendingUser }
  | { type: 'APPROVE_USER'; payload: { pendingUserId: string; adminId: string } }
  | { type: 'REJECT_USER'; payload: { pendingUserId: string; adminId: string; reason: string } }
  | { type: 'UPDATE_PLATFORM_SETTINGS'; payload: Partial<PlatformSettings> }
  | { type: 'BULK_VERIFY_USERS'; payload: string[] }
  | { type: 'SUSPEND_USER'; payload: string }
  | { type: 'BROADCAST_ANNOUNCEMENT'; payload: { message: string; type: string } }
  | { type: 'RESET_SETTINGS_TO_DEFAULT' }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'ADD_TICKET'; payload: SupportTicket }
  | { type: 'UPDATE_TICKET'; payload: SupportTicket }
  | { type: 'ADD_PROMOTION'; payload: Promotion }
  | { type: 'UPDATE_PROMOTION'; payload: Promotion }
  | { type: 'APPROVE_PROMOTION'; payload: { id: string; adminId: string } }
  | { type: 'REJECT_PROMOTION'; payload: { id: string; adminId: string; reason: string } }
  | { type: 'ADD_RETURN_REQUEST'; payload: ReturnRequest }
  | { type: 'UPDATE_RETURN_REQUEST'; payload: ReturnRequest }
  | { type: 'APPROVE_RETURN_REQUEST'; payload: { id: string; supportId: string; approvedAmount: number; refundMethod: string } }
  | { type: 'REJECT_RETURN_REQUEST'; payload: { id: string; supportId: string; reason: string } };

const initialState: AppState = {
  currentUser: null,
  platformSettings: {
    userRegistrationEnabled: true,
    emailNotificationsEnabled: true,
    autoApprovePromotions: false,
    maintenanceMode: false,
    commissionRate: 5,
    minimumOrderValue: 100,
    maxProductsPerWholesaler: 1000,
    supportResponseTime: 24,
    twoFactorRequired: false,
    dataEncryptionEnabled: true,
    auditLoggingEnabled: true
  },
  systemStats: {
    serverUptime: 99.8,
    responseTime: 245,
    activeSessions: 1247,
    dailyTransactions: 342,
    transactionSuccessRate: 98.5,
    failedPayments: 5,
    dailyActiveUsers: 892,
    newRegistrations: 23,
    bounceRate: 12.3
  },
  users: [
    {
      id: '1',
      name: 'John Wholesaler',
      email: 'john@wholesale.com',
      role: 'wholesaler',
      businessName: 'Fresh Foods Wholesale',
      phone: '+27-123-456-789',
      address: '123 Market Street, Johannesburg',
      verified: true,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Mary Retailer',
      email: 'mary@spaza.com',
      role: 'retailer',
      businessName: 'Mary\'s Spaza Shop',
      phone: '+27-987-654-321',
      address: '45 Township Road, Soweto',
      verified: true,
      status: 'active',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@nwi.com',
      role: 'admin',
      verified: true,
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '4',
      name: 'Support Agent',
      email: 'support@nwi.com',
      role: 'support',
      verified: true,
      status: 'active',
      createdAt: '2024-01-01'
    }
  ],
  pendingUsers: [
    {
      id: 'p1',
      name: 'Sarah Johnson',
      email: 'sarah@freshmarket.co.za',
      role: 'retailer',
      businessName: 'Fresh Market Corner Store',
      phone: '+27-111-222-333',
      address: '78 Main Road, Cape Town',
      registrationReason: 'Looking to expand our product range and establish wholesale partnerships for better pricing.',
      submittedAt: '2024-01-25',
      documents: ['business_license.pdf', 'tax_certificate.pdf']
    },
    {
      id: 'p2',
      name: 'David Wholesale Co',
      email: 'david@bulkgoods.co.za',
      role: 'wholesaler',
      businessName: 'Bulk Goods Distribution',
      phone: '+27-444-555-666',
      address: '156 Industrial Avenue, Durban',
      registrationReason: 'Established wholesale business seeking to expand our retail network through digital platform.',
      submittedAt: '2024-01-24',
      documents: ['wholesale_license.pdf', 'vat_registration.pdf', 'warehouse_certificate.pdf']
    },
    {
      id: 'p3',
      name: 'Lisa Community Store',
      email: 'lisa@communitystore.co.za',
      role: 'retailer',
      businessName: 'Community General Store',
      phone: '+27-777-888-999',
      address: '23 Township Street, Pretoria',
      registrationReason: 'Community store serving local township, need access to wholesale prices to serve community better.',
      submittedAt: '2024-01-23'
    }
  ],
  products: [
    {
      id: '1',
      wholesalerId: '1',
      name: 'Coca-Cola 330ml Cans (24 Pack)',
      description: 'Classic Coca-Cola in 330ml cans, case of 24 units',
      price: 240,
      stock: 500,
      minOrderQuantity: 10,
      category: 'Beverages',
      imageUrl: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg',
      available: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      wholesalerId: '1',
      name: 'Lay\'s Potato Chips 120g (12 Pack)',
      description: 'Original flavor Lay\'s potato chips, 120g bags, case of 12',
      price: 180,
      stock: 300,
      minOrderQuantity: 5,
      category: 'Snacks',
      imageUrl: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
      available: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '3',
      wholesalerId: '1',
      name: 'Maggi 2-Minute Noodles (24 Pack)',
      description: 'Chicken flavor instant noodles, 73g each, case of 24',
      price: 120,
      stock: 400,
      minOrderQuantity: 12,
      category: 'Instant Foods',
      imageUrl: 'https://images.pexels.com/photos/6287284/pexels-photo-6287284.jpeg',
      available: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '4',
      wholesalerId: '1',
      name: 'Sunlight Dishwashing Liquid 750ml (12 Pack)',
      description: 'Sunlight dishwashing liquid, 750ml bottles, case of 12',
      price: 360,
      stock: 150,
      minOrderQuantity: 6,
      category: 'Household',
      imageUrl: 'https://images.pexels.com/photos/4107845/pexels-photo-4107845.jpeg',
      available: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '5',
      wholesalerId: '1',
      name: 'Simba Chips Assorted 36g (24 Pack)',
      description: 'Mixed flavors Simba chips, 36g bags, case of 24',
      price: 144,
      stock: 250,
      minOrderQuantity: 8,
      category: 'Snacks',
      imageUrl: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
      available: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '6',
      wholesalerId: '1',
      name: 'Fanta Orange 500ml (12 Pack)',
      description: 'Fanta Orange soft drink, 500ml bottles, case of 12',
      price: 156,
      stock: 200,
      minOrderQuantity: 6,
      category: 'Beverages',
      imageUrl: 'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg',
      available: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '7',
      wholesalerId: '1',
      name: 'Omo Washing Powder 2kg (6 Pack)',
      description: 'Omo auto washing powder, 2kg boxes, case of 6',
      price: 480,
      stock: 100,
      minOrderQuantity: 3,
      category: 'Household',
      imageUrl: 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg',
      available: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '8',
      wholesalerId: '1',
      name: 'Knorr Soup 50g (20 Pack)',
      description: 'Chicken noodle soup sachets, 50g each, case of 20',
      price: 100,
      stock: 300,
      minOrderQuantity: 10,
      category: 'Instant Foods',
      imageUrl: 'https://images.pexels.com/photos/6287339/pexels-photo-6287339.jpeg',
      available: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ],
  orders: [
    {
      id: '1',
      retailerId: '2',
      wholesalerId: '1',
      items: [
        {
          productId: '1',
          productName: 'Coca-Cola 330ml Cans (24 Pack)',
          quantity: 10,
          price: 240,
          total: 2400
        },
        {
          productId: '2',
          productName: 'Lay\'s Potato Chips 120g (12 Pack)',
          quantity: 5,
          price: 180,
          total: 900
        }
      ],
      total: 3300,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22'
    },
    {
      id: '2',
      retailerId: '2',
      wholesalerId: '1',
      items: [
        {
          productId: '3',
          productName: 'Maggi 2-Minute Noodles (24 Pack)',
          quantity: 12,
          price: 120,
          total: 1440
        }
      ],
      total: 1440,
      status: 'ready',
      paymentStatus: 'paid',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-21'
    },
    {
      id: '3',
      retailerId: '2',
      wholesalerId: '1',
      items: [
        {
          productId: '4',
          productName: 'Sunlight Dishwashing Liquid 750ml (12 Pack)',
          quantity: 6,
          price: 360,
          total: 2160
        }
      ],
      total: 2160,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19'
    }
  ],
  tickets: [
    {
      id: '1',
      userId: '2',
      userName: 'Mary Retailer',
      subject: 'Payment Issue',
      description: 'Unable to complete payment for order #1. Payment gateway shows error.',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mary Retailer',
      subject: 'Product Quality Issue',
      description: 'Received damaged Coca-Cola cans in last order. Need replacement.',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-01-21',
      updatedAt: '2024-01-22',
      assignedTo: '4'
    },
    {
      id: '3',
      userId: '1',
      userName: 'John Wholesaler',
      subject: 'Stock Update Issue',
      description: 'Unable to update stock levels for multiple products.',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-19',
      updatedAt: '2024-01-20',
      assignedTo: '4'
    }
  ],
  promotions: [
    {
      id: '1',
      wholesalerId: '1',
      title: 'Beverage Bundle Deal',
      description: '15% off when you buy 20+ cases of any beverages',
      discount: 15,
      validFrom: '2024-01-20',
      validTo: '2024-02-20',
      active: true,
      productIds: ['1', '6'],
      status: 'approved',
      submittedAt: '2024-01-20',
      reviewedAt: '2024-01-20',
      reviewedBy: '3'
    },
    {
      id: '2',
      wholesalerId: '1',
      title: 'Snack Attack Special',
      description: '10% off all snack products for bulk orders',
      discount: 10,
      validFrom: '2024-01-15',
      validTo: '2024-02-15',
      active: true,
      productIds: ['2', '5'],
      status: 'approved',
      submittedAt: '2024-01-15',
      reviewedAt: '2024-01-15',
      reviewedBy: '3'
    },
    {
      id: '3',
      wholesalerId: '1',
      title: 'Household Essentials Promo',
      description: '20% off household cleaning products',
      discount: 20,
      validFrom: '2024-01-25',
      validTo: '2024-02-25',
      active: false,
      productIds: ['4', '7'],
      status: 'pending',
      submittedAt: '2024-01-25'
    }
  ],
  returnRequests: [
    {
      id: '1',
      orderId: '3',
      retailerId: '2',
      wholesalerId: '1',
      reason: 'damaged_goods',
      description: 'Received damaged Sunlight dishwashing liquid bottles. 3 out of 12 bottles were cracked and leaking.',
      status: 'pending',
      priority: 'high',
      requestedAmount: 90,
      items: [
        {
          productId: '4',
          productName: 'Sunlight Dishwashing Liquid 750ml',
          quantity: 3,
          reason: 'Bottles arrived cracked and leaking',
          condition: 'damaged',
          unitPrice: 30,
          totalRefund: 90
        }
      ],
      images: [
        'https://images.pexels.com/photos/4107845/pexels-photo-4107845.jpeg'
      ],
      createdAt: '2024-01-23',
      updatedAt: '2024-01-23'
    },
    {
      id: '2',
      orderId: '1',
      retailerId: '2',
      wholesalerId: '1',
      reason: 'wrong_quantity',
      description: 'Ordered 10 cases of Coca-Cola but only received 8 cases. Missing 2 cases from the shipment.',
      status: 'approved',
      priority: 'medium',
      requestedAmount: 480,
      approvedAmount: 480,
      items: [
        {
          productId: '1',
          productName: 'Coca-Cola 330ml Cans (24 Pack)',
          quantity: 2,
          reason: 'Missing from shipment',
          condition: 'not_as_described',
          unitPrice: 240,
          totalRefund: 480
        }
      ],
      createdAt: '2024-01-21',
      updatedAt: '2024-01-22',
      processedBy: '4',
      processedAt: '2024-01-22',
      refundMethod: 'original_payment'
    },
    {
      id: '3',
      orderId: '2',
      retailerId: '2',
      wholesalerId: '1',
      reason: 'quality_issue',
      description: 'Maggi noodles have expired dates. All 24 packs show expiry date of last month.',
      status: 'processing',
      priority: 'urgent',
      requestedAmount: 1440,
      approvedAmount: 1440,
      items: [
        {
          productId: '3',
          productName: 'Maggi 2-Minute Noodles (24 Pack)',
          quantity: 12,
          reason: 'Expired products received',
          condition: 'defective',
          unitPrice: 120,
          totalRefund: 1440
        }
      ],
      createdAt: '2024-01-20',
      updatedAt: '2024-01-23',
      processedBy: '4',
      processedAt: '2024-01-22',
      refundMethod: 'store_credit',
      trackingNumber: 'RT123456789'
    }
  ],
  analytics: {
    totalRevenue: 185000,
    totalOrders: 67,
    totalUsers: 342,
    totalProducts: 8,
    monthlyRevenue: [
      { month: 'Oct', revenue: 35000 },
      { month: 'Nov', revenue: 42000 },
      { month: 'Dec', revenue: 38000 },
      { month: 'Jan', revenue: 70000 }
    ],
    ordersByStatus: [
      { status: 'completed', count: 45 },
      { status: 'pending', count: 12 },
      { status: 'ready', count: 8 },
      { status: 'accepted', count: 2 }
    ],
    topProducts: [
      { name: 'Coca-Cola 330ml Cans', sales: 1200 },
      { name: 'Maggi 2-Minute Noodles', sales: 980 },
      { name: 'Lay\'s Potato Chips', sales: 750 },
      { name: 'Fanta Orange 500ml', sales: 650 },
      { name: 'Simba Chips Assorted', sales: 580 }
    ]
  },
  wholesalerAnalytics: [
    {
      wholesalerId: '1',
      wholesalerName: 'John Wholesaler',
      businessName: 'Fresh Foods Wholesale',
      totalRevenue: 185000,
      totalOrders: 67,
      totalProducts: 8,
      activePromotions: 2,
      averageOrderValue: 2761,
      monthlyRevenue: [
        { month: 'Oct', revenue: 35000 },
        { month: 'Nov', revenue: 42000 },
        { month: 'Dec', revenue: 38000 },
        { month: 'Jan', revenue: 70000 }
      ],
      ordersByStatus: [
        { status: 'completed', count: 45 },
        { status: 'pending', count: 12 },
        { status: 'ready', count: 8 },
        { status: 'accepted', count: 2 }
      ],
      topProducts: [
        { name: 'Coca-Cola 330ml Cans', sales: 1200, revenue: 288000 },
        { name: 'Maggi 2-Minute Noodles', sales: 980, revenue: 117600 },
        { name: 'Lay\'s Potato Chips', sales: 750, revenue: 135000 },
        { name: 'Fanta Orange 500ml', sales: 650, revenue: 101400 },
        { name: 'Simba Chips Assorted', sales: 580, revenue: 83520 }
      ],
      customerCount: 45,
      repeatCustomerRate: 68.5,
      stockTurnover: 4.2,
      promotionPerformance: [
        { title: 'Beverage Bundle Deal', ordersGenerated: 23, revenue: 55200 },
        { title: 'Snack Attack Special', ordersGenerated: 18, revenue: 32400 }
      ],
      recentActivity: [
        { date: '2024-01-25', activity: 'New Order', value: 'R3,200' },
        { date: '2024-01-24', activity: 'Product Added', value: 'Sunlight Soap' },
        { date: '2024-01-23', activity: 'Promotion Created', value: 'Household Essentials' },
        { date: '2024-01-22', activity: 'Order Fulfilled', value: 'R1,800' },
        { date: '2024-01-21', activity: 'New Customer', value: 'Thabo\'s Store' }
      ],
      joinDate: '2024-01-15',
      lastOrderDate: '2024-01-25',
      totalCustomers: 45,
      averageRating: 4.7,
      supportTickets: 3,
      returnRate: 2.1,
      fulfillmentRate: 97.8
    }
  ]
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'ADD_PENDING_USER':
      return { ...state, pendingUsers: [...state.pendingUsers, action.payload] };
    case 'APPROVE_USER':
      const pendingUser = state.pendingUsers.find(u => u.id === action.payload.pendingUserId);
      if (pendingUser) {
        const newUser: User = {
          id: Date.now().toString(),
          name: pendingUser.name,
          email: pendingUser.email,
          role: pendingUser.role,
          businessName: pendingUser.businessName,
          phone: pendingUser.phone,
          address: pendingUser.address,
          verified: true,
          status: 'active',
          createdAt: new Date().toISOString()
        };
        return {
          ...state,
          users: [...state.users, newUser],
          pendingUsers: state.pendingUsers.filter(u => u.id !== action.payload.pendingUserId)
        };
      }
      return state;
    case 'REJECT_USER':
      return {
        ...state,
        pendingUsers: state.pendingUsers.filter(u => u.id !== action.payload.pendingUserId)
      };
    case 'UPDATE_PLATFORM_SETTINGS':
      return { 
        ...state, 
        platformSettings: { ...state.platformSettings, ...action.payload }
      };
    case 'BULK_VERIFY_USERS':
      return {
        ...state,
        users: state.users.map(user => 
          action.payload.includes(user.id) 
            ? { ...user, verified: true }
            : user
        )
      };
    case 'SUSPEND_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload 
            ? { ...user, verified: false }
            : user
        )
      };
    case 'BROADCAST_ANNOUNCEMENT':
      // In a real app, this would send notifications to all users
      console.log('Broadcasting announcement:', action.payload);
      return state;
    case 'RESET_SETTINGS_TO_DEFAULT':
      return {
        ...state,
        platformSettings: {
          userRegistrationEnabled: true,
          emailNotificationsEnabled: true,
          autoApprovePromotions: false,
          maintenanceMode: false,
          commissionRate: 5,
          minimumOrderValue: 100,
          maxProductsPerWholesaler: 1000,
          supportResponseTime: 24,
          twoFactorRequired: false,
          dataEncryptionEnabled: true,
          auditLoggingEnabled: true
        }
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o)
      };
    case 'ADD_TICKET':
      return { ...state, tickets: [...state.tickets, action.payload] };
    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'ADD_PROMOTION':
      return { ...state, promotions: [...state.promotions, action.payload] };
    case 'UPDATE_PROMOTION':
      return {
        ...state,
        promotions: state.promotions.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'APPROVE_PROMOTION':
      return {
        ...state,
        promotions: state.promotions.map(p => 
          p.id === action.payload.id 
            ? { ...p, status: 'approved', active: true, reviewedAt: new Date().toISOString(), reviewedBy: action.payload.adminId }
            : p
        )
      };
    case 'REJECT_PROMOTION':
      return {
        ...state,
        promotions: state.promotions.map(p => 
          p.id === action.payload.id 
            ? { ...p, status: 'rejected', active: false, reviewedAt: new Date().toISOString(), reviewedBy: action.payload.adminId, rejectionReason: action.payload.reason }
            : p
        )
      };
    case 'ADD_RETURN_REQUEST':
      return { ...state, returnRequests: [...state.returnRequests, action.payload] };
    case 'UPDATE_RETURN_REQUEST':
      return {
        ...state,
        returnRequests: state.returnRequests.map(r => r.id === action.payload.id ? action.payload : r)
      };
    case 'APPROVE_RETURN_REQUEST':
      return {
        ...state,
        returnRequests: state.returnRequests.map(r => 
          r.id === action.payload.id 
            ? { 
                ...r, 
                status: 'approved', 
                approvedAmount: action.payload.approvedAmount,
                refundMethod: action.payload.refundMethod as any,
                processedBy: action.payload.supportId,
                processedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : r
        )
      };
    case 'REJECT_RETURN_REQUEST':
      return {
        ...state,
        returnRequests: state.returnRequests.map(r => 
          r.id === action.payload.id 
            ? { 
                ...r, 
                status: 'rejected', 
                rejectionReason: action.payload.reason,
                processedBy: action.payload.supportId,
                processedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : r
        )
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { 
    users: supabaseUsers, 
    products, 
    orders, 
    tickets, 
    promotions, 
    returnRequests, 
    pendingUsers, 
    loading, 
    error 
  } = useSupabaseData();

  // Update state with real data from Supabase
  const enhancedState = {
    ...state,
    users: error ? state.users : (supabaseUsers.length > 0 ? supabaseUsers : state.users),
    products: error ? state.products : (products.length > 0 ? products : state.products),
    orders: error ? state.orders : (orders.length > 0 ? orders : state.orders),
    tickets: error ? state.tickets : (tickets.length > 0 ? tickets : state.tickets),
    promotions: error ? state.promotions : (promotions.length > 0 ? promotions : state.promotions),
    returnRequests: error ? state.returnRequests : (returnRequests.length > 0 ? returnRequests : state.returnRequests),
    pendingUsers: error ? state.pendingUsers : (pendingUsers.length > 0 ? pendingUsers : state.pendingUsers),
    loading,
    error
  };

  // Enhanced dispatch that also updates Supabase
  const enhancedDispatch = async (action: AppAction) => {
    // First update local state for immediate UI feedback
    dispatch(action);
    
    try {
      switch (action.type) {
        case 'ADD_PRODUCT':
          await SupabaseService.createProduct(action.payload);
          break;
        case 'UPDATE_PRODUCT':
          await SupabaseService.updateProduct(action.payload.id, action.payload);
          break;
        case 'DELETE_PRODUCT':
          await SupabaseService.deleteProduct(action.payload);
          break;
        case 'ADD_ORDER':
          await SupabaseService.createOrder(action.payload);
          break;
        case 'UPDATE_ORDER':
          await SupabaseService.updateOrder(action.payload.id, action.payload);
          break;
        case 'ADD_TICKET':
          await SupabaseService.createSupportTicket(action.payload);
          break;
        case 'UPDATE_TICKET':
          await SupabaseService.updateSupportTicket(action.payload.id, action.payload);
          break;
        case 'ADD_PROMOTION':
          await SupabaseService.createPromotion(action.payload);
          break;
        case 'UPDATE_PROMOTION':
          await SupabaseService.updatePromotion(action.payload.id, action.payload);
          break;
        case 'APPROVE_PROMOTION':
          const promotion = enhancedState.promotions.find(p => p.id === action.payload.id);
          if (promotion) {
            await SupabaseService.updatePromotion(action.payload.id, {
              ...promotion,
              status: 'approved',
              active: true,
              reviewedAt: new Date().toISOString(),
              reviewedBy: action.payload.adminId
            });
          }
          break;
        case 'REJECT_PROMOTION':
          const rejectedPromotion = enhancedState.promotions.find(p => p.id === action.payload.id);
          if (rejectedPromotion) {
            await SupabaseService.updatePromotion(action.payload.id, {
              ...rejectedPromotion,
              status: 'rejected',
              active: false,
              reviewedAt: new Date().toISOString(),
              reviewedBy: action.payload.adminId,
              rejectionReason: action.payload.reason
            });
          }
          break;
        case 'ADD_RETURN_REQUEST':
          await SupabaseService.createReturnRequest(action.payload);
          break;
        case 'APPROVE_RETURN_REQUEST':
          const returnRequest = enhancedState.returnRequests.find(r => r.id === action.payload.id);
          if (returnRequest) {
            await SupabaseService.updateReturnRequest(action.payload.id, {
              ...returnRequest,
              status: 'approved',
              approvedAmount: action.payload.approvedAmount,
              refundMethod: action.payload.refundMethod as any,
              processedBy: action.payload.supportId,
              processedAt: new Date().toISOString()
            });
          }
          break;
        case 'REJECT_RETURN_REQUEST':
          const rejectedReturn = enhancedState.returnRequests.find(r => r.id === action.payload.id);
          if (rejectedReturn) {
            await SupabaseService.updateReturnRequest(action.payload.id, {
              ...rejectedReturn,
              status: 'rejected',
              rejectionReason: action.payload.reason,
              processedBy: action.payload.supportId,
              processedAt: new Date().toISOString()
            });
          }
          break;
        case 'APPROVE_USER':
          await SupabaseService.approvePendingUser(action.payload.pendingUserId, action.payload.adminId);
          break;
        case 'REJECT_USER':
          await SupabaseService.rejectPendingUser(action.payload.pendingUserId, action.payload.adminId, action.payload.reason);
          break;
        case 'ADD_PENDING_USER':
          await SupabaseService.createPendingUser(action.payload);
          break;
        // For other actions, they only update local state
      }
    } catch (error) {
      console.error('Error updating Supabase:', error);
      // The local state was already updated above for immediate feedback
    }
  };

  return (
    <AppContext.Provider value={{ state: enhancedState, dispatch: enhancedDispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}