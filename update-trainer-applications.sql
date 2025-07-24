-- Update trainer_applications table to replace calendly_url with referral_name and add preferred_times
-- First, add the new columns
ALTER TABLE trainer_applications 
ADD COLUMN IF NOT EXISTS referral_name TEXT,
ADD COLUMN IF NOT EXISTS preferred_times JSONB;

-- Drop the old calendly_url column if it exists
ALTER TABLE trainer_applications 
DROP COLUMN IF EXISTS calendly_url;

-- Add index for better performance on referral_name queries
CREATE INDEX IF NOT EXISTS idx_trainer_applications_referral_name ON trainer_applications(referral_name);

-- Add index for better performance on preferred_times queries
CREATE INDEX IF NOT EXISTS idx_trainer_applications_preferred_times ON trainer_applications USING GIN(preferred_times); 