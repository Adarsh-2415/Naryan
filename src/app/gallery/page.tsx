import { Metadata } from "next";
import GalleryPageClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery & Clinical Events",
  description: "Browse images from clinical events, patient reviews, advanced diagnostic facilities, and community health seminars conducted by Narayan Homoeopathic Chikitsalaya.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
