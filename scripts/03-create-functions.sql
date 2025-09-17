-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user profile with stats
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_bookings', COALESCE(booking_count, 0),
        'wallet_balance', COALESCE(p.wallet_balance, 0),
        'loyalty_points', COALESCE(p.loyalty_points, 0),
        'upcoming_trips', COALESCE(upcoming_count, 0)
    ) INTO result
    FROM public.profiles p
    LEFT JOIN (
        SELECT 
            user_id,
            COUNT(*) as booking_count,
            COUNT(CASE WHEN travel_date > NOW() THEN 1 END) as upcoming_count
        FROM public.bookings 
        WHERE user_id = user_uuid AND booking_status != 'cancelled'
        GROUP BY user_id
    ) b ON p.id = b.user_id
    WHERE p.id = user_uuid;
    
    RETURN COALESCE(result, '{"total_bookings": 0, "wallet_balance": 0, "loyalty_points": 0, "upcoming_trips": 0}'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
    user_uuid UUID,
    amount DECIMAL(10,2),
    transaction_desc TEXT,
    payment_method_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance DECIMAL(10,2);
    transaction_type TEXT;
BEGIN
    -- Get current balance
    SELECT wallet_balance INTO current_balance
    FROM public.profiles
    WHERE id = user_uuid;
    
    -- Determine transaction type
    IF amount > 0 THEN
        transaction_type := 'credit';
    ELSE
        transaction_type := 'debit';
    END IF;
    
    -- Check if user has sufficient balance for debit
    IF transaction_type = 'debit' AND current_balance + amount < 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Update wallet balance
    UPDATE public.profiles
    SET wallet_balance = wallet_balance + amount,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Create transaction record
    INSERT INTO public.transactions (
        user_id,
        transaction_type,
        amount,
        description,
        payment_method,
        status
    ) VALUES (
        user_uuid,
        transaction_type,
        ABS(amount),
        transaction_desc,
        payment_method_param,
        'completed'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create booking with payment
CREATE OR REPLACE FUNCTION public.create_booking_with_payment(
    user_uuid UUID,
    route_uuid UUID,
    bus_uuid UUID,
    seat_num TEXT,
    travel_date_param TIMESTAMP WITH TIME ZONE,
    fare_amount_param DECIMAL(8,2),
    payment_method_param TEXT
)
RETURNS UUID AS $$
DECLARE
    booking_uuid UUID;
    current_balance DECIMAL(10,2);
BEGIN
    -- Generate booking ID
    booking_uuid := uuid_generate_v4();
    
    -- Get current wallet balance
    SELECT wallet_balance INTO current_balance
    FROM public.profiles
    WHERE id = user_uuid;
    
    -- Check if user has sufficient balance
    IF current_balance < fare_amount_param THEN
        RAISE EXCEPTION 'Insufficient wallet balance';
    END IF;
    
    -- Create booking
    INSERT INTO public.bookings (
        id,
        user_id,
        route_id,
        bus_id,
        seat_number,
        travel_date,
        fare_amount,
        payment_method,
        payment_status,
        booking_status
    ) VALUES (
        booking_uuid,
        user_uuid,
        route_uuid,
        bus_uuid,
        seat_num,
        travel_date_param,
        fare_amount_param,
        payment_method_param,
        'completed',
        'confirmed'
    );
    
    -- Deduct from wallet
    PERFORM public.update_wallet_balance(
        user_uuid,
        -fare_amount_param,
        'Bus ticket payment - ' || seat_num,
        payment_method_param
    );
    
    -- Add loyalty points (1 point per cedi spent)
    UPDATE public.profiles
    SET loyalty_points = loyalty_points + FLOOR(fare_amount_param)::INTEGER
    WHERE id = user_uuid;
    
    RETURN booking_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
