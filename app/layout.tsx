import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitWeb Studio - Custom Web Platforms for Fitness Trainers",
  description:
    "Professional web development services for fitness trainers. Custom scheduling, payments, and automation solutions that scale with your business.",
  keywords: "fitness trainer website, personal trainer platform, gym management software, fitness business automation",
  authors: [{ name: "FitWeb Studio" }],
  openGraph: {
    title: "FitWeb Studio - Custom Web Platforms for Fitness Trainers",
    description:
      "Professional web development services for fitness trainers. Custom scheduling, payments, and automation solutions.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
