import { Metadata } from "next";
import BookingPageClient from "./BookingClient";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule your constitutional homeopathic consultation in Roorkee online. Choose your preferred date, select a 10-minute slot, and verify details instantly.",
};

export default function BookingPage() {
  return <BookingPageClient />;
}
