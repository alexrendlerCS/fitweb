import Header from "@/components/header";
import Footer from "@/components/footer";
import TrainerApplicationForm from "@/components/trainer-application-form";

interface ApplyPageProps {
  searchParams: Promise<{
    package?: string;
  }>;
}

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const params = await searchParams;
  const selectedPackage = params.package;

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Apply for <span className="text-[#004d40]">FitWeb Studio</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tell us about your fitness business and goals. We'll review your
              application and get back to you within 24 hours.
            </p>
          </div>

          <TrainerApplicationForm selectedPackage={selectedPackage} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
