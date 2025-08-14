import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RealtimeStatusBar from "@/components/RealtimeStatusBar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Oahu Transit Hub - Smart Public Transportation for Hawaii",
  description: "Navigate Oahu with ease. Real-time bus and rail tracking, weather-aware routing, and AI-powered trip planning for locals and tourists.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  authors: [{ name: 'LeniLani Consulting' }],
  creator: 'LeniLani Consulting',
  publisher: 'LeniLani Consulting',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1890ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0050b3' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Oahu Transit Hub',
    description: 'Smart public transportation for Oahu, Hawaii',
    siteName: 'Oahu Transit Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oahu Transit Hub',
    description: 'Smart public transportation for Oahu, Hawaii',
  },
  keywords: [
    'Oahu transit',
    'Hawaii bus',
    'Skyline rail',
    'public transportation Hawaii',
    'Honolulu transit',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <RealtimeStatusBar />
      </body>
    </html>
  );
}