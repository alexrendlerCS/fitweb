import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Get client data
    const { data: client, error } = await supabase
      .from('clients')
      .select('id, email, password_hash, full_name, project_status')
      .eq('email', email.toLowerCase())
      .single();

    console.log('Client lookup result:', { client: client ? 'found' : 'not found', error });

    if (error || !client) {
      console.log('Client not found or error:', error);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!client.password_hash) {
      console.log('No password hash found');
      return NextResponse.json({ error: 'Please set up your password first' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, client.password_hash);
    console.log('Password validation result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('Password valid, updating last login and setting session');

    // Update last login
    await supabase
      .from('clients')
      .update({ last_login: new Date().toISOString() })
      .eq('id', client.id);

    // Create a simple session token (in production, use JWT)
    const sessionToken = Buffer.from(`${client.id}:${Date.now()}`).toString('base64');
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('client-session', sessionToken, {
      httpOnly: false, // Allow JavaScript to read the cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log('Session cookie set, returning success');

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        email: client.email,
        fullName: client.full_name,
        projectStatus: client.project_status
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    );
  }
} 