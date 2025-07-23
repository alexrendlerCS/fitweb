import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all feature requests ordered by priority score and creation date
    const { data: requests, error } = await supabase
      .from('feature_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feature requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feature requests' },
        { status: 500 }
      );
    }

    // Calculate priority scores and sort
    const requestsWithScores = requests.map(request => {
      const tierScores = { elite: 100, pro: 50, starter: 10 };
      const priorityScores = { high: 30, medium: 20, low: 10 };
      
      const tierScore = tierScores[request.subscription_tier as keyof typeof tierScores] || 0;
      const priorityScore = priorityScores[request.priority as keyof typeof priorityScores] || 0;
      const totalScore = tierScore + priorityScore;
      
      return {
        ...request,
        priority_score: totalScore
      };
    });

    // Sort by priority score (highest first), then by creation date (newest first)
    const sortedRequests = requestsWithScores.sort((a, b) => {
      if (b.priority_score !== a.priority_score) {
        return b.priority_score - a.priority_score;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Get counts for different categories
    const counts = {
      total: requests.length,
      pending: requests.filter(req => req.status === 'pending').length,
      in_progress: requests.filter(req => req.status === 'in_progress').length,
      completed: requests.filter(req => req.status === 'completed').length,
      declined: requests.filter(req => req.status === 'declined').length,
      high_priority: requests.filter(req => req.priority === 'high').length,
      medium_priority: requests.filter(req => req.priority === 'medium').length,
      low_priority: requests.filter(req => req.priority === 'low').length,
      elite: requests.filter(req => req.subscription_tier === 'elite').length,
      pro: requests.filter(req => req.subscription_tier === 'pro').length,
      starter: requests.filter(req => req.subscription_tier === 'starter').length,
      with_cost: requests.filter(req => req.estimated_cost || req.approved_cost).length
    };

    return NextResponse.json({
      success: true,
      requests: sortedRequests,
      counts
    });

  } catch (error) {
    console.error('Error in admin feature-requests API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, approved_cost, admin_notes } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (approved_cost !== undefined) updateData.approved_cost = approved_cost;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;

    const { data: updatedRequest, error } = await supabase
      .from('feature_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating feature request:', error);
      return NextResponse.json(
        { error: 'Failed to update feature request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      request: updatedRequest
    });

  } catch (error) {
    console.error('Error in admin feature-requests PUT API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 