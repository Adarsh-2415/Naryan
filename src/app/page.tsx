import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import AboutUs from "@/components/AboutUs";
import ClinicalExcellence from "@/components/ClinicalExcellence";
import QuickBooking from "@/components/QuickBooking";
import ValuesGrid from "@/components/ValuesGrid";
import Testimonials from "@/components/Testimonials";
import Treatments from "@/components/Treatments";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Narayan Homoeopathic Chikitsalaya - Best Homeopathy Clinic in Roorkee",
  description: "Experience holistic healing and premium diagnostic care in Roorkee. Book online homeopathic doctor consultations for chronic diseases, oncology support, & pediatric treatments.",
};

export default function Home() {
  return (
    <>
      {/* Above-The-Fold Section */}
      <TopBar />
      <BrandingSection />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustStrip />
        
        {/* About Us Section */}
        <AboutUs />

        {/* Quick Booking Section */}
        <QuickBooking />

        {/* Clinical Excellence Spotlight */}
        <ClinicalExcellence />

        {/* Core Values Grid */}
        <ValuesGrid />

        {/* Treatments Section */}
        <Treatments />

        {/* Testimonials Carousel */}
        <Testimonials />


        {/* Contact Us Section */}
        <ContactUs />
      </main>

      {/* Modern Detailed Footer */}
      <Footer />
    </>
  );
}
