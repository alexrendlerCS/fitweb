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
    subtitle: "For established trainers with a larger, expanding client base",
    description:
      "Designed for established trainers with a larger client base looking to expand, including support for multiple trainers and locations, advanced customization, and dedicated ongoing support.",
    features: [
      {
        title: "Setup Cost: $1,750+",
        description:
          "Custom setup fee based on specific requirements and features",
      },
      {
        title: "Monthly Cost: $200+",
        description: "Base price scales with your business size and feature requirements. Add-ons available for additional monthly cost.",
      },
      {
        title: "Max Clients: Unlimited",
        description: "Unlimited potential for established trainers and their teams",
      },
      {
        title: "All Pro Features",
        description: "Everything included in the Pro package",
      },
      {
        title: "Personalized Landing Page (Build Your Own Brand)",
        description: "Custom landing page with your branding, colors, logo, and messaging to showcase your unique fitness business and establish your professional presence",
      },
      {
        title: "Editable Homepage (Customize Photos, About, Branding)",
        description: "Full control over homepage content and branding",
      },
      {
        title: "Top Priority Support (Direct Access to Dev Team, Feature Requests)",
        description: "Direct access to the development team and priority feature requests",
      },
      {
        title: "Custom Analytics Dashboard (Fully Customizable, By Request)",
        description: "Fully customizable analytics and reporting dashboard, by request",
      },
      {
        title: "Multi-Trainer and Multi-Location Support",
        description: "Manage multiple trainers and business locations",
      },
      {
        title: "Ongoing Strategy Calls, Feature Updates, Bug Fixes",
        description: "Regular check-ins for feature updates and business strategy",
      },
      {
        title: "Unlimited Packages per Session Type",
        description: "Offer unlimited packages for each session type",
      },
    ],
    faqs: [
      {
        question: "How long does the Elite package take?",
        answer:
          "Elite packages typically take 3-4 weeks due to the custom development and ongoing changes/additions.",
      },
      {
        question: "What are examples of add-on features that are available?",
        answer:
          "Some examples include: AI chatbot for customer service, automated workout recommendations, and smart scheduling optimization.",
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
    "Setup Cost: $1,750+ + Monthly: $200+",
    "Unlimited clients and advanced customization",
    "Personalized landing page (build your own brand)",
    "Editable homepage and top priority support",
    "Custom analytics dashboard (by request)",
    "Multi-trainer and multi-location support",
    "Ongoing strategy calls, feature updates, bug fixes",
    "Unlimited packages per session type",
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
