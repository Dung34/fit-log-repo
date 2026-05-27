import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import KonstaProvider from "@/components/providers/konsta-provider";

const APP_NAME = "FitLog";
const APP_DESCRIPTION =
  "FitLog is a workout tracker app that helps you track your workouts and progress.";

const geistSans = Geist({
  variable: "--font-fit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-fit-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-fit-bg-muted text-fit-text">
        <KonstaProvider>{children}</KonstaProvider>
      </body>
    </html>
  );
}
