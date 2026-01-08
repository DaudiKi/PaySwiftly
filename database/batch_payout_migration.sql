-- ==============================================
-- PaySwiftly Batch Payout System Migration
-- ==============================================
-- This migration adds support for:
-- - Accumulating driver earnings (pending_balance)
-- - Tracking paid amounts (paid_balance)
-- - Weekly batch payouts
-- - Minimum payout threshold
-- ==============================================

-- 1. Add new columns to drivers table
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS pending_balance DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS paid_balance DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS last_payout_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS payout_schedule VARCHAR(20) DEFAULT 'weekly';

-- 2. Add comments for documentation
COMMENT ON COLUMN drivers.pending_balance IS 'Accumulated earnings waiting for payout';
COMMENT ON COLUMN drivers.paid_balance IS 'Total amount already paid out to driver';
COMMENT ON COLUMN drivers.last_payout_date IS 'Timestamp of last payout';
COMMENT ON COLUMN drivers.payout_schedule IS 'Payout frequency: weekly, threshold, manual';

-- 3. Initialize pending_balance for existing drivers
-- Move unpaid driver_amounts into pending_balance
UPDATE drivers d
SET pending_balance = (
    SELECT COALESCE(SUM(t.driver_amount), 0)
    FROM transactions t
    WHERE t.driver_id = d.id 
    AND t.collection_status = 'completed'
    AND (t.payout_status IN ('pending', 'pending_minimum', 'failed') OR t.payout_status IS NULL)
)
WHERE d.pending_balance = 0;

-- 4. Create function to add to pending balance atomically
CREATE OR REPLACE FUNCTION add_to_pending_balance(
    driver_id_param UUID,
    amount_param DECIMAL
)
RETURNS void AS $$
BEGIN
    UPDATE drivers
    SET pending_balance = pending_balance + amount_param,
        updated_at = NOW()
    WHERE id = driver_id_param;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION add_to_pending_balance IS 'Atomically add amount to driver pending balance';

-- 5. Create function to process batch payout
CREATE OR REPLACE FUNCTION process_batch_payout(
    driver_id_param UUID,
    amount_param DECIMAL,
    tracking_id_param VARCHAR
)
RETURNS void AS $$
BEGIN
    -- Move pending balance to paid balance
    UPDATE drivers
    SET 
        pending_balance = 0,
        paid_balance = paid_balance + amount_param,
        last_payout_date = NOW(),
        updated_at = NOW()
    WHERE id = driver_id_param;
    
    -- Create payout record
    INSERT INTO payouts (
        driver_id,
        transaction_id,
        amount,
        tracking_id,
        status,
        created_at
    ) VALUES (
        driver_id_param,
        NULL,  -- Batch payout, not tied to single transaction
        amount_param,
        tracking_id_param,
        'processing',
        NOW()
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION process_batch_payout IS 'Process batch payout for driver';

-- 6. Create view for drivers eligible for batch payout
CREATE OR REPLACE VIEW drivers_for_payout AS
SELECT 
    id,
    name,
    phone,
    pending_balance,
    paid_balance,
    last_payout_date,
    payout_schedule
FROM drivers
WHERE pending_balance >= 100  -- Minimum threshold
ORDER BY pending_balance DESC;

COMMENT ON VIEW drivers_for_payout IS 'Drivers eligible for batch payout (balance >= KES 100)';

-- 7. Create index for performance
CREATE INDEX IF NOT EXISTS idx_drivers_pending_balance ON drivers(pending_balance) WHERE pending_balance >= 100;

-- 8. Grant permissions
GRANT SELECT ON drivers_for_payout TO postgres;
GRANT EXECUTE ON FUNCTION add_to_pending_balance TO postgres;
GRANT EXECUTE ON FUNCTION process_batch_payout TO postgres;

-- ==============================================
-- Verification Queries
-- ==============================================

-- Check drivers with pending balance
-- SELECT id, name, pending_balance, paid_balance, last_payout_date FROM drivers WHERE pending_balance > 0;

-- Check drivers eligible for payout
-- SELECT * FROM drivers_for_payout;

-- Check total pending payouts
-- SELECT SUM(pending_balance) as total_pending FROM drivers;

-- ==============================================
-- Rollback (if needed)
-- ==============================================

-- DROP VIEW IF EXISTS drivers_for_payout;
-- DROP FUNCTION IF EXISTS process_batch_payout(UUID, DECIMAL, VARCHAR);
-- DROP FUNCTION IF EXISTS add_to_pending_balance(UUID, DECIMAL);
-- ALTER TABLE drivers DROP COLUMN IF EXISTS payout_schedule;
-- ALTER TABLE drivers DROP COLUMN IF EXISTS last_payout_date;
-- ALTER TABLE drivers DROP COLUMN IF EXISTS paid_balance;
-- ALTER TABLE drivers DROP COLUMN IF EXISTS pending_balance;
