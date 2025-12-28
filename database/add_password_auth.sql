-- Add password_hash column to drivers table
ALTER TABLE drivers 
ADD COLUMN password_hash VARCHAR(255);

-- Create index on phone for faster login lookups
CREATE INDEX IF NOT EXISTS idx_drivers_phone ON drivers(phone);
