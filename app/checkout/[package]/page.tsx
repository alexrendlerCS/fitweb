import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

interface CheckoutPageProps {
  params: {
    package: string
  }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const packageNames = {
    starter: "Starter Package - $500",
    pro: "Pro Package - $1,200",
    elite: "Elite Package - $2,000+",
  }

  const packageName = packageNames[params.package as keyof typeof packageNames] || "Package"

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Link
              href={`/packages/${params.package}`}
              className="inline-flex items-center text-[#004d40] hover:text-[#00695c] mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {params.package} package
            </Link>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#004d40] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Checkout Coming Soon</CardTitle>
              </CardHeader>

              <CardContent className="text-center space-y-6">
                <p className="text-xl text-gray-300">
                  You selected: <span className="text-[#004d40] font-semibold">{packageName}</span>
                </p>

                <div className="bg-black p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">🚧 Integration in Progress</h3>
                  <p className="text-gray-300 mb-4">
                    Stripe checkout integration is currently being implemented. For now, please contact us directly to
                    purchase this package.
                  </p>

                  <div className="text-sm text-gray-400 space-y-2">
                    <p>
                      <strong>Developer Note:</strong>
                    </p>
                    <p>Replace this page with actual Stripe checkout by:</p>
                    <ol className="list-decimal list-inside space-y-1 text-left">
                      <li>Creating /api/stripe/checkout-session endpoint</li>
                      <li>Configuring Stripe products and prices</li>
                      <li>Updating PaymentSummary component to call the API</li>
                      <li>Adding success/cancel redirect pages</li>
                    </ol>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-[#004d40] hover:bg-[#00695c]">
                    <Link href="/#contact">Contact Us to Purchase</Link>
                  </Button>

                  <Button asChild variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    <Link href={`/packages/${params.package}`}>Back to Package Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
