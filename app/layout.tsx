import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Garage Invoice Generator | Fire Truck Equipment Quotes",
  description: "Generate professional PDF invoices for Garage fire truck listings. Create instant quotes for fire departments and emergency services.",
  keywords: ["garage", "fire truck", "invoice", "pdf", "quote", "fire department"],
  authors: [{ name: "Garage" }],
  openGraph: {
    title: "Garage Invoice Generator",
    description: "Generate professional PDF invoices for fire truck listings",
    type: "website",
    siteName: "Garage Invoice Generator",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='80' font-style='italic' font-weight='bold' fill='%23FF6B2C'>G</text></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

