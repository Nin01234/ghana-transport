-- Insert sample bus operators
INSERT INTO public.bus_operators (id, name, contact_email, contact_phone, license_number, is_verified, rating, total_ratings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'VIP Transport', 'info@viptransport.com', '+233302123456', 'OP001', true, 4.8, 150),
('550e8400-e29b-41d4-a716-446655440002', 'Metro Mass Transit', 'contact@metromass.com', '+233302234567', 'OP002', true, 4.6, 200),
('550e8400-e29b-41d4-a716-446655440003', 'STC Coaches', 'support@stccoaches.com', '+233302345678', 'OP003', true, 4.7, 180),
('550e8400-e29b-41d4-a716-446655440004', 'Eastern Transport', 'info@easterntransport.com', '+233302456789', 'OP004', true, 4.5, 120),
('550e8400-e29b-41d4-a716-446655440005', 'Western Express', 'contact@westernexpress.com', '+233302567890', 'OP005', true, 4.4, 100)
ON CONFLICT (id) DO NOTHING;

-- Insert sample routes
INSERT INTO public.routes (id, name, origin, destination, distance_km, duration_minutes, base_fare, description, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Accra Express', 'Accra', 'Kumasi', 250.0, 270, 180.00, 'Direct route from Accra to Kumasi with comfort stops', true),
('660e8400-e29b-41d4-a716-446655440002', 'Northern Link', 'Accra', 'Tamale', 600.0, 495, 340.00, 'Long distance route to Northern Ghana', true),
('660e8400-e29b-41d4-a716-446655440003', 'Coastal Cruiser', 'Accra', 'Cape Coast', 165.0, 165, 140.00, 'Scenic coastal route to Cape Coast', true),
('660e8400-e29b-41d4-a716-446655440004', 'Eastern Express', 'Accra', 'Ho', 180.0, 200, 160.00, 'Route to Volta Region capital', true),
('660e8400-e29b-41d4-a716-446655440005', 'Western Route', 'Accra', 'Takoradi', 230.0, 250, 200.00, 'Route to Western Region', true),
('660e8400-e29b-41d4-a716-446655440006', 'Brong Ahafo Express', 'Kumasi', 'Sunyani', 120.0, 150, 120.00, 'Inter-regional route', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample buses
INSERT INTO public.buses (id, operator_id, route_id, bus_number, license_plate, capacity, bus_type, amenities, current_location, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'GT-001', 'GR-1234-20', 45, 'luxury', '{"WiFi", "AC", "Charging Port", "Refreshments"}', '{"lat": 5.6037, "lng": -0.1969, "address": "Accra Central"}', 'active'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'GT-002', 'GR-2345-20', 50, 'vip', '{"WiFi", "AC", "Meals", "Entertainment"}', '{"lat": 6.6885, "lng": -1.6244, "address": "Kumasi Station"}', 'active'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'GT-003', 'GR-3456-20', 40, 'standard', '{"AC", "Charging Port"}', '{"lat": 5.1053, "lng": -1.2466, "address": "Cape Coast Terminal"}', 'active'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'GT-004', 'GR-4567-20', 42, 'luxury', '{"AC", "WiFi", "Charging Port"}', '{"lat": 6.611, "lng": 0.472, "address": "Ho Station"}', 'active'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'GT-005', 'GR-5678-20', 48, 'luxury', '{"AC", "WiFi", "Refreshments"}', '{"lat": 4.8974, "lng": -1.7533, "address": "Takoradi Terminal"}', 'active'),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', 'GT-006', 'GR-6789-20', 40, 'standard', '{"AC", "Charging Port"}', '{"lat": 7.3386, "lng": -2.3265, "address": "Sunyani Station"}', 'active')
ON CONFLICT (id) DO NOTHING;
