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
      // Send approval email with zoom link
      const approvalEmailContent = `
Dear ${application.full_name},

Great news! Your FitWeb Studio application has been approved! 🎉

We're excited to work with you on your fitness business website. Let's schedule a call to discuss your project in detail.

**Your Zoom Meeting Link:**
${zoomLink}

**What to expect during our call:**
• We'll discuss your business goals and requirements
• I'll provide a detailed project scope and timeline
• We'll agree on the final pricing and payment terms
• I'll answer any questions you have about the process

**Your Application Details:**
• Business: ${application.business_name}
• Package: ${application.selected_tier.toUpperCase()}
• Goals: ${application.goals}

Please let me know if you need to reschedule or if you have any questions before our call.

Looking forward to working with you!

Best regards,
Alex Rendler
FitWeb Studio
      `.trim();

      try {
        console.log("Sending email to:", application.email);
        await resend.emails.send({
          from: 'FitWeb Studio <alex@fitwebstudio.com>',
          to: [application.email],
          subject: '🎉 Your FitWeb Studio Application is Approved!',
          text: approvalEmailContent,
          html: approvalEmailContent.replace(/\n/g, '<br>'),
        });
        console.log("Approval email sent successfully");
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't fail the request if email fails
      }
    } else if (status === 'rejected') {
      // Send rejection email
      const rejectionEmailContent = `
Dear ${application.full_name},

Thank you for your interest in FitWeb Studio and for taking the time to submit your application.

After careful review of your application, I regret to inform you that we are unable to move forward with your project at this time.

This decision is based on various factors including current workload, project scope alignment, and business fit. Please note that this is not a reflection of your business or the value of your project.

I wish you the best of luck with your fitness business and future endeavors.

Best regards,
Alex Rendler
FitWeb Studio
      `.trim();

      try {
        await resend.emails.send({
          from: 'FitWeb Studio <alex@fitwebstudio.com>',
          to: [application.email],
          subject: 'FitWeb Studio Application Update',
          text: rejectionEmailContent,
          html: rejectionEmailContent.replace(/\n/g, '<br>'),
        });
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
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