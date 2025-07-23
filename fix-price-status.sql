-- Fix existing feature requests that have wrong price_status
-- This script updates any feature requests that have price_status = 'pending_approval' 
-- but no estimated_cost set, which shouldn't happen

UPDATE feature_requests 
SET price_status = 'not_set' 
WHERE price_status = 'pending_approval' 
AND estimated_cost IS NULL;

-- Set feature requests to 'pending_estimate' if they need price setting
UPDATE feature_requests 
SET price_status = 'pending_estimate' 
WHERE feedback_type = 'feature' 
AND estimated_cost IS NULL 
AND price_status = 'not_set'
AND status IN ('pending', 'in_progress');

-- Also ensure that any feature requests with estimated_cost but wrong price_status are corrected
UPDATE feature_requests 
SET price_status = 'pending_approval' 
WHERE estimated_cost IS NOT NULL 
AND price_status IN ('not_set', 'pending_estimate')
AND status IN ('pending', 'in_progress');

-- Set initial price_status to 'not_set' for any new feature requests that don't have it set
UPDATE feature_requests 
SET price_status = 'not_set' 
WHERE price_status IS NULL; 