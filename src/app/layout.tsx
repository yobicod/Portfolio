import type { Metadata } from "next";
import { DM_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Visal Suwanarat — Software Engineer & AI Builder",
  description:
    "Portfolio of Visal Suwanarat, a full-stack engineer and creative technologist building thoughtful AI-powered products.",
  keywords: ["Visal Suwanarat", "full-stack engineer", "AI engineer", "product engineer", "Bangkok"],
  openGraph: {
    title: "Visal Suwanarat — Software Engineer & AI Builder",
    description: "Thoughtful AI-powered products, scalable systems, and automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="theme-color" content="#060708" />
      </head>
      <body
        className={`${manrope.variable} ${dmMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
