import { useEffect } from 'react';
import { Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, Code, ExternalLink, Smile, Play, List } from 'lucide-react';

export default function ResumePreview({ data, activeSlide = 0, isInteractive = false }) {
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>No resume data loaded.</div>;

  const {
    template = 'slide',
    colorTheme = 'default',
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
        return <Play size={20} style={{ color: 'var(--color-secondary)' }} />;
      case 'menu':
        return <List size={20} style={{ color: 'var(--color-primary)' }} />;
      case 'smiley':
      default:
        return <Smile size={20} style={{ color: 'var(--color-accent)' }} />;
    }
  };

  // --- 1. PDF INSPIRED "CREATIVE SLIDE" TEMPLATE ---
  const renderCreativeSlideTemplate = () => {
    const slides = [
      // Slide 1: Title Slide
      (
        <div key="slide-1" className="resume-slide" style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text-dark)',
          minHeight: '480px',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}>
          {/* Decorative shapes */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'var(--color-secondary)', opacity: 0.15 }}></div>
          <div style={{ position: 'absolute', bottom: '10px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.2 }}></div>
          
          <div style={{ maxWidth: '70%', zIndex: 2 }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              color: 'var(--color-primary)', 
              fontFamily: 'var(--font-serif)', 
              lineHeight: 1.1,
              marginBottom: '1rem'
            }}>
              {personal.fullName || 'Write Name Here'}
            </h1>
            <h3 style={{ 
              fontSize: '1.75rem', 
              color: 'var(--color-secondary)', 
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              borderBottom: '3px solid var(--color-primary)',
              paddingBottom: '0.5rem',
              width: 'fit-content',
              marginBottom: '1.5rem'
            }}>
              {personal.title || 'Professional Title / Role'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              {personal.location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {personal.location}</span>}
              {personal.email && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {personal.email}</span>}
            </div>
          </div>

          {/* SVG Illustration of developer on a laptop (matching PDF look) */}
          <div style={{ position: 'absolute', right: '2rem', bottom: '2rem', width: '220px', height: '220px', opacity: 0.95 }}>
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="110" r="70" fill="var(--color-accent)" opacity="0.3" />
              <path d="M60,150 L140,150 L130,170 L70,170 Z" fill="var(--color-primary)" />
              <rect x="70" y="80" width="60" height="70" rx="4" fill="var(--color-secondary)" />
              <rect x="75" y="85" width="50" height="50" rx="2" fill="#ffffff" />
              <path d="M90,40 Q100,20 110,40 T130,40" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="100" cy="65" r="15" fill="var(--color-accent)" />
              <circle cx="95" cy="62" r="2" fill="var(--color-primary)" />
              <circle cx="105" cy="62" r="2" fill="var(--color-primary)" />
              <path d="M97,70 Q100,72 103,70" stroke="var(--color-primary)" strokeWidth="2" />
            </svg>
          </div>
        </div>
      ),

      // Slide 2: Introduction
      (
        <div key="slide-2" className="resume-slide" style={{
          background: 'var(--color-primary)',
          color: 'var(--color-text-light)',
          minHeight: '480px',
          padding: '3.5rem 3rem',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2rem',
          alignItems: 'center',
          border: '1px solid var(--color-primary)',
          overflow: 'hidden'
        }}>
          {/* Background blobs */}
          <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'var(--color-secondary)', opacity: 0.2 }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', right: '-20px', width: '160px', height: '160px', borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.15 }}></div>
          
          <div style={{ zIndex: 2 }}>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              Introduction
            </h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', fontFamily: 'var(--font-serif)', opacity: 0.95 }}>
              {personal.summary || 'Write a brief description of who you are, what you do, and what you are passionate about. Keep it engaging and easy to read.'}
            </p>
          </div>

          {/* Organic Blob Photo Frame (Inspired by PDF) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <div style={{
              width: '180px',
              height: '180px',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              border: '4px solid #fff'
            }}>
              <svg viewBox="0 0 100 100" fill="var(--color-primary)" style={{ width: '60%', height: '60%' }}>
                <path d="M50 15 C 30 15, 15 30, 15 50 C 15 70, 30 85, 50 85 C 70 85, 85 70, 85 50 C 85 30, 70 15, 50 15 Z M 50 25 C 58 25, 65 32, 65 40 C 65 48, 58 55, 50 55 C 42 55, 35 48, 35 40 C 35 32, 42 25, 50 25 Z M 50 60 C 63 60, 75 67, 78 75 C 70 81, 60 85, 50 85 C 40 85, 30 81, 22 75 C 25 67, 37 60, 50 60 Z" />
              </svg>
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--color-bg)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              Creative Portfolio
            </p>
          </div>
        </div>
      ),

      // Slide 3: Experience
      (
        <div key="slide-3" className="resume-slide" style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text-dark)',
          minHeight: '480px',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', marginBottom: '2rem' }}>
            Work Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {experience.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No experience listed yet.</p>
            ) : (
              experience.map((exp, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', borderBottom: idx < experience.length - 1 ? '1px solid #e2e8f0' : 'none', paddingBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>{exp.company}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{exp.startDate} - {exp.endDate || 'Present'}</p>
                    {exp.location && <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{exp.location}</p>}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>{exp.role}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-dark)', whiteSpace: 'pre-line' }}>{exp.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ),

      // Slide 4: Education & Certifications
      (
        <div key="slide-4" className="resume-slide" style={{
          background: 'var(--color-secondary)',
          color: 'var(--color-text-light)',
          minHeight: '480px',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-secondary)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '2rem' }}>
            Education & Certifications
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2.5rem' }}>
            {/* Education column */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Education</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {education.length === 0 ? (
                  <p style={{ opacity: 0.8 }}>No education listed.</p>
                ) : (
                  education.map((edu, idx) => (
                    <div key={idx}>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--color-accent)' }}>{edu.school}</h4>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{edu.degree}</p>
                      <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{edu.gradDate} {edu.score && `| Score: ${edu.score}`}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Certifications column */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Certifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {certifications.length === 0 ? (
                  <p style={{ opacity: 0.8 }}>No certifications listed.</p>
                ) : (
                  certifications.map((cert, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <Award size={20} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cert.title}</h4>
                        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{cert.issuer} {cert.date && `(${cert.date})`}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ),

      // Slide 5: Projects
      (
        <div key="slide-5" className="resume-slide" style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text-dark)',
          minHeight: '480px',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
            Featured Projects
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '0.5rem 0.5rem 0.5rem 0'
          }}>
            {projects.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No projects listed.</p>
            ) : (
              projects.map((proj, idx) => (
                <div key={idx} style={{
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>{proj.title}</h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-secondary)' }}>
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    {proj.role && <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>{proj.role}</p>}
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', marginBottom: '0.75rem' }}>{proj.description}</p>
                  </div>
                  {proj.technologies && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        <strong>Technologies:</strong> {proj.technologies}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ),

      // Slide 6: Skills & Contacts
      (
        <div key="slide-6" className="resume-slide" style={{
          background: 'var(--color-primary)',
          color: 'var(--color-text-light)',
          minHeight: '480px',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-primary)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '2.5rem',
          overflow: 'hidden'
        }}>
          {/* Skills Column */}
          <div>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              Skills & Expertise
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
              {skills.length === 0 ? (
                <p style={{ opacity: 0.8 }}>No skills listed.</p>
              ) : (
                skills.map((skill, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{ fontWeight: 600 }}>{skill.name}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'var(--color-accent)', 
                      color: '#000', 
                      padding: '0.05rem 0.4rem', 
                      borderRadius: '50%',
                      fontWeight: 700
                    }}>
                      {skill.level}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Social Contacts & Custom Links (as shown in PDF) */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '1.25rem', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}>
              Resources & Contact
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {personal.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} style={{ color: 'var(--color-accent)' }} />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.website && (
                <a href={personal.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', hover: { color: 'var(--color-accent)' } }}>
                  <Globe size={18} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ textDecoration: 'underline' }}>Portfolio Website</span>
                </a>
              )}
              
              {/* Custom Links modeled directly from the PDF design */}
              {links.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: '#fff',
                  color: 'var(--color-text-dark)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  {renderLinkIcon(link.iconType)}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{link.label || 'Link Name'}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Visit Resource</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )
    ];

    if (isInteractive) {
      return slides[activeSlide];
    }

    // Print / Static mode (renders all slides stacked)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {slides}
      </div>
    );
  };

  // --- 2. MODERN PROFESSIONAL TWO-COLUMN TEMPLATE ---
  const renderModernProfessionalTemplate = () => {
    return (
      <div className="resume-a4-page" style={{
        background: '#ffffff',
        color: '#1e293b',
        padding: '3rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        minHeight: '1000px',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '3rem'
      }}>
        {/* Left Column (Sidebar) */}
        <div style={{ borderRight: '1px solid #f1f5f9', paddingRight: '2rem' }}>
          {/* Header name */}
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>{personal.fullName || 'Name'}</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-secondary)', fontWeight: 700, marginBottom: '2rem' }}>{personal.title || 'Title'}</p>

          {/* Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
            <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.25rem', color: 'var(--color-primary)' }}>Contact</h4>
            {personal.email && <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', wordBreak: 'break-all' }}><Mail size={14} /> {personal.email}</p>}
            {personal.phone && <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {personal.phone}</p>}
            {personal.location && <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {personal.location}</p>}
            {personal.website && <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={14} /> {personal.website}</p>}
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.25rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Skills</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
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
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>Profile</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Experience</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--color-text-dark)', fontWeight: 700 }}>{exp.role}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>{exp.company} | {exp.location}</p>
                  <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Education</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{edu.degree}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{edu.gradDate}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}>{edu.school} {edu.score && `(Score: ${edu.score})`}</p>
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
        padding: '3.5rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        minHeight: '1000px',
        fontFamily: 'var(--font-serif)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', borderBottom: '2px double #ccc', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>{personal.fullName || 'Name'}</h1>
          <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#555', marginBottom: '1rem' }}>{personal.title}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', fontFamily: 'var(--font-sans)', color: '#666' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.location && <span>• {personal.location}</span>}
            {personal.website && <span>• {personal.website}</span>}
          </div>
        </div>

        {/* Summary */}
        {personal.summary && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.6', textAlign: 'justify' }}>{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', borderBottom: '1px solid #aaa', paddingBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Professional Experience</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>{exp.role}</span>
                  <span style={{ fontWeight: 400, fontSize: '0.9rem' }}>{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', color: '#444', marginBottom: '0.35rem' }}>
                  <span>{exp.company}, {exp.location}</span>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.5', fontFamily: 'var(--font-sans)', color: '#2d3748', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', borderBottom: '1px solid #aaa', paddingBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Education</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {education.map((edu, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>{edu.school}</span>
                  <span style={{ fontWeight: 400, fontSize: '0.9rem' }}>{edu.gradDate}</span>
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
