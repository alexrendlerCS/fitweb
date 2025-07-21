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
              <div className="flex-1 bg-gray-900/80 rounded-2xl p-8 text-center shadow-lg border border-gray-800 hover:shadow-2xl transition-all duration-300 flex flex-col items-center min-h-[260px] min-w-[240px]">
                <HelpCircle className="h-10 w-10 text-[#004d40] mb-4" />
                <div className="mb-4 text-white font-semibold text-base whitespace-nowrap">Need help choosing a package?</div>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white px-8 py-4 text-lg rounded-xl shadow-md font-bold mt-auto"
                >
                  <a href="/#contact">Request a Quote now</a>
                </Button>
              </div>
              <div className="flex-1 bg-gray-900/80 rounded-2xl p-8 text-center shadow-lg border border-gray-800 hover:shadow-2xl transition-all duration-300 flex flex-col items-center min-h-[260px] min-w-[240px]">
                <CheckCircle className="h-10 w-10 text-[#004d40] mb-4" />
                <div className="mb-4 text-white font-semibold text-base whitespace-nowrap">Already know what you want?</div>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white px-8 py-4 text-lg rounded-xl shadow-md font-bold mt-auto"
                >
                  <a href="/#packages">Apply now</a>
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
                width={600}
                height={400}
                className="rounded-lg shadow-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
