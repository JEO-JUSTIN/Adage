import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas-pro';
import { Mail, Search, CheckCircle, Clock, AlertCircle, XCircle, ArrowRight, RefreshCw, Loader, Download, Award } from 'lucide-react';
import { supabase } from '../supabase';
import { ut } from '../events';

export default function Verify() {
  const [emailInput, setEmailInput] = useState('');
  const [registration, setRegistration] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [qrBlobUrl, setQrBlobUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const passRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let activeUrl = "";
    if (registration && (registration.status === ut.CONFIRMED || registration.status === ut.PRESENT || registration.status === ut.PENDING)) {
      const data = JSON.stringify({ id: registration.id, type: "ADAGE_ENTRY" });
      const api = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=000&color=C8922A&data=${encodeURIComponent(data)}`;
      
      fetch(api)
        .then(r => r.blob())
        .then(b => {
          activeUrl = URL.createObjectURL(b);
          setQrBlobUrl(activeUrl);
        })
        .catch(err => console.error("Error generating QR blob:", err));
    } else {
      setQrBlobUrl("");
    }
    
    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [registration]);

  const handleDownloadPass = async () => {
    if (passRef.current) {
      setIsDownloading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const canvas = await html2canvas(passRef.current, {
          backgroundColor: "#000000",
          scale: 2,
          useCORS: true,
          logging: false
        });

        const link = document.createElement("a");
        link.download = `ADAGE_ENTRY_PASS_${registration?.id}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
        alert("Download failed - please take a screenshot of your pass instead.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const doSearch = async (email) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();
      if (error) throw error;
      setRegistration(data);
    } catch { setRegistration(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSearching(true);
    setAttempted(false);
    await doSearch(emailInput);
    setIsSearching(false);
    setAttempted(true);
  };

  useEffect(() => {
    if (!registration?.email) return;
    const email = registration.email.toLowerCase();
    const ch = supabase
      .channel(`adage-live-verify-${email}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations', filter: `email=eq.${email}` },
        (payload) => { setRegistration(payload.new); if (navigator.vibrate) navigator.vibrate(150); })
      .subscribe(s => setIsLive(s === 'SUBSCRIBED'));
    return () => { supabase.removeChannel(ch); setIsLive(false); };
  }, [registration?.email]);

  const statusConfig = {
    [ut.PRESENT]:   { icon: <CheckCircle size={28} className="text-blue-400" />,  label: 'Checked In',         color: 'text-blue-400',  msg: "Welcome to ADAGE'26! Your physical entry has been verified at the gate." },
    [ut.CONFIRMED]: { icon: <CheckCircle size={28} className="text-green-500" />, label: 'Payment Verified',   color: 'text-green-500', msg: 'Your payment has been verified. Your entry pass is now active in the dashboard.' },
    [ut.REJECTED]:  { icon: <XCircle size={28} className="text-red-500" />,       label: 'Issue Detected',     color: 'text-red-500',   msg: 'There was an issue with your transaction. Please contact the help desk.' },
    [ut.PENDING]:   { icon: <Clock size={28} className="text-[#C8922A]" />,       label: 'Awaiting Verification', color: 'text-[#C8922A]', msg: "We've received your registration. Our team is currently verifying your transaction." },
  };

  const cfg = registration ? (statusConfig[registration.status] || statusConfig[ut.PENDING]) : null;

  return (
    <div className="min-h-screen py-16 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Title */}
        <div className="mb-8 sm:mb-12 animate-fade-in-up">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <span className="w-6 sm:w-8 h-px bg-[#C8922A]" />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#C8922A] font-bold">Verification</span>
          </div>
          <h1 className="font-cinzel font-black text-2xl sm:text-3xl md:text-4xl text-[#EDEBE6] uppercase tracking-wide mb-3 sm:mb-4">
            Check Your Status
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Enter your registered email address to check payment verification status. The page updates <span className="text-[#EDEBE6]">live</span> once verified.
          </p>
        </div>

        {/* Search */}
        <div className="border border-white/[0.06] p-4 sm:p-8 mb-6 sm:mb-8 relative animate-fade-in-up anim-delay-100">
          {isLive && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-green-500 font-bold">Live</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            <div className="relative flex-grow">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="Registered email address"
                className="civil-input !pl-11 pr-4"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="btn-primary px-6 flex-shrink-0 disabled:opacity-40 justify-center sm:justify-start"
            >
              {isSearching ? <Loader className="animate-spin" size={16} /> : <><Search size={14} /> Verify</>}
            </button>
          </form>
        </div>

        {/* Result */}
        {attempted && (
          registration ? (
            <div className="border border-white/[0.06] overflow-hidden animate-fade-in-up">
              {/* Status bar */}
              <div className="bg-[#111] px-4 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center gap-3 sm:gap-4 border-b border-white/[0.06]">
                <div className="flex-shrink-0 mt-0.5 sm:mt-0">{cfg.icon}</div>
                <div>
                  <p className={`font-cinzel font-bold text-base sm:text-lg ${cfg.color}`}>{cfg.label}</p>
                  <p className="text-gray-300 text-[11px] sm:text-xs mt-0.5 leading-relaxed">{cfg.msg}</p>
                </div>
              </div>

              {/* Data rows */}
              <div className="divide-y divide-white/[0.04]">
                {[
                  { label: 'Participant',  val: registration.name },
                  { label: 'Reference ID', val: registration.id, mono: true, accent: true },
                  { label: 'College',      val: registration.college },
                  { label: 'Total Fee',    val: `₹${registration.totalFee}` },
                ].map((row, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-0.5 sm:gap-0">
                    <span className="section-label">{row.label}</span>
                    <span className={`text-xs font-semibold ${row.accent ? 'text-[#C8922A] font-mono' : 'text-[#EDEBE6]'}`}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dashboard CTA */}
              {(registration.status === ut.CONFIRMED || registration.status === ut.PRESENT || registration.status === ut.PENDING) && (
                <div className="p-4 sm:p-5 border-t border-white/[0.06] space-y-5">
                  {/* Digital Entry Pass Preview Card */}
                  <div className="relative max-w-sm mx-auto mb-6">
                    <div ref={passRef} className="bg-black border-2 border-[#C8922A] p-6 text-left relative overflow-hidden shadow-2xl">
                      {/* Background CAD Grid Overlay */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />

                      {/* Pass Header */}
                      <div className="flex justify-between items-start border-b border-[#C8922A]/40 pb-4 mb-5 relative z-10">
                        <div>
                          <span className="text-[9px] text-[#C8922A] font-cad font-bold tracking-[0.3em] uppercase block">
                            DEPT OF CIVIL ENGG
                          </span>
                          <h3 className="font-cinzel font-black text-xl text-[#EDEBE6] tracking-widest uppercase">
                            ADAGE'26 PASS
                          </h3>
                        </div>
                        <Award size={24} className="text-[#C8922A]" />
                      </div>

                      {/* QR Code */}
                      <div className="bg-white p-3 inline-block border border-[#C8922A] mb-5 relative z-10 w-full text-center">
                        {qrBlobUrl ? (
                          <img src={qrBlobUrl} alt="Pass QR Code" className="w-40 h-40 mx-auto" />
                        ) : (
                          <div className="w-40 h-40 flex items-center justify-center mx-auto">
                            <Loader className="animate-spin text-[#C8922A]" size={24} />
                          </div>
                        )}
                        <span className="text-[9px] font-cad font-bold text-black block mt-1 tracking-widest">
                          ID: {registration.id}
                        </span>
                      </div>

                      {/* Participant Info */}
                      <div className="space-y-3 font-cad text-xs relative z-10 border-t border-white/[0.08] pt-4">
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-wider block">NAME</span>
                          <strong className="text-[#EDEBE6] uppercase">{registration.name}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 uppercase tracking-wider block">COLLEGE</span>
                          <span className="text-gray-300">{registration.college}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/[0.06] pt-2">
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider block">TOTAL FEE</span>
                            <strong className="text-[#C8922A]">₹{registration.totalFee}</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider block">VERIFICATION</span>
                            <span className={`font-bold uppercase ${cfg.color}`}>{registration.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Container */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleDownloadPass}
                      disabled={isDownloading}
                      className="btn-ghost justify-center py-4 text-xs tracking-widest sm:flex-1 disabled:opacity-50"
                    >
                      {isDownloading ? <Loader className="animate-spin" size={16} /> : <Download size={16} />}
                      DOWNLOAD PASS
                    </button>
                    <button
                      onClick={() => { localStorage.setItem('adage_user_email', registration.email); navigate('/dashboard'); }}
                      className="btn-primary justify-center py-4 text-xs tracking-widest sm:flex-1"
                    >
                      Go to Dashboard <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-red-500/10 p-8 sm:p-10 text-center animate-fade-in-up">
              <AlertCircle className="text-red-500/50 mx-auto mb-4" size={28} />
              <h3 className="font-cinzel font-bold text-[#EDEBE6] mb-2 uppercase tracking-wider text-sm sm:text-base">Not Found</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                No record found for this email. If you just registered, please wait a minute for sync.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <button onClick={() => window.location.reload()} className="btn-ghost px-5 py-2.5">
                  <RefreshCw size={13} /> Retry
                </button>
                <Link to="/register" className="btn-primary px-5 py-2.5">
                  Register Now <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )
        )}

        <p className="text-center text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-widest mt-8 sm:mt-10">
          Manual verification · Contact adage26@gmail.com for delays &gt; 24 hours
        </p>
      </div>
    </div>
  );
}
