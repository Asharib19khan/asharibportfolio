import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "../constants/content";
import { ThemeProvider } from "../components/providers/ThemeProvider";

const heading = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-heading", display: "swap" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

const title = `${BRAND.name} | Full-Stack AI Engineer`;
const description =
  "Asharib Khan builds AI and full-stack systems: Type 19C, a natural-language copilot for Oracle 19c; BAAZ, a safety-first mobility platform for Pakistan; and backend modules for Developers Day 2026 at FAST-NUCES Karachi.";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.site),
  title,
  description,
  keywords: ["Asharib Khan", "Software Engineer", "AI Engineer", "Full Stack Developer", "FinTech", "FAST-NUCES", "Next.js", "React", "Portfolio"],
  authors: [{ name: BRAND.name, url: BRAND.site }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: BRAND.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f0ed" },
    { media: "(prefers-color-scheme: dark)", color: "#070809" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
