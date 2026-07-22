import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nathumini.dev"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nathumini Jayathilake | Data Scientist & ML Engineer",
    template: "%s | Nathumini Jayathilake",
  },
  description:
    "Portfolio of Nathumini Jayathilake — Final Year Computer Science Undergraduate, Aspiring Data Scientist, AI & Machine Learning Enthusiast. Turning data into decisions.",
  keywords: [
    "Nathumini Jayathilake",
    "Data Scientist",
    "Machine Learning",
    "Data Analytics",
    "Python",
    "AI",
    "Portfolio",
    "Sri Lanka",
    "APIIT",
    "University of Staffordshire",
  ],
  authors: [{ name: "Nathumini Jayathilake" }],
  creator: "Nathumini Jayathilake",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nathumini.dev",
    siteName: "Nathumini Jayathilake",
    title: "Nathumini Jayathilake | Data Scientist & ML Engineer",
    description:
      "Final Year Computer Science Undergraduate | Aspiring Data Scientist | AI & Machine Learning Enthusiast",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nathumini Jayathilake Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nathumini Jayathilake | Data Scientist & ML Engineer",
    description:
      "Final Year Computer Science Undergraduate | Aspiring Data Scientist | AI & Machine Learning Enthusiast",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full bg-[#f8f7f5] text-[#1a1a1a]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
