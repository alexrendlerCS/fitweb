import Header from "@/components/header";
import Footer from "@/components/footer";
import PackageHero from "@/components/package-hero";
import PackageFeatures from "@/components/package-features";
import PackageFAQ from "@/components/package-faq";
import PurchaseSection from "@/components/purchase-section";
import PaymentFAQ from "@/components/payment-faq";

export default function ProPackage() {
  const packageData = {
    name: "Pro Package",
    price: "$1,250",
    subtitle: "Everything you need to run your fitness business",
    description:
      "Complete business solution with payments, client management, and advanced scheduling.",
    features: [
      {
        title: "Setup Cost: $1,250",
        description:
          "One-time setup fee includes all Pro features and configuration",
      },
      {
        title: "Monthly Cost: $175",
        description:
          "Includes hosting, maintenance, and higher priority support",
      },
      {
        title: "Max Clients: 15",
        description:
          "Perfect for established trainers with growing client base",
      },
      {
        title: "All Starter Features",
        description: "Everything included in the Starter package",
      },
      {
        title: "Bulk Email Integration",
        description:
          "Send newsletters and announcements to all clients at once",
      },
      {
        title: "3 Preset Analytics Widgets",
        description: "Track revenue, bookings, and client engagement",
      },
      {
        title: "Higher Priority Support",
        description: "Faster response times and dedicated support channel",
      },
      {
        title: "Advanced Scheduling",
        description: "Recurring bookings, package deals, and calendar sync",
      },
    ],
    faqs: [
      {
        question: "How long does the Pro package take?",
        answer:
          "The Pro package typically takes 3-4 weeks to complete, including payment setup and testing.",
      },
      {
        question: "What payment methods are supported?",
        answer:
          "Through Stripe, you can accept all major credit cards, Apple Pay, Google Pay, and bank transfers.",
      },
      {
        question: "Can clients book recurring sessions?",
        answer:
          "Yes! The Pro package includes recurring booking functionality and package deals.",
      },
      {
        question: "Is there a transaction fee?",
        answer:
          "Stripe charges 2.9% + 30¢ per transaction. There are no additional fees from me.",
      },
      {
        question: "Can I customize the client dashboard?",
        answer:
          "Yes, the dashboard can be customized with your branding and specific features you need.",
      },
    ],
  };

  const keyFeatures = [
    "Setup Cost: $1,250 + Monthly: $175",
    "Max 15 clients with advanced features",
    "Bulk email integration and analytics",
    "Higher priority support and maintenance",
    "All Starter features included",
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <PackageHero packageData={packageData} />
      <PackageFeatures features={packageData.features} />
      <PurchaseSection
        packageName="Pro Package"
        price="$1,250"
        keyFeatures={keyFeatures}
        packageSlug="pro"
      />
      <PaymentFAQ />
      <PackageFAQ faqs={packageData.faqs} />
      <Footer />
    </main>
  );
}
