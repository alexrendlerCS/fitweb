-- Add zoom_link field to trainer_applications table
-- Run this in your Supabase SQL editor

-- Add the zoom_link field
ALTER TABLE trainer_applications
ADD COLUMN IF NOT EXISTS zoom_link TEXT;

-- Add a comment to clarify the field purpose
COMMENT ON COLUMN trainer_applications.zoom_link IS 'Zoom meeting link for approved applications';

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_trainer_applications_zoom_link ON trainer_applications(zoom_link);

-- Update existing records to move stripe_link to zoom_link if needed
-- (Only if stripe_link contains zoom URLs)
UPDATE trainer_applications
SET zoom_link = stripe_link
WHERE stripe_link LIKE '%zoom.us%' 
AND zoom_link IS NULL; 