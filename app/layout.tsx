import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const chulabhornLikit = localFont({
  src: [
    {
      path: "../public/webfont/chulabhornlikittext-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/webfont/chulabhornlikittext-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/webfont/chulabhornlikittext-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/webfont/chulabhornlikittext-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-chulabhorn",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "PTG Family - Customer Console",
  description: "PTG Family Customer Console",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B132B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${chulabhornLikit.variable} ${ibmPlexSansThai.variable}`}
    >
      <body
        className={`${chulabhornLikit.className} ${ibmPlexSansThai.className} bg-white antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
