"use client";

import { CheckCircle2, Award, HeartHandshake, Star } from "lucide-react";

export default function TrustStrip() {
  const trusts = [
    {
      icon: <Star className="text-amber-500 fill-amber-500" size={20} />,
      title: "★★★★★ Rating",
      desc: "Trusted by 1000+ Patients",
    },
    {
      icon: <Award className="text-brand-secondary" size={20} />,
      title: "25+ Years Exp",
      desc: "Homeopathic Specialists",
    },
    {
      icon: <CheckCircle2 className="text-cta" size={20} />,
      title: "10,000+ Cases",
      desc: "Successful Consultations",
    },
    {
      icon: <HeartHandshake className="text-red-400" size={20} />,
      title: "Personalized Care",
      desc: "Tailored Treatment Plans",
    },
  ];

  return (
    <section className="bg-brand-dark text-white border-y border-white/5 py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center divide-x-0 lg:divide-x divide-white/10">
          {trusts.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 px-2 lg:px-6 py-2 transition-transform duration-200 hover:scale-[1.02] ${
                idx !== 0 ? "" : ""
              }`}
            >
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-heading font-bold text-sm md:text-base text-white">
                  {item.title}
                </p>
                <p className="text-xs text-white/70 font-light mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
