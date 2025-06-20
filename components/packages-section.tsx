import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PackagesSection() {
  const packages = [
    {
      name: "Starter",
      price: "$500",
      description: "Perfect for new trainers getting started",
      features: [
        "Basic website design",
        "Scheduling form integration",
        "Mobile responsive",
        "Contact form",
        "Basic SEO setup",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$1,200",
      description: "Everything you need to run your business",
      features: [
        "Everything in Starter",
        "Stripe payment integration",
        "Client dashboard",
        "Workout tracking",
        "Progress photos",
        "Email notifications",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "$2,000+",
      description: "Advanced automation and AI tools",
      features: [
        "Everything in Pro",
        "Custom automation workflows",
        "AI coaching recommendations",
        "Google Calendar sync",
        "Advanced analytics",
        "Ongoing support & updates",
      ],
      popular: false,
    },
  ]

  return (
    <section id="packages" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Package</h2>
          <p className="text-xl text-gray-300">Tailored solutions for every stage of your fitness business</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative bg-black border-gray-700 ${
                pkg.popular ? "border-[#004d40] shadow-lg shadow-[#004d40]/20" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#004d40] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white">{pkg.name}</CardTitle>
                <div className="text-4xl font-bold text-[#004d40] mt-4">{pkg.price}</div>
                <p className="text-gray-400 mt-2">{pkg.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="text-[#004d40] mr-3 h-5 w-5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full mt-8 rounded-xl ${
                    pkg.popular ? "bg-[#004d40] hover:bg-[#00695c]" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <Link href={`/packages/${pkg.name.toLowerCase()}`}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
