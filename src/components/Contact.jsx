import React from 'react';
import { Send, MapPin, Mail, Phone, Globe } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent!');
  };

  const info = [
    { icon: <Mail  size={13} />, label: 'Email',      val: 'adage26@gmail.com' },
    { icon: <Phone size={13} />, label: 'Phone',      val: '+91 81225 78554' },
    { icon: <Globe size={13} />, label: 'Social',     val: '@adage_gceerode' },
    { icon: <MapPin size={13}/>, label: 'Department', val: 'Civil Block, GCE Erode' },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Title */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-px bg-[#C8922A]" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C8922A]">Contact</span>
          </div>
          <h1 className="font-cinzel font-black text-4xl md:text-5xl text-[#EDEBE6] uppercase tracking-wide">
            Get In Touch
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Form */}
          <div>
            <h2 className="font-cinzel font-bold text-lg text-[#EDEBE6] uppercase tracking-wider mb-8 pb-4 border-b border-white/[0.06]">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="section-label block mb-2">Name</label>
                  <input type="text" required placeholder="Your name" className="civil-input" />
                </div>
                <div>
                  <label className="section-label block mb-2">Email</label>
                  <input type="email" required placeholder="your@email.com" className="civil-input" />
                </div>
              </div>
              <div>
                <label className="section-label block mb-2">Subject</label>
                <input type="text" required placeholder="Event query" className="civil-input" />
              </div>
              <div>
                <label className="section-label block mb-2">Message</label>
                <textarea rows={5} required placeholder="Your message..." className="civil-input resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Send Message <Send size={13} />
              </button>
            </form>
          </div>

          {/* Info column */}
          <div>
            <h2 className="font-cinzel font-bold text-lg text-[#EDEBE6] uppercase tracking-wider mb-8 pb-4 border-b border-white/[0.06]">
              Our Location
            </h2>

            <div className="h-52 border border-white/[0.06] overflow-hidden mb-8">
              <iframe
                title="Venue Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.665798485202!2d77.671343715335!3d11.431257491879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba915d3f3f5a6e1%3A0x6b803023e98c9195!2sGovernment%20College%20of%20Engineering%2C%20Erode!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%" height="100%" className="border-0 grayscale opacity-50 hover:opacity-80 transition-opacity"
                allowFullScreen loading="lazy"
              />
            </div>

            <div className="divide-y divide-white/[0.04]">
              {info.map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4">
                  <div className="text-[#C8922A] mt-0.5 flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="section-label mb-1">{item.label}</p>
                    <p className="text-sm text-[#666]">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
