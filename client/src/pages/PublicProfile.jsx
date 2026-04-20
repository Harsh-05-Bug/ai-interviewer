import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Brain, MapPin, Building, GraduationCap, Github, Linkedin, Trophy, Target, Zap, BarChart3, ArrowLeft, Flame, Award, Calendar, TrendingUp } from 'lucide-react';

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

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/auth/u/${username}`);
      const data = await res.json();
      if (data.success) setProfile(data.profile);
      else setError(data.error || 'Profile not found.');
    } catch {
      setError('Failed to load profile.');
    }
    setLoading(false);
  };

  const scoreColor = (s) => s >= 75 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
  const typeLabels = { dsa: 'DSA', system: 'System Design', technical: 'Technical', behavioral: 'Behavioral', mixed: 'Mixed' };
  const typeColors = { dsa: '#F59E0B', system: '#10B981', technical: '#8B5CF6', behavioral: '#F97316', mixed: '#0071E3' };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-accent)' }}>
          <Brain size={22} className="text-white animate-pulse" />
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Profile Not Found</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          The user @{username} doesn't have a public profile or doesn't exist.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary px-6 py-3 text-sm font-semibold">
          Go Home
        </button>
      </div>
    </div>
  );

  const p = profile;
  const s = p.stats;

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>

      {/* Nav */}
      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>AI Interviewer</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-8">

        {/* Profile Header */}
        <div className="card p-8 mb-6 text-center">
          <div className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white"
            style={{ background: 'var(--color-accent)' }}>
            {p.avatar ? (
              <img src={p.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              p.name ? p.name[0].toUpperCase() : 'U'
            )}
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{p.name}</h1>
          <p className="text-sm mb-3" style={{ color: 'var(--color-accent)' }}>@{p.username}</p>

          {p.bio && <p className="text-sm leading-relaxed mb-4 max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>{p.bio}</p>}

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            {p.location && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}><MapPin size={12} /> {p.location}</div>}
            {p.college && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}><GraduationCap size={12} /> {p.college} {p.graduationYear ? `'${p.graduationYear.slice(-2)}` : ''}</div>}
            {p.currentCompany && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}><Building size={12} /> {p.currentCompany}</div>}
            {p.joinedAt && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}><Calendar size={12} /> Joined {new Date(p.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>}
          </div>

          <div className="flex justify-center gap-3 mb-4">
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                <Github size={12} /> GitHub
              </a>
            )}
            {p.linkedin && (
              <a href={p.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-80"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                <Linkedin size={12} /> LinkedIn
              </a>
            )}
          </div>

          {p.skills?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {p.skills.map(sk => (
                <span key={sk} className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                  {sk}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-5 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}>
              <BarChart3 size={18} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="font-display text-2xl font-bold mb-0.5" style={{ color: 'var(--color-accent)' }}>{s.totalSessions}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Interviews</div>
          </div>
          <div className="card p-5 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(52,199,89,0.1)' }}>
              <Trophy size={18} style={{ color: 'var(--color-success)' }} />
            </div>
            <div className="font-display text-2xl font-bold mb-0.5" style={{ color: 'var(--color-success)' }}>{s.bestScore}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Best Score</div>
          </div>
          <div className="card p-5 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,149,0,0.1)' }}>
              <Target size={18} style={{ color: 'var(--color-warning)' }} />
            </div>
            <div className="font-display text-2xl font-bold mb-0.5" style={{ color: scoreColor(s.avgScore) }}>{s.avgScore}%</div>
            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Avg Score</div>
          </div>
          <div className="card p-5 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
              <Zap size={18} style={{ color: '#8b5cf6' }} />
            </div>
            <div className="font-display text-2xl font-bold mb-0.5" style={{ color: '#8b5cf6' }}>{s.maxStreak}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Best Streak</div>
          </div>
        </div>

        {/* Additional stats row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(52,199,89,0.1)' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-success)' }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>{s.selectedCount}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Times Selected</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <Award size={18} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: '#F59E0B' }}>{p.badges?.length || 0}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Topic Performance */}
        {s.topicStats?.length > 0 && (
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={16} style={{ color: 'var(--color-warning)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Performance by Type</h3>
            </div>
            <div className="space-y-3">
              {s.topicStats.sort((a, b) => b.avg - a.avg).map(t => (
                <div key={t.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: typeColors[t.type] || 'var(--color-accent)' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{typeLabels[t.type] || t.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{t.count} session{t.count !== 1 ? 's' : ''}</span>
                      <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Best: {t.best}</span>
                      <span className="text-xs font-bold font-mono" style={{ color: scoreColor(t.avg) }}>{t.avg}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.avg}%`, background: typeColors[t.type] || 'var(--color-accent)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        {p.badges?.length > 0 && (
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} style={{ color: '#F59E0B' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Badges</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                {p.badges.length} earned
              </span>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {p.badges.map(badge => (
                <div key={badge.id} className="group relative">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-xl"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <span className="text-2xl">{badge.emoji}</span>
                    <span className="text-[9px] font-medium text-center leading-tight" style={{ color: 'var(--color-text-secondary)' }}>{badge.name}</span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                    <div className="card px-3 py-2 shadow-lg text-center whitespace-nowrap" style={{ border: '1px solid var(--color-border)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{badge.name}</p>
                      {badge.earnedAt && (
                        <p className="text-[9px] mt-0.5" style={{ color: 'var(--color-success)' }}>
                          ✓ {new Date(badge.earnedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="card p-6 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Want your own public profile? Start practicing with AI Interviewer!
          </p>
          <button onClick={() => navigate('/signup')} className="btn-primary px-8 py-3 text-sm font-semibold">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
}