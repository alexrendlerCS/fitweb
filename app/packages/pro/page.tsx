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
    subtitle: "For established trainers with a growing client base",
    description:
      "Complete business solution with payments, client management, advanced scheduling, and support for up to 10 clients.",
    features: [
      {
        title: "Setup Cost: $1,250",
        description:
          "One-time setup fee includes all Pro features and configuration",
      },
      {
        title: "Monthly Cost: $175+",
        description:
          "Base price includes hosting, maintenance, and higher priority support. Add-ons available for additional monthly cost.",
      },
      {
        title: "Max Clients: 10",
        description:
          "Perfect for established trainers with a growing client base",
      },
      {
        title: "All Starter Features",
        description: "Everything included in the Starter package",
      },
      {
        title: "Personalized Landing Page (Build Your Own Brand)",
        description: "Custom landing page with your branding, colors, logo, and messaging to showcase your unique fitness business",
      },
      {
        title: "Bulk Email Integration (Newsletters, Announcements)",
        description:
          "Send newsletters and announcements to all clients at once",
      },
      {
        title: "3 Preset Analytics Widgets",
        description: "Top revenue clients, recent sessions, recent payments; additional analytics blurred with upgrade prompt",
      },
      {
        title: "Higher Priority Support",
        description: "Faster response times and dedicated support channel",
      },
      {
        title: "Advanced Scheduling (Recurring Bookings, Package Deals, Calendar Sync)",
        description: "Advanced scheduling features for your business",
      },
      {
        title: "Up to 4 Packages per Session Type",
        description: "Offer up to 4 different packages for each session type",
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
        question: "What happens if I miss a payment?",
        answer:
          "If a monthly payment is missed, there will be a 4-day grace period to make up the payment. Otherwise, the website will no longer be hosted or accessible to trainers or clients.",
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
    "Setup Cost: $1,250 + Monthly: $175+",
    "Max 10 clients with advanced features",
    "Personalized landing page (build your own brand)",
    "Bulk email integration and analytics",
    "Higher priority support and maintenance",
    "All Starter features included",
    "Up to 4 packages per session type",
    "3 preset analytics widgets (top revenue clients, recent sessions, recent payments; additional analytics blurred)",
    "Advanced scheduling (recurring bookings, package deals, calendar sync)",
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
