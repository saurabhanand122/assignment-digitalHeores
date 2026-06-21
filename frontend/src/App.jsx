import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ResumeEditor from './components/ResumeEditor';
import ShareView from './components/ShareView';
import Footer from './components/Footer';
import { Sparkles, Palette } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard', 'editor', 'share'
  const [editingId, setEditingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);
  
  // Global Website Theme state
  const [siteTheme, setSiteTheme] = useState(() => localStorage.getItem('site-theme') || 'cream');

  useEffect(() => {
    document.body.setAttribute('data-site-theme', siteTheme);
    localStorage.setItem('site-theme', siteTheme);
  }, [siteTheme]);

  // Dynamic API Base URL resolver
  const API_BASE = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

  useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/share/')) {
        const id = hash.replace('#/share/', '');
        setSharingId(id);
        setCurrentScreen('share');
      } else if (hash.startsWith('#/editor/')) {
        const id = hash.replace('#/editor/', '');
        setEditingId(id);
        setCurrentScreen('editor');
      } else if (hash === '#/editor') {
        setEditingId(null);
        setCurrentScreen('editor');
      } else {
        setCurrentScreen('dashboard');
      }
    };

    // Run on mount
    handleRouting();

    window.addEventListener('hashchange', handleRouting);
    return () => window.removeEventListener('hashchange', handleRouting);
  }, []);

  const navigateTo = (screen, id = null) => {
    if (screen === 'dashboard') {
      window.location.hash = '';
    } else if (screen === 'editor') {
      window.location.hash = id ? `#/editor/${id}` : '#/editor';
    } else if (screen === 'share') {
      window.location.hash = `#/share/${id}`;
    }
  };

  const handleCopyShareLink = (id) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/share/${id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Public share link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Error copying share link:', err);
        alert(`Share Link: ${shareUrl}`);
      });
  };

  return (
    <div className="app-container" data-site-theme={siteTheme}>
      {/* Global Decorative SVG Clip Path for organic blobs */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="blob-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.05 C0.7,0.05,0.9,0.15,0.95,0.35 C1.0,0.55,0.9,0.75,0.7,0.85 C0.5,0.95,0.3,0.9,0.15,0.75 C0.0,0.6,0.05,0.4,0.1,0.2 C0.15,0.05,0.3,0.05,0.5,0.05 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Global Sticky Navigation Bar (no-print) */}
      <nav className="no-print glass-panel" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.85rem 2rem',
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
        position: 'sticky',
        top: 0,
        transition: 'all var(--transition-normal)'
      }}>
        {/* Logo / Home link */}
        <div 
          onClick={() => navigateTo('dashboard')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-serif)'
          }}
        >
          <Sparkles size={20} style={{ color: 'var(--color-secondary)' }} />
          <span>Digital Heroes Resumes</span>
        </div>

        {/* Theme Selector Widget */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          background: 'rgba(255, 255, 255, 0.65)', 
          padding: '0.35rem 0.75rem', 
          borderRadius: 'var(--radius-full)', 
          border: '1px solid var(--color-border)' 
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Palette size={13} style={{ color: 'var(--color-secondary)' }} /> Switch Theme:
          </span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button 
              onClick={() => setSiteTheme('cream')}
              title="Warm Cream Theme"
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#f4f1de',
                border: siteTheme === 'cream' ? '2.5px solid var(--color-primary)' : '1px solid #94a3b8',
                cursor: 'pointer',
                padding: 0
              }}
            />
            <button 
              onClick={() => setSiteTheme('indigo')}
              title="Royal Indigo Theme"
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#c7d2fe',
                border: siteTheme === 'indigo' ? '2.5px solid var(--color-primary)' : '1px solid #94a3b8',
                cursor: 'pointer',
                padding: 0
              }}
            />
            <button 
              onClick={() => setSiteTheme('dark')}
              title="Sleek Dark Theme"
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#0f172a',
                border: siteTheme === 'dark' ? '2.5px solid #a5b4fc' : '1px solid #94a3b8',
                cursor: 'pointer',
                padding: 0
              }}
            />
          </div>
        </div>
      </nav>

      {/* Main Screen Router */}
      <div style={{ flex: 1 }}>
        {currentScreen === 'dashboard' && (
          <Dashboard 
            onCreateNew={() => navigateTo('editor')} 
            onEdit={(id) => navigateTo('editor', id)}
            onShare={handleCopyShareLink}
            API_BASE={API_BASE}
          />
        )}

        {currentScreen === 'editor' && (
          <ResumeEditor 
            id={editingId} 
            onBack={() => navigateTo('dashboard')}
            API_BASE={API_BASE}
          />
        )}

        {currentScreen === 'share' && (
          <ShareView 
            id={sharingId} 
            onBackToDashboard={() => navigateTo('dashboard')}
            API_BASE={API_BASE}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
