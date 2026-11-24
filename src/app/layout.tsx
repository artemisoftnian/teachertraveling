import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Let the World Be Your Guide to Learning! - Teacher Traveling",
  description: "Join Cynthia Nieves, a dedicated ESL and bilingual educator with over 24 years of experience, as she not only shares her expertise in creating unforgettable travel experiences but also leads student groups on educational tours around the world. Teachers can discover the secrets to organizing successful, enriching trips that immerse students in diverse cultures and foster life-changing learning experiences.Together, let's embark on a journey and transform lives through the power of travel!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
