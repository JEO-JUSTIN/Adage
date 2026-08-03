import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Check, Info, Users, Smartphone, ShieldCheck, Download, Users as UserGroup, Award, ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import { supabase } from '../supabase';
import { Sr, Pt, ut } from '../events';

export default function Register() {
  const [dbEvents, setDbEvents] = React.useState([]);
  const [loadingDb, setLoadingDb] = React.useState(true);

  React.useEffect(() => {
    async function loadEvents() {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (error) throw error;
        setDbEvents(data || []);
      } catch (err) {
        console.error("Failed to fetch events from DB, using fallback", err);
        setDbEvents(Sr);
      } finally {
        setLoadingDb(false);
      }
    }
    loadEvents();
  }, []);

  const activeEvents = dbEvents.length > 0 ? dbEvents : Sr;
  const navigate = useNavigate();
  const location = useLocation();
  const passRef = useRef(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [createdRecord, setCreatedRecord] = useState(null);

  const [form, setForm] = useState({
    name: "",
    college: "",
    department: "",
    email: "",
    phone: "",
    transactionId: "",
    selectedEvents: [],
    teamMembers: []
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    phone: "",
    transactionId: ""
  });

  const upiId = "midhun73272@oksbi";
  const techBaseFee = 250;
  const nonTechBaseFee = 150;

  // Selected events config
  const selectedEventsList = activeEvents.filter(event => form.selectedEvents.includes(event.id));
  const hasTechSelected = selectedEventsList.some(event => event.category === Pt.TECHNICAL);
  const nonTechSelectedList = selectedEventsList.filter(event => event.category === Pt.NON_TECHNICAL);

  // Maximum team size calculation
  const maxTeamCapacity = hasTechSelected
    ? Math.max(...selectedEventsList.filter(e => e.category === Pt.TECHNICAL).map(e => e.maxMembers))
    : nonTechSelectedList.length > 0
    ? Math.max(...nonTechSelectedList.map(e => e.maxMembers))
    : 1;

  const validTeamCount = form.teamMembers.filter(name => name.trim() !== "").length;
  const totalParticipants = 1 + validTeamCount;
  
  // Fee Calculation
  // flat base rate (250 for tech, 150 for non-tech) * total number of participants
  const baseRate = hasTechSelected ? techBaseFee : nonTechBaseFee;
  const totalPayableFee = totalParticipants * baseRate;

  // Set selected event from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventId = params.get('eventId');
    if (eventId) {
      setForm(prev => {
        let events = [...prev.selectedEvents];
        if (activeEvents.some(e => e.id === eventId) && !events.includes(eventId)) {
          events = [eventId];
        }
        
        const filteredList = activeEvents.filter(e => events.includes(e.id));
        const maxCap = filteredList.some(e => e.category === Pt.TECHNICAL)
          ? Math.max(...filteredList.filter(e => e.category === Pt.TECHNICAL).map(e => e.maxMembers))
          : filteredList.length > 0
          ? Math.max(...filteredList.map(e => e.maxMembers))
          : 1;

        const members = [...prev.teamMembers].slice(0, maxCap - 1);
        while (members.length < maxCap - 1) {
          members.push("");
        }

        return { ...prev, selectedEvents: events, teamMembers: members };
      });
    }
  }, [location.search]);

  // Validators
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone.replace(/\s/g, ""));

  useEffect(() => {
    let emailErr = "";
    let phoneErr = "";
    let txErr = "";

    if (form.email && !validateEmail(form.email)) {
      emailErr = "Invalid email address format";
    }
    if (form.phone && !validatePhone(form.phone)) {
      phoneErr = "Phone number must be 10 digits";
    }
    if (form.transactionId && form.transactionId.length > 0 && form.transactionId.length < 12) {
      txErr = "Transaction ID must be 12 digits";
    }

    setValidationErrors({
      email: emailErr,
      phone: phoneErr,
      transactionId: txErr
    });
  }, [form.email, form.phone, form.transactionId]);

  // Toggle selected event
  const toggleEventSelection = (id) => {
    const targetEvent = activeEvents.find(e => e.id === id);
    if (!targetEvent) return;

    setForm(prev => {
      const isSelected = prev.selectedEvents.includes(id);
      let events = [...prev.selectedEvents];

      if (isSelected) {
        events = events.filter(e => e !== id);
      } else {
        const currentSelectedList = activeEvents.filter(e => events.includes(e.id));
        const hasTech = currentSelectedList.some(e => e.category === Pt.TECHNICAL);
        const hasNonTech = currentSelectedList.some(e => e.category === Pt.NON_TECHNICAL);

        // Bundle offer: 1 Free Non-Tech Event if Tech is selected
        if (targetEvent.category === Pt.NON_TECHNICAL && hasTech && hasNonTech) {
          return prev; // Lock to maximum 1 non-tech if bundle is active
        }
        events.push(id);
      }

      const updatedSelectedList = activeEvents.filter(e => events.includes(e.id));
      const newMaxCap = updatedSelectedList.some(e => e.category === Pt.TECHNICAL)
        ? Math.max(...updatedSelectedList.filter(e => e.category === Pt.TECHNICAL).map(e => e.maxMembers))
        : updatedSelectedList.length > 0
        ? Math.max(...updatedSelectedList.map(e => e.maxMembers))
        : 1;

      const members = prev.teamMembers.slice(0, newMaxCap - 1);
      while (members.length < newMaxCap - 1) {
        members.push("");
      }

      return { ...prev, selectedEvents: events, teamMembers: members };
    });
  };

  const handleNextStep = () => {
    if (step === 1 && form.selectedEvents.length === 0) return;
    if (step === 2 && (
      !form.name || !form.college || !form.department || !form.email || !form.phone ||
      validationErrors.email || validationErrors.phone
    )) return;
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  // Submit to Database
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!form.transactionId || form.transactionId.length !== 12) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const generatedId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const payload = {
        id: generatedId,
        name: form.name,
        college: form.college,
        department: form.department,
        email: form.email.toLowerCase(),
        phone: form.phone,
        teamMembers: form.teamMembers.filter(m => m.trim() !== ""),
        events: form.selectedEvents.map(id => {
          const matched = activeEvents.find(e => e.id === id);
          return matched ? matched.title : "";
        }),
        totalFee: totalPayableFee,
        transactionId: form.transactionId,
        status: ut.PENDING,
        timestamp: new Date().toISOString()
      };

      const { error: dbError } = await supabase.from('registrations').insert([payload]);
      if (dbError) throw dbError;

      setCreatedRecord(payload);
      localStorage.setItem('adage_user_email', payload.email);
      setStep(4);
    } catch (err) {
      console.error("Submission failed:", err);
      setError({
        message: err.message || "Failed to complete registration."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate and download pass image
  const handleDownloadPass = async () => {
    if (passRef.current) {
      setIsDownloading(true);
      try {
        // Delay to allow elements to load
        await new Promise(resolve => setTimeout(resolve, 300));
        const canvas = await html2canvas(passRef.current, {
          backgroundColor: "#000000",
          scale: 2,
          useCORS: true,
          logging: false
        });

        const link = document.createElement("a");
        link.download = `ADAGE_PASS_${createdRecord?.id}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
        window.print();
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const upiPaymentLink = `upi://pay?pa=${upiId}&pn=ADAGE%20Symposium&am=${totalPayableFee}&cu=INR&tn=ADAGE%20Reg`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPaymentLink)}`;
  
  const passQrCodeUrl = createdRecord
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=000&color=FFD700&data=${encodeURIComponent(JSON.stringify({ id: createdRecord.id, type: "ADAGE_ENTRY" }))}`
    : "";

  const isUtrValid = form.transactionId.length === 12;

  return (
    <div className="py-24 bg-[#0C0C0C] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator */}
        {step < 4 && (
          <div className="mb-12 flex items-center justify-between">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div className={`flex items-center justify-center w-12 h-12 rounded border-2 transition-all duration-500 ${
                  step >= num ? "border-gold bg-gold text-black font-bold" : "border-white/10 text-gray-400"
                }`}>
                  {step > num ? <Check size={20} /> : num}
                </div>
                {num < 3 && (
                  <div className={`flex-grow h-1 mx-4 rounded transition-all duration-500 ${
                    step > num ? "bg-gold" : "bg-white/10"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="bg-[#111111] rounded-lg border border-white/10 shadow-md relative overflow-hidden">
          
          {/* Step 1: Event Selection */}
          {step === 1 && (
            <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="text-center">
                <h3 className="text-3xl font-cinzel font-bold text-white mb-2 uppercase tracking-widest">
                  Event Selection
                </h3>
                <p className="text-gray-400 text-sm">
                  Technical: ₹{techBaseFee} | Non-Technical: ₹{nonTechBaseFee}
                </p>
                {hasTechSelected && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-1 rounded">
                    <Check size={14} className="text-gold" />
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest">
                      Bundle Offer: 1 Free Non-Tech Event
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeEvents.map(event => {
                  const isSelected = form.selectedEvents.includes(event.id);
                  const isNonTech = event.category === Pt.NON_TECHNICAL;
                  const isBundleActiveForEvent = hasTechSelected && isNonTech;
                  
                  // Disable subsequent non-tech if already selected one (max 1 free non-tech under bundle)
                  const hasAlreadySelectedNonTech = form.selectedEvents.some(id => {
                    const matched = activeEvents.find(e => e.id === id);
                    return matched && matched.category === Pt.NON_TECHNICAL;
                  });
                  const isLockedNonTech = hasTechSelected && isNonTech && hasAlreadySelectedNonTech && !isSelected;

                  return (
                    <div
                      key={event.id}
                      onClick={() => !isLockedNonTech && toggleEventSelection(event.id)}
                      className={`p-4 rounded-2xl border transition-all ${
                        isLockedNonTech ? "opacity-20 grayscale cursor-not-allowed" : "cursor-pointer"
                      } ${
                        isSelected
                          ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                          : "bg-white/5 border-white/10 hover:border-gold/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white uppercase tracking-wider text-sm">
                          {event.title}
                        </h4>
                        {isSelected ? (
                          <Check className="text-gold" size={18} />
                        ) : isBundleActiveForEvent ? (
                          <span className="text-[9px] text-gold font-black bg-gold/5 px-2 py-0.5 rounded border border-gold/20">
                            FREE
                          </span>
                        ) : null}
                      </div>

                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-gray-400">{event.category}</span>
                        <span className="text-gold">₹{isBundleActiveForEvent ? "0" : event.fee}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    Base Rate Application:
                  </span>
                  <span className="text-xl font-cinzel font-bold text-gold">
                    ₹{baseRate} / Head
                  </span>
                </div>
                {hasTechSelected && (
                  <p className="text-[9px] text-gold/60 italic font-medium">
                    * Bundle applied: Access to all Tech events + 1 Non-Tech.
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNextStep}
                  disabled={form.selectedEvents.length === 0}
                  className="w-full bg-gold text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#B07A20] transition-all disabled:opacity-50 glow-gold uppercase tracking-widest text-sm"
                >
                  Confirm Team Details <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Team Profiles */}
          {step === 2 && (
            <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="text-center">
                <h3 className="text-3xl font-cinzel font-bold text-white mb-2 uppercase tracking-widest">
                  Team Profiles
                </h3>
                
                <div className="flex items-center justify-center gap-3 bg-gold/5 border border-gold/10 py-2 px-4 rounded max-w-fit mx-auto">
                  <UserGroup className="text-gold" size={16} />
                  <span className="text-xs font-bold text-gold uppercase tracking-widest">
                    Capacity: {totalParticipants} / {maxTeamCapacity}
                  </span>
                </div>
                {hasTechSelected && (
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2 font-bold">
                    Team size controlled by selected Technical events
                  </p>
                )}
              </div>

              {/* Primary Participant Form */}
              <div className="bg-black/20 p-8 rounded-3xl border border-white/5 mb-6">
                <h4 className="text-gold text-xs font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                    <Smartphone size={16} />
                  </div>
                  Primary Participant
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="As per ID"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C8922A] transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">College</label>
                    <input
                      type="text"
                      required
                      value={form.college}
                      onChange={e => setForm({ ...form, college: e.target.value })}
                      placeholder="Current Institution"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C8922A] transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</label>
                    <input
                      type="text"
                      required
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      placeholder="e.g. Civil, ECE"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C8922A] transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                      placeholder="10-digit number"
                      className={`w-full bg-white/5 border ${validationErrors.phone ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C8922A] transition-colors text-sm`}
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="leader@example.com"
                      className={`w-full bg-white/5 border ${validationErrors.email ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C8922A] transition-colors text-sm`}
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Team Members Form */}
              {maxTeamCapacity > 1 && (
                <div className="bg-black/20 p-8 rounded-3xl border border-white/5">
                  <h4 className="text-gold text-xs font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                      <Users size={16} />
                    </div>
                    Team Members (+₹{baseRate} each)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {form.teamMembers.map((member, index) => (
                      <div key={index} className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          Member {index + 2} Name
                        </label>
                        <input
                          type="text"
                          value={member}
                          onChange={e => {
                            const newMembers = [...form.teamMembers];
                            newMembers[index] = e.target.value;
                            setForm({ ...form, teamMembers: newMembers });
                          }}
                          placeholder="Optional Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C8922A] transition-colors text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Fee banner */}
              <div className="p-5 bg-gold/5 border border-gold/10 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Users className="text-gold" size={20} />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Payable Total</p>
                    <p className="text-white text-xs font-bold">
                      {totalParticipants} Participants × ₹{baseRate}
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-cinzel font-black text-gold">
                  ₹{totalPayableFee}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 border border-white/20 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-white/5 uppercase tracking-widest text-xs"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={
                    !form.name || !form.college || !form.department || !form.email || !form.phone ||
                    !!validationErrors.email || !!validationErrors.phone
                  }
                  className="flex-[2] bg-gold text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-[#B07A20] transition-all disabled:opacity-30 glow-gold"
                >
                  Proceed to Payment <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Secure Payment */}
          {step === 3 && (
            <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="text-center">
                <h3 className="text-3xl font-cinzel font-bold text-white mb-2 uppercase tracking-widest">
                  Secure Payment
                </h3>
                <p className="text-gray-400">
                  Total Payable: <span className="text-gold font-bold">₹{totalPayableFee}</span>
                </p>
              </div>

              <div className="flex flex-col items-center max-w-md mx-auto">
                {/* QR Code Container */}
                <div className="bg-white p-6 rounded-lg border-4 border-gold glow-gold shadow-md mb-12">
                  <img src={upiQrCodeUrl} alt="Payment QR Code" className="w-64 h-64 object-contain" />
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center">
                    <p className="text-black font-black text-xl tracking-widest">{upiId}</p>
                    <p className="text-gray-400 text-[10px] uppercase font-black mt-2">
                      Department of Civil Engineering GCE Erode
                    </p>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="w-full bg-amber-900/10 border border-amber-900/30 rounded-2xl p-5 mb-8">
                  <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={14} /> Important Notes
                  </h5>
                  <ul className="text-[10px] text-gray-400 space-y-2 list-disc pl-4 font-medium">
                    <li>Pay the exact amount shown (₹{totalPayableFee}) using any UPI app.</li>
                    <li>After payment, wait for the transaction to complete.</li>
                    <li>Copy the <span className="text-white font-bold">12-digit UTR / Transaction ID</span> from your app.</li>
                    <li>Enter the ID below to generate your downloadable entry pass instantly.</li>
                  </ul>
                </div>

                {/* UTR Input Form */}
                <div className="w-full space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center">
                    Enter Transaction ID (UTR)
                  </label>
                  <div className="relative">
                    <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      form.transactionId.length === 12 ? "text-gold" : "text-gray-400"
                    }`} size={18} />
                    <input
                      type="text"
                      required
                      maxLength={12}
                      value={form.transactionId}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        setForm({ ...form, transactionId: val });
                      }}
                      placeholder="12-digit code"
                      className={`w-full bg-white/5 border ${
                        validationErrors.transactionId ? "border-amber-500" : "border-white/10"
                      } rounded-2xl pl-12 pr-4 py-5 text-white focus:outline-none focus:border-[#C8922A] transition-colors text-center font-black tracking-[0.4em] text-xl`}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">
                  {error.message}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 border border-white/20 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-white/5 uppercase tracking-widest text-xs"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleRegistrationSubmit}
                  disabled={isSubmitting || !isUtrValid}
                  className={`flex-[2] py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isUtrValid
                      ? "bg-gold text-black hover:bg-[#B07A20] glow-gold"
                      : "bg-white/5 text-gray-400 border border-white/5 cursor-not-allowed opacity-30"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <ShieldCheck size={20} />
                  )}
                  {isSubmitting ? "Confirming..." : "Complete & Download Pass"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success Pass View */}
          {step === 4 && createdRecord && (
            <div className="p-8 md:p-12 text-center animate-in zoom-in duration-700 bg-gradient-to-b from-[#111] to-[#0A0A0A]">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="text-3xl md:text-5xl font-cinzel font-black text-white mb-4 tracking-widest uppercase">
                REGISTRATION SUCCESS
              </h3>
              <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Payment logged for ID: <span className="text-gold font-mono">{createdRecord.transactionId}</span>. Your pass is ready!
              </p>

              {/* Whatsapp Communities */}
              <div className="mb-12 max-w-md mx-auto">
                <h4 className="text-xs font-black text-gold uppercase tracking-[0.4em] mb-4 flex items-center justify-center gap-2">
                  <UserGroup size={14} /> Join Event Communities
                </h4>
                <div className="flex flex-col gap-3">
                  {form.selectedEvents.map(id => {
                    const matchedEvent = activeEvents.find(e => e.id === id);
                    if (matchedEvent && matchedEvent.whatsappLink) {
                      return (
                        <a
                          key={id}
                          href={matchedEvent.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366]/10 border border-[#25D366]/20 p-4 rounded-2xl flex items-center justify-between hover:bg-[#25D366]/20 transition-all group"
                        >
                          <div className="text-left">
                            <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">{matchedEvent.category}</p>
                            <p className="text-white font-bold text-xs uppercase tracking-widest">{matchedEvent.title}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#25D366]/20 group-hover:scale-105 transition-transform">
                            Join Group
                          </div>
                        </a>
                      );
                    }
                    return null;
                  })}
                </div>
                <p className="text-[10px] text-gray-400 mt-4 italic">
                  Important: Only join groups for events you have registered in.
                </p>
              </div>

              {/* Entry Pass Card (To be downloaded) */}
              <div className="relative max-w-sm mx-auto group mb-12">
                <div className="absolute inset-0 bg-gold/20 blur-[80px] rounded opacity-40" />
                <div ref={passRef} className="relative bg-black border-2 border-gold/40 rounded-[3.5rem] p-10 shadow-md overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div className="text-left">
                        <p className="text-[10px] text-gold font-black uppercase tracking-[0.4em] mb-1">ADAGE PASS</p>
                        <h4 className="text-xl font-cinzel font-black text-white glow-text-gold tracking-widest">ADAGE'26</h4>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                        <Award size={20} />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg mb-10 border-4 border-gold/20 shadow-xl">
                      <img src={passQrCodeUrl} alt="Pass QR" className="w-48 h-48 mx-auto" crossOrigin="anonymous" />
                    </div>

                    <div className="text-left space-y-4">
                      <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Participant</p>
                        <p className="text-white font-bold uppercase text-xs">{createdRecord.name}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Pass ID</p>
                          <p className="text-gold font-mono font-bold text-xs">{createdRecord.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Fee</p>
                          <p className="text-white font-bold text-xs">₹{createdRecord.totalFee}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gold text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#B07A20] transition-all glow-gold flex items-center justify-center gap-3"
                >
                  Check Dashboard <ArrowRight size={20} />
                </button>
                <button
                  onClick={handleDownloadPass}
                  disabled={isDownloading}
                  className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Download size={20} />
                  )}
                  Download Pass
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
