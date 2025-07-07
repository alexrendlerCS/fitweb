"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchaseSectionProps {
  packageName: string;
  price: string;
  keyFeatures: string[];
  packageSlug: string;
}

export default function PurchaseSection({
  packageName,
  price,
  keyFeatures,
  packageSlug,
}: PurchaseSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApply = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to application form
    router.push(`/apply?package=${packageSlug}`);
  };

  return (
    <section
      id="purchase-section"
      className="py-20 bg-black border-t border-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300">
              Apply now and we'll get back to you within 24 hours
            </p>
          </div>

          <Card className="bg-gray-900 border-gray-700 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white">
                {packageName}
              </CardTitle>
              <div className="text-5xl font-bold text-[#004d40] mt-4">
                {price}
              </div>
              {price.includes("+") && (
                <p className="text-gray-400 text-sm mt-2">
                  Final price determined after consultation
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  What You Get:
                </h3>
                <ul className="space-y-3">
                  {keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <Check className="text-[#004d40] mr-3 h-5 w-5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-gray-700">
                <Button
                  onClick={handleApply}
                  disabled={isLoading}
                  className="w-full bg-[#004d40] hover:bg-[#00695c] text-white py-4 text-lg rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>

                <div className="flex items-center justify-center mt-4 text-gray-400 text-sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Secure application process
                </div>

                <div className="text-center mt-4">
                  <div className="inline-flex items-center space-x-4 text-xs text-gray-500">
                    <span>🔒 Secure Application</span>
                    <span>⏰ 24hr Response</span>
                    <span>✅ Manual Review</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
