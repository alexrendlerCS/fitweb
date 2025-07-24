import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // First, check if there's an approved trainer application
    const { data: application, error: appError } = await supabase
      .from('trainer_applications')
      .select('status, selected_tier')
      .eq('email', email.toLowerCase())
      .eq('status', 'approved')
      .single();

    if (appError || !application) {
      return NextResponse.json({ 
        hasAccount: false, 
        canAccess: false,
        message: 'No approved application found with this email' 
      });
    }

    // Check if client exists in the clients table
    const { data: client, error } = await supabase
      .from('clients')
      .select('id, email, project_status, password_hash, subscription_tier')
      .eq('email', email.toLowerCase())
      .single();

    console.log('Client lookup result:', { client, error, email: email.toLowerCase() });

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Client lookup error:', error);
      throw error;
    }

    if (!client) {
      // Client doesn't exist yet, but has approved application
      return NextResponse.json({
        hasAccount: false,
        hasPassword: false,
        canAccess: true,
        projectStatus: 'approved',
        subscriptionTier: application.selected_tier,
        message: 'Project approved! You can set up your account to access the dashboard.'
      });
    }

    // Client exists, check if they have a password set up
    const hasPassword = !!client.password_hash;
    const isApproved = client.project_status === 'approved';

    if (!isApproved) {
      return NextResponse.json({
        hasAccount: true,
        hasPassword,
        canAccess: false,
        projectStatus: client.project_status,
        subscriptionTier: client.subscription_tier || application.selected_tier,
        message: 'Project is still pending approval.'
      });
    }

    return NextResponse.json({
      hasAccount: true,
      hasPassword,
      canAccess: true,
      projectStatus: client.project_status,
      subscriptionTier: client.subscription_tier || application.selected_tier,
      message: hasPassword 
        ? 'Project approved! You can access your dashboard.' 
        : 'Please set up your password to access the dashboard.'
    });

  } catch (error) {
    console.error('Error checking client status:', error);
    return NextResponse.json(
      { error: 'Failed to check client status' },
      { status: 500 }
    );
  }
} 