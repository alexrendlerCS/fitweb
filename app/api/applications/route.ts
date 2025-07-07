import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      business_name,
      selected_tier,
      goals,
      instagram_url,
      calendly_url,
    } = body;

    // Insert application into database
    const { data, error } = await supabase
      .from("trainer_applications")
      .insert([
        {
          full_name,
          email,
          business_name,
          selected_tier,
          goals,
          instagram_url: instagram_url || null,
          calendly_url: calendly_url || null,
          status: "pending",
        },
      ])
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to save application" },
        { status: 500 }
      );
    }

    // Send email notification to admin
    const emailContent = `
New FitWeb Studio Application

Name: ${full_name}
Email: ${email}
Business: ${business_name}
Package: ${selected_tier.toUpperCase()}

Goals & Requirements:
${goals}

Social Links:
${instagram_url ? `Instagram: ${instagram_url}` : "Instagram: Not provided"}
${calendly_url ? `Calendly: ${calendly_url}` : "Calendly: Not provided"}

Application ID: ${data[0].id}

To review this application, visit your admin dashboard or respond directly to this email.
    `.trim();

    // Send email notification using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
          from: "FitWeb Studio <onboarding@resend.dev>",
          to: ["alexrendler@yahoo.com"],
          subject: `New Application: ${business_name} - ${selected_tier} Package`,
          text: emailContent,
          html: emailContent.replace(/\n/g, "<br>"),
        });

        if (error) {
          console.error("Email sending error:", error);
        } else {
          console.log("Application email sent successfully:", data);
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the application submission if email fails
      }
    } else {
      console.log(
        "RESEND_API_KEY not configured - email content:",
        emailContent
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: data[0].id,
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
