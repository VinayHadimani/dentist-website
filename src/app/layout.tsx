import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dr. Sarah Mitchell | Family & Cosmetic Dentistry",
  description: "Book your appointment with Dr. Sarah Mitchell for comprehensive dental care. Offering general checkups, teeth whitening, implants, and more in a caring environment.",
  keywords: ["dentist", "dental care", "family dentistry", "cosmetic dentistry", "dental implants", "teeth whitening", "orthodontics"],
  authors: [{ name: "Dr. Sarah Mitchell" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Dr. Sarah Mitchell | Family & Cosmetic Dentistry",
    description: "Book your appointment today for comprehensive dental care.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Sarah Mitchell | Family & Cosmetic Dentistry",
    description: "Book your appointment today for comprehensive dental care.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
