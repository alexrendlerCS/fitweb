import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json({
        success: true,
        message:
          "Email service not configured - check server logs for quote request",
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Email content for Alex
    const emailContent = `
New Quote Request from FitWeb Studio Website

Name: ${name}
Email: ${email}

Message:
${message}

---
This quote request was submitted through the contact form on your website.
    `.trim();

    const { data, error } = await resend.emails.send({
      from: "FitWeb Studio <onboarding@resend.dev>",
      to: ["alexrendler@yahoo.com"],
      subject: `New Quote Request: ${name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    });

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    console.log("Quote request email sent successfully:", data);
    return NextResponse.json({
      success: true,
      message: "Quote request sent successfully",
      data: data,
    });
  } catch (error) {
    console.error("Quote request API error:", error);
    return NextResponse.json(
      { error: "Failed to process quote request" },
      { status: 500 }
    );
  }
}
