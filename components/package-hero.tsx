"use client"

import { Button } from "@/components/ui/button"

interface PackageData {
  name: string
  price: string
  subtitle: string
  description: string
}

interface PackageHeroProps {
  packageData: PackageData
}

export default function PackageHero({ packageData }: PackageHeroProps) {
  return (
    <section className="pt-20 pb-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{packageData.name}</h1>
            <div className="text-4xl md:text-5xl font-bold text-[#004d40] mb-4">{packageData.price}</div>
            <p className="text-xl text-gray-300 mb-6">{packageData.subtitle}</p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">{packageData.description}</p>
          </div>

          <Button
            size="lg"
            className="bg-[#004d40] hover:bg-[#00695c] text-white px-8 py-4 text-lg rounded-xl"
            onClick={() => {
              document.getElementById("purchase-section")?.scrollIntoView({
                behavior: "smooth",
              })
            }}
          >
            Scroll to Apply
          </Button>
        </div>
      </div>
    </section>
  )
}
