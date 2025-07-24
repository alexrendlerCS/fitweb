import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    console.log("API route called");
    const body = await request.json();
    console.log("Request body:", body);
    const {
      full_name,
      email,
      business_name,
      selected_tier,
      goals,
      instagram_url,
      referral_name,
      preferred_times,
    } = body;

    console.log("Inserting into database with data:", {
      full_name,
      email,
      business_name,
      selected_tier,
      goals,
      instagram_url: instagram_url || null,
      referral_name: referral_name || null,
      preferred_times: preferred_times || null,
      status: "pending",
    });

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
          referral_name: referral_name || null,
          preferred_times: preferred_times || null,
          status: "pending",
        },
      ])
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: `Failed to save application: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Database insert successful:", data);

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
${referral_name ? `Referral: ${referral_name}` : "Referral: Not provided"}

Preferred Call Times:
${preferred_times && preferred_times.length > 0 
  ? preferred_times.map((time, index) => `${index + 1}. ${time.day} - ${time.time}`).join('\n')
  : "No preferred times selected"}

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
