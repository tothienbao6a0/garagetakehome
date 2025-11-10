import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garage Invoice Generator",
  description: "Generate PDF invoices for Garage fire truck listings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

