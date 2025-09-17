-- Create payments table for Stripe payment records
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'ghs',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'canceled', 'refunded')),
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    description TEXT,
    refund_amount DECIMAL(10,2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON public.payments
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_payments_updated_at();

-- Create function to get payment statistics
CREATE OR REPLACE FUNCTION public.get_payment_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_payments', COALESCE(payment_count, 0),
        'total_amount', COALESCE(total_amount, 0),
        'successful_payments', COALESCE(successful_count, 0),
        'failed_payments', COALESCE(failed_count, 0),
        'pending_payments', COALESCE(pending_count, 0)
    ) INTO result
    FROM (
        SELECT 
            COUNT(*) as payment_count,
            SUM(amount) as total_amount,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_count,
            COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
        FROM public.payments 
        WHERE user_id = user_uuid
    ) p;
    
    RETURN COALESCE(result, '{"total_payments": 0, "total_amount": 0, "successful_payments": 0, "failed_payments": 0, "pending_payments": 0}'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to process refund
CREATE OR REPLACE FUNCTION public.process_payment_refund(
    payment_uuid UUID,
    refund_amount_param DECIMAL(10,2) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    payment_record RECORD;
BEGIN
    -- Get payment record
    SELECT * INTO payment_record FROM public.payments WHERE id = payment_uuid;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if payment can be refunded
    IF payment_record.status != 'completed' THEN
        RETURN FALSE;
    END IF;
    
    -- Update payment status
    UPDATE public.payments 
    SET 
        status = 'refunded',
        refund_amount = COALESCE(refund_amount_param, payment_record.amount),
        updated_at = NOW()
    WHERE id = payment_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample payment data for testing (optional)
-- INSERT INTO public.payments (user_id, amount, currency, status, description) VALUES 
--     ('sample-user-id', 50.00, 'ghs', 'completed', 'Sample transport payment'),
--     ('sample-user-id', 100.00, 'ghs', 'pending', 'Sample pending payment');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT USAGE ON SEQUENCE public.payments_id_seq TO authenticated;
