import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Events from './components/Events';
import Contact from './components/Contact';
import Verify from './components/Verify';
import Register from './components/Register';
import Login from './components/Login';
import AdminHub from './components/AdminHub';
import Dashboard from './components/Dashboard';

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [registrations, setRegistrations] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      setRegistrations(data || []);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    const adminSession = localStorage.getItem('adage_admin_logged');
    if (adminSession === 'true') setIsAuthenticated(true);

    const channel = supabase
      .channel('adage-admin-registrations-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, (payload) => {
        if (payload.eventType === 'INSERT') setRegistrations(p => [payload.new, ...p]);
        else if (payload.eventType === 'UPDATE') setRegistrations(p => p.map(i => i.id === payload.new.id ? payload.new : i));
        else if (payload.eventType === 'DELETE') setRegistrations(p => p.filter(i => i.id !== payload.old.id));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('registrations').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setRegistrations(p => p.map(i => i.id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleAdminLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('adage_admin_logged', 'true');
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adage_admin_logged');
  };

  return (
    <Router>
      {/* Engineering graph-paper background */}
      <div className="site-bg" />

      <div className="flex flex-col min-h-screen text-[#EDEBE6]">
        <Navbar />
        <main className="flex-grow pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/register" element={<Register onSubmit={async (p) => setRegistrations(prev => [p, ...prev])} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login onLogin={handleAdminLogin} />} />
            <Route path="/admin" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminHub
                  registrations={registrations}
                  onUpdateStatus={handleUpdateStatus}
                  onRefresh={fetchRegistrations}
                  fetchError={fetchError}
                  isLoading={isLoading}
                  onLogout={handleAdminLogout}
                />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
