import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const canela = localFont({
  src: [
    {
      path: "../../Canela_Collection/Canela Family/Canela-Regular-Trial.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../Canela_Collection/Canela Family/Canela-Bold-Trial.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../Canela_Collection/Canela Family/Canela-Light-Trial.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-canela",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trajectory",
  description: "AI-Powered Space Mission Planning",
  icons: {
    icon: "/trajectory-favicon.svg",
  },
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${canela.variable} ${manrope.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
