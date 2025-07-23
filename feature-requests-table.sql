-- Create feature_requests table for client feedback, suggestions, and bug reports
CREATE TABLE feature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    client_email TEXT NOT NULL,
    subscription_tier TEXT NOT NULL CHECK (subscription_tier IN ('starter', 'pro', 'elite')),
    
    -- Form fields matching Google Form
    page_url TEXT, -- "Page/Feature of the Feedback"
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('edit', 'feature', 'bug', 'comment')), -- "Type of Feedback"
    description TEXT NOT NULL, -- "Describe Feedback"
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')), -- "Priority Level"
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'declined')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Additional metadata
    admin_notes TEXT,
    estimated_completion_date DATE
);

-- Add indexes for efficient queries
CREATE INDEX idx_feature_requests_client_id ON feature_requests (client_id);
CREATE INDEX idx_feature_requests_email ON feature_requests (client_email);
CREATE INDEX idx_feature_requests_status ON feature_requests (status);
CREATE INDEX idx_feature_requests_priority ON feature_requests (priority);
CREATE INDEX idx_feature_requests_subscription_tier ON feature_requests (subscription_tier);
CREATE INDEX idx_feature_requests_created_at ON feature_requests (created_at);
CREATE INDEX idx_feature_requests_feedback_type ON feature_requests (feedback_type);

-- Composite index for priority sorting (subscription tier + priority + created date)
CREATE INDEX idx_feature_requests_priority_sort ON feature_requests (subscription_tier, priority, created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can only see their own feature requests
CREATE POLICY "Clients can view own feature requests" ON feature_requests
    FOR SELECT USING (auth.jwt() ->> 'email' = client_email);

-- Policy: Clients can insert their own feature requests
CREATE POLICY "Clients can insert own feature requests" ON feature_requests
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = client_email);

-- Policy: Clients can update their own feature requests (for status updates, etc.)
CREATE POLICY "Clients can update own feature requests" ON feature_requests
    FOR UPDATE USING (auth.jwt() ->> 'email' = client_email);

-- Policy: Allow admin to view all feature requests (you'll need to implement admin role)
-- CREATE POLICY "Admin can view all feature requests" ON feature_requests
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_feature_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_feature_requests_updated_at
    BEFORE UPDATE ON feature_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_feature_requests_updated_at();

-- Function to get priority score for sorting (higher number = higher priority)
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

-- View for sorted feature requests (useful for admin dashboard)
CREATE VIEW sorted_feature_requests AS
SELECT 
    fr.*,
    get_priority_score(fr.subscription_tier, fr.priority) as priority_score
FROM feature_requests fr
ORDER BY 
    get_priority_score(fr.subscription_tier, fr.priority) DESC,
    fr.created_at DESC;

-- Insert some sample data for testing (optional)
-- INSERT INTO feature_requests (client_email, subscription_tier, page_url, feedback_type, description, priority)
-- VALUES 
--     ('test@example.com', 'pro', 'https://example.com/dashboard', 'feature', 'Add dark mode toggle', 'high'),
--     ('test2@example.com', 'starter', 'https://example.com/profile', 'bug', 'Profile page not loading', 'medium'),
--     ('test3@example.com', 'elite', 'https://example.com/booking', 'edit', 'Change booking button color', 'low'); 