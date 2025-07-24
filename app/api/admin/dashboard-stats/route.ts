import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Fetch trainer applications statistics
    const { data: applications, error: appError } = await supabase
      .from('trainer_applications')
      .select('status, selected_tier');

    if (appError) {
      console.error('Error fetching applications:', appError);
      return NextResponse.json(
        { error: 'Failed to fetch applications data' },
        { status: 500 }
      );
    }

    // Fetch feature requests statistics
    const { data: requests, error: reqError } = await supabase
      .from('feature_requests')
      .select('status, priority, subscription_tier');

    if (reqError) {
      console.error('Error fetching feature requests:', reqError);
      return NextResponse.json(
        { error: 'Failed to fetch feature requests data' },
        { status: 500 }
      );
    }

    // Fetch clients statistics
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('id, subscription_tier');

    if (clientError) {
      console.error('Error fetching clients:', clientError);
      return NextResponse.json(
        { error: 'Failed to fetch clients data' },
        { status: 500 }
      );
    }

    // Calculate application statistics
    const appStats = {
      total: applications?.length || 0,
      pending: applications?.filter(app => app.status === 'pending').length || 0,
      approved: applications?.filter(app => app.status === 'approved').length || 0,
      rejected: applications?.filter(app => app.status === 'rejected').length || 0,
      paid: applications?.filter(app => app.status === 'paid').length || 0,
      byTier: {
        starter: applications?.filter(app => app.selected_tier === 'starter').length || 0,
        pro: applications?.filter(app => app.selected_tier === 'pro').length || 0,
        elite: applications?.filter(app => app.selected_tier === 'elite').length || 0
      }
    };

    // Calculate feature request statistics
    const reqStats = {
      total: requests?.length || 0,
      pending: requests?.filter(req => req.status === 'pending').length || 0,
      inProgress: requests?.filter(req => req.status === 'in_progress').length || 0,
      completed: requests?.filter(req => req.status === 'completed').length || 0,
      declined: requests?.filter(req => req.status === 'declined').length || 0,
      byPriority: {
        high: requests?.filter(req => req.priority === 'high' && req.status !== 'completed' && req.status !== 'declined').length || 0,
        medium: requests?.filter(req => req.priority === 'medium' && req.status !== 'completed' && req.status !== 'declined').length || 0,
        low: requests?.filter(req => req.priority === 'low' && req.status !== 'completed' && req.status !== 'declined').length || 0
      },
      byTier: {
        starter: requests?.filter(req => req.subscription_tier === 'starter' && req.status !== 'completed' && req.status !== 'declined').length || 0,
        pro: requests?.filter(req => req.subscription_tier === 'pro' && req.status !== 'completed' && req.status !== 'declined').length || 0,
        elite: requests?.filter(req => req.subscription_tier === 'elite' && req.status !== 'completed' && req.status !== 'declined').length || 0
      }
    };

    // Calculate client statistics
    const clientStats = {
      total: clients?.length || 0,
      byTier: {
        starter: clients?.filter(client => client.subscription_tier === 'starter').length || 0,
        pro: clients?.filter(client => client.subscription_tier === 'pro').length || 0,
        elite: clients?.filter(client => client.subscription_tier === 'elite').length || 0
      }
    };

    return NextResponse.json({
      success: true,
      stats: {
        applications: appStats,
        requests: reqStats,
        clients: clientStats
      }
    });

  } catch (error) {
    console.error('Error in dashboard stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 