"use client";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const demoSections = [
  {
    title: "Client Dashboard",
    image: "/demo-dashboard.png",
    description: "A central hub for your clients to view their schedule, progress, and important updates."
  },
  {
    title: "Analytics Page",
    image: "/demo-analytics.png",
    description: "Track client engagement, revenue, and business growth with easy-to-read analytics."
  },
  {
    title: "Scheduling Page (Google Calendar Integration)",
    image: "/demo-scheduling.png",
    description: "Seamlessly manage sessions and sync with Google Calendar for real-time updates."
  },
  {
    title: "Book Session Page",
    image: "/demo-book-session.png",
    description: "Clients can easily select a workout type, book sessions, view availability, and receive reminders."
  },
  {
    title: "Packages Page",
    image: "/demo-packages.png",
    description: "Showcase your service packages and allow clients to purchase or upgrade with ease."
  },
  {
    title: "Email Integration",
    image: "/demo-email.png",
    description: "Send automated email reminders to clients for upcoming bookings and cancellations, ensuring everyone stays informed."
  },
  // Add more sections as needed
];

export default function DemoClientDashboardPage() {
  const [modalImage, setModalImage] = useState<string | null>(null);

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
          <h1 className="text-4xl font-bold mb-2 text-center">Coach Kilday's Platform</h1>
          <p className="text-lg text-gray-300 mb-10 text-center">Explore the features and user experience of a real client platform.</p>
          <div className="grid gap-10 md:grid-cols-2">
            {demoSections.map((section, idx) => (
              <div
                key={idx}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl min-h-[420px]"
              >
                <div
                  className="w-full h-80 bg-gray-900 rounded-lg mb-4 overflow-hidden relative cursor-pointer border border-gray-700 shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => section.image && setModalImage(section.image)}
                >
                  {section.image ? (
                    <img
                      src={section.image}
                      alt={section.title + " screenshot"}
                      className="object-cover h-full w-full rounded-lg"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-semibold">Image Placeholder</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center text-white">{section.title}</h2>
                <p className="text-gray-300 text-center text-base">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Modal for full image view */}
        {modalImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setModalImage(null)}
            tabIndex={-1}
            onKeyDown={e => { if (e.key === 'Escape') setModalImage(null); }}
          >
            <div className="relative">
              <button
                className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white rounded-full p-2 z-10 border border-white shadow-lg"
                onClick={e => { e.stopPropagation(); setModalImage(null); }}
                aria-label="Close full image"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={modalImage}
                alt="Full size demo screenshot"
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 