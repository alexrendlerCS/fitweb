import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import PackagesSection from "@/components/packages-section"
import TestimonialSection from "@/components/testimonial-section"
import PortfolioSection from "@/components/portfolio-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import AboutSection from "@/components/about-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />
      <AboutSection />
      <PackagesSection />
      <TestimonialSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
