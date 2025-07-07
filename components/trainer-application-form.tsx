"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const applicationSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  business_name: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  selected_tier: z.enum(["starter", "pro", "elite"]),
  goals: z
    .string()
    .min(10, "Please describe your goals (at least 10 characters)"),
  instagram_url: z.string().url().optional().or(z.literal("")),
  calendly_url: z.string().url().optional().or(z.literal("")),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface TrainerApplicationFormProps {
  selectedPackage?: string;
}

export default function TrainerApplicationForm({
  selectedPackage,
}: TrainerApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      selected_tier:
        (selectedPackage as "starter" | "pro" | "elite") || "starter",
    },
  });

  const selectedTier = watch("selected_tier");

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="bg-gray-900 border-gray-700 max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-[#004d40] rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Application Submitted!
          </h2>
          <p className="text-gray-300 mb-6">
            Thank you for your interest in FitWeb Studio. I'll review your
            application and get back to you within 24 hours.
          </p>
          <div className="bg-black p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">
              What happens next?
            </h3>
            <ul className="text-gray-300 text-sm space-y-1 text-left">
              <li>• I'll review your application and business goals</li>
              <li>• If it's a good fit, I'll email you with a Zoom call link</li>
              <li>• We'll discuss your needs and agree on the project scope</li>
              <li>• I'll send you a payment link to get started</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">
          Trainer Application
        </CardTitle>
        <p className="text-gray-300 text-center">
          Tell us about your fitness business and goals. We'll review your
          application and get back to you within 24 hours.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-white">
              Full Name *
            </Label>
            <Input
              id="full_name"
              {...register("full_name")}
              className="bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40]"
              placeholder="Your full name"
            />
            {errors.full_name && (
              <p className="text-red-400 text-sm">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40]"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_name" className="text-white">
              Business Name *
            </Label>
            <Input
              id="business_name"
              {...register("business_name")}
              className="bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40]"
              placeholder="Your fitness business name"
            />
            {errors.business_name && (
              <p className="text-red-400 text-sm">
                {errors.business_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="selected_tier" className="text-white">
              Package Selection *
            </Label>
            <Select
              value={selectedTier}
              onValueChange={(value) =>
                setValue("selected_tier", value as "starter" | "pro" | "elite")
              }
            >
              <SelectTrigger className="bg-black border-gray-600 text-white focus:border-[#004d40]">
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem
                  value="starter"
                  className="text-white hover:bg-gray-700"
                >
                  Starter - $1,000 setup + $150/month
                </SelectItem>
                <SelectItem
                  value="pro"
                  className="text-white hover:bg-gray-700"
                >
                  Pro - $1,250 setup + $175/month
                </SelectItem>
                <SelectItem
                  value="elite"
                  className="text-white hover:bg-gray-700"
                >
                  Elite - $1,750+ setup + $200-300/month
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.selected_tier && (
              <p className="text-red-400 text-sm">
                {errors.selected_tier.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals" className="text-white">
              Business Goals & Requirements *
            </Label>
            <Textarea
              id="goals"
              {...register("goals")}
              rows={4}
              className="bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40] resize-none"
              placeholder="Tell us about your fitness business, current challenges, and what you hope to achieve with your new platform..."
            />
            {errors.goals && (
              <p className="text-red-400 text-sm">{errors.goals.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram_url" className="text-white">
              Instagram URL (Optional)
            </Label>
            <Input
              id="instagram_url"
              {...register("instagram_url")}
              className="bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40]"
              placeholder="https://instagram.com/yourbusiness"
            />
            {errors.instagram_url && (
              <p className="text-red-400 text-sm">
                {errors.instagram_url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendly_url" className="text-white">
              Calendly URL (Optional)
            </Label>
            <Input
              id="calendly_url"
              {...register("calendly_url")}
              className="bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40]"
              placeholder="https://calendly.com/yourbusiness"
            />
            {errors.calendly_url && (
              <p className="text-red-400 text-sm">
                {errors.calendly_url.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#004d40] hover:bg-[#00695c] text-white py-3 rounded-xl text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Application...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
