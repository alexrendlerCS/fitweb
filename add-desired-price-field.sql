-- Add desired_price field to feature_requests table
-- This allows clients to suggest a price for feature requests

ALTER TABLE feature_requests
ADD COLUMN IF NOT EXISTS desired_price DECIMAL(10,2);

-- Add index for better performance on desired_price queries
CREATE INDEX IF NOT EXISTS idx_feature_requests_desired_price ON feature_requests(desired_price);

-- Add comment to document the field
COMMENT ON COLUMN feature_requests.desired_price IS 'Client-suggested price for feature requests (optional)'; 