import { useEffect } from 'react';
import { Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, Code, ExternalLink, Smile, Play, List } from 'lucide-react';

export default function ResumePreview({ data, activeSlide = 0, isInteractive = false, activeHighlightField = null }) {
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>No resume data loaded.</div>;

  const {
    template = 'slide',
    colorTheme = 'default',
    fontSizeScale = 14,
    spacingScale = 1.5,
    personal = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    links = []
  } = data;

  // Render icons for custom links based on PDF
  const renderLinkIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play size={16} style={{ color: 'var(--color-secondary)' }} />;
      case 'menu':
        return <List size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'smiley':
      default:
        return <Smile size={16} style={{ color: 'var(--color-accent)' }} />;
    }
  };

  // --- 1. PDF INSPIRED "CREATIVE" TEMPLATE (A4 SHEET) ---
  const renderCreativeSlideTemplate = () => {
    return (
      <div className="resume-a4-page animate-fade-in" style={{
        background: '#ffffff',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        fontFamily: 'var(--font-sans)',
        color: '#2d3742',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '1123px',
        position: 'relative',
        fontSize: `${fontSizeScale}px`,
        padding: `${spacingScale * 1.8}rem ${spacingScale * 2}rem`,
        gap: `${spacingScale * 1.3}rem`,
        transition: 'all var(--transition-normal)'
      }}>
        {/* Top Accent Line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}></div>

        {/* Header Section */}
        <div 
          className={activeHighlightField === 'personal' ? 'highlight-pulse' : ''} 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: `${spacingScale * 0.8}rem`, transition: 'all var(--transition-fast)' }}
        >
          <div>
            <h1 style={{ 
              fontSize: '2.5em', 
              color: 'var(--color-primary)', 
              fontFamily: 'var(--font-serif)', 
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '0.25em'
            }}>
              {personal.fullName || 'Candidate Name'}
            </h1>
            <h3 style={{ 
              fontSize: '1.2em', 
              color: 'var(--color-secondary)', 
              fontWeight: 600,
              marginBottom: '0.75em'
            }}>
              {personal.title || 'Professional Title'}
            </h3>
            {/* Contact details */}
            <div style={{ display: 'flex', gap: '1.25em', flexWrap: 'wrap', fontSize: '0.85em', color: '#555' }}>
              {personal.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25em' }}><Mail size={14} /> {personal.email}</span>}
              {personal.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25em' }}><Phone size={14} /> {personal.phone}</span>}
              {personal.location && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25em' }}><MapPin size={14} /> {personal.location}</span>}
            </div>
          </div>

          {/* Small SVG Logo Decor */}
          <div style={{ width: '60px', height: '60px', opacity: 0.8 }}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="var(--color-primary)" opacity="0.1" />
              <path d="M35,65 L65,65 L57,75 L43,75 Z" fill="var(--color-primary)" />
              <rect x="40" y="35" width="20" height="30" rx="2" fill="var(--color-secondary)" />
              <rect x="42" y="37" width="16" height="20" rx="1" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Profile Summary */}
        {personal.summary && (
          <div className={activeHighlightField === 'personal' ? 'highlight-pulse' : ''} style={{ padding: '0.25rem', transition: 'all var(--transition-fast)' }}>
            <h2 style={{ fontSize: '1.25em', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35em', marginBottom: '0.75em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Professional Profile
            </h2>
            <p style={{ fontSize: '0.95em', lineHeight: '1.6', color: '#4a5568', textAlign: 'justify' }}>
              {personal.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25em', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35em', marginBottom: '1em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Work Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacingScale * 0.8}rem` }}>
              {experience.map((exp, idx) => (
                <div 
                  key={idx} 
                  className={activeHighlightField === `experience-${idx}` ? 'highlight-pulse' : ''} 
                  style={{ padding: '0.25rem', transition: 'all var(--transition-fast)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25em' }}>
                    <h3 style={{ fontSize: '1.05em', color: '#1a202c', fontWeight: 700 }}>
                      {exp.role} <span style={{ fontWeight: 400, color: '#718096' }}>at</span> <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>{exp.company}</span>
                    </h3>
                    <span style={{ fontSize: '0.8em', color: '#718096', fontWeight: 600 }}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.location && <p style={{ fontSize: '0.8em', color: '#718096', fontStyle: 'italic', marginBottom: '0.35em' }}>{exp.location}</p>}
                  <p style={{ fontSize: '0.9em', lineHeight: '1.5', color: '#4a5568', whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25em', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35em', marginBottom: '1em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Key Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25em' }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)', padding: '1rem', background: '#fafbfc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25em' }}>
                    <h3 style={{ fontSize: '0.95em', color: 'var(--color-primary)', fontWeight: 700 }}>{proj.title}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-secondary)' }}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  {proj.role && <p style={{ fontSize: '0.75em', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.5em' }}>{proj.role}</p>}
                  <p style={{ fontSize: '0.8em', color: '#4a5568', lineHeight: '1.4', marginBottom: '0.5em' }}>{proj.description}</p>
                  {proj.technologies && (
                    <p style={{ fontSize: '0.75em', color: '#718096', borderTop: '1px dashed #e2e8f0', paddingTop: '0.35em', marginTop: '0.35em' }}>
                      <strong>Tech:</strong> {proj.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications (Two Column) */}
        {(education.length > 0 || certifications.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem' }}>
            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.25em', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35em', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Education
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <h4 style={{ fontSize: '0.95em', color: '#1a202c', fontWeight: 700 }}>{edu.degree}</h4>
                      <p style={{ fontSize: '0.85em', color: 'var(--color-secondary)', fontWeight: 600 }}>{edu.school}</p>
                      <p style={{ fontSize: '0.75em', color: '#718096' }}>{edu.gradDate} {edu.score && `| Grade: ${edu.score}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.25em', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35em', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Certifications
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
                  {certifications.map((cert, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.4em', alignItems: 'flex-start' }}>
                      <Award size={14} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <h4 style={{ fontSize: '0.85em', color: '#1a202c', fontWeight: 700, margin: 0 }}>{cert.title}</h4>
                        <p style={{ fontSize: '0.75em', color: '#718096', margin: 0 }}>{cert.issuer} {cert.date && `(${cert.date})`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Skills & Creative Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', marginTop: 'auto', borderTop: '2px solid #f1f5f9', paddingTop: '1.5rem' }}>
          {/* Skills */}
          <div>
            <h2 style={{ fontSize: '1.1em', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', marginBottom: '0.75em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Skills & Expertise
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35em' }}>
              {skills.map((skill, idx) => (
                <span key={idx} style={{
                  background: 'rgba(27,67,96,0.05)',
                  color: 'var(--color-primary)',
                  border: '1px solid rgba(27,67,96,0.15)',
                  padding: '0.25em 0.5em',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78em',
                  fontWeight: 600
                }}>
                  {skill.name} ({skill.level})
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 style={{ fontSize: '1.1em', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', marginBottom: '0.75em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Professional Resources
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
              {personal.website && (
                <a href={personal.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35em', fontSize: '0.82em', color: 'var(--color-secondary)', fontWeight: 600 }}>
                  <Globe size={14} />
                  <span>Personal Website / Portfolio</span>
                </a>
              )}
              {links.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35em', fontSize: '0.82em', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {renderLinkIcon(link.iconType)}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 2. MODERN PROFESSIONAL TWO-COLUMN TEMPLATE ---
  const renderModernProfessionalTemplate = () => {
    return (
      <div className="resume-a4-page" style={{
        background: '#ffffff',
        color: '#1e293b',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        minHeight: '1123px',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        fontSize: `${fontSizeScale}px`,
        padding: `${spacingScale * 1.5}rem ${spacingScale * 1.8}rem`,
        gap: `${spacingScale * 2.0}rem`,
        transition: 'all var(--transition-normal)'
      }}>
        {/* Left Column (Sidebar) */}
        <div style={{ borderRight: '1px solid #f1f5f9', paddingRight: `${spacingScale * 1.2}rem` }}>
          {/* Header name */}
          <div className={activeHighlightField === 'personal' ? 'highlight-pulse' : ''} style={{ padding: '0.25rem', transition: 'all var(--transition-fast)' }}>
            <h2 style={{ fontSize: '1.75em', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', marginBottom: '0.5em' }}>{personal.fullName || 'Name'}</h2>
            <p style={{ fontSize: '1em', color: 'var(--color-secondary)', fontWeight: 700, marginBottom: '2em' }}>{personal.title || 'Title'}</p>
          </div>

          {/* Contact */}
          <div 
            className={activeHighlightField === 'personal' ? 'highlight-pulse' : ''} 
            style={{ display: 'flex', flexDirection: 'column', gap: '1em', marginBottom: '2rem', fontSize: '0.85em', padding: '0.25rem', transition: 'all var(--transition-fast)' }}
          >
            <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.25rem', color: 'var(--color-primary)' }}>Contact</h4>
            {personal.email && <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', wordBreak: 'break-all' }}><Mail size={14} /> {personal.email}</p>}
            {personal.phone && <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {personal.phone}</p>}
            {personal.location && <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {personal.location}</p>}
            {personal.website && <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={14} /> {personal.website}</p>}
          </div>

          {/* Skills */}
          <div className={activeHighlightField === 'skills' ? 'highlight-pulse' : ''} style={{ marginBottom: '2rem', padding: '0.25rem', transition: 'all var(--transition-fast)' }}>
            <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.25rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Skills</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85em' }}>
                  <span>{skill.name}</span>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>★ {skill.level}/5</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Content) */}
        <div>
          {/* Summary */}
          {personal.summary && (
            <div className={activeHighlightField === 'personal' ? 'highlight-pulse' : ''} style={{ marginBottom: '2rem', padding: '0.25rem', transition: 'all var(--transition-fast)' }}>
              <h3 style={{ fontSize: '1.25em', color: 'var(--color-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5em', marginBottom: '0.75rem' }}>Profile</h3>
              <p style={{ fontSize: '0.95em', lineHeight: '1.6' }}>{personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25em', color: 'var(--color-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5em', marginBottom: '1em' }}>Experience</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacingScale * 0.9}rem` }}>
              {experience.map((exp, idx) => (
                <div 
                  key={idx} 
                  className={activeHighlightField === `experience-${idx}` ? 'highlight-pulse' : ''} 
                  style={{ padding: '0.25rem', transition: 'all var(--transition-fast)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25em' }}>
                    <h4 style={{ fontSize: '1.1em', color: 'var(--color-text-dark)', fontWeight: 700 }}>{exp.role}</h4>
                    <span style={{ fontSize: '0.85em', color: 'var(--color-text-muted)' }}>{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <p style={{ fontSize: '0.9em', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: '0.5em' }}>{exp.company} | {exp.location}</p>
                  <p style={{ fontSize: '0.9em', whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25em', color: 'var(--color-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5em', marginBottom: '1em' }}>Education</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacingScale * 0.8}rem` }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '1.05em', fontWeight: 700 }}>{edu.degree}</h4>
                    <span style={{ fontSize: '0.85em', color: 'var(--color-text-muted)' }}>{edu.gradDate}</span>
                  </div>
                  <p style={{ fontSize: '0.9em', color: 'var(--color-secondary)' }}>{edu.school} {edu.score && `(Score: ${edu.score})`}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 3. MINIMALIST SERIF TEMPLATE ---
  const renderMinimalistSerifTemplate = () => {
    return (
      <div className="resume-a4-page" style={{
        background: '#ffffff',
        color: '#1a1a1a',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        minHeight: '1123px',
        fontFamily: 'var(--font-serif)',
        fontSize: `${fontSizeScale}px`,
        padding: `${spacingScale * 2.2}rem ${spacingScale * 2.5}rem`,
        transition: 'all var(--transition-normal)'
      }}>
        {/* Header */}
        <div 
          className={activeHighlightField === 'personal' ? 'highlight-pulse' : ''} 
          style={{ textAlign: 'center', marginBottom: '2.5rem', borderBottom: '2px double #ccc', paddingBottom: '1.5rem', padding: '0.25rem', transition: 'all var(--transition-fast)' }}
        >
          <h1 style={{ fontSize: '2.5em', fontWeight: 400, marginBottom: '0.5em' }}>{personal.fullName || 'Name'}</h1>
          <p style={{ fontSize: '1.1em', fontStyle: 'italic', color: '#555', marginBottom: '1rem' }}>{personal.title}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85em', fontFamily: 'var(--font-sans)', color: '#666' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.location && <span>• {personal.location}</span>}
            {personal.website && <span>• {personal.website}</span>}
          </div>
        </div>

        {/* Summary */}
        {personal.summary && (
          <div className={activeHighlightField === 'personal' ? 'highlight-pulse' : ''} style={{ marginBottom: '2rem', padding: '0.25rem', transition: 'all var(--transition-fast)' }}>
            <p style={{ fontSize: '1em', fontStyle: 'italic', lineHeight: '1.6', textAlign: 'justify' }}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3em', borderBottom: '1px solid #aaa', paddingBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Professional Experience</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacingScale * 0.9}rem` }}>
            {experience.map((exp, idx) => (
              <div 
                key={idx} 
                className={activeHighlightField === `experience-${idx}` ? 'highlight-pulse' : ''} 
                style={{ padding: '0.25rem', transition: 'all var(--transition-fast)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>{exp.role}</span>
                  <span style={{ fontWeight: 400, fontSize: '0.9em' }}>{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', color: '#444', marginBottom: '0.35rem' }}>
                  <span>{exp.company}, {exp.location}</span>
                </div>
                <p style={{ fontSize: '0.95em', lineHeight: '1.5', fontFamily: 'var(--font-sans)', color: '#2d3748', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3em', borderBottom: '1px solid #aaa', paddingBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Education</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacingScale * 0.8}rem` }}>
            {education.map((edu, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>{edu.school}</span>
                  <span style={{ fontWeight: 400, fontSize: '0.9em' }}>{edu.gradDate}</span>
                </div>
                <p style={{ fontStyle: 'italic' }}>{edu.degree} {edu.score && `(GPA: ${edu.score})`}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Theme data attributes injection for stylesheets
  useEffect(() => {
    document.body.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  // Main router switch
  switch (template) {
    case 'modern':
      return renderModernProfessionalTemplate();
    case 'minimal':
      return renderMinimalistSerifTemplate();
    case 'slide':
    default:
      return renderCreativeSlideTemplate();
  }
}
