"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PackagesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const packages = [
    {
      name: "Starter",
      price: "$1,000",
      description: "Perfect for new trainers or those with a small client base",
      features: [
        "$150+/month",
        "Max 5 clients",
        "Scheduling & payments (Stripe integration)",
        "Client dashboard",
        "Email support",
        "Backend maintenance",
        "Professional design and mobile optimization",
        "Up to 3 packages per session type",
        "Teaser analytics page (blurred, upgrade prompt)",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$1,250",
      description: "For established trainers with a growing client base",
      features: [
        "$175+/month",
        "Max 10 clients",
        "All Starter features",
        "Bulk email integration (newsletters, announcements)",
        "3 preset analytics widgets (Top revenue clients, recent sessions, recent payments; additional analytics blurred with upgrade prompt)",
        "Higher priority support",
        "Advanced scheduling (recurring bookings, package deals, calendar sync)",
        "Up to 4 packages per session type",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "$1,750+",
      description: "For established trainers with a larger client base looking to expand, including support for multiple trainers and locations.",
      features: [
        "$200+/month",
        "Unlimited clients",
        "All Pro features",
        "Editable homepage (customize photos, about, branding)",
        "Top priority support (direct access to dev team, feature requests)",
        "Custom analytics dashboard (fully customizable, by request)",
        "Multi-trainer and multi-location support",
        "Ongoing strategy calls, feature updates, bug fixes",
        "Unlimited packages per session type",
      ],
      popular: false,
    },
  ];

  return (
    <section id="packages" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Package</h2>
          <p className="text-xl text-gray-300">
            Tailored solutions for every stage of your fitness business
          </p>
        </div>

        <div className="flex justify-center gap-4 relative overflow-visible">
          {packages.map((pkg, index) => {
            // Calculate transform based on hover state
            let transform = "";
            let zIndex = "z-10";

            if (hoveredIndex !== null) {
              if (index === hoveredIndex) {
                transform = "scale(1.25) translateX(0)";
                zIndex = "z-30";
              } else if (index === hoveredIndex - 1) {
                transform = "scale(1.05) translateX(-40%)";
                zIndex = "z-20";
              } else if (index === hoveredIndex + 1) {
                transform = "scale(1.05) translateX(40%)";
                zIndex = "z-20";
              } else {
                transform = "scale(0.9) translateX(0)";
                zIndex = "z-10";
              }
            } else {
              // Default state when not hovering
              transform = index === 1 ? "scale(1.1)" : "scale(1.0)";
              zIndex = index === 1 ? "z-30" : "z-10";
            }

            const titleSize = pkg.name === "Pro" ? "text-3xl" : "text-2xl";
            const priceSize = pkg.name === "Pro" ? "text-5xl" : "text-4xl";
            const padding = pkg.name === "Pro" ? "p-8" : "p-7";

            return (
              <Card
                key={index}
                className={`relative bg-black border-gray-700 transition-all duration-500 ease-in-out origin-center ${zIndex} ${
                  pkg.popular
                    ? "border-[#004d40] shadow-lg shadow-[#004d40]/20"
                    : "border-gray-700"
                } ${
                  hoveredIndex === index ? "shadow-2xl shadow-[#004d40]/50" : ""
                }`}
                style={{ transform: transform }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#004d40] text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className={`text-center pb-8 ${padding}`}>
                  <CardTitle className={`font-bold text-white ${titleSize}`}>
                    {pkg.name}
                  </CardTitle>
                  <div className={`font-bold text-[#004d40] mt-4 ${priceSize}`}>
                    {pkg.price}
                  </div>
                  <p className="text-gray-400 mt-2 text-sm">
                    {pkg.description}
                  </p>
                </CardHeader>

                <CardContent className={`space-y-4 ${padding} pt-0`}>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-300 text-sm"
                      >
                        <Check className="text-[#004d40] mr-3 h-5 w-5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className="w-full mt-8 rounded-xl bg-[#004d40] hover:bg-[#00695c] text-white font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#004d40]/50"
                  >
                    <Link href={`/packages/${pkg.name.toLowerCase()}`}>
                      Learn More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
