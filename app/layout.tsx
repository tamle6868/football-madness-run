import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Football Madness Run",
  description:
    "A satirical 2D side-scrolling football endless runner. Dodge VAR, FIFA Corruption, Injury Cards, and Social Media Hate to lift the Globe Cup.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0b1020",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white overflow-hidden touch-none select-none">
        {children}
      </body>
    </html>
  );
}
