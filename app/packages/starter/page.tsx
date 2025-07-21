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
    subtitle: "Perfect for new trainers or those with a small client base",
    description:
      "Get your fitness business online with a professional website, essential booking features, and support for up to 5 clients.",
    features: [
      {
        title: "Setup Cost: $1,000",
        description:
          "One-time setup fee includes design, development, and initial configuration",
      },
      {
        title: "Monthly Cost: $150+",
        description: "Base price includes hosting, maintenance, bug fixes, and support. Add-ons available for additional monthly cost.",
      },
      {
        title: "Max Clients: 5",
        description:
          "Perfect for trainers just starting out or with a small client base",
      },
      {
        title: "Scheduling & Payments (Stripe integration)",
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
      {
        title: "Professional Design & Mobile Optimization",
        description: "Modern, responsive design for all devices",
      },
      {
        title: "Up to 3 Packages per Session Type",
        description: "Offer up to 3 different packages for each session type",
      },
      {
        title: "Teaser Analytics Page (Blurred, Upgrade Prompt)",
        description: "Analytics page is blurred with an upgrade prompt",
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
    "Setup Cost: $1,000 + Monthly: $150+",
    "Max 5 clients with full scheduling & payments",
    "Client dashboard and booking system",
    "Email support and backend maintenance",
    "Professional design and mobile optimization",
    "Up to 3 packages per session type",
    "Teaser analytics page (blurred, upgrade prompt)",
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
