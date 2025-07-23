-- Migration script to update existing feature_requests table
-- This will add the missing columns and modify existing ones to match our new schema

-- First, let's backup the existing data (optional)
-- CREATE TABLE feature_requests_backup AS SELECT * FROM feature_requests;

-- Add new columns that our form needs
ALTER TABLE feature_requests 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS client_email TEXT,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'pro', 'elite')),
ADD COLUMN IF NOT EXISTS page_url TEXT,
ADD COLUMN IF NOT EXISTS feedback_type TEXT CHECK (feedback_type IN ('edit', 'feature', 'bug', 'comment')),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS estimated_completion_date DATE;

-- Rename existing columns to match our new schema
-- Note: We'll keep the existing columns but add new ones to avoid data loss

-- Update the priority column to ensure it has the correct constraints
ALTER TABLE feature_requests 
DROP CONSTRAINT IF EXISTS feature_requests_priority_check;

ALTER TABLE feature_requests 
ADD CONSTRAINT feature_requests_priority_check 
CHECK (priority IN ('high', 'medium', 'low'));

-- Update the status column to ensure it has the correct constraints
ALTER TABLE feature_requests 
DROP CONSTRAINT IF EXISTS feature_requests_status_check;

ALTER TABLE feature_requests 
ADD CONSTRAINT feature_requests_status_check 
CHECK (status IN ('pending', 'in_progress', 'completed', 'declined'));

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_feature_requests_client_id ON feature_requests (client_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_email ON feature_requests (client_email);
CREATE INDEX IF NOT EXISTS idx_feature_requests_subscription_tier ON feature_requests (subscription_tier);
CREATE INDEX IF NOT EXISTS idx_feature_requests_feedback_type ON feature_requests (feedback_type);

-- Add composite index for priority sorting
CREATE INDEX IF NOT EXISTS idx_feature_requests_priority_sort ON feature_requests (subscription_tier, priority, created_at DESC);

-- Update RLS policies to work with new schema
DROP POLICY IF EXISTS "Clients can view own feature requests" ON feature_requests;
DROP POLICY IF EXISTS "Clients can insert own feature requests" ON feature_requests;
DROP POLICY IF EXISTS "Clients can update own feature requests" ON feature_requests;

-- Create new policies for the updated schema
CREATE POLICY "Clients can view own feature requests" ON feature_requests
    FOR SELECT USING (auth.jwt() ->> 'email' = client_email);

CREATE POLICY "Clients can insert own feature requests" ON feature_requests
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = client_email);

CREATE POLICY "Clients can update own feature requests" ON feature_requests
    FOR UPDATE USING (auth.jwt() ->> 'email' = client_email);

-- Create the priority scoring function if it doesn't exist
CREATE OR REPLACE FUNCTION get_priority_score(subscription_tier TEXT, priority TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- Base priority scores
    DECLARE
        tier_score INTEGER;
        priority_score INTEGER;
    BEGIN
        -- Subscription tier scores (higher = more important)
        CASE subscription_tier
            WHEN 'elite' THEN tier_score := 100;
            WHEN 'pro' THEN tier_score := 50;
            WHEN 'starter' THEN tier_score := 10;
            ELSE tier_score := 0;
        END CASE;
        
        -- Priority scores
        CASE priority
            WHEN 'high' THEN priority_score := 30;
            WHEN 'medium' THEN priority_score := 20;
            WHEN 'low' THEN priority_score := 10;
            ELSE priority_score := 0;
        END CASE;
        
        RETURN tier_score + priority_score;
    END;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the sorted view
DROP VIEW IF EXISTS sorted_feature_requests;
CREATE VIEW sorted_feature_requests AS
SELECT 
    fr.*,
    get_priority_score(fr.subscription_tier, fr.priority) as priority_score
FROM feature_requests fr
ORDER BY 
    get_priority_score(fr.subscription_tier, fr.priority) DESC,
    fr.created_at DESC;

-- Add trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_feature_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_feature_requests_updated_at ON feature_requests;
CREATE TRIGGER update_feature_requests_updated_at
    BEFORE UPDATE ON feature_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_feature_requests_updated_at();

-- Verify the table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'feature_requests' 
-- ORDER BY ordinal_position; 