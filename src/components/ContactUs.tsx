"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, RefreshCw, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function ContactUs() {
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Generate random 5-character alphanumeric captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const phone = data.get("phone") as string;
    const address = data.get("address") as string;
    const errors: { [key: string]: string } = {};

    if (!name || name.trim().length < 2) {
      errors.name = "Full Name is required";
    }
    if (!phone || phone.trim().length < 10) {
      errors.phone = "Valid Phone Number is required";
    }
    if (!address || address.trim().length < 5) {
      errors.address = "Detailed Address is required";
    }
    if (captchaInput !== captchaText) {
      errors.captcha = "Security verification code does not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Success state
    setFormErrors({});
    const email = data.get("email") as string;

    fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        message: address
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setFormErrors({ form: res.error || "Failed to submit message" });
      }
    })
    .catch(err => {
      console.error("Enquiry submission error:", err);
      setFormErrors({ form: "Network error occurred. Please try again." });
    });
  };


  return (
    <section id="contact" className="pt-16 pb-0 md:pt-24 md:pb-0 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* PART 1: TOP PANEL - Get In Touch Header & 3 Info Cards */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-brand-secondary tracking-widest uppercase block">
            Support Center
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-dark leading-tight">
            Get In Touch With Us!
          </h2>
          <p className="text-text-body/80 text-sm md:text-base leading-relaxed">
            Have an inquiry or require assistance? Our clinical care team and medical consultants are ready to assist you. Complete the form or call our line below.
          </p>
        </div>

        {/* 3 Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          
          {/* Card 1: Call Us */}
          <ScrollReveal direction="up" delay={0}>
            <div className="group bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[180px]">
              <div className="p-3 bg-brand-light/50 text-brand-primary rounded-xl mb-4 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Phone size={22} />
              </div>
              <h3 className="font-heading font-bold text-base text-brand-dark mb-1">Call Us</h3>
              <p className="text-[11px] text-text-body/60 font-medium mb-2">Emergency No. 24/7 Response</p>
              <a href="tel:+911332270021" className="font-heading font-bold text-sm md:text-base text-brand-secondary hover:underline">
                +91-1332 270021
              </a>
            </div>
          </ScrollReveal>

          {/* Card 2: Our Location */}
          <ScrollReveal direction="up" delay={150}>
            <div className="group bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[180px]">
              <div className="p-3 bg-blue-50 text-brand-secondary rounded-xl mb-4 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <MapPin size={22} />
              </div>
              <h3 className="font-heading font-bold text-base text-brand-dark mb-1">Our Location</h3>
              <p className="text-[11px] text-text-body/60 font-medium mb-2">Come say hello at our clinic</p>
              <p className="text-xs text-text-body/90 font-semibold px-4 max-w-xs leading-relaxed">
                First street, Neelam cinema crossing 32, Jamun Road, Civil Lines, Roorkee, Uttarakhand 247667
              </p>
            </div>
          </ScrollReveal>

          {/* Card 3: Email Us */}
          <ScrollReveal direction="up" delay={300}>
            <div className="group bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[180px]">
              <div className="p-3 bg-green-50 text-cta rounded-xl mb-4 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Mail size={22} />
              </div>
              <h3 className="font-heading font-bold text-base text-brand-dark mb-1">Email Us</h3>
              <p className="text-[11px] text-text-body/60 font-medium mb-2">Drop us an email anytime</p>
              <a href="mailto:homoeopathy4u@gmail.com" className="font-heading font-bold text-sm md:text-base text-brand-secondary hover:underline">
                homoeopathy4u@gmail.com
              </a>
            </div>
          </ScrollReveal>

        </div>

        {/* PART 2: MIDDLE PANEL - Centered Inquiry Form */}
        <div className="mb-20 flex justify-center">
          
          {/* Centered Inquiry Form with Alphanumeric Captcha */}
          <ScrollReveal direction="up" className="w-full max-w-2xl">
            <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xl p-6 md:p-8 relative">
              
              {!isSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  
                  {/* Name and Phone Flex */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark/75 block">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. John Doe"
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-brand-dark placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                          formErrors.name ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15"
                        }`}
                      />
                      {formErrors.name && <p className="text-[11px] text-red-500 font-semibold">{formErrors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark/75 block">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 XXXXX XXXXX"
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-brand-dark placeholder-slate-400 focus:outline-none transition-all duration-200 ${
                          formErrors.phone ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15"
                        }`}
                      />
                      {formErrors.phone && <p className="text-[11px] text-red-500 font-semibold">{formErrors.phone}</p>}
                    </div>
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/75 block">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-brand-dark placeholder-slate-400 focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15 transition-all duration-200"
                    />
                  </div>

                  {/* Address TextArea */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/75 block">Your Address</label>
                    <textarea
                      name="address"
                      rows={3}
                      placeholder="Please describe your detailed address here..."
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-brand-dark placeholder-slate-400 focus:outline-none transition-all duration-200 resize-none ${
                        formErrors.address ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15"
                      }`}
                    />
                    {formErrors.address && <p className="text-[11px] text-red-500 font-semibold">{formErrors.address}</p>}
                  </div>

                  {/* Security Verification Captcha */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/75 block">Security Verification</label>
                    <div className="flex items-center gap-3">
                      
                      {/* Captcha text display */}
                      <div className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-brand-dark font-mono font-bold text-lg tracking-[0.4em] select-none shadow-inner h-11 flex items-center justify-center italic bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:10px_10px]">
                        {captchaText}
                      </div>

                      {/* Refresh button */}
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 cursor-pointer h-11"
                        title="Reload Captcha Code"
                      >
                        <RefreshCw size={16} />
                      </button>

                      {/* Captcha Input */}
                      <input
                        type="text"
                        placeholder="Enter verification code"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-brand-dark placeholder-slate-400 focus:outline-none h-11 transition-all duration-200 ${
                          formErrors.captcha ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15"
                        }`}
                      />

                    </div>
                    {formErrors.captcha && <p className="text-[11px] text-red-500 font-semibold px-1 mt-1">{formErrors.captcha}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#02457A] hover:bg-[#001B4B] text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 flex items-center justify-center gap-2 cursor-pointer text-sm font-heading"
                  >
                    <span>SUBMIT MESSAGE</span>
                  </button>

                </form>
              ) : (
                // Success popup state
                <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="inline-flex p-3 bg-green-50 text-cta rounded-full">
                    <CheckCircle2 size={44} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-xl text-brand-dark">
                      Thank You for Contacting Us
                    </h3>
                    <p className="text-sm text-text-body leading-relaxed max-w-sm mx-auto">
                      Your message has been successfully routed. Our medical help desk will get in touch with you shortly to address your inquiry.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      generateCaptcha();
                    }}
                    className="text-xs font-semibold text-brand-secondary hover:underline focus:outline-none pt-2"
                  >
                    Submit another inquiry
                  </button>
                </div>
              )}

            </div>
          </ScrollReveal>

        </div>

      </div>

      {/* PART 3: BOTTOM PANEL - Edge-to-Edge Google Map Embed */}
      <ScrollReveal direction="up" className="w-full mt-16 md:mt-20">
        <div className="w-full h-[350px] md:h-[450px] relative bg-slate-100 border-t border-slate-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3459.946462248469!2d77.8875836!3d29.865817800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eb379db2d86af%3A0x319b1dd7a865c803!2sNarayan%20Homoeopathic%20Chikitsalaya%2F%20Narayan%20homoeopathy!5e0!3m2!1sen!2sin!4v1782294014957!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Google Map Location of Narayan Homoeopathic Chikitsalaya"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
