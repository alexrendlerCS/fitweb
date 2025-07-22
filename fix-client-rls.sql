-- Fix RLS policies for clients table to allow API access
-- Drop existing policies
DROP POLICY IF EXISTS "Clients can view own data" ON clients;
DROP POLICY IF EXISTS "Clients can update own data" ON clients;
DROP POLICY IF EXISTS "Allow client signup" ON clients;

-- Create new policies that allow API access
-- Allow API to read client data for authentication
CREATE POLICY "API can read client data" ON clients
    FOR SELECT USING (true);

-- Allow API to insert new clients
CREATE POLICY "API can insert clients" ON clients
    FOR INSERT WITH CHECK (true);

-- Allow API to update client data
CREATE POLICY "API can update clients" ON clients
    FOR UPDATE USING (true);

-- Allow authenticated users to read their own data (for future use)
CREATE POLICY "Users can view own data" ON clients
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Allow authenticated users to update their own data (for future use)
CREATE POLICY "Users can update own data" ON clients
    FOR UPDATE USING (auth.jwt() ->> 'email' = email); 