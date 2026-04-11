import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import {Toaster} from "react-hot-toast"
import Layout from "@/components/layouts/Layout";
import { cn } from "@/lib/utils";
import AuthInitializer from "@/components/AuthInitializer";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workflow hub",
  description: "Workflow hub a system used to manage you workspace projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="bg-backgrounds ">

<Layout>
  <AuthInitializer/>
  {children}
 <Toaster 
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: "var(--color-cards)",
      color: "var(--color-text-primary)",
      border: "1px solid var(--color-custom_border)",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    },
  }}
/>
</Layout>
       

      </body>
    </html>
  );
}
