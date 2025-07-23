-- Add price-related fields to feature_requests table
ALTER TABLE feature_requests 
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS price_status VARCHAR(20) DEFAULT 'not_set' CHECK (price_status IN ('not_set', 'pending_approval', 'approved', 'declined'));

-- Update existing records to have default price_status
UPDATE feature_requests 
SET price_status = 'not_set' 
WHERE price_status IS NULL;

-- Add index for better performance on price_status queries
CREATE INDEX IF NOT EXISTS idx_feature_requests_price_status ON feature_requests(price_status);

-- Add index for better performance on estimated_cost queries
CREATE INDEX IF NOT EXISTS idx_feature_requests_estimated_cost ON feature_requests(estimated_cost);

-- Add index for better performance on approved_cost queries
CREATE INDEX IF NOT EXISTS idx_feature_requests_approved_cost ON feature_requests(approved_cost); 