-- Add subscription_tier field to clients table
-- This allows tracking which subscription tier each client has

-- Add subscription_tier field with proper constraints
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'pro', 'elite'));

-- Add index for efficient queries on subscription_tier
CREATE INDEX IF NOT EXISTS idx_clients_subscription_tier ON clients(subscription_tier);

-- Add comment to document the field
COMMENT ON COLUMN clients.subscription_tier IS 'Client subscription tier (starter, pro, elite)';

-- Update existing clients to have a default tier if they don't have one
-- This ensures existing clients have a tier set
UPDATE clients 
SET subscription_tier = 'pro' 
WHERE subscription_tier IS NULL;

-- Make the field NOT NULL after setting defaults
ALTER TABLE clients 
ALTER COLUMN subscription_tier SET NOT NULL; 