-- Create database schema for GhanaTransit

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    preferred_language TEXT DEFAULT 'en',
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    loyalty_points INTEGER DEFAULT 0,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    distance_km DECIMAL(8,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    base_fare DECIMAL(8,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bus_operators table
CREATE TABLE IF NOT EXISTS bus_operators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    license_number TEXT UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    operator_id UUID REFERENCES bus_operators(id) ON DELETE CASCADE,
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    bus_number TEXT UNIQUE NOT NULL,
    license_plate TEXT UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    bus_type TEXT CHECK (bus_type IN ('standard', 'luxury', 'vip')),
    amenities TEXT[], -- Array of amenities like ['wifi', 'ac', 'charging_port']
    current_location JSONB, -- Store lat/lng coordinates
    status TEXT CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
    last_maintenance_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    days_of_week INTEGER[] NOT NULL, -- Array of day numbers (0=Sunday, 1=Monday, etc.)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
    booking_reference TEXT UNIQUE NOT NULL,
    passenger_name TEXT NOT NULL,
    passenger_phone TEXT NOT NULL,
    seat_number TEXT,
    booking_date DATE NOT NULL,
    fare_amount DECIMAL(8,2) NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    booking_status TEXT CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('mobile_money', 'card', 'wallet', 'cash')),
    payment_reference TEXT UNIQUE,
    provider_reference TEXT,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('booking', 'payment', 'schedule', 'promotion', 'system')) DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB, -- Additional data for the notification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create push_subscriptions table for web push notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, endpoint)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_routes_origin_destination ON routes(origin, destination);
CREATE INDEX IF NOT EXISTS idx_buses_operator_route ON buses(operator_id, route_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON bookings(user_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_bus_date ON bookings(bus_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_schedules_bus_active ON schedules(bus_id, is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bus_operators_updated_at BEFORE UPDATE ON bus_operators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
