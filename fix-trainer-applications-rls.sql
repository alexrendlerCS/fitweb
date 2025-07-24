-- Fix RLS policies for trainer_applications table to allow API updates
-- Run this in your Supabase SQL editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to insert applications" ON trainer_applications;
DROP POLICY IF EXISTS "Allow public to read own application by email" ON trainer_applications;

-- Create new policies that work with API routes
-- Allow anyone to insert applications (for the application form)
CREATE POLICY "Allow public to insert applications" ON trainer_applications
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read applications (for admin dashboard and status checks)
CREATE POLICY "Allow public to read applications" ON trainer_applications
    FOR SELECT USING (true);

-- Allow API to update applications (for admin approval/rejection)
CREATE POLICY "Allow API to update applications" ON trainer_applications
    FOR UPDATE USING (true);

-- Allow API to delete applications (if needed)
CREATE POLICY "Allow API to delete applications" ON trainer_applications
    FOR DELETE USING (true);

-- Alternative: If you want to temporarily disable RLS for testing
-- ALTER TABLE trainer_applications DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS later:
-- ALTER TABLE trainer_applications ENABLE ROW LEVEL SECURITY; 