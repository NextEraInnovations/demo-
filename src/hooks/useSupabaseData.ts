import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Product, Order, SupportTicket, Promotion, ReturnRequest, PendingUser } from '../types';

export function useSupabaseData() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform database row to application type
  const transformUser = (row: any): User => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    businessName: row.business_name,
    phone: row.phone,
    address: row.address,
    verified: row.verified,
    status: row.status,
    createdAt: row.created_at
  });

  const transformProduct = (row: any): Product => ({
    id: row.id,
    wholesalerId: row.wholesaler_id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    stock: row.stock,
    minOrderQuantity: row.min_order_quantity,
    category: row.category,
    imageUrl: row.image_url || '',
    available: row.available,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });

  const transformOrder = (row: any, items: any[]): Order => ({
    id: row.id,
    retailerId: row.retailer_id,
    wholesalerId: row.wholesaler_id,
    items: items.map(item => ({
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      price: parseFloat(item.price),
      total: parseFloat(item.total)
    })),
    total: parseFloat(row.total),
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pickupTime: row.pickup_time,
    notes: row.notes
  });

  const transformTicket = (row: any): SupportTicket => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    subject: row.subject,
    description: row.description,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assignedTo: row.assigned_to
  });

  const transformPromotion = (row: any): Promotion => ({
    id: row.id,
    wholesalerId: row.wholesaler_id,
    title: row.title,
    description: row.description,
    discount: parseFloat(row.discount),
    validFrom: row.valid_from,
    validTo: row.valid_to,
    active: row.active,
    productIds: row.product_ids || [],
    status: row.status,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    reviewedBy: row.reviewed_by,
    rejectionReason: row.rejection_reason
  });

  const transformReturnRequest = (row: any, items: any[]): ReturnRequest => ({
    id: row.id,
    orderId: row.order_id,
    retailerId: row.retailer_id,
    wholesalerId: row.wholesaler_id,
    reason: row.reason,
    description: row.description,
    status: row.status,
    priority: row.priority,
    requestedAmount: parseFloat(row.requested_amount),
    approvedAmount: row.approved_amount ? parseFloat(row.approved_amount) : undefined,
    items: items.map(item => ({
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      reason: item.reason,
      condition: item.condition,
      unitPrice: parseFloat(item.unit_price),
      totalRefund: parseFloat(item.total_refund)
    })),
    images: row.images || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    processedBy: row.processed_by,
    processedAt: row.processed_at,
    rejectionReason: row.rejection_reason,
    refundMethod: row.refund_method,
    trackingNumber: row.tracking_number
  });

  const transformPendingUser = (row: any): PendingUser => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    businessName: row.business_name,
    phone: row.phone,
    address: row.address,
    registrationReason: row.registration_reason,
    submittedAt: row.submitted_at,
    documents: row.documents || []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        usersResult,
        productsResult,
        ordersResult,
        orderItemsResult,
        ticketsResult,
        promotionsResult,
        returnRequestsResult,
        returnItemsResult,
        pendingUsersResult
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('products').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('order_items').select('*'),
        supabase.from('support_tickets').select('*'),
        supabase.from('promotions').select('*'),
        supabase.from('return_requests').select('*'),
        supabase.from('return_items').select('*'),
        supabase.from('pending_users').select('*')
      ]);

      // Check for errors
      if (usersResult.error) throw usersResult.error;
      if (productsResult.error) throw productsResult.error;
      if (ordersResult.error) throw ordersResult.error;
      if (orderItemsResult.error) throw orderItemsResult.error;
      if (ticketsResult.error) throw ticketsResult.error;
      if (promotionsResult.error) throw promotionsResult.error;
      if (returnRequestsResult.error) throw returnRequestsResult.error;
      if (returnItemsResult.error) throw returnItemsResult.error;
      if (pendingUsersResult.error) throw pendingUsersResult.error;

      // Transform and set data
      setUsers(usersResult.data?.map(transformUser) || []);
      setProducts(productsResult.data?.map(transformProduct) || []);
      setTickets(ticketsResult.data?.map(transformTicket) || []);
      setPromotions(promotionsResult.data?.map(transformPromotion) || []);
      setPendingUsers(pendingUsersResult.data?.map(transformPendingUser) || []);

      // Transform orders with their items
      const ordersWithItems = ordersResult.data?.map(order => {
        const orderItems = orderItemsResult.data?.filter(item => item.order_id === order.id) || [];
        return transformOrder(order, orderItems);
      }) || [];
      setOrders(ordersWithItems);

      // Transform return requests with their items
      const returnRequestsWithItems = returnRequestsResult.data?.map(returnReq => {
        const returnItems = returnItemsResult.data?.filter(item => item.return_request_id === returnReq.id) || [];
        return transformReturnRequest(returnReq, returnItems);
      }) || [];
      setReturnRequests(returnRequestsWithItems);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const channels = [
      supabase.channel('users').on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchData),
      supabase.channel('products').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData),
      supabase.channel('orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchData),
      supabase.channel('order_items').on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, fetchData),
      supabase.channel('support_tickets').on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, fetchData),
      supabase.channel('promotions').on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, fetchData),
      supabase.channel('return_requests').on('postgres_changes', { event: '*', schema: 'public', table: 'return_requests' }, fetchData),
      supabase.channel('return_items').on('postgres_changes', { event: '*', schema: 'public', table: 'return_items' }, fetchData),
      supabase.channel('pending_users').on('postgres_changes', { event: '*', schema: 'public', table: 'pending_users' }, fetchData)
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  return {
    users,
    products,
    orders,
    tickets,
    promotions,
    returnRequests,
    pendingUsers,
    loading,
    error,
    refetch: fetchData
  };
}