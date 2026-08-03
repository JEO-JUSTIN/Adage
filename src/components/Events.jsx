import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, X, Phone, ArrowRight, Loader, Zap } from 'lucide-react';
import { Sr, Pt } from '../events';
import { supabase } from '../supabase';

function EventModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#111] w-full max-w-2xl border border-white/[0.08] relative flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-[#EDEBE6] z-10 transition-colors">
          <X size={20} />
        </button>

        {/* Modal header */}
        <div className="relative h-40 flex-shrink-0 overflow-hidden">
          <img src={event.image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent" />
          <div className="absolute bottom-5 left-6 right-12">
            <span className="text-[#C8922A] text-[9px] font-bold uppercase tracking-[0.4em]">{event.category}</span>
            <h3 className="font-cinzel font-black text-xl md:text-2xl text-[#EDEBE6] uppercase tracking-widest mt-1">{event.title}</h3>
            {event.slogan && <p className="text-gray-400 text-[10px] italic mt-1">"{event.slogan}"</p>}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8">
          {/* Quick info */}
          <div className="grid grid-cols-3 gap-px bg-white/[0.04]">
            {[
              { label: 'Fee',     val: `₹${event.fee} / head` },
              { label: 'Team',    val: `Max ${event.maxMembers} members` },
              { label: 'Prize',   val: event.prize },
            ].map((item, i) => (
              <div key={i} className="bg-[#111] px-4 py-4">
                <p className="section-label mb-1">{item.label}</p>
                <p className="text-[#EDEBE6] text-xs font-semibold">{item.val}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[#C8922A] text-[9px] font-bold uppercase tracking-[0.3em] mb-3 accent-bar">Description</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
          </div>

          {/* Rounds */}
          {event.rounds?.length > 0 && (
            <div>
              <h4 className="text-[#C8922A] text-[9px] font-bold uppercase tracking-[0.3em] mb-4 accent-bar">Event Rounds</h4>
              <div className="space-y-3">
                {event.rounds.map((r, i) => (
                  <div key={i} className="border border-white/[0.06] p-5 hover:border-[#C8922A]/20 transition-colors">
                    <p className="text-[#C8922A] text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Zap size={11} />{r.name}
                    </p>
                    <p className="text-gray-300 text-xs leading-relaxed">{r.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules */}
          <div>
            <h4 className="text-[#C8922A] text-[9px] font-bold uppercase tracking-[0.3em] mb-4 accent-bar">
              {event.category === Pt.NON_TECHNICAL ? 'Rules for Play' : 'Instructions & Guidelines'}
            </h4>
            <ul className="space-y-3">
              {event.rules.map((rule, i) => (
                <li key={i} className="flex gap-4 text-xs text-gray-300 leading-relaxed">
                  <span className="text-[#C8922A] font-cinzel mt-0.5 flex-shrink-0 font-bold">{String(i+1).padStart(2,'0')}.</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Coordinators */}
          {event.coordinators && (
            <div>
              <h4 className="text-[#C8922A] text-[9px] font-bold uppercase tracking-[0.3em] mb-4 accent-bar">Coordinators</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.coordinators.map((c, i) => (
                  <div key={i} className="border border-white/[0.06] px-4 py-3 flex items-center justify-between hover:border-[#C8922A]/20 transition-colors">
                    <div>
                      <p className="text-[#EDEBE6] text-xs font-semibold">{c.name}</p>
                      <p className="text-gray-400 text-[10px] font-mono mt-0.5">{c.phone}</p>
                    </div>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="text-[#C8922A] hover:text-[#EDEBE6] transition-colors ml-3">
                        <Phone size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="p-5 border-t border-white/[0.06] flex-shrink-0">
          <Link
            to={`/register?eventId=${event.id}`}
            className="btn-primary w-full justify-center"
          >
            Register for this Event <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents]           = useState([]);
  const [filter, setFilter]           = useState('All');
  const [isLoading, setIsLoading]     = useState(true);
  const [selectedEvent, setSelected]  = useState(null);
  const fallback = 'https://images.unsplash.com/photo-1503387762-592dedb8c260?auto=format&fit=crop&q=80&w=800';

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('events').select('*');
        setEvents(data?.length ? data : Sr);
      } catch { setEvents(Sr); }
      finally { setIsLoading(false); }
    })();
  }, []);

  const categories = ['All', ...Object.values(Pt)];
  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="animate-spin text-[#C8922A]" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen py-20">
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelected(null)} />}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Title */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-px bg-[#C8922A]" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C8922A] font-bold">Symposium Events</span>
          </div>
          <h1 className="font-cinzel font-black text-4xl md:text-5xl text-[#EDEBE6] uppercase tracking-wide">
            ADAGE'26 Events
          </h1>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-0 border-b border-white/[0.06] mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 -mb-px ${
                filter === cat
                  ? 'border-[#C8922A] text-[#C8922A]'
                  : 'border-transparent text-gray-400 hover:text-[#EDEBE6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-24 font-cinzel uppercase tracking-widest">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {filtered.map(event => (
              <div key={event.id} className="bg-[#0C0C0C] hover:bg-[#0F0F0F] transition-colors group flex flex-col border border-white/5 hover:border-[#C8922A]/20">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.image || fallback}
                    alt={event.title}
                    onError={e => e.target.src = fallback}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/30 to-transparent" />
                  <span className="absolute top-4 right-4 bg-[#C8922A] text-[#0C0C0C] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                    ₹{event.fee} / Head
                  </span>
                </div>

                {/* Info */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] text-[#C8922A] font-bold uppercase tracking-[0.25em]">{event.category}</span>
                    <span className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                      <Users size={10} /> {event.maxMembers} max
                    </span>
                  </div>
                  <h3 className="font-cinzel font-black text-lg text-[#EDEBE6] uppercase tracking-wider mb-3 group-hover:text-[#C8922A] transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-grow line-clamp-3">{event.description}</p>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      onClick={() => setSelected(event)}
                      className="btn-ghost px-3 py-2.5 text-[9px] justify-center text-gray-300"
                    >
                      Details
                    </button>
                    <Link
                      to={`/register?eventId=${event.id}`}
                      className="btn-primary px-3 py-2.5 text-[9px] justify-center"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
