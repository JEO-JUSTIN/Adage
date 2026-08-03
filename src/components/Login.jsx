import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader } from 'lucide-react';

export default function Login({ onLogin }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (key === 'admin123') {
        onLogin();
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid access key.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo / Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 border border-[#C8922A] mb-5">
            <Lock size={16} className="text-[#C8922A]" />
          </div>
          <h1 className="font-cinzel font-black text-2xl text-[#EDEBE6] uppercase tracking-widest mb-1">
            Admin Access
          </h1>
          <p className="section-label">ADAGE'26 Control Centre</p>
        </div>

        {/* Form card */}
        <div className="border border-white/[0.06] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="section-label block mb-2">Access Key</label>
              <input
                type="password"
                required
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="••••••••"
                className="civil-input text-center tracking-[0.5em] text-lg"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-[11px] font-medium">
                <AlertCircle size={13} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-40">
              {loading ? <Loader className="animate-spin" size={16} /> : <><Lock size={13} /> Authorize Access</>}
            </button>
          </form>
        </div>

        <p className="text-center section-label mt-6">Department of Civil Engineering · GCE Erode</p>
      </div>
    </div>
  );
}
