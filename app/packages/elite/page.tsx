import Header from "@/components/header";
import Footer from "@/components/footer";
import PackageHero from "@/components/package-hero";
import PackageFeatures from "@/components/package-features";
import PackageFAQ from "@/components/package-faq";
import PurchaseSection from "@/components/purchase-section";
import PaymentFAQ from "@/components/payment-faq";

export default function ElitePackage() {
  const packageData = {
    name: "Elite Package",
    price: "$1,750+",
    subtitle: "Advanced automation and AI tools",
    description:
      "Enterprise-level solution with AI automation, multi-trainer support, and dedicated ongoing support.",
    features: [
      {
        title: "Setup Cost: $1,750+",
        description:
          "Custom setup fee based on specific requirements and features",
      },
      {
        title: "Monthly Cost: $200-300",
        description: "Scales with your business size and feature requirements",
      },
      {
        title: "Client Cap: 20+",
        description: "Unlimited potential for established businesses",
      },
      {
        title: "All Pro Features",
        description: "Everything included in the Pro package",
      },
      {
        title: "Editable Homepage",
        description: "Customize photos, about section, and branding elements",
      },
      {
        title: "SEO Setup",
        description:
          "Professional search engine optimization for better visibility",
      },
      {
        title: "Ad Tracking",
        description: "Track marketing campaigns and ROI if requested",
      },
      {
        title: "Top Priority Support",
        description: "Direct access to development team and feature requests",
      },
      {
        title: "Custom Analytics Dashboard",
        description: "Fully customizable analytics and reporting",
      },
      {
        title: "Feature Requests",
        description: "Priority consideration for new feature development",
      },
    ],
    faqs: [
      {
        question: "How long does the Elite package take?",
        answer:
          "Elite packages typically take 6-8 weeks due to the custom development and AI integration work.",
      },
      {
        question: "What kind of AI features are included?",
        answer:
          "AI chatbot for customer service, automated workout recommendations, and smart scheduling optimization.",
      },
      {
        question: "Can you handle multiple locations?",
        answer:
          "Yes! The Elite package can support multiple gym locations with centralized management.",
      },
      {
        question: "What's included in ongoing support?",
        answer:
          "Monthly strategy calls, feature updates, bug fixes, and priority technical support.",
      },
      {
        question: "Is the mobile app included?",
        answer:
          "Mobile app development is available as an add-on service starting at $3,000 for both iOS and Android.",
      },
      {
        question: "Can you integrate with existing systems?",
        answer:
          "Yes, I can integrate with most fitness software, CRMs, and business tools you're already using.",
      },
    ],
  };

  const keyFeatures = [
    "Setup Cost: $1,750+ + Monthly: $200-300",
    "20+ clients with unlimited potential",
    "Editable homepage and SEO optimization",
    "Top priority support and feature requests",
    "Custom analytics dashboard",
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <PackageHero packageData={packageData} />
      <PackageFeatures features={packageData.features} />
      <PurchaseSection
        packageName="Elite Package"
        price="$1,750+"
        keyFeatures={keyFeatures}
        packageSlug="elite"
      />
      <PaymentFAQ />
      <PackageFAQ faqs={packageData.faqs} />
      <Footer />
    </main>
  );
}
