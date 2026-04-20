import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Brain, Sun, Moon, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, KeyRound } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--color-warning)' }} /> : <Moon size={16} style={{ color: 'var(--color-text-secondary)' }} />}
    </button>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.error);
    } catch { setError('Cannot connect to server.'); }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(255,59,48,0.1)' }}>
          <XCircle size={32} style={{ color: 'var(--color-danger)' }} />
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Invalid Link</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>No reset token found. Please request a new password reset.</p>
        <button onClick={() => navigate('/login')} className="btn-primary px-6 py-3 text-sm font-semibold">Go to Login</button>
      </div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(52,199,89,0.1)' }}>
          <CheckCircle size={32} style={{ color: 'var(--color-success)' }} />
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Password Reset!</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Your password has been updated. You can now sign in.</p>
        <button onClick={() => navigate('/login')} className="btn-primary px-8 py-3 text-sm font-semibold">Sign In</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-text-secondary)' }}>
          <ArrowLeft size={16} /> Login
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
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}>
                <KeyRound size={24} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Set new password</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Choose a strong password for your account.</p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleReset}>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>New Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    required placeholder="Min 6 characters" className={`${inputClass} pr-12`}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-tertiary)' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  required placeholder="Repeat password" className={inputClass}
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-semibold" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}