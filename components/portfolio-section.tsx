import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Eye, Code, Zap, Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PortfolioSection() {
  const features = [
    { icon: Code, label: "Next.js", color: "from-blue-500 to-blue-600" },
    {
      icon: Zap,
      label: "Stripe Integration",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Eye,
      label: "Real-time Updates",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Star,
      label: "Mobile Responsive",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: ExternalLink,
      label: "Google Calendar",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Zap,
      label: "Full Booking Flow",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: ExternalLink,
      label: "Email Integration",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Eye,
      label: "Progress Tracking",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: Star,
      label: "Custom Packages",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Code,
      label: "Custom Analytics",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <section id="portfolio" className="min-h-screen flex items-center bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Eye className="h-6 w-6 text-[#004d40]" />
            <h2 className="text-3xl font-bold">See It In Action</h2>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Here's a recent build showcasing the power of personalized brand
            platforms for fitness professionals.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Project Showcase */}
            <div className="order-2 lg:order-1">
              <Card className="bg-gray-900 border-gray-700 overflow-hidden transition-all duration-500 ease-in-out hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2">
                <CardContent className="p-0">
                  <Link
                    href="/demo/client-dashboard"
                    className="block group relative cursor-pointer"
                    aria-label="See all features demo"
                  >
                    <Image
                      src="/coachkilday.png"
                      alt="Coach Kilday - Personal trainer platform dashboard"
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-200"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute top-4 right-4 bg-[#004d40] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      Live Demo
                    </div>
                  </Link>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white">
                      Personal Trainer Dashboard
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                      A complete client management system with scheduling,
                      progress tracking, workout plans, and payment processing.
                      Built with modern technologies for optimal performance and
                      user experience.
                    </p>

                    {/* Data Points */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-r from-[#004d40]/20 to-[#00695c]/20 rounded-lg p-3 border border-[#004d40]/30">
                        <div className="text-xl font-bold text-[#004d40]">
                          120%
                        </div>
                        <div className="text-gray-300 text-xs">
                          Increase in Clients
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-[#004d40]/20 to-[#00695c]/20 rounded-lg p-3 border border-[#004d40]/30">
                        <div className="text-xl font-bold text-[#004d40]">
                          100+
                        </div>
                        <div className="text-gray-300 text-xs">
                          Sessions Purchased
                        </div>
                      </div>
                    </div>

                    {/* Session Analysis */}

                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#004d40]/50 group"
                    >
                      <a
                        href="/demo/client-dashboard"
                        className="flex items-center justify-center gap-2"
                      >
                        Explore Live Demo
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Details */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  What This Platform Delivers
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  This comprehensive solution transforms how fitness
                  professionals manage their business, providing everything
                  needed to build a strong personal brand and grow their client
                  base.
                </p>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-[#004d40]/50 transition-all duration-300"
                  >
                    <div
                      className={`bg-gradient-to-r ${feature.color} rounded-full p-2 flex-shrink-0`}
                    >
                      <feature.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-300 text-xs font-medium">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
