"use client";

import TopBar from "@/components/TopBar";
import BrandingSection from "@/components/BrandingSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { Award, Heart, Shield, Users, Calendar, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <BrandingSection />
      <Navbar />

      <main className="flex-grow bg-slate-50/50">

        {/* PREMIUM HERO SECTION */}
        <section className="relative min-h-[50vh] flex items-center bg-gradient-to-tr from-[#D6E8EE]/40 via-[#F8FAFC] to-white overflow-hidden py-16 md:py-24 border-b border-slate-100">
          {/* Decorative background elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[10%] right-[5%] w-80 h-80 rounded-full bg-brand-soft/20 blur-3xl animate-float-delayed" />
            <div className="absolute bottom-[5%] left-[5%] w-96 h-96 rounded-full bg-brand-light/35 blur-3xl animate-float" />

            {/* Geometric Grid */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.05]"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
            >
              <defs>
                <pattern id="about-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#about-grid)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Left Side text content */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-light text-brand-dark font-semibold text-xs md:text-sm tracking-wide shadow-sm uppercase border border-brand-soft/20 w-fit">
                  <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                  Established 1984
                </span>

                <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.1] tracking-tight">
                  Our Legacy of{" "}
                  <span className="bg-gradient-to-r from-brand-secondary via-brand-primary to-cta bg-clip-text text-transparent animate-text-gradient">
                    Healing & Compassion
                  </span>
                </h1>

                <p className="text-base md:text-lg text-text-body/90 max-w-xl leading-relaxed">
                  “We are a team of professional homeopaths with extensive experience in the latest trends and treatments.”
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                  <a
                    href="/booking"
                    className="bg-cta hover:bg-cta-hover text-white text-center font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-cta/25 hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#story"
                    className="bg-white hover:bg-slate-50 text-brand-primary text-center font-semibold px-8 py-4 rounded-full border border-slate-200 transition-all duration-200 shadow-sm"
                  >
                    Read Our Story
                  </a>
                </div>
              </div>

              {/* Right Side visual with overlaid cards */}
              <div className="lg:col-span-5 flex justify-center relative">
                <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-100">
                  <Image
                    src="/about-sign.png"
                    alt="Narayan Homoeopathic Clinic"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent" />
                </div>

                {/* Floating Metric Card */}
                <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float z-20">
                  <div className="p-3 rounded-xl bg-brand-light/50 text-brand-primary">
                    <Award size={22} />
                  </div>
                  <div>
                    <p className="font-heading font-extrabold text-brand-dark text-lg leading-none">40+ Years</p>
                    <p className="text-xs text-text-body font-medium mt-1 leading-none">Healing Legacy</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="bg-brand-dark py-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="pt-4 md:pt-0">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-brand-light">1984</p>
                <p className="text-xs md:text-sm text-slate-300 mt-1 uppercase tracking-wider">Year Founded</p>
              </div>
              <div className="pt-4 md:pt-0">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-brand-light">25,000+</p>
                <p className="text-xs md:text-sm text-slate-300 mt-1 uppercase tracking-wider">Happy Patients</p>
              </div>
              <div className="pt-4 md:pt-0">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-brand-light">100%</p>
                <p className="text-xs md:text-sm text-slate-300 mt-1 uppercase tracking-wider">Safe & Natural</p>
              </div>
              <div className="pt-4 md:pt-0">
                <p className="text-3xl md:text-4xl font-heading font-extrabold text-brand-light font-sans">98%</p>
                <p className="text-xs md:text-sm text-slate-300 mt-1 uppercase tracking-wider">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOUNDER'S STORY SECTION */}
        <section id="story" className="py-20 md:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-brand-secondary tracking-widest uppercase block">
                    Our Roots & Vision
                  </span>
                  <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-dark leading-tight">
                    The Vision of Late Pt. Manohar Lal Sharma Ji
                  </h2>
                </div>

                <div className="text-text-body/90 text-sm md:text-base leading-relaxed space-y-4">
                  <p>
                    Narayan Charitable Homoeopathic Chikitsalaya was Estb. in Year 1984 by great grandfather Late Shri.PanditManohar Lal Sharma ji (Hon, Magistrate ) who was passionate about Homoeopathy. His passion & care for common man to get alternative treatments at lower costs to common man & woman gave birth this clinic. He asked several doctor in homeopathy to make there services available for few hours a day on Charitable basis.
                  </p>
                  <p>
                    Some were else many years before in remote border of Punjab in Abohar his grand son Late.Dr.J.N Sharma who was a renouned Horticultrist Scientist (Phd.),joined evening classes in the just opened Homoeopathic medical college in Abohar town, and passed later to be among the first few institutionally qualified doctors in CHSM PUNJAB and was serving at a remote seed farm to peasents there gor free .
                  </p>
                  <p>
                    Later in years His Great Grand Son Dr. Navneet Sharma s/o Dr.J.N. Sharma after doing DHMS in year 1997 Started to run this Chikitsalaya for full day services Later in year 1999 Dr.Asha Sharma Bsc DHMS,joined and both renamed it as Narayan Homoeopathic Chikitsalya nick name Narayan Homoeopathy also for community service a charitable modern medical laboratory was roped in .
                  </p>
                  <p>
                    Periodically both the doctors have organized general routine Homoeopathic medical camps in all north india since 1997, till now they have covered around 277 camps in various urban rural places in States of Rajasthan, Punjab, Uttar Pradesh Uttarakhand.
                  </p>
                  <p>
                    A tragic demise of her mother due to breast cancer in the year 2010 turn the hidden scientist in Dr. Navneet to a turmoil, he since then turned no stone unturn to find efficacy of homoeopathic medicines for Healing the Cancer by complimentary Homoeopathy care .He is an active resource person and presented his research papers on cancer as a speaker in various medical confrences in india. He is life member of many renouned medical associations.
                  </p>
                  <p>
                    Dr.Navneet Sharma & Dr Asha Sharma both are committed to serve the suffeing Humanity and are always there when and were the community needs them .In the year 2020 in covid pandamic were awared as corona warrior by District magistrate Haridwar,also have been on various occasions felicitated by various social organisations for there services.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col items-center relative lg:pt-20">
                <div className="relative w-full max-w-[480px] rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                  <Image
                    src="/founder-manohar-lal-sharma.jpg"
                    alt="Hon. Magistrate (Late) Shree Pandit Manohar Lal Sharma - Founder of Narayan Homoeopathic Chikitsalaya"
                    width={978}
                    height={1024}
                    priority
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Founder Name Caption */}
                <div className="mt-5 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-3">
                    <span className="h-px w-8 bg-gradient-to-r from-transparent to-brand-secondary/60" />
                    <span className="text-[10px] font-bold text-brand-secondary tracking-[0.25em] uppercase">Founder</span>
                    <span className="h-px w-8 bg-gradient-to-l from-transparent to-brand-secondary/60" />
                  </div>
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-dark tracking-tight">
                    Late Pt. Manohar Lal Sharma Ji
                  </h3>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CORE VALUES SECTION */}
        <section className="py-20 bg-white relative overflow-hidden border-t border-slate-100">
          <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
            <div className="absolute top-[20%] right-[10%] w-72 h-72 rounded-full bg-brand-soft/20 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-bold text-brand-secondary tracking-widest uppercase block">
                Our Values
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-dark leading-tight">
                Our Work Is Heavily Shaped by Our Core Values
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

              {/* Value 01: Compassion */}
              <ScrollReveal direction="left" delay={100} className="bg-white border border-slate-100/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                <span className="text-xs font-bold text-brand-secondary tracking-wider block mb-2 font-mono">
                  01.
                </span>
                <h3 className="font-heading font-bold text-lg md:text-xl text-brand-dark mb-3 group-hover:text-brand-secondary transition-colors duration-300">
                  Compassion
                </h3>
                <p className="text-sm md:text-base text-text-body/80 leading-relaxed">
                  We aim at understanding and caring for patients and colleague's needs and wants, by attentive listening and putting ourselves in people's shoes.
                </p>
              </ScrollReveal>

              {/* Value 02: Progression */}
              <ScrollReveal direction="right" delay={200} className="bg-white border border-slate-100/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                <span className="text-xs font-bold text-brand-secondary tracking-wider block mb-2 font-mono">
                  02.
                </span>
                <h3 className="font-heading font-bold text-lg md:text-xl text-brand-dark mb-3 group-hover:text-brand-secondary transition-colors duration-300">
                  Progression
                </h3>
                <p className="text-sm md:text-base text-text-body/80 leading-relaxed">
                  We want to keep adapting to different situations, with a desire to learn and striving to be better. Learning new trends and technologies in the industry.
                </p>
              </ScrollReveal>

              {/* Value 03: Respect */}
              <ScrollReveal direction="left" delay={300} className="bg-white border border-slate-100/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                <span className="text-xs font-bold text-brand-secondary tracking-wider block mb-2 font-mono">
                  03.
                </span>
                <h3 className="font-heading font-bold text-lg md:text-xl text-brand-dark mb-3 group-hover:text-brand-secondary transition-colors duration-300">
                  Respect
                </h3>
                <p className="text-sm md:text-base text-text-body/80 leading-relaxed">
                  Respect everyone we meet and treat them like we want to be treated. Whether it is a colleague or a patient, understanding and respect matter.
                </p>
              </ScrollReveal>

              {/* Value 04: Courage */}
              <ScrollReveal direction="right" delay={400} className="bg-white border border-slate-100/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                <span className="text-xs font-bold text-brand-secondary tracking-wider block mb-2 font-mono">
                  04.
                </span>
                <h3 className="font-heading font-bold text-lg md:text-xl text-brand-dark mb-3 group-hover:text-brand-secondary transition-colors duration-300">
                  Courage
                </h3>
                <p className="text-sm md:text-base text-text-body/80 leading-relaxed">
                  We are the experts in our field. Therefore, it is important to have the courage to do what is right knowing that it is for the better good of the person ahead.
                </p>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* MEET OUR SENIOR CONSULTANTS */}
        <section className="py-20 md:py-28 bg-[#D6E8EE]/10 relative overflow-hidden">
          <div className="absolute top-[10%] left-0 w-80 h-80 rounded-full bg-brand-soft/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-bold text-brand-secondary tracking-widest uppercase block">
                Expert Practitioners
              </span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-dark leading-tight">
                Meet Our Senior Homeopathic Consultants
              </h2>
              <p className="text-text-body/80 text-sm md:text-base">
                Our legacy is carried forward by highly qualified doctors combining decades of clinical diagnostic acumen and therapeutic excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">

              {/* Consultant 1: Dr. Navneet Sharma */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/5] w-full bg-slate-50">
                  <Image
                    src="/doctor-2-new.jpg"
                    alt="Dr. Navneet Sharma"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 text-center space-y-4 flex-grow flex flex-col">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-dark">Dr. Navneet Sharma</h3>
                    <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">D.H.M.S</p>
                    <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">Reg. No. : H-0104(U.K.H.M.B)</p>
                  </div>
                  <p className="text-sm text-text-body/80 leading-relaxed">
                    At Narayan Homoeopathic Chikitsalaya, we are dedicated to helping patients achieve better health through personalized homeopathic care. With years of medical expertise and a patient-first approach, our experienced team strives to deliver effective and compassionate treatment. To provide comprehensive healthcare services, we also offer a range of reliable pathological and diagnostic tests through our fully equipped pathology laboratory, ensuring quality care under one roof.
                  </p>
                </div>
              </div>

              {/* Consultant 2: Dr. Asha Sharma */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl transition-all duration-300 hover:shadow-2xl flex flex-col">
                <div className="relative aspect-[4/5] w-full bg-slate-50">
                  <Image
                    src="/doctor-asha-sharma.jpg"
                    alt="Dr. Asha Sharma"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-8 text-center space-y-4 flex-grow flex flex-col">
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-dark">Dr. Asha Sharma</h3>
                    <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">D.H.M.S</p>
                    <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">Reg. No. : H-0105(U.K.H.M.B)</p>
                  </div>
                  <p className="text-sm text-text-body/80 leading-relaxed">
                    Narayan Homoeopathic Chikitsalaya is committed to providing holistic healthcare solutions tailored to your individual needs. Backed by experienced professionals and advanced diagnostic facilities, we focus on delivering trusted homeopathic treatments and accurate pathology services. Our mission is to support your journey toward improved health, well-being, and a better quality of life.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BOOK APPOINTMENT CALLOUT */}
        <section id="booking" className="py-20 bg-brand-primary relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10 space-y-8">
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white">
              Ready to Experience Healing at its Source?
            </h2>
            <p className="text-brand-light/95 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Book a comprehensive constitutional consultation session with our expert homeopaths today. Take your first step toward lasting health.
            </p>
            <div className="flex justify-center">
              <a
                href="/booking"
                className="bg-white text-brand-dark hover:bg-slate-50 font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-xl flex items-center gap-2 group"
              >
                <span>Schedule Appointment</span>
                <Calendar size={18} className="text-brand-secondary" />
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
