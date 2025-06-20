import Header from "@/components/header"
import Footer from "@/components/footer"
import PackageHero from "@/components/package-hero"
import PackageFeatures from "@/components/package-features"
import PackageFAQ from "@/components/package-faq"
import PurchaseSection from "@/components/purchase-section"
import PaymentFAQ from "@/components/payment-faq"

export default function ProPackage() {
  const packageData = {
    name: "Pro Package",
    price: "$1,200",
    subtitle: "Everything you need to run your fitness business",
    description: "Complete business solution with payments, client management, and advanced scheduling.",
    features: [
      {
        title: "All Starter Features",
        description: "Everything included in the Starter package",
      },
      {
        title: "Stripe Payment Integration",
        description: "Secure online payments with automatic invoicing and receipts",
      },
      {
        title: "Admin Dashboard",
        description: "Comprehensive dashboard to manage clients, bookings, and payments",
      },
      {
        title: "Client Dashboard",
        description: "Dedicated portal for clients to book sessions, view progress, and make payments",
      },
      {
        title: "Google Calendar Sync",
        description: "Two-way sync with your Google Calendar for seamless scheduling",
      },
      {
        title: "Workout Tracking",
        description: "Tools for clients to log workouts and track progress",
      },
      {
        title: "Progress Photos",
        description: "Secure photo upload and progress tracking system",
      },
      {
        title: "Email Notifications",
        description: "Automated reminders and confirmations for appointments",
      },
      {
        title: "3 Months Support",
        description: "Extended support and training on how to use your new platform",
      },
    ],
    faqs: [
      {
        question: "How long does the Pro package take?",
        answer: "The Pro package typically takes 3-4 weeks to complete, including payment setup and testing.",
      },
      {
        question: "What payment methods are supported?",
        answer: "Through Stripe, you can accept all major credit cards, Apple Pay, Google Pay, and bank transfers.",
      },
      {
        question: "Can clients book recurring sessions?",
        answer: "Yes! The Pro package includes recurring booking functionality and package deals.",
      },
      {
        question: "Is there a transaction fee?",
        answer: "Stripe charges 2.9% + 30¢ per transaction. There are no additional fees from me.",
      },
      {
        question: "Can I customize the client dashboard?",
        answer: "Yes, the dashboard can be customized with your branding and specific features you need.",
      },
    ],
  }

  const keyFeatures = [
    "Complete business platform with all Starter features",
    "Stripe payment integration with automatic invoicing",
    "Admin & client dashboards for full management",
    "Google Calendar sync for seamless scheduling",
    "Workout tracking and progress photo uploads",
    "3 months of dedicated support and training",
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <PackageHero packageData={packageData} />
      <PackageFeatures features={packageData.features} />
      <PurchaseSection packageName="Pro Package" price="$1,200" keyFeatures={keyFeatures} packageSlug="pro" />
      <PaymentFAQ />
      <PackageFAQ faqs={packageData.faqs} />
      <Footer />
    </main>
  )
}
