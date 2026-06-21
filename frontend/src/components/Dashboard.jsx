import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Share2, Trash2, Mail, MapPin, Eye, Search, Database, Layers, Sparkles, FolderOpen, ArrowRight } from 'lucide-react';

export default function Dashboard({ onCreateNew, onEdit, onShare, API_BASE }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

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
      setError('Could not connect to backend server. Make sure MongoDB & the backend port are active.');
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

  const handleShareClick = (id, e) => {
    e.stopPropagation();
    onShare(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredResumes = resumes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.personal?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 2rem', position: 'relative', minHeight: '100vh', background: 'transparent', overflow: 'hidden' }}>
      
      {/* Animated Floating Background Blobs */}
      <div className="blob-decor blob-primary animate-blob-1" style={{ top: '10%', left: '-5%', width: '400px', height: '400px', opacity: 0.12 }}></div>
      <div className="blob-decor blob-secondary animate-blob-2" style={{ bottom: '15%', right: '-5%', width: '350px', height: '350px', opacity: 0.1 }}></div>
      <div className="blob-decor blob-accent animate-blob-1" style={{ top: '60%', left: '40%', width: '250px', height: '250px', opacity: 0.08 }}></div>

      {/* Glassmorphic Hero Banner (Responsive Two Column Grid) */}
      <div className="glass-panel animate-slide-up dashboard-hero-grid" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2.5rem',
        marginBottom: '3rem',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(27, 67, 96, 0.03)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center'
      }}>
        {/* Left Column: Heading and info */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(205, 138, 75, 0.15)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', color: 'var(--color-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem', border: '1px solid rgba(205, 138, 75, 0.25)' }}>
            <Sparkles size={14} /> Creative Presentation Workspace
          </div>
          
          <h1 style={{ 
            fontSize: '3rem', 
            fontFamily: 'var(--font-header)',
            lineHeight: 1.15,
            marginBottom: '1rem',
            color: 'var(--color-primary)'
          }}>
            Creative <span className="serif" style={{ color: 'var(--color-secondary)', fontStyle: 'italic' }}>Resume</span> Builder
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-dark)', maxWidth: '600px', marginBottom: '2rem', opacity: 0.85, lineHeight: 1.6 }}>
            Design, edit, and share visually stunning, responsive A4 resumes with custom spacing, premium typography, and theme configurations.
          </p>

          {/* Developer Contact Card (Mandatory Requirement) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            background: 'var(--color-card-bg)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            width: 'fit-content',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
          >
            <img 
              src="/developer_avatar.png" 
              alt="Saurabh Anand" 
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '2px solid var(--color-primary)',
                objectFit: 'cover'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-text-dark)', fontSize: '0.95rem', lineHeight: 1.2 }}>
                Saurabh Anand
              </span>
              <a 
                href="mailto:saurabh.anand122@gmail.com" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  color: 'var(--color-secondary)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  marginTop: '0.15rem'
                }}
              >
                <Mail size={12} /> saurabh.anand122@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Illustration */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src="/hero_showcase.png" 
            alt="Resume Builder Showcase" 
            style={{
              width: '100%',
              maxWidth: '360px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-lg)',
              aspectRatio: '16/11',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      {/* Grid Statistics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
        marginBottom: '3.5rem'
      }}>
        {/* Card 1: Total Resumes */}
        <div className="glass-panel" style={{ 
          padding: '1.75rem', 
          borderRadius: 'var(--radius-md)', 
          borderLeft: '5px solid var(--color-secondary)',
          transition: 'all 0.3s ease',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Resumes</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{resumes.length}</p>
          </div>
          <FolderOpen size={40} style={{ opacity: 0.15, color: 'var(--color-primary)' }} />
        </div>

        {/* Card 2: Active Templates */}
        <div className="glass-panel" style={{ 
          padding: '1.75rem', 
          borderRadius: 'var(--radius-md)', 
          borderLeft: '5px solid var(--color-primary)',
          transition: 'all 0.3s ease',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Layout Options</h3>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.2 }}>3 A4 Themes</p>
          </div>
          <Layers size={40} style={{ opacity: 0.15, color: 'var(--color-primary)' }} />
        </div>

        {/* Card 3: Database status */}
        <div className="glass-panel" style={{ 
          padding: '1.75rem', 
          borderRadius: 'var(--radius-md)', 
          borderLeft: '5px solid var(--color-success)',
          transition: 'all 0.3s ease',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>DB Sync</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="pulse-green"></span>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-success)' }}>MERN Connection Live</p>
            </div>
          </div>
          <Database size={40} style={{ opacity: 0.15, color: 'var(--color-success)' }} />
        </div>
      </div>

      {/* Main Controls Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '1.5rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '350px' }}>
          <input 
            type="text" 
            placeholder="Search resumes by title or candidate..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              background: 'var(--color-card-bg)',
              color: 'var(--color-text-dark)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.3s ease'
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(111, 163, 122, 0.18)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--color-border)';
              e.target.style.boxShadow = 'var(--shadow-sm)';
            }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        </div>

        {/* Action Button */}
        <button 
          onClick={onCreateNew} 
          className="btn btn-primary" 
          style={{ 
            padding: '0.85rem 2.25rem', 
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(111, 163, 122, 0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          <Plus size={18} /> Create New Resume
        </button>
      </div>

      {/* Resumes Grid/Layout List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <div style={{ 
            display: 'inline-block', 
            width: '45px', 
            height: '45px', 
            border: '4px solid rgba(27, 67, 96, 0.08)', 
            borderTopColor: 'var(--color-primary)', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1.25rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Fetching resumes from database...</p>
        </div>
      ) : error ? (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.04)', 
          border: '1px solid rgba(239, 68, 68, 0.15)', 
          padding: '2rem', 
          borderRadius: 'var(--radius-md)', 
          color: '#c53030', 
          textAlign: 'center', 
          margin: '2rem 0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.1rem' }}>{error}</p>
          <button onClick={fetchResumes} className="btn btn-outline" style={{ border: '1px solid #c53030', color: '#c53030', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-sm)' }}>
            Reconnect Server
          </button>
        </div>
      ) : filteredResumes.length === 0 ? (
        /* Empty State Layout (Beautiful Dotted Panel) */
        <div className="glass-panel animate-slide-up" style={{ 
          border: '2px dashed rgba(27, 67, 96, 0.2)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '5rem 2rem', 
          textAlign: 'center', 
          color: 'var(--color-text-dark)',
          maxWidth: '750px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <FolderOpen size={64} style={{ color: 'var(--color-primary)', opacity: 0.5, marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>No resumes found</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
            It looks like you haven't created any resumes yet. Start building a professional document now.
          </p>
          <button onClick={onCreateNew} className="btn btn-secondary btn-pulse" style={{ padding: '0.85rem 2.25rem', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}>
            <Plus size={18} /> Create Your First Resume
          </button>
        </div>
      ) : (
        /* Populated Resumes Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {filteredResumes.map((resume) => (
            <div 
              key={resume._id} 
              onClick={() => onEdit(resume._id)}
              style={{
                background: 'var(--color-card-bg)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '250px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
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
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>{resume.title}</h3>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: 'var(--radius-full)', 
                    background: resume.template === 'slide' ? 'rgba(27,67,96,0.08)' : 'rgba(129, 178, 154, 0.12)',
                    color: resume.template === 'slide' ? 'var(--color-primary)' : 'var(--color-success)',
                    fontWeight: 700,
                    border: resume.template === 'slide' ? '1px solid rgba(27,67,96,0.15)' : '1px solid rgba(129,178,154,0.25)'
                  }}>
                    {resume.template === 'slide' ? 'Creative A4' : resume.template === 'modern' ? 'Modern' : 'Minimal'}
                  </span>
                </div>
                
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                  {resume.personal?.fullName || 'Untitled Candidate'}
                </p>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                  {resume.personal?.summary || 'No summary description written yet.'}
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
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={(e) => handleShareClick(resume._id, e)} 
                    style={{ 
                      background: copiedId === resume._id ? 'var(--color-success)' : 'rgba(224, 122, 95, 0.1)', 
                      color: copiedId === resume._id ? '#fff' : 'var(--color-secondary)', 
                      border: 'none', 
                      padding: '0.5rem', 
                      borderRadius: 'var(--radius-sm)', 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    title={copiedId === resume._id ? 'Copied!' : 'Copy Share Link'}
                  >
                    <Share2 size={15} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(resume._id, e)} 
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.08)', 
                      color: '#ef4444', 
                      border: 'none', 
                      padding: '0.5rem', 
                      borderRadius: 'var(--radius-sm)', 
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    title="Delete Resume"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Button: Built for Digital Heroes */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
        <a 
          href="https://digitalheroesco.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="digital-heroes-badge"
          style={{
            background: 'var(--color-primary)',
            color: '#ffffff',
            padding: '1rem 2.5rem',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '1.15rem',
            boxShadow: 'var(--shadow-md)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-secondary)';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(224, 122, 95, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
        >
          Built for Digital Heroes <ArrowRight size={18} />
        </a>
      </div>

      {/* CSS Spin Keyframe inline */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
