"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, User, CheckCircle, Loader2 } from "lucide-react";

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
    <section id="contact" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300">
            Let's discuss your fitness platform and create something amazing
            together.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {isSuccess ? (
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-[#004d40] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Message Sent!
                </h2>
                <p className="text-gray-300 mb-6">
                  Thank you for your message. I'll get back to you within 24
                  hours.
                </p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  className="bg-[#004d40] hover:bg-[#00695c]"
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900 border-gray-700 transition-all duration-500 ease-in-out hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-white">
                  Request a Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg">
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
                      className="pl-10 bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40]"
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
                      className="pl-10 bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40]"
                    />
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      name="message"
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="pl-10 bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#004d40] hover:bg-[#00695c] text-white py-3 rounded-xl text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
