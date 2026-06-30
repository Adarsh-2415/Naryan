import { Metadata } from "next";
import TreatmentsPageClient from "./TreatmentsClient";

export const metadata: Metadata = {
  title: "Clinical Treatments & Pathology Services",
  description: "Explore our wide range of homeopathic treatments including oncology support, skin care, pediatric solutions, chronic disease management, and standard pathology tests.",
};

export default function TreatmentsPage() {
  return <TreatmentsPageClient />;
}
