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

    // Update the request status to declined
    const { data: updatedRequest, error: updateError } = await supabase
      .from('feature_requests')
      .update({
        price_status: 'declined',
        status: 'declined'
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating feature request:', updateError);
      return NextResponse.json(
        { error: 'Failed to decline price' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Price declined successfully',
      featureRequest: updatedRequest
    });

  } catch (error) {
    console.error('Error in decline-price API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 