import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Brain, ArrowLeft, Trophy, Medal, Crown, Star, Users, Target, Zap, ChevronUp } from 'lucide-react';

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

function RankBadge({ rank }) {
  if (rank === 1) return <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}><Crown size={20} className="text-white" /></div>;
  if (rank === 2) return <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)' }}><Medal size={20} className="text-white" /></div>;
  if (rank === 3) return <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #CD7F32, #B8860B)' }}><Medal size={20} className="text-white" /></div>;
  return <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>#{rank}</div>;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/leaderboard');
      const data = await res.json();
      if (data.success) setLeaderboard(data.leaderboard);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const scoreColor = (s) => s >= 85 ? 'var(--color-success)' : s >= 65 ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>

      {/* Nav */}
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
            <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>Leaderboard</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
            <Trophy size={30} className="text-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Top Performers
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            The best interview scores from our community. Opt-in from your profile to appear here.
          </p>
        </div>

        {/* Opt-in CTA */}
        {user && (
          <div className="card p-5 mb-8 flex items-center justify-between flex-wrap gap-3"
            style={{ borderColor: 'var(--color-accent)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Want to appear on the leaderboard?</p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Go to your profile settings to opt-in and set a display name.</p>
            </div>
            <button onClick={() => navigate('/profile')} className="btn-primary px-5 py-2.5 text-xs font-semibold">
              Profile Settings
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card p-16 text-center">
            <Trophy size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
            <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No one on the leaderboard yet</p>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Be the first! Complete an interview and opt-in from your profile.</p>
            <button onClick={() => navigate(user ? '/setup' : '/signup')} className="btn-primary px-6 py-3 text-sm font-semibold">
              {user ? 'Start Interview' : 'Sign Up & Start'}
            </button>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((p, i) => {
                  const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                  const isFirst = rank === 1;
                  return (
                    <div key={p.id} className={`card p-6 text-center ${isFirst ? 'md:-mt-4' : 'mt-4'}`}
                      style={{ borderColor: isFirst ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32' }}>
                      <div className="mx-auto mb-3">
                        <RankBadge rank={rank} />
                      </div>
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold text-white"
                        style={{ background: 'var(--color-accent)' }}>
                        {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : p.name[0].toUpperCase()}
                      </div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-text-primary)' }}>{p.name}</p>
                      {p.college && <p className="text-[10px] mb-2" style={{ color: 'var(--color-text-tertiary)' }}>{p.college}</p>}
                      <div className="font-display text-2xl font-bold" style={{ color: scoreColor(p.bestScore) }}>{p.bestScore}</div>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Best Score</p>
                      <div className="flex justify-center gap-3 mt-3">
                        <div className="text-center">
                          <p className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>{p.totalSessions}</p>
                          <p className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>Sessions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold" style={{ color: 'var(--color-success)' }}>{p.selectedCount}</p>
                          <p className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>Selected</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            <div className="space-y-3">
              {leaderboard.map((p, i) => (
                <div key={p.id} className="card p-5 flex items-center gap-4 transition-all hover:scale-[1.01]"
                  style={{ borderColor: i < 3 ? [null, '#FFD700', '#C0C0C0', '#CD7F32'][i + 1] : 'var(--color-card-border)' }}>

                  <RankBadge rank={i + 1} />

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'var(--color-accent)' }}>
                    {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full rounded-xl object-cover" /> : p.name[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{p.name}</span>
                      {p.topRole && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                          {p.topRole}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {p.college && <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{p.college}</span>}
                      {p.company && <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>@ {p.company}</span>}
                      {p.skills?.length > 0 && (
                        <div className="flex gap-1">
                          {p.skills.map(sk => (
                            <span key={sk} className="text-[9px] px-1.5 py-0.5 rounded"
                              style={{ background: 'var(--color-surface)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Best</p>
                      <p className="font-display text-xl font-bold" style={{ color: scoreColor(p.bestScore) }}>{p.bestScore}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Avg</p>
                      <p className="font-display text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{p.avgScore}</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Sessions</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{p.totalSessions}</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Selected</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--color-success)' }}>{p.selectedCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Want to climb the ranks?</p>
              <button onClick={() => navigate(user ? '/setup' : '/signup')} className="btn-primary px-8 py-3.5 text-sm font-semibold">
                {user ? 'Start Interview' : 'Sign Up & Start'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}