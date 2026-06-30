import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Narayan Homoeopathic Chikitsalaya - Best Homeopathic Clinic in Roorkee",
    template: "%s | Narayan Homoeopathic Chikitsalaya"
  },
  description: "Personalized homeopathic care and advanced clinical diagnostic tests in Roorkee. Expert treatments for chronic ailments, clinical oncology, and pediatric care.",
  keywords: ["Homeopathy", "Homeopathy clinic Roorkee", "Best Homeopath", "Clinical Oncology Homeopathy", "Roorkee Homeopathic Clinic", "Pathology lab Roorkee", "Personalized homeopathic treatment"],
  authors: [{ name: "Dr. Navneet Sharma" }, { name: "Dr. Asha Sharma" }],
  metadataBase: new URL("https://narayanhomeopathy.com"),
  openGraph: {
    title: "Narayan Homoeopathic Chikitsalaya - Best Homeopathic Clinic in Roorkee",
    description: "Personalized homeopathic care and advanced clinical diagnostic tests in Roorkee.",
    url: "https://narayanhomeopathy.com",
    siteName: "Narayan Homoeopathic Chikitsalaya",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Narayan Homoeopathic Chikitsalaya - Best Homeopathic Clinic in Roorkee",
    description: "Personalized homeopathic care and advanced clinical diagnostic tests in Roorkee.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiasedScroll`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-text-body">
        {/* Embed local business structured JSON-LD data for Google Search snippet integration */}
        <LocalBusinessSchema />
        {children}
      </body>
    </html>
  );
}
