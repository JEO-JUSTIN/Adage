import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const active = (p) => pathname === p;

  const links = [
    { name: 'Home',         path: '/' },
    { name: 'About',        path: '/about' },
    { name: 'Events',       path: '/events' },
    { name: 'Check Status', path: '/verify' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0C0C0C]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* Civil engineering "target" icon */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <div className="absolute inset-0 border border-[#C8922A]" />
            <div className="w-1.5 h-1.5 bg-[#C8922A]" />
          </div>
          <span className="font-cinzel font-bold text-[13px] tracking-[0.25em] text-white">
            ADAGE<span className="text-[#C8922A]">'26</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`relative text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-200 group ${
                active(l.path) ? 'text-[#C8922A]' : 'text-[#5A5A5A] hover:text-[#EDEBE6]'
              }`}
            >
              {l.name}
              <span className={`absolute -bottom-0.5 left-0 h-px bg-[#C8922A] transition-all duration-300 ${
                active(l.path) ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
          <Link
            to="/register"
            className="btn-primary text-[10px] px-5 py-2"
          >
            Register
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#5A5A5A] hover:text-[#EDEBE6] transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0C0C0C] px-6 py-5 space-y-4">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className={`block text-[11px] font-medium uppercase tracking-[0.15em] py-1 ${
                active(l.path) ? 'text-[#C8922A]' : 'text-[#5A5A5A]'
              }`}
            >
              {l.name}
            </Link>
          ))}
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="btn-primary block text-center"
          >
            Register Now
          </Link>
        </div>
      )}
    </nav>
  );
}
