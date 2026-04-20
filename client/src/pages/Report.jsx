import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, Clock, Target, TrendingUp, MessageSquare, Zap, BookOpen, History, Download, Brain, Sun, Moon, Share2, Link2, Check } from 'lucide-react';

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
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{score}</span>
        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>/ 100</span>
      </div>
    </div>
  );
}

export default function Report() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const report = (() => { try { return JSON.parse(sessionStorage.getItem('interviewReport') || '{}'); } catch { return {}; } })();
  const score = parseInt(report.overallScore || report.score) || 0;
  const verdict = report.verdict || 'Borderline';
  const isSelected = verdict.toLowerCase().includes('selected');
  const isRejected = verdict.toLowerCase().includes('rejected');
  const VerdictIcon = isSelected ? CheckCircle2 : isRejected ? XCircle : AlertTriangle;

  const verdictStyle = isSelected
    ? { color: 'var(--color-success)', bg: 'rgba(52,199,89,0.08)', border: 'rgba(52,199,89,0.25)' }
    : isRejected
    ? { color: 'var(--color-danger)', bg: 'rgba(255,59,48,0.08)', border: 'rgba(255,59,48,0.25)' }
    : { color: 'var(--color-warning)', bg: 'rgba(255,149,0,0.08)', border: 'rgba(255,149,0,0.25)' };

  const sessionId = sessionStorage.getItem('currentSessionId');

  const subScores = [
    { label: 'Technical', val: parseInt(report.technicalScore) || score },
    { label: 'Problem Solving', val: parseInt(report.problemSolvingScore) || score },
    { label: 'Communication', val: parseInt(report.communicationScore) || score },
    { label: 'Confidence', val: parseInt(report.confidenceScore) || score },
  ];

  const sections = [
    { icon: CheckCircle2, label: 'Strengths', value: report.strengths, color: 'var(--color-success)' },
    { icon: XCircle, label: 'Weaknesses', value: report.weaknesses, color: 'var(--color-danger)' },
    { icon: Target, label: 'Technical Gaps', value: report.technicalGaps || report.gaps, color: 'var(--color-warning)' },
    { icon: MessageSquare, label: 'Communication', value: report.communication, color: 'var(--color-accent)' },
    { icon: Zap, label: 'Confidence', value: report.confidence, color: 'var(--color-accent)' },
    { icon: TrendingUp, label: 'Improvements', value: report.improvements, color: 'var(--color-success)' },
  ];

  const ideals = report.idealAnswers || report.ideals || [];

  const downloadPDF = async () => {
    if (!sessionId) { alert('Session ID not found.'); return; }
    setDownloading(true);
    try {
      const res = await fetch(`/api/interview/report-pdf/${sessionId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-report-${sessionId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) { alert('Failed to download PDF: ' + e.message); }
    setDownloading(false);
  };

  const shareUrl = sessionId ? `${window.location.origin}/shared/${sessionId}` : '';

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Interview Report — ${score}/100 (${verdict})`,
          text: `I scored ${score}/100 on my ${report.config?.role || 'tech'} interview practice! Verdict: ${verdict}`,
          url: shareUrl,
        });
      } catch {}
    } else {
      setShowShare(true);
    }
  };

  const scoreColor = (s) => s >= 75 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>

      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> Home
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={shareNative}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(52,199,89,0.1)', color: 'var(--color-success)', border: '1px solid rgba(52,199,89,0.3)' }}>
              <Share2 size={12} /> Share
            </button>
            <button onClick={downloadPDF} disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}>
              <Download size={12} className={downloading ? 'animate-bounce' : ''} /> {downloading ? '...' : 'PDF'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-10">

        {/* Verdict */}
        <div className="card p-6 mb-8 flex items-center gap-4" style={{ background: verdictStyle.bg, borderColor: verdictStyle.border }}>
          <VerdictIcon size={32} style={{ color: verdictStyle.color }} />
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Final Verdict</p>
            <p className="font-display text-2xl font-bold" style={{ color: verdictStyle.color }}>{verdict}</p>
          </div>
          <div className="ml-auto text-right hidden md:block">
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{report.config?.role || 'Software Engineer'}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{report.config?.experience || ''}</p>
            {report.totalTime && (
              <div className="flex items-center gap-1 justify-end mt-1">
                <Clock size={10} style={{ color: 'var(--color-text-tertiary)' }} />
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{report.totalTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Score Ring */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-tertiary)' }}>Overall Performance</p>
          <ScoreRing score={score} />
          <p className="text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
            {score >= 80 ? 'Exceptional performance. FAANG-ready.' :
             score >= 65 ? 'Strong showing with clear areas to sharpen.' :
             score >= 50 ? 'Solid foundation. Needs focused practice.' :
             'Significant gaps identified. Keep practicing.'}
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

        {/* Ideal Answers */}
        {ideals.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} style={{ color: 'var(--color-text-tertiary)' }} />
              <h3 className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Ideal Answers</h3>
            </div>
            <div className="space-y-2">
              {(showAll ? ideals : ideals.slice(0, 3)).map((item, i) => (
                <div key={i} className="card px-5 py-4">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>{item}</p>
                </div>
              ))}
            </div>
            {ideals.length > 3 && (
              <button onClick={() => setShowAll(o => !o)} className="mt-3 text-sm flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-accent)' }}>
                {showAll ? 'Show less' : `Show all ${ideals.length} answers`}
                {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        )}

        {/* Bottom CTAs */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Ready to improve your score?</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button onClick={() => setShowShare(true)}
              className="btn-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2">
              <Share2 size={14} /> Share Report
            </button>
            <button onClick={downloadPDF} disabled={downloading}
              className="btn-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2">
              <Download size={14} /> {downloading ? 'Generating...' : 'Download PDF'}
            </button>
            <button onClick={() => navigate('/history')}
              className="btn-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2">
              <History size={14} /> View History
            </button>
            <button onClick={() => navigate('/setup')}
              className="btn-primary px-8 py-3.5 text-sm font-semibold flex items-center gap-2">
              <RotateCcw size={14} /> Start Another Interview
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <div className="card p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(52,199,89,0.1)' }}>
                <Share2 size={22} style={{ color: 'var(--color-success)' }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Share Report</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Anyone with this link can view your score and feedback</p>
            </div>

            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <Link2 size={14} style={{ color: 'var(--color-text-tertiary)' }} />
              <input readOnly value={shareUrl} className="flex-1 bg-transparent text-xs outline-none" style={{ color: 'var(--color-text-primary)' }} />
              <button onClick={copyShareLink}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: copied ? 'var(--color-success)' : 'var(--color-accent)',
                  color: 'white',
                }}>
                {copied ? <Check size={12} /> : 'Copy'}
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <a href={`https://twitter.com/intent/tweet?text=I scored ${score}/100 on my AI Interview practice! Verdict: ${verdict}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl text-xs font-medium text-center transition-all hover:opacity-80"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                𝕏 Twitter
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl text-xs font-medium text-center transition-all hover:opacity-80"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                LinkedIn
              </a>
              <a href={`https://wa.me/?text=I scored ${score}/100 on my AI Interview! ${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl text-xs font-medium text-center transition-all hover:opacity-80"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                WhatsApp
              </a>
            </div>

            <button onClick={() => setShowShare(false)}
              className="w-full py-2.5 rounded-xl text-sm transition-all hover:opacity-70"
              style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}