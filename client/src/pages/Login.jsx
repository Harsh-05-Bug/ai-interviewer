import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Brain, Eye, EyeOff, ArrowLeft, Shield, RefreshCw, Mail, KeyRound } from 'lucide-react';

const GOOGLE_CLIENT_ID = '798913266374-70oa331fgn3puu6ndqs0shlqored5on8.apps.googleusercontent.com';

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

export default function Login() {
  const navigate = useNavigate();
  const { login, googleAuth, checkAuth } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPass1, setAdminPass1] = useState('');
  const [adminPass2, setAdminPass2] = useState('');
  const [showAP1, setShowAP1] = useState(false);
  const [showAP2, setShowAP2] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Admin forgot password
  const [showAdminForgot, setShowAdminForgot] = useState(false);
  const [afEmail, setAfEmail] = useState('');
  const [afOtpSent, setAfOtpSent] = useState(false);
  const [afOtp, setAfOtp] = useState('');
  const [afPass1, setAfPass1] = useState('');
  const [afPass2, setAfPass2] = useState('');
  const [afLoading, setAfLoading] = useState(false);
  const [afError, setAfError] = useState('');
  const [afSuccess, setAfSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setNeedsVerification(false);
    const result = await login(email, password);
    if (result.success) {
      if (!result.user?.profileCompleted) navigate('/profile');
      else navigate('/dashboard');
    } else {
      setError(result.error);
      if (result.needsVerification) { setNeedsVerification(true); setUnverifiedEmail(result.email || email); }
    }
    setLoading(false);
  };

  const resendEmail = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      const data = await res.json();
      if (data.success) { setError(''); alert('Verification email sent!'); }
      else setError(data.error);
    } catch { setError('Cannot connect to server.'); }
    setResending(false);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return;
    setForgotLoading(true); setForgotMsg('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotMsg(data.message || 'Check your email for the reset link.');
    } catch { setForgotMsg('Failed to connect to server.'); }
    setForgotLoading(false);
  };

  const handleGoogle = async (credentialResponse) => {
    setError('');
    const result = await googleAuth(credentialResponse.credential);
    if (result.success) {
      if (!result.user?.profileCompleted) navigate('/profile');
      else navigate('/dashboard');
    } else setError(result.error);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoading(true); setAdminError('');
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: adminUsername, pass1: adminPass1, pass2: adminPass2 }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAdmin(false);
        await checkAuth();
        navigate('/admin');
      }
      else setAdminError(data.error || 'Invalid credentials.');
    } catch { setAdminError('Cannot connect to server.'); }
    setAdminLoading(false);
  };

  // Admin forgot - send OTP
  const handleAdminForgotSendOTP = async () => {
    if (!afEmail) { setAfError('Enter admin email.'); return; }
    setAfLoading(true); setAfError('');
    try {
      const res = await fetch('/api/admin-panel/admin-forgot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: afEmail }),
      });
      const data = await res.json();
      if (data.success) { setAfOtpSent(true); setAfError(''); }
      else setAfError(data.error);
    } catch { setAfError('Cannot connect to server.'); }
    setAfLoading(false);
  };

  // Admin forgot - reset passwords
  const handleAdminForgotReset = async () => {
    if (!afOtp || !afPass1 || !afPass2) { setAfError('All fields required.'); return; }
    setAfLoading(true); setAfError(''); setAfSuccess('');
    try {
      const res = await fetch('/api/admin-panel/admin-reset', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: afEmail, otp: afOtp, newPass1: afPass1, newPass2: afPass2 }),
      });
      const data = await res.json();
      if (data.success) { setAfSuccess('Passwords changed! Login with new passwords.'); setAfOtpSent(false); setAfOtp(''); setAfPass1(''); setAfPass2(''); }
      else setAfError(data.error);
    } catch { setAfError('Cannot connect to server.'); }
    setAfLoading(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> Home
          </button>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
                <Brain size={20} className="text-white" />
              </div>
              <span className="font-display font-semibold text-xl" style={{ color: 'var(--color-text-primary)' }}>AI Interviewer</span>
            </div>

            <div className="card p-8 sm:p-10">
              <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--color-text-primary)' }}>Welcome back</h1>
              <p className="text-sm text-center mb-8" style={{ color: 'var(--color-text-secondary)' }}>Sign in to continue your practice</p>

              {error && (
                <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>
                  {error}
                  {needsVerification && (
                    <button onClick={resendEmail} disabled={resending}
                      className="mt-2 flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
                      style={{ color: 'var(--color-accent)' }}>
                      <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
                      {resending ? 'Sending...' : 'Resend verification email'}
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="you@example.com" className={inputClass}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Password</label>
                    <button type="button" onClick={() => { setShowForgot(true); setForgotMsg(''); setForgotEmail(email); }}
                      className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}>
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                      className={`${inputClass} pr-12`}
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      style={{ color: 'var(--color-text-tertiary)' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-semibold" style={{ opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>or</span>
                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              </div>

              <div className="flex justify-center mb-6">
                <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google login failed')}
                  theme={theme === 'dark' ? 'filled_black' : 'outline'} shape="pill" width="340" text="continue_with" />
              </div>

              <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}>Sign up</Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => { setShowAdmin(true); setAdminError(''); setAdminUsername(''); setAdminPass1(''); setAdminPass2(''); }}
                className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full transition-all hover:opacity-70"
                style={{ color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>
                <Shield size={12} /> Admin Access
              </button>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="card p-8 w-full max-w-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}>
                  <Mail size={22} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Reset Password</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Enter your email to receive a reset link</p>
              </div>
              {forgotMsg && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(52,199,89,0.08)', border: '1px solid rgba(52,199,89,0.2)', color: 'var(--color-success)' }}>{forgotMsg}</div>
              )}
              <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                placeholder="you@example.com" className={inputClass + " mb-3"}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              <button onClick={handleForgotPassword} disabled={forgotLoading}
                className="btn-primary w-full py-3 text-sm font-semibold mb-3" style={{ opacity: forgotLoading ? 0.7 : 1 }}>
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button onClick={() => { setShowForgot(false); setForgotMsg(''); }}
                className="w-full py-2.5 rounded-xl text-sm transition-all hover:opacity-70"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Admin Login Modal */}
        {showAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="card p-8 w-full max-w-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--color-danger)', opacity: 0.9 }}>
                  <Shield size={22} className="text-white" />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Admin Access</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Restricted area</p>
              </div>
              {adminError && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>{adminError}</div>
              )}
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Username</label>
                  <input type="text" value={adminUsername} onChange={e => setAdminUsername(e.target.value)} required placeholder="Admin username" className={inputClass} autoComplete="off"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Password 1</label>
                  <div className="relative">
                    <input type={showAP1 ? 'text' : 'password'} value={adminPass1} onChange={e => setAdminPass1(e.target.value)} required placeholder="••••••••" className={`${inputClass} pr-12`} autoComplete="new-password"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    <button type="button" onClick={() => setShowAP1(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }}>
                      {showAP1 ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Password 2</label>
                  <div className="relative">
                    <input type={showAP2 ? 'text' : 'password'} value={adminPass2} onChange={e => setAdminPass2(e.target.value)} required placeholder="••••••••" className={`${inputClass} pr-12`} autoComplete="new-password"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    <button type="button" onClick={() => setShowAP2(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }}>
                      {showAP2 ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={adminLoading} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'var(--color-danger)', opacity: adminLoading ? 0.7 : 1 }}>
                  {adminLoading ? 'Verifying...' : 'Access Admin Panel'}
                </button>
              </form>
              <button onClick={() => setShowAdmin(false)} className="w-full mt-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-70"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>Cancel</button>
              <button onClick={() => { setShowAdminForgot(true); setShowAdmin(false); setAfEmail(''); setAfOtpSent(false); setAfOtp(''); setAfPass1(''); setAfPass2(''); setAfError(''); setAfSuccess(''); }}
                className="w-full mt-2 py-2 text-xs transition-all hover:opacity-70"
                style={{ color: 'var(--color-text-tertiary)' }}>
                <KeyRound size={10} className="inline mr-1" /> Forgot Admin Password?
              </button>
            </div>
          </div>
        )}

        {/* Admin Forgot Password Modal */}
        {showAdminForgot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="card p-8 w-full max-w-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                  <KeyRound size={22} style={{ color: '#EF4444' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Reset Admin Password</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>OTP will be sent to your admin email</p>
              </div>

              {afError && (
                <div className="mb-4 px-4 py-3 rounded-xl text-xs" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>{afError}</div>
              )}
              {afSuccess && (
                <div className="mb-4 px-4 py-3 rounded-xl text-xs" style={{ background: 'rgba(52,199,89,0.08)', border: '1px solid rgba(52,199,89,0.2)', color: 'var(--color-success)' }}>{afSuccess}</div>
              )}

              {!afOtpSent ? (
                <div className="space-y-3">
                  <input type="email" value={afEmail} onChange={e => setAfEmail(e.target.value)}
                    placeholder="Admin email address" className={inputClass}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  <button onClick={handleAdminForgotSendOTP} disabled={afLoading}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                    style={{ background: '#EF4444', opacity: afLoading ? 0.7 : 1 }}>
                    <Mail size={14} /> {afLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>6-Digit OTP</label>
                    <input value={afOtp} onChange={e => setAfOtp(e.target.value)} placeholder="OTP from email" maxLength={6}
                      className={inputClass + " font-mono tracking-widest text-center"}
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>New Password 1</label>
                    <input type="password" value={afPass1} onChange={e => setAfPass1(e.target.value)} placeholder="New password 1"
                      className={inputClass} autoComplete="new-password"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>New Password 2</label>
                    <input type="password" value={afPass2} onChange={e => setAfPass2(e.target.value)} placeholder="New password 2"
                      className={inputClass} autoComplete="new-password"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  </div>
                  <button onClick={handleAdminForgotReset} disabled={afLoading}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: '#EF4444', opacity: afLoading ? 0.7 : 1 }}>
                    {afLoading ? 'Resetting...' : 'Reset Passwords'}
                  </button>
                </div>
              )}

              <button onClick={() => { setShowAdminForgot(false); setShowAdmin(true); }}
                className="w-full mt-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-70"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>Back to Admin Login</button>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}