import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Personal Trainer",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "FitWeb Studio transformed my business! The client dashboard and automated scheduling saved me 10+ hours per week.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Fitness Coach",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "The payment integration was seamless. I went from manual invoicing to automated payments in just one week.",
      rating: 5,
    },
    {
      name: "Emma Chen",
      role: "Yoga Instructor",
      image: "/placeholder.svg?height=80&width=80",
      quote: "Professional, responsive, and delivered exactly what I needed. My clients love the new booking system!",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Clients Are Saying</h2>
          <p className="text-xl text-gray-300">
            Real feedback from fitness professionals who've transformed their business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-[#004d40] fill-current h-5 w-5" />
                  ))}
                </div>

                <blockquote className="text-gray-300 mb-6 italic">"{testimonial.quote}"</blockquote>

                <div className="flex items-center">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
