import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { CartProvider } from "@/contexts/cart-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "ASTRAPE LUXURY - Premium Designer Collections",
  description: "Exclusive designer collections that redefine premium shopping. Authenticated luxury pieces with same-day delivery and VIP concierge service.",
  keywords: "luxury, designer, premium, collections, authentic, exclusive, VIP, concierge",
  openGraph: {
    title: "ASTRAPE LUXURY - Premium Designer Collections",
    description: "Exclusive designer collections that redefine premium shopping.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ff0080" />
      </head>
      <body className="min-h-screen">
        <CartProvider>
          <div className="relative min-h-screen">
              <Navbar />         
              {children}
          </div>
        </CartProvider>
      </body>
    </html>
  )
}