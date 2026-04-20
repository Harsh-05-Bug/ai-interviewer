import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Brain, Sun, Moon, CheckCircle2, XCircle, AlertTriangle, Target, TrendingUp, MessageSquare, Zap, Clock, ArrowRight, Trophy } from 'lucide-react';

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

function ScoreRing({ score }) {
  const r = 54, circ = 2 * Math.PI * r;
  const color = score >= 75 ? 'var(--color-success)' : score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{score}</span>
        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>/ 100</span>
      </div>
    </div>
  );
}

export default function SharedReport() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [config, setConfig] = useState(null);
  const [completedAt, setCompletedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [sessionId]);

  const loadReport = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/interview/shared-report/${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
        setConfig(data.config);
        setCompletedAt(data.completedAt);
      } else {
        setError(data.error || 'Report not found.');
      }
    } catch {
      setError('Failed to load report.');
    }
    setLoading(false);
  };

  const scoreColor = (s) => s >= 75 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
      <p style={{ color: 'var(--color-text-secondary)' }}>Loading report...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="card p-10 max-w-md w-full text-center">
        <XCircle size={40} className="mx-auto mb-4" style={{ color: 'var(--color-danger)' }} />
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Report Not Found</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary px-6 py-3 text-sm font-semibold">Go Home</button>
      </div>
    </div>
  );

  const score = parseInt(report.overallScore) || 0;
  const verdict = report.verdict || 'Borderline';
  const isSelected = verdict.toLowerCase().includes('selected');
  const isRejected = verdict.toLowerCase().includes('rejected');
  const VerdictIcon = isSelected ? CheckCircle2 : isRejected ? XCircle : AlertTriangle;

  const verdictStyle = isSelected
    ? { color: 'var(--color-success)', bg: 'rgba(52,199,89,0.08)', border: 'rgba(52,199,89,0.25)' }
    : isRejected
    ? { color: 'var(--color-danger)', bg: 'rgba(255,59,48,0.08)', border: 'rgba(255,59,48,0.25)' }
    : { color: 'var(--color-warning)', bg: 'rgba(255,149,0,0.08)', border: 'rgba(255,149,0,0.25)' };

  const subScores = [
    { label: 'Technical', val: parseInt(report.technicalScore) || score },
    { label: 'Problem Solving', val: parseInt(report.problemSolvingScore) || score },
    { label: 'Communication', val: parseInt(report.communicationScore) || score },
    { label: 'Confidence', val: parseInt(report.confidenceScore) || score },
  ];

  const sections = [
    { icon: CheckCircle2, label: 'Strengths', value: report.strengths, color: 'var(--color-success)' },
    { icon: XCircle, label: 'Weaknesses', value: report.weaknesses, color: 'var(--color-danger)' },
    { icon: Target, label: 'Technical Gaps', value: report.technicalGaps, color: 'var(--color-warning)' },
    { icon: MessageSquare, label: 'Communication', value: report.communication, color: 'var(--color-accent)' },
    { icon: Zap, label: 'Confidence', value: report.confidence, color: 'var(--color-accent)' },
    { icon: TrendingUp, label: 'Improvements', value: report.improvements, color: 'var(--color-success)' },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>

      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>AI Interviewer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-3 py-1 rounded-full font-medium" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}>
              Shared Report
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-10">

        {/* Shared Banner */}
        <div className="card p-5 mb-6 flex items-center gap-3" style={{ borderColor: 'var(--color-accent)' }}>
          <Trophy size={20} style={{ color: 'var(--color-accent)' }} />
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Interview Performance Report</p>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {config?.role} · {config?.type} · {config?.difficulty} · {config?.experience}
              {completedAt && ` · ${fmt(completedAt)}`}
            </p>
          </div>
        </div>

        {/* Verdict */}
        <div className="card p-6 mb-8 flex items-center gap-4" style={{ background: verdictStyle.bg, borderColor: verdictStyle.border }}>
          <VerdictIcon size={32} style={{ color: verdictStyle.color }} />
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Final Verdict</p>
            <p className="font-display text-2xl font-bold" style={{ color: verdictStyle.color }}>{verdict}</p>
          </div>
        </div>

        {/* Score Ring */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-tertiary)' }}>Overall Performance</p>
          <ScoreRing score={score} />
          <p className="text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
            {score >= 80 ? 'Exceptional performance.' :
             score >= 65 ? 'Strong showing with areas to sharpen.' :
             score >= 50 ? 'Solid foundation. Needs focused practice.' :
             'Significant gaps identified.'}
          </p>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {subScores.map(m => (
            <div key={m.label} className="card p-4 text-center">
              <div className="font-display text-2xl font-bold mb-1" style={{ color: scoreColor(m.val) }}>{m.val}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {sections.map(s => s.value && (
            <div key={s.label} className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={14} style={{ color: s.color }} />
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{s.label}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="card p-8 inline-block">
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Want to practice too?</p>
            <p className="text-xs mb-5" style={{ color: 'var(--color-text-secondary)' }}>AI Interviewer helps you ace tech interviews with real-time AI feedback.</p>
            <button onClick={() => navigate('/signup')} className="btn-primary px-8 py-3 text-sm font-semibold inline-flex items-center gap-2">
              Try It Free <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 px-6 py-6 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
            <Brain size={10} className="text-white" />
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>AI Interviewer</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>AI-powered interview prep platform</p>
      </footer>
    </div>
  );
}