import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section id="home" className="pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Web Platforms That <span className="text-[#004d40]">Scale</span> With Your{" "}
              <span className="text-[#004d40]">Fitness Business</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Custom scheduling, payments, and smart automation – everything fitness trainers need to grow.
            </p>

            <Button size="lg" className="bg-[#004d40] hover:bg-[#00695c] text-white px-8 py-4 text-lg rounded-xl">
              Get a Free Consultation
            </Button>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-2xl p-8 shadow-2xl">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Fitness platform mockup"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
