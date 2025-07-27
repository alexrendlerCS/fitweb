import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HelpCircle, CheckCircle, Star, Globe, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="flex flex-col items-start max-w-xl w-full mx-auto space-y-8">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#004d40]" />
              <span className="text-sm text-gray-400">
                Personalized Brand Platforms
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your <span className="text-[#004d40]">Personal Brand</span>{" "}
              Website That <span className="text-[#004d40]">Grows</span> With
              You
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              I build custom websites that become the foundation of your fitness
              brand. Your name, your story, your platform – with powerful
              scheduling and payment tools built right in.
            </p>

            {/* Key Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#004d40] rounded-full p-1">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300">
                  Your own branded website and domain
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#004d40] rounded-full p-1">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300">
                  Build your personal brand and reputation
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#004d40] rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300">
                  Integrated scheduling & payment systems
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center w-full pt-4">
              Start Building Your Brand Today
            </h2>
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="flex-1 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 text-center shadow-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-[#004d40]/20 transition-all duration-500 flex flex-col items-center min-h-[180px] min-w-[220px] hover:scale-105 hover:border-[#004d40]/30 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-full p-2.5 mb-3 shadow-lg">
                  <HelpCircle className="h-6 w-6 text-white" />
                </div>
                <div className="mb-2 text-white font-bold text-base text-center">
                  Not sure which
                  <br />
                  package fits?
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white px-4 py-2 text-sm rounded-xl shadow-lg font-bold mt-auto hover:shadow-xl hover:shadow-[#004d40]/30 transition-all duration-300 hover:scale-105"
                >
                  <a href="/#contact">Get Custom Quote</a>
                </Button>
              </div>
              <div className="flex-1 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 text-center shadow-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-[#004d40]/20 transition-all duration-500 flex flex-col items-center min-h-[180px] min-w-[220px] hover:scale-105 hover:border-[#004d40]/30 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-full p-2.5 mb-3 shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="mb-2 text-white font-bold text-base text-center">
                  Ready to build
                  <br />
                  your brand?
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white px-4 py-2 text-sm rounded-xl shadow-lg font-bold mt-auto hover:shadow-xl hover:shadow-[#004d40]/30 transition-all duration-300 hover:scale-105"
                >
                  <a href="/#packages">Choose Package</a>
                </Button>
              </div>
            </div>
          </div>
          {/* Right: Logo */}
          <div className="flex justify-center items-center">
            <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-2xl p-8 shadow-2xl">
              <Image
                src="/logo.png"
                alt="FitWeb Studio - Personalized trainer brand platform"
                width={480}
                height={320}
                className="rounded-lg shadow-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
