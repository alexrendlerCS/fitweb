import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Fetch all clients with their GitHub settings
    const { data: clients, error } = await supabase
      .from('clients')
      .select(`
        id,
        email,
        full_name,
        project_status,
        github_repo,
        github_branch,
        github_enabled,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      return NextResponse.json(
        { error: 'Failed to fetch clients' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clients: clients || []
    });

  } catch (error) {
    console.error('Error in admin clients API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 