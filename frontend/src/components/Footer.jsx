import React from 'react';
import { Mail, Heart, Globe, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="no-print glass-panel" style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--color-border)',
      padding: '2.5rem 2rem',
      background: 'var(--color-card-bg)',
      backdropFilter: 'blur(8px)',
      textAlign: 'center',
      zIndex: 5,
      transition: 'all var(--transition-normal)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        
        {/* Footer Top: Branding & Built Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1.25rem'
        }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-header)', color: 'var(--color-primary)', margin: 0 }}>
              Resume Builder
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
              Designed for outstanding visual portfolios.
            </p>
          </div>

          {/* Mandatory Button */}
          <a 
            href="https://digitalheroesco.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="digital-heroes-badge"
            style={{
              background: 'var(--color-primary)',
              color: '#ffffff',
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-secondary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Built for Digital Heroes
          </a>
        </div>

        {/* Footer Middle: Tech Stack & Credits */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-dark)',
          opacity: 0.85
        }}>
          {/* Developer Details */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
              Developer: Saurabh Anand
            </span>
            <a href="mailto:saurabh.anand122@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Mail size={14} style={{ color: 'var(--color-secondary)' }} /> saurabh.anand122@gmail.com
            </a>
          </div>

          {/* Stack Info */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={14} style={{ color: 'var(--color-primary)' }} />
            <span>MERN Stack (MongoDB, Express, React, Node.js) + Vercel</span>
          </div>
        </div>

        {/* Footer Bottom: Copyright */}
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span>&copy; {new Date().getFullYear()} Resume Showcase. Made with</span>
          <Heart size={12} style={{ color: '#ef4444', fill: '#ef4444' }} />
          <span>for Saurabh Anand's portfolio task.</span>
        </div>
        
      </div>
    </footer>
  );
}
