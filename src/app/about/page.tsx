import { Metadata } from "next";
import AboutPageClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the legacy of Late Pt. Manohar Lal Sharma Ji & Late Dr. J.N. Sharma. Discover our roots, vision, and our senior practitioners carrying forward clinical excellence.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
