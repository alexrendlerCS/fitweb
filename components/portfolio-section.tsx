import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-10 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-xl text-gray-300">
            Here's a recent build for a personal trainer platform.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-black border-gray-700 overflow-hidden transition-all duration-500 ease-in-out hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2 max-w-2xl mx-auto">
            <CardContent className="p-0">
              <Link href="/demo/client-dashboard" className="block group relative cursor-pointer" aria-label="See all features demo">
                <Image
                  src="/coachkilday.png"
                  alt="Coach Kilday - Personal trainer platform dashboard"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </Link>

              <div className="p-4">
                <h3 className="text-base font-bold mb-1 text-white">Personal Trainer Dashboard</h3>
                <p className="text-gray-300 mb-2 text-xs">A complete client management system with scheduling, progress tracking, workout plans, and payment processing. Built with modern technologies for optimal performance and user experience.</p>
                <div className="flex flex-wrap gap-2 mb-2 justify-center">
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Next.js</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Stripe Integration</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Real-time Updates</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Mobile Responsive</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Google Calendar Integration</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Full Booking Flow</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Email Integration</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Client Progress Tracking</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Custom Packages</span>
                  <span className="bg-[#004d40] text-white px-2 py-0.5 rounded-full text-xs">Custom Analytics</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full mt-6 py-4 text-lg font-bold rounded-lg bg-gradient-to-r from-[#004d40] to-[#00695c] shadow-lg hover:from-[#00695c] hover:to-[#004d40] text-white transition-all duration-300 border-2 border-[#004d40] hover:scale-105"
              >
                <a
                  href="/demo/client-dashboard"
                  className="block text-center tracking-wide"
                >
                  See All of the Features in Action
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
