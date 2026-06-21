import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumePreview from './ResumePreview';
import { ArrowLeft, Save, Printer, Plus, Trash2, ChevronDown, ChevronUp, AlertCircle, Share2, Award, Briefcase, GraduationCap, Link2, Smile, Play, List, Sparkles, CheckCircle, UploadCloud, FileText } from 'lucide-react';

export default function ResumeEditor({ id, onBack, API_BASE, userId }) {
  const [formData, setFormData] = useState({
    title: 'My Professional Resume',
    template: 'slide',
    colorTheme: 'default',
    fontSizeScale: 14,
    spacingScale: 1.5,
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Accordion state
  const [expandedSection, setExpandedSection] = useState('metadata');
  
  // Input highlight tracking
  const [activeHighlightField, setActiveHighlightField] = useState(null);

  // AI Resume Generator states
  const [generatorLoading, setGeneratorLoading] = useState(false);
  const [genJobTitle, setGenJobTitle] = useState('');
  const [genCompany, setGenCompany] = useState('');
  const [genBackground, setGenBackground] = useState('');

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

  const calculateCompletenessScore = () => {
    let score = 0;
    let details = [];

    // Personal info (max 30 points)
    let personalScore = 0;
    if (formData.personal?.fullName) personalScore += 10;
    if (formData.personal?.email) personalScore += 5;
    if (formData.personal?.phone) personalScore += 5;
    if (formData.personal?.summary) personalScore += 10;
    score += personalScore;
    if (personalScore < 30) details.push('Complete personal info details & professional summary.');

    // Work Experience (max 30 points)
    let expCount = formData.experience?.filter(e => e.role && e.company).length || 0;
    let expScore = Math.min(expCount * 15, 30);
    score += expScore;
    if (expScore < 30) details.push('Add at least 2 complete work experience entries.');

    // Education (max 20 points)
    let eduCount = formData.education?.filter(e => e.school && e.degree).length || 0;
    let eduScore = Math.min(eduCount * 10, 20);
    score += eduScore;
    if (eduScore < 20) details.push('Add at least 2 complete educational records.');

    // Skills (max 20 points)
    let skillCount = formData.skills?.filter(s => s.name).length || 0;
    let skillScore = Math.min(skillCount * 4, 20);
    score += skillScore;
    if (skillScore < 20) details.push('Add at least 5 key technical/soft skills.');

    return { score, details };
  };

  const [enhancingField, setEnhancingField] = useState(null);

  const handleEnhanceText = async (fieldKey, currentText, type, onUpdate) => {
    if (!currentText || currentText.trim() === '') {
      alert('Please enter some text first before trying to enhance it.');
      return;
    }
    
    try {
      setEnhancingField(fieldKey);
      const res = await axios.post(`${API_BASE}/ai/enhance`, {
        text: currentText,
        type: type
      });
      if (res.data?.enhancedText) {
        onUpdate(res.data.enhancedText);
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      alert('AI Enhancement failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setEnhancingField(null);
    }
  };

  // Upload/parsing states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataPayload = new FormData();
    formDataPayload.append('resume', file);

    setUploadLoading(true);
    setExtractedData(null);

    try {
      const res = await axios.post(`${API_BASE}/ai/extract-resume`, formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setExtractedData(res.data);
      alert('Resume parsed successfully! Review the extracted details below and click Merge into Draft.');
    } catch (err) {
      console.error('File upload error:', err);
      alert('Failed to parse resume: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleMergeExtractedData = () => {
    if (!extractedData) return;

    const newPersonal = { ...formData.personal };
    if (!newPersonal.fullName && extractedData.fullName) newPersonal.fullName = extractedData.fullName;
    if (!newPersonal.email && extractedData.email) newPersonal.email = extractedData.email;
    if (!newPersonal.phone && extractedData.phone) newPersonal.phone = extractedData.phone;
    
    const currentSkillsNames = new Set(formData.skills.map(s => s.name.toLowerCase().trim()));
    const newSkills = [...formData.skills];
    
    if (extractedData.skills && Array.isArray(extractedData.skills)) {
      extractedData.skills.forEach(skillName => {
        const cleanName = skillName.trim();
        if (cleanName && !currentSkillsNames.has(cleanName.toLowerCase())) {
          newSkills.push({ name: cleanName, level: 4 });
          currentSkillsNames.add(cleanName.toLowerCase());
        }
      });
    }

    setFormData({
      ...formData,
      personal: newPersonal,
      skills: newSkills
    });

    setExtractedData(null);
    alert('Extracted details merged into your draft successfully!');
  };

  const handleGenerateResume = async () => {
    if (!genJobTitle.trim()) {
      alert('Please enter a target job title to generate your resume.');
      return;
    }

    setGeneratorLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/ai/generate-resume`, {
        jobTitle: genJobTitle,
        company: genCompany,
        background: genBackground
      });

      if (res.data) {
        // Map the generated skills if they are in simple format (strings instead of {name, level})
        const mappedSkills = (res.data.skills || []).map(s => {
          if (typeof s === 'string') {
            return { name: s, level: 4 };
          }
          return { name: s.name || '', level: s.level || 4 };
        });

        // Set form data with the generated resume and preserve metadata fields
        setFormData(prev => ({
          ...prev,
          title: res.data.title || prev.title,
          personal: {
            ...prev.personal,
            ...(res.data.personal || {})
          },
          experience: res.data.experience || [],
          education: res.data.education || [],
          skills: mappedSkills,
          projects: res.data.projects || []
        }));

        alert('Success! Gemini AI has generated a complete professional resume for you. Review the fields and save your draft.');
        // Expand the personal section to show the new content
        setExpandedSection('personal');
      }
    } catch (err) {
      console.error('Resume generation error:', err);
      alert('Failed to generate resume: ' + (err.response?.data?.error || err.message));
    } finally {
      setGeneratorLoading(false);
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
      
      const payload = {
        ...formData,
        userId: userId
      };

      if (id) {
        // Update existing
        await axios.put(`${API_BASE}/resumes/${id}`, payload);
      } else {
        // Create new
        const res = await axios.post(`${API_BASE}/resumes`, payload);
        // Switch to the newly created resume ID so we can keep updating it
        formData._id = res.data._id;
        window.location.hash = `#/editor/${res.data._id}`;
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
        background: 'var(--color-card-bg)', 
        borderRight: '1px solid var(--color-border)', 
        height: 'calc(100vh - 64px)', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 10
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent' }}>
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

        {/* Resume Score Checker widget */}
        {(() => {
          const { score, details } = calculateCompletenessScore();
          return (
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--color-border)',
              background: 'rgba(27, 67, 96, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                  Resume Completeness Score
                </span>
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: 800, 
                  color: score >= 80 ? 'var(--color-success)' : score >= 50 ? 'var(--color-secondary)' : '#b91c1c',
                  background: score >= 80 ? 'rgba(129, 178, 154, 0.12)' : score >= 50 ? 'rgba(224, 122, 95, 0.1)' : 'rgba(239, 68, 68, 0.08)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: score >= 80 ? '1px solid rgba(129, 178, 154, 0.25)' : score >= 50 ? '1px solid rgba(224, 122, 95, 0.2)' : '1px solid rgba(239, 68, 68, 0.15)'
                }}>
                  {score}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(27, 67, 96, 0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${score}%`, 
                  height: '100%', 
                  background: score >= 80 ? 'var(--color-success)' : score >= 50 ? 'var(--color-secondary)' : '#ef4444', 
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease-in-out' 
                }} />
              </div>

              {/* Quick Tip / Next Steps */}
              {details.length > 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles size={12} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                  <span>Next: {details[0]}</span>
                </p>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={12} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                  <span>Perfect! Your resume is ready to share.</span>
                </p>
              )}
            </div>
          );
        })()}

        {/* Form Body - Accordions */}
        <div style={{ flex: 1, paddingBottom: '3rem' }}>
          
          {/* Section 0: AI Resume Importer */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('importer')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={16} style={{ color: 'var(--color-secondary)' }} />
                <span>AI Resume Importer (PDF/TXT)</span>
              </span>
              {expandedSection === 'importer' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'importer' && (
              <div style={{ padding: '1.25rem', background: 'var(--color-card-bg)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  Have an existing resume? Upload it (PDF/TXT) to let Gemini AI extract contact info and skills, then merge them directly into your current editor draft!
                </p>

                {/* Upload Area */}
                {!uploadLoading && !extractedData && (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(27,67,96,0.01)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(27,67,96,0.03)';
                    e.currentTarget.style.borderColor = 'var(--color-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(27,67,96,0.01)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                  >
                    <UploadCloud size={32} style={{ color: 'var(--color-secondary)', marginBottom: '0.75rem' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>Upload Resume File</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Supports PDF, TXT (Max 5MB)</span>
                    <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                )}

                {/* Loading state */}
                {uploadLoading && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ 
                      display: 'inline-block', 
                      width: '30px', 
                      height: '30px', 
                      border: '3px solid rgba(27, 67, 96, 0.1)', 
                      borderTopColor: 'var(--color-primary)', 
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>AI is extracting keywords...</p>
                  </div>
                )}

                {/* Result state */}
                {extractedData && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', background: 'rgba(27,67,96,0.02)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                      <span>Extracted Profile Data</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                      {extractedData.fullName && <div><strong>Name:</strong> {extractedData.fullName}</div>}
                      {extractedData.email && <div><strong>Email:</strong> {extractedData.email}</div>}
                      {extractedData.phone && <div><strong>Phone:</strong> {extractedData.phone}</div>}
                    </div>

                    {extractedData.skills && extractedData.skills.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Extracted Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {extractedData.skills.map((skill, idx) => (
                            <span key={idx} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)', fontWeight: 600 }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => setExtractedData(null)} 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                      >
                        Discard
                      </button>
                      <button 
                        onClick={handleMergeExtractedData} 
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        Merge into Draft
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 0.5: AI Resume Generator */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('generator')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={16} style={{ color: 'var(--color-secondary)' }} />
                <span>AI Resume Generator (From Scratch)</span>
              </span>
              {expandedSection === 'generator' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSection === 'generator' && (
              <div style={{ padding: '1.25rem', background: 'var(--color-card-bg)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  Enter your target role and brief background to let Gemini AI generate a complete, high-impact resume draft (summary, jobs, skills, education, and projects) instantly.
                </p>

                {!generatorLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Target Job Title *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Senior Frontend Engineer"
                        value={genJobTitle}
                        onChange={(e) => setGenJobTitle(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Target Company (Optional)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Google"
                        value={genCompany}
                        onChange={(e) => setGenCompany(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Your Background & Key Tech (Optional)</label>
                      <textarea 
                        className="form-input" 
                        rows={3}
                        placeholder="e.g. 5+ years building React/Node apps. Expert in state management, TypeScript, and AWS cloud migrations."
                        value={genBackground}
                        onChange={(e) => setGenBackground(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', resize: 'vertical' }}
                      />
                    </div>

                    <button 
                      onClick={handleGenerateResume}
                      className="btn btn-primary"
                      style={{ 
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Sparkles size={16} />
                      Generate Complete Resume
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ 
                      display: 'inline-block', 
                      width: '30px', 
                      height: '30px', 
                      border: '3px solid rgba(27, 67, 96, 0.1)', 
                      borderTopColor: 'var(--color-secondary)', 
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 800 }}>
                      Gemini AI is writing your resume...
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      This may take 10-15 seconds. Please do not close the window.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Section 1: Resume Metadata */}
          <div style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="accordion-header" onClick={() => toggleSection('metadata')}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>1. Style & Settings</span>
              {expandedSection === 'metadata' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            
            {expandedSection === 'metadata' && (
              <div style={{ padding: '1.25rem', background: 'var(--color-card-bg)' }}>
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

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                    <span>Base Font Size:</span>
                    <span style={{ fontWeight: 700 }}>{formData.fontSizeScale || 14}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="11" 
                    max="18" 
                    step="1" 
                    style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    value={formData.fontSizeScale || 14} 
                    onChange={(e) => setFormData({ ...formData, fontSizeScale: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                    <span>Section Spacing:</span>
                    <span style={{ fontWeight: 700 }}>{formData.spacingScale || 1.5}rem</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.8" 
                    max="3.0" 
                    step="0.1" 
                    style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    value={formData.spacingScale || 1.5} 
                    onChange={(e) => setFormData({ ...formData, spacingScale: parseFloat(e.target.value) })}
                  />
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
              <div style={{ padding: '1.25rem', background: 'var(--color-card-bg)' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.personal.fullName} 
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)} 
                    onFocus={() => setActiveHighlightField('personal')}
                    onBlur={() => setActiveHighlightField(null)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Headline</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.personal.title} 
                    onChange={(e) => handlePersonalChange('title', e.target.value)} 
                    placeholder="e.g. Senior Frontend Developer" 
                    onFocus={() => setActiveHighlightField('personal')}
                    onBlur={() => setActiveHighlightField(null)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={formData.personal.email} 
                    onChange={(e) => handlePersonalChange('email', e.target.value)} 
                    onFocus={() => setActiveHighlightField('personal')}
                    onBlur={() => setActiveHighlightField(null)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.personal.phone} 
                    onChange={(e) => handlePersonalChange('phone', e.target.value)} 
                    onFocus={() => setActiveHighlightField('personal')}
                    onBlur={() => setActiveHighlightField(null)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location / City</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.personal.location} 
                    onChange={(e) => handlePersonalChange('location', e.target.value)} 
                    placeholder="e.g. San Francisco, CA" 
                    onFocus={() => setActiveHighlightField('personal')}
                    onBlur={() => setActiveHighlightField(null)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Portfolio Website URL</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.personal.website} 
                    onChange={(e) => handlePersonalChange('website', e.target.value)} 
                    onFocus={() => setActiveHighlightField('personal')}
                    onBlur={() => setActiveHighlightField(null)}
                  />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Professional Summary</label>
                    <button 
                      type="button"
                      disabled={enhancingField === 'summary'}
                      onClick={() => handleEnhanceText('summary', formData.personal.summary, 'summary', (enhanced) => handlePersonalChange('summary', enhanced))}
                      style={{ background: 'rgba(224, 122, 95, 0.1)', color: 'var(--color-secondary)', border: 'none', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', cursor: enhancingField === 'summary' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}
                    >
                      <Sparkles size={11} style={{ animation: enhancingField === 'summary' ? 'spin 1s linear infinite' : 'none' }} />
                      {enhancingField === 'summary' ? 'Enhancing...' : 'Auto-Enhance'}
                    </button>
                  </div>
                  <textarea 
                    className="form-input" 
                    rows={4} 
                    value={formData.personal.summary} 
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    placeholder="Brief intro about your qualifications and key achievements..."
                    onFocus={() => setActiveHighlightField('personal')}
                    onBlur={() => setActiveHighlightField(null)}
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
              <div style={{ padding: '1.25rem', background: 'var(--color-card-bg)' }}>
                {formData.experience.map((exp, idx) => (
                  <div key={idx} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg)', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>Job #{idx + 1}</span>
                      <button onClick={() => removeArrayItem('experience', idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Job Role / Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={exp.role} 
                        onChange={(e) => updateArrayItem('experience', idx, 'role', e.target.value)} 
                        onFocus={() => setActiveHighlightField('experience-' + idx)}
                        onBlur={() => setActiveHighlightField(null)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={exp.company} 
                        onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} 
                        onFocus={() => setActiveHighlightField('experience-' + idx)}
                        onBlur={() => setActiveHighlightField(null)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. Jan 2022" 
                          value={exp.startDate} 
                          onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)} 
                          onFocus={() => setActiveHighlightField('experience-' + idx)}
                          onBlur={() => setActiveHighlightField(null)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. Present" 
                          value={exp.endDate} 
                          onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)} 
                          onFocus={() => setActiveHighlightField('experience-' + idx)}
                          onBlur={() => setActiveHighlightField(null)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label className="form-label" style={{ margin: 0 }}>Job Description</label>
                        <button 
                          type="button"
                          disabled={enhancingField === `experience-${idx}`}
                          onClick={() => handleEnhanceText(`experience-${idx}`, exp.description, 'experience', (enhanced) => updateArrayItem('experience', idx, 'description', enhanced))}
                          style={{ background: 'rgba(224, 122, 95, 0.1)', color: 'var(--color-secondary)', border: 'none', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', cursor: enhancingField === `experience-${idx}` ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}
                        >
                          <Sparkles size={11} style={{ animation: enhancingField === `experience-${idx}` ? 'spin 1s linear infinite' : 'none' }} />
                          {enhancingField === `experience-${idx}` ? 'Enhancing...' : 'Auto-Enhance'}
                        </button>
                      </div>
                      <textarea 
                        className="form-input" 
                        rows={3} 
                        value={exp.description} 
                        onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value)} 
                        onFocus={() => setActiveHighlightField('experience-' + idx)}
                        onBlur={() => setActiveHighlightField(null)}
                      />
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label className="form-label" style={{ margin: 0 }}>Description</label>
                        <button 
                          type="button"
                          disabled={enhancingField === `project-${idx}`}
                          onClick={() => handleEnhanceText(`project-${idx}`, proj.description, 'project', (enhanced) => updateArrayItem('projects', idx, 'description', enhanced))}
                          style={{ background: 'rgba(224, 122, 95, 0.1)', color: 'var(--color-secondary)', border: 'none', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', cursor: enhancingField === `project-${idx}` ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}
                        >
                          <Sparkles size={11} style={{ animation: enhancingField === `project-${idx}` ? 'spin 1s linear infinite' : 'none' }} />
                          {enhancingField === `project-${idx}` ? 'Enhancing...' : 'Auto-Enhance'}
                        </button>
                      </div>
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
        background: 'var(--color-bg)',
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
          background: 'var(--color-card-bg)',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)'
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            {formData.template === 'slide' ? 'Creative A4 Document Layout' : formData.template === 'modern' ? 'Modern Professional Two-Column' : 'Minimalist Classic Serif'}
          </span>

          <button onClick={triggerPrint} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <Printer size={14} /> Print PDF
          </button>
        </div>

        {/* The dynamic preview rendering */}
        <div style={{ width: '100%', maxWidth: '800px', flex: 1 }}>
          <ResumePreview data={formData} activeHighlightField={activeHighlightField} activeSlide={0} isInteractive={false} />
        </div>
      </div>
    </div>
  );
}
