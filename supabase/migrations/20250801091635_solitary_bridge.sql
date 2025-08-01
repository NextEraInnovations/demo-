/*
  # Seed Initial Data for NWI B2B Platform

  1. Initial Users
    - Create admin, support, wholesaler, and retailer accounts
    - Set up proper authentication and roles

  2. Sample Products
    - Add initial product catalog from wholesalers
    - Include various categories and pricing

  3. Sample Data
    - Create sample orders, tickets, and promotions
    - Populate with realistic business data
*/

-- Insert initial users (these will be created through Supabase Auth)
-- Note: In production, users would register through the auth system
-- This is sample data for development/demo purposes

INSERT INTO users (id, name, email, role, business_name, phone, address, verified, status, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John Wholesaler', 'john@wholesale.com', 'wholesaler', 'Fresh Foods Wholesale', '+27-123-456-789', '123 Market Street, Johannesburg', true, 'active', '2024-01-15T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mary Retailer', 'mary@spaza.com', 'retailer', 'Mary''s Spaza Shop', '+27-987-654-321', '45 Township Road, Soweto', true, 'active', '2024-01-20T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Admin User', 'admin@nwi.com', 'admin', null, null, null, true, 'active', '2024-01-01T00:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Support Agent', 'support@nwi.com', 'support', null, null, null, true, 'active', '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, wholesaler_id, name, description, price, stock, min_order_quantity, category, image_url, available, created_at, updated_at) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Coca-Cola 330ml Cans (24 Pack)', 'Classic Coca-Cola in 330ml cans, case of 24 units', 240.00, 500, 10, 'Beverages', 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Lay''s Potato Chips 120g (12 Pack)', 'Original flavor Lay''s potato chips, 120g bags, case of 12', 180.00, 300, 5, 'Snacks', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Maggi 2-Minute Noodles (24 Pack)', 'Chicken flavor instant noodles, 73g each, case of 24', 120.00, 400, 12, 'Instant Foods', 'https://images.pexels.com/photos/6287284/pexels-photo-6287284.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Sunlight Dishwashing Liquid 750ml (12 Pack)', 'Sunlight dishwashing liquid, 750ml bottles, case of 12', 360.00, 150, 6, 'Household', 'https://images.pexels.com/photos/4107845/pexels-photo-4107845.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Simba Chips Assorted 36g (24 Pack)', 'Mixed flavors Simba chips, 36g bags, case of 24', 144.00, 250, 8, 'Snacks', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
  ('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Fanta Orange 500ml (12 Pack)', 'Fanta Orange soft drink, 500ml bottles, case of 12', 156.00, 200, 6, 'Beverages', 'https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
  ('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Omo Washing Powder 2kg (6 Pack)', 'Omo auto washing powder, 2kg boxes, case of 6', 480.00, 100, 3, 'Household', 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z'),
  ('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', 'Knorr Soup 50g (20 Pack)', 'Chicken noodle soup sachets, 50g each, case of 20', 100.00, 300, 10, 'Instant Foods', 'https://images.pexels.com/photos/6287339/pexels-photo-6287339.jpeg', true, '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (id, retailer_id, wholesaler_id, total, status, payment_status, created_at, updated_at) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 3300.00, 'pending', 'pending', '2024-01-22T00:00:00Z', '2024-01-22T00:00:00Z'),
  ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 1440.00, 'ready', 'paid', '2024-01-20T00:00:00Z', '2024-01-21T00:00:00Z'),
  ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 2160.00, 'completed', 'paid', '2024-01-18T00:00:00Z', '2024-01-19T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample order items
INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price, total) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Coca-Cola 330ml Cans (24 Pack)', 10, 240.00, 2400.00),
  ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'Lay''s Potato Chips 120g (12 Pack)', 5, 180.00, 900.00),
  ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 'Maggi 2-Minute Noodles (24 Pack)', 12, 120.00, 1440.00),
  ('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', 'Sunlight Dishwashing Liquid 750ml (12 Pack)', 6, 360.00, 2160.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample support tickets
INSERT INTO support_tickets (id, user_id, user_name, subject, description, status, priority, created_at, updated_at, assigned_to) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Mary Retailer', 'Payment Issue', 'Unable to complete payment for order. Payment gateway shows error.', 'open', 'high', '2024-01-22T00:00:00Z', '2024-01-22T00:00:00Z', null),
  ('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Mary Retailer', 'Product Quality Issue', 'Received damaged Coca-Cola cans in last order. Need replacement.', 'in_progress', 'medium', '2024-01-21T00:00:00Z', '2024-01-22T00:00:00Z', '550e8400-e29b-41d4-a716-446655440004'),
  ('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'John Wholesaler', 'Stock Update Issue', 'Unable to update stock levels for multiple products.', 'resolved', 'low', '2024-01-19T00:00:00Z', '2024-01-20T00:00:00Z', '550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;

-- Insert sample promotions
INSERT INTO promotions (id, wholesaler_id, title, description, discount, valid_from, valid_to, active, product_ids, status, submitted_at, reviewed_at, reviewed_by) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Beverage Bundle Deal', '15% off when you buy 20+ cases of any beverages', 15.00, '2024-01-20T00:00:00Z', '2024-02-20T00:00:00Z', true, ARRAY['650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440006'], 'approved', '2024-01-20T00:00:00Z', '2024-01-20T00:00:00Z', '550e8400-e29b-41d4-a716-446655440003'),
  ('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Snack Attack Special', '10% off all snack products for bulk orders', 10.00, '2024-01-15T00:00:00Z', '2024-02-15T00:00:00Z', true, ARRAY['650e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005'], 'approved', '2024-01-15T00:00:00Z', '2024-01-15T00:00:00Z', '550e8400-e29b-41d4-a716-446655440003'),
  ('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Household Essentials Promo', '20% off household cleaning products', 20.00, '2024-01-25T00:00:00Z', '2024-02-25T00:00:00Z', false, ARRAY['650e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440007'], 'pending', '2024-01-25T00:00:00Z', null, null)
ON CONFLICT (id) DO NOTHING;

-- Insert sample return requests
INSERT INTO return_requests (id, order_id, retailer_id, wholesaler_id, reason, description, status, priority, requested_amount, approved_amount, processed_by, processed_at, refund_method, created_at, updated_at) VALUES
  ('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'damaged_goods', 'Received damaged Sunlight dishwashing liquid bottles. 3 out of 12 bottles were cracked and leaking.', 'pending', 'high', 90.00, null, null, null, null, '2024-01-23T00:00:00Z', '2024-01-23T00:00:00Z'),
  ('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'wrong_quantity', 'Ordered 10 cases of Coca-Cola but only received 8 cases. Missing 2 cases from the shipment.', 'approved', 'medium', 480.00, 480.00, '550e8400-e29b-41d4-a716-446655440004', '2024-01-22T00:00:00Z', 'original_payment', '2024-01-21T00:00:00Z', '2024-01-22T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Insert sample return items
INSERT INTO return_items (id, return_request_id, product_id, product_name, quantity, reason, condition, unit_price, total_refund) VALUES
  ('c50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 'Sunlight Dishwashing Liquid 750ml', 3, 'Bottles arrived cracked and leaking', 'damaged', 30.00, 90.00),
  ('c50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Coca-Cola 330ml Cans (24 Pack)', 2, 'Missing from shipment', 'not_as_described', 240.00, 480.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample pending users
INSERT INTO pending_users (id, name, email, role, business_name, phone, address, registration_reason, documents, submitted_at) VALUES
  ('d50e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah@freshmarket.co.za', 'retailer', 'Fresh Market Corner Store', '+27-111-222-333', '78 Main Road, Cape Town', 'Looking to expand our product range and establish wholesale partnerships for better pricing.', ARRAY['business_license.pdf', 'tax_certificate.pdf'], '2024-01-25T00:00:00Z'),
  ('d50e8400-e29b-41d4-a716-446655440002', 'David Wholesale Co', 'david@bulkgoods.co.za', 'wholesaler', 'Bulk Goods Distribution', '+27-444-555-666', '156 Industrial Avenue, Durban', 'Established wholesale business seeking to expand our retail network through digital platform.', ARRAY['wholesale_license.pdf', 'vat_registration.pdf', 'warehouse_certificate.pdf'], '2024-01-24T00:00:00Z'),
  ('d50e8400-e29b-41d4-a716-446655440003', 'Lisa Community Store', 'lisa@communitystore.co.za', 'retailer', 'Community General Store', '+27-777-888-999', '23 Township Street, Pretoria', 'Community store serving local township, need access to wholesale prices to serve community better.', ARRAY[], '2024-01-23T00:00:00Z')
ON CONFLICT (id) DO NOTHING;