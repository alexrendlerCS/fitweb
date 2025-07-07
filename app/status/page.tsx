"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Mail,
} from "lucide-react";
import { supabase, TrainerApplication } from "@/lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [application, setApplication] = useState<TrainerApplication | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("trainer_applications")
        .select("*")
        .eq("email", email.toLowerCase())
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setApplication(data[0]);
      } else {
        setError("No application found with this email address");
        setApplication(null);
      }
    } catch (err) {
      console.error("Error checking status:", err);
      setError("Failed to check application status");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-400" />;
      case "approved":
        return <CheckCircle className="h-8 w-8 text-blue-400" />;
      case "paid":
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case "rejected":
        return <XCircle className="h-8 w-8 text-red-400" />;
      default:
        return <Clock className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return {
          title: "Application Under Review",
          message:
            "I'm currently reviewing your application and will get back to you within 24 hours.",
          nextSteps: [
            "Check your email for any follow-up questions",
            "I'll notify you once your application is reviewed",
            "If it's a good fit, I'll send you a Zoom call invitation",
          ],
        };
      case "approved":
        return {
          title: "Application Approved!",
          message:
            "Great news! I'd like to discuss your project. Check your email for a Zoom call invitation.",
          nextSteps: [
            "Check your email for the Zoom call link and available times",
            "Schedule a call to discuss your project in detail",
            "We'll agree on scope and I'll send you the payment link",
          ],
        };
      case "paid":
        return {
          title: "Payment Confirmed!",
          message:
            "Thank you for your payment. We're now building your fitness platform.",
          nextSteps: [
            "We'll contact you within 1-2 weeks with onboarding details",
            "Start preparing your branding materials (logo, colors, photos)",
            "Think about your session types and pricing structure",
          ],
        };
      case "rejected":
        return {
          title: "Application Status",
          message:
            "We've reviewed your application and unfortunately cannot proceed at this time.",
          nextSteps: [
            "Feel free to apply again in the future",
            "Consider reaching out to discuss your specific needs",
            "We may have alternative solutions for your business",
          ],
        };
      default:
        return {
          title: "Unknown Status",
          message: "We couldn't determine your application status.",
          nextSteps: ["Please contact us directly for assistance"],
        };
    }
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      starter: { color: "bg-gray-500", text: "Starter" },
      pro: { color: "bg-[#004d40]", text: "Pro" },
      elite: { color: "bg-purple-500", text: "Elite" },
    };

    const config =
      tierConfig[tier as keyof typeof tierConfig] || tierConfig.starter;

    return (
      <Badge className={`${config.color} text-white`}>{config.text}</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Check Your{" "}
                <span className="text-[#004d40]">Application Status</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Enter your email address to check the status of your FitWeb
                Studio application.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-gray-900 border-gray-700 mb-8">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black border-gray-600 text-white placeholder-gray-400"
                      onKeyPress={(e) => e.key === "Enter" && checkStatus()}
                    />
                    <Button
                      onClick={checkStatus}
                      disabled={isLoading || !email}
                      className="bg-[#004d40] hover:bg-[#00695c]"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Check Status"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Card className="bg-red-900/20 border-red-700">
                  <CardContent className="p-6">
                    <p className="text-red-300">{error}</p>
                  </CardContent>
                </Card>
              )}

              {application && (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {getStatusIcon(application.status)}
                      <div>
                        <CardTitle className="text-white">
                          {getStatusMessage(application.status).title}
                        </CardTitle>
                        <p className="text-gray-300">
                          {getStatusMessage(application.status).message}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm">Name</label>
                        <p className="text-white">{application.full_name}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">
                          Business
                        </label>
                        <p className="text-white">
                          {application.business_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Package</label>
                        <div>{getTierBadge(application.selected_tier)}</div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Applied</label>
                        <p className="text-white">
                          {new Date(
                            application.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {application.status === "approved" &&
                      application.stripe_link && (
                        <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            Payment Link
                          </h3>
                          <p className="text-gray-300 mb-4">
                            Click the button below to complete your payment and
                            start building your platform.
                          </p>
                          <Button
                            asChild
                            className="bg-[#004d40] hover:bg-[#00695c]"
                          >
                            <a
                              href={application.stripe_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Complete Payment
                            </a>
                          </Button>
                        </div>
                      )}

                    <div className="bg-black p-4 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Next Steps
                      </h3>
                      <ul className="space-y-2">
                        {getStatusMessage(application.status).nextSteps.map(
                          (step, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-gray-300"
                            >
                              <span className="text-[#004d40] mt-1">•</span>
                              {step}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="text-center pt-4 border-t border-gray-700">
                      <p className="text-gray-400 mb-4">
                        Need help? Contact us directly
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        <a
                          href="mailto:hello@fitwebstudio.com"
                          className="inline-flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email Support
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
