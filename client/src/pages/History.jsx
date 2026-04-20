import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Clock, BarChart3, Trash2, RefreshCw, ChevronRight, Brain, Sun, Moon, MessageSquare, X, User, Bot } from 'lucide-react';

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

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Transcript
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const [hRes, sRes] = await Promise.all([
        fetch('/api/interview/history?limit=20', { credentials: 'include' }),
        fetch('/api/interview/stats', { credentials: 'include' }),
      ]);
      const hData = await hRes.json();
      const sData = await sRes.json();
      if (hData.success) setSessions(hData.sessions);
      if (sData.success) setStats(sData.stats);
    } catch {
      setError('Failed to load history. Is the backend running?');
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const deleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this session?')) return;
    try {
      await fetch(`/api/interview/session/${sessionId}`, { method: 'DELETE', credentials: 'include' });
      setSessions(p => p.filter(s => s.sessionId !== sessionId));
    } catch { alert('Failed to delete.'); }
  };

  const viewReport = (session) => {
    const reportData = {
      ...session.report,
      config: session.config,
      totalTime: session.startedAt && session.completedAt
        ? formatDuration(new Date(session.completedAt) - new Date(session.startedAt))
        : null,
    };
    sessionStorage.setItem('interviewReport', JSON.stringify(reportData));
    sessionStorage.setItem('currentSessionId', session.sessionId);
    navigate('/report');
  };

  const viewTranscript = async (e, sessionId) => {
    e.stopPropagation();
    setTranscriptLoading(true);
    setShowTranscript(true);
    setTranscript(null);
    try {
      const res = await fetch(`/api/interview/transcript/${sessionId}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setTranscript(data.transcript);
      else setTranscript(null);
    } catch { setTranscript(null); }
    setTranscriptLoading(false);
  };

  const formatDuration = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    return `${String(Math.floor(totalSec / 60)).padStart(2, '0')}:${String(totalSec % 60).padStart(2, '0')}`;
  };

  const verdictIcon = (v) => {
    if (!v) return <AlertTriangle size={14} style={{ color: 'var(--color-text-tertiary)' }} />;
    if (v.toLowerCase().includes('selected')) return <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />;
    if (v.toLowerCase().includes('rejected')) return <XCircle size={14} style={{ color: 'var(--color-danger)' }} />;
    return <AlertTriangle size={14} style={{ color: 'var(--color-warning)' }} />;
  };

  const verdictColor = (v) => {
    if (!v) return 'var(--color-text-tertiary)';
    if (v.toLowerCase().includes('selected')) return 'var(--color-success)';
    if (v.toLowerCase().includes('rejected')) return 'var(--color-danger)';
    return 'var(--color-warning)';
  };

  const scoreColor = (s) => s >= 75 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>

      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> Home
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>History</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadData} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
              <RefreshCw size={12} /> Refresh
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--color-text-primary)' }}>Interview History</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>Click any session to view the full report, or tap the chat icon to replay the transcript.</p>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { label: 'Total Sessions', value: stats.totalSessions, color: 'var(--color-accent)' },
              { label: 'Completed', value: stats.completedSessions, color: 'var(--color-success)' },
              { label: 'Avg Score', value: stats.averageScore ? `${stats.averageScore}` : '—', color: 'var(--color-warning)' },
              { label: 'Top Role', value: stats.topRoles?.[0]?._id || '—', color: 'var(--color-text-primary)', small: true },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className={`font-display ${s.small ? 'text-sm' : 'text-2xl'} font-bold mb-1`} style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="card p-4 mb-6 text-sm" style={{ background: 'rgba(255,59,48,0.08)', borderColor: 'rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20" style={{ color: 'var(--color-text-secondary)' }}>
            <RefreshCw size={20} className="animate-spin mr-3" /> Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20">
            <BarChart3 size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
            <p className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>No completed sessions yet</p>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Complete an interview to see your history here.</p>
            <button onClick={() => navigate('/setup')} className="btn-primary px-6 py-3 text-sm font-semibold">Start Interview</button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.sessionId} onClick={() => viewReport(s)}
                className="card p-5 transition-all cursor-pointer hover:scale-[1.01]"
                style={{ borderColor: 'var(--color-card-border)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{s.config?.role || 'Software Engineer'}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>{s.config?.experience}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>{s.config?.type}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>{s.config?.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--color-text-tertiary)' }}>
                      <div className="flex items-center gap-1"><Clock size={11} />{fmt(s.startedAt)}</div>
                      <div className="flex items-center gap-1">
                        {verdictIcon(s.report?.verdict)}
                        <span style={{ color: verdictColor(s.report?.verdict) }}>{s.report?.verdict || 'No verdict'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.report?.overallScore > 0 && (
                      <div className="text-right mr-1">
                        <div className="font-display text-2xl font-bold" style={{ color: scoreColor(s.report.overallScore) }}>{s.report.overallScore}</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>/ 100</div>
                      </div>
                    )}
                    <button onClick={(e) => viewTranscript(e, s.sessionId)}
                      title="View Transcript"
                      className="p-2 rounded-xl transition-all hover:opacity-70"
                      style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
                      <MessageSquare size={14} />
                    </button>
                    <button onClick={(e) => deleteSession(e, s.sessionId)}
                      className="p-2 rounded-xl transition-all hover:opacity-70"
                      style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sessions.length > 0 && (
          <div className="mt-10 text-center">
            <button onClick={() => navigate('/setup')} className="btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2">
              Start New Interview
            </button>
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {showTranscript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col card overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
                  <MessageSquare size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Interview Transcript</h2>
                  {transcript && (
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {transcript.config?.role} · {transcript.config?.type} · {transcript.config?.difficulty} · {transcript.history?.length || 0} messages
                    </p>
                  )}
                </div>
              </div>
              <button onClick={() => { setShowTranscript(false); setTranscript(null); }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <X size={14} />
              </button>
            </div>

            {/* Transcript Info Bar */}
            {transcript && (
              <div className="px-6 py-3 flex items-center gap-4 flex-wrap flex-shrink-0" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  <Clock size={11} /> {fmt(transcript.startedAt)}
                  {transcript.completedAt && ` — ${fmtTime(transcript.completedAt)}`}
                </div>
                {transcript.report?.overallScore > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <span style={{ color: 'var(--color-text-tertiary)' }}>Score:</span>
                    <span className="font-bold" style={{ color: scoreColor(transcript.report.overallScore) }}>{transcript.report.overallScore}/100</span>
                  </div>
                )}
                {transcript.report?.verdict && (
                  <div className="flex items-center gap-1 text-xs">
                    {verdictIcon(transcript.report.verdict)}
                    <span className="font-semibold" style={{ color: verdictColor(transcript.report.verdict) }}>{transcript.report.verdict}</span>
                  </div>
                )}
                <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {transcript.questionCount} questions
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {transcriptLoading ? (
                <div className="flex items-center justify-center py-20" style={{ color: 'var(--color-text-secondary)' }}>
                  <RefreshCw size={18} className="animate-spin mr-3" /> Loading transcript...
                </div>
              ) : !transcript ? (
                <div className="text-center py-20">
                  <AlertTriangle size={32} className="mx-auto mb-3" style={{ color: 'var(--color-danger)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Failed to load transcript.</p>
                </div>
              ) : transcript.history?.length === 0 ? (
                <div className="text-center py-20">
                  <MessageSquare size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No messages in this session.</p>
                </div>
              ) : (
                transcript.history
                  .filter(m => m.content !== 'Hello, I am ready to begin the interview. Please start.')
                  .map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: msg.role === 'assistant' ? 'var(--color-accent)' : 'var(--color-surface)',
                          border: msg.role === 'user' ? '1px solid var(--color-border)' : 'none',
                        }}>
                        {msg.role === 'assistant'
                          ? <Bot size={14} className="text-white" />
                          : <User size={14} style={{ color: 'var(--color-text-secondary)' }} />
                        }
                      </div>

                      {/* Message bubble */}
                      <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <span className="text-[10px] font-medium uppercase tracking-wider"
                            style={{ color: msg.role === 'assistant' ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}>
                            {msg.role === 'assistant' ? 'AI Interviewer' : 'You'}
                          </span>
                          {msg.timestamp && (
                            <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                              {fmtTime(msg.timestamp)}
                            </span>
                          )}
                        </div>
                        <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                          style={{
                            background: msg.role === 'assistant' ? 'var(--color-surface)' : 'var(--color-accent)',
                            color: msg.role === 'assistant' ? 'var(--color-text-primary)' : 'white',
                            border: msg.role === 'assistant' ? '1px solid var(--color-border)' : 'none',
                            borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                            borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                            textAlign: 'left',
                          }}>
                          {msg.content.split('INTERVIEW_COMPLETE')[0].trim()}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Modal Footer */}
            {transcript && (
              <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderTop: '1px solid var(--color-border)' }}>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {transcript.history?.filter(m => m.role === 'user' && m.content !== 'Hello, I am ready to begin the interview. Please start.').length || 0} answers · {transcript.history?.filter(m => m.role === 'assistant').length || 0} AI messages
                </p>
                <div className="flex gap-2">
                  {transcript.report && (
                    <button onClick={() => {
                      const reportData = { ...transcript.report, config: transcript.config };
                      sessionStorage.setItem('interviewReport', JSON.stringify(reportData));
                      sessionStorage.setItem('currentSessionId', transcript.sessionId);
                      setShowTranscript(false);
                      navigate('/report');
                    }}
                      className="btn-primary px-5 py-2 text-xs font-semibold">
                      View Report
                    </button>
                  )}
                  <button onClick={() => { setShowTranscript(false); setTranscript(null); }}
                    className="btn-secondary px-5 py-2 text-xs">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}