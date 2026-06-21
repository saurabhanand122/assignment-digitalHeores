import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumePreview from './ResumePreview';
import { ArrowLeft, Save, Printer, Plus, Trash2, ChevronDown, ChevronUp, AlertCircle, Share2, Award, Briefcase, GraduationCap, Link2, Smile, Play, List } from 'lucide-react';

export default function ResumeEditor({ id, onBack, API_BASE }) {
  const [formData, setFormData] = useState({
    title: 'My Professional Resume',
    template: 'slide',
    colorTheme: 'default',
    personal: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      github: '',
      linkedin: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    links: []
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Accordion state
  const [expandedSection, setExpandedSection] = useState('metadata');

  useEffect(() => {
    if (id) {
      fetchResumeDetails();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchResumeDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/resumes/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error('Error fetching resume:', err);
      alert('Could not fetch resume details');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalChange = (field, val) => {
    setFormData({
      ...formData,
      personal: {
        ...formData.personal,
        [field]: val
      }
    });
  };

  // Generic array update utilities
  const addArrayItem = (section, emptyItem) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], emptyItem]
    });
  };

  const removeArrayItem = (section, idx) => {
    const updated = [...formData[section]];
    updated.splice(idx, 1);
    setFormData({ ...formData, [section]: updated });
  };

  const updateArrayItem = (section, idx, field, val) => {
    const updated = [...formData[section]];
    updated[idx] = {
      ...updated[idx],
      [field]: val
    };
    setFormData({ ...formData, [section]: updated });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveStatus(null);
      if (id) {
        // Update existing
        await axios.put(`${API_BASE}/resumes/${id}`, formData);
      } else {
        // Create new
        const res = await axios.post(`${API_BASE}/resumes`, formData);
        // Switch to the newly created resume ID so we can keep updating it
        formData._id = res.data._id;
      }
      setSaveStatus({ type: 'success', message: 'Saved successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Error saving:', err);
      setSaveStatus({ type: 'error', message: 'Error saving resume: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem 0' }}>
        <div style={{ 
          display: 'inline-block', 
          width: '40px', 
          height: '40px', 
          border: '4px solid rgba(27, 67, 96, 0.1)', 
          borderTopColor: 'var(--color-primary)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '450px 1fr', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      
      {/* LEFT SIDEBAR: Form Editor */}
      <div className="no-print editor-sidebar" style={{ 
        background: '#fff', 
        borderRight: '1px solid var(--color-border)', 
        height: 'calc(100vh - 64px)', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 10
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(27, 67, 96, 0.02)' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="btn btn-primary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Save Status Banner */}
        {saveStatus && (
          <div style={{ 
            background: saveStatus.type === 'success' ? 'rgba(129, 178, 154, 0.15)' : 'rgba(239, 68, 68, 0.1)',
            color: saveStatus.type === 'success' ? '#2e6b4d' : '#b91c1c',
            padding: '0.75rem 1.25rem',
            fontSize: '0.85rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{saveStatus.message}</span>
          </div>
        )}

        {/* Form Body - Accordions */}
        <div style={{ flex: 1, paddingBottom: '3rem' }}>
          
          {/* Section 1: Resume Metadata */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('metadata')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>1. Style & Settings</span>
              {expandedSection === 'metadata' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            
            {expandedSection === 'metadata' && (
              <div style={{ padding: '1.25rem', background: '#fafbfc' }}>
                <div className="form-group">
                  <label className="form-label">Resume Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Software Engineer Resume"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Template Layout</label>
                  <select 
                    className="form-input" 
                    value={formData.template} 
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  >
                    <option value="slide">PDF Inspired Creative Slides</option>
                    <option value="modern">Modern Professional Two-Column</option>
                    <option value="minimal">Minimalist Classic Serif</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Color Scheme</label>
                  <select 
                    className="form-input" 
                    value={formData.colorTheme} 
                    onChange={(e) => setFormData({ ...formData, colorTheme: e.target.value })}
                  >
                    <option value="default">Digital Blue & Terracotta (Default)</option>
                    <option value="terracotta">Warm Terracotta & Navy</option>
                    <option value="emerald">Forest Emerald & Mustard</option>
                    <option value="indigo">Classic Indigo & Gold</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Personal Information */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('personal')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>2. Personal Details</span>
              {expandedSection === 'personal' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'personal' && (
              <div style={{ padding: '1.25rem', background: '#fafbfc' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={formData.personal.fullName} onChange={(e) => handlePersonalChange('fullName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Headline</label>
                  <input type="text" className="form-input" value={formData.personal.title} onChange={(e) => handlePersonalChange('title', e.target.value)} placeholder="e.g. Senior Frontend Developer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={formData.personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-input" value={formData.personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Location / City</label>
                  <input type="text" className="form-input" value={formData.personal.location} onChange={(e) => handlePersonalChange('location', e.target.value)} placeholder="e.g. San Francisco, CA" />
                </div>
                <div className="form-group">
                  <label className="form-label">Portfolio Website URL</label>
                  <input type="text" className="form-input" value={formData.personal.website} onChange={(e) => handlePersonalChange('website', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Summary</label>
                  <textarea 
                    className="form-input" 
                    rows={4} 
                    value={formData.personal.summary} 
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    placeholder="Brief intro about your qualifications and key achievements..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Work Experience */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('experience')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>3. Work Experience ({formData.experience.length})</span>
              {expandedSection === 'experience' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'experience' && (
              <div style={{ padding: '1.25rem', background: '#fafbfc' }}>
                {formData.experience.map((exp, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#fff', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>Job #{idx + 1}</span>
                      <button onClick={() => removeArrayItem('experience', idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Job Role / Title</label>
                      <input type="text" className="form-input" value={exp.role} onChange={(e) => updateArrayItem('experience', idx, 'role', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input type="text" className="form-input" value={exp.company} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input type="text" className="form-input" placeholder="e.g. Jan 2022" value={exp.startDate} onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input type="text" className="form-input" placeholder="e.g. Present" value={exp.endDate} onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Job Description</label>
                      <textarea className="form-input" rows={3} value={exp.description} onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('experience', { role: '', company: '', location: '', startDate: '', endDate: '', description: '' })} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <Plus size={16} /> Add Work Experience
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Education */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('education')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>4. Education ({formData.education.length})</span>
              {expandedSection === 'education' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'education' && (
              <div style={{ padding: '1.25rem', background: '#fafbfc' }}>
                {formData.education.map((edu, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#fff', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>Education #{idx + 1}</span>
                      <button onClick={() => removeArrayItem('education', idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Degree / Program</label>
                      <input type="text" className="form-input" value={edu.degree} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">School / University</label>
                      <input type="text" className="form-input" value={edu.school} onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Graduation Date</label>
                        <input type="text" className="form-input" placeholder="e.g. May 2021" value={edu.gradDate} onChange={(e) => updateArrayItem('education', idx, 'gradDate', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">GPA / Grade Score</label>
                        <input type="text" className="form-input" placeholder="e.g. 3.8/4.0" value={edu.score} onChange={(e) => updateArrayItem('education', idx, 'score', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('education', { degree: '', school: '', location: '', gradDate: '', score: '' })} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <Plus size={16} /> Add Education Record
                </button>
              </div>
            )}
          </div>

          {/* Section 5: Projects */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('projects')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>5. Key Projects ({formData.projects.length})</span>
              {expandedSection === 'projects' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'projects' && (
              <div style={{ padding: '1.25rem', background: '#fafbfc' }}>
                {formData.projects.map((proj, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#fff', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>Project #{idx + 1}</span>
                      <button onClick={() => removeArrayItem('projects', idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Project Title</label>
                      <input type="text" className="form-input" value={proj.title} onChange={(e) => updateArrayItem('projects', idx, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Project Role / Headline</label>
                      <input type="text" className="form-input" value={proj.role} onChange={(e) => updateArrayItem('projects', idx, 'role', e.target.value)} placeholder="e.g. Lead Designer" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Technologies Used</label>
                      <input type="text" className="form-input" value={proj.technologies} onChange={(e) => updateArrayItem('projects', idx, 'technologies', e.target.value)} placeholder="e.g. React, Node.js, MongoDB" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-input" rows={2} value={proj.description} onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Project Link URL</label>
                      <input type="text" className="form-input" value={proj.link} onChange={(e) => updateArrayItem('projects', idx, 'link', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('projects', { title: '', role: '', technologies: '', description: '', link: '' })} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <Plus size={16} /> Add Project
                </button>
              </div>
            )}
          </div>

          {/* Section 6: Skills */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('skills')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>6. Skills & Expertise ({formData.skills.length})</span>
              {expandedSection === 'skills' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'skills' && (
              <div style={{ padding: '1.25rem', background: '#fafbfc' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 40px', gap: '0.5rem', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  <span>Skill Name</span>
                  <span>Proficiency (1-5)</span>
                  <span></span>
                </div>
                {formData.skills.map((skill, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 40px', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <input type="text" className="form-input" style={{ padding: '0.4rem 0.6rem' }} placeholder="e.g. JavaScript" value={skill.name} onChange={(e) => updateArrayItem('skills', idx, 'name', e.target.value)} />
                    <input type="number" min="1" max="5" className="form-input" style={{ padding: '0.4rem 0.6rem' }} value={skill.level} onChange={(e) => updateArrayItem('skills', idx, 'level', parseInt(e.target.value) || 3)} />
                    <button onClick={() => removeArrayItem('skills', idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('skills', { name: '', level: 3 })} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>
            )}
          </div>

          {/* Section 7: Certifications */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('certifications')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>7. Certifications ({formData.certifications.length})</span>
              {expandedSection === 'certifications' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'certifications' && (
              <div style={{ padding: '1.25rem', background: '#fafbfc' }}>
                {formData.certifications.map((cert, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#fff', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifycontent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>Certificate #{idx + 1}</span>
                      <button onClick={() => removeArrayItem('certifications', idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Certificate Title</label>
                      <input type="text" className="form-input" value={cert.title} onChange={(e) => updateArrayItem('certifications', idx, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Issuer</label>
                      <input type="text" className="form-input" value={cert.issuer} onChange={(e) => updateArrayItem('certifications', idx, 'issuer', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date Earned</label>
                      <input type="text" className="form-input" value={cert.date} onChange={(e) => updateArrayItem('certifications', idx, 'date', e.target.value)} placeholder="e.g. Nov 2023" />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('certifications', { title: '', issuer: '', date: '' })} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <Plus size={16} /> Add Certification
                </button>
              </div>
            )}
          </div>

          {/* Section 8: Special PDF Resource Links */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('links')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>8. Creative Blob Links ({formData.links.length})</span>
              {expandedSection === 'links' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'links' && (
              <div style={{ padding: '1.25rem', background: '#fafbfc' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Model links with custom shapes and icons inspired by the PDF layout links (Smiley, Video Play, and Menu icons).
                </p>
                {formData.links.map((link, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#fff', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>Link #{idx + 1}</span>
                      <button onClick={() => removeArrayItem('links', idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Link Label</label>
                      <input type="text" className="form-input" placeholder="e.g. My GitHub Projects" value={link.label} onChange={(e) => updateArrayItem('links', idx, 'label', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Link URL</label>
                      <input type="text" className="form-input" placeholder="https://..." value={link.url} onChange={(e) => updateArrayItem('links', idx, 'url', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Icon Type (matches PDF layouts)</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => updateArrayItem('links', idx, 'iconType', 'smiley')}
                          style={{
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            padding: '0.5rem', 
                            border: link.iconType === 'smiley' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            background: link.iconType === 'smiley' ? 'rgba(27,67,96,0.05)' : '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          <Smile size={18} style={{ color: 'var(--color-accent)' }} />
                          <span style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Smiley Blob</span>
                        </button>
                        <button 
                          onClick={() => updateArrayItem('links', idx, 'iconType', 'video')}
                          style={{
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            padding: '0.5rem', 
                            border: link.iconType === 'video' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            background: link.iconType === 'video' ? 'rgba(27,67,96,0.05)' : '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          <Play size={18} style={{ color: 'var(--color-secondary)' }} />
                          <span style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Play Blob</span>
                        </button>
                        <button 
                          onClick={() => updateArrayItem('links', idx, 'iconType', 'menu')}
                          style={{
                            flex: 1, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            padding: '0.5rem', 
                            border: link.iconType === 'menu' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            background: link.iconType === 'menu' ? 'rgba(27,67,96,0.05)' : '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          <List size={18} style={{ color: 'var(--color-primary)' }} />
                          <span style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Menu Blob</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addArrayItem('links', { label: '', url: '', iconType: 'smiley' })} 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <Plus size={16} /> Add Creative Link
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT PREVIEW PANE: Live Rendering */}
      <div className="preview-pane-container" style={{ 
        height: 'calc(100vh - 64px)', 
        overflowY: 'auto', 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        background: '#f1f5f9',
        position: 'relative'
      }}>
        {/* Float action banner */}
        <div className="no-print" style={{ 
          width: '100%', 
          maxWidth: '800px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem',
          background: '#fff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          {formData.template === 'slide' ? (
            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem' }}>Preview Slide:</span>
              {[0, 1, 2, 3, 4, 5].map((slideNum) => (
                <button 
                  key={slideNum}
                  onClick={() => setActiveSlide(slideNum)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: activeSlide === slideNum ? 'none' : '1px solid var(--color-border)',
                    background: activeSlide === slideNum ? 'var(--color-primary)' : '#fff',
                    color: activeSlide === slideNum ? '#fff' : 'var(--color-text-dark)',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {slideNum + 1}
                </button>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Scrollable page view active</span>
          )}

          <button onClick={triggerPrint} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <Printer size={14} /> Print PDF
          </button>
        </div>

        {/* The dynamic preview rendering */}
        <div style={{ width: '100%', maxWidth: '800px', flex: 1 }}>
          <ResumePreview data={formData} activeSlide={activeSlide} isInteractive={true} />
        </div>
      </div>
    </div>
  );
}
