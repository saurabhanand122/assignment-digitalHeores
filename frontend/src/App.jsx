import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ResumeEditor from './components/ResumeEditor';
import ShareView from './components/ShareView';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import { Sparkles, Palette, ArrowRight, CheckCircle } from 'lucide-react';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard', 'editor', 'share'
  const [editingId, setEditingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);
  
  // Global Website Theme state
  const [siteTheme, setSiteTheme] = useState(() => localStorage.getItem('site-theme') || 'cream');

  // Clerk Auth state
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    document.body.setAttribute('data-site-theme', siteTheme);
    localStorage.setItem('site-theme', siteTheme);
  }, [siteTheme]);

  // Dynamic API Base URL resolver
  const API_BASE = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api' 
      : 'https://resume-builder-backend-kohl.vercel.app/api');

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

  // Render Clerk initialization loader
  if (!isLoaded) {
    return (
      <div className="app-container" data-site-theme={siteTheme} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--color-bg)' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid rgba(27, 67, 96, 0.1)', 
          borderTopColor: 'var(--color-primary)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>Initializing Security Module...</p>
      </div>
    );
  }

  const getClerkAppearance = () => {
    // Choose colors based on the theme
    let primaryColor, bgColor, textColor, borderColor, inputBg, hoverBg;
    if (siteTheme === 'dark') {
      primaryColor = '#6fa37a';
      bgColor = '#0d0d21';
      textColor = '#f1f5f9';
      borderColor = 'rgba(111, 163, 122, 0.25)';
      inputBg = '#14142b';
      hoverBg = 'rgba(241, 245, 249, 0.08)';
    } else if (siteTheme === 'indigo') {
      primaryColor = '#24453a';
      bgColor = '#e6f0e9';
      textColor = '#0f1713';
      borderColor = 'rgba(36, 69, 58, 0.25)';
      inputBg = '#ffffff';
      hoverBg = 'rgba(15, 23, 19, 0.08)';
    } else { // cream
      primaryColor = '#3f6b54';
      bgColor = '#fcfbf7';
      textColor = '#0a0a1a';
      borderColor = 'rgba(63, 107, 84, 0.22)';
      inputBg = '#ffffff';
      hoverBg = 'rgba(10, 10, 26, 0.08)';
    }

    return {
      variables: {
        colorPrimary: primaryColor,
        colorBackground: bgColor,
        colorText: textColor,
        colorInputBackground: inputBg,
        colorInputText: textColor,
        colorInputBorder: borderColor,
        borderRadius: '8px',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      elements: {
        card: {
          background: bgColor,
          border: `1px solid ${borderColor}`,
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-lg)'
        },
        userButtonPopoverCard: {
          background: bgColor,
          border: `1px solid ${borderColor}`,
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius-md)',
          color: textColor
        },
        userButtonPopoverActionButton: {
          color: textColor,
          '&:hover': {
            background: hoverBg
          }
        },
        userButtonPopoverActionButtonText: {
          color: textColor,
          fontWeight: 600
        },
        userButtonPopoverActionButtonIcon: {
          color: textColor,
          opacity: 0.8
        },
        userButtonPopoverFooter: {
          background: bgColor,
          borderTop: `1px solid ${borderColor}`
        },
        socialButtonsBlockButton: {
          border: `1px solid ${borderColor}`,
          background: inputBg,
          color: textColor,
          '&:hover': {
            background: hoverBg
          }
        },
        formButtonPrimary: {
          background: primaryColor,
          color: '#ffffff',
          '&:hover': {
            background: primaryColor === '#6fa37a' ? '#3f6b54' : '#cd8a4b'
          }
        },
        footer: {
          display: 'none'
        }
      }
    };
  };

  // Beautiful landing page for signed-out users
  const renderLoginScreen = () => {
    return (
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating background decorative elements */}
        <div className="blob" style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'rgba(27, 67, 96, 0.04)',
          filter: 'blur(70px)',
          borderRadius: '50%',
          zIndex: 1,
          animation: 'drift 20s infinite alternate ease-in-out'
        }} />
        <div className="blob" style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '350px',
          height: '350px',
          background: 'rgba(230, 240, 233, 0.35)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          zIndex: 1,
          animation: 'drift 25s infinite alternate-reverse ease-in-out'
        }} />

        {/* Brand Header */}
        <div className="glass-panel login-card" style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '800px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(12px)',
          transition: 'all var(--transition-normal)'
        }}>
          {/* Logo Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(27, 67, 96, 0.05)',
            border: '1px solid var(--color-border)',
            marginBottom: '2rem'
          }}>
            <Sparkles size={16} style={{ color: 'var(--color-secondary)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
              Gemini AI-Powered Resume Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="serif login-title" style={{
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--color-primary)',
            marginBottom: '1.25rem'
          }}>
            Resume <span className="text-mossamber">Builder</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--color-text-dark)',
            maxWidth: '620px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.5,
            fontFamily: 'var(--font-body)'
          }}>
            Build, edit, and share visually stunning, theme-aware A4 resumes. Powered by Google Gemini 2.5 Flash to generate professional resumes from scratch and extract data from PDF uploads.
          </p>

          {/* Action Call */}
          <div style={{ marginBottom: '3.5rem' }}>
            <SignInButton mode="modal" appearance={getClerkAppearance()}>
              <button className="btn btn-primary" style={{
                padding: '0.95rem 2.75rem',
                fontSize: '1.05rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                fontWeight: 700
              }}>
                Sign In to Get Started
                <ArrowRight size={18} />
              </button>
            </SignInButton>
          </div>

          {/* Visual Grid of Core Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(27, 67, 96, 0.02)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(27, 67, 96, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Palette size={16} style={{ color: 'var(--color-secondary)' }} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-header)' }}>Premium Styling</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Cream Paper, Moss Emerald, and Deep Space themes designed for visual perfection.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(27, 67, 96, 0.02)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(27, 67, 96, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Sparkles size={16} style={{ color: 'var(--color-secondary)' }} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-header)' }}>AI Resume Generator</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Draft full professional resumes including summaries, experiences, and projects from a simple job title prompt.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(27, 67, 96, 0.02)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(27, 67, 96, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Sparkles size={16} style={{ color: 'var(--color-secondary)' }} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-header)' }}>AI Resume Importer</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Upload existing PDF/TXT resume documents to automatically parse and extract key contact info and skills.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(27, 67, 96, 0.02)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(27, 67, 96, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--color-secondary)' }} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-header)' }}>Completeness Gauge</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Evaluate your content strength dynamically with recommendations and completeness score gauges.</p>
            </div>
          </div>
        </div>
      </div>
    );
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
      <nav className="no-print glass-panel app-navbar" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-card-bg)',
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
            fontFamily: 'var(--font-header)'
          }}
        >
          <Sparkles size={20} style={{ color: 'var(--color-secondary)' }} />
          <span>Resume Builder</span>
        </div>

        {/* Theme Widget & User Widget Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Selector Widget */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            background: 'var(--color-card-bg)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: 'var(--radius-full)', 
            border: '1px solid var(--color-border)' 
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-dark)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Palette size={13} style={{ color: 'var(--color-secondary)' }} />
              <span className="hide-on-mobile">Theme:</span>
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button 
                onClick={() => setSiteTheme('cream')}
                title="Warm Cream Paper Theme"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#f5f0e8',
                  border: siteTheme === 'cream' ? '2.5px solid var(--color-primary)' : '1px solid #94a3b8',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
              <button 
                onClick={() => setSiteTheme('indigo')}
                title="Moss Emerald Theme"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#e6f0e9',
                  border: siteTheme === 'indigo' ? '2.5px solid var(--color-primary)' : '1px solid #94a3b8',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
              <button 
                onClick={() => setSiteTheme('dark')}
                title="Deep Space Ink Theme"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#0a0a1a',
                  border: siteTheme === 'dark' ? '2.5px solid var(--color-primary)' : '1px solid #94a3b8',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            </div>
          </div>

          {/* Clerk Profile User Button */}
          {isSignedIn && (
            <div style={{ 
              borderLeft: '1px solid var(--color-border)', 
              paddingLeft: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              alignSelf: 'stretch' 
            }}>
              <UserButton afterSignOutUrl="/" appearance={getClerkAppearance()} />
            </div>
          )}
        </div>
      </nav>

      {/* Main Screen Router */}
      <div style={{ flex: 1 }}>
        {/* Public Sharing bypasses Authentication */}
        {currentScreen === 'share' ? (
          <ShareView 
            id={sharingId} 
            onBackToDashboard={() => navigateTo('dashboard')}
            API_BASE={API_BASE}
          />
        ) : !isSignedIn ? (
          /* Authentication Screen */
          renderLoginScreen()
        ) : (
          /* Signed In App Screens */
          <>
            {currentScreen === 'dashboard' && (
              <Dashboard 
                onCreateNew={() => navigateTo('editor')} 
                onEdit={(id) => navigateTo('editor', id)}
                onShare={handleCopyShareLink}
                API_BASE={API_BASE}
                userId={user?.id}
              />
            )}

            {currentScreen === 'editor' && (
              <ResumeEditor 
                id={editingId} 
                onBack={() => navigateTo('dashboard')}
                API_BASE={API_BASE}
                userId={user?.id}
              />
            )}
          </>
        )}
      </div>

      {/* AI Career Assistant Chatbot */}
      {isSignedIn && <AIChatbot API_BASE={API_BASE} />}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
