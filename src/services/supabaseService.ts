import { supabase } from '../lib/supabase';
import { User, Product, Order, OrderItem, SupportTicket, Promotion, ReturnRequest, ReturnItem, PendingUser } from '../types';

export class SupabaseService {
  // User operations
  static async createUser(user: Omit<User, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        role: user.role,
        business_name: user.businessName,
        phone: user.phone,
        address: user.address,
        verified: user.verified,
        status: user.status
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        email: updates.email,
        role: updates.role,
        business_name: updates.businessName,
        phone: updates.phone,
        address: updates.address,
        verified: updates.verified,
        status: updates.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Product operations
  static async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        wholesaler_id: product.wholesalerId,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        min_order_quantity: product.minOrderQuantity,
        category: product.category,
        image_url: product.imageUrl,
        available: product.available
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        stock: updates.stock,
        min_order_quantity: updates.minOrderQuantity,
        category: updates.category,
        image_url: updates.imageUrl,
        available: updates.available
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Order operations
  static async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        retailer_id: order.retailerId,
        wholesaler_id: order.wholesalerId,
        total: order.total,
        status: order.status,
        payment_status: order.paymentStatus,
        pickup_time: order.pickupTime,
        notes: order.notes
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return orderData;
  }

  static async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: updates.status,
        payment_status: updates.paymentStatus,
        pickup_time: updates.pickupTime,
        notes: updates.notes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Support ticket operations
  static async createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: ticket.userId,
        user_name: ticket.userName,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assignedTo
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSupportTicket(id: string, updates: Partial<SupportTicket>) {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({
        subject: updates.subject,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assigned_to: updates.assignedTo
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Promotion operations
  static async createPromotion(promotion: Omit<Promotion, 'id' | 'submittedAt'>) {
    const { data, error } = await supabase
      .from('promotions')
      .insert({
        wholesaler_id: promotion.wholesalerId,
        title: promotion.title,
        description: promotion.description,
        discount: promotion.discount,
        valid_from: promotion.validFrom,
        valid_to: promotion.validTo,
        active: promotion.active,
        product_ids: promotion.productIds,
        status: promotion.status
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePromotion(id: string, updates: Partial<Promotion>) {
    const { data, error } = await supabase
      .from('promotions')
      .update({
        title: updates.title,
        description: updates.description,
        discount: updates.discount,
        valid_from: updates.validFrom,
        valid_to: updates.validTo,
        active: updates.active,
        product_ids: updates.productIds,
        status: updates.status,
        reviewed_at: updates.reviewedAt,
        reviewed_by: updates.reviewedBy,
        rejection_reason: updates.rejectionReason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Return request operations
  static async createReturnRequest(returnRequest: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data: returnData, error: returnError } = await supabase
      .from('return_requests')
      .insert({
        order_id: returnRequest.orderId,
        retailer_id: returnRequest.retailerId,
        wholesaler_id: returnRequest.wholesalerId,
        reason: returnRequest.reason,
        description: returnRequest.description,
        status: returnRequest.status,
        priority: returnRequest.priority,
        requested_amount: returnRequest.requestedAmount,
        images: returnRequest.images
      })
      .select()
      .single();

    if (returnError) throw returnError;

    // Insert return items
    const returnItems = returnRequest.items.map(item => ({
      return_request_id: returnData.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      reason: item.reason,
      condition: item.condition,
      unit_price: item.unitPrice,
      total_refund: item.totalRefund
    }));

    const { error: itemsError } = await supabase
      .from('return_items')
      .insert(returnItems);

    if (itemsError) throw itemsError;

    return returnData;
  }

  static async updateReturnRequest(id: string, updates: Partial<ReturnRequest>) {
    const { data, error } = await supabase
      .from('return_requests')
      .update({
        status: updates.status,
        approved_amount: updates.approvedAmount,
        processed_by: updates.processedBy,
        processed_at: updates.processedAt,
        rejection_reason: updates.rejectionReason,
        refund_method: updates.refundMethod,
        tracking_number: updates.trackingNumber
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Pending user operations
  static async createPendingUser(pendingUser: Omit<PendingUser, 'id' | 'submittedAt'>) {
    const { data, error } = await supabase
      .from('pending_users')
      .insert({
        name: pendingUser.name,
        email: pendingUser.email,
        role: pendingUser.role,
        business_name: pendingUser.businessName,
        phone: pendingUser.phone,
        address: pendingUser.address,
        registration_reason: pendingUser.registrationReason,
        documents: pendingUser.documents
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async approvePendingUser(pendingUserId: string, adminId: string) {
    // Get pending user data
    const { data: pendingUser, error: fetchError } = await supabase
      .from('pending_users')
      .select('*')
      .eq('id', pendingUserId)
      .single();

    if (fetchError) throw fetchError;

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        name: pendingUser.name,
        email: pendingUser.email,
        role: pendingUser.role,
        business_name: pendingUser.business_name,
        phone: pendingUser.phone,
        address: pendingUser.address,
        verified: true,
        status: 'active'
      })
      .select()
      .single();

    if (createError) throw createError;

    // Update pending user status
    const { error: updateError } = await supabase
      .from('pending_users')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId
      })
      .eq('id', pendingUserId);

    if (updateError) throw updateError;

    return newUser;
  }

  static async rejectPendingUser(pendingUserId: string, adminId: string, reason: string) {
    const { error } = await supabase
      .from('pending_users')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
        rejection_reason: reason
      })
      .eq('id', pendingUserId);

    if (error) throw error;
  }

  // Platform settings operations
  static async getPlatformSettings() {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*');

    if (error) throw error;
    
    // Convert to key-value object
    const settings: Record<string, any> = {};
    data?.forEach(setting => {
      settings[setting.key] = setting.value;
    });
    
    return settings;
  }

  static async updatePlatformSetting(key: string, value: any, updatedBy: string) {
    const { error } = await supabase
      .from('platform_settings')
      .upsert({
        key,
        value,
        updated_by: updatedBy
      });

    if (error) throw error;
  }
}