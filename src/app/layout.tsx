import { Inter } from "next/font/google";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import "./globals.css";
import { Toaster } from "sonner";
import Head from "next/head";
import { Metadata } from "next";

const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "School Management System",
    template: "%s | School Management System",
  },
  description: "A modern platform to manage students, teachers, and courses",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}  antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
