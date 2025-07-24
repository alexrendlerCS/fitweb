import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if there's an approved application
    const { data: application } = await supabase
      .from('trainer_applications')
      .select('status, selected_tier')
      .eq('email', email.toLowerCase())
      .eq('status', 'approved')
      .single();

    const projectStatus = application ? 'approved' : 'pending';
    const subscriptionTier = application?.selected_tier || 'pro'; // Default to pro if no application found

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Check if client already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id, password_hash')
      .eq('email', email.toLowerCase())
      .single();

    if (existingClient) {
      if (existingClient.password_hash) {
        return NextResponse.json({ error: 'Account already exists with a password' }, { status: 400 });
      }

      // Update existing client with password
      const { error: updateError } = await supabase
        .from('clients')
        .update({ 
          password_hash: passwordHash,
          full_name: fullName || null,
          project_status: projectStatus,
          subscription_tier: subscriptionTier, // Add subscription tier
          updated_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase());

      if (updateError) throw updateError;

    } else {
      // Create new client
      const { error: insertError } = await supabase
        .from('clients')
        .insert({
          email: email.toLowerCase(),
          password_hash: passwordHash,
          full_name: fullName || null,
          project_status: projectStatus,
          subscription_tier: subscriptionTier // Add subscription tier
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password set successfully' 
    });

  } catch (error) {
    console.error('Error setting up password:', error);
    return NextResponse.json(
      { error: 'Failed to set up password' },
      { status: 500 }
    );
  }
} 