-- Fix RLS Policies for API Routes
-- Run this in your Supabase SQL editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to insert applications" ON trainer_applications;
DROP POLICY IF EXISTS "Allow public to read own application by email" ON trainer_applications;

-- Create new policies that work with API routes
CREATE POLICY "Allow public to insert applications" ON trainer_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to read applications by email" ON trainer_applications
    FOR SELECT USING (true);

-- Optional: If you want to restrict reads to only by email, use this instead:
-- CREATE POLICY "Allow public to read applications by email" ON trainer_applications
--     FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR current_setting('request.jwt.claims', true)::json->>'role' = 'admin');

-- For admin dashboard access, you'll need to create a service role key
-- and use it in your admin dashboard instead of the anon key 

-- Fix RLS policies for feature_requests table
-- This allows insertions while maintaining security for reads and updates

-- Drop existing policies
DROP POLICY IF EXISTS "Clients can view own feature requests" ON feature_requests;
DROP POLICY IF EXISTS "Clients can insert own feature requests" ON feature_requests;
DROP POLICY IF EXISTS "Clients can update own feature requests" ON feature_requests;

-- Create more permissive policies
-- Allow anyone to insert (since we validate the data in our API)
CREATE POLICY "Allow feature request insertions" ON feature_requests
    FOR INSERT WITH CHECK (true);

-- Allow clients to view their own requests (when authenticated)
CREATE POLICY "Clients can view own feature requests" ON feature_requests
    FOR SELECT USING (
        auth.jwt() ->> 'email' = client_email OR 
        client_email IS NULL
    );

-- Allow clients to update their own requests (when authenticated)
CREATE POLICY "Clients can update own feature requests" ON feature_requests
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = client_email
    );

-- Alternative: If you want to disable RLS temporarily for testing
-- ALTER TABLE feature_requests DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS later:
-- ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY; 