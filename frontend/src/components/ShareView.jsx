import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumePreview from './ResumePreview';
import { Printer, Mail, Share2, Award, Briefcase, GraduationCap } from 'lucide-react';

export default function ShareView({ id, onBackToDashboard, API_BASE }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/resumes/${id}`);
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching shared resume:', err);
      setError('Could not load portfolio. It may have been deleted.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0' }}>
        <div style={{ 
          display: 'inline-block', 
          width: '40px', 
          height: '40px', 
          border: '4px solid rgba(27, 67, 96, 0.1)', 
          borderTopColor: 'var(--color-primary)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading portfolio showcase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: 'var(--radius-md)', margin: '4rem auto', maxWidth: '500px', border: '1px solid var(--color-border)' }}>
        <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' }}>{error}</p>
        {onBackToDashboard && (
          <button onClick={onBackToDashboard} className="btn btn-primary">
            Go to Dashboard
          </button>
        )}
      </div>
    );
  }

  const isSlideTemplate = data.template === 'slide';

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', background: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Header Panel (Controls) */}
      <div className="no-print glass-panel" style={{ 
        width: '100%', 
        maxWidth: '800px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'var(--color-card-bg)', 
        padding: '1rem 1.5rem', 
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        border: '1px solid var(--color-border)'
      }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.15rem', fontFamily: 'var(--font-header)' }}>
            Portfolio: {data.personal?.fullName || 'Candidate'}
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Public Shareable URL
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {onBackToDashboard && (
            <button onClick={onBackToDashboard} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Back to Dashboard
            </button>
          )}
          <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Printer size={14} /> Download PDF / Print
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div style={{ width: '100%', maxWidth: '800px', flex: 1 }}>
        <ResumePreview data={data} activeSlide={0} isInteractive={false} />
      </div>

      {/* Footer Branding Info */}
      <div className="no-print" style={{ 
        marginTop: '4rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--color-border)', 
        paddingTop: '2rem',
        width: '100%',
        maxWidth: '800px'
      }}>
        {/* Mandatory Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <a 
            href="https://digitalheroesco.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="digital-heroes-badge"
            style={{
              background: 'var(--color-primary)',
              color: '#ffffff',
              padding: '0.75rem 1.75rem',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-secondary)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Built for Digital Heroes
          </a>
        </div>

        {/* Developer Contact Info (Mandatory Requirement) */}
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          <p>Portfolio Showcase Platform designed by <strong>Saurabh Anand</strong> (saurabh.anand122@gmail.com)</p>
          <p style={{ marginTop: '0.25rem' }}>Built using the MERN Stack (MongoDB, Express, React, Node.js)</p>
        </div>
      </div>
    </div>
  );
}
