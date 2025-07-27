"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PackagesSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Center by default
  const [isMobile, setIsMobile] = useState(false);

  // Mobile: tap to activate, Desktop: hover to activate
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        // On mobile, always center the active card
        setActiveIndex(1);
      }
    };

    // Set initial mobile state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const packages = [
    {
      name: "Starter",
      price: "$1,000",
      description: "Perfect for new trainers or those with a small client base",
      icon: Package,
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
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Pro",
      price: "$1,250",
      description: "For established trainers with a growing client base",
      icon: Zap,
      features: [
        "$175+/month",
        "Max 10 clients",
        "All Starter features",
        "Personalized landing page (build your own brand)",
        "Bulk email integration (newsletters, announcements)",
        "3 preset analytics widgets",
        "Higher priority support",
        "Advanced scheduling (recurring bookings, package deals, calendar sync)",
        "Up to 4 packages per session type",
      ],
      popular: true,
      color: "from-[#004d40] to-[#00695c]",
    },
    {
      name: "Elite",
      price: "$1,750+",
      description:
        "For established trainers with a larger client base looking to expand, including support for multiple trainers and locations.",
      icon: Crown,
      features: [
        "$200+/month",
        "Unlimited clients",
        "All Pro features",
        "Personalized landing page (build your own brand)",
        "Top priority support",
        "Custom analytics dashboard (fully customizable, by request)",
        "Multi-trainer and multi-location support",
        "Ongoing strategy calls, feature updates, bug fixes",
        "Unlimited packages per session type",
      ],
      popular: false,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const nextPackage = () => {
    setActiveIndex((prev) => (prev + 1) % packages.length);
  };

  const prevPackage = () => {
    setActiveIndex((prev) => (prev - 1 + packages.length) % packages.length);
  };

  return (
    <section
      id="packages"
      className="min-h-screen flex items-center bg-gray-900"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="h-6 w-6 text-[#004d40]" />
            <h2 className="text-3xl font-bold">Choose Your Package</h2>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Tailored solutions for every stage of your fitness business
          </p>
        </div>

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={prevPackage}
              className="bg-[#004d40] hover:bg-[#00695c] text-white p-2 rounded-full transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-white text-sm">
              {activeIndex + 1} / {packages.length}
            </div>
            <button
              onClick={nextPackage}
              className="bg-[#004d40] hover:bg-[#00695c] text-white p-2 rounded-full transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex justify-center items-center gap-4 relative overflow-visible mt-6">
          {packages.map((pkg, idx) => {
            let scale = "scale-90";
            let translate = "";
            let z = "z-10";
            let opacity = "opacity-80";

            if (isMobile) {
              // Mobile: Show active package prominently
              if (idx === activeIndex) {
                scale = "scale-110";
                z = "z-30";
                opacity = "opacity-100";
                translate = "";
              } else {
                scale = "scale-90";
                z = "z-10";
                opacity = "opacity-60";
                translate = "";
              }
            } else {
              // Desktop: Hover interactions
              if (idx === activeIndex) {
                scale = "scale-110 md:scale-110";
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
            }

            return (
              <Card
                key={idx}
                className={`relative bg-black border-gray-700 transition-all duration-500 ease-in-out origin-center ${z} ${scale} ${translate} ${opacity} h-full flex flex-col min-w-[200px] max-w-[270px] ${
                  isMobile ? "cursor-pointer" : "cursor-default"
                } hover:shadow-2xl hover:shadow-[#004d40]/20`}
                onMouseEnter={() => {
                  if (!isMobile) setActiveIndex(idx);
                }}
                onClick={() => {
                  if (isMobile) setActiveIndex(idx);
                }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#004d40] to-[#00695c] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
                      ⭐ Popular
                    </span>
                  </div>
                )}
                <CardHeader className={`text-center pb-4 p-4 md:p-5`}>
                  <div
                    className={`bg-gradient-to-r ${pkg.color} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg`}
                  >
                    <pkg.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle
                    className={`font-bold text-white ${
                      idx === activeIndex
                        ? "text-xl md:text-2xl"
                        : "text-lg md:text-xl"
                    }`}
                  >
                    {pkg.name}
                  </CardTitle>
                  <div
                    className={`font-bold text-[#004d40] mt-2 ${
                      idx === activeIndex
                        ? "text-2xl md:text-3xl"
                        : "text-xl md:text-2xl"
                    }`}
                  >
                    {pkg.price}
                  </div>
                  <p className="text-gray-400 mt-1 text-xs leading-relaxed">
                    {pkg.description}
                  </p>
                </CardHeader>
                <CardContent
                  className={`space-y-2 p-4 md:p-5 pt-0 flex-1 flex flex-col`}
                >
                  <ul className="space-y-1">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start text-gray-300 text-xs leading-relaxed"
                      >
                        <Check className="text-[#004d40] mr-2 h-3 w-3 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full mt-4 rounded-xl bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white font-semibold py-2 text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#004d40]/50 group"
                  >
                    <Link
                      href={`/packages/${pkg.name.toLowerCase()}`}
                      className="flex items-center justify-center gap-1"
                    >
                      Learn More
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Package Comparison */}
        <div className="text-center mt-6">
          <div className="bg-gradient-to-r from-[#004d40]/10 to-[#00695c]/10 rounded-xl p-4 border border-[#004d40]/20 max-w-2xl mx-auto">
            <h4 className="text-base font-semibold text-white mb-1">
              Not Sure Which Package Fits?
            </h4>
            <p className="text-gray-300 text-xs mb-3">
              Each package is designed to grow with your business. Start with
              what you need now and upgrade as you expand.
            </p>
            <Button
              asChild
              className="bg-[#004d40] hover:bg-[#00695c] text-white text-sm py-1 px-4"
            >
              <Link href="/#contact">Get Custom Recommendation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
