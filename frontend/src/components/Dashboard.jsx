import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Share2, Trash2, Award, Briefcase, GraduationCap, Link2, Mail, Phone, MapPin, Eye, Search } from 'lucide-react';

export default function Dashboard({ onCreateNew, onEdit, onShare, API_BASE }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/resumes`);
      setResumes(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Could not fetch resumes. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await axios.delete(`${API_BASE}/resumes/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume');
    }
  };

  const filteredResumes = resumes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.personal?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', position: 'relative' }}>
      {/* Background blobs */}
      <div className="blob-decor blob-primary" style={{ top: '5%', left: '10%' }}></div>
      <div className="blob-decor blob-secondary" style={{ bottom: '10%', right: '5%' }}></div>

      {/* Main Header Card */}
      <div style={{
        background: 'rgba(27, 67, 96, 0.04)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        marginBottom: '2.5rem',
        border: '1px solid rgba(27, 67, 96, 0.08)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ 
          fontSize: '2.75rem', 
          color: 'var(--color-primary)', 
          fontFamily: 'var(--font-serif)',
          marginBottom: '0.75rem' 
        }}>
          Creative Resume Builder & Showcase
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-dark)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Build, customize, and share visually stunning, responsive resumes and portfolios inspired by premium design aesthetics.
        </p>

        {/* Developer Contact Info (Mandatory Requirement) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1.5rem', 
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-full)',
          width: 'fit-content',
          margin: '0 auto',
          border: '1px solid var(--color-border)'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            <strong>Developer:</strong> Saurabh Anand
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-dark)' }}>
            <Mail size={16} /> saurabh.anand122@gmail.com
          </span>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Resumes</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{resumes.length}</p>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Active Templates</h3>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-secondary)' }}>3 Themes</p>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Database</h3>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '0.5rem' }}>MERN connected</p>
        </div>
      </div>

      {/* Main Controls & Search */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input 
            type="text" 
            placeholder="Search resumes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 1rem 0.625rem 2.25rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              background: '#fff'
            }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        </div>

        <button onClick={onCreateNew} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}>
          <Plus size={18} /> Create New Resume
        </button>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ 
            display: 'inline-block', 
            width: '40px', 
            height: '40px', 
            border: '4px solid rgba(27, 67, 96, 0.1)', 
            borderTopColor: 'var(--color-primary)', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading saved resumes...</p>
        </div>
      ) : error ? (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.05)', 
          border: '1px solid rgba(239, 68, 68, 0.2)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)', 
          color: '#b91c1c', 
          textAlign: 'center', 
          margin: '2rem 0' 
        }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{error}</p>
          <button onClick={fetchResumes} className="btn btn-outline" style={{ border: '1px solid #b91c1c', color: '#b91c1c', padding: '0.5rem 1rem' }}>
            Try Again
          </button>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div style={{ 
          background: '#fff', 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--radius-md)', 
          padding: '4rem 2rem', 
          textAlign: 'center', 
          color: 'var(--color-text-muted)' 
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>No resumes found. Let's create your first one!</p>
          <button onClick={onCreateNew} className="btn btn-secondary">
            <Plus size={18} /> Create First Resume
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2.5rem'
        }}>
          {filteredResumes.map((resume) => (
            <div 
              key={resume._id} 
              onClick={() => onEdit(resume._id)}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>{resume.title}</h3>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    background: resume.template === 'slide' ? 'var(--color-accent)' : 'var(--color-success)',
                    color: '#000',
                    fontWeight: 600
                  }}>
                    {resume.template === 'slide' ? 'Slide Theme' : resume.template === 'modern' ? 'Modern' : 'Minimal'}
                  </span>
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>
                  {resume.personal?.fullName || 'Anonymous Candidate'}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {resume.personal?.summary || 'No summary written yet.'}
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: '1px solid var(--color-border)', 
                paddingTop: '1rem',
                marginTop: '1rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Edited {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onShare(resume._id); }} 
                    style={{ background: 'rgba(224, 122, 95, 0.1)', color: 'var(--color-secondary)', border: 'none', padding: '0.375rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                    title="Public Share Link"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(resume._id, e)} 
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.375rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                    title="Delete Resume"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Button: Built for Digital Heroes */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <a 
          href="https://digitalheroesco.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="digital-heroes-badge"
          style={{
            background: 'var(--color-primary)',
            color: '#ffffff',
            padding: '0.875rem 2rem',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: 'var(--shadow-md)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all var(--transition-normal)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-secondary)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-primary)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          Built for Digital Heroes
        </a>
      </div>

      {/* CSS Keyframes inline */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
