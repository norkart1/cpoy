import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth/next";
import ClientSessionProvider from "@/lib/ClientSessionProvider";
import { Toaster } from 'react-hot-toast';

import { authOptions } from '@/lib/auth';
import './globals.css';
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize for CLS
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize for CLS
});


export const metadata = {
  title: "Alathurpadi Dars Fest | Dars Fest Automation",
  description: "Manage participants, hall tickets, and events for Alathurpadi Dars Fest. Administer competitions, generate hall tickets, and download participant lists efficiently.",
  keywords: "Alathurpadi Dars Fest, event management, hall tickets, participant management, festival administration, competition scheduling",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Alathurpadi Dars Fest | Dars Fest Automation",
    description: "Streamline event management for Alathurpadi Dars Fest with participant tracking, hall tickets, and more.",
    url: "https://fest-automation.vercel.app/", // Replace with your domain
    type: "website",
    images: [
      {
        url: "https://fest-automation.vercel.app/header-01.png", // Replace with your image
        width: 1200,
        height: 630,
        alt: "Alathurpadi Dars Fest Banner",
      },
    ],
    siteName: "Alathurpadi Dars Fest",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alathurpadi Dars Fest | Fest Management",
    description: "Manage programs, participants, and hall tickets for Alathurpadi Dars Fest.",
    image: "https://yourdomain.com/twitter-image.jpg", // Replace with your image
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="canonical" href="https://yourdomain.com" /> {/* Replace with your domain */}
        <meta name="theme-color" content="#4f46e5" /> {/* Matches indigo-600 from UI */}
        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Alathurpadi Dars Fest",
              url: "https://yourdomain.com",
              description: "Event management platform for Alathurpadi Dars Fest.",
              publisher: {
                "@type": "Organization",
                name: "Alathurpadi Dars Fest",
                logo: {
                  "@type": "ImageObject",
                  url: "https://yourdomain.com/logo.png", // Replace with your logo
                },
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientSessionProvider session={session}>
          {children}
          <Toaster position="top-right" />
        </ClientSessionProvider>
      </body>
    </html>
  );
}