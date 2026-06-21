import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquareText, X, Send, Sparkles, Copy, Check, ChevronRight, Briefcase, Award } from 'lucide-react';

export default function AIChatbot({ API_BASE }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'keywords'
  
  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI career assistant. How can I help you refine your resume or plan your next career move today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Keyword suggester state
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null); // { skills: [], keywords: [], bulletPoints: [] }
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Build history context (excluding the new user message we are sending)
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await axios.post(`${API_BASE}/ai/chat`, {
        message: userMsg.content,
        history: history
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to my server. Please try again in a moment.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleFetchKeywords = async (e) => {
    e.preventDefault();
    if (!company.trim() || !jobTitle.trim()) return;

    setKeywordLoading(true);
    setSuggestions(null);

    try {
      const res = await axios.post(`${API_BASE}/ai/suggest-keywords`, {
        company: company,
        jobTitle: jobTitle
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error('Keyword error:', err);
      alert('Failed to generate suggestions. Please ensure the API is reachable.');
    } finally {
      setKeywordLoading(false);
    }
  };

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      });
  };

  return (
    <div className="no-print" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
            e.currentTarget.style.background = 'var(--color-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.background = 'var(--color-primary)';
          }}
          title="AI Career Assistant"
        >
          <MessageSquareText size={28} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-secondary)',
            border: '2px solid var(--color-bg)'
          }} />
        </button>
      )}

      {/* Chat Drawer/Panel */}
      {isOpen && (
        <div className="glass-panel animate-slide-up" style={{
          width: '380px',
          height: '520px',
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontWeight: 800, fontFamily: 'var(--font-header)', fontSize: '1rem' }}>AI Career Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', background: 'rgba(27,67,96,0.02)' }}>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                color: activeTab === 'chat' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'chat' ? '2.5px solid var(--color-primary)' : 'none',
                fontFamily: 'var(--font-header)'
              }}
            >
              💬 General Assistant
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: 'transparent',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                color: activeTab === 'keywords' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'keywords' ? '2.5px solid var(--color-primary)' : 'none',
                fontFamily: 'var(--font-header)'
              }}
            >
              ✨ Keyword Suggester
            </button>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            
            {/* Tab 1: Chat Assistant */}
            {activeTab === 'chat' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingBottom: '0.5rem' }}>
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '0.7rem 0.9rem',
                        borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        background: m.role === 'user' ? 'var(--color-primary)' : 'rgba(27,67,96,0.05)',
                        color: m.role === 'user' ? '#fff' : 'var(--color-text-dark)',
                        fontSize: '0.85rem',
                        lineHeight: 1.45,
                        boxShadow: 'var(--shadow-sm)',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {m.content}
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ alignSelf: 'flex-start', background: 'rgba(27,67,96,0.05)', padding: '0.7rem 0.9rem', borderRadius: '12px 12px 12px 2px', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--color-text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out' }} />
                      <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--color-text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }} />
                      <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--color-text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }} />
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={chatLoading}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem',
                      background: 'var(--color-card-bg)',
                      color: 'var(--color-text-dark)',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    style={{
                      background: 'var(--color-primary)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}

            {/* Tab 2: Keyword / Skill Suggester */}
            {activeTab === 'keywords' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                <form onSubmit={handleFetchKeywords} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '0.25rem', display: 'block' }}>Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Google"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', background: 'var(--color-card-bg)', color: 'var(--color-text-dark)' }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '0.25rem', display: 'block' }}>Job Post Title</label>
                      <input
                        type="text"
                        placeholder="e.g. UX Designer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', background: 'var(--color-card-bg)', color: 'var(--color-text-dark)' }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={keywordLoading || !company || !jobTitle}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    {keywordLoading ? (
                      <>
                        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Generate Core Suggestions
                      </>
                    )}
                  </button>
                </form>

                {/* Suggestions display block */}
                {suggestions && (
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    
                    {/* Skills suggested */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        <Award size={13} style={{ color: 'var(--color-secondary)' }} />
                        <span>Recommended Skills</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {suggestions.skills?.map((skill, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleCopyText(skill, `skill-${idx}`)}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                              background: 'rgba(27,67,96,0.06)',
                              color: 'var(--color-primary)',
                              border: '1px solid var(--color-border)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontWeight: 600,
                              transition: 'all 0.2s'
                            }}
                            title="Click to copy"
                          >
                            {copiedIndex === `skill-${idx}` ? <Check size={11} style={{ color: 'var(--color-success)' }} /> : null}
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Keywords suggested */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        <Briefcase size={13} style={{ color: 'var(--color-secondary)' }} />
                        <span>Keywords for ATS</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {suggestions.keywords?.map((kw, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleCopyText(kw, `kw-${idx}`)}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                              background: 'rgba(224, 122, 95, 0.08)',
                              color: 'var(--color-secondary)',
                              border: '1px solid rgba(224, 122, 95, 0.15)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontWeight: 600,
                              transition: 'all 0.2s'
                            }}
                            title="Click to copy"
                          >
                            {copiedIndex === `kw-${idx}` ? <Check size={11} style={{ color: 'var(--color-success)' }} /> : null}
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommended action bullets */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        Suggested Bullet Points
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {suggestions.bulletPoints?.map((bp, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.6rem 0.8rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(27,67,96,0.02)',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.75rem',
                              lineHeight: 1.4,
                              color: 'var(--color-text-dark)',
                              position: 'relative',
                              display: 'flex',
                              gap: '0.5rem',
                              alignItems: 'flex-start'
                            }}
                          >
                            <ChevronRight size={14} style={{ color: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ flex: 1, paddingRight: '1.5rem' }}>{bp}</span>
                            <button
                              onClick={() => handleCopyText(bp, `bp-${idx}`)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: copiedIndex === `bp-${idx}` ? 'var(--color-success)' : 'var(--color-text-muted)',
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                padding: 0
                              }}
                              title="Copy bullet point"
                            >
                              {copiedIndex === `bp-${idx}` ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
