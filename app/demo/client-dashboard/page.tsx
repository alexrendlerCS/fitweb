import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const demoSections = [
  {
    title: "Client Dashboard",
    image: "/images/demo-dashboard-placeholder.png",
    description: "A central hub for your clients to view their schedule, progress, and important updates."
  },
  {
    title: "Analytics Page",
    image: "/images/demo-analytics-placeholder.png",
    description: "Track client engagement, revenue, and business growth with easy-to-read analytics."
  },
  {
    title: "Scheduling Page (Google Calendar Integration)",
    image: "/images/demo-scheduling-placeholder.png",
    description: "Seamlessly manage sessions and sync with Google Calendar for real-time updates."
  },
  {
    title: "Book Session Page",
    image: "/images/demo-book-session-placeholder.png",
    description: "Clients can easily book sessions, view availability, and receive reminders."
  },
  {
    title: "Packages Page",
    image: "/images/demo-packages-placeholder.png",
    description: "Showcase your service packages and allow clients to purchase or upgrade with ease."
  },
  {
    title: "Email Integration",
    image: "/images/demo-email-placeholder.png",
    description: "Send automated email reminders to clients for upcoming bookings and cancellations, ensuring everyone stays informed."
  },
  // Add more sections as needed
];

export default function DemoClientDashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link href="/#home" className="inline-flex items-center text-white hover:text-[#004d40] font-semibold text-lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Homepage
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-8 text-center">Client Platform Demo</h1>
          <div className="grid gap-12 md:grid-cols-2">
            {demoSections.map((section, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center">
                <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {/* Placeholder image - replace with real screenshots */}
                  <img
                    src={section.image}
                    alt={section.title + " screenshot"}
                    className="object-contain h-full w-full opacity-60"
                  />
                  <span className="absolute text-gray-500 text-lg font-semibold">Image Placeholder</span>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center">{section.title}</h2>
                <p className="text-gray-300 text-center">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 