import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, ArrowLeft, Upload, X, CheckCircle2, Briefcase, Code2, Layers, Users, PlayCircle, Trash2, Sun, Moon, Brain, Globe, Sparkles } from 'lucide-react';

const ROLES = ['Software Engineer','Frontend Engineer','Backend Engineer','Full Stack Engineer','Data Engineer','ML Engineer','DevOps / SRE','Product Manager'];
const EXPERIENCES = ['Fresher (0–1 yrs)','Junior (1–3 yrs)','Mid-level (3–6 yrs)','Senior (6–10 yrs)','Staff / Principal (10+ yrs)'];
const DIFFICULTIES = ['Easy','Medium','Hard','FAANG-level'];
const INTERVIEW_TYPES = [
  { id: 'dsa', label: 'DSA / Coding', icon: Code2, desc: 'Arrays, trees, graphs, DP', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'system', label: 'System Design', icon: Layers, desc: 'Scalability, architecture', gradient: 'from-green-500 to-emerald-500' },
  { id: 'technical', label: 'Technical', icon: Briefcase, desc: 'Core CS, databases, OS', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'behavioral', label: 'Behavioral', icon: Users, desc: 'Leadership, conflict, STAR', gradient: 'from-pink-500 to-rose-500' },
  { id: 'mixed', label: 'Mixed (All)', icon: CheckCircle2, desc: 'Full loop interview', gradient: 'from-purple-500 to-violet-500' },
];
const QUESTION_COUNTS = ['3','5','8','10'];
const LANGUAGES = [
  { code: 'English', label: 'English', flag: '🇬🇧' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'Bengali', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'Tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'Telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'Marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'Kannada', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'Malayalam', label: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'Punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'Odia', label: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
  { code: 'Urdu', label: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'Spanish', label: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'French', label: 'Français (French)', flag: '🇫🇷' },
  { code: 'German', label: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'Japanese', label: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'Korean', label: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'Chinese', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'Arabic', label: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'Portuguese', label: 'Português (Portuguese)', flag: '🇧🇷' },
];

const TEMPLATES = [
  { id: 'google-sde1', name: 'Google L3 (SDE-1)', company: 'Google', emoji: '🟢', role: 'Software Engineer', experience: 'Junior (1–3 yrs)', difficulty: 'Hard', type: 'mixed', questions: '8' },
  { id: 'google-sde2', name: 'Google L4 (SDE-2)', company: 'Google', emoji: '🟢', role: 'Software Engineer', experience: 'Mid-level (3–6 yrs)', difficulty: 'FAANG-level', type: 'mixed', questions: '10' },
  { id: 'amazon-sde1', name: 'Amazon SDE-1', company: 'Amazon', emoji: '🟠', role: 'Software Engineer', experience: 'Junior (1–3 yrs)', difficulty: 'Hard', type: 'mixed', questions: '8' },
  { id: 'amazon-backend', name: 'Amazon Backend', company: 'Amazon', emoji: '🟠', role: 'Backend Engineer', experience: 'Mid-level (3–6 yrs)', difficulty: 'Hard', type: 'technical', questions: '8' },
  { id: 'meta-frontend', name: 'Meta Frontend', company: 'Meta', emoji: '🔵', role: 'Frontend Engineer', experience: 'Mid-level (3–6 yrs)', difficulty: 'FAANG-level', type: 'mixed', questions: '8' },
  { id: 'meta-sde', name: 'Meta E4 (SDE-2)', company: 'Meta', emoji: '🔵', role: 'Software Engineer', experience: 'Mid-level (3–6 yrs)', difficulty: 'FAANG-level', type: 'mixed', questions: '10' },
  { id: 'microsoft-sde', name: 'Microsoft SDE', company: 'Microsoft', emoji: '🟦', role: 'Software Engineer', experience: 'Junior (1–3 yrs)', difficulty: 'Hard', type: 'mixed', questions: '8' },
  { id: 'apple-swe', name: 'Apple SWE', company: 'Apple', emoji: '⚪', role: 'Software Engineer', experience: 'Mid-level (3–6 yrs)', difficulty: 'Hard', type: 'technical', questions: '8' },
  { id: 'flipkart-sde1', name: 'Flipkart SDE-1', company: 'Flipkart', emoji: '🟡', role: 'Software Engineer', experience: 'Fresher (0–1 yrs)', difficulty: 'Medium', type: 'mixed', questions: '8' },
  { id: 'flipkart-backend', name: 'Flipkart Backend', company: 'Flipkart', emoji: '🟡', role: 'Backend Engineer', experience: 'Junior (1–3 yrs)', difficulty: 'Hard', type: 'technical', questions: '8' },
  { id: 'startup-fullstack', name: 'Startup Full Stack', company: 'Startup', emoji: '🚀', role: 'Full Stack Engineer', experience: 'Junior (1–3 yrs)', difficulty: 'Medium', type: 'mixed', questions: '5' },
  { id: 'dsa-easy', name: 'DSA Practice (Easy)', company: 'Practice', emoji: '📝', role: 'Software Engineer', experience: 'Fresher (0–1 yrs)', difficulty: 'Easy', type: 'dsa', questions: '5' },
  { id: 'dsa-hard', name: 'DSA Grind (Hard)', company: 'Practice', emoji: '🔥', role: 'Software Engineer', experience: 'Mid-level (3–6 yrs)', difficulty: 'Hard', type: 'dsa', questions: '8' },
  { id: 'system-design', name: 'System Design Deep', company: 'Practice', emoji: '🏗️', role: 'Software Engineer', experience: 'Senior (6–10 yrs)', difficulty: 'Hard', type: 'system', questions: '5' },
  { id: 'behavioral-prep', name: 'Behavioral Prep', company: 'Practice', emoji: '🗣️', role: 'Software Engineer', experience: 'Mid-level (3–6 yrs)', difficulty: 'Medium', type: 'behavioral', questions: '5' },
  { id: 'pm-interview', name: 'Product Manager', company: 'Any', emoji: '📊', role: 'Product Manager', experience: 'Mid-level (3–6 yrs)', difficulty: 'Medium', type: 'mixed', questions: '8' },
  { id: 'ml-engineer', name: 'ML Engineer', company: 'Any', emoji: '🤖', role: 'ML Engineer', experience: 'Mid-level (3–6 yrs)', difficulty: 'Hard', type: 'technical', questions: '8' },
  { id: 'devops-sre', name: 'DevOps / SRE', company: 'Any', emoji: '⚙️', role: 'DevOps / SRE', experience: 'Mid-level (3–6 yrs)', difficulty: 'Medium', type: 'technical', questions: '5' },
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

export default function Setup() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [config, setConfig] = useState({ role:'', experience:'', difficulty:'Hard', type:'mixed', questions:'8', language:'English', resume:null, resumeText:'' });
  const [dragging, setDragging] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateFilter, setTemplateFilter] = useState('all');
  const set = (k, v) => setConfig(p => ({ ...p, [k]: v }));

  useEffect(() => {
    const savedSessionId = localStorage.getItem('activeInterviewSessionId');
    if (!savedSessionId) return;
    fetch(`/api/interview/session/${savedSessionId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.session && data.session.status === 'in_progress') setActiveSession(data.session);
        else localStorage.removeItem('activeInterviewSessionId');
      })
      .catch(() => localStorage.removeItem('activeInterviewSessionId'));
  }, []);

  const resumeInterview = () => navigate('/interview');

  const discardSession = async () => {
    if (!activeSession) return;
    try { await fetch(`/api/interview/session/${activeSession.sessionId}`, { method: 'DELETE', credentials: 'include' }); } catch {}
    localStorage.removeItem('activeInterviewSessionId');
    setActiveSession(null);
  };

  const handleFile = async (file) => {
    if (!file) return;
    set('resume', file);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await fetch('/api/interview/upload-resume', { method: 'POST', body: formData, credentials: 'include' });
      const data = await res.json();
      if (data.success) set('resumeText', data.resumeText);
      else { alert(data.error || 'Failed to parse resume.'); set('resume', null); }
    } catch { alert('Failed to upload resume.'); set('resume', null); }
    setUploading(false);
  };

  const applyTemplate = (template) => {
    setConfig(prev => ({
      ...prev,
      role: template.role,
      experience: template.experience,
      difficulty: template.difficulty,
      type: template.type,
      questions: template.questions,
    }));
    setShowTemplates(false);
    // Jump to step 2 since role & experience are filled
    setStep(2);
  };

  const canNext = () => {
    if (step === 1) return config.role && config.experience;
    if (step === 2) return config.type && config.difficulty && config.questions;
    return true;
  };

  const startInterview = () => {
    localStorage.removeItem('activeInterviewSessionId');
    sessionStorage.setItem('interviewConfig', JSON.stringify(config));
    navigate('/interview');
  };

  const startAvatarInterview = () => {
    localStorage.removeItem('activeInterviewSessionId');
    sessionStorage.setItem('interviewConfig', JSON.stringify(config));
    navigate('/avatar-interview');
  };

  const difficultyColor = (d) => {
    if (d === 'Easy') return 'var(--color-success)';
    if (d === 'Medium') return 'var(--color-warning)';
    if (d === 'Hard') return 'var(--color-danger)';
    return '#a855f7';
  };

  const displayedLangs = showAllLangs ? LANGUAGES : LANGUAGES.slice(0, 6);

  const templateCompanies = ['all', ...new Set(TEMPLATES.map(t => t.company))];
  const filteredTemplates = templateFilter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.company === templateFilter);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>

      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> {step > 1 ? 'Back' : 'Home'}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>AI Interviewer</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium px-3 py-1 rounded-full"
              style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
              Step {step}/3
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="h-1" style={{ background: 'var(--color-border)' }}>
        <div className="h-full transition-all duration-500 ease-out" style={{ width: `${(step/3)*100}%`, background: 'var(--color-accent)' }} />
      </div>

      {activeSession && (
        <div className="max-w-3xl mx-auto w-full px-6 mt-6">
          <div className="card p-5 animate-fade-up" style={{ border: '1px solid var(--color-accent)', background: 'var(--color-accent-light)' }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-accent)' }}>You have an interview in progress</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {activeSession.config?.role} · {activeSession.config?.experience} · {activeSession.config?.type} · Q{activeSession.questionCount}/{activeSession.config?.questions}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={discardSession} className="btn-secondary px-4 py-2 text-xs flex items-center gap-1.5"><Trash2 size={12} /> Discard</button>
                <button onClick={resumeInterview} className="btn-primary px-5 py-2 text-xs flex items-center gap-1.5"><PlayCircle size={14} /> Resume</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">

          {/* Step 1 */}
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Tell us about yourself
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>We'll calibrate the interview to match your level.</p>
              </div>

              {/* Templates quick pick */}
              <div className="mb-8">
                <button onClick={() => setShowTemplates(v => !v)}
                  className="w-full card p-4 text-left transition-all hover:scale-[1.01] flex items-center gap-3"
                  style={{ borderColor: showTemplates ? 'var(--color-accent)' : 'var(--color-card-border)', background: showTemplates ? 'var(--color-accent-light)' : 'var(--color-card-bg)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: showTemplates ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>Use Interview Template</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Quick presets: Google SDE-1, Amazon Backend, Meta Frontend & more</p>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--color-text-tertiary)', transform: showTemplates ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>

                {showTemplates && (
                  <div className="mt-3 card p-5" style={{ border: '1px solid var(--color-accent)' }}>
                    {/* Filter tabs */}
                    <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
                      {templateCompanies.map(c => (
                        <button key={c} onClick={() => setTemplateFilter(c)}
                          className="px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all"
                          style={{
                            background: templateFilter === c ? 'var(--color-accent)' : 'var(--color-surface)',
                            color: templateFilter === c ? 'white' : 'var(--color-text-secondary)',
                            border: `1px solid ${templateFilter === c ? 'var(--color-accent)' : 'var(--color-border)'}`,
                          }}>
                          {c === 'all' ? 'All' : c}
                        </button>
                      ))}
                    </div>

                    {/* Template grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                      {filteredTemplates.map(t => (
                        <button key={t.id} onClick={() => applyTemplate(t)}
                          className="p-3 rounded-xl text-left transition-all hover:scale-[1.02]"
                          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{t.emoji}</span>
                            <span className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{t.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${difficultyColor(t.difficulty)}12`, color: difficultyColor(t.difficulty) }}>{t.difficulty}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>{t.type}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>{t.questions}Q</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>or configure manually</span>
                <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Target Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(r => (
                    <button key={r} onClick={() => set('role', r)}
                      className="card px-4 py-3.5 text-sm text-left transition-all hover:scale-[1.02]"
                      style={{
                        borderColor: config.role === r ? 'var(--color-accent)' : 'var(--color-card-border)',
                        background: config.role === r ? 'var(--color-accent-light)' : 'var(--color-card-bg)',
                        color: config.role === r ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        fontWeight: config.role === r ? 600 : 400,
                      }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Experience Level</label>
                <div className="flex flex-col gap-2">
                  {EXPERIENCES.map(e => (
                    <button key={e} onClick={() => set('experience', e)}
                      className="card px-4 py-3.5 text-sm text-left transition-all hover:scale-[1.01]"
                      style={{
                        borderColor: config.experience === e ? 'var(--color-accent)' : 'var(--color-card-border)',
                        background: config.experience === e ? 'var(--color-accent-light)' : 'var(--color-card-bg)',
                        color: config.experience === e ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        fontWeight: config.experience === e ? 600 : 400,
                      }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="animate-fade-up">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Configure your session
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Choose your interview type, difficulty, length, and language.</p>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Interview Type</label>
                <div className="flex flex-col gap-3">
                  {INTERVIEW_TYPES.map(t => (
                    <button key={t.id} onClick={() => set('type', t.id)}
                      className="card px-5 py-4 text-left flex items-center gap-4 transition-all hover:scale-[1.01]"
                      style={{
                        borderColor: config.type === t.id ? 'var(--color-accent)' : 'var(--color-card-border)',
                        background: config.type === t.id ? 'var(--color-accent-light)' : 'var(--color-card-bg)',
                      }}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <t.icon size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: config.type === t.id ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>{t.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Difficulty</label>
                  <div className="flex flex-col gap-2">
                    {DIFFICULTIES.map(d => (
                      <button key={d} onClick={() => set('difficulty', d)}
                        className="card px-4 py-3 text-sm text-left transition-all hover:scale-[1.01]"
                        style={{
                          borderColor: config.difficulty === d ? difficultyColor(d) : 'var(--color-card-border)',
                          background: config.difficulty === d ? `${difficultyColor(d)}12` : 'var(--color-card-bg)',
                          color: config.difficulty === d ? difficultyColor(d) : 'var(--color-text-primary)',
                          fontWeight: config.difficulty === d ? 600 : 400,
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Questions</label>
                  <div className="flex flex-col gap-2">
                    {QUESTION_COUNTS.map(q => (
                      <button key={q} onClick={() => set('questions', q)}
                        className="card px-4 py-3 text-sm text-left transition-all hover:scale-[1.01]"
                        style={{
                          borderColor: config.questions === q ? 'var(--color-accent)' : 'var(--color-card-border)',
                          background: config.questions === q ? 'var(--color-accent-light)' : 'var(--color-card-bg)',
                          color: config.questions === q ? 'var(--color-accent)' : 'var(--color-text-primary)',
                          fontWeight: config.questions === q ? 600 : 400,
                        }}>
                        {q} questions
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="mb-8">
                <label className="block text-xs font-medium mb-3 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                  <Globe size={12} /> Interview Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {displayedLangs.map(lang => (
                    <button key={lang.code} onClick={() => set('language', lang.code)}
                      className="card px-4 py-3 text-sm text-left transition-all hover:scale-[1.01] flex items-center gap-2"
                      style={{
                        borderColor: config.language === lang.code ? 'var(--color-accent)' : 'var(--color-card-border)',
                        background: config.language === lang.code ? 'var(--color-accent-light)' : 'var(--color-card-bg)',
                        color: config.language === lang.code ? 'var(--color-accent)' : 'var(--color-text-primary)',
                        fontWeight: config.language === lang.code ? 600 : 400,
                      }}>
                      <span className="text-base">{lang.flag}</span>
                      <span className="truncate text-xs">{lang.label}</span>
                    </button>
                  ))}
                </div>
                {!showAllLangs && (
                  <button onClick={() => setShowAllLangs(true)} className="mt-2 text-xs font-medium transition-opacity hover:opacity-70 flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
                    Show all {LANGUAGES.length} languages <ArrowRight size={10} />
                  </button>
                )}
                {showAllLangs && (
                  <button onClick={() => setShowAllLangs(false)} className="mt-2 text-xs font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-tertiary)' }}>Show fewer</button>
                )}
                {config.language !== 'English' && (
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>The AI will ask questions and give feedback in {config.language}. Technical terms will remain in English.</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="animate-fade-up">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Upload your resume
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Optional — get personalized questions from your actual experience.</p>
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>Supports PDF, DOCX, and TXT files.</p>
              </div>

              {!config.resume ? (
                <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
                  onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current.click()}
                  className="card p-16 text-center cursor-pointer transition-all hover:scale-[1.01]"
                  style={{
                    borderStyle: 'dashed', borderWidth: '2px',
                    borderColor: dragging ? 'var(--color-accent)' : 'var(--color-border)',
                    background: dragging ? 'var(--color-accent-light)' : 'var(--color-card-bg)',
                  }}>
                  <Upload size={36} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                  <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Drop your resume here</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>or click to browse · PDF, DOCX, or TXT</p>
                  <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={e => handleFile(e.target.files[0])} className="hidden" />
                </div>
              ) : (
                <div className="card p-6 flex items-center justify-between"
                  style={{ borderColor: uploading ? 'var(--color-warning)' : 'var(--color-success)' }}>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 size={24} className={uploading ? 'animate-pulse' : ''} style={{ color: uploading ? 'var(--color-warning)' : 'var(--color-success)' }} />
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{config.resume.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{uploading ? 'Parsing resume...' : 'Uploaded & ready'}</p>
                    </div>
                  </div>
                  <button onClick={() => { set('resume', null); set('resumeText', ''); }}
                    className="p-2 rounded-lg transition-all hover:opacity-70" style={{ color: 'var(--color-text-tertiary)' }}>
                    <X size={18} />
                  </button>
                </div>
              )}

              <div className="card p-5 mt-6">
                <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Session Summary</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>{config.role}</span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>{config.experience}</span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>{config.type}</span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: `${difficultyColor(config.difficulty)}15`, color: difficultyColor(config.difficulty) }}>{config.difficulty}</span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>{config.questions} questions</span>
                  {config.language !== 'English' && (
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                      <Globe size={10} /> {config.language}
                    </span>
                  )}
                  {config.resume && <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: 'var(--color-success)' }}>Resume attached</span>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
              className="btn-secondary px-6 py-3 text-sm flex items-center gap-2">
              <ArrowLeft size={14} /> Back
            </button>

            {step < 3 ? (
              <button onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}
                className="btn-primary px-8 py-3 text-sm font-semibold flex items-center gap-2"
                style={{ opacity: canNext() ? 1 : 0.4, cursor: canNext() ? 'pointer' : 'not-allowed' }}>
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <div className="flex flex-col gap-3 items-end">
                <button onClick={startInterview}
                  className="btn-primary px-8 py-3.5 text-sm font-semibold flex items-center gap-2 shadow-lg"
                  style={{ boxShadow: '0 4px 20px rgba(0,113,227,0.3)' }}>
                  Start Interview <ArrowRight size={14} />
                </button>
                <button onClick={startAvatarInterview}
                  className="px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ border: '1px solid rgba(139,92,246,0.4)', color: '#8b5cf6', background: 'rgba(139,92,246,0.06)' }}>
                  🎭 Avatar Interview <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}