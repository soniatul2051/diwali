import type { Metadata } from "next";
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const devanagari = Tiro_Devanagari_Hindi({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "✨ शुभ दीपावली ✨ | Interactive Diwali Celebration Experience",
  description:
    "May the light of Diwali illuminate your life with happiness, prosperity and endless possibilities. An interactive celebration with fireworks, sacred diyas, rangoli, and festive music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${devanagari.variable} scroll-smooth dark`}
    >
      <body className="min-h-screen bg-[#05020a] text-amber-50 font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
