import type { Metadata } from "next";
import { DM_Mono, Manrope, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { en } from "@/locales/en";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
  keywords: ["Visal Suwanarat", "full-stack engineer", "AI engineer", "product engineer", "Bangkok"],
  openGraph: {
    title: en.metadata.title,
    description: en.metadata.description,
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
        className={`${manrope.variable} ${dmMono.variable} ${notoSansThai.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
