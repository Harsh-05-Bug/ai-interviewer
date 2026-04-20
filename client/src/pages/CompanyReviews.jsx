import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Brain, ArrowLeft, Star, ThumbsUp, Building, Briefcase, Filter, Plus, X, Send, Search, ChevronDown, Clock, CheckCircle2, XCircle, AlertTriangle, Ghost, ArrowRight } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--color-warning)' }} /> : <Moon size={16} style={{ color: 'var(--color-text-secondary)' }} />}
    </button>
  );
}

const EXPERIENCES = ['Fresher', 'Junior', 'Mid', 'Senior', 'Staff+'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Very Hard'];
const RESULTS = ['Selected', 'Rejected', 'Ghosted', 'Pending', 'Withdrew'];

const resultColor = (r) => {
  if (r === 'Selected') return 'var(--color-success)';
  if (r === 'Rejected') return 'var(--color-danger)';
  if (r === 'Ghosted') return '#8b5cf6';
  if (r === 'Pending') return 'var(--color-warning)';
  return 'var(--color-text-tertiary)';
};

const resultIcon = (r) => {
  if (r === 'Selected') return <CheckCircle2 size={14} />;
  if (r === 'Rejected') return <XCircle size={14} />;
  if (r === 'Ghosted') return <Ghost size={14} />;
  if (r === 'Pending') return <Clock size={14} />;
  return <AlertTriangle size={14} />;
};

const diffColor = (d) => {
  if (d === 'Easy') return 'var(--color-success)';
  if (d === 'Medium') return 'var(--color-warning)';
  if (d === 'Hard') return 'var(--color-danger)';
  return '#8b5cf6';
};

function StarRating({ rating, size = 14, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => interactive && onChange?.(i)} style={{ cursor: interactive ? 'pointer' : 'default', background: 'none', border: 'none', padding: 0 }}>
          <Star size={size} fill={i <= rating ? '#F59E0B' : 'none'} stroke={i <= rating ? '#F59E0B' : 'var(--color-border)'} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}

export default function CompanyReviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('All');
  const [filterResult, setFilterResult] = useState('All');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // New review form
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    company: '', role: '', experience: 'Junior', difficulty: 'Medium',
    result: 'Selected', rating: 4, rounds: 3, description: '', tips: '',
    tags: '', isAnonymous: false,
  });

  useEffect(() => { loadReviews(); loadCompanies(); }, [page, filterDiff, filterResult, sort]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15, sort });
      if (search) params.set('company', search);
      if (filterDiff !== 'All') params.set('difficulty', filterDiff);
      if (filterResult !== 'All') params.set('result', filterResult);

      const res = await fetch(`/api/reviews?${params}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setTotal(data.total);
        setPages(data.pages);
      }
    } catch {}
    setLoading(false);
  };

  const loadCompanies = async () => {
    try {
      const res = await fetch('/api/reviews/companies');
      const data = await res.json();
      if (data.success) setCompanies(data.companies);
    } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadReviews();
  };

  const submitReview = async () => {
    setFormError('');
    if (!form.company || !form.role || !form.description) {
      setFormError('Company, role, and description are required.');
      return;
    }
    if (form.description.length < 20) {
      setFormError('Description must be at least 20 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({
          ...form,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({ company: '', role: '', experience: 'Junior', difficulty: 'Medium', result: 'Selected', rating: 4, rounds: 3, description: '', tips: '', tags: '', isAnonymous: false });
        setPage(1);
        loadReviews();
        loadCompanies();
      } else setFormError(data.error);
    } catch { setFormError('Failed to submit.'); }
    setSubmitting(false);
  };

  const likeReview = async (id) => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await fetch(`/api/reviews/${id}/like`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, likeCount: data.likeCount, liked: data.liked } : r));
      }
    } catch {}
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>

      {/* Nav */}
      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>Company Reviews</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Interview Experiences</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{total} reviews from real candidates</p>
          </div>
          {user && (
            <button onClick={() => setShowForm(true)} className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
              <Plus size={14} /> Share Your Experience
            </button>
          )}
        </div>

        {/* Company Stats */}
        {companies.length > 0 && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {companies.slice(0, 8).map(c => (
              <button key={c.name} onClick={() => { setSearch(c.name); setPage(1); setTimeout(loadReviews, 100); }}
                className="card px-4 py-3 flex-shrink-0 transition-all hover:scale-[1.02] text-center" style={{ minWidth: 120 }}>
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>{c.name}</p>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star size={10} fill="#F59E0B" stroke="#F59E0B" />
                  <span className="text-xs font-medium" style={{ color: '#F59E0B' }}>{c.avgRating}</span>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{c.reviews} reviews · {c.selectRate}% selected</p>
              </button>
            ))}
          </div>
        )}

        {/* Search & Filters */}
        <div className="card p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3 items-center mb-3">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by company..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <button type="submit" className="btn-primary px-4 py-2.5 text-sm">Search</button>
            <button type="button" onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
              <Filter size={14} /> Filters
            </button>
          </form>

          {showFilters && (
            <div className="flex gap-3 flex-wrap pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
              <select value={filterDiff} onChange={e => { setFilterDiff(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-xl text-xs outline-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                <option value="All">All Difficulty</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filterResult} onChange={e => { setFilterResult(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-xl text-xs outline-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                <option value="All">All Results</option>
                {RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-xl text-xs outline-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Liked</option>
              </select>
              {(filterDiff !== 'All' || filterResult !== 'All' || search) && (
                <button onClick={() => { setFilterDiff('All'); setFilterResult('All'); setSearch(''); setPage(1); setTimeout(loadReviews, 100); }}
                  className="text-xs font-medium" style={{ color: 'var(--color-danger)' }}>Clear all</button>
              )}
            </div>
          )}
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-16"><p style={{ color: 'var(--color-text-secondary)' }}>Loading reviews...</p></div>
        ) : reviews.length === 0 ? (
          <div className="card p-12 text-center">
            <Building size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
            <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>No reviews yet</p>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>Be the first to share your interview experience!</p>
            {user && <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"><Plus size={14} /> Write a Review</button>}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className="card p-6 transition-all hover:scale-[1.005]">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: 'var(--color-accent)' }}>
                      {r.userAvatar ? <img src={r.userAvatar} alt="" className="w-full h-full rounded-xl object-cover" /> : r.userName?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{r.userName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ color: resultColor(r.result), background: `${resultColor(r.result)}15`, border: `1px solid ${resultColor(r.result)}30` }}>
                          {resultIcon(r.result)} {r.result}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{r.experience} · {fmt(r.interviewDate || r.createdAt)}</p>
                    </div>
                  </div>
                  <StarRating rating={r.rating} />
                </div>

                {/* Company & Role */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                    <Building size={12} /> {r.company}
                  </span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                    {r.role}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full"
                    style={{ background: `${diffColor(r.difficulty)}12`, color: diffColor(r.difficulty) }}>
                    {r.difficulty}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{r.rounds} rounds</span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{r.description}</p>

                {/* Tips */}
                {r.tips && (
                  <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(52,199,89,0.06)', border: '1px solid rgba(52,199,89,0.15)' }}>
                    <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: 'var(--color-success)' }}>💡 Tips</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{r.tips}</p>
                  </div>
                )}

                {/* Tags */}
                {r.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {r.tags.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--color-surface)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <button onClick={() => likeReview(r._id)} className="flex items-center gap-1.5 text-xs font-medium transition-all hover:opacity-70"
                    style={{ color: r.liked ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}>
                    <ThumbsUp size={14} fill={r.liked ? 'var(--color-accent)' : 'none'} /> {r.likeCount || 0} helpful
                  </button>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{fmt(r.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ background: 'var(--color-surface)', color: page === 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', border: '1px solid var(--color-border)', opacity: page === 1 ? 0.5 : 1 }}>
              Previous
            </button>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>{page} / {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ background: 'var(--color-surface)', color: page === pages ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', border: '1px solid var(--color-border)', opacity: page === pages ? 0.5 : 1 }}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* New Review Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}>
                  <Building size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Share Interview Experience</h2>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Help others prepare better</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Company & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Company *</label>
                  <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Google"
                    className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
                <div>
                  <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Role *</label>
                  <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. SDE-1"
                    className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
              </div>

              {/* Experience & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Experience</label>
                  <select value={form.experience} onChange={e => set('experience', e.target.value)}
                    className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                    {EXPERIENCES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Difficulty</label>
                  <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
                    className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Result & Rounds */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Result</label>
                  <select value={form.result} onChange={e => set('result', e.target.value)}
                    className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                    {RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Rounds</label>
                  <input type="number" min="1" max="10" value={form.rounds} onChange={e => set('rounds', e.target.value)}
                    className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Overall Rating</label>
                <StarRating rating={form.rating} size={24} interactive onChange={v => set('rating', v)} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Experience Details *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5}
                  placeholder="Describe your interview experience: rounds, questions asked, interviewer behavior, process..."
                  className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
                <p className="text-[10px] mt-1" style={{ color: form.description.length < 20 ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }}>
                  {form.description.length}/2000 (min 20)
                </p>
              </div>

              {/* Tips */}
              <div>
                <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Tips for Others</label>
                <textarea value={form.tips} onChange={e => set('tips', e.target.value)} rows={2}
                  placeholder="Any advice for future candidates?"
                  className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Tags</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="DSA, System Design, Behavioral (comma separated)"
                  className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Post anonymously</p>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Your name won't be shown</p>
                </div>
                <button onClick={() => set('isAnonymous', !form.isAnonymous)}
                  className="w-12 h-7 rounded-full transition-all relative" style={{ background: form.isAnonymous ? 'var(--color-accent)' : 'var(--color-border)' }}>
                  <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" style={{ left: form.isAnonymous ? '26px' : '4px' }} />
                </button>
              </div>

              {formError && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                  Cancel
                </button>
                <button onClick={submitReview} disabled={submitting}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                  style={{ background: 'var(--color-accent)', opacity: submitting ? 0.7 : 1 }}>
                  <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}