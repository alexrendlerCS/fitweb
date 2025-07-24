"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function TestimonialSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const testimonials = [
    {
      name: "Kimberly Joyce",
      role: "Physical Therapist",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "The quick delivery time and amazing design exceeded my expectations. Alex went above and beyond what was expected, creating a platform that perfectly fits my practice needs.",
      rating: 5,
    },
    {
      name: "Coach Kilday",
      role: "Fitness Trainer",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "FitWeb Studio has made managing my business so much easier! Booking clients and selling session packages is now completely seamless. Their team is responsive, reliable, and truly attentive to every detail. My clients love how easy the new system is to use—it's been a total game changer!",
      rating: 5,
    },
    {
      name: "Michael Marx",
      role: "Founder of SecondGlance",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "Alex delivered a product better than what was expected and added more features than expected, making the website better than what was asked for. Truly exceptional work!",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Clients Are Saying</h2>
          <p className="text-xl text-gray-300">
            Real feedback from fitness professionals who've transformed their
            business
          </p>
        </div>

        <div className="flex justify-center gap-4 relative overflow-visible">
          {testimonials.map((testimonial, index) => {
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

            return (
              <Card
                key={index}
                className={`bg-gray-900 border-gray-700 transition-all duration-500 ease-in-out origin-center ${zIndex} ${
                  hoveredIndex === index ? "shadow-2xl shadow-[#004d40]/50" : ""
                }`}
                style={{ transform: transform }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-[#004d40] fill-current h-5 w-5"
                      />
                    ))}
                  </div>

                  <blockquote className="text-gray-300 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
