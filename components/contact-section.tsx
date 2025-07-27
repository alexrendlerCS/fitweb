"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  MessageSquare,
  User,
  CheckCircle,
  Loader2,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowRight,
} from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center bg-gray-900"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Build Your Brand?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Let's discuss your vision and create a personalized platform that
            perfectly represents your fitness brand.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Get In Touch
              </h3>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-[#004d40]/50 transition-all duration-300">
                <div className="bg-[#004d40] rounded-full p-3 flex-shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Email</h4>
                  <p className="text-gray-300 text-sm">alexrendler@yahoo.com</p>
                  <p className="text-gray-400 text-xs">
                    I'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-[#004d40]/50 transition-all duration-300">
                <div className="bg-[#004d40] rounded-full p-3 flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Quick Response
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Get a custom quote in minutes
                  </p>
                  <p className="text-gray-400 text-xs">
                    No pressure, just helpful guidance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-[#004d40]/50 transition-all duration-300">
                <div className="bg-[#004d40] rounded-full p-3 flex-shrink-0">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Project Timeline
                  </h4>
                  <p className="text-gray-300 text-sm">
                    2-4 weeks from concept to launch
                  </p>
                  <p className="text-gray-400 text-xs">
                    Fast, efficient, and professional
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {isSuccess ? (
              <Card className="bg-black border-gray-700">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-[#004d40] rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Thank you for reaching out! I'll review your project details
                    and get back to you within 24 hours with a personalized
                    quote.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    className="bg-[#004d40] hover:bg-[#00695c] text-white"
                  >
                    Send Another Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black border-gray-700 transition-all duration-500 ease-in-out hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
                    <Send className="h-6 w-6 text-[#004d40]" />
                    Request Your Quote
                  </CardTitle>
                  <p className="text-center text-gray-400 text-sm">
                    Tell me about your vision and I'll create a custom solution
                    for you
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40] focus:ring-[#004d40]/20 transition-all duration-300"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40] focus:ring-[#004d40]/20 transition-all duration-300"
                      />
                    </div>

                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Textarea
                        name="message"
                        placeholder="Tell me about your fitness business and what you're looking for in a website..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40] focus:ring-[#004d40]/20 resize-none transition-all duration-300"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
