import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, QrCode, Award, Utensils, ArrowRight } from 'lucide-react';
import { lp } from '../events';

function CountdownTimer({ targetDate }) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const Unit = ({ value, label }) => (
    <div className="text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px] flex items-center justify-center border border-white/[0.06] bg-white/[0.02]">
        <p className="font-cinzel font-black text-2xl sm:text-3xl md:text-4xl text-[#EDEBE6] tabular-nums leading-none">
          {String(value).padStart(2, '0')}
        </p>
      </div>
      <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-[#C8922A] mt-2 font-bold">{label}</p>
    </div>
  );

  return (
    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
      <Unit value={t.days}    label="Days" />
      <span className="font-cinzel text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4">:</span>
      <Unit value={t.hours}   label="Hours" />
      <span className="font-cinzel text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4">:</span>
      <Unit value={t.minutes} label="Mins" />
      <span className="font-cinzel text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4">:</span>
      <Unit value={t.seconds} label="Secs" />
    </div>
  );
}

export default function Home() {
  const essentials = [
    { icon: <ShieldCheck size={16} />, title: 'College ID Mandatory',    desc: 'Valid college ID card required at venue for all participants.' },
    { icon: <QrCode       size={16} />, title: 'Digital Pass Required',  desc: 'Show your registration QR code at reception for entry.' },
    { icon: <Award        size={16} />, title: 'Certificates Provided',  desc: 'Hard-copy participation certificates for all attendees.' },
    { icon: <Utensils     size={16} />, title: 'Lunch Included',         desc: 'Complimentary lunch provided for every registered participant.' },
  ];

  const highlights = [
    { num: '10+',  label: 'Events',       desc: 'Technical & non-technical Civil Engineering competitions.' },
    { num: '₹50K', label: 'Prize Pool',   desc: 'Cash awards and trophies across all categories.' },
    { num: '500+', label: 'Participants', desc: 'Students from colleges across Tamil Nadu.' },
  ];

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="min-h-[calc(100vh-3.5rem)] flex items-center px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto py-16 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Brand & Actions */}
          <div className="space-y-5 sm:space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="w-6 sm:w-8 h-px bg-[#C8922A]" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#C8922A] font-bold">
                National Symposium · Civil Engineering
              </p>
            </div>
            
            <h1 className="font-cinzel font-black leading-none text-[#EDEBE6] tracking-tight"
                style={{ fontSize: 'clamp(3.2rem,10vw,8.5rem)' }}>
              ADAGE
            </h1>
            
            <div className="flex items-center gap-3 sm:gap-4 py-1">
              <div className="h-px w-8 sm:w-10 bg-[#C8922A]/40" />
              <p className="font-cinzel text-[10px] sm:text-xs text-gray-300 uppercase tracking-[0.3em] sm:tracking-[0.4em] font-semibold">
                Build · Compete · Evolve
              </p>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Explore your engineering capabilities, draft designs, test structures, and challenge your analytical thinking at the GCE Erode Civil Engineering Department's annual technical convergence.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link to="/register" className="btn-primary group justify-center sm:justify-start">
                Register Now
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/events" className="btn-ghost justify-center sm:justify-start">
                View Events
              </Link>
            </div>
          </div>

          {/* Right Column: Year Indicator, Countdown, & Venue */}
          <div className="flex flex-col items-center md:items-end justify-center space-y-6 sm:space-y-8 md:text-right border-t md:border-t-0 md:border-r border-white/5 pt-8 md:pt-0 md:pr-12 animate-fade-in-up anim-delay-200">
            {/* The giant '26 */}
            <div className="relative">
              <h2 className="font-cinzel font-black leading-none text-[#C8922A] tracking-tighter inline-block select-none"
                  style={{ fontSize: 'clamp(5rem,16vw,13rem)' }}>
                '26
              </h2>
            </div>

            {/* Countdown */}
            <div className="space-y-3 sm:space-y-4 w-full flex flex-col items-center md:items-end">
              <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">Event Commencing In</p>
              <div className="flex justify-center md:justify-end">
                <CountdownTimer targetDate={lp} />
              </div>
            </div>

            {/* Venue details */}
            <div className="space-y-1 text-center md:text-right">
              <p className="text-xs font-bold text-[#EDEBE6] uppercase tracking-wider">
                24 August 2026
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
                GCE Erode Campus · 9:00 AM
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────── */}
      <div className="h-px bg-white/[0.06]" />

      {/* ── Essentials ───────────────────────────────────── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <span className="section-label">01</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
          <span className="section-label">Participant Essentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
          {essentials.map((item, i) => (
            <div key={i} className="bg-[#0C0C0C] p-6 sm:p-8 hover:bg-[#111] transition-colors group border border-white/5 hover:border-[#C8922A]/20 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-[#C8922A] mb-4 sm:mb-5">{item.icon}</div>
              <h3 className="text-[#EDEBE6] font-semibold text-sm mb-2">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* ── Highlights ───────────────────────────────────── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <span className="section-label">02</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
          <span className="section-label">What to Expect</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
          {highlights.map((item, i) => (
            <div key={i} className="bg-[#0C0C0C] p-8 sm:p-10 hover:bg-[#111] transition-colors border border-white/5 hover:border-[#C8922A]/20 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="font-cinzel font-black text-4xl sm:text-5xl text-[#C8922A] mb-3 sm:mb-4">{item.num}</p>
              <p className="text-[#EDEBE6] font-semibold text-sm uppercase tracking-wider mb-2 sm:mb-3">{item.label}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* ── Footer strip ─────────────────────────────────── */}
      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[9px] sm:text-[10px] text-[#C8922A]/80 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-semibold text-center sm:text-left">
          ADAGE'26 · GCE Erode · Department of Civil Engineering
        </p>
        <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium">
          Created by Suganth Laxman
        </p>
      </div>
    </div>
  );
}
