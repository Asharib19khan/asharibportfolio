import type { Metadata } from "next";
import "./globals.css";
import { BRAND } from "../constants/content";

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.alias}`,
  description: BRAND.role,
  openGraph: {
    title: `${BRAND.name} — ${BRAND.alias}`,
    description: BRAND.role,
    url: 'https://asharibkhan.dev',
    siteName: BRAND.alias,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — ${BRAND.alias}`,
  }
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
