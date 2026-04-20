import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Send, Clock, Volume2, VolumeX, Video, VideoOff, Brain, X, AlertCircle, ChevronRight, Square, Lightbulb, SkipForward, Pause, Play } from 'lucide-react';

const INTERVIEWERS = {
  female: {
    name: 'Margaret Hamilton', title: 'Senior Technical Interviewer', company: 'ex-NASA', initials: 'MH',
    skinColor: '#fde8d0', skinDark: '#f4c99a', skinDarker: '#e8b48a', hairColor: '#3d1f00',
    shirtColor: '#6d28d9', shirtDark: '#7c3aed', eyeColor: '#5b3a8a',
    voiceKeywords: ['Google UK English Female', 'Microsoft Zira', 'Samantha', 'Karen', 'Moira'],
    pitch: 1.15, rate: 0.9,
  },
  male: {
    name: 'Linus Torvalds', title: 'Lead Engineering Interviewer', company: 'ex-Linux Foundation', initials: 'LT',
    skinColor: '#f5d5b0', skinDark: '#e8b87a', skinDarker: '#d4a060', hairColor: '#1a0a00',
    shirtColor: '#1e3a5f', shirtDark: '#2563eb', eyeColor: '#2d4a7a',
    voiceKeywords: ['Google UK English Male', 'Microsoft David', 'Alex', 'Daniel', 'Male'],
    pitch: 0.9, rate: 0.88,
  },
};

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

// ── Gender Select ─────────────────────────────────────────────────────────────
function GenderSelect({ onSelect }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif", padding: 24 }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 30% 50%, #1e1b4b22, transparent 60%), radial-gradient(ellipse at 70% 30%, #312e8122, transparent 60%)' }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Avatar Interview</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>Choose Your Interviewer</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Select who will conduct your interview today</p>
      </div>
      <div style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(INTERVIEWERS).map(([gender, info]) => (
          <button key={gender} onClick={() => onSelect(gender)}
            style={{ background: '#07071a', border: '1px solid #1e1b4b', borderRadius: 20, padding: '32px 40px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transition: 'all 0.2s', width: 220 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#0d0d2b'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1b4b'; e.currentTarget.style.background = '#07071a'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ width: 100, height: 100 }}><MiniAvatar gender={gender} info={info} /></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{info.name}</div>
              <div style={{ fontSize: 12, color: '#6366f1', marginBottom: 4 }}>{info.title}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{info.company}</div>
            </div>
            <div style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', fontSize: 13, fontWeight: 600 }}>
              Select {gender === 'female' ? 'Her' : 'Him'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Mini Avatar ───────────────────────────────────────────────────────────────
function MiniAvatar({ gender, info }) {
  return (
    <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id={`mini-face-${gender}`} cx="50%" cy="45%" r="55%"><stop offset="0%" stopColor={info.skinColor} /><stop offset="100%" stopColor={info.skinDark} /></radialGradient>
        <radialGradient id={`mini-bg-${gender}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#0f0e1e" /></radialGradient>
      </defs>
      <circle cx="80" cy="80" r="78" fill={`url(#mini-bg-${gender})`} />
      <circle cx="80" cy="80" r="78" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.4" />
      <rect x="68" y="118" width="24" height="20" rx="8" fill={info.skinDark} />
      <ellipse cx="80" cy="148" rx="42" ry="16" fill={info.shirtColor} />
      <path d="M 55 138 L 80 130 L 105 138 L 122 160 L 38 160 Z" fill={info.shirtDark} />
      <ellipse cx="80" cy="78" rx="44" ry="48" fill={`url(#mini-face-${gender})`} />
      {gender === 'female' ? (<><ellipse cx="80" cy="32" rx="46" ry="20" fill={info.hairColor} /><ellipse cx="34" cy="70" rx="10" ry="30" fill={info.hairColor} /><ellipse cx="126" cy="70" rx="10" ry="30" fill={info.hairColor} /><path d="M 36 55 Q 80 45 124 55" fill={info.hairColor} /></>) : (<><ellipse cx="80" cy="36" rx="44" ry="18" fill={info.hairColor} /><rect x="36" y="36" width="88" height="14" fill={info.hairColor} /><ellipse cx="36" cy="52" rx="8" ry="18" fill={info.hairColor} /><ellipse cx="124" cy="52" rx="8" ry="18" fill={info.hairColor} /></>)}
      <ellipse cx="61" cy="68" rx="9" ry="9" fill="white" /><ellipse cx="99" cy="68" rx="9" ry="9" fill="white" />
      <ellipse cx="62" cy="69" rx="5.5" ry="5.5" fill={info.eyeColor} /><ellipse cx="63" cy="68" rx="2.5" ry="2.5" fill="#1a1040" />
      <ellipse cx="100" cy="69" rx="5.5" ry="5.5" fill={info.eyeColor} /><ellipse cx="101" cy="68" rx="2.5" ry="2.5" fill="#1a1040" />
      <path d="M 60 80 Q 80 90 100 80" stroke="#c0785a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── Avatar Face ───────────────────────────────────────────────────────────────
function AvatarFace({ speaking, emotion = 'neutral', gender = 'female' }) {
  const info = INTERVIEWERS[gender];
  const mouthVariants = { neutral: 'M 60 80 Q 80 88 100 80', happy: 'M 55 78 Q 80 96 105 78', thinking: 'M 62 82 Q 80 80 98 82', speaking: 'M 58 78 Q 80 95 102 78' };
  const [mouthPath, setMouthPath] = useState(mouthVariants.neutral);
  const [blinkLeft, setBlinkLeft] = useState(false);
  const [blinkRight, setBlinkRight] = useState(false);
  const speakFrameRef = useRef(null);

  useEffect(() => {
    const blink = () => { setBlinkLeft(true); setBlinkRight(true); setTimeout(() => { setBlinkLeft(false); setBlinkRight(false); }, 120); };
    const id = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (speaking) {
      const paths = ['M 58 78 Q 80 98 102 78', 'M 60 80 Q 80 86 100 80', 'M 57 77 Q 80 100 103 77', 'M 62 82 Q 80 88 98 82', 'M 56 76 Q 80 102 104 76', 'M 61 81 Q 80 84 99 81'];
      let i = 0;
      speakFrameRef.current = setInterval(() => { setMouthPath(paths[i % paths.length]); i++; }, 120);
    } else {
      clearInterval(speakFrameRef.current);
      setMouthPath(mouthVariants[emotion] || mouthVariants.neutral);
    }
    return () => clearInterval(speakFrameRef.current);
  }, [speaking, emotion]);

  return (
    <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="faceGrad" cx="50%" cy="45%" r="55%"><stop offset="0%" stopColor={info.skinColor} /><stop offset="100%" stopColor={info.skinDark} /></radialGradient>
        <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f9a8a8" stopOpacity="0.6" /><stop offset="100%" stopColor="#f9a8a8" stopOpacity="0" /></radialGradient>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#0f0e1e" /></radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <circle cx="80" cy="80" r="78" fill="url(#bgGrad)" />
      <circle cx="80" cy="80" r="78" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.4" />
      {speaking && (<circle cx="80" cy="80" r="76" fill="none" stroke="#818cf8" strokeWidth="2" opacity="0.6" filter="url(#glow)"><animate attributeName="r" values="74;78;74" dur="0.8s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.8s" repeatCount="indefinite" /></circle>)}
      <rect x="68" y="118" width="24" height="20" rx="8" fill={info.skinDark} />
      <ellipse cx="80" cy="148" rx="42" ry="16" fill={info.shirtColor} />
      <path d="M 55 138 L 80 130 L 105 138 L 122 160 L 38 160 Z" fill={info.shirtDark} />
      {gender === 'female' && <path d="M 73 130 L 80 138" stroke={info.shirtColor} strokeWidth="2" opacity="0.5" />}
      {gender === 'male' && <path d="M 73 130 L 80 142 L 87 130" fill="none" stroke="#3b82f6" strokeWidth="1.5" />}
      <ellipse cx="80" cy="78" rx="44" ry="48" fill="url(#faceGrad)" />
      {gender === 'female' ? (<><ellipse cx="80" cy="32" rx="46" ry="20" fill={info.hairColor} /><ellipse cx="34" cy="70" rx="10" ry="32" fill={info.hairColor} /><ellipse cx="126" cy="70" rx="10" ry="32" fill={info.hairColor} /><path d="M 36 55 Q 80 45 124 55" fill={info.hairColor} /></>) : (<><ellipse cx="80" cy="36" rx="44" ry="18" fill={info.hairColor} /><rect x="36" y="36" width="88" height="14" fill={info.hairColor} /><ellipse cx="36" cy="52" rx="8" ry="18" fill={info.hairColor} /><ellipse cx="124" cy="52" rx="8" ry="18" fill={info.hairColor} /></>)}
      <ellipse cx="36" cy="80" rx="7" ry="9" fill={info.skinDark} /><ellipse cx="124" cy="80" rx="7" ry="9" fill={info.skinDark} />
      <ellipse cx="36" cy="80" rx="4" ry="5.5" fill={info.skinDarker} /><ellipse cx="124" cy="80" rx="4" ry="5.5" fill={info.skinDarker} />
      {gender === 'female' ? (<><path d="M 52 54 Q 62 50 70 53" stroke={info.hairColor} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M 90 53 Q 98 50 108 54" stroke={info.hairColor} strokeWidth="2" fill="none" strokeLinecap="round" /></>) : (<><path d="M 52 56 Q 62 52 70 55" stroke={info.hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M 90 55 Q 98 52 108 56" stroke={info.hairColor} strokeWidth="2.5" fill="none" strokeLinecap="round" /></>)}
      <ellipse cx="61" cy="68" rx="9" ry={blinkLeft ? 1 : 9} fill="white" style={{ transition: 'ry 0.05s' }} />
      <ellipse cx="99" cy="68" rx="9" ry={blinkRight ? 1 : 9} fill="white" style={{ transition: 'ry 0.05s' }} />
      {!blinkLeft && <><ellipse cx="62" cy="69" rx="5.5" ry="5.5" fill={info.eyeColor} /><ellipse cx="63" cy="68" rx="2.5" ry="2.5" fill="#1a1040" /><ellipse cx="64.5" cy="66.5" rx="1.2" ry="1.2" fill="white" /></>}
      {!blinkRight && <><ellipse cx="100" cy="69" rx="5.5" ry="5.5" fill={info.eyeColor} /><ellipse cx="101" cy="68" rx="2.5" ry="2.5" fill="#1a1040" /><ellipse cx="102.5" cy="66.5" rx="1.2" ry="1.2" fill="white" /></>}
      {gender === 'male' && <><rect x="50" y="62" width="22" height="14" rx="5" fill="none" stroke="#4b3f72" strokeWidth="1.5" opacity="0.6" /><rect x="88" y="62" width="22" height="14" rx="5" fill="none" stroke="#4b3f72" strokeWidth="1.5" opacity="0.6" /><line x1="72" y1="68" x2="88" y2="68" stroke="#4b3f72" strokeWidth="1.5" opacity="0.6" /></>}
      <path d="M 78 72 Q 75 82 72 85 Q 80 88 88 85 Q 85 82 82 72" fill={info.skinDarker} opacity="0.4" />
      <ellipse cx="50" cy="88" rx="12" ry="7" fill="url(#cheekGrad)" opacity={gender === 'female' ? 1 : 0.4} />
      <ellipse cx="110" cy="88" rx="12" ry="7" fill="url(#cheekGrad)" opacity={gender === 'female' ? 1 : 0.4} />
      <path d={mouthPath} stroke={gender === 'female' ? '#e05a8a' : '#c0785a'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {speaking && <path d="M 62 82 Q 80 95 98 82 L 95 86 Q 80 96 65 86 Z" fill="white" opacity="0.9" />}
      {gender === 'female' && <><circle cx="29" cy="88" r="3" fill="#818cf8" /><circle cx="131" cy="88" r="3" fill="#818cf8" /></>}
    </svg>
  );
}

// ── Speaking Wave ─────────────────────────────────────────────────────────────
function SpeakingWave({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} style={{ width: 4, borderRadius: 2, background: active ? '#818cf8' : '#374151', animation: active ? `wave 0.8s ease-in-out ${i * 0.1}s infinite` : 'none', height: active ? 16 : 4, transition: 'height 0.2s, background 0.2s' }} />
      ))}
      <style>{`@keyframes wave { 0%,100%{height:6px} 50%{height:22px} }`}</style>
    </div>
  );
}

// ── Webcam Component ──────────────────────────────────────────────────────────
function Webcam({ enabled }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (enabled) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320, facingMode: 'user' }, audio: false })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error('Webcam error:', err));
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(circle, #10b98133 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1.5px solid #10b981', opacity: 0.4 }} />
      <div style={{ width: 160, height: 160, borderRadius: '50%', overflow: 'hidden', background: '#000', border: '2px solid #1e1b4b' }}>
        <video ref={videoRef} autoPlay muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 4, background: '#07071a', padding: '2px 10px', borderRadius: 10, border: '1px solid #1e1b4b' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontSize: 10, color: '#e2e8f0', fontWeight: 600 }}>You</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AvatarInterview() {
  const navigate = useNavigate();
  const [config] = useState(() => { try { return JSON.parse(sessionStorage.getItem('interviewConfig') || '{}'); } catch { return {}; } });

  const [gender, setGender] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState('neutral');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const [paused, setPaused] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [skipsUsed, setSkipsUsed] = useState(0);

  const chatRef = useRef();
  const inputRef = useRef();
  const timerRef = useRef();
  const startedRef = useRef(false);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const inputValueRef = useRef('');

  useEffect(() => { inputValueRef.current = input; }, [input]);

  const totalQ = parseInt(config.questions || '8');
  const maxHints = totalQ;
  const maxSkips = Math.max(1, Math.floor(totalQ / 3));
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const interviewer = gender ? INTERVIEWERS[gender] : null;

  // Timer with pause
  useEffect(() => {
    if (!gender || paused || done) return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [gender, paused, done]);

  const scroll = () => setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }), 50);

  // TTS
  const speak = useCallback((text) => {
    if (!voiceEnabled || !gender) return;
    synthRef.current.cancel();
    const info = INTERVIEWERS[gender];
    const clean = text.replace(/[*#_`~]/g, '').replace(/\n+/g, '. ');
    const utt = new SpeechSynthesisUtterance(clean);
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => info.voiceKeywords.some(kw => v.name.includes(kw)));
    if (preferred) utt.voice = preferred;
    utt.rate = info.rate;
    utt.pitch = info.pitch;
    utt.onstart = () => { setAvatarSpeaking(true); setAvatarEmotion('speaking'); };
    utt.onend = () => { setAvatarSpeaking(false); setAvatarEmotion('neutral'); };
    utt.onerror = () => { setAvatarSpeaking(false); setAvatarEmotion('neutral'); };
    synthRef.current.speak(utt);
  }, [voiceEnabled, gender]);

  const addMsg = (role, text, isTyping = false) => { setMessages(p => [...p, { role, text, isTyping, id: Date.now() + Math.random() }]); scroll(); };
  const rmTyping = () => setMessages(p => p.filter(m => !m.isTyping));

  // Init speech recognition
  useEffect(() => {
    if (!SpeechRecognitionAPI) return;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + ' ';
      }
      if (final.trim()) {
        const current = inputValueRef.current.trim();
        setInput((current ? current + ' ' : '') + final.trim());
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') setError('Microphone access denied.');
      if (event.error === 'aborted' || event.error === 'no-speech') return;
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        setTimeout(() => { try { recognition.start(); } catch {} }, 100);
      } else {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;
    return () => { shouldListenRef.current = false; try { recognition.stop(); } catch {} };
  }, []);

  const toggleListening = () => {
    if (!SpeechRecognitionAPI) { setError('Speech recognition not supported.'); return; }
    if (listening) {
      shouldListenRef.current = false;
      try { recognitionRef.current.stop(); } catch {}
      setListening(false);
    } else {
      shouldListenRef.current = true;
      setListening(true);
      synthRef.current.cancel();
      setAvatarSpeaking(false);
      setTimeout(() => { try { recognitionRef.current.start(); } catch (e) { setListening(false); shouldListenRef.current = false; } }, 150);
    }
  };

  // Stop mic when sending
  useEffect(() => {
    if ((loading || done) && listening) {
      shouldListenRef.current = false;
      try { recognitionRef.current?.stop(); } catch {}
      setListening(false);
    }
  }, [loading, done, listening]);

  // Start interview
  useEffect(() => {
    if (!gender || startedRef.current) return;
    startedRef.current = true;
    if (!config.role) { navigate('/setup'); return; }

    const init = async () => {
      setLoading(true);
      setAvatarEmotion('thinking');
      addMsg('interviewer', '...', true);
      try {
        const res = await fetch('/api/interview/start', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ role: config.role, experience: config.experience, difficulty: config.difficulty, type: config.type, questions: config.questions, resumeText: config.resumeText || '' }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        rmTyping();
        addMsg('interviewer', data.reply);
        setSessionId(data.sessionId);
        setQuestionCount(data.questionCount || 0);
        setAvatarEmotion('happy');
        setTimeout(() => speak(data.reply), 500);
        sessionStorage.setItem('currentSessionId', data.sessionId);
        localStorage.setItem('activeInterviewSessionId', data.sessionId);
      } catch (e) {
        rmTyping();
        setError(e.message || 'Failed to connect.');
        setAvatarEmotion('neutral');
      }
      setLoading(false);
    };
    init();
  }, [gender]); // eslint-disable-line

  // Hint
  const requestHint = async () => {
    if (!sessionId || hintsUsed >= maxHints || loading) return;
    try {
      const res = await fetch('/api/interview/hint', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ sessionId, resumeText: config.resumeText || '' }),
      });
      const data = await res.json();
      if (data.success) {
        setHintsUsed(h => h + 1);
        addMsg('interviewer', `💡 Hint: ${data.hint}`);
        speak(data.hint);
      }
    } catch {}
  };

  // Skip
  const skipQuestion = () => {
    if (skipsUsed >= maxSkips || loading || done) return;
    setSkipsUsed(s => s + 1);
    handleSendAnswer('[SKIPPED] I would like to skip this question.');
  };

  const handleSendAnswer = useCallback(async (answer) => {
    if (!answer?.trim() || loading || done || !sessionId) return;
    setInput(''); setError('');
    addMsg('user', answer);
    setLoading(true);
    setAvatarEmotion('thinking');
    addMsg('interviewer', '...', true);
    synthRef.current.cancel();
    setAvatarSpeaking(false);

    try {
      const res = await fetch('/api/interview/message', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ sessionId, answer, resumeText: config.resumeText || '' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      rmTyping();
      setQuestionCount(data.questionCount || questionCount);

      if (data.done) {
        setDone(true);
        localStorage.removeItem('activeInterviewSessionId');
        setAvatarEmotion('happy');
        if (data.reply) { addMsg('interviewer', data.reply); speak(data.reply); }
        addMsg('interviewer', '✅ Interview complete! Redirecting to your report...');
        const penalty = (hintsUsed * 2) + (skipsUsed * 5);
        const adjustedReport = { ...data.report };
        if (penalty > 0 && adjustedReport.overallScore) adjustedReport.overallScore = Math.max(0, adjustedReport.overallScore - penalty);
        sessionStorage.setItem('interviewReport', JSON.stringify({ ...adjustedReport, totalTime: fmt(seconds), config, hintsUsed, skipsUsed }));
        setTimeout(() => navigate('/report'), 3000);
      } else {
        setAvatarEmotion('neutral');
        addMsg('interviewer', data.reply);
        speak(data.reply);
      }
    } catch (e) {
      rmTyping();
      setError(e.message || 'Connection error.');
      setAvatarEmotion('neutral');
    }
    setLoading(false);
    inputRef.current?.focus();
  }, [loading, done, sessionId, questionCount, seconds, config, navigate, speak, hintsUsed, skipsUsed]);

  const handleSend = useCallback(() => handleSendAnswer(input.trim()), [input, handleSendAnswer]);
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const progress = Math.min((questionCount / totalQ) * 100, 100);

  if (!gender) return <GenderSelect onSelect={setGender} />;

  return (
    <div style={{ minHeight: '100vh', height: '100vh', background: '#050510', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 20% 50%, #1e1b4b22 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #312e8122 0%, transparent 60%)' }} />

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #1e1b4b', background: '#07071a', position: 'relative', zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>AI</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{config.role || 'Interview'}</div>
            <div style={{ fontSize: 10, color: '#6366f1' }}>with {interviewer?.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 60, height: 4, background: '#1e1b4b', borderRadius: 2 }}>
              <div style={{ height: '100%', borderRadius: 2, width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)', transition: 'width 0.5s' }} />
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{questionCount}/{totalQ}</span>
          </div>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: seconds >= 1800 ? '#f59e0b' : '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>
            <Clock size={12} />{fmt(seconds)}
          </div>
          {/* Hints/Skips */}
          <div style={{ fontSize: 10, color: '#64748b' }}>
            <Lightbulb size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />{hintsUsed}/{maxHints}
            <SkipForward size={10} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6, marginRight: 2 }} />{skipsUsed}/{maxSkips}
          </div>
          {/* Pause */}
          <button onClick={() => setPaused(p => !p)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${paused ? '#10b981' : '#1e1b4b'}`, background: paused ? '#10b98122' : '#07071a', color: paused ? '#10b981' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
          {/* Voice */}
          <button onClick={() => { setVoiceEnabled(v => !v); synthRef.current.cancel(); setAvatarSpeaking(false); }} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${voiceEnabled ? '#6366f1' : '#374151'}`, background: voiceEnabled ? '#1e1b4b' : '#1f2937', color: voiceEnabled ? '#818cf8' : '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          </button>
          {/* Webcam */}
          <button onClick={() => setWebcamOn(v => !v)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${webcamOn ? '#10b981' : '#374151'}`, background: webcamOn ? '#10b98122' : '#1f2937', color: webcamOn ? '#10b981' : '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {webcamOn ? <Video size={12} /> : <VideoOff size={12} />}
          </button>
        </div>
      </header>

      {/* Pause overlay */}
      {paused && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#0d0d2b', border: '1px solid #1e1b4b', borderRadius: 20, padding: 48, textAlign: 'center', maxWidth: 360 }}>
            <Pause size={40} style={{ color: '#6366f1', marginBottom: 16 }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>Interview Paused</h2>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Timer stopped. Take a break.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
              <div style={{ textAlign: 'center' }}><p style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{fmt(seconds)}</p><p style={{ fontSize: 10, color: '#64748b' }}>Elapsed</p></div>
              <div style={{ textAlign: 'center' }}><p style={{ fontSize: 24, fontWeight: 700, color: '#e2e8f0' }}>{questionCount}/{totalQ}</p><p style={{ fontSize: 10, color: '#64748b' }}>Questions</p></div>
            </div>
            <button onClick={() => setPaused(false)} style={{ padding: '12px 32px', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Play size={14} /> Resume
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* LEFT — Avatar + Webcam */}
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid #1e1b4b', background: '#07071a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', gap: 16, overflowY: 'auto' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', width: 180, height: 180 }}>
            <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', background: avatarSpeaking ? 'radial-gradient(circle, #6366f133 0%, transparent 70%)' : 'radial-gradient(circle, #1e1b4b44 0%, transparent 70%)', transition: 'background 0.3s' }} />
            <AvatarFace speaking={avatarSpeaking} emotion={avatarEmotion} gender={gender} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{interviewer?.name}</div>
            <div style={{ fontSize: 11, color: '#6366f1', marginBottom: 2 }}>{interviewer?.title}</div>
            <div style={{ fontSize: 10, color: '#475569', marginBottom: 8 }}>{interviewer?.company}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: avatarSpeaking ? '#818cf8' : loading ? '#f59e0b' : '#10b981', boxShadow: avatarSpeaking ? '0 0 8px #818cf8' : 'none', animation: (avatarSpeaking || loading) ? 'pulse 1s infinite' : 'none' }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{avatarSpeaking ? 'Speaking...' : loading ? 'Thinking...' : 'Listening'}</span>
              <SpeakingWave active={avatarSpeaking} />
            </div>
          </div>

          {/* Webcam */}
          <Webcam enabled={webcamOn} />

          {!webcamOn && (
            <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
              <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1.5px dashed #1e1b4b' }} />
              <button onClick={() => setWebcamOn(true)} style={{ width: 160, height: 160, borderRadius: '50%', border: '1px dashed #1e1b4b', background: '#0d0d2b', color: '#64748b', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Video size={20} />
                <span style={{ fontSize: 11 }}>Turn on camera</span>
              </button>
            </div>
          )}

          <div style={{ width: '100%', height: 1, background: '#1e1b4b' }} />

          {/* Info cards */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Type', value: config.type || 'Mixed' },
              { label: 'Difficulty', value: config.difficulty || 'Medium' },
              { label: 'Progress', value: `${questionCount} / ${totalQ}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#0d0d2b', borderRadius: 6, border: '1px solid #1e1b4b' }}>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{label}</span>
                <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 500, textTransform: 'capitalize' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ width: '100%', padding: '10px 12px', background: '#0d0d2b', borderRadius: 8, border: '1px solid #1e1b4b' }}>
            <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 600, marginBottom: 4 }}>💡 TIPS</div>
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
              • Speak clearly at normal pace<br />
              • Think out loud — show reasoning<br />
              • Ask clarifying questions if needed<br />
              • Use STAR method for behavioral
            </div>
          </div>
        </div>

        {/* RIGHT — Chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {error && (
            <div style={{ margin: '10px 16px 0', padding: '10px 14px', background: '#7f1d1d22', border: '1px solid #ef444444', borderRadius: 10, color: '#f87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={14} /> {error}
              <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><X size={14} /></button>
            </div>
          )}

          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: msg.role === 'interviewer' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                  {msg.role === 'interviewer' ? interviewer?.initials : 'ME'}
                </div>
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.65,
                  ...(msg.role === 'interviewer' ? { background: '#0d0d2b', border: '1px solid #1e1b4b', color: '#e2e8f0', borderTopLeftRadius: 4 } : { background: '#064e3b22', border: '1px solid #10b98144', color: '#6ee7b7', borderTopRightRadius: 4 }),
                }}>
                  {msg.isTyping ? (
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '2px 0' }}>
                      {[0, 1, 2].map(i => (<div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />))}
                    </div>
                  ) : (
                    <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #1e1b4b', background: '#07071a', flexShrink: 0 }}>
            {done ? (
              <div style={{ textAlign: 'center', color: '#818cf8', fontSize: 14, padding: 8, animation: 'pulse 1.5s infinite' }}>✨ Generating your report...</div>
            ) : paused ? (
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 8 }}><Pause size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Paused — click Resume to continue</div>
            ) : (
              <>
                {listening && (
                  <div style={{ padding: '6px 10px', marginBottom: 8, background: '#ef444418', borderRadius: 8, border: '1px solid #ef444444', fontSize: 12, color: '#f87171', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
                    Listening... speak your answer
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                    disabled={loading} rows={2}
                    placeholder={listening ? 'Listening...' : loading ? 'Thinking...' : 'Type your answer...'}
                    style={{ flex: 1, background: '#0d0d2b', border: `1px solid ${listening ? '#ef444466' : '#1e1b4b'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e2e8f0', resize: 'none', outline: 'none', lineHeight: 1.5, opacity: loading ? 0.5 : 1, transition: 'border-color 0.2s', fontFamily: "'Segoe UI', sans-serif" }}
                    onFocus={e => { if (!listening) e.target.style.borderColor = '#6366f1'; }}
                    onBlur={e => { if (!listening) e.target.style.borderColor = '#1e1b4b'; }} />
                  {/* Hint */}
                  <button onClick={requestHint} disabled={hintsUsed >= maxHints || loading}
                    title={`Hint (${maxHints - hintsUsed} left, -2pts)`}
                    style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${hintsUsed >= maxHints ? '#1e1b4b' : '#f59e0b44'}`, background: '#0d0d2b', color: hintsUsed >= maxHints ? '#374151' : '#f59e0b', cursor: hintsUsed >= maxHints ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hintsUsed >= maxHints ? 0.5 : 1 }}>
                    <Lightbulb size={16} />
                  </button>
                  {/* Mic */}
                  <button onClick={toggleListening} disabled={loading}
                    style={{ width: 40, height: 40, borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: listening ? 'linear-gradient(135deg, #ef4444, #dc2626)' : '#1e1b4b', color: listening ? '#fff' : '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 16px #ef444466' : 'none' }}>
                    {listening ? <Square size={14} /> : <Mic size={16} />}
                  </button>
                  {/* Send */}
                  <button onClick={handleSend} disabled={!input.trim() || loading}
                    style={{ width: 40, height: 40, borderRadius: 10, border: 'none', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer', background: (!input.trim() || loading) ? '#1e1b4b' : 'linear-gradient(135deg, #6366f1, #818cf8)', color: (!input.trim() || loading) ? '#374151' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: (!input.trim() || loading) ? 'none' : '0 4px 16px #6366f166' }}>
                    <Send size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: '#374151' }}>🎙️ Mic · ⌨️ Type · Enter to send</span>
                  {skipsUsed < maxSkips && !loading && (
                    <button onClick={skipQuestion} style={{ fontSize: 10, color: '#ef4444', background: '#ef444412', border: '1px solid #ef444433', padding: '3px 8px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <SkipForward size={10} /> Skip (-5pts, {maxSkips - skipsUsed} left)
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#07071a}
        ::-webkit-scrollbar-thumb{background:#1e1b4b;border-radius:3px}
      `}</style>
    </div>
  );
}