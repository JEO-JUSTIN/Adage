import React from 'react';
import { MapPin, Phone, Clock, Target, Globe, Users } from 'lucide-react';

export default function About() {
  const stats = [
    { num: '1978', label: 'Established' },
    { num: '60+',  label: 'Faculty' },
    { num: '5000+',label: 'Alumni' },
    { num: '18+',  label: 'Laboratories' },
  ];

  const values = [
    {
      icon: <Target size={18} />,
      title: 'Our Mission',
      desc: 'Develop world-class civil engineers through rigorous academics, applied research, and strong industry partnerships.',
    },
    {
      icon: <Globe size={18} />,
      title: 'Our Vision',
      desc: 'A premier institution shaping infrastructure leaders who build a sustainable, resilient future for India.',
    },
    {
      icon: <Users size={18} />,
      title: 'Our Community',
      desc: 'A vibrant network of 5,000+ alumni leading landmark infrastructure projects across the nation and internationally.',
    },
  ];

  const contactItems = [
    { icon: <MapPin size={13} />, label: 'Address', value: 'Sathy Road, Perundurai, Erode — 638 052' },
    { icon: <Phone size={13} />,  label: 'Contact', value: '+91 94430 39388' },
    { icon: <Clock size={13} />,  label: 'Event',   value: 'Monday, 24 August 2026 · 9 AM onwards' },
  ];

  return (
    <div className="min-h-screen">

      {/* ── Intro ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span className="w-6 sm:w-8 h-px bg-[#C8922A]" />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#C8922A] font-bold">About</span>
            </div>
            <h1 className="font-cinzel font-black text-2xl sm:text-3xl md:text-4xl text-[#EDEBE6] mb-6 sm:mb-8 leading-tight uppercase">
              Building the Future,<br />One Structure at a Time
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
              The Department of Civil Engineering at Government College of Engineering, Erode is one of
              the oldest and most respected departments in the institution. With a legacy of producing
              skilled engineers, the department combines rigorous academics with hands-on practical training.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              ADAGE'26 is our flagship national-level technical symposium — a platform where students
              converge to innovate, compete, and learn from the best in the field.
            </p>
          </div>

          {/* Image with corner bracket accents */}
          <div className="relative animate-fade-in-up anim-delay-200">
            <div className="absolute -top-2 sm:-top-3 -left-2 sm:-left-3 w-8 sm:w-10 h-8 sm:h-10 border-t border-l border-[#C8922A]/40" />
            <img
              src="hero_banner.png"
              alt="Civil Engineering — GCE Erode"
              className="w-full h-56 sm:h-72 lg:h-80 object-cover"
            />
            <div className="absolute -bottom-2 sm:-bottom-3 -right-2 sm:-right-3 w-8 sm:w-10 h-8 sm:h-10 border-b border-r border-[#C8922A]/40" />
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────── */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.06]">
          {stats.map((s, i) => (
            <div key={i} className="px-6 sm:px-8 py-8 sm:py-10 text-center hover:bg-[#111] transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="font-cinzel font-black text-3xl sm:text-4xl text-[#C8922A] mb-2">{s.num}</p>
              <p className="section-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────── */}
      <section className="py-14 sm:py-20 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <span className="section-label">01</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="section-label">Core Values</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
            {values.map((v, i) => (
              <div key={i} className="bg-[#0C0C0C] p-8 sm:p-10 hover:bg-[#0F0F0F] transition-colors border border-white/5 hover:border-[#C8922A]/20 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-[#C8922A] mb-4 sm:mb-5">{v.icon}</div>
                <h3 className="font-cinzel font-bold text-sm sm:text-base text-[#EDEBE6] uppercase tracking-wider mb-2 sm:mb-3">{v.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location ───────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <span className="section-label">02</span>
            <div className="h-px flex-1 bg-white/[0.04]" />
            <span className="section-label">Venue</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
            <div className="animate-fade-in-up">
              <h3 className="font-cinzel font-bold text-lg sm:text-xl text-[#EDEBE6] mb-4 sm:mb-6 uppercase tracking-wide">
                Government College of Engineering, Erode
              </h3>
              <div className="space-y-0 divide-y divide-white/[0.04]">
                {contactItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4 py-3 sm:py-4">
                    <div className="text-[#C8922A] mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="section-label mb-1">{item.label}</p>
                      <p className="text-xs sm:text-sm text-gray-400">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-52 sm:h-64 lg:h-full min-h-[220px] overflow-hidden border border-white/[0.06] animate-fade-in-up anim-delay-200">
              <iframe
                title="GCE Erode Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.665798485202!2d77.671343715335!3d11.431257491879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba915d3f3f5a6e1%3A0x6b803023e98c9195!2sGovernment%20College%20of%20Engineering%2C%20Erode!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%" height="100%" className="border-0 grayscale opacity-50 hover:opacity-80 transition-opacity"
                allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
