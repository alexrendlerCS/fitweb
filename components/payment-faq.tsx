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
        "After acceptance, you'll receive a Zoom link with multiple date and time options for our initial consultation. During this call, we'll discuss your project goals, special requests, and any additional charges for premium hosting, domain management, or other services. If everything aligns well, you'll receive a secure Stripe payment link for the initial website creation fee. Once your website is completed and ready for testing, you'll receive another Stripe link for the recurring monthly payments at the agreed-upon price.",
    },
    {
      question: "Can I request a refund?",
      answer:
        "We provide progress checks throughout the development process. Within 7 days of payment, if the progress doesn't meet your expectations or you change your mind, you can request a full refund minus any taxes incurred by Stripe. For payment plans, refund policies vary case-by-case depending on work completed and project stage.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Yes! We offer payment plans for Pro and Elite packages. If you prefer not to pay upfront or want to split the payment, we allow 50% payment upfront and 50% upon website deployment for testing and usage. Refund policies for payment plans vary case-by-case, and monthly recurring payments are required upfront.",
    },
    {
      question: "What happens after I purchase?",
      answer:
        "Immediately after purchase, I begin creating your website and provide a demo link within 7 days where you can view progress and request changes or additional features during development. You'll receive an email with instructions on how to sign up for progress tracking, where you can monitor all changes I make to the website, request new features, and manage your payments.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No hidden fees! The price you see is the price you pay. Any additional costs not listed on our website will be clearly discussed and agreed upon during our initial project consultation. Monthly prices will never increase unless you specifically request additional features.",
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
