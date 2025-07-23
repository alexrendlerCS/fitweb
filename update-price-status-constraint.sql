-- Update the price_status check constraint to include 'pending_estimate'
-- First, drop the existing constraint
ALTER TABLE feature_requests 
DROP CONSTRAINT IF EXISTS feature_requests_price_status_check;
 
-- Add the new constraint with all valid states
ALTER TABLE feature_requests 
ADD CONSTRAINT feature_requests_price_status_check 
CHECK (price_status IN ('not_set', 'pending_estimate', 'pending_approval', 'approved', 'declined')); 