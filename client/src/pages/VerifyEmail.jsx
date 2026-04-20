import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, XCircle, Loader, Brain, Sun, Moon } from 'lucide-react';

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

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`, { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          await checkAuth();
          setTimeout(() => navigate('/profile'), 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Cannot connect to server.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>AI Interviewer</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="card p-10 max-w-md w-full text-center">
          {status === 'verifying' && (
            <>
              <Loader size={48} className="mx-auto mb-6 animate-spin" style={{ color: 'var(--color-accent)' }} />
              <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Verifying your email...</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(52,199,89,0.1)' }}>
                <CheckCircle size={32} style={{ color: 'var(--color-success)' }} />
              </div>
              <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Email Verified!</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>{message}</p>
              <p className="text-xs mb-6" style={{ color: 'var(--color-text-tertiary)' }}>Redirecting to your profile in 3 seconds...</p>
              <button onClick={() => navigate('/profile')} className="btn-primary px-8 py-3 text-sm font-semibold">
                Go to Profile
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(255,59,48,0.1)' }}>
                <XCircle size={32} style={{ color: 'var(--color-danger)' }} />
              </div>
              <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Verification Failed</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>{message}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate('/signup')} className="btn-primary px-6 py-3 text-sm font-semibold">
                  Sign Up Again
                </button>
                <button onClick={() => navigate('/login')} className="btn-secondary px-6 py-3 text-sm font-semibold">
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}