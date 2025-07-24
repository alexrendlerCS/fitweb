import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all feature requests with current client subscription tiers
    const { data: requests, error } = await supabase
      .from('feature_requests')
      .select(`
        *,
        clients(
          subscription_tier
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feature requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feature requests' },
        { status: 500 }
      );
    }

    // Transform the data to use current subscription tier from clients table
    const transformedRequests = requests.map(request => ({
      ...request,
      subscription_tier: request.clients?.subscription_tier || request.subscription_tier // Use current tier, fallback to stored tier
    }));

    // Calculate priority scores and sort
    const requestsWithScores = transformedRequests.map(request => {
      // If status is completed or declined, return 0 to push to bottom
      if (request.status === 'completed' || request.status === 'declined') {
        return {
          ...request,
          priority_score: 0
        };
      }
      
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
      total: transformedRequests.length,
      pending: transformedRequests.filter(req => req.status === 'pending').length,
      in_progress: transformedRequests.filter(req => req.status === 'in_progress').length,
      completed: transformedRequests.filter(req => req.status === 'completed').length,
      declined: transformedRequests.filter(req => req.status === 'declined').length,
      high_priority: transformedRequests.filter(req => req.priority === 'high').length,
      medium_priority: transformedRequests.filter(req => req.priority === 'medium').length,
      low_priority: transformedRequests.filter(req => req.priority === 'low').length,
      elite: transformedRequests.filter(req => req.subscription_tier === 'elite').length,
      pro: transformedRequests.filter(req => req.subscription_tier === 'pro').length,
      starter: transformedRequests.filter(req => req.subscription_tier === 'starter').length,
      with_cost: transformedRequests.filter(req => req.estimated_cost || req.approved_cost).length
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
    const { id, status, approved_cost, admin_notes, estimated_cost, price_status } = await request.json();

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
    if (estimated_cost !== undefined) updateData.estimated_cost = estimated_cost;
    if (price_status !== undefined) updateData.price_status = price_status;

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