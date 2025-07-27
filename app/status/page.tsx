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
  User,
  LogIn,
  Search,
  Shield,
  Settings,
  BarChart3,
  MessageSquare,
  CreditCard,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { supabase, TrainerApplication } from "@/lib/supabase";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ClientAuthModal from "@/components/client-auth-modal";

interface ClientStatus {
  hasAccount: boolean;
  hasPassword: boolean;
  canAccess: boolean;
  projectStatus: string;
  message: string;
}

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [application, setApplication] = useState<TrainerApplication | null>(
    null
  );
  const [clientStatus, setClientStatus] = useState<ClientStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");

  const checkStatus = async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setClientStatus(null);

    try {
      // Check trainer application status
      const { data, error } = await supabase
        .from("trainer_applications")
        .select("*")
        .eq("email", email.toLowerCase())
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setApplication(data[0]);

        // If application is approved, check client status
        if (data[0].status === "approved") {
          await checkClientStatus();
        }
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

  const checkClientStatus = async () => {
    try {
      const response = await fetch("/api/client/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setClientStatus(data);
    } catch (err) {
      console.error("Error checking client status:", err);
    }
  };

  const handleAuthClick = (mode: "signup" | "login") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
    // Refresh client status after authentication
    if (application?.status === "approved") {
      checkClientStatus();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-400" />;
      case "approved":
        return <CheckCircle className="h-8 w-8 text-green-400" />;
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

  const dashboardFeatures = [
    {
      icon: Settings,
      title: "Request Features",
      description: "Submit new feature requests and changes",
    },
    {
      icon: BarChart3,
      title: "View History",
      description: "Track all project changes and updates",
    },
    {
      icon: CreditCard,
      title: "Manage Payments",
      description: "Handle billing and payment information",
    },
    {
      icon: Calendar,
      title: "Track Progress",
      description: "Monitor project development timeline",
    },
    {
      icon: MessageSquare,
      title: "Communicate",
      description: "Direct messaging with development team",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Project Status &{" "}
                <span className="text-[#004d40] bg-gradient-to-r from-[#004d40] to-[#00695c] bg-clip-text text-transparent">
                  Client Dashboard
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Check your project status and access your client dashboard to
                manage your platform, request features, view change history, and
                handle payments.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Email Input Section */}
              <Card className="bg-black border-gray-700 mb-12 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="bg-[#004d40]/10 p-3 rounded-full w-fit mx-auto mb-4">
                      <Search className="h-6 w-6 text-[#004d40]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Enter Your Email Address
                    </h2>
                    <p className="text-gray-400">
                      Check your project status or access your client dashboard
                    </p>
                  </div>
                  <div className="flex gap-4 max-w-md mx-auto">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40] focus:ring-[#004d40]"
                      onKeyPress={(e) => e.key === "Enter" && checkStatus()}
                    />
                    <Button
                      onClick={checkStatus}
                      disabled={isLoading || !email}
                      className="bg-[#004d40] hover:bg-[#00695c] px-6 transition-all duration-300 hover:scale-105"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Check Status
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Error Message */}
              {error && (
                <Card className="bg-red-900/20 border-red-700 mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <p className="text-red-300">{error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Application Status - For Non-Approved or Approved Without Account */}
              {application && application.status !== "approved" && (
                <Card className="bg-black border-gray-700 shadow-2xl">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#004d40]/10 p-3 rounded-full">
                        {getStatusIcon(application.status)}
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">
                          {getStatusMessage(application.status).title}
                        </CardTitle>
                        <p className="text-gray-300 text-lg">
                          {getStatusMessage(application.status).message}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <label className="text-gray-400 text-sm font-medium">
                          Name
                        </label>
                        <p className="text-white text-lg font-semibold">
                          {application.full_name}
                        </p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <label className="text-gray-400 text-sm font-medium">
                          Business
                        </label>
                        <p className="text-white text-lg font-semibold">
                          {application.business_name}
                        </p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <label className="text-gray-400 text-sm font-medium">
                          Package
                        </label>
                        <div className="mt-1">
                          {getTierBadge(application.selected_tier)}
                        </div>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <label className="text-gray-400 text-sm font-medium">
                          Applied
                        </label>
                        <p className="text-white text-lg font-semibold">
                          {new Date(
                            application.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <ArrowRight className="h-5 w-5 text-[#004d40]" />
                        Next Steps
                      </h3>
                      <ul className="space-y-3">
                        {getStatusMessage(application.status).nextSteps.map(
                          (step, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-gray-300"
                            >
                              <span className="text-[#004d40] mt-1 text-lg">
                                •
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Contact Support */}
                    <div className="text-center pt-6 border-t border-gray-700">
                      <p className="text-gray-400 mb-4 text-lg">
                        Need help? Contact us directly
                      </p>
                      <Button
                        asChild
                        className="bg-[#004d40] hover:bg-[#00695c] text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
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

              {/* Approved Application - No Account Exists */}
              {application &&
                application.status === "approved" &&
                clientStatus &&
                !clientStatus.hasAccount && (
                  <Card className="bg-black border-gray-700 shadow-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#004d40]/10 p-3 rounded-full">
                          {getStatusIcon(application.status)}
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-white">
                            {getStatusMessage(application.status).title}
                          </CardTitle>
                          <p className="text-gray-300 text-lg">
                            {getStatusMessage(application.status).message}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Project Details - More Compact */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                          <label className="text-gray-400 text-xs font-medium">
                            Name
                          </label>
                          <p className="text-white font-semibold">
                            {application.full_name}
                          </p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                          <label className="text-gray-400 text-xs font-medium">
                            Business
                          </label>
                          <p className="text-white font-semibold">
                            {application.business_name}
                          </p>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                          <label className="text-gray-400 text-xs font-medium">
                            Package
                          </label>
                          <div className="mt-1">
                            {getTierBadge(application.selected_tier)}
                          </div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                          <label className="text-gray-400 text-xs font-medium">
                            Applied
                          </label>
                          <p className="text-white font-semibold">
                            {new Date(
                              application.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Dashboard Signup Section - More Compact */}
                      <div className="bg-black border border-gray-700 p-6 rounded-xl shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="bg-[#004d40]/20 p-3 rounded-lg">
                            <Shield className="w-6 h-6 text-[#004d40]" />
                          </div>
                          <div className="flex-1">
                            <div className="bg-[#004d40]/10 border border-[#004d40]/30 p-4 rounded-lg mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-[#004d40] rounded-full"></div>
                                <span className="text-[#004d40] font-semibold text-sm">
                                  Account Required
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm">
                                Sign up for an account to access your client
                                dashboard and manage your project.
                              </p>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                              Set Up Your Client Dashboard
                            </h3>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                              Create your account to access your project
                              dashboard and manage your platform.
                            </p>

                            {/* Dashboard Features - More Compact Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                              {dashboardFeatures.map((feature, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-900/50 p-3 rounded-lg border border-gray-700"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <feature.icon className="h-4 w-4 text-[#004d40]" />
                                    <h4 className="text-xs font-semibold text-white">
                                      {feature.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {feature.description}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <Button
                              onClick={() => handleAuthClick("signup")}
                              className="bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Create Dashboard Account
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Payment Link - More Compact */}
                      {application.stripe_link && (
                        <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-500/20 p-2 rounded-lg">
                              <CreditCard className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                Complete Your Payment
                              </h3>
                              <p className="text-gray-300 text-sm">
                                Click the button below to complete your payment
                                and start building your platform.
                              </p>
                            </div>
                          </div>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
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

                      {/* Next Steps - More Compact */}
                      <div className="bg-black border border-gray-700 p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-[#004d40]" />
                          Next Steps
                        </h3>
                        <ul className="space-y-2">
                          {getStatusMessage(application.status).nextSteps.map(
                            (step, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-gray-300 text-sm"
                              >
                                <span className="text-[#004d40] mt-1">•</span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Contact Support - More Compact */}
                      <div className="text-center pt-4 border-t border-gray-700">
                        <p className="text-gray-400 mb-3 text-sm">
                          Need help? Contact us directly
                        </p>
                        <Button
                          asChild
                          className="bg-[#004d40] hover:bg-[#00695c] text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
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

              {/* Client Dashboard Login - Account Exists */}
              {application &&
                application.status === "approved" &&
                clientStatus &&
                clientStatus.hasAccount && (
                  <Card className="bg-black border-gray-700 shadow-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#004d40]/10 p-3 rounded-full">
                          <Shield className="w-8 h-8 text-[#004d40]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-white">
                            Client Dashboard Login
                          </CardTitle>
                          <p className="text-gray-300 text-lg">
                            Welcome back! Access your project dashboard to
                            manage your platform.
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Simple Login Section */}
                      <div className="bg-[#004d40]/10 border border-[#004d40]/30 p-6 rounded-lg">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-white mb-3">
                            Ready to Access Your Dashboard
                          </h3>
                          <p className="text-gray-300 mb-6">
                            Your account is ready. Click below to access your
                            dashboard and manage your project.
                          </p>

                          <Button
                            onClick={() => handleAuthClick("login")}
                            className="bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
                          >
                            <LogIn className="h-5 w-5 mr-3" />
                            Access Dashboard
                          </Button>
                        </div>
                      </div>

                      {/* Contact Support */}
                      <div className="text-center pt-4 border-t border-gray-700">
                        <p className="text-gray-400 mb-3 text-sm">
                          Need help? Contact us directly
                        </p>
                        <Button
                          asChild
                          className="bg-[#004d40] hover:bg-[#00695c] text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
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

      <ClientAuthModal
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        email={email}
        mode={authMode}
      />
    </div>
  );
}
