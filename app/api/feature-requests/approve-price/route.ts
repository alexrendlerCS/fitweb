import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Get the current feature request
    const { data: currentRequest, error: fetchError } = await supabase
      .from('feature_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentRequest) {
      return NextResponse.json(
        { error: 'Feature request not found' },
        { status: 404 }
      );
    }

    // Check if the request is pending approval
    if (currentRequest.price_status !== 'pending_approval') {
      return NextResponse.json(
        { error: 'Request is not pending price approval' },
        { status: 400 }
      );
    }

    // Update the request with approved cost and status
    const { data: updatedRequest, error: updateError } = await supabase
      .from('feature_requests')
      .update({
        approved_cost: currentRequest.estimated_cost,
        price_status: 'approved',
        status: 'in_progress'
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating feature request:', updateError);
      return NextResponse.json(
        { error: 'Failed to approve price' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Price approved successfully',
      featureRequest: updatedRequest
    });

  } catch (error) {
    console.error('Error in approve-price API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 