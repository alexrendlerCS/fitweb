import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-xl text-gray-300">
            Here's a recent build for a personal trainer platform.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-black border-gray-700 overflow-hidden transition-all duration-500 ease-in-out hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src="/coachkilday.png"
                  alt="Coach Kilday - Personal trainer platform dashboard"
                  width={800}
                  height={400}
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Personal Trainer Dashboard
                </h3>
                <p className="text-gray-300 mb-6">
                  A complete client management system with scheduling, progress
                  tracking, workout plans, and payment processing. Built with
                  modern technologies for optimal performance and user
                  experience.
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="bg-[#004d40] text-white px-3 py-1 rounded-full text-sm">
                    Next.js
                  </span>
                  <span className="bg-[#004d40] text-white px-3 py-1 rounded-full text-sm">
                    Stripe Integration
                  </span>
                  <span className="bg-[#004d40] text-white px-3 py-1 rounded-full text-sm">
                    Real-time Updates
                  </span>
                  <span className="bg-[#004d40] text-white px-3 py-1 rounded-full text-sm">
                    Mobile Responsive
                  </span>
                </div>

                <Button
                  asChild
                  className="bg-[#004d40] hover:bg-[#00695c] text-white rounded-xl"
                >
                  <a
                    href="https://personal-trainer-ruddy.vercel.app/client/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    View Client Dashboard
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
