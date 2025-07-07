import Header from "@/components/header";
import Footer from "@/components/footer";
import PackageHero from "@/components/package-hero";
import PackageFeatures from "@/components/package-features";
import PackageFAQ from "@/components/package-faq";
import PurchaseSection from "@/components/purchase-section";
import PaymentFAQ from "@/components/payment-faq";

export default function StarterPackage() {
  const packageData = {
    name: "Starter Package",
    price: "$1,000",
    subtitle: "Perfect for new trainers getting started",
    description:
      "Get your fitness business online with a professional website and essential booking features.",
    features: [
      {
        title: "Setup Cost: $1,000",
        description:
          "One-time setup fee includes design, development, and initial configuration",
      },
      {
        title: "Monthly Cost: $150",
        description: "Includes hosting, maintenance, bug fixes, and support",
      },
      {
        title: "Max Clients: 10",
        description:
          "Perfect for trainers just starting out or with a small client base",
      },
      {
        title: "Scheduling & Payments",
        description: "Full booking system with Stripe payment integration",
      },
      {
        title: "Client Dashboard",
        description:
          "Dedicated portal for clients to book sessions and track progress",
      },
      {
        title: "Email Support",
        description: "Priority email support for any questions or issues",
      },
      {
        title: "Backend Maintenance",
        description: "We handle all technical maintenance and updates",
      },
    ],
    faqs: [
      {
        question: "How long does it take to build?",
        answer:
          "The Starter package typically takes 1-2 weeks to complete, depending on content and feedback cycles.",
      },
      {
        question: "Can I upgrade later?",
        answer:
          "You can upgrade to Pro or Elite at any time. We'll credit your Starter investment toward the upgrade.",
      },
      {
        question: "Do I need to provide content?",
        answer:
          "Yes, you'll need to provide your bio, services, pricing, and any photos you'd like to use. I'll help guide you through what's needed.",
      },
      {
        question: "Is hosting included?",
        answer:
          "The first year of hosting is included. After that, hosting costs approximately $10-15/month.",
      },
    ],
  };

  const keyFeatures = [
    "Setup Cost: $1,000 + Monthly: $150",
    "Max 10 clients with full scheduling & payments",
    "Client dashboard and booking system",
    "Email support and backend maintenance",
    "Professional design and mobile optimization",
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <PackageHero packageData={packageData} />
      <PackageFeatures features={packageData.features} />
      <PurchaseSection
        packageName="Starter Package"
        price="$1,000"
        keyFeatures={keyFeatures}
        packageSlug="starter"
      />
      <PaymentFAQ />
      <PackageFAQ faqs={packageData.faqs} />
      <Footer />
    </main>
  );
}
