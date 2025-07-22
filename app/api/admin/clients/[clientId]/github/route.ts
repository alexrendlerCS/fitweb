import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const { clientId } = params;
    const { github_repo, github_branch, github_enabled } = await request.json();

    // Validate input
    if (github_enabled && (!github_repo || !github_repo.trim())) {
      return NextResponse.json(
        { error: 'GitHub repository is required when GitHub integration is enabled' },
        { status: 400 }
      );
    }

    // Update client GitHub settings
    const { data, error } = await supabase
      .from('clients')
      .update({
        github_repo: github_repo?.trim() || null,
        github_branch: github_branch?.trim() || 'main',
        github_enabled: github_enabled || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId)
      .select()
      .single();

    if (error) {
      console.error('Error updating client GitHub settings:', error);
      return NextResponse.json(
        { error: 'Failed to update client settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      client: data
    });

  } catch (error) {
    console.error('Error in update client GitHub API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 