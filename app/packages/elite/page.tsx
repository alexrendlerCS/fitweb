import Header from "@/components/header"
import Footer from "@/components/footer"
import PackageHero from "@/components/package-hero"
import PackageFeatures from "@/components/package-features"
import PackageFAQ from "@/components/package-faq"
import PurchaseSection from "@/components/purchase-section"
import PaymentFAQ from "@/components/payment-faq"

export default function ElitePackage() {
  const packageData = {
    name: "Elite Package",
    price: "$2,000+",
    subtitle: "Advanced automation and AI tools",
    description: "Enterprise-level solution with AI automation, multi-trainer support, and dedicated ongoing support.",
    features: [
      {
        title: "All Pro Features",
        description: "Everything included in the Pro package",
      },
      {
        title: "AI-Powered Assistant",
        description: "Smart chatbot to handle client inquiries and basic scheduling",
      },
      {
        title: "Custom Automation Workflows",
        description: "Automated follow-ups, progress check-ins, and client onboarding",
      },
      {
        title: "Multi-Trainer Support",
        description: "Manage multiple trainers with individual schedules and pricing",
      },
      {
        title: "Advanced Analytics",
        description: "Detailed insights into your business performance and client engagement",
      },
      {
        title: "Custom Integrations",
        description: "Connect with your favorite fitness apps and tools",
      },
      {
        title: "White-Label Solution",
        description: "Fully branded platform that looks like it was built in-house",
      },
      {
        title: "Mobile App (Optional)",
        description: "Native iOS/Android app for your business (additional cost)",
      },
      {
        title: "Dedicated Support",
        description: "Priority support with monthly check-ins and ongoing updates",
      },
      {
        title: "Custom Features",
        description: "Any additional features specific to your business needs",
      },
    ],
    faqs: [
      {
        question: "How long does the Elite package take?",
        answer: "Elite packages typically take 6-8 weeks due to the custom development and AI integration work.",
      },
      {
        question: "What kind of AI features are included?",
        answer:
          "AI chatbot for customer service, automated workout recommendations, and smart scheduling optimization.",
      },
      {
        question: "Can you handle multiple locations?",
        answer: "Yes! The Elite package can support multiple gym locations with centralized management.",
      },
      {
        question: "What's included in ongoing support?",
        answer: "Monthly strategy calls, feature updates, bug fixes, and priority technical support.",
      },
      {
        question: "Is the mobile app included?",
        answer: "Mobile app development is available as an add-on service starting at $3,000 for both iOS and Android.",
      },
      {
        question: "Can you integrate with existing systems?",
        answer: "Yes, I can integrate with most fitness software, CRMs, and business tools you're already using.",
      },
    ],
  }

  const keyFeatures = [
    "Enterprise-level platform with all Pro features",
    "AI-powered automation and smart chatbot",
    "Multi-trainer support with individual management",
    "Custom integrations with existing business tools",
    "White-label solution with full branding control",
    "Dedicated ongoing support with monthly check-ins",
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <PackageHero packageData={packageData} />
      <PackageFeatures features={packageData.features} />
      <PurchaseSection packageName="Elite Package" price="$2,000+" keyFeatures={keyFeatures} packageSlug="elite" />
      <PaymentFAQ />
      <PackageFAQ faqs={packageData.faqs} />
      <Footer />
    </main>
  )
}
