import Header from "@/components/header"
import Footer from "@/components/footer"
import PackageHero from "@/components/package-hero"
import PackageFeatures from "@/components/package-features"
import PackageFAQ from "@/components/package-faq"
import PurchaseSection from "@/components/purchase-section"
import PaymentFAQ from "@/components/payment-faq"

export default function StarterPackage() {
  const packageData = {
    name: "Starter Package",
    price: "$500",
    subtitle: "Perfect for new trainers getting started",
    description: "Get your fitness business online with a professional website and essential booking features.",
    features: [
      {
        title: "Responsive Landing Page",
        description: "Mobile-friendly website that looks great on all devices",
      },
      {
        title: "Simple Scheduling Form",
        description: "Easy-to-use contact form for client inquiries and basic scheduling",
      },
      {
        title: "Basic Contact Integration",
        description: "Email notifications and contact management system",
      },
      {
        title: "Professional Design",
        description: "Custom design that reflects your brand and builds trust",
      },
      {
        title: "Basic SEO Setup",
        description: "Search engine optimization to help clients find you online",
      },
      {
        title: "1 Month Support",
        description: "Basic support and minor updates for the first month",
      },
    ],
    faqs: [
      {
        question: "How long does it take to build?",
        answer: "The Starter package typically takes 1-2 weeks to complete, depending on content and feedback cycles.",
      },
      {
        question: "Can I upgrade later?",
        answer: "You can upgrade to Pro or Elite at any time. We'll credit your Starter investment toward the upgrade.",
      },
      {
        question: "Do I need to provide content?",
        answer:
          "Yes, you'll need to provide your bio, services, pricing, and any photos you'd like to use. I'll help guide you through what's needed.",
      },
      {
        question: "Is hosting included?",
        answer: "The first year of hosting is included. After that, hosting costs approximately $10-15/month.",
      },
    ],
  }

  const keyFeatures = [
    "Professional responsive website design",
    "Scheduling form integration for client bookings",
    "Basic SEO optimization for online visibility",
    "Professional branding and custom design",
    "1 month of support and minor updates",
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <PackageHero packageData={packageData} />
      <PackageFeatures features={packageData.features} />
      <PurchaseSection packageName="Starter Package" price="$500" keyFeatures={keyFeatures} packageSlug="starter" />
      <PaymentFAQ />
      <PackageFAQ faqs={packageData.faqs} />
      <Footer />
    </main>
  )
}
