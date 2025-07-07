-- FitWeb Studio Database Setup
-- Run these queries in your Supabase SQL editor

-- =====================================================
-- 1. TRAINER APPLICATIONS TABLE
-- =====================================================

CREATE TABLE trainer_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  selected_tier TEXT NOT NULL CHECK (selected_tier IN ('starter', 'pro', 'elite')),
  goals TEXT NOT NULL,
  instagram_url TEXT,
  calendly_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  stripe_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TRAINERS TABLE (for approved and paid trainers)
-- =====================================================

CREATE TABLE trainers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES trainer_applications(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'pro', 'elite')),
  domain TEXT,
  subdomain TEXT,
  branding_logo_url TEXT,
  branding_colors JSONB DEFAULT '{"primary": "#004d40", "secondary": "#00695c"}',
  session_types JSONB DEFAULT '[]',
  pricing JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  contract_accepted BOOLEAN DEFAULT FALSE,
  contract_accepted_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  monthly_fee DECIMAL(10,2) NOT NULL,
  setup_fee_paid BOOLEAN DEFAULT FALSE,
  setup_fee_amount DECIMAL(10,2) NOT NULL,
  max_clients INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. REFERRALS TABLE (for the referral system)
-- =====================================================

CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES trainers(id),
  referred_email TEXT NOT NULL,
  referred_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'approved', 'paid')),
  referral_code TEXT UNIQUE,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. ONBOARDING STEPS TABLE (track onboarding progress)
-- =====================================================

CREATE TABLE onboarding_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id),
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. PAYMENT HISTORY TABLE (track all payments)
-- =====================================================

CREATE TABLE payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id),
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('setup', 'monthly', 'feature')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. FEATURE REQUESTS TABLE (for Elite tier)
-- =====================================================

CREATE TABLE feature_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected')),
  estimated_cost DECIMAL(10,2),
  approved_cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. ADMIN USERS TABLE (for admin dashboard access)
-- =====================================================

CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Trainer applications indexes
CREATE INDEX idx_trainer_applications_email ON trainer_applications(email);
CREATE INDEX idx_trainer_applications_status ON trainer_applications(status);
CREATE INDEX idx_trainer_applications_created_at ON trainer_applications(created_at);

-- Trainers indexes
CREATE INDEX idx_trainers_email ON trainers(email);
CREATE INDEX idx_trainers_tier ON trainers(tier);
CREATE INDEX idx_trainers_active ON trainers(active);

-- Referrals indexes
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_email ON referrals(referred_email);
CREATE INDEX idx_referrals_status ON referrals(status);

-- Onboarding steps indexes
CREATE INDEX idx_onboarding_steps_trainer_id ON onboarding_steps(trainer_id);
CREATE INDEX idx_onboarding_steps_completed ON onboarding_steps(completed);

-- Payment history indexes
CREATE INDEX idx_payment_history_trainer_id ON payment_history(trainer_id);
CREATE INDEX idx_payment_history_status ON payment_history(status);
CREATE INDEX idx_payment_history_created_at ON payment_history(created_at);

-- Feature requests indexes
CREATE INDEX idx_feature_requests_trainer_id ON feature_requests(trainer_id);
CREATE INDEX idx_feature_requests_status ON feature_requests(status);
CREATE INDEX idx_feature_requests_priority ON feature_requests(priority);

-- =====================================================
-- 9. CREATE UPDATED_AT TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_trainer_applications_updated_at 
    BEFORE UPDATE ON trainer_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainers_updated_at 
    BEFORE UPDATE ON trainers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at 
    BEFORE UPDATE ON referrals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_steps_updated_at 
    BEFORE UPDATE ON onboarding_steps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_requests_updated_at 
    BEFORE UPDATE ON feature_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. INSERT DEFAULT ADMIN USER
-- =====================================================

-- Insert a default admin user (change email and name as needed)
INSERT INTO admin_users (email, full_name, role) 
VALUES ('admin@fitwebstudio.com', 'FitWeb Admin', 'super_admin');

-- =====================================================
-- 11. CREATE ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE trainer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Trainer applications policies (public read/write for applications)
CREATE POLICY "Allow public to insert applications" ON trainer_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to read own application by email" ON trainer_applications
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR current_setting('request.jwt.claims', true)::json->>'role' = 'admin');

-- Trainers policies (only admins and the trainer themselves)
CREATE POLICY "Allow admins full access to trainers" ON trainers
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'admin');

CREATE POLICY "Allow trainers to read own data" ON trainers
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Admin users policies (only super admins)
CREATE POLICY "Allow super admins full access" ON admin_users
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'super_admin');

-- =====================================================
-- 12. CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for application statistics
CREATE VIEW application_stats AS
SELECT 
    COUNT(*) as total_applications,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_applications,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_applications,
    COUNT(*) FILTER (WHERE status = 'paid') as paid_applications,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_applications,
    COUNT(*) FILTER (WHERE selected_tier = 'starter') as starter_applications,
    COUNT(*) FILTER (WHERE selected_tier = 'pro') as pro_applications,
    COUNT(*) FILTER (WHERE selected_tier = 'elite') as elite_applications
FROM trainer_applications;

-- View for trainer dashboard data
CREATE VIEW trainer_dashboard AS
SELECT 
    t.id,
    t.full_name,
    t.business_name,
    t.tier,
    t.onboarding_completed,
    t.contract_accepted,
    t.monthly_fee,
    t.max_clients,
    COUNT(r.id) as total_referrals,
    COUNT(r.id) FILTER (WHERE r.status = 'paid') as successful_referrals
FROM trainers t
LEFT JOIN referrals r ON t.id = r.referrer_id
WHERE t.active = true
GROUP BY t.id, t.full_name, t.business_name, t.tier, t.onboarding_completed, t.contract_accepted, t.monthly_fee, t.max_clients;

-- =====================================================
-- 13. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE trainer_applications IS 'Stores trainer applications for FitWeb Studio services';
COMMENT ON TABLE trainers IS 'Stores approved and paid trainers with their platform configuration';
COMMENT ON TABLE referrals IS 'Tracks referral relationships and commissions';
COMMENT ON TABLE onboarding_steps IS 'Tracks trainer onboarding progress';
COMMENT ON TABLE payment_history IS 'Stores all payment transactions';
COMMENT ON TABLE feature_requests IS 'Stores feature requests from Elite tier trainers';
COMMENT ON TABLE admin_users IS 'Stores admin users for dashboard access';

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- To verify the setup, run:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name; 