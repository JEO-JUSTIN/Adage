import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../supabase';
import { ut, Sr } from '../events';
import {
  Users, CheckCircle, Clock, AlertTriangle, Search, LogOut,
  QrCode, ClipboardList, Settings, Download, Plus, X, Phone,
  Mail, Calendar, ArrowRight, ShieldCheck, Loader, RefreshCw, Edit, Save, Trash2
} from 'lucide-react';

// Manual Entry Modal
function ManualEntryModal({ onClose, onSave }) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    college: "",
    department: "",
    email: "",
    phone: "",
    selectedEvents: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const generatedId = `MAN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const payload = {
        id: generatedId,
        name: form.name,
        college: form.college,
        department: form.department,
        email: form.email.toLowerCase(),
        phone: form.phone,
        teamMembers: [],
        events: form.selectedEvents,
        totalFee: 0,
        transactionId: "ON-SPOT",
        status: ut.CONFIRMED,
        timestamp: new Date().toISOString()
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      alert("Error adding participant");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEvent = (title) => {
    setForm(prev => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(title)
        ? prev.selectedEvents.filter(e => e !== title)
        : [...prev.selectedEvents, title]
    }));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#111111] w-full max-w-xl rounded-lg border border-gold/20 p-10 relative overflow-hidden shadow-md">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h3 className="text-2xl font-cinzel font-black uppercase tracking-widest text-gold mb-8">
          Manual Entry
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#C8922A]"
            />
            <input
              type="text"
              placeholder="College"
              required
              value={form.college}
              onChange={e => setForm({ ...form, college: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#C8922A]"
            />
            <input
              type="text"
              placeholder="Dept"
              required
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#C8922A]"
            />
            <input
              type="tel"
              placeholder="Phone"
              required
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#C8922A]"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#C8922A]"
            />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Select Events
            </p>
            <div className="flex flex-wrap gap-2">
              {Sr.map(event => (
                <button
                  type="button"
                  key={event.id}
                  onClick={() => toggleEvent(event.title)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    form.selectedEvents.includes(event.title)
                      ? "bg-gold border-gold text-black"
                      : "border-white/10 text-gray-400 hover:border-gold/50"
                  }`}
                >
                  {event.title}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-gold text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#B07A20] glow-gold flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader className="animate-spin" /> : <Plus size={20} />}
            Register Participant
          </button>
        </form>
      </div>
    </div>
  );
}

// Edit / Add Event Modal
function EditEventModal({ event, isNew = false, onClose, onSave }) {
  const [form, setForm] = useState({
    id: event?.id || "",
    title: event?.title || "",
    description: event?.description || "",
    slogan: event?.slogan || "",
    category: event?.category || "Technical",
    maxMembers: event?.maxMembers || 1,
    fee: event?.fee || 0,
    timing: event?.timing || "",
    image: event?.image || "",
    whatsappLink: event?.whatsappLink || event?.whatsapp_link || "",
    rules: Array.isArray(event?.rules) ? [...event.rules] : [],
    coordinators: Array.isArray(event?.coordinators) ? [...event.coordinators] : []
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNew && !form.id) {
      alert("Please specify a unique URL/ID for the event.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(form, isNew);
      onClose();
    } catch (err) {
      alert("Error saving event: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRule = () => {
    setForm(prev => ({ ...prev, rules: [...prev.rules, ""] }));
  };

  const handleRuleChange = (index, value) => {
    setForm(prev => {
      const rules = [...prev.rules];
      rules[index] = value;
      return { ...prev, rules };
    });
  };

  const handleRemoveRule = (index) => {
    setForm(prev => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }));
  };

  const handleAddCoordinator = () => {
    setForm(prev => ({ ...prev, coordinators: [...prev.coordinators, { name: "", phone: "" }] }));
  };

  const handleCoordinatorChange = (index, field, value) => {
    setForm(prev => {
      const coordinators = [...prev.coordinators];
      coordinators[index] = { ...coordinators[index], [field]: value };
      return { ...prev, coordinators };
    });
  };

  const handleRemoveCoordinator = (index) => {
    setForm(prev => ({ ...prev, coordinators: prev.coordinators.filter((_, i) => i !== index) }));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#111] w-full max-w-2xl rounded-lg border border-gold/20 p-8 md:p-10 relative overflow-hidden shadow-md max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h3 className="text-xl font-cinzel font-black uppercase tracking-widest text-gold mb-6 border-b border-white/5 pb-2">
          {isNew ? "Create New Event" : `Edit Event: ${form.title}`}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* ID (URL Slug) & Title - Edit only on Creation */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Event ID / Code (Unique Slug)</label>
              <input
                type="text"
                required
                disabled={!isNew}
                value={form.id}
                onChange={e => setForm({ ...form, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                placeholder="e.g. brick-builder"
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A] disabled:opacity-40"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Event Title</label>
              <input
                type="text"
                required
                disabled={!isNew}
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. BRICK BUILDER"
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A] disabled:opacity-40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#111] border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A]"
              >
                <option value="Technical">Technical</option>
                <option value="Non-Technical">Non-Technical</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Max Team Members</label>
              <input
                type="number"
                min={1}
                max={6}
                value={form.maxMembers}
                onChange={e => setForm({ ...form, maxMembers: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Event Slogan</label>
              <input
                type="text"
                value={form.slogan}
                onChange={e => setForm({ ...form, slogan: e.target.value })}
                placeholder="Strength in shapes..."
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Event Timing</label>
              <input
                type="text"
                value={form.timing}
                onChange={e => setForm({ ...form, timing: e.target.value })}
                placeholder="10:00 AM"
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registration Fee (₹)</label>
              <input
                type="number"
                value={form.fee}
                onChange={e => setForm({ ...form, fee: Number(e.target.value) })}
                placeholder="250"
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">WhatsApp Group Link</label>
              <input
                type="url"
                value={form.whatsappLink}
                onChange={e => setForm({ ...form, whatsappLink: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A]"
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Image Banner URL</label>
              <input
                type="text"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A]"
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-[#C8922A] resize-none"
              />
            </div>
          </div>

          {/* Rules Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Rules & Guidelines</h4>
              <button type="button" onClick={handleAddRule} className="text-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Plus size={12} /> Add Rule
              </button>
            </div>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
              {form.rules.map((rule, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-[10px] text-gray-400">{idx+1}.</span>
                  <input
                    type="text"
                    value={rule}
                    onChange={e => handleRuleChange(idx, e.target.value)}
                    className="flex-grow bg-white/5 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C8922A]"
                  />
                  <button type="button" onClick={() => handleRemoveRule(idx)} className="text-red-500 hover:text-red-400 p-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Coordinators Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Event Coordinators</h4>
              <button type="button" onClick={handleAddCoordinator} className="text-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Plus size={12} /> Add Coordinator
              </button>
            </div>
            <div className="space-y-2">
              {form.coordinators.map((c, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Name"
                    value={c.name}
                    onChange={e => handleCoordinatorChange(idx, "name", e.target.value)}
                    className="col-span-2 bg-white/5 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C8922A]"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={c.phone}
                    onChange={e => handleCoordinatorChange(idx, "phone", e.target.value)}
                    className="col-span-2 bg-white/5 border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C8922A]"
                  />
                  <button type="button" onClick={() => handleRemoveCoordinator(idx)} className="text-red-500 hover:text-red-400 p-1 justify-self-center">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-gold text-black py-4 rounded font-black uppercase tracking-widest hover:bg-[#B07A20] glow-gold flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader className="animate-spin" /> : <Save size={16} />}
            {isNew ? "Create Event" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Camera Scanner Component
function QRScanner({ onScan, onError, onClose, lastScannedParticipant }) {
  const scannerRef = useRef(null);
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;
        
        const config = {
          fps: 60,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1,
          disableFlip: false
        };

        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (!isScanned) {
              try {
                const parsed = JSON.parse(decodedText);
                if (parsed.type === "ADAGE_ENTRY" && parsed.id) {
                  onScan(parsed.id);
                  setIsScanned(true);
                  if (navigator.vibrate) {
                    navigator.vibrate(100);
                  }
                  // Reset scanner state after delay
                  setTimeout(() => setIsScanned(false), 3000);
                }
              } catch (err) {
                console.warn("Invalid QR Format", err);
              }
            }
          },
          (errorMessage) => {
            // Quietly catch logs
          }
        );
      } catch (err) {
        onError(err.message || "Camera access failed.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => {
          console.warn("Error stopping scanner:", err);
        }).finally(() => {
          const container = document.getElementById("reader");
          if (container) {
            container.innerHTML = "";
          }
        });
      }
    };
  }, [onScan, onError, isScanned]);

  return (
    <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden shadow-md border-4 transition-colors duration-300 border-white/10">
      <div id="reader" className="w-full h-full object-cover" />
      
      {!isScanned && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-64 h-64 border-2 border-white/10 rounded-[2rem]">
            <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-gold rounded-tl-2xl" />
            <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-gold rounded-tr-2xl" />
            <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-gold rounded-bl-2xl" />
            <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-gold rounded-br-2xl" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gold/30 animate-pulse" />
          </div>
        </div>
      )}

      {isScanned && (
        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
          <div className="bg-green-500 text-white p-4 rounded mb-6 animate-bounce">
            <CheckCircle size={48} strokeWidth={4} />
          </div>
          <div className="text-center space-y-3 bg-black/80 p-8 rounded-[2rem] border-2 border-gold/30 shadow-md max-w-xs w-full">
            <h4 className="text-white text-3xl font-cinzel font-black uppercase tracking-wider line-clamp-2">
              {lastScannedParticipant?.name || "VERIFIED"}
            </h4>
          </div>
        </div>
      )}

      <button onClick={onClose} className="absolute top-6 right-6 z-40 bg-black/50 hover:bg-red-500 text-white p-3 rounded backdrop-blur-md transition-all border border-white/10">
        <X size={20} />
      </button>
    </div>
  );
}

// MAIN ADMIN HUB
export default function AdminHub({ registrations, onUpdateStatus, onRefresh, fetchError, isLoading, onLogout }) {
  const [tab, setTab] = useState("registrations");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedId, setSelectedId] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // Dynamic DB events state for Editing
  const [dbEvents, setDbEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchDbEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const { data, error } = await supabase.from('events').select('*').order('title');
      if (error) throw error;
      setDbEvents(data || []);
    } catch (err) {
      console.error("Failed to load events in AdminHub:", err);
      setDbEvents(Sr);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchDbEvents();
  }, []);

  const selectedParticipant = useMemo(() => {
    return registrations.find(r => r.id === selectedId) || null;
  }, [selectedId, registrations]);

  const lastScannedParticipant = useMemo(() => {
    if (recentScans.length === 0) return null;
    const lastId = recentScans[0].id;
    return registrations.find(r => r.id === lastId) || null;
  }, [recentScans, registrations]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = registrations.length;
    const confirmed = registrations.filter(r => r.status === ut.CONFIRMED || r.status === ut.PRESENT).length;
    const pending = registrations.filter(r => r.status === ut.PENDING).length;
    const checkedIn = registrations.filter(r => r.status === ut.PRESENT).length;
    return { total, confirmed, pending, checkedIn };
  }, [registrations]);

  const handleQrScan = async (scannedId) => {
    const matched = registrations.find(r => r.id.toUpperCase() === scannedId.trim().toUpperCase());
    if (matched) {
      if (matched.status !== ut.PRESENT) {
        await onUpdateStatus(matched.id, ut.PRESENT);
      }
      setRecentScans(prev => {
        const filtered = prev.filter(r => r.id !== matched.id);
        return [{ id: matched.id, name: matched.name }, ...filtered].slice(0, 5);
      });
      setSelectedId(matched.id);
    }
  };

  const filteredRegistrations = registrations.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
    const matchesFilter = filterStatus === "ALL" || item.status === filterStatus;
    return matchesQuery && matchesFilter;
  });

  const handleManualSave = async (payload) => {
    const { error } = await supabase.from('registrations').insert([payload]);
    if (error) throw error;
    if (onRefresh) onRefresh();
  };

  const handleSaveEvent = async (updatedEvent, isNew = false) => {
    try {
      if (isNew) {
        const { error } = await supabase
          .from('events')
          .insert([{
            id: updatedEvent.id,
            title: updatedEvent.title,
            description: updatedEvent.description,
            slogan: updatedEvent.slogan,
            category: updatedEvent.category,
            maxMembers: updatedEvent.maxMembers,
            fee: updatedEvent.fee,
            timing: updatedEvent.timing,
            image: updatedEvent.image,
            whatsappLink: updatedEvent.whatsappLink,
            rules: updatedEvent.rules,
            coordinators: updatedEvent.coordinators
          }]);
        if (error) throw error;
        alert("Event created successfully!");
      } else {
        const { error } = await supabase
          .from('events')
          .update({
            description: updatedEvent.description,
            slogan: updatedEvent.slogan,
            fee: updatedEvent.fee,
            timing: updatedEvent.timing,
            image: updatedEvent.image,
            whatsappLink: updatedEvent.whatsappLink,
            rules: updatedEvent.rules,
            coordinators: updatedEvent.coordinators
          })
          .eq('id', updatedEvent.id);
        if (error) throw error;
        alert("Event updated successfully!");
      }
      fetchDbEvents();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Error saving event: " + err.message);
      throw err;
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete event "${title}"?`)) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      alert("Event deleted successfully!");
      fetchDbEvents();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Error deleting event: " + err.message);
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = ["ID", "Name", "College", "Department", "Email", "Phone", "Events", "Total Fee", "Transaction ID", "Status", "Timestamp"].join(",");
      const rows = registrations.map(r => [
        r.id,
        `"${r.name}"`,
        `"${r.college}"`,
        `"${r.department}"`,
        r.email,
        r.phone,
        `"${r.events.join(", ")}"`,
        r.totalFee,
        r.transactionId || "N/A",
        r.status,
        r.timestamp
      ].join(","));

      const csvContent = [headers, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `adage_registrations_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="py-24 bg-[#0C0C0C] min-h-screen text-white font-inter">
      {isManualModalOpen && (
        <ManualEntryModal onClose={() => setIsManualModalOpen(false)} onSave={handleManualSave} />
      )}

      {editingEvent && (
        <EditEventModal event={editingEvent} onClose={() => setEditingEvent(null)} onSave={handleSaveEvent} />
      )}

      {isCreateModalOpen && (
        <EditEventModal isNew={true} onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveEvent} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-in fade-in slide-in-from-top-4">
          {[
            { label: "Registrations", val: stats.total, icon: <Users size={20} />, color: "text-white" },
            { label: "Confirmed", val: stats.confirmed, icon: <CheckCircle size={20} />, color: "text-green-500" },
            { label: "Pending", val: stats.pending, icon: <Clock size={20} />, color: "text-gold" },
            { label: "Checked In", val: stats.checkedIn, icon: <CheckCircle size={20} />, color: "text-blue-400" }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#111111] p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
              <div className={`${item.color} bg-white/5 p-3 rounded-2xl mb-3`}>
                {item.icon}
              </div>
              <p className="text-3xl font-cinzel font-black tracking-widest">{item.val}</p>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Action Controls & Navigation tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gold/10 rounded-2xl text-gold border border-gold/20 shadow-lg">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-cinzel font-black tracking-widest uppercase">Admin Hub</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest font-mono">
                  {isLoading ? "Syncing..." : "Live Connected"}
                </p>
                <div className={`w-1.5 h-1.5 rounded ${isLoading ? "bg-amber-500 animate-pulse" : "bg-green-500"}`} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            <button onClick={() => setIsManualModalOpen(true)} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/10 text-gold hover:bg-gold hover:text-black transition-all flex items-center gap-2">
              <Plus size={16} /> New Entry
            </button>
            <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />
            
            {["registrations", "events", "scanner", "settings"].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setIsScannerActive(false); }}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  tab === t ? "bg-gold text-black shadow-lg shadow-gold/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {t === "registrations" ? <ClipboardList size={16} /> : t === "events" ? <Edit size={16} /> : t === "scanner" ? <QrCode size={16} /> : <Settings size={16} />}
                <span className="ml-1 hidden sm:inline">{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="bg-[#111111] rounded-lg border border-white/10 shadow-lg overflow-hidden min-h-[600px]">
          
          {/* TAB 1: REGISTRATIONS LIST */}
          {tab === "registrations" && (
            <div className="p-8 md:p-12 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
                <div className="relative flex-grow w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm focus:border-gold/50 text-white focus:outline-none"
                  />
                </div>
                
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto py-1">
                  {["ALL", ut.PENDING, ut.CONFIRMED, ut.PRESENT].map(statusVal => (
                    <button
                      key={statusVal}
                      onClick={() => setFilterStatus(statusVal)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                        filterStatus === statusVal ? "bg-gold/20 border-gold text-gold" : "border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {statusVal === ut.PENDING ? "PENDING" : statusVal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                      <th className="px-10 py-8">Participant Info</th>
                      <th className="px-10 py-8">Status</th>
                      <th className="px-10 py-8 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRegistrations.map(participant => (
                      <tr key={participant.id} className="hover:bg-white/5 transition-all group">
                        <td className="px-10 py-8">
                          <p className="text-xl font-cinzel font-bold text-white group-hover:text-gold transition-colors">{participant.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">{participant.id}</p>
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <p className="text-[9px] text-gray-400 font-bold uppercase truncate max-w-[150px]">{participant.college}</p>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase border transition-all flex items-center gap-2 w-fit ${
                            participant.status === ut.PRESENT
                              ? "text-blue-400 border-blue-400/30 bg-blue-400/5"
                              : participant.status === ut.CONFIRMED
                              ? "text-green-500 border-green-500/30 bg-green-500/5"
                              : "text-gold border-gold/30 bg-gold/5 animate-pulse"
                          }`}>
                            {participant.status === ut.PRESENT ? "Checked In" : participant.status === ut.CONFIRMED ? "Confirmed" : "Pending"}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-2">
                            {participant.status === ut.PENDING && (
                              <button
                                onClick={() => onUpdateStatus(participant.id, ut.CONFIRMED)}
                                className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-[9px] font-black uppercase hover:bg-green-500 hover:text-white transition-all"
                              >
                                Confirm Payment
                              </button>
                            )}
                            {participant.status === ut.CONFIRMED && (
                              <button
                                onClick={() => onUpdateStatus(participant.id, ut.PRESENT)}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[9px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all"
                              >
                                Check-In
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedId(participant.id)}
                              className="p-2 bg-white/5 text-gray-400 hover:text-gold rounded-xl transition-all border border-white/10"
                            >
                              <Search size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRegistrations.length === 0 && (
                <div className="text-center py-20">
                  <ClipboardList className="text-white/5 mx-auto mb-4" size={64} />
                  <p className="text-gray-400 uppercase font-black text-xs tracking-widest">No matching records found.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EVENTS LIST MANAGEMENT */}
          {tab === "events" && (
            <div className="p-8 md:p-12 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h3 className="text-2xl font-cinzel font-black text-gold uppercase tracking-wider">
                  Event Content Manager
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 bg-gold text-black rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#B07A20] transition-all shadow-md"
                >
                  <Plus size={14} /> Add Event
                </button>
              </div>

              {isLoadingEvents ? (
                <div className="text-center py-20">
                  <Loader className="animate-spin text-gold mx-auto mb-4" size={32} />
                  <p className="text-gray-400 text-xs tracking-wider">Syncing database events list...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dbEvents.map(event => (
                    <div key={event.id} className="border border-white/10 p-6 flex flex-col justify-between bg-black/20 hover:border-gold/30 transition-all rounded-lg relative group">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] font-bold text-gold uppercase tracking-widest">{event.category}</span>
                          <span className="text-[10px] text-gray-400 font-bold">₹{event.fee} / head</span>
                        </div>
                        <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider mb-2">{event.title}</h4>
                        {event.slogan && <p className="text-xs text-gold/60 italic mb-4">"{event.slogan}"</p>}
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-6">{event.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="bg-white/5 border border-white/10 hover:border-gold/30 hover:text-gold text-white text-[10px] py-3 rounded uppercase font-black tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 text-[10px] py-3 rounded uppercase font-black tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QR CODE SCANNER */}
          {tab === "scanner" && (
            <div className="p-8 md:p-16 flex flex-col items-center animate-in slide-in-from-bottom-10 h-full">
              <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3 space-y-8">
                  {isScannerActive ? (
                    <QRScanner
                      onScan={handleQrScan}
                      onError={setCameraError}
                      onClose={() => setIsScannerActive(false)}
                      lastScannedParticipant={lastScannedParticipant}
                    />
                  ) : (
                    <div className="aspect-square bg-black/40 border border-white/5 p-16 rounded-xl flex flex-col items-center justify-center space-y-12">
                      <QrCode size={64} className="text-gold" />
                      <button
                        onClick={() => { setIsScannerActive(true); setCameraError(null); }}
                        className="w-full bg-gold text-black py-7 rounded-lg font-cinzel text-3xl font-black uppercase tracking-widest hover:bg-[#B07A20] glow-gold transition-all"
                      >
                        Start Scanner
                      </button>
                    </div>
                  )}

                  {cameraError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3">
                      <AlertTriangle />
                      <span>{cameraError}</span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-black/20 rounded-lg border border-white/5 p-10 h-full">
                    <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
                      Real-time Check-ins
                    </h4>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {recentScans.map((scan, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-5 bg-green-500/5 rounded-3xl border border-green-500/10 animate-in slide-in-from-right-4 cursor-pointer"
                          onClick={() => setSelectedId(scan.id)}
                        >
                          <CheckCircle size={20} className="text-green-500" />
                          <div className="min-w-0">
                            <h5 className="text-xs font-black text-white truncate">{scan.name}</h5>
                            <p className="text-[9px] text-gray-400 font-mono">{scan.id}</p>
                          </div>
                        </div>
                      ))}
                      {recentScans.length === 0 && (
                        <p className="text-center text-gray-400 text-[10px] py-10">
                          Scan a QR code to begin attendance check-in.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN SETTINGS */}
          {tab === "settings" && (
            <div className="p-12 md:p-20 space-y-12 animate-in fade-in duration-500">
              <div>
                <h3 className="text-4xl font-cinzel font-black tracking-widest uppercase mb-4 text-gold">
                  Administrative Options
                </h3>
                <p className="text-gray-400 max-w-xl">
                  Configure system behavior and export symposium data for offline processing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Export Card */}
                <div className="bg-black/40 p-10 rounded-lg border border-white/5 hover:border-gold/20 transition-all flex flex-col justify-between">
                  <div>
                    <Download className="text-gold mb-6" size={40} />
                    <h4 className="text-2xl font-cinzel font-bold text-white mb-2">Export Registrations</h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                      Download all participant records in CSV format for institutional documentation and team allocation.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting || registrations.length === 0}
                    className="w-full bg-gold text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#B07A20] transition-all shadow-lg glow-gold disabled:opacity-30"
                  >
                    {isExporting ? <Loader className="animate-spin" size={18} /> : <Download size={18} />}
                    {isExporting ? "Exporting..." : "Download Full Dataset (CSV)"}
                  </button>
                </div>

                {/* Logout Card */}
                <div className="bg-black/40 p-10 rounded-lg border border-white/5 hover:border-red-500/20 transition-all flex flex-col justify-between">
                  <div>
                    <LogOut className="text-red-500 mb-6" size={40} />
                    <h4 className="text-2xl font-cinzel font-bold text-white mb-2">Security Logout</h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                      Terminate the current administrative session. You will need the access key to log back into the hub.
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full border border-red-500/20 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <LogOut size={18} /> Terminate Admin Session
                  </button>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-gold/40" size={24} />
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">System Engine</p>
                    <p className="text-white font-bold text-xs">ADAGE-Cloud v2.0</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  Department of Civil Engineering • GCE Erode
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DETAILED PARTICIPANT DRAWER MODAL */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-200">
          <div className="bg-[#0C0C0C] w-full max-w-2xl rounded-xl border border-gold/30 p-12 md:p-16 relative overflow-hidden shadow-md max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setSelectedId(null)} className="absolute top-10 right-10 text-gray-400 hover:text-white p-2 z-20">
              <X size={32} />
            </button>

            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-8">
                <div className="p-6 bg-gold/10 text-gold rounded-3xl border border-gold/10">
                  <Users size={48} />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-cinzel font-black uppercase tracking-widest leading-tight">
                    {selectedParticipant.name}
                  </h3>
                  <p className="text-gold text-sm font-mono tracking-widest">{selectedParticipant.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-8">
                  <div>
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-3">Academic Identity</label>
                    <div className="space-y-1">
                      <p className="text-white font-bold text-lg leading-tight">{selectedParticipant.college}</p>
                      <p className="text-gold font-black uppercase text-[10px] tracking-widest">{selectedParticipant.department}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-3">Secure Communication</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-white/80 text-sm">
                        <Mail size={14} className="text-gold/50" />
                        <span className="font-medium">{selectedParticipant.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80 text-sm">
                        <Phone size={14} className="text-gold/50" />
                        <span className="font-medium">{selectedParticipant.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-3">Digital Fingerprint</label>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span>Transaction</span>
                        <span className="text-gold font-mono tracking-widest">{selectedParticipant.transactionId}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span>Registered</span>
                        <div className="flex items-center gap-2">
                          <Calendar size={10} />
                          <span>{new Date(selectedParticipant.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className={`p-8 rounded-lg border flex flex-col justify-center text-center shadow-inner ${
                    selectedParticipant.status === ut.PRESENT ? "bg-blue-500/10 border-blue-500/40" : "bg-green-500/10 border-green-500/40"
                  }`}>
                    <label className="text-[9px] font-black uppercase tracking-widest block mb-4 text-gray-400">Venue Status</label>
                    <p className={`text-2xl md:text-3xl font-cinzel font-bold uppercase tracking-widest ${
                      selectedParticipant.status === ut.PRESENT ? "text-blue-400" : "text-green-500"
                    }`}>
                      {selectedParticipant.status}
                    </p>
                  </div>

                  {selectedParticipant.teamMembers.length > 0 && (
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-4">Confirmed Team</label>
                      <div className="flex flex-col gap-3">
                        {selectedParticipant.teamMembers.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded bg-gold/40" />
                            <span className="text-xs text-white/90 font-bold uppercase tracking-wide">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-3">Event Roster</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.events.map((eTitle, idx) => (
                        <span key={idx} className="bg-gold/5 text-gold text-[10px] font-bold uppercase px-3 py-1 rounded-lg border border-gold/10">
                          {eTitle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
