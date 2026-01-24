import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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

export const metadata: Metadata = {
  title: "Nura",
  description: "The AI Intelligence Layer for Real Estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${canela.variable} ${manrope.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
