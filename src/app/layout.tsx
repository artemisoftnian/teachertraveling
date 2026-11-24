import type { Metadata } from "next";
import { Gloock, Libre_Franklin } from "next/font/google";
import "./globals.css";

const display = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloock",
  display: "swap",
});

const body = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-franklin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Let the World Be Your Guide to Learning! - Teacher Traveling",
  description: "Join Cynthia Nieves, a dedicated ESL and bilingual educator with over 24 years of experience, as she not only shares her expertise in creating unforgettable travel experiences but also leads student groups on educational tours around the world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
