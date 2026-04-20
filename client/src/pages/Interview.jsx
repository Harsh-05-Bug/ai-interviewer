import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Send, Clock, ChevronRight, AlertCircle, Code2, MessageSquare, Brain, Sun, Moon, X, Timer, Keyboard, Lightbulb, SkipForward, Pause, Play, Mic, MicOff, Square, Video, VideoOff } from 'lucide-react';
import MarkdownMessage from '../components/MarkdownMessage';
import CodeEditor from '../components/CodeEditor';

const PHASE_MAP = {
  dsa:       [{ name: 'DSA', color: '#F59E0B' }],
  system:    [{ name: 'System Design', color: '#10B981' }],
  technical: [{ name: 'Technical', color: '#8B5CF6' }],
  behavioral:[{ name: 'Behavioral', color: '#F97316' }],
  mixed: [
    { name: 'DSA', color: '#F59E0B' },
    { name: 'Technical', color: '#8B5CF6' },
    { name: 'System Design', color: '#10B981' },
    { name: 'Behavioral', color: '#F97316' },
  ],
};

function isDsaQuestion(text, interviewType) {
  if (!text) return false;
  const keywords = /\b(implement|algorithm|function|array|linked list|binary tree|hash map|sort|graph|traverse|time complexity|space complexity|big[\s-]?o|write a (function|method|program)|code|coding|data structure|recursion|dynamic programming)\b/i;
  if (interviewType === 'dsa') return true;
  if (interviewType === 'mixed' && keywords.test(text)) return true;
  return false;
}

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;
    if (type === 'start') {
      osc.frequency.value = 523.25; osc.type = 'sine'; osc.start();
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'end') {
      osc.frequency.value = 783.99; osc.type = 'sine'; osc.start();
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.3);
      osc.frequency.setValueAtTime(392.00, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.stop(ctx.currentTime + 0.8);
    } else if (type === 'send') {
      osc.frequency.value = 880; osc.type = 'sine'; osc.start();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'hint') {
      osc.frequency.value = 440; osc.type = 'triangle'; osc.start();
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'mic-on') {
      osc.frequency.value = 600; osc.type = 'sine'; osc.start();
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'mic-off') {
      osc.frequency.value = 800; osc.type = 'sine'; osc.start();
      osc.frequency.setValueAtTime(500, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {}
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSupported = !!SpeechRecognition;

// Floating Webcam
function InterviewWebcam({ enabled }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => {
    if (enabled) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320, facingMode: 'user' }, audio: false })
        .then(stream => { streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(err => console.error('Webcam error:', err));
    } else {
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    }
    return () => { if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; } };
  }, [enabled]);
  if (!enabled) return null;
  return (
    <div style={{ position: 'fixed', bottom: 100, right: 20, zIndex: 40, width: 140, height: 140 }}>
      <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', inset: -2, borderRadius: '50%', border: '1.5px solid var(--color-accent)', opacity: 0.4 }} />
      <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', background: '#000', border: '2px solid var(--color-border)' }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-card-bg)', padding: '2px 10px', borderRadius: 10, border: '1px solid var(--color-border)' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontSize: 10, color: 'var(--color-text-primary)', fontWeight: 600 }}>You</span>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

export default function Interview() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [config, setConfig] = useState(() => { try { return JSON.parse(sessionStorage.getItem('interviewConfig') || '{}'); } catch { return {}; } });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('text');
  const [showCodeHint, setShowCodeHint] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintLoading, setHintLoading] = useState(false);
  const [showHint, setShowHint] = useState(null);
  const maxHints = parseInt(config.questions || '8');

  const [skipsUsed, setSkipsUsed] = useState(0);
  const maxSkips = Math.max(1, Math.floor(parseInt(config.questions || '8') / 3));

  const [paused, setPaused] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [voiceInterim, setVoiceInterim] = useState('');
  const [voiceSupported] = useState(speechSupported);
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);

  const chatRef = useRef();
  const inputRef = useRef();
  const timerRef = useRef();
  const startedRef = useRef(false);
  const inputValueRef = useRef('');

  useEffect(() => { inputValueRef.current = input; }, [input]);

  const totalQ = parseInt(config.questions || '8');
  const phases = PHASE_MAP[config.type || 'mixed'];
  const phaseIdx = Math.min(Math.floor((questionCount / totalQ) * phases.length), phases.length - 1);
  const phase = phases[phaseIdx] || phases[0];

  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'interviewer' && !m.isTyping);

  useEffect(() => {
    if (paused || done) return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [paused, done]);

  const timerColor = seconds >= 3600 ? 'var(--color-danger)' : seconds >= 1800 ? 'var(--color-warning)' : 'var(--color-text-secondary)';
  const timerBg = seconds >= 3600 ? 'rgba(255,59,48,0.08)' : seconds >= 1800 ? 'rgba(255,149,0,0.08)' : 'var(--color-surface)';
  const timerBorder = seconds >= 3600 ? 'rgba(255,59,48,0.3)' : seconds >= 1800 ? 'rgba(255,149,0,0.3)' : 'var(--color-border)';

  useEffect(() => {
    if (lastAssistantMsg && isDsaQuestion(lastAssistantMsg.text, config.type)) setShowCodeHint(true);
    else { setShowCodeHint(false); setInputMode('text'); }
    setShowHint(null);
  }, [lastAssistantMsg, config.type]);

  // Speech recognition
  useEffect(() => {
    if (!voiceSupported) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const current = inputValueRef.current.trim();
          setInput((current ? current + ' ' : '') + transcript.trim());
          setVoiceInterim('');
        } else {
          interim += transcript;
        }
      }
      if (interim) setVoiceInterim(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') { setError('Microphone access denied.'); shouldListenRef.current = false; setIsListening(false); }
      if (event.error === 'aborted' || event.error === 'no-speech') return;
    };

    recognition.onend = () => {
      if (shouldListenRef.current) { setTimeout(() => { try { recognition.start(); } catch {} }, 100); }
      else setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => { shouldListenRef.current = false; try { recognition.stop(); } catch {} };
  }, [voiceSupported]);

  const toggleVoice = () => {
    if (!voiceSupported) { setError('Voice not supported. Use Chrome or Edge.'); return; }
    if (isListening) {
      shouldListenRef.current = false;
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false); setVoiceInterim('');
      playSound('mic-off');
    } else {
      shouldListenRef.current = true;
      setIsListening(true); setVoiceInterim('');
      playSound('mic-on');
      setTimeout(() => { try { recognitionRef.current.start(); } catch (e) { setIsListening(false); shouldListenRef.current = false; } }, 150);
    }
  };

  useEffect(() => {
    if ((loading || done) && isListening) {
      shouldListenRef.current = false;
      try { recognitionRef.current?.stop(); } catch {}
      setIsListening(false); setVoiceInterim('');
    }
  }, [loading, done, isListening]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const val = inputValueRef.current;
        if (val.trim() && !loading && !done && sessionId && !paused) sendAnswer(val.trim());
      }
      if (e.key === 'Escape') {
        if (showShortcuts) { setShowShortcuts(false); return; }
        if (showHint) { setShowHint(null); return; }
        if (isListening) { toggleVoice(); return; }
        setInput(''); inputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') { e.preventDefault(); setShowShortcuts(v => !v); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') { e.preventDefault(); if (!loading && !done && sessionId && !paused && hintsUsed < maxHints) requestHint(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') { e.preventDefault(); if (!done) setPaused(p => !p); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') { e.preventDefault(); if (!done && !paused && !loading) toggleVoice(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setWebcamOn(v => !v); }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [loading, done, sessionId, showShortcuts, showHint, paused, hintsUsed, maxHints, isListening]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const scroll = () => setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }), 100);
  const addMsg = (role, text, isTyping=false) => { setMessages(p => [...p, { role, text, isTyping, id: Date.now()+Math.random() }]); scroll(); };
  const rmTyping = () => setMessages(p => p.filter(m => !m.isTyping));

  const requestHint = async () => {
    if (hintLoading || !sessionId || hintsUsed >= maxHints) return;
    setHintLoading(true); playSound('hint');
    try {
      const res = await fetch('/api/interview/hint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ sessionId, resumeText: config.resumeText || '' }) });
      const data = await res.json();
      if (data.success) { setShowHint(data.hint); setHintsUsed(h => h + 1); }
      else setError(data.error || 'Failed to get hint.');
    } catch { setError('Failed to get hint.'); }
    setHintLoading(false);
  };

  const skipQuestion = () => {
    if (skipsUsed >= maxSkips || loading || done || !sessionId) return;
    setSkipsUsed(s => s + 1);
    sendAnswer('[SKIPPED] I would like to skip this question and move to the next one.');
  };

  const recoverSession = async (savedSessionId) => {
    setRecovering(true);
    try {
      const res = await fetch(`/api/interview/session/${savedSessionId}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.session && data.session.status === 'in_progress') {
        const session = data.session;
        setConfig(session.config);
        sessionStorage.setItem('interviewConfig', JSON.stringify(session.config));
        const restoredMessages = session.history
          .filter((m, i) => !(i === 0 && m.role === 'user' && m.content.includes('ready to begin')))
          .map(m => ({ role: m.role === 'assistant' ? 'interviewer' : 'user', text: m.content, isTyping: false, id: Date.now() + Math.random() }));
        setMessages(restoredMessages);
        setSessionId(savedSessionId);
        setQuestionCount(session.questionCount || 0);
        setSeconds(Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000));
        scroll();
        setRecovering(false);
        return true;
      }
    } catch {}
    localStorage.removeItem('activeInterviewSessionId');
    setRecovering(false);
    return false;
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const savedSessionId = localStorage.getItem('activeInterviewSessionId');
    if (savedSessionId) {
      recoverSession(savedSessionId).then(recovered => {
        if (!recovered) { if (!config.role) { navigate('/setup'); return; } startFreshInterview(); }
      });
      return;
    }
    if (!config.role) { navigate('/setup'); return; }
    startFreshInterview();
  }, []); // eslint-disable-line

  const startFreshInterview = async () => {
    setLoading(true); addMsg('interviewer', '...', true); playSound('start');
    try {
      const res = await fetch('/api/interview/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ role: config.role, experience: config.experience, difficulty: config.difficulty, type: config.type, questions: config.questions, resumeText: config.resumeText || '' }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      rmTyping(); addMsg('interviewer', data.reply);
      setSessionId(data.sessionId); setQuestionCount(data.questionCount || 0);
      sessionStorage.setItem('currentSessionId', data.sessionId);
      localStorage.setItem('activeInterviewSessionId', data.sessionId);
    } catch (e) { rmTyping(); setError(e.message || 'Failed to connect.'); }
    setLoading(false);
  };

  const sendAnswer = useCallback(async (answer) => {
    if (!answer.trim() || loading || done || !sessionId) return;
    setInput(''); setError(''); setVoiceInterim('');
    addMsg('user', answer); setLoading(true); setInputMode('text'); playSound('send');
    addMsg('interviewer', '...', true);
    try {
      const res = await fetch('/api/interview/message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ sessionId, answer, resumeText: config.resumeText || '' }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      rmTyping(); setQuestionCount(data.questionCount || questionCount);
      if (data.done) {
        setDone(true); localStorage.removeItem('activeInterviewSessionId'); playSound('end');
        if (data.reply) addMsg('interviewer', data.reply);
        addMsg('interviewer', '✅ Interview complete. Redirecting to your report...');
        const penalty = (hintsUsed * 2) + (skipsUsed * 5);
        const adjustedReport = { ...data.report };
        if (penalty > 0 && adjustedReport.overallScore) {
          adjustedReport.overallScore = Math.max(0, adjustedReport.overallScore - penalty);
          adjustedReport.penaltyNote = `Score adjusted: -${hintsUsed * 2} (${hintsUsed} hints) -${skipsUsed * 5} (${skipsUsed} skips)`;
        }
        sessionStorage.setItem('interviewReport', JSON.stringify({ ...adjustedReport, totalTime: fmt(seconds), config, hintsUsed, skipsUsed }));
        setTimeout(() => navigate('/report'), 2000);
      } else { addMsg('interviewer', data.reply); }
    } catch (e) { rmTyping(); setError(e.message || 'Connection error.'); }
    setLoading(false); inputRef.current?.focus();
  }, [loading, done, sessionId, questionCount, seconds, config, navigate, hintsUsed, skipsUsed]);

  const handleSend = useCallback(() => sendAnswer(input.trim()), [input, sendAnswer]);
  const handleCodeSubmit = useCallback((code) => sendAnswer(code), [sendAnswer]);
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); handleSend(); } };

  if (recovering) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-accent)' }}>
            <Brain size={22} className="text-white animate-pulse" />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Recovering your session...</p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Restoring your interview progress</p>
        </div>
      </div>
    );
  }

  const progressPct = Math.min((questionCount / totalQ) * 100, 100);
  const avgTimePerQ = questionCount > 0 ? Math.round(seconds / questionCount) : 0;
  const remainingQ = totalQ - questionCount;
  const estTimeLeft = remainingQ * (avgTimePerQ || 120);
  const displayInput = voiceInterim ? (input ? input + ' ' + voiceInterim : voiceInterim) : input;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>

      {/* Header */}
      <header className="glass shadow-sm flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
            <Brain size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{config.role}</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{config.experience} · {config.difficulty}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: `${phase.color}15`, border: `1px solid ${phase.color}30` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: phase.color }} />
            <span style={{ color: phase.color }}>{phase.name}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
            <span style={{ color: 'var(--color-accent)' }}>{questionCount}</span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>/{totalQ}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{ background: timerBg, border: `1px solid ${timerBorder}`, color: timerColor }}>
            <Clock size={12} className={seconds >= 3600 ? 'animate-pulse' : ''} />
            <span className="font-medium">{fmt(seconds)}</span>
          </div>
          {isListening && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium animate-pulse"
              style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', color: 'var(--color-danger)' }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC
            </div>
          )}
          {/* Webcam toggle */}
          <button onClick={() => setWebcamOn(v => !v)} title={webcamOn ? 'Turn off camera (Ctrl+K)' : 'Turn on camera (Ctrl+K)'}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: webcamOn ? 'rgba(52,199,89,0.1)' : 'var(--color-surface)',
              border: `1px solid ${webcamOn ? 'rgba(52,199,89,0.3)' : 'var(--color-border)'}`,
              color: webcamOn ? 'var(--color-success)' : 'var(--color-text-tertiary)',
            }}>
            {webcamOn ? <Video size={13} /> : <VideoOff size={13} />}
          </button>
          {/* Pause */}
          <button onClick={() => setPaused(p => !p)} title={paused ? 'Resume (Ctrl+P)' : 'Pause (Ctrl+P)'}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: paused ? 'rgba(52,199,89,0.1)' : 'var(--color-surface)',
              border: `1px solid ${paused ? 'rgba(52,199,89,0.3)' : 'var(--color-border)'}`,
              color: paused ? 'var(--color-success)' : 'var(--color-text-tertiary)',
            }}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button onClick={() => setShowShortcuts(v => !v)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hidden md:flex"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} title="Shortcuts (Ctrl+/)">
            <Keyboard size={13} style={{ color: 'var(--color-text-tertiary)' }} />
          </button>
          <button onClick={toggleTheme} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            {theme === 'dark' ? <Sun size={13} style={{ color: 'var(--color-warning)' }} /> : <Moon size={13} style={{ color: 'var(--color-text-secondary)' }} />}
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="h-1 flex-shrink-0" style={{ background: 'var(--color-border)' }}>
        <div className="h-full transition-all duration-700 ease-out" style={{ width: `${progressPct}%`, backgroundColor: phase.color }} />
      </div>

      {/* Timer bar */}
      {questionCount > 0 && !done && (
        <div className="flex items-center justify-between px-4 md:px-6 py-1.5 flex-shrink-0 text-[10px]"
          style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--color-text-tertiary)' }}>
              <Timer size={10} className="inline mr-1" />Avg: <span className="font-mono font-medium" style={{ color: 'var(--color-text-secondary)' }}>{fmt(avgTimePerQ)}</span>/q
            </span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>
              Est: <span className="font-mono font-medium" style={{ color: timerColor }}>{fmt(estTimeLeft)}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--color-text-tertiary)' }}>
              <Lightbulb size={10} className="inline mr-1" />Hints: <span className="font-medium" style={{ color: hintsUsed > 0 ? 'var(--color-warning)' : 'var(--color-text-secondary)' }}>{hintsUsed}/{maxHints}</span>
              <span className="ml-0.5 opacity-60">(-2ea)</span>
            </span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>
              <SkipForward size={10} className="inline mr-1" />Skips: <span className="font-medium" style={{ color: skipsUsed > 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}>{skipsUsed}/{maxSkips}</span>
              <span className="ml-0.5 opacity-60">(-5ea)</span>
            </span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>{remainingQ} left</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center gap-2 text-sm flex-shrink-0"
          style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>
          <AlertCircle size={14} /> {error}
          <button onClick={() => setError('')} className="ml-auto hover:opacity-70"><X size={14} /></button>
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-start gap-2 text-sm flex-shrink-0"
          style={{ background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.2)' }}>
          <Lightbulb size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-warning)' }} />
          <div className="flex-1">
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-warning)' }}>Hint (-2 points)</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>{showHint}</p>
          </div>
          <button onClick={() => setShowHint(null)} className="hover:opacity-70 flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }}><X size={14} /></button>
        </div>
      )}

      {/* Pause Overlay */}
      {paused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="card p-10 text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}>
              <Pause size={30} style={{ color: 'var(--color-accent)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Interview Paused</h2>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>Timer stopped. Take a break.</p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center"><p className="font-mono text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{fmt(seconds)}</p><p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Elapsed</p></div>
              <div className="text-center"><p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{questionCount}/{totalQ}</p><p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Questions</p></div>
            </div>
            <button onClick={() => setPaused(false)} className="btn-primary px-8 py-3 text-sm font-semibold inline-flex items-center gap-2">
              <Play size={14} /> Resume Interview
            </button>
            <p className="text-[10px] mt-3" style={{ color: 'var(--color-text-tertiary)' }}>Ctrl+P to toggle</p>
          </div>
        </div>
      )}

      {/* Chat */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                style={{
                  background: msg.role === 'interviewer' ? 'var(--color-accent-light)' : 'rgba(52,199,89,0.12)',
                  color: msg.role === 'interviewer' ? 'var(--color-accent)' : 'var(--color-success)',
                  border: `1px solid ${msg.role === 'interviewer' ? 'var(--color-accent)' : 'var(--color-success)'}25`,
                }}>
                {msg.role === 'interviewer' ? 'AI' : 'ME'}
              </div>
              <div className={`max-w-[78%] px-5 py-3.5 text-sm leading-relaxed ${msg.role === 'user' ? 'rounded-2xl rounded-tr-md' : 'rounded-2xl rounded-tl-md'}`}
                style={{
                  background: msg.role === 'interviewer' ? 'var(--color-card-bg)' : 'var(--color-accent)',
                  border: `1px solid ${msg.role === 'interviewer' ? 'var(--color-card-border)' : 'var(--color-accent)'}`,
                  color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                }}>
                {msg.isTyping ? (
                  <div className="flex gap-1.5 items-center py-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-text-tertiary)', animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-text-tertiary)', animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--color-text-tertiary)', animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <MarkdownMessage content={msg.text} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="glass shadow-up px-4 md:px-6 py-4 flex-shrink-0 z-20" style={{ borderTop: '1px solid var(--color-border)' }}>
        {done ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="animate-pulse">Generating your report</span>
            <ChevronRight size={14} className="animate-pulse" />
          </div>
        ) : paused ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <Pause size={14} /> Paused — click Resume to continue
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {showCodeHint && (
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setInputMode('text')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ background: inputMode === 'text' ? 'var(--color-accent-light)' : 'var(--color-surface)', color: inputMode === 'text' ? 'var(--color-accent)' : 'var(--color-text-secondary)', border: `1px solid ${inputMode === 'text' ? 'var(--color-accent)' : 'var(--color-border)'}` }}>
                  <MessageSquare size={12} /> Text
                </button>
                <button onClick={() => setInputMode('code')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ background: inputMode === 'code' ? 'var(--color-accent-light)' : 'var(--color-surface)', color: inputMode === 'code' ? 'var(--color-accent)' : 'var(--color-text-secondary)', border: `1px solid ${inputMode === 'code' ? 'var(--color-accent)' : 'var(--color-border)'}` }}>
                  <Code2 size={12} /> Code Editor
                </button>
                <span className="text-[10px] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>Coding question detected</span>
              </div>
            )}

            {inputMode === 'code' ? (
              <CodeEditor onSubmit={handleCodeSubmit} disabled={loading} />
            ) : (
              <div className="flex gap-3 items-end">
                {isListening && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-0 flex-shrink-0"
                    style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)' }}>
                    <div className="flex gap-0.5 items-center">
                      {[0,1,2,3,4].map(i => (
                        <div key={i} className="w-1 rounded-full animate-pulse"
                          style={{ height: `${8 + Math.random() * 12}px`, background: 'var(--color-danger)', animationDelay: `${i * 100}ms`, animationDuration: `${400 + i * 100}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <textarea ref={inputRef} value={displayInput} onChange={e => { setInput(e.target.value); setVoiceInterim(''); }} onKeyDown={handleKey}
                  disabled={loading} rows={3}
                  placeholder={isListening ? 'Listening... speak now' : loading ? 'Interviewer is thinking...' : 'Type or use mic...'}
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all disabled:opacity-50"
                  style={{ background: 'var(--color-surface)', border: `1px solid ${isListening ? 'rgba(255,59,48,0.3)' : 'var(--color-border)'}`, color: 'var(--color-text-primary)' }} />
                <div className="flex flex-col gap-2">
                  {voiceSupported && (
                    <button onClick={toggleVoice} disabled={loading} title={isListening ? 'Stop (Ctrl+M)' : 'Mic (Ctrl+M)'}
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background: isListening ? 'var(--color-danger)' : 'var(--color-surface)', color: isListening ? 'white' : 'var(--color-text-secondary)', border: `1px solid ${isListening ? 'var(--color-danger)' : 'var(--color-border)'}`, cursor: loading ? 'not-allowed' : 'pointer' }}>
                      {isListening ? <Square size={14} /> : <Mic size={16} />}
                    </button>
                  )}
                  <button onClick={requestHint} disabled={hintLoading || hintsUsed >= maxHints || loading} title={`Hint (${maxHints - hintsUsed} left)`}
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: hintLoading ? 'rgba(255,149,0,0.15)' : 'var(--color-surface)', color: hintsUsed >= maxHints ? 'var(--color-text-tertiary)' : 'var(--color-warning)', border: `1px solid ${hintsUsed >= maxHints ? 'var(--color-border)' : 'rgba(255,149,0,0.3)'}`, cursor: hintsUsed >= maxHints ? 'not-allowed' : 'pointer', opacity: hintsUsed >= maxHints ? 0.5 : 1 }}>
                    <Lightbulb size={16} className={hintLoading ? 'animate-pulse' : ''} />
                  </button>
                  <button onClick={handleSend} disabled={!input.trim() || loading}
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: !input.trim() || loading ? 'var(--color-surface)' : 'var(--color-accent)', color: !input.trim() || loading ? 'var(--color-text-tertiary)' : 'white', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', border: `1px solid ${!input.trim() || loading ? 'var(--color-border)' : 'var(--color-accent)'}` }}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {isListening ? 'Speaking... click ■ or Esc to stop' : 'Enter send · Shift+Enter newline · Ctrl+M mic · Ctrl+K camera'}
                </p>
                {skipsUsed < maxSkips && !loading && (
                  <button onClick={skipQuestion} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(255,59,48,0.08)', color: 'var(--color-danger)', border: '1px solid rgba(255,59,48,0.2)' }}>
                    <SkipForward size={10} /> Skip ({maxSkips - skipsUsed} left, -5pts)
                  </button>
                )}
              </div>
              <button onClick={() => setShowShortcuts(v => !v)} className="text-[10px] hidden md:flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-text-tertiary)' }}>
                <Keyboard size={10} /> Ctrl+/
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Webcam */}
      <InterviewWebcam enabled={webcamOn} />

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <div className="card p-8 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}>
                  <Keyboard size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Shortcuts</h2>
              </div>
              <button onClick={() => setShowShortcuts(false)} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                <X size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                ['Enter', 'Send answer'],
                ['Shift + Enter', 'New line'],
                ['Ctrl + Enter', 'Send (alternative)'],
                ['Ctrl + M', 'Toggle voice input'],
                ['Ctrl + K', 'Toggle camera'],
                ['Ctrl + H', 'Get hint'],
                ['Ctrl + P', 'Pause / Resume'],
                ['Escape', 'Clear / Close / Stop mic'],
                ['Ctrl + /', 'Toggle this menu'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{desc}</span>
                  <kbd className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
            <button onClick={() => setShowShortcuts(false)} className="w-full mt-6 py-2.5 rounded-xl text-sm transition-all hover:opacity-70"
              style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}