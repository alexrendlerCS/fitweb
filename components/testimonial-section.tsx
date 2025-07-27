"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function TestimonialSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(1); // Center testimonial by default
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile and handle interactions
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setHoveredIndex(null); // Clear hover state on mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const stats = [
    {
      icon: DollarSign,
      value: "$3,000+",
      label: "Client Payments Handled",
      description: "Secure transactions processed through our platforms",
    },
    {
      icon: Users,
      value: "12+",
      label: "Active Clients",
      description: "Fitness professionals using our services consistently",
    },
    {
      icon: Calendar,
      value: "60+",
      label: "Sessions Booked",
      description: "Successful appointments scheduled through our systems",
    },
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="testimonials"
      className="min-h-screen flex items-center bg-gray-900"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Quote className="h-6 w-6 text-[#004d40]" />
            <h2 className="text-3xl font-bold">Client Success Stories</h2>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real feedback from fitness professionals who've transformed their
            business with our personalized brand platforms
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-black border-gray-700 hover:border-[#004d40]/50 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(0,77,64,0.25)] hover:-translate-y-2"
            >
              <CardContent className="p-4 text-center">
                <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[#004d40] font-semibold text-sm mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-xs">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-1">
              What Our Clients Say
            </h3>
            <p className="text-gray-400 text-sm">
              {isMobile
                ? "Tap cards to see more details"
                : "Hover over cards to see more details"}
            </p>
          </div>

          {/* Mobile Navigation */}
          {isMobile && (
            <div className="flex justify-center items-center gap-4 mb-6">
              <button
                onClick={prevTestimonial}
                className="bg-[#004d40] hover:bg-[#00695c] text-white p-2 rounded-full transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-white text-sm">
                {activeIndex + 1} / {testimonials.length}
              </div>
              <button
                onClick={nextTestimonial}
                className="bg-[#004d40] hover:bg-[#00695c] text-white p-2 rounded-full transition-colors duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex justify-center gap-4 relative overflow-visible">
            {testimonials.map((testimonial, index) => {
              // Calculate transform based on device and state
              let transform = "";
              let zIndex = "z-10";
              let opacity = "opacity-100";

              if (isMobile) {
                // Mobile: Show active testimonial prominently
                if (index === activeIndex) {
                  transform = "scale(1.1)";
                  zIndex = "z-30";
                  opacity = "opacity-100";
                } else {
                  transform = "scale(0.9)";
                  zIndex = "z-10";
                  opacity = "opacity-60";
                }
              } else {
                // Desktop: Hover interactions
                if (hoveredIndex !== null) {
                  if (index === hoveredIndex) {
                    transform = "scale(1.15) translateX(0)";
                    zIndex = "z-30";
                    opacity = "opacity-100";
                  } else if (index === hoveredIndex - 1) {
                    transform = "scale(1.05) translateX(-30%)";
                    zIndex = "z-20";
                    opacity = "opacity-80";
                  } else if (index === hoveredIndex + 1) {
                    transform = "scale(1.05) translateX(30%)";
                    zIndex = "z-20";
                    opacity = "opacity-80";
                  } else {
                    transform = "scale(0.9) translateX(0)";
                    zIndex = "z-10";
                    opacity = "opacity-60";
                  }
                } else {
                  // Default state when not hovering
                  transform = index === 1 ? "scale(1.1)" : "scale(1.0)";
                  zIndex = index === 1 ? "z-30" : "z-10";
                  opacity = "opacity-100";
                }
              }

              return (
                <Card
                  key={index}
                  className={`bg-black border-gray-700 transition-all duration-500 ease-in-out origin-center ${zIndex} ${opacity} ${
                    (isMobile ? index === activeIndex : hoveredIndex === index)
                      ? "shadow-2xl shadow-[#004d40]/50"
                      : ""
                  } ${isMobile ? "cursor-pointer" : ""}`}
                  style={{ transform: transform }}
                  onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                  onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                  onClick={() => isMobile && setActiveIndex(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="text-[#004d40] fill-current h-4 w-4"
                        />
                      ))}
                    </div>

                    <blockquote className="text-gray-300 mb-6 italic text-base leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="flex items-center pt-3 border-t border-gray-700">
                      <div className="bg-gradient-to-br from-[#004d40] to-[#00695c] rounded-full p-1 mr-3">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-base">
                          {testimonial.name}
                        </div>
                        <div className="text-[#004d40] text-sm font-medium">
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
      </div>
    </section>
  );
}
