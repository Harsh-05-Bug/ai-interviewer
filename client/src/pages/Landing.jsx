import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, FileText, Mic, BarChart3, Zap, Shield, History, BookOpen, Terminal, Sun, Moon, Code2, Cpu, Globe, Sparkles, User, LogOut, Trophy, Building, MessageSquare, MoreVertical, X, Mail, Award, Play, ArrowUpRight, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function useTypewriter(words, sp = 90, dl = 45, ps = 2000) {
  const [t, sT] = useState('');
  const [i, sI] = useState(0);
  const [d, sD] = useState(false);
  useEffect(() => {
    const w = words[i];
    const tm = setTimeout(() => {
      if (!d) { sT(w.substring(0, t.length + 1)); if (t === w) { setTimeout(() => sD(true), ps); return; } }
      else { sT(w.substring(0, t.length - 1)); if (t === '') { sD(false); sI((i + 1) % words.length); } }
    }, d ? dl : sp);
    return () => clearTimeout(tm);
  }, [t, d, i, words, sp, dl, ps]);
  return t;
}

function Ct({ to, sx = '' }) {
  const [n, sN] = useState(0);
  const r = useRef(null);
  const [go, sG] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) sG(true); }, { threshold: 0.5 }); if (r.current) o.observe(r.current); return () => o.disconnect(); }, []);
  useEffect(() => { if (!go) return; const num = parseInt(to) || 0; if (!num) { sN(0); return; } let c = 0; const inc = num / 30; const t = setInterval(() => { c += inc; if (c >= num) { sN(num); clearInterval(t); } else sN(Math.floor(c)); }, 55); return () => clearInterval(t); }, [go, to]);
  return <span ref={r}>{n}{sx}</span>;
}

function Dots({ nav, user }) {
  const [o, sO] = useState(false);
  const r = useRef(null);
  useEffect(() => { const h = e => { if (r.current && !r.current.contains(e.target)) sO(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const g = p => { nav(p); sO(false); };
  const items = [
    ...(user ? [{ ic: User, lb: 'Dashboard', pt: '/dashboard', hi: true }] : []),
    { ic: Terminal, lb: 'Compiler', pt: '/compiler' },
    { ic: History, lb: 'History', pt: '/history' },
    { ic: Building, lb: 'Reviews', pt: '/reviews' },
    { ic: MessageSquare, lb: 'Forum', pt: '/forum' },
    { ic: Users, lb: 'Study Rooms', pt: '/study-rooms' },
    { ic: Award, lb: 'Leaderboard', pt: '/leaderboard' },
    { ic: BookOpen, lb: 'Questions', pt: '/questions' },
    { ic: Mail, lb: 'Contact', pt: '/contact' },
  ];
  return (
    <div className="relative" ref={r}>
      <button onClick={() => sO(!o)} style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: o ? '#00F0B5' : 'var(--color-surface)', border: '1px solid var(--color-border)', color: o ? '#000' : 'var(--color-text-tertiary)', transition: 'all .25s', cursor: 'pointer' }}>
        {o ? <X size={14} /> : <MoreVertical size={14} />}
      </button>
      {o && (<>
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => sO(false)} />
        <div style={{ position: 'absolute', right: 0, top: 48, width: 240, borderRadius: 14, overflow: 'hidden', background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', boxShadow: '0 30px 60px rgba(0,0,0,.5)', zIndex: 50, animation: 'ddIn .18s ease' }}>
          <style>{`@keyframes ddIn{from{opacity:0;transform:translateY(-5px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
          <div style={{ padding: '10px 0' }}>
            {items.map(it => (
              <button key={it.pt} onClick={() => g(it.pt)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', fontSize: 13, color: it.hi ? '#00F0B5' : 'var(--color-text-secondary)', fontWeight: it.hi ? 600 : 400, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <it.ic size={14} style={{ color: it.hi ? '#00F0B5' : 'var(--color-text-tertiary)', flexShrink: 0 }} />{it.lb}
              </button>
            ))}
          </div>
        </div>
      </>)}
    </div>
  );
}

function ImmersiveBackground() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const handleMouse = useCallback((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMouse({ x, y });
  }, []);
  useEffect(() => { window.addEventListener('mousemove', handleMouse); return () => window.removeEventListener('mousemove', handleMouse); }, [handleMouse]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', perspective: '1000px' }}>
      <div style={{ position: 'absolute', inset: '-40px', transform: `translate3d(${mouse.x * -15}px, ${mouse.y * -15}px, 0) scale(1.08)`, transition: 'transform 0.3s ease-out' }}>
        <img src="/hero-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) contrast(1.3) saturate(0.5)' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${mouse.x * -25}px, ${mouse.y * -25}px, 50px)`, transition: 'transform 0.4s ease-out' }}>
        {[{ x:'15%',y:'20%',size:200,color:'#00F0B5',delay:0 },{ x:'75%',y:'30%',size:150,color:'#0066FF',delay:2 },{ x:'60%',y:'70%',size:180,color:'#00F0B5',delay:4 },{ x:'30%',y:'80%',size:120,color:'#0088FF',delay:1 },{ x:'85%',y:'60%',size:100,color:'#00CCFF',delay:3 }].map((orb, i) => (
          <div key={i} style={{ position:'absolute', left:orb.x, top:orb.y, width:orb.size, height:orb.size, borderRadius:'50%', background:`radial-gradient(circle,${orb.color}15 0%,transparent 70%)`, filter:'blur(40px)', animation:`orbFloat ${8+i*2}s ease-in-out ${orb.delay}s infinite` }} />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${mouse.x * -35}px, ${mouse.y * -35}px, 100px)`, transition: 'transform 0.5s ease-out' }}>
        {[...Array(40)].map((_, i) => (
          <div key={i} style={{ position:'absolute', left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, width:1.5+Math.random()*2.5, height:1.5+Math.random()*2.5, borderRadius:'50%', background:i%3===0?'#00F0B5':'#fff', opacity:0.3+Math.random()*0.5, animation:`starTwinkle ${2+Math.random()*4}s ease-in-out ${Math.random()*3}s infinite`, boxShadow:i%3===0?'0 0 6px #00F0B5':'0 0 4px rgba(255,255,255,0.5)' }} />
        ))}
      </div>
      <div style={{ position:'absolute', inset:0, transform:`translate3d(${mouse.x*-10}px,${mouse.y*-10}px,30px)`, transition:'transform 0.3s ease-out' }}>
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{ position:'absolute', left:`${15+i*14}%`, top:0, bottom:0, width:1, background:`linear-gradient(to bottom,transparent,${i%2===0?'#00F0B5':'#0088FF'}08,transparent)`, animation:`rayPulse ${6+i*1.5}s ease-in-out ${i*0.8}s infinite`, opacity:0.4 }} />
        ))}
      </div>
      <div style={{ position:'absolute', inset:0 }}>
        {[...Array(15)].map((_,i) => (
          <div key={i} style={{ position:'absolute', left:`${5+Math.random()*90}%`, bottom:'-5%', width:2+Math.random()*3, height:2+Math.random()*3, borderRadius:'50%', background:i%2===0?'#00F0B5':'#66DDFF', animation:`particleRise ${8+Math.random()*12}s linear ${Math.random()*8}s infinite`, opacity:0.2+Math.random()*0.4 }} />
        ))}
      </div>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,transparent 40%,var(--color-bg-primary) 100%),linear-gradient(to bottom,transparent 50%,var(--color-bg-primary) 98%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:120, background:'linear-gradient(to bottom,var(--color-bg-primary),transparent)', opacity:0.5, pointerEvents:'none' }} />
    </div>
  );
}

const WORDS = ['tech interview', 'DSA round', 'system design', 'coding round', 'FAANG loop'];
const COS = ['Google','Amazon','Microsoft','Meta','Apple','Flipkart','Razorpay','PhonePe','Swiggy','CRED','TCS','Infosys','Wipro','Goldman Sachs','Uber','Netflix'];

export default function Landing() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState(null);
  const [fab, setFab] = useState(false);
  const typed = useTypewriter(WORDS);

  useEffect(() => {
    fetch('/api/interview/stats', { credentials: 'include' }).then(r => r.json()).then(d => { if (d.success) setStats(d.stats); }).catch(() => {});
    const hs = () => setFab(window.scrollY > 500);
    window.addEventListener('scroll', hs);
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } }); }, { threshold: 0.06 });
    setTimeout(() => document.querySelectorAll('.rv').forEach(el => obs.observe(el)), 150);
    return () => { window.removeEventListener('scroll', hs); obs.disconnect(); };
  }, []);

  const sel = stats?.verdictBreakdown?.find(v => v._id?.toLowerCase().includes('selected'))?.count || 0;
  const comp = stats?.completedSessions || 0;
  const rate = comp > 0 ? Math.round((sel / comp) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', overflowX: 'hidden' }}>
      <style>{`
        .rv{opacity:0;transform:translateY(35px);transition:all .75s cubic-bezier(.22,1,.36,1)}
        .tw-cursor::after{content:'|';color:#00F0B5;animation:twb .6s step-end infinite;margin-left:2px;font-weight:300}
        @keyframes twb{50%{opacity:0}}
        .mq{animation:mq 35s linear infinite}
        @keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .fab-pop{animation:fp .4s cubic-bezier(.34,1.56,.64,1)}
        @keyframes fp{0%{opacity:0;transform:scale(.5)}100%{opacity:1;transform:scale(1)}}
        @keyframes orbFloat{0%,100%{transform:translateY(0) scale(1);opacity:0.4}50%{transform:translateY(-30px) scale(1.15);opacity:0.7}}
        @keyframes starTwinkle{0%,100%{opacity:0.2;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
        @keyframes rayPulse{0%,100%{opacity:0.1;transform:scaleX(1)}50%{opacity:0.5;transform:scaleX(2)}}
        @keyframes particleRise{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:0.6}90%{opacity:0.3}100%{transform:translateY(-110vh) translateX(40px);opacity:0}}
        .grain{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;mix-blend-mode:overlay;opacity:.025}
        .grain::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .glow-text{text-shadow:0 0 60px rgba(0,240,181,0.15),0 2px 20px rgba(0,0,0,0.3)}
      `}</style>
      <div className="grain" />

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, background:'color-mix(in srgb, var(--color-bg-primary) 70%, transparent)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--color-border)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => nav('/')}>
            <div style={{ width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'#00F0B5' }}><Brain size={15} style={{ color:'#0a0a0a' }} /></div>
            <span style={{ fontSize:15, fontWeight:700, color:'var(--color-text-primary)', letterSpacing:'-0.3px' }}>AI Interviewer</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:32 }} className="hidden md:flex">
            {['Questions','Leaderboard','Reviews','Forum'].map(l => (
              <button key={l} onClick={() => nav(`/${l.toLowerCase()}`)} style={{ fontSize:13, fontWeight:600, color:'var(--color-text-secondary)', background:'none', border:'none', cursor:'pointer', letterSpacing:'.5px', textTransform:'uppercase', transition:'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color='var(--color-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color='var(--color-text-secondary)'}>{l}</button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={toggleTheme} style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-surface)', border:'1px solid var(--color-border)', cursor:'pointer' }}>
              {theme === 'dark' ? <Sun size={14} style={{ color:'var(--color-text-tertiary)' }} /> : <Moon size={14} style={{ color:'var(--color-text-tertiary)' }} />}
            </button>
            <Dots nav={nav} user={user} />
            {user ? (
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <button onClick={() => nav('/dashboard')} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, fontWeight:500, padding:'7px 14px', borderRadius:20, background:'var(--color-surface)', color:'var(--color-text-secondary)', border:'1px solid var(--color-border)', cursor:'pointer' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, background:'#00F0B5', color:'#0a0a0a' }}>{user.name?.[0]?.toUpperCase()||'U'}</div>
                  <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
                </button>
                <button onClick={() => logout()} style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--color-border)', background:'none', cursor:'pointer' }}><LogOut size={13} style={{ color:'var(--color-text-tertiary)' }} /></button>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <button onClick={() => nav('/login')} style={{ fontSize:13, fontWeight:500, padding:'7px 16px', color:'var(--color-text-secondary)', background:'none', border:'none', cursor:'pointer' }}>Sign in</button>
                <button onClick={() => nav('/signup')} style={{ fontSize:13, fontWeight:600, padding:'8px 18px', borderRadius:20, background:'#00F0B5', color:'#0a0a0a', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>Start Free <ArrowRight size={13} /></button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center' }}>
        <ImmersiveBackground />
        <div style={{ position:'relative', zIndex:10, maxWidth:1100, margin:'0 auto', padding:'140px 24px 80px', width:'100%' }}>
          <div className="rv" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'8px 16px', borderRadius:50, border:'1px solid rgba(0,240,181,0.2)', background:'rgba(0,240,181,0.05)', marginBottom:32, backdropFilter:'blur(10px)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#00F0B5', boxShadow:'0 0 12px #00F0B5' }} />
            <span style={{ fontSize:11, fontWeight:600, color:'#00F0B5', letterSpacing:1 }}>580+ QUESTIONS</span>
            <span style={{ color:'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize:11, fontWeight:500, color:'rgba(255,255,255,0.5)' }}>AI-POWERED</span>
          </div>
          <h1 className="rv glow-text" style={{ fontSize:'clamp(40px, 7vw, 82px)', fontWeight:800, lineHeight:1.06, letterSpacing:'-2px', color:'#fff', margin:'0 0 24px', maxWidth:800 }}>
            Ace your next<br /><span className="tw-cursor" style={{ color:'#00F0B5' }}>{typed||'\u00A0'}</span>
          </h1>
          <p className="rv" style={{ fontSize:18, lineHeight:1.7, color:'rgba(255,255,255,0.6)', maxWidth:480, margin:'0 0 40px' }}>The mock interviewer that adapts to you. Practice with AI. Get scored. Land the offer.</p>
          <div className="rv" style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:80 }}>
            <button onClick={() => nav(user?'/setup':'/signup')} style={{ display:'flex', alignItems:'center', gap:8, fontSize:15, fontWeight:600, padding:'14px 28px', borderRadius:50, background:'#00F0B5', color:'#0a0a0a', border:'none', cursor:'pointer', transition:'all .25s', boxShadow:'0 0 30px rgba(0,240,181,0.2)' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow='0 0 50px rgba(0,240,181,0.35)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 0 30px rgba(0,240,181,0.2)'}}>
              <Play size={16} />{user?'Start Interview':'Get Started — Free'}<ArrowRight size={15} />
            </button>
            <button onClick={() => nav('/questions')} style={{ display:'flex', alignItems:'center', gap:8, fontSize:15, fontWeight:500, padding:'14px 28px', borderRadius:50, color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.05)', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.color='#fff'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(255,255,255,0.7)'}}>
              Browse Questions <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="rv" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:1, borderRadius:16, overflow:'hidden', maxWidth:600, background:'rgba(255,255,255,0.08)' }}>
            {[{v:stats?.totalSessions||0,s:'',l:'INTERVIEWS'},{v:stats?.averageScore||0,s:'%',l:'AVG SCORE'},{v:rate,s:'%',l:'SELECTION'},{v:comp,s:'',l:'COMPLETED'}].map(st=>(
              <div key={st.l} style={{ padding:'24px 16px', textAlign:'center', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(12px)' }}>
                <div style={{ fontSize:28, fontWeight:700, color:'#00F0B5', marginBottom:4 }}><Ct to={st.v} sx={st.s} /></div>
                <div style={{ fontSize:9, fontWeight:600, letterSpacing:1.5, color:'rgba(255,255,255,0.35)' }}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ padding:'20px 0', borderTop:'1px solid var(--color-border)', borderBottom:'1px solid var(--color-border)', overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:80, background:'linear-gradient(to right,var(--color-bg-primary),transparent)', zIndex:2 }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:80, background:'linear-gradient(to left,var(--color-bg-primary),transparent)', zIndex:2 }} />
        <div className="mq" style={{ display:'flex', width:'max-content' }}>
          {[...COS,...COS].map((c,i) => <span key={i} style={{ fontSize:12, fontWeight:600, padding:'0 28px', color:'var(--color-text-tertiary)', opacity:0.5, whiteSpace:'nowrap', letterSpacing:'.5px' }}>{c}</span>)}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{ padding:'120px 24px', maxWidth:1100, margin:'0 auto' }}>
        <div className="rv" style={{ marginBottom:64 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:'#00F0B5', marginBottom:16 }}>WHAT YOU GET</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, lineHeight:1.15, color:'var(--color-text-primary)', letterSpacing:'-1px', maxWidth:500 }}>
            Not another prep tool.<span style={{ display:'block', color:'var(--color-text-tertiary)' }}>A real interview simulator.</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:2 }}>
          {[
            { ic:Brain, t:'Adaptive AI Engine', d:'Questions shape themselves around your skill level. Strong answers push harder. Weak ones recalibrate.' },
            { ic:FileText, t:'Resume-Aware Prep', d:'Upload your resume. The AI pulls questions from your actual projects, tech stack, and experience.' },
            { ic:BarChart3, t:'Deep Score Reports', d:'Scored across 5 dimensions — technical, problem-solving, communication, confidence. Plus a verdict.' },
            { ic:Zap, t:'18 Company Templates', d:'Google L3, Amazon SDE-1, Meta E4 — one-click presets that match real company formats.' },
            { ic:Shield, t:'Export & Share', d:'Download PDF reports. Public profiles with badges. Shareable session links.' },
            { ic:Mic, t:'Voice & Webcam', d:'Speak your answers. Webcam practice for behavioral rounds. Real-time transcription.' },
          ].map((f,i) => (
            <div key={f.t} className="rv" style={{ padding:28, background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:12, cursor:'default', transition:'all .3s', transitionDelay:`${i*60}ms` }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='rgba(0,240,181,0.15)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='var(--color-border)'}}>
              <f.ic size={20} style={{ color:'#00F0B5', opacity:0.7, marginBottom:16 }} />
              <h3 style={{ fontSize:15, fontWeight:600, color:'var(--color-text-primary)', marginBottom:8 }}>{f.t}</h3>
              <p style={{ fontSize:13, lineHeight:1.65, color:'var(--color-text-tertiary)' }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:'120px 24px', background:'var(--color-bg-secondary)' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div className="rv" style={{ marginBottom:64 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:'#00F0B5', marginBottom:16 }}>PROCESS</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, lineHeight:1.15, color:'var(--color-text-primary)', letterSpacing:'-1px' }}>
              Four steps. <span style={{ color:'var(--color-text-tertiary)' }}>That's it.</span>
            </h2>
          </div>
          {[
            { n:'01', t:'Configure', d:'Pick role, experience, interview type, difficulty. Or use a company template.' },
            { n:'02', t:'Interview', d:'Face adaptive questions. One at a time. Voice or text. Hints if stuck.' },
            { n:'03', t:'Get Scored', d:'Scorecard across 5 dimensions. Ideal answers. Verdict — Selected, Borderline, or Rejected.' },
            { n:'04', t:'Improve', d:'AI study plan. Track trends. Earn badges. Climb the leaderboard.' },
          ].map((s,i) => (
            <div key={s.n} className="rv" style={{ display:'flex', alignItems:'flex-start', gap:24, padding:'28px 0', borderBottom:'1px solid var(--color-border)', transitionDelay:`${i*100}ms`, transition:'padding-left .3s' }}
              onMouseEnter={e=>e.currentTarget.style.paddingLeft='8px'}
              onMouseLeave={e=>e.currentTarget.style.paddingLeft='0'}>
              <span style={{ fontSize:36, fontWeight:800, color:'#00F0B5', opacity:0.15, minWidth:60, letterSpacing:-2, lineHeight:1 }}>{s.n}</span>
              <div>
                <h3 style={{ fontSize:17, fontWeight:600, color:'var(--color-text-primary)', marginBottom:6 }}>{s.t}</h3>
                <p style={{ fontSize:14, lineHeight:1.6, color:'var(--color-text-tertiary)' }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPLORE */}
      <section style={{ padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="rv" style={{ marginBottom:48 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:'#00F0B5', marginBottom:16 }}>PLATFORM</div>
            <h2 style={{ fontSize:'clamp(24px,3.5vw,36px)', fontWeight:700, color:'var(--color-text-primary)' }}>Everything in one place.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:8 }}>
            {[
              { ic:BookOpen, lb:'Question Bank', ds:'580+ curated problems', pt:'/questions' },
              { ic:MessageSquare, lb:'Forum', ds:'Community discussions', pt:'/forum' },
              { ic:Building, lb:'Company Reviews', ds:'Real experiences', pt:'/reviews' },
              { ic:Terminal, lb:'Code Compiler', ds:'Write, run, test', pt:'/compiler' },
              { ic:Trophy, lb:'Leaderboard', ds:'Top performers', pt:'/leaderboard' },
              { ic:Users, lb:'Study Rooms', ds:'Practice together', pt:'/study-rooms' },
              { ic:BarChart3, lb:'AI Study Plan', ds:'Personalized roadmap', pt:user?'/dashboard':'/signup' },
              { ic:History, lb:'History', ds:'Past sessions', pt:'/history' },
              { ic:Mail, lb:'Contact', ds:'Get in touch', pt:'/contact' },
            ].map((item,idx) => (
              <button key={item.lb} className="rv" onClick={() => nav(item.pt)}
                style={{ display:'flex', alignItems:'flex-start', gap:14, padding:20, borderRadius:12, background:'var(--color-surface)', border:'1px solid var(--color-border)', textAlign:'left', cursor:'pointer', transition:'all .25s', transitionDelay:`${idx*40}ms` }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,240,181,.2)';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--color-border)';e.currentTarget.style.transform='translateY(0)'}}>
                <item.ic size={18} style={{ color:'#00F0B5', opacity:0.5, marginTop:2, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--color-text-primary)', marginBottom:3 }}>{item.lb}</div>
                  <div style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>{item.ds}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position:'relative', padding:'140px 24px', background:'var(--color-bg-secondary)', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 50% 50%,rgba(0,240,181,.04) 0%,transparent 50%)' }} />
        <div className="rv" style={{ position:'relative', zIndex:10, maxWidth:650, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(32px,5vw,56px)', fontWeight:800, lineHeight:1.1, color:'var(--color-text-primary)', letterSpacing:'-1.5px', marginBottom:20 }}>
            Stop preparing.<br /><span style={{ color:'#00F0B5' }}>Start practicing.</span>
          </h2>
          <p style={{ fontSize:17, color:'var(--color-text-tertiary)', marginBottom:36 }}>Your next interview is closer than you think.</p>
          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            <button onClick={() => nav(user?'/setup':'/signup')} style={{ display:'flex', alignItems:'center', gap:8, fontSize:16, fontWeight:600, padding:'16px 32px', borderRadius:50, background:'#00F0B5', color:'#0a0a0a', border:'none', cursor:'pointer', transition:'all .25s', boxShadow:'0 0 40px rgba(0,240,181,0.15)' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.04)';e.currentTarget.style.boxShadow='0 0 50px rgba(0,240,181,.25)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 0 40px rgba(0,240,181,0.15)'}}>
              {user?'Start Now':'Create Free Account'} <ArrowRight size={16} />
            </button>
            <button onClick={() => nav('/questions')} style={{ fontSize:16, fontWeight:500, padding:'16px 32px', borderRadius:50, color:'var(--color-text-tertiary)', border:'1px solid var(--color-border)', background:'none', cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--color-surface)';e.currentTarget.style.color='var(--color-text-secondary)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--color-text-tertiary)'}}>
              Explore First
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'40px 24px', borderTop:'1px solid var(--color-border)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', background:'#00F0B5' }}><Brain size={12} style={{ color:'#0a0a0a' }} /></div>
            <span style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>© 2026 AI Interviewer · Groq AI</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            {['Questions','Compiler','Leaderboard','Reviews','Forum','Contact'].map(l => (
              <button key={l} onClick={() => nav(`/${l.toLowerCase()}`)} style={{ fontSize:11, fontWeight:500, letterSpacing:'.5px', color:'var(--color-text-tertiary)', background:'none', border:'none', cursor:'pointer', transition:'color .2s', textTransform:'uppercase' }}
                onMouseEnter={e=>e.currentTarget.style.color='#00F0B5'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--color-text-tertiary)'}>{l}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* FAB */}
      {fab && (
        <div className="fab-pop" style={{ position:'fixed', bottom:24, right:24, zIndex:50 }}>
          <button onClick={() => nav(user?'/setup':'/signup')} style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 22px', borderRadius:50, fontSize:13, fontWeight:600, background:'#00F0B5', color:'#0a0a0a', border:'none', cursor:'pointer', boxShadow:'0 4px 25px rgba(0,240,181,.25)', transition:'transform .2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            <Brain size={15} /><span className="hidden sm:inline">Start Interview</span><ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
