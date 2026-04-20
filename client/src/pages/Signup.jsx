import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Brain, Eye, EyeOff, ArrowLeft, Mail, RefreshCw, Gift } from 'lucide-react';

const GOOGLE_CLIENT_ID = '798913266374-70oa331fgn3puu6ndqs0shlqored5on8.apps.googleusercontent.com';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--color-warning)' }} /> : <Moon size={16} style={{ color: 'var(--color-text-secondary)' }} />}
    </button>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { googleAuth } = useAuth();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [referral] = useState(searchParams.get('ref') || '');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, referral }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.needsVerification) { setEmailSent(true); setSentEmail(email); }
        else navigate('/profile');
      } else setError(data.error);
    } catch { setError('Cannot connect to server.'); }
    setLoading(false);
  };

  const resendEmail = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sentEmail }),
      });
      const data = await res.json();
      if (data.success) alert('Verification email sent!');
      else setError(data.error);
    } catch { setError('Cannot connect to server.'); }
    setResending(false);
  };

  const handleGoogle = async (credentialResponse) => {
    setError('');
    const result = await googleAuth(credentialResponse.credential);
    if (result.success) {
      if (!result.user?.profileCompleted) navigate('/profile');
      else navigate('/dashboard');
    } else setError(result.error);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => setEmailSent(false)} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}><ArrowLeft size={16} /> Back</button>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="card p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}><Mail size={28} style={{ color: 'var(--color-accent)' }} /></div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Check your email</h1>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>We sent a verification link to</p>
            <p className="text-sm font-semibold mb-6" style={{ color: 'var(--color-accent)' }}>{sentEmail}</p>
            <p className="text-xs mb-8" style={{ color: 'var(--color-text-tertiary)' }}>Click the link in the email to verify. Expires in 24 hours.</p>
            <div className="flex flex-col gap-3">
              <button onClick={resendEmail} disabled={resending} className="btn-secondary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2" style={{ opacity: resending ? 0.7 : 1 }}>
                <RefreshCw size={14} className={resending ? 'animate-spin' : ''} /> {resending ? 'Sending...' : 'Resend Email'}
              </button>
              <button onClick={() => navigate('/login')} className="w-full py-3 rounded-full text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Already verified? Sign in</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}><ArrowLeft size={16} /> Home</button>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}><Brain size={20} className="text-white" /></div>
              <span className="font-display font-semibold text-xl" style={{ color: 'var(--color-text-primary)' }}>AI Interviewer</span>
            </div>
            <div className="card p-8 sm:p-10">
              <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--color-text-primary)' }}>Create your account</h1>
              <p className="text-sm text-center mb-8" style={{ color: 'var(--color-text-secondary)' }}>Start practicing for your dream job</p>

              {referral && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#8B5CF6' }}>
                  <Gift size={14} /> Referred by code: <strong>{referral}</strong>
                </div>
              )}

              {error && (<div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>{error}</div>)}

              <form onSubmit={handleSignup}>
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name" className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" className={`${inputClass} pr-12`} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--color-text-tertiary)' }}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-semibold" style={{ opacity: loading ? 0.7 : 1 }}>{loading ? 'Creating account...' : 'Create Account'}</button>
              </form>

              <div className="flex items-center gap-4 my-6"><div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} /><span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>or</span><div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} /></div>
              <div className="flex justify-center mb-6"><GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google login failed')} theme={theme === 'dark' ? 'filled_black' : 'outline'} shape="pill" width="340" text="signup_with" /></div>
              <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>Already have an account?{' '}<Link to="/login" className="font-semibold" style={{ color: 'var(--color-accent)' }}>Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
