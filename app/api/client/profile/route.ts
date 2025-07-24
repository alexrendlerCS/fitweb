import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('client-session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Decode the session token to get client email
    // For now, we'll use a simple approach - in production you'd want proper JWT tokens
    let clientEmail: string;
    
    try {
      // If it's a temporary session, extract email from the token
      if (sessionToken.startsWith('temp:')) {
        const decoded = Buffer.from(sessionToken, 'base64').toString();
        const emailMatch = decoded.match(/temp:(\d+)/);
        if (emailMatch) {
          // For temporary sessions, we need to get the email from URL params or localStorage
          // For now, let's return a basic structure
          return NextResponse.json({
            success: true,
            client: {
              id: 'temp-session',
              email: 'temp@example.com',
              fullName: 'Temporary User',
              projectStatus: 'approved'
            }
          });
        }
      }
      
      // For regular sessions, we'd decode the JWT token
      // For now, let's get the email from the request headers or query params
      const url = new URL(request.url);
      const emailParam = url.searchParams.get('email');
      
      if (emailParam) {
        clientEmail = emailParam;
      } else {
        // Fallback to default for testing - this should be removed in production
        clientEmail = 'alexrendler@yahoo.com';
      }
    } catch (error) {
      console.error('Error decoding session token:', error);
      return NextResponse.json(
        { error: 'Invalid session token' },
        { status: 401 }
      );
    }

    // Fetch client data from database
    const { data: client, error } = await supabase
      .from('clients')
      .select(`
        id,
        email,
        full_name,
        project_status,
        github_repo,
        github_branch,
        github_enabled
      `)
      .eq('email', clientEmail)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        email: client.email,
        fullName: client.full_name,
        projectStatus: client.project_status,
        githubRepo: client.github_repo,
        githubBranch: client.github_branch,
        githubEnabled: client.github_enabled
      }
    });

  } catch (error) {
    console.error('Error in client profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 