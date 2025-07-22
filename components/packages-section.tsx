"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PackagesSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Center by default

  // Mobile: tap to activate, Desktop: hover to activate
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // On mobile, always center the active card
        setActiveIndex(1);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
        "3 preset analytics widgets",
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
        "Top priority support",
        "Custom analytics dashboard (fully customizable, by request)",
        "Multi-trainer and multi-location support",
        "Ongoing strategy calls, feature updates, bug fixes",
        "Unlimited packages per session type",
      ],
      popular: false,
    },
  ];

  return (
    <section id="packages" className="pb-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-0">
          <h2 className="text-4xl font-bold mb-4">Choose Your Package</h2>
          <p className="text-xl text-gray-300">
            Tailored solutions for every stage of your fitness business
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 relative overflow-visible mt-16">
          {packages.map((pkg, idx) => {
            let scale = "scale-90";
            let translate = "";
            let z = "z-10";
            let opacity = "opacity-80";
            if (idx === activeIndex) {
              scale = "scale-125 md:scale-125";
              z = "z-30";
              opacity = "opacity-100";
              translate = "";
            } else if (idx === activeIndex - 1) {
              translate = "-translate-x-1/4";
              z = "z-20";
            } else if (idx === activeIndex + 1) {
              translate = "translate-x-1/4";
              z = "z-20";
            } else {
              scale = "scale-90";
              z = "z-10";
              opacity = "opacity-60";
            }
            return (
              <Card
                key={idx}
                className={`relative bg-black border-gray-700 transition-all duration-500 ease-in-out origin-center ${z} ${scale} ${translate} ${opacity} h-full flex flex-col min-w-[200px] max-w-[270px]`}
                style={{ cursor: isMobile ? "pointer" : "default" }}
                onMouseEnter={() => {
                  if (!isMobile) setActiveIndex(idx);
                }}
                onClick={() => {
                  if (isMobile) setActiveIndex(idx);
                }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#004d40] text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className={`text-center pb-4 p-4 md:p-5`}>
                  <CardTitle className={`font-bold text-white ${idx === activeIndex ? "text-xl md:text-2xl" : "text-lg md:text-xl"}`}>
                    {pkg.name}
                  </CardTitle>
                  <div className={`font-bold text-[#004d40] mt-2 ${idx === activeIndex ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
                    {pkg.price}
                  </div>
                  <p className="text-gray-400 mt-1 text-xs">
                    {pkg.description}
                  </p>
                </CardHeader>
                <CardContent className={`space-y-2 p-4 md:p-5 pt-0 flex-1 flex flex-col`}>
                  <ul className="space-y-1">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-300 text-xs"
                      >
                        <Check className="text-[#004d40] mr-2 h-4 w-4 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full mt-4 rounded-xl bg-[#004d40] hover:bg-[#00695c] text-white font-semibold py-2 text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#004d40]/50"
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
