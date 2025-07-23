import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendFeatureRequestEmail(featureRequest: any) {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b', 
    low: '#10b981'
  };

  const feedbackTypeLabels = {
    edit: 'Suggest an Edit',
    feature: 'Request New Feature',
    bug: 'Bug/Issue',
    comment: 'General Comment'
  };

  const subscriptionTierColors = {
    elite: '#7c3aed',
    pro: '#3b82f6',
    starter: '#6b7280'
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Feature Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #004d40 0%, #00695c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #004d40; margin-bottom: 5px; }
        .value { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #004d40; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; color: white; font-size: 12px; font-weight: bold; }
        .priority-high { background-color: ${priorityColors.high}; }
        .priority-medium { background-color: ${priorityColors.medium}; }
        .priority-low { background-color: ${priorityColors.low}; }
        .tier-elite { background-color: ${subscriptionTierColors.elite}; }
        .tier-pro { background-color: ${subscriptionTierColors.pro}; }
        .tier-starter { background-color: ${subscriptionTierColors.starter}; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎯 New Feature Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">A client has submitted a new request</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">👤 Client Information</div>
            <div class="value">
              <strong>Email:</strong> ${featureRequest.client_email}<br>
              <strong>Subscription Tier:</strong> 
              <span class="badge tier-${featureRequest.subscription_tier}">${featureRequest.subscription_tier.toUpperCase()}</span>
            </div>
          </div>

          <div class="field">
            <div class="label">📋 Request Type</div>
            <div class="value">
              <span class="badge" style="background-color: #004d40;">${feedbackTypeLabels[featureRequest.feedback_type as keyof typeof feedbackTypeLabels]}</span>
            </div>
          </div>

          <div class="field">
            <div class="label">🎯 Priority Level</div>
            <div class="value">
              <span class="badge priority-${featureRequest.priority}">${featureRequest.priority.toUpperCase()}</span>
            </div>
          </div>

          ${featureRequest.page_url ? `
          <div class="field">
            <div class="label">🌐 Page/Feature</div>
            <div class="value">
              <a href="${featureRequest.page_url}" style="color: #004d40; text-decoration: none;">${featureRequest.page_url}</a>
            </div>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">📝 Description</div>
            <div class="value">
              ${featureRequest.description.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div class="field">
            <div class="label">📊 Request Details</div>
            <div class="value">
              <strong>Request ID:</strong> ${featureRequest.id}<br>
              <strong>Submitted:</strong> ${new Date(featureRequest.created_at).toLocaleString()}<br>
              <strong>Status:</strong> <span class="badge" style="background-color: #f59e0b;">PENDING</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This request has been automatically prioritized based on subscription tier and priority level.</p>
          <p>Priority Score: ${featureRequest.subscription_tier === 'elite' ? 100 : featureRequest.subscription_tier === 'pro' ? 50 : 10} + ${featureRequest.priority === 'high' ? 30 : featureRequest.priority === 'medium' ? 20 : 10} = ${(featureRequest.subscription_tier === 'elite' ? 100 : featureRequest.subscription_tier === 'pro' ? 50 : 10) + (featureRequest.priority === 'high' ? 30 : featureRequest.priority === 'medium' ? 20 : 10)}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'FitWeb Studio <noreply@fitwebstudio.com>',
      to: 'alexrendler@yahoo.com',
      subject: `🎯 New ${feedbackTypeLabels[featureRequest.feedback_type as keyof typeof feedbackTypeLabels]} - ${featureRequest.subscription_tier.toUpperCase()} Client`,
      html: htmlContent,
    });
    
    console.log('Feature request email sent successfully');
  } catch (error) {
    console.error('Error sending feature request email:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      pageUrl, 
      feedbackType, 
      description, 
      priority, 
      clientEmail, 
      subscriptionTier 
    } = await request.json();

    // Validate required fields
    if (!feedbackType || !description || !priority || !clientEmail || !subscriptionTier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate feedback type
    const validFeedbackTypes = ['edit', 'feature', 'bug', 'comment'];
    if (!validFeedbackTypes.includes(feedbackType)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['high', 'medium', 'low'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority level' },
        { status: 400 }
      );
    }

    // Validate subscription tier
    const validTiers = ['starter', 'pro', 'elite'];
    if (!validTiers.includes(subscriptionTier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get client ID from email
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('email', clientEmail.toLowerCase())
      .single();

    if (clientError && clientError.code !== 'PGRST116') {
      console.error('Error fetching client:', clientError);
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Set estimated cost for feature requests
    const estimatedCost = feedbackType === 'feature' ? 250 : null;

    // Insert feature request using service role to bypass RLS
    const { data: featureRequest, error: insertError } = await supabase
      .from('feature_requests')
      .insert({
        title: `${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)} Request`, // Generate title from feedback type
        client_id: client?.id || null,
        client_email: clientEmail.toLowerCase(),
        subscription_tier: subscriptionTier,
        page_url: pageUrl || null,
        feedback_type: feedbackType,
        description: description.trim(),
        priority: priority,
        status: 'pending',
        estimated_cost: estimatedCost
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting feature request:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit feature request' },
        { status: 500 }
      );
    }

    // Send email notification
    await sendFeatureRequestEmail(featureRequest);

    return NextResponse.json({
      success: true,
      message: 'Feature request submitted successfully',
      featureRequest
    });

  } catch (error) {
    console.error('Error in feature-requests API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientEmail = searchParams.get('email');

    if (!clientEmail) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Get feature requests for the client
    const { data: featureRequests, error } = await supabase
      .from('feature_requests')
      .select('*')
      .eq('client_email', clientEmail.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feature requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feature requests' },
        { status: 500 }
      );
    }

    // Count by status
    const pending = featureRequests.filter(req => req.status === 'pending').length;
    const completed = featureRequests.filter(req => req.status === 'completed').length;

    return NextResponse.json({
      success: true,
      featureRequests,
      counts: {
        pending,
        completed,
        total: featureRequests.length
      }
    });

  } catch (error) {
    console.error('Error in feature-requests GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 