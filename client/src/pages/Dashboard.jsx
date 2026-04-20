import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';
import { Sun, Moon, Brain, ArrowRight, LogOut, User, Settings, Clock, BarChart3, CheckCircle2, XCircle, AlertTriangle, BookOpen, Terminal, Mail, History, MapPin, Building, GraduationCap, Github, Linkedin, Phone, Edit3, Trophy, Target, Zap, X, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Flame, Award, BookMarked, Lightbulb, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';

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

// ─── Score Trend Chart ───
function ScoreTrendChart({ sessions }) {
  if (!sessions || sessions.length < 2) return null;
  const data = sessions.filter(s => s.report?.overallScore > 0).reverse().map(s => ({
    score: s.report.overallScore,
    date: new Date(s.startedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
  }));
  if (data.length < 2) return null;

  const width = 600, height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxScore = Math.max(...data.map(d => d.score), 100);
  const minScore = Math.min(...data.map(d => d.score), 0);
  const range = maxScore - minScore || 1;
  const getX = (i) => padding.left + (i / (data.length - 1)) * chartW;
  const getY = (score) => padding.top + chartH - ((score - minScore) / range) * chartH;
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.score)}`).join(' ');
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${padding.top + chartH} L ${padding.left} ${padding.top + chartH} Z`;
  const gridLines = [0, 25, 50, 75, 100].filter(v => v >= minScore && v <= maxScore);
  const dotColor = (score) => score >= 75 ? 'var(--color-success)' : score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
  const firstHalf = data.slice(0, Math.ceil(data.length / 2));
  const secondHalf = data.slice(Math.ceil(data.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b.score, 0) / secondHalf.length;
  const trending = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'flat';

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><TrendingUp size={16} style={{ color: 'var(--color-accent)' }} /><h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Score Trend</h3></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full font-medium" style={{ background: trending === 'up' ? 'rgba(52,199,89,0.1)' : trending === 'down' ? 'rgba(255,59,48,0.1)' : 'var(--color-surface)', color: trending === 'up' ? 'var(--color-success)' : trending === 'down' ? 'var(--color-danger)' : 'var(--color-text-tertiary)', border: `1px solid ${trending === 'up' ? 'rgba(52,199,89,0.2)' : trending === 'down' ? 'rgba(255,59,48,0.2)' : 'var(--color-border)'}` }}>
            {trending === 'up' ? '↑ Improving' : trending === 'down' ? '↓ Declining' : '→ Steady'}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{data.length} sessions</span>
        </div>
      </div>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
          {gridLines.map(v => (<g key={v}><line x1={padding.left} y1={getY(v)} x2={width - padding.right} y2={getY(v)} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" /><text x={padding.left - 8} y={getY(v) + 4} textAnchor="end" fontSize="10" fill="var(--color-text-tertiary)" fontFamily="monospace">{v}</text></g>))}
          <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" /><stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" /></linearGradient></defs>
          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => (<g key={i}><circle cx={getX(i)} cy={getY(d.score)} r="5" fill={dotColor(d.score)} stroke="var(--color-card-bg)" strokeWidth="2" /><text x={getX(i)} y={getY(d.score) - 10} textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)" fontWeight="600" fontFamily="monospace">{d.score}</text><text x={getX(i)} y={height - 6} textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">{d.date}</text></g>))}
        </svg>
      </div>
    </div>
  );
}

// ─── Topic Performance ───
function TopicPerformance({ sessions }) {
  if (!sessions || sessions.length === 0) return null;
  const topicScores = {};
  sessions.forEach(s => { if (!s.report?.overallScore || !s.config?.type) return; const t = s.config.type; if (!topicScores[t]) topicScores[t] = []; topicScores[t].push(s.report.overallScore); });
  const topics = Object.entries(topicScores).map(([type, scores]) => ({ type, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length, best: Math.max(...scores) }));
  if (topics.length === 0) return null;
  const typeLabels = { dsa: 'DSA', system: 'System Design', technical: 'Technical', behavioral: 'Behavioral', mixed: 'Mixed' };
  const typeColors = { dsa: '#F59E0B', system: '#10B981', technical: '#8B5CF6', behavioral: '#F97316', mixed: '#0071E3' };

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center gap-2 mb-4"><Flame size={16} style={{ color: 'var(--color-warning)' }} /><h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Performance by Type</h3></div>
      <div className="space-y-3">
        {topics.sort((a, b) => b.avg - a.avg).map(t => (
          <div key={t.type}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: typeColors[t.type] || 'var(--color-accent)' }} /><span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{typeLabels[t.type] || t.type}</span></div>
              <div className="flex items-center gap-3"><span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{t.count} session{t.count !== 1 ? 's' : ''}</span><span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Best: {t.best}</span><span className="text-xs font-bold font-mono" style={{ color: t.avg >= 75 ? 'var(--color-success)' : t.avg >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>{t.avg}%</span></div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}><div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.avg}%`, background: typeColors[t.type] || 'var(--color-accent)' }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Daily Challenge ───
function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { loadChallenge(); }, []);
  const loadChallenge = async () => { try { const res = await fetch('/api/interview/daily-challenge', { credentials: 'include' }); const data = await res.json(); if (data.success) setChallenge(data.challenge); } catch {} setLoading(false); };
  const submitAnswer = async () => { if (!answer.trim() || submitting || !challenge) return; setSubmitting(true); try { const res = await fetch('/api/interview/daily-challenge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ answer: answer.trim(), topic: challenge.topic, difficulty: challenge.difficulty }) }); const data = await res.json(); if (data.success) { setResult(data.result); setChallenge(prev => ({ ...prev, completed: true, streak: data.result.streak })); } } catch {} setSubmitting(false); };

  if (loading || !challenge) return null;
  const diffColor = challenge.difficulty === 'Easy' ? 'var(--color-success)' : challenge.difficulty === 'Hard' ? 'var(--color-danger)' : 'var(--color-warning)';

  return (
    <div className="card p-6 mb-6" style={{ border: challenge.completed ? '1px solid var(--color-success)' : '1px solid var(--color-card-border)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><span className="text-lg">🎯</span><h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Daily Challenge</h3><span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${diffColor}15`, color: diffColor, border: `1px solid ${diffColor}30` }}>{challenge.difficulty}</span></div>
        <div className="flex items-center gap-3">{challenge.streak > 0 && <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#F59E0B' }}>🔥 {challenge.streak} day streak</div>}<span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{challenge.totalCompleted} completed</span></div>
      </div>
      <div className="flex items-center gap-2 mb-4"><span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>{challenge.topic}</span><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{challenge.date}</span></div>
      {challenge.completed && !result ? (
        <div className="flex items-center gap-2 py-3"><CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} /><span className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>Completed today! Come back tomorrow.</span></div>
      ) : result ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3"><div className="text-2xl font-bold font-mono" style={{ color: result.score >= 75 ? 'var(--color-success)' : result.score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>{result.score}/100</div>{result.streak > 0 && <span className="text-xs font-medium" style={{ color: '#F59E0B' }}>🔥 {result.streak} day streak!</span>}</div>
          <div className="p-3 rounded-xl text-sm leading-relaxed" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}><p className="font-medium text-xs mb-1" style={{ color: 'var(--color-text-primary)' }}>Feedback:</p>{result.feedback}</div>
          {result.ideal && <div className="p-3 rounded-xl text-sm leading-relaxed" style={{ background: 'rgba(52,199,89,0.06)', border: '1px solid rgba(52,199,89,0.15)', color: 'var(--color-text-secondary)' }}><p className="font-medium text-xs mb-1" style={{ color: 'var(--color-success)' }}>Ideal Answer:</p>{result.ideal}</div>}
        </div>
      ) : !expanded ? (
        <button onClick={() => setExpanded(true)} className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ background: 'var(--color-accent)', color: 'white' }}><Zap size={14} /> Take Today's Challenge</button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Answer a <span className="font-semibold" style={{ color: diffColor }}>{challenge.difficulty}</span> question about <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>{challenge.topic}</span>:</p>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={4} placeholder={`Explain your approach...`} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          <div className="flex items-center justify-between">
            <button onClick={() => setExpanded(false)} className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Cancel</button>
            <button onClick={submitAnswer} disabled={!answer.trim() || submitting} className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2" style={{ background: !answer.trim() || submitting ? 'var(--color-surface)' : 'var(--color-accent)', color: !answer.trim() || submitting ? 'var(--color-text-tertiary)' : 'white' }}>{submitting ? 'Evaluating...' : 'Submit Answer'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI Study Plan ───
function StudyPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [activeWeek, setActiveWeek] = useState(0);

  const loadPlan = async () => { setLoading(true); setError(''); try { const res = await fetch('/api/interview/study-plan', { credentials: 'include' }); const data = await res.json(); if (data.success) { if (data.plan) { setPlan(data.plan); setExpanded(true); } else setMessage(data.message || 'Not enough data yet.'); } else setError(data.error || 'Failed.'); } catch { setError('Connection error.'); } setLoading(false); };
  const priorityColor = (p) => { if (!p) return 'var(--color-text-tertiary)'; const l = p.toLowerCase(); if (l.includes('high')) return 'var(--color-danger)'; if (l.includes('medium')) return 'var(--color-warning)'; return 'var(--color-success)'; };
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><BookMarked size={16} style={{ color: '#8b5cf6' }} /><h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>AI Study Plan</h3><span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>AI-powered</span></div>
        {plan && <button onClick={() => setExpanded(v => !v)} className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>{expanded ? 'Collapse' : 'Expand'}</button>}
      </div>
      {!plan && !loading && !message && (<div className="text-center py-4"><p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Get a personalized 2-week study plan based on your performance.</p><button onClick={loadPlan} className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 inline-flex items-center gap-2" style={{ background: '#8b5cf6', color: 'white' }}><Brain size={14} /> Generate My Study Plan</button></div>)}
      {loading && (<div className="text-center py-8"><Brain size={28} className="mx-auto mb-3 animate-pulse" style={{ color: '#8b5cf6' }} /><p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Analyzing your performance...</p></div>)}
      {message && !plan && <div className="text-center py-4"><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{message}</p></div>}
      {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>{error}</div>}
      {plan && expanded && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}><p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>{plan.summary}</p><div className="flex items-center gap-2 mt-3"><span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${priorityColor(plan.priority)}15`, color: priorityColor(plan.priority), border: `1px solid ${priorityColor(plan.priority)}30` }}>{plan.priority} Priority</span><span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{plan.meta?.totalSessions} interviews · Avg {plan.meta?.avgScore}%</span></div></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(255,59,48,0.04)', border: '1px solid rgba(255,59,48,0.1)' }}><p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-danger)' }}>Focus Areas</p><div className="flex flex-wrap gap-1.5">{plan.weakAreas?.map((a, i) => (<span key={i} className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(255,59,48,0.08)', color: 'var(--color-danger)' }}>{a}</span>))}</div></div>
            <div className="p-3 rounded-xl" style={{ background: 'rgba(52,199,89,0.04)', border: '1px solid rgba(52,199,89,0.1)' }}><p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-success)' }}>Strengths</p><div className="flex flex-wrap gap-1.5">{plan.strongAreas?.map((a, i) => (<span key={i} className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(52,199,89,0.08)', color: 'var(--color-success)' }}>{a}</span>))}</div></div>
          </div>
          <div><div className="flex gap-2 mb-3">{plan.weeks?.map((week, i) => (<button key={i} onClick={() => setActiveWeek(i)} className="px-4 py-2 rounded-xl text-xs font-medium transition-all" style={{ background: activeWeek === i ? '#8b5cf6' : 'var(--color-surface)', color: activeWeek === i ? 'white' : 'var(--color-text-secondary)', border: `1px solid ${activeWeek === i ? '#8b5cf6' : 'var(--color-border)'}` }}><Calendar size={10} className="inline mr-1" /> {week.title}</button>))}</div>
            <div className="space-y-2">{plan.weeks?.[activeWeek]?.days?.map((task, i) => (<div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}><div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: i === 6 ? 'rgba(52,199,89,0.1)' : 'rgba(139,92,246,0.1)', color: i === 6 ? 'var(--color-success)' : '#8b5cf6' }}>{dayLabels[i] || `D${i + 1}`}</div><p className="text-sm leading-relaxed pt-2" style={{ color: 'var(--color-text-primary)' }}>{task}</p></div>))}</div>
          </div>
          {plan.resources?.length > 0 && (<div><p className="text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}><BookOpen size={10} /> Resources</p><div className="space-y-1.5">{plan.resources.map((r, i) => (<div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}><span style={{ color: 'var(--color-accent)' }}>•</span> {r}</div>))}</div></div>)}
          {plan.tips?.length > 0 && (<div><p className="text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}><Lightbulb size={10} /> Pro Tips</p><div className="space-y-1.5">{plan.tips.map((t, i) => (<div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>💡 {t}</div>))}</div></div>)}
          <div className="text-center pt-2"><button onClick={loadPlan} disabled={loading} className="text-xs font-medium transition-opacity hover:opacity-70 inline-flex items-center gap-1" style={{ color: '#8b5cf6' }}><Brain size={10} /> Regenerate Plan</button></div>
        </div>
      )}
    </div>
  );
}

// ─── Badges Section ───
function BadgesSection() {
  const [badges, setBadges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [newBadgePopup, setNewBadgePopup] = useState(null);

  useEffect(() => { loadBadges(); }, []);
  const loadBadges = async () => { try { const res = await fetch('/api/auth/badges', { credentials: 'include' }); const data = await res.json(); if (data.success) { setBadges(data); if (data.newBadges?.length > 0) { setNewBadgePopup(data.newBadges[0]); setTimeout(() => setNewBadgePopup(null), 4000); } } } catch {} setLoading(false); };
  if (loading || !badges) return null;
  const earned = badges.badges.filter(b => b.earned);
  const locked = badges.badges.filter(b => !b.earned);
  const displayed = showAll ? badges.badges : [...earned.slice(0, 8), ...locked.slice(0, Math.max(0, 8 - earned.length))];

  return (
    <>
      {newBadgePopup && (<div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-bounce"><div className="card px-6 py-4 flex items-center gap-3 shadow-xl" style={{ border: '2px solid var(--color-accent)', minWidth: 280 }}><span className="text-3xl">{newBadgePopup.emoji}</span><div><p className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>New Badge Unlocked!</p><p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{newBadgePopup.name}</p><p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{newBadgePopup.desc}</p></div></div></div>)}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Award size={16} style={{ color: '#F59E0B' }} /><h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Achievements</h3><span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>{badges.earned}/{badges.total}</span></div>
          <button onClick={() => setShowAll(v => !v)} className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}>{showAll ? 'Show less' : 'View all'}</button>
        </div>
        <div className="mb-4"><div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}><div className="h-full rounded-full transition-all duration-700" style={{ width: `${(badges.earned / badges.total) * 100}%`, background: 'linear-gradient(90deg, #F59E0B, #EF4444, #8B5CF6)' }} /></div><p className="text-[10px] mt-1 text-right" style={{ color: 'var(--color-text-tertiary)' }}>{Math.round((badges.earned / badges.total) * 100)}% complete</p></div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {displayed.map(badge => (
            <div key={badge.id} className="group relative" title={`${badge.name}: ${badge.desc}`}>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-default" style={{ background: badge.earned ? 'var(--color-surface)' : 'transparent', border: `1px solid ${badge.earned ? 'var(--color-border)' : 'transparent'}`, opacity: badge.earned ? 1 : 0.35, filter: badge.earned ? 'none' : 'grayscale(1)' }}>
                <span className="text-2xl">{badge.emoji}</span><span className="text-[9px] font-medium text-center leading-tight" style={{ color: 'var(--color-text-secondary)' }}>{badge.name}</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none"><div className="card px-3 py-2 shadow-lg text-center whitespace-nowrap" style={{ border: '1px solid var(--color-border)' }}><p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{badge.name}</p><p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{badge.desc}</p>{badge.earned && badge.earnedAt && <p className="text-[9px] mt-0.5" style={{ color: 'var(--color-success)' }}>✓ {new Date(badge.earnedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>}</div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Bookmarks Section ───
function BookmarksSection() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('questions');

  useEffect(() => { loadBookmarks(); }, []);
  const loadBookmarks = async () => {
    try {
      const res = await fetch('/api/auth/bookmarks', { credentials: 'include' });
      const data = await res.json();
      if (data.success) { setQuestions(data.questions || []); setPosts(data.posts || []); }
    } catch {}
    setLoading(false);
  };

  const removeBookmark = async (type, id) => {
    await fetch(`/api/auth/bookmark/${type}/${id}`, { method: 'POST', credentials: 'include' });
    if (type === 'question') setQuestions(prev => prev.filter(q => q._id !== id));
    else setPosts(prev => prev.filter(p => p._id !== id));
  };

  const total = questions.length + posts.length;
  if (loading) return null;

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark size={16} style={{ color: '#F59E0B' }} />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Bookmarks</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>{total}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('questions')} className="text-[10px] px-3 py-1 rounded-full font-medium"
            style={{ background: tab === 'questions' ? '#F59E0B' : 'var(--color-surface)', color: tab === 'questions' ? '#0a0a0a' : 'var(--color-text-secondary)', border: `1px solid ${tab === 'questions' ? '#F59E0B' : 'var(--color-border)'}` }}>
            Questions ({questions.length})
          </button>
          <button onClick={() => setTab('posts')} className="text-[10px] px-3 py-1 rounded-full font-medium"
            style={{ background: tab === 'posts' ? '#8B5CF6' : 'var(--color-surface)', color: tab === 'posts' ? '#fff' : 'var(--color-text-secondary)', border: `1px solid ${tab === 'posts' ? '#8B5CF6' : 'var(--color-border)'}` }}>
            Posts ({posts.length})
          </button>
        </div>
      </div>

      {tab === 'questions' && (
        questions.length === 0 ? (
          <p className="text-center text-xs py-4" style={{ color: 'var(--color-text-tertiary)' }}>No bookmarked questions. Go to Question Bank to bookmark some.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {questions.map(q => (
              <div key={q._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{q.question || q.title}</p>
                  <div className="flex gap-2 mt-1">
                    {q.topic && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,113,227,0.1)', color: '#0071E3' }}>{q.topic}</span>}
                    {q.difficulty && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: q.difficulty === 'Hard' ? 'rgba(239,68,68,0.1)' : q.difficulty === 'Easy' ? 'rgba(52,199,89,0.1)' : 'rgba(245,158,11,0.1)', color: q.difficulty === 'Hard' ? '#EF4444' : q.difficulty === 'Easy' ? '#10B981' : '#F59E0B' }}>{q.difficulty}</span>}
                  </div>
                </div>
                <button onClick={() => removeBookmark('question', q._id)} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
                  <BookmarkCheck size={12} style={{ color: '#F59E0B' }} />
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'posts' && (
        posts.length === 0 ? (
          <p className="text-center text-xs py-4" style={{ color: 'var(--color-text-tertiary)' }}>No bookmarked posts. Go to Forum to bookmark some.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {posts.map(p => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} onClick={() => navigate('/forum')}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{p.title}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>by {p.userId?.name || 'User'} · {p.likes?.length || 0} likes</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeBookmark('post', p._id); }} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <BookmarkCheck size={12} style={{ color: '#8B5CF6' }} />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ─── Onboarding Tour ───
const TOUR_STEPS = [
  { target: 'tour-profile', title: 'Your Profile', desc: 'Your profile card with details, skills, and links.', icon: User, position: 'bottom' },
  { target: 'tour-stats', title: 'Your Stats', desc: 'Track interviews, scores, selection rate, and completed sessions.', icon: BarChart3, position: 'bottom' },
  { target: 'tour-actions', title: 'Quick Actions', desc: 'Start interviews, browse history, question bank, or code.', icon: Zap, position: 'top' },
  { target: 'tour-sessions', title: 'Recent Sessions', desc: 'Latest results. Click any to view the full report.', icon: History, position: 'top' },
  { target: 'tour-start', title: 'Start Interview!', desc: 'Click to begin a mock interview. Good luck!', icon: Brain, position: 'top' },
];

function OnboardingTour({ onComplete }) {
  const [step, setStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [highlight, setHighlight] = useState(null);
  const tooltipRef = useRef();
  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  useEffect(() => { positionTooltip(); window.addEventListener('resize', positionTooltip); return () => window.removeEventListener('resize', positionTooltip); }, [step]);

  const positionTooltip = () => {
    const el = document.getElementById(current.target); if (!el) return;
    const rect = el.getBoundingClientRect();
    setHighlight({ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 });
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const tRect = tooltipRef.current?.getBoundingClientRect(); if (!tRect) return;
      let top, left;
      if (current.position === 'bottom') { top = rect.bottom + 16; left = rect.left + rect.width / 2 - tRect.width / 2; }
      else { top = rect.top - tRect.height - 16; left = rect.left + rect.width / 2 - tRect.width / 2; }
      left = Math.max(16, Math.min(left, window.innerWidth - tRect.width - 16));
      top = Math.max(16, Math.min(top, window.innerHeight - tRect.height - 16));
      setTooltipPos({ top, left });
    }, 100);
  };

  const Icon = current.icon;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onComplete} />
      {highlight && <div className="absolute rounded-2xl pointer-events-none z-[101] transition-all duration-300" style={{ top: highlight.top, left: highlight.left, width: highlight.width, height: highlight.height, boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)', border: '2px solid var(--color-accent)' }} />}
      <div ref={tooltipRef} className="absolute z-[102] w-[340px] transition-all duration-300" style={{ top: tooltipPos.top, left: tooltipPos.left }}>
        <div className="card p-6 shadow-xl" style={{ border: '1px solid var(--color-accent)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}><Icon size={18} style={{ color: 'var(--color-accent)' }} /></div>
            <div className="flex-1"><p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{current.title}</p><p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Step {step + 1}/{TOUR_STEPS.length}</p></div>
            <button onClick={onComplete} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}><X size={12} /></button>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>{current.desc}</p>
          <div className="flex items-center justify-center gap-1.5 mb-4">{TOUR_STEPS.map((_, i) => <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === step ? 20 : 6, height: 6, background: i === step ? 'var(--color-accent)' : i < step ? 'var(--color-success)' : 'var(--color-border)' }} />)}</div>
          <div className="flex items-center justify-between">
            <button onClick={onComplete} className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Skip</button>
            <div className="flex gap-2">
              {!isFirst && <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}><ChevronLeft size={12} /> Back</button>}
              <button onClick={() => isLast ? onComplete() : setStep(s => s + 1)} className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--color-accent)' }}>{isLast ? 'Get Started!' : 'Next'} {!isLast && <ChevronRight size={12} />}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ───
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { if (!loading && profile) { if (!localStorage.getItem('onboardingTourDone')) setTimeout(() => setShowTour(true), 800); } }, [loading, profile]);
  const completeTour = () => { setShowTour(false); localStorage.setItem('onboardingTourDone', 'true'); };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes, historyRes, allHistoryRes] = await Promise.all([
        fetch('/api/auth/profile', { credentials: 'include' }),
        fetch('/api/interview/stats', { credentials: 'include' }),
        fetch('/api/interview/history?limit=5', { credentials: 'include' }),
        fetch('/api/interview/history?limit=20', { credentials: 'include' }),
      ]);
      const [profileData, statsData, historyData, allHistoryData] = await Promise.all([profileRes.json(), statsRes.json(), historyRes.json(), allHistoryRes.json()]);
      if (profileData.success) setProfile(profileData.user);
      if (statsData.success) setStats(statsData.stats);
      if (historyData.success) setRecentSessions(historyData.sessions || []);
      if (allHistoryData.success) setAllSessions(allHistoryData.sessions || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleLogout = async () => { await logout(); navigate('/'); };
  const verdictColor = (v) => { if (!v) return 'var(--color-text-tertiary)'; if (v.toLowerCase().includes('selected')) return 'var(--color-success)'; if (v.toLowerCase().includes('rejected')) return 'var(--color-danger)'; return 'var(--color-warning)'; };
  const verdictIcon = (v) => { if (!v) return <AlertTriangle size={14} style={{ color: 'var(--color-text-tertiary)' }} />; if (v.toLowerCase().includes('selected')) return <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />; if (v.toLowerCase().includes('rejected')) return <XCircle size={14} style={{ color: 'var(--color-danger)' }} />; return <AlertTriangle size={14} style={{ color: 'var(--color-warning)' }} />; };
  const scoreColor = (s) => s >= 75 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const selectedCount = stats?.verdictBreakdown?.find(v => v._id?.toLowerCase().includes('selected'))?.count || 0;
  const completedCount = stats?.completedSessions || 0;
  const successRate = completedCount > 0 ? Math.round((selectedCount / completedCount) * 100) : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}><p style={{ color: 'var(--color-text-secondary)' }}>Loading dashboard...</p></div>;

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>
      {showTour && <OnboardingTour onComplete={completeTour} />}

      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}><Brain size={18} className="text-white" /></div><span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>AI Interviewer</span></div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            <button onClick={() => navigate('/profile')} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}><Settings size={12} /> Settings</button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80" style={{ color: 'var(--color-danger)', border: '1px solid var(--color-border)' }}><LogOut size={12} /> Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-8">

        {stats?.totalSessions === 0 && (
          <div className="card p-6 mb-6 flex items-center gap-4" style={{ borderColor: 'var(--color-accent)', background: 'var(--color-accent-light)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-accent)' }}><Sparkles size={22} className="text-white" /></div>
            <div className="flex-1"><h2 className="font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>Welcome to AI Interviewer! 🎉</h2><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Start your first mock interview to see your stats.</p></div>
            <button onClick={() => navigate('/setup')} className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2 flex-shrink-0">Start Interview <ArrowRight size={14} /></button>
          </div>
        )}

        {/* Profile */}
        <div id="tour-profile" className="card p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0" style={{ background: 'var(--color-accent)' }}>
              {profile?.avatar ? <img src={profile.avatar} alt="" className="w-full h-full rounded-2xl object-cover" /> : profile?.name ? profile.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1"><h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{profile?.name || 'User'}</h1>{profile?.isVerified && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: 'var(--color-success)', border: '1px solid rgba(52,199,89,0.2)' }}>Verified</span>}{profile?.googleId && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}>Google</span>}</div>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>{profile?.email}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {profile?.location && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}><MapPin size={12} /> {profile.location}</div>}
                {profile?.college && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}><GraduationCap size={12} /> {profile.college} {profile.graduationYear ? `'${profile.graduationYear.slice(-2)}` : ''}</div>}
                {profile?.currentCompany && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}><Building size={12} /> {profile.currentCompany}</div>}
                {profile?.phone && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}><Phone size={12} /> {profile.phone}</div>}
                {profile?.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}><Github size={12} /> GitHub</a>}
                {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}><Linkedin size={12} /> LinkedIn</a>}
              </div>
              {profile?.bio && <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{profile.bio}</p>}
              {profile?.skills?.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{profile.skills.map(sk => <span key={sk} className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>{sk}</span>)}</div>}
            </div>
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-80 flex-shrink-0" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}><Edit3 size={14} /> Edit Profile</button>
          </div>
        </div>

        {/* Stats */}
        <div id="tour-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: BarChart3, color: 'var(--color-accent)', bg: 'var(--color-accent-light)', val: stats?.totalSessions || 0, label: 'Interviews' },
            { icon: Trophy, color: 'var(--color-success)', bg: 'rgba(52,199,89,0.1)', val: `${stats?.averageScore || 0}%`, label: 'Avg Score' },
            { icon: Target, color: 'var(--color-warning)', bg: 'rgba(255,149,0,0.1)', val: `${successRate}%`, label: 'Selection Rate' },
            { icon: Zap, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', val: completedCount, label: 'Completed' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: s.bg }}><s.icon size={18} style={{ color: s.color }} /></div>
              <div className="font-display text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <ScoreTrendChart sessions={allSessions} />
        <TopicPerformance sessions={allSessions} />
        <DailyChallenge />
        <StudyPlan />
        <BadgesSection />
        <BookmarksSection />

        {/* Quick Actions */}
        <div id="tour-actions" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { id: 'tour-start', icon: Brain, label: 'Start Interview', sub: 'Practice now', path: '/setup', accent: true },
            { icon: History, label: 'History', sub: 'Past sessions', path: '/history' },
            { icon: BookOpen, label: 'Questions', sub: 'Question bank', path: '/questions' },
            { icon: Terminal, label: 'Compiler', sub: 'Code & run', path: '/compiler' },
          ].map((a, i) => (
            <button key={i} id={a.id} onClick={() => navigate(a.path)} className="card p-5 text-center transition-all hover:scale-[1.02] cursor-pointer" style={a.accent ? { borderColor: 'var(--color-accent)' } : {}}>
              <a.icon size={22} className="mx-auto mb-2" style={{ color: a.accent ? 'var(--color-accent)' : 'var(--color-text-secondary)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{a.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{a.sub}</p>
            </button>
          ))}
        </div>

        {/* Recent Sessions */}
        <div id="tour-sessions" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Recent Sessions</h2>
            {recentSessions.length > 0 && <button onClick={() => navigate('/history')} className="text-xs font-medium flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}>View all <ArrowRight size={12} /></button>}
          </div>
          {recentSessions.length === 0 ? (
            <div className="card p-10 text-center">
              <BarChart3 size={36} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>No interviews yet</p>
              <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>Start your first mock interview to see results here.</p>
              <button onClick={() => navigate('/setup')} className="btn-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">Start Interview <ArrowRight size={14} /></button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map(s => (
                <div key={s.sessionId} onClick={() => {
                  sessionStorage.setItem('interviewReport', JSON.stringify({ ...s.report, config: s.config, totalTime: s.startedAt && s.completedAt ? formatDuration(new Date(s.completedAt) - new Date(s.startedAt)) : null }));
                  sessionStorage.setItem('currentSessionId', s.sessionId);
                  navigate('/report');
                }} className="card p-5 transition-all cursor-pointer hover:scale-[1.01]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{s.config?.role || 'Interview'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>{s.config?.type}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>{s.config?.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        <div className="flex items-center gap-1"><Clock size={11} /> {fmt(s.startedAt)}</div>
                        <div className="flex items-center gap-1">{verdictIcon(s.report?.verdict)} <span style={{ color: verdictColor(s.report?.verdict) }}>{s.report?.verdict || 'In progress'}</span></div>
                      </div>
                    </div>
                    {s.report?.overallScore > 0 && <div className="text-right"><div className="font-display text-2xl font-bold" style={{ color: scoreColor(s.report.overallScore) }}>{s.report.overallScore}</div><div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>/ 100</div></div>}
                    <ArrowRight size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { icon: Mail, label: 'Contact Support', path: '/contact' },
            { icon: User, label: 'Edit Profile', path: '/profile' },
            { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
            { icon: Building, label: 'Reviews', path: '/reviews' },
          ].map((l, i) => (
            <button key={i} onClick={() => navigate(l.path)} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
              <l.icon size={12} /> {l.label}
            </button>
          ))}
          <button onClick={() => { localStorage.removeItem('onboardingTourDone'); setShowTour(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80"
            style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
            <Sparkles size={12} /> Replay Tour
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  return `${String(Math.floor(totalSec / 60)).padStart(2, '0')}:${String(totalSec % 60).padStart(2, '0')}`;
}
