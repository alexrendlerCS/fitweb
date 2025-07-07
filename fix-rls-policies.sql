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