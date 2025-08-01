/*
  # Seed Sample Data for NWI B2B Platform

  This migration populates the database with realistic sample data for testing and demonstration purposes.
  
  1. Sample Users (Admin, Support, Wholesaler, Retailer)
  2. Sample Products from wholesaler
  3. Sample Orders and Order Items
  4. Sample Support Tickets
  5. Sample Promotions
  6. Sample Return Requests
  7. Platform Settings
*/

-- Insert sample users
INSERT INTO users (id, name, email, role, business_name, phone, address, verified, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin User', 'admin@nwi.com', 'admin', 'NWI Platform', '+27-000-000-001', 'NWI Headquarters, Johannesburg', true, 'active', '2024-01-01T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440002', 'Support Agent', 'support@nwi.com', 'support', 'NWI Support', '+27-000-000-002', 'NWI Support Center, Cape Town', true, 'active', '2024-01-01T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440003', 'John Wholesaler', 'john@wholesale.com', 'wholesaler', 'Fresh Foods Wholesale', '+27-123-456-789', '123 Market Street, Johannesburg', true, 'active', '2024-01-15T00:00:00Z'),
('550e8400-e29b-41d4-a716-446655440004', 'Mary Retailer', 'mary@spaza.com', 'retailer', 'Mary''s Spaza Shop', '+27-987-654-321', '45 Township Road, Soweto', true, 'active', '2024-01-20T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample pending users
INSERT INTO pending_users (id, name, email, role, business_name, phone, address, registration_reason, documents, submitted_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah@freshmarket.co.za', 'retailer', 'Fresh Market Corner Store', '+27-111-222-333', '78 Main Road, Cape Town', 'Looking to expand our product range and establish wholesale partnerships for better pricing.', ARRAY['business_license.pdf', 'tax_certificate.pdf'], '2024-01-25T10:30:00Z'),
('650e8400-e29b-41d4-a716-446655440002', 'David Wholesale Co', 'david@bulkgoods.co.za', 'wholesaler', 'Bulk Goods Distribution', '+27-444-555-666', '156 Industrial Avenue, Durban', 'Established wholesale business seeking to expand our retail network through digital platform.', ARRAY['wholesale_license.pdf', 'vat_registration.pdf', 'warehouse_certificate.pdf'], '2024-01-24T14:15:00Z'),
('650e8400-e29b-41d4-a716-446655440003', 'Lisa Community Store', 'lisa@communitystore.co.za', 'retailer', 'Community General Store', '+27-777-888-999', '23 Township Street, Pretoria', 'Community store serving local township, need access to wholesale prices to serve community better.', ARRAY[]::text[], '2024-01-23T09:45:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, wholesaler_id, name, description, price, stock, min_order_quantity, category, image_url, available, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Coca-Cola 330ml Cans (24 Pack)', 'Classic Coca-Cola in 330ml cans, case of 24 units', 240.00, 500, 10, 'Beverages', 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Lay''s Potato Chips 120g (12 Pack)', 'Original flavor Lay''s potato chips, 120g bags, case of 12', 180.00, 300, 5, 'Snacks', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Maggi 2-Minute Noodles (24 Pack)', 'Chicken flavor instant noodles, 73g each, case of 24', 120.00, 400, 12, 'Instant Foods', 'https://images.pexels.com/photos/6287284/pexels-photo-6287284.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Sunlight Dishwashing Liquid 750ml (12 Pack)', 'Sunlight dishwashing liquid, 750ml bottles, case of 12', 360.00, 150, 6, 'Household', 'https://images.pexels.com/photos/4107845/pexels-photo-4107845.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'Simba Chips Assorted 36g (24 Pack)', 'Mixed flavors Simba chips, 36g bags, case of 24', 144.00, 250, 8, 'Snacks', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'Fanta Orange 500ml (12 Pack)', 'Fanta Orange soft drink, 500ml bottles, case of 12', 156.00, 200, 6, 'Beverages', 'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Omo Washing Powder 2kg (6 Pack)', 'Omo auto washing powder, 2kg boxes, case of 6', 480.00, 100, 3, 'Household', 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Knorr Soup 50g (20 Pack)', 'Chicken noodle soup sachets, 50g each, case of 20', 100.00, 300, 10, 'Instant Foods', 'https://images.pexels.com/photos/6287339/pexels-photo-6287339.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (id, retailer_id, wholesaler_id, total, status, payment_status, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 3300.00, 'pending', 'pending', '2024-01-22T10:00:00Z', '2024-01-22T10:00:00Z'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 1440.00, 'ready', 'paid', '2024-01-20T14:30:00Z', '2024-01-21T09:15:00Z'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 2160.00, 'completed', 'paid', '2024-01-18T11:20:00Z', '2024-01-19T16:45:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price, total, created_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Coca-Cola 330ml Cans (24 Pack)', 10, 240.00, 2400.00, '2024-01-22T10:00:00Z'),
('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'Lay''s Potato Chips 120g (12 Pack)', 5, 180.00, 900.00, '2024-01-22T10:00:00Z'),
('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', 'Maggi 2-Minute Noodles (24 Pack)', 12, 120.00, 1440.00, '2024-01-20T14:30:00Z'),
('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440004', 'Sunlight Dishwashing Liquid 750ml (12 Pack)', 6, 360.00, 2160.00, '2024-01-18T11:20:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample support tickets
INSERT INTO support_tickets (id, user_id, user_name, subject, description, status, priority, created_at, updated_at, assigned_to) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Mary Retailer', 'Payment Issue', 'Unable to complete payment for order. Payment gateway shows error.', 'open', 'high', '2024-01-22T15:30:00Z', '2024-01-22T15:30:00Z', NULL),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Mary Retailer', 'Product Quality Issue', 'Received damaged Coca-Cola cans in last order. Need replacement.', 'in_progress', 'medium', '2024-01-21T12:15:00Z', '2024-01-22T08:45:00Z', '550e8400-e29b-41d4-a716-446655440002'),
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'John Wholesaler', 'Stock Update Issue', 'Unable to update stock levels for multiple products.', 'resolved', 'low', '2024-01-19T09:30:00Z', '2024-01-20T14:20:00Z', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample promotions
INSERT INTO promotions (id, wholesaler_id, title, description, discount, valid_from, valid_to, active, product_ids, status, submitted_at, reviewed_at, reviewed_by, created_at, updated_at) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Beverage Bundle Deal', '15% off when you buy 20+ cases of any beverages', 15.00, '2024-01-20T00:00:00Z', '2024-02-20T23:59:59Z', true, ARRAY['750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440006'], 'approved', '2024-01-20T10:00:00Z', '2024-01-20T11:30:00Z', '550e8400-e29b-41d4-a716-446655440001', '2024-01-20T10:00:00Z', '2024-01-20T11:30:00Z'),
('b50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Snack Attack Special', '10% off all snack products for bulk orders', 10.00, '2024-01-15T00:00:00Z', '2024-02-15T23:59:59Z', true, ARRAY['750e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005'], 'approved', '2024-01-15T14:00:00Z', '2024-01-15T15:45:00Z', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15T14:00:00Z', '2024-01-15T15:45:00Z'),
('b50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Household Essentials Promo', '20% off household cleaning products', 20.00, '2024-01-25T00:00:00Z', '2024-02-25T23:59:59Z', false, ARRAY['750e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440007'], 'pending', '2024-01-25T16:20:00Z', NULL, NULL, '2024-01-25T16:20:00Z', '2024-01-25T16:20:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample return requests
INSERT INTO return_requests (id, order_id, retailer_id, wholesaler_id, reason, description, status, priority, requested_amount, approved_amount, images, processed_by, processed_at, refund_method, created_at, updated_at) VALUES
('c50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'damaged_goods', 'Received damaged Sunlight dishwashing liquid bottles. 3 out of 12 bottles were cracked and leaking.', 'pending', 'high', 90.00, NULL, ARRAY['https://images.pexels.com/photos/4107845/pexels-photo-4107845.jpeg'], NULL, NULL, NULL, '2024-01-23T13:45:00Z', '2024-01-23T13:45:00Z'),
('c50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'wrong_quantity', 'Ordered 10 cases of Coca-Cola but only received 8 cases. Missing 2 cases from the shipment.', 'approved', 'medium', 480.00, 480.00, ARRAY[]::text[], '550e8400-e29b-41d4-a716-446655440002', '2024-01-22T16:30:00Z', 'original_payment', '2024-01-21T11:20:00Z', '2024-01-22T16:30:00Z'),
('c50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'quality_issue', 'Maggi noodles have expired dates. All 24 packs show expiry date of last month.', 'processing', 'urgent', 1440.00, 1440.00, ARRAY[]::text[], '550e8400-e29b-41d4-a716-446655440002', '2024-01-22T10:15:00Z', 'store_credit', '2024-01-20T17:30:00Z', '2024-01-23T09:20:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample return items
INSERT INTO return_items (id, return_request_id, product_id, product_name, quantity, reason, condition, unit_price, total_refund, created_at) VALUES
('d50e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', 'Sunlight Dishwashing Liquid 750ml', 3, 'Bottles arrived cracked and leaking', 'damaged', 30.00, 90.00, '2024-01-23T13:45:00Z'),
('d50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Coca-Cola 330ml Cans (24 Pack)', 2, 'Missing from shipment', 'not_as_described', 240.00, 480.00, '2024-01-21T11:20:00Z'),
('d50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'Maggi 2-Minute Noodles (24 Pack)', 12, 'Expired products received', 'defective', 120.00, 1440.00, '2024-01-20T17:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert platform settings
INSERT INTO platform_settings (id, key, value, description, updated_by, updated_at) VALUES
('e50e8400-e29b-41d4-a716-446655440001', 'user_registration_enabled', 'true', 'Allow new user registrations', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z'),
('e50e8400-e29b-41d4-a716-446655440002', 'email_notifications_enabled', 'true', 'Send email notifications to users', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z'),
('e50e8400-e29b-41d4-a716-446655440003', 'auto_approve_promotions', 'false', 'Automatically approve promotion requests', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z'),
('e50e8400-e29b-41d4-a716-446655440004', 'maintenance_mode', 'false', 'Enable maintenance mode', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z'),
('e50e8400-e29b-41d4-a716-446655440005', 'commission_rate', '5.0', 'Platform commission rate percentage', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z'),
('e50e8400-e29b-41d4-a716-446655440006', 'minimum_order_value', '100.0', 'Minimum order value in currency', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z'),
('e50e8400-e29b-41d4-a716-446655440007', 'max_products_per_wholesaler', '1000', 'Maximum products per wholesaler', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z'),
('e50e8400-e29b-41d4-a716-446655440008', 'support_response_time', '24', 'Target support response time in hours', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;