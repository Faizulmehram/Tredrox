import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s | Tredrox Systems" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "AI engineering",
    "AI agent development",
    "multi-agent systems",
    "LLM integration",
    "AI chatbots",
    "SaaS development",
    "business process automation",
    "API integration",
    "MCP servers",
    "backend engineering",
    "Next.js development",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#05080d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the page as scripted before first paint, so reveal states never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <MotionProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
            {children}
          </main>
          <SiteFooter />
          <RevealObserver />
          <CustomCursor />
        </MotionProvider>
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
