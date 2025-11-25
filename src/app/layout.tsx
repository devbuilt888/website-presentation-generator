import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins, Roboto, Open_Sans, Lato, Montserrat } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import NavGate from "@/components/NavGate";
import { AuthProvider } from "@/components/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "PresenT - Create Stunning Presentations",
    template: "%s | PresenT",
  },
  description: "Create stunning, personalized presentations with PresenT. Choose from beautiful templates, customize for your audience, and share with ease. Perfect for businesses, educators, and professionals.",
  keywords: ["presentation maker", "presentation builder", "custom presentations", "presentation templates", "slide creator", "interactive presentations"],
  authors: [{ name: "PresenT Team" }],
  creator: "PresenT",
  publisher: "PresenT",
  applicationName: "PresenT",
  category: "Productivity",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "PresenT",
    title: "PresenT - Create Stunning Presentations",
    description: "Create stunning, personalized presentations with PresenT. Choose from beautiful templates, customize for your audience, and share with ease.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "PresenT - Presentation Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PresenT - Create Stunning Presentations",
    description: "Create stunning, personalized presentations with PresenT. Choose from beautiful templates, customize for your audience, and share with ease.",
    images: ["/og-image"],
    creator: "@present",
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
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileImage": "/mstile-144x144.png",
    "msapplication-TileColor": "#ffffff",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PresenT",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          <NavGate>
            <Navigation />
          </NavGate>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
