import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, MessageSquare, Bug, ChevronDown, ChevronUp, Send, CheckCircle, Sun, Moon, Brain } from 'lucide-react';

const FAQS = [
  { q: 'How does the AI interviewer work?', a: 'It uses an AI model that adapts questions based on your answers — just like a real interviewer. It gets harder when you do well and easier when you struggle.' },
  { q: 'What interview types are available?', a: 'DSA, System Design, Technical, Behavioral, and Mixed rounds. You can choose when setting up your session.' },
  { q: 'Are my sessions saved?', a: 'Yes, all completed sessions are saved and accessible from your History page with full score reports.' },
  { q: 'Can I upload my resume?', a: 'Yes! Upload your resume (PDF, DOCX, or TXT) during setup and the AI will ask questions based on your specific projects and tech stack.' },
  { q: 'How is my score calculated?', a: 'You are scored on technical accuracy, problem solving, communication clarity, and confidence. A final verdict of Selected, Borderline, or Rejected is given.' },
  { q: 'Can I download my report?', a: 'Yes! After completing an interview, click "Download PDF" on the report page to get a professional PDF report.' },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--color-warning)' }} /> : <Moon size={16} style={{ color: 'var(--color-text-secondary)' }} />}
    </button>
  );
}

export default function Contact() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('contact');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', message: '' });
  const [bugForm, setBugForm] = useState({ name: user?.name || '', email: user?.email || '', title: '', steps: '', expected: '' });
  const [submitted, setSubmitted] = useState(false);
  const [bugSubmitted, setBugSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleContact = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/contact/message', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setSubmitted(true); setForm({ name: '', email: '', message: '' }); }
      else setError(data.error);
    } catch { setError('Cannot connect to server.'); }
    setLoading(false);
  };

  const handleBug = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/contact/bug', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: bugForm.name, email: bugForm.email, bugTitle: bugForm.title, steps: bugForm.steps, expected: bugForm.expected }),
      });
      const data = await res.json();
      if (data.success) { setBugSubmitted(true); setBugForm({ name: '', email: '', title: '', steps: '', expected: '' }); }
      else setError(data.error);
    } catch { setError('Cannot connect to server.'); }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Nav */}
      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> Home
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>AI Interviewer</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Contact & <span className="gradient-text">Support</span>
          </h1>
          <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>Have a question or found a bug? We'd love to hear from you.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-10">
          {[['contact', 'Contact Us', Mail], ['bug', 'Report Bug', Bug], ['faq', 'FAQ', MessageSquare]].map(([key, label, Icon]) => (
            <button key={key} onClick={() => { setTab(key); setError(''); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: tab === key ? 'var(--color-accent)' : 'var(--color-surface)',
                color: tab === key ? 'white' : 'var(--color-text-secondary)',
                border: `1px solid ${tab === key ? 'var(--color-accent)' : 'var(--color-border)'}`,
              }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm max-w-lg mx-auto" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>
            {error}
          </div>
        )}

        {/* CONTACT */}
        {tab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card p-8">
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Send a message</h2>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(52,199,89,0.1)' }}>
                    <CheckCircle size={28} style={{ color: 'var(--color-success)' }} />
                  </div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--color-success)' }}>Message sent!</p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Thanks for reaching out. We'll get back to you soon.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary px-6 py-2.5 text-sm">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Your Name</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className={inputClass} placeholder="John Doe"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className={inputClass} placeholder="you@example.com"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      className={inputClass} placeholder="Write your message..."
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ opacity: loading ? 0.7 : 1 }}>
                    <Send size={14} /> {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-4">
              <div className="card p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--color-accent-light)' }}>
                  <Mail size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Email Us</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>For general questions and support</p>
                <a href="mailto:hr4778336@gmail.com" className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>hr4778336@gmail.com</a>
              </div>
              <div className="card p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--color-accent-light)' }}>
                  <Bug size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Found a Bug?</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>Use the Bug Report tab to describe what went wrong.</p>
                <button onClick={() => setTab('bug')} className="text-sm font-medium" style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Report a bug →</button>
              </div>
              <div className="card p-6">
                <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Response Time</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Usually within 24–48 hours on weekdays.</p>
              </div>
            </div>
          </div>
        )}

        {/* BUG REPORT */}
        {tab === 'bug' && (
          <div className="card p-8 max-w-xl mx-auto">
            <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Report a Bug</h2>
            {bugSubmitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(52,199,89,0.1)' }}>
                  <CheckCircle size={28} style={{ color: 'var(--color-success)' }} />
                </div>
                <p className="font-semibold mb-1" style={{ color: 'var(--color-success)' }}>Bug reported!</p>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Thanks for helping improve the app.</p>
                <button onClick={() => setBugSubmitted(false)} className="btn-secondary px-6 py-2.5 text-sm">Report another</button>
              </div>
            ) : (
              <form onSubmit={handleBug} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Your Name</label>
                    <input value={bugForm.name} onChange={e => setBugForm({ ...bugForm, name: e.target.value })}
                      className={inputClass} placeholder="Optional"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Email</label>
                    <input type="email" value={bugForm.email} onChange={e => setBugForm({ ...bugForm, email: e.target.value })}
                      className={inputClass} placeholder="Optional"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Bug Title *</label>
                  <input required value={bugForm.title} onChange={e => setBugForm({ ...bugForm, title: e.target.value })}
                    className={inputClass} placeholder="e.g. Interview doesn't start after setup"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Steps to Reproduce *</label>
                  <textarea required rows={4} value={bugForm.steps} onChange={e => setBugForm({ ...bugForm, steps: e.target.value })}
                    className={inputClass} placeholder={"1. Go to Setup\n2. Click Start\n3. ..."}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Expected Behavior</label>
                  <textarea rows={3} value={bugForm.expected} onChange={e => setBugForm({ ...bugForm, expected: e.target.value })}
                    className={inputClass} placeholder="What should have happened..."
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ opacity: loading ? 0.7 : 1 }}>
                  <Bug size={14} /> {loading ? 'Submitting...' : 'Submit Bug Report'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* FAQ */}
        {tab === 'faq' && (
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <span className="font-medium text-sm pr-4" style={{ color: 'var(--color-text-primary)' }}>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    : <ChevronDown size={16} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}