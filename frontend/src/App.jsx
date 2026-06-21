import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ResumeEditor from './components/ResumeEditor';
import ShareView from './components/ShareView';
// No unused icon imports here

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard', 'editor', 'share'
  const [editingId, setEditingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);

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
    <div className="app-container">
      {/* Global Decorative SVG Clip Path for organic blobs (references L95 of index.css) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="blob-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.05 C0.7,0.05,0.9,0.15,0.95,0.35 C1.0,0.55,0.9,0.75,0.7,0.85 C0.5,0.95,0.3,0.9,0.15,0.75 C0.0,0.6,0.05,0.4,0.1,0.2 C0.15,0.05,0.3,0.05,0.5,0.05 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Main Screen Router */}
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
  );
}
