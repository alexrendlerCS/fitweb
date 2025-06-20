"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function PaymentFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const paymentFaqs = [
    {
      question: "How does payment work?",
      answer:
        "You'll be redirected to a secure Stripe checkout page where you can pay with any major credit card, Apple Pay, or Google Pay. Once payment is confirmed, you'll receive a confirmation email and be contacted within 24 hours to start your onboarding process.",
    },
    {
      question: "Can I request a refund?",
      answer:
        "Refunds are considered on a case-by-case basis depending on work already completed. If you're not satisfied with the initial consultation or planning phase, we offer a full refund within the first 7 days.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "For Pro and Elite packages, we offer payment plans. You can pay 50% upfront and 50% upon completion. Contact us to discuss custom payment arrangements for larger projects.",
    },
    {
      question: "What happens after I purchase?",
      answer:
        "Within 24 hours of purchase, you'll receive a welcome email with next steps, a project questionnaire, and a link to schedule your kickoff call. We'll also send you access to our client portal where you can track progress.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No hidden fees! The price you see is what you pay. The only additional costs might be third-party services you choose (like premium hosting or specific integrations), which we'll discuss upfront.",
    },
  ]

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Payment Questions</h2>
          <p className="text-xl text-gray-300">Everything you need to know about purchasing and payments</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {paymentFaqs.map((faq, index) => (
              <Card key={index} className="bg-black border-gray-700">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-[#004d40] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#004d40] flex-shrink-0" />
                    )}
                  </button>

                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
