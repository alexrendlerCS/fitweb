import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log("API route called");
    const body = await request.json();
    console.log("Request body:", body);
    const { id, status, zoomLink } = body;
    console.log("Extracted values:", { id, status, zoomLink });

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    console.log("Fetching application with ID:", id);
    // Get the application details first
    const { data: application, error: fetchError } = await supabase
      .from('trainer_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      console.error("Error fetching application:", fetchError);
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    console.log("Application found:", application);

    // Update the application status
    const updateData: any = { status };
    if (zoomLink) {
      updateData.zoom_link = zoomLink;
      console.log("Zoom link to be stored:", zoomLink);
    }

    console.log("Updating application with data:", updateData);

    const { error: updateError } = await supabase
      .from('trainer_applications')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error("Error updating application:", updateError);
      return NextResponse.json(
        { error: `Failed to update application status: ${updateError.message}` },
        { status: 500 }
      );
    }

    console.log("Application updated successfully");

    // Verify the update by fetching the updated application
    const { data: updatedApplication, error: verifyError } = await supabase
      .from('trainer_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (verifyError) {
      console.error("Error verifying update:", verifyError);
    } else {
      console.log("Verified updated application:", updatedApplication);
    }

    // Send email based on status
    console.log("Checking email conditions:", { status, zoomLink });
    if (status === 'approved' && zoomLink) {
      console.log("Sending approval email...");
      
      // Validate that we're not sending to the admin email
      if (application.email === 'alexrendler@yahoo.com') {
        console.warn("WARNING: Attempting to send approval email to admin email address:", application.email);
        console.warn("This might be a test application. Email will still be sent but please verify the recipient.");
      }
      
      // Send approval email with zoom link
      const approvalEmailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Approved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #004d40 0%, #00695c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #004d40; margin-bottom: 5px; }
            .value { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #004d40; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; color: white; font-size: 12px; font-weight: bold; }
            .tier-elite { background-color: #7c3aed; }
            .tier-pro { background-color: #3b82f6; }
            .tier-starter { background-color: #6b7280; }
            .zoom-link { background: #e8f5e8; border: 2px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Application Approved!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to FitWeb Studio</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">👤 Client Information</div>
                <div class="value">
                  <strong>Name:</strong> ${application.full_name}<br>
                  <strong>Business:</strong> ${application.business_name}<br>
                  <strong>Package:</strong> 
                  <span class="badge tier-${application.selected_tier}">${application.selected_tier.toUpperCase()}</span>
                </div>
              </div>

              <div class="field">
                <div class="label">📅 Your Zoom Meeting</div>
                <div class="zoom-link">
                  <strong>Meeting Link:</strong><br>
                  <a href="${zoomLink}" style="color: #004d40; text-decoration: none; font-weight: bold;">${zoomLink}</a>
                </div>
              </div>

              <div class="field">
                <div class="label">📋 What to Expect</div>
                <div class="value">
                  • We'll discuss your business goals and requirements<br>
                  • I'll provide a detailed project scope and timeline<br>
                  • We'll agree on the final pricing and payment terms<br>
                  • I'll answer any questions you have about the process
                </div>
              </div>

              <div class="field">
                <div class="label">🎯 Your Goals</div>
                <div class="value">
                  ${application.goals}
                </div>
              </div>

              ${application.preferred_times && application.preferred_times.length > 0 ? `
              <div class="field">
                <div class="label">⏰ Your Preferred Times</div>
                <div class="value">
                  ${application.preferred_times.map((time, index) => `${index + 1}. ${time.day} - ${time.time}`).join('<br>')}
                </div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">📊 Application Details</div>
                <div class="value">
                  <strong>Application ID:</strong> ${application.id}<br>
                  <strong>Status:</strong> <span class="badge" style="background-color: #10b981;">APPROVED</span><br>
                  <strong>Submitted:</strong> ${new Date(application.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div class="footer">
              <p>Please let me know if you need to reschedule or if you have any questions before our call.</p>
              <p>Looking forward to working with you!</p>
              <p><strong>Best regards,<br>Alex Rendler<br>FitWeb Studio</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        console.log("Sending email to:", application.email);
        console.log("Email content preview:", approvalEmailContent.substring(0, 200) + "...");
        
        const emailResult = await resend.emails.send({
          from: 'FitWeb Studio <onboarding@resend.dev>',
          to: [application.email],
          subject: '🎉 Your FitWeb Studio Application is Approved!',
          text: approvalEmailContent,
          html: approvalEmailContent.replace(/\n/g, '<br>'),
        });
        
        console.log("Approval email sent successfully to:", application.email);
        console.log("Email result:", emailResult);
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        console.error('Email error details:', {
          to: application.email,
          from: 'FitWeb Studio <onboarding@resend.dev>',
          error: emailError
        });
        // Don't fail the request if email fails
      }
    } else if (status === 'rejected') {
      // Send rejection email
      
      // Validate that we're not sending to the admin email
      if (application.email === 'alexrendler@yahoo.com') {
        console.warn("WARNING: Attempting to send rejection email to admin email address:", application.email);
        console.warn("This might be a test application. Email will still be sent but please verify the recipient.");
      }
      
      const rejectionEmailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #dc2626; margin-bottom: 5px; }
            .value { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; color: white; font-size: 12px; font-weight: bold; }
            .tier-elite { background-color: #7c3aed; }
            .tier-pro { background-color: #3b82f6; }
            .tier-starter { background-color: #6b7280; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">📋 Application Update</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your interest in FitWeb Studio</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">👤 Application Information</div>
                <div class="value">
                  <strong>Name:</strong> ${application.full_name}<br>
                  <strong>Business:</strong> ${application.business_name}<br>
                  <strong>Package:</strong> 
                  <span class="badge tier-${application.selected_tier}">${application.selected_tier.toUpperCase()}</span>
                </div>
              </div>

              <div class="field">
                <div class="label">📝 Application Status</div>
                <div class="value">
                  <span class="badge" style="background-color: #dc2626;">NOT APPROVED</span><br><br>
                  Thank you for your interest in FitWeb Studio and for taking the time to submit your application.<br><br>
                  After careful review of your application, I regret to inform you that we are unable to move forward with your project at this time.<br><br>
                  This decision is based on various factors including current workload, project scope alignment, and business fit. Please note that this is not a reflection of your business or the value of your project.
                </div>
              </div>

              <div class="field">
                <div class="label">🎯 Your Goals</div>
                <div class="value">
                  ${application.goals}
                </div>
              </div>

              <div class="field">
                <div class="label">📊 Application Details</div>
                <div class="value">
                  <strong>Application ID:</strong> ${application.id}<br>
                  <strong>Submitted:</strong> ${new Date(application.created_at).toLocaleString()}<br>
                  <strong>Reviewed:</strong> ${new Date().toLocaleString()}
                </div>
              </div>
            </div>

            <div class="footer">
              <p>I wish you the best of luck with your fitness business and future endeavors.</p>
              <p><strong>Best regards,<br>Alex Rendler<br>FitWeb Studio</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        console.log("Sending rejection email to:", application.email);
        const emailResult = await resend.emails.send({
          from: 'FitWeb Studio <onboarding@resend.dev>',
          to: [application.email],
          subject: 'FitWeb Studio Application Update',
          text: rejectionEmailContent,
          html: rejectionEmailContent.replace(/\n/g, '<br>'),
        });
        console.log("Rejection email sent successfully to:", application.email);
        console.log("Email result:", emailResult);
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
        console.error('Email error details:', {
          to: application.email,
          from: 'FitWeb Studio <onboarding@resend.dev>',
          error: emailError
        });
        // Don't fail the request if email fails
      }
    }

    console.log("Returning success response");
    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`,
      application: updatedApplication || { ...application, ...updateData }
    });

  } catch (error) {
    console.error('Error in update-application API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 