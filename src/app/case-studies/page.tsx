import { Metadata } from "next";
import CaseStudiesPageClient from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Clinical Case Studies",
  description: "Read clinical case studies detailing successful homeopathic treatments, patient recoveries, and clinical evaluations managed by Narayan Homoeopathic Chikitsalaya.",
};

export default function CaseStudiesPage() {
  return <CaseStudiesPageClient />;
}
