import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HelpCircle, CheckCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left: Content */}
          <div className="flex flex-col items-start max-w-xl w-full mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Web Platforms That <span className="text-[#004d40]">Scale</span> With Your <span className="text-[#004d40]">Fitness Business</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Custom scheduling, payments, and smart automation – everything fitness trainers need to grow.
            </p>
            <h2 className="text-3xl font-bold text-center mb-8 w-full">Get Started With FitWeb Studio</h2>
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-1 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-5 text-center shadow-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-[#004d40]/20 transition-all duration-500 flex flex-col items-center min-h-[180px] min-w-[240px] hover:scale-105 hover:border-[#004d40]/30 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-full p-2.5 mb-3 shadow-lg">
                  <HelpCircle className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-white font-bold text-lg text-center">Need help choosing<br />a package?</div>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white px-6 py-3 text-base rounded-xl shadow-lg font-bold mt-auto hover:shadow-xl hover:shadow-[#004d40]/30 transition-all duration-300 hover:scale-105"
                >
                  <a href="/#contact">Request Quote</a>
                </Button>
              </div>
              <div className="flex-1 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-5 text-center shadow-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-[#004d40]/20 transition-all duration-500 flex flex-col items-center min-h-[180px] min-w-[240px] hover:scale-105 hover:border-[#004d40]/30 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-full p-2.5 mb-3 shadow-lg">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <div className="mb-2 text-white font-bold text-lg text-center">Already know<br />what you want?</div>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white px-6 py-3 text-base rounded-xl shadow-lg font-bold mt-auto hover:shadow-xl hover:shadow-[#004d40]/30 transition-all duration-300 hover:scale-105"
                >
                  <a href="/#packages">Apply Now</a>
                </Button>
              </div>
            </div>
          </div>
          {/* Right: Logo */}
          <div className="flex justify-center items-center">
            <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-2xl p-8 shadow-2xl">
              <Image
                src="/logo.png"
                alt="FitWeb Studio - Fitness platform mockup"
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
