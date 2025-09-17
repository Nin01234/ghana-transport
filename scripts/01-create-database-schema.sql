-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
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
CREATE TABLE IF NOT EXISTS public.routes (
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
CREATE TABLE IF NOT EXISTS public.bus_operators (
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
CREATE TABLE IF NOT EXISTS public.buses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    operator_id UUID REFERENCES public.bus_operators(id) ON DELETE CASCADE,
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
    bus_number TEXT UNIQUE NOT NULL,
    license_plate TEXT UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    bus_type TEXT CHECK (bus_type IN ('standard', 'luxury', 'vip')),
    amenities TEXT[] DEFAULT '{}',
    current_location JSONB,
    status TEXT CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
    last_maintenance_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
    bus_id UUID REFERENCES public.buses(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    travel_date TIMESTAMP WITH TIME ZONE NOT NULL,
    fare_amount DECIMAL(8,2) NOT NULL,
    payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    booking_status TEXT CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')) DEFAULT 'confirmed',
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    payment_method TEXT,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create push_subscriptions table for notifications
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, endpoint)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_routes_origin_destination ON public.routes(origin, destination);
CREATE INDEX IF NOT EXISTS idx_buses_operator_id ON public.buses(operator_id);
CREATE INDEX IF NOT EXISTS idx_buses_route_id ON public.buses(route_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON public.bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bus_operators_updated_at BEFORE UPDATE ON public.bus_operators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON public.buses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
