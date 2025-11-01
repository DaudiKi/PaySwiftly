-- GoPay IntaSend Migration
-- This migration adds support for IntaSend payment collection and disbursements

-- Add new status values for payouts
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'payout_pending';
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'payout_completed';
ALTER TYPE transaction_status ADD VALUE IF NOT EXISTS 'payout_failed';

-- Add IntaSend specific fields to transactions table
ALTER TABLE transactions 
    ADD COLUMN IF NOT EXISTS intasend_collection_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS intasend_tracking_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS collection_status VARCHAR(50),
    ADD COLUMN IF NOT EXISTS payout_status VARCHAR(50),
    ADD COLUMN IF NOT EXISTS collection_response JSONB,
    ADD COLUMN IF NOT EXISTS payout_response JSONB,
    ADD COLUMN IF NOT EXISTS fee_percentage DECIMAL(5,2) DEFAULT 0.5,
    ADD COLUMN IF NOT EXISTS fee_fixed DECIMAL(10,2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS collection_completed_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS payout_completed_at TIMESTAMP WITH TIME ZONE;

-- Create payouts table for detailed payout tracking
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    tracking_id VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending',
    intasend_response JSONB,
    failure_reason TEXT,
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create platform_fees table for tracking all platform revenue
CREATE TABLE IF NOT EXISTS platform_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    fee_type VARCHAR(50) DEFAULT 'percentage', -- 'percentage' or 'fixed'
    percentage_applied DECIMAL(5,2),
    fixed_amount_applied DECIMAL(10,2),
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_transactions_intasend_collection_id ON transactions(intasend_collection_id);
CREATE INDEX IF NOT EXISTS idx_transactions_intasend_tracking_id ON transactions(intasend_tracking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_collection_status ON transactions(collection_status);
CREATE INDEX IF NOT EXISTS idx_transactions_payout_status ON transactions(payout_status);
CREATE INDEX IF NOT EXISTS idx_payouts_transaction_id ON payouts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payouts_driver_id ON payouts(driver_id);
CREATE INDEX IF NOT EXISTS idx_payouts_tracking_id ON payouts(tracking_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_platform_fees_transaction_id ON platform_fees(transaction_id);

-- Create trigger for payouts updated_at
DROP TRIGGER IF EXISTS update_payouts_updated_at ON payouts;
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update admin_stats to track platform fees separately
ALTER TABLE admin_stats 
    ADD COLUMN IF NOT EXISTS total_payouts DECIMAL(15,2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS pending_payouts DECIMAL(15,2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS failed_payouts INTEGER DEFAULT 0;

-- Create function to update driver earnings after successful payout
CREATE OR REPLACE FUNCTION update_driver_earnings_on_payout()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE drivers 
        SET 
            total_earnings = total_earnings + NEW.amount,
            balance = balance + NEW.amount,
            updated_at = NOW()
        WHERE id = NEW.driver_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update driver earnings
DROP TRIGGER IF EXISTS trigger_update_driver_earnings ON payouts;
CREATE TRIGGER trigger_update_driver_earnings
    AFTER INSERT OR UPDATE ON payouts
    FOR EACH ROW
    EXECUTE FUNCTION update_driver_earnings_on_payout();

-- Create function to update admin stats on successful transaction
CREATE OR REPLACE FUNCTION update_admin_stats_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE admin_stats 
        SET 
            total_transactions = total_transactions + 1,
            total_revenue = total_revenue + NEW.amount_paid,
            total_platform_fees = total_platform_fees + NEW.platform_fee,
            updated_at = NOW()
        WHERE id = 'revenue';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update admin stats
DROP TRIGGER IF EXISTS trigger_update_admin_stats ON transactions;
CREATE TRIGGER trigger_update_admin_stats
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_stats_on_transaction();

-- Enable RLS on new tables
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_fees ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Allow all operations on payouts" ON payouts FOR ALL USING (true);
CREATE POLICY "Allow all operations on platform_fees" ON platform_fees FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON payouts TO postgres;
GRANT ALL ON platform_fees TO postgres;

-- Create view for transaction summary with payout info
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    t.id,
    t.driver_id,
    d.name as driver_name,
    d.phone as driver_phone,
    t.passenger_phone,
    t.amount_paid,
    t.platform_fee,
    t.driver_amount,
    t.status,
    t.collection_status,
    t.payout_status,
    p.tracking_id as payout_tracking_id,
    p.status as payout_detail_status,
    t.created_at,
    t.collection_completed_at,
    t.payout_completed_at
FROM transactions t
LEFT JOIN drivers d ON t.driver_id = d.id
LEFT JOIN payouts p ON t.id = p.transaction_id
ORDER BY t.created_at DESC;

-- Grant access to view
GRANT SELECT ON transaction_summary TO postgres;

COMMENT ON TABLE transactions IS 'Stores all payment transactions with IntaSend collection and payout details';
COMMENT ON TABLE payouts IS 'Detailed tracking of driver payouts/disbursements via IntaSend';
COMMENT ON TABLE platform_fees IS 'Tracks all platform commission fees collected';


