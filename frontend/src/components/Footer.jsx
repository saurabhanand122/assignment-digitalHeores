import React from 'react';
import { Sparkles, Shield, Compass, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="no-print glass-panel" style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--color-border)',
      padding: '3rem 2rem 2rem 2rem',
      background: 'var(--color-card-bg)',
      backdropFilter: 'blur(8px)',
      zIndex: 5,
      transition: 'all var(--transition-normal)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
        
        {/* Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          textAlign: 'left',
          width: '100%'
        }}>
          {/* Column 1: Brand & Intro */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-header)', color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} style={{ color: 'var(--color-secondary)' }} />
              Resume Builder
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
              Craft high-impact, theme-aware resumes and host them as responsive web portfolios powered by state-of-the-art AI parsing engines.
            </p>
          </div>

          {/* Column 2: AI Capabilities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              AI Engine
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-dark)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={12} style={{ color: 'var(--color-secondary)' }} /> AI Resume Generator
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={12} style={{ color: 'var(--color-secondary)' }} /> PDF Profile Extractor
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={12} style={{ color: 'var(--color-secondary)' }} /> AI Bullet Optimizer
              </span>
            </div>
          </div>

          {/* Column 3: Platform Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              Features
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-dark)', opacity: 0.9 }}>
              <span>Theme Customizer (Moss, Space, Cream)</span>
              <span>A4 PDF Inspired Slides Layout</span>
              <span>Completeness Scoring Gauges</span>
              <span>Single-Click Public Link Sharing</span>
            </div>
          </div>

          {/* Column 4: Trust & Support */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              Trust & Safety
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-dark)', opacity: 0.9 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Shield size={12} style={{ color: 'var(--color-primary)' }} /> Clerk Secure Authentication
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Compass size={12} style={{ color: 'var(--color-primary)' }} /> Privacy Policy
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={12} style={{ color: 'var(--color-primary)' }} /> Terms of Service
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)'
        }}>
          <span>&copy; {new Date().getFullYear()} Resume Builder Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Powered by Gemini 2.5 Flash</span>
            <span>Security by Clerk</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
