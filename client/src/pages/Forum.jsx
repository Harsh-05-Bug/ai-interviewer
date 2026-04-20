import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Brain, ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Eye, Pin, Plus, X, Send, Search, Filter, Clock, Tag, ChevronDown, ChevronUp, Trash2, ThumbsUp } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--color-warning)' }} /> : <Moon size={16} style={{ color: 'var(--color-text-secondary)' }} />}
    </button>
  );
}

const CATEGORIES = ['All', 'DSA', 'System Design', 'Behavioral', 'Career', 'Resume', 'Experience', 'Resources', 'General'];
const catColors = { DSA: '#F59E0B', 'System Design': '#10B981', Behavioral: '#F97316', Career: '#8B5CF6', Resume: '#0071E3', Experience: '#EC4899', Resources: '#06B6D4', General: '#6B7280' };

export default function Forum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ title: '', content: '', category: 'General', tags: '' });

  // Post detail
  const [activePost, setActivePost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [stats, setStats] = useState(null);

  useEffect(() => { loadPosts(); loadStats(); }, [page, category, sort]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15, sort });
      if (category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`/api/forum?${params}`);
      const data = await res.json();
      if (data.success) { setPosts(data.posts); setTotal(data.total); setPages(data.pages); }
    } catch {}
    setLoading(false);
  };

  const loadStats = async () => {
    try { const res = await fetch('/api/forum/meta/stats'); const data = await res.json(); if (data.success) setStats(data); } catch {}
  };

  const loadPost = async (id) => {
    setPostLoading(true);
    try {
      const res = await fetch(`/api/forum/${id}`);
      const data = await res.json();
      if (data.success) setActivePost(data.post);
    } catch {}
    setPostLoading(false);
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); loadPosts(); };

  const createPost = async () => {
    setFormError('');
    if (!form.title || !form.content) { setFormError('Title and content required.'); return; }
    if (form.title.length < 5) { setFormError('Title must be at least 5 characters.'); return; }
    if (form.content.length < 10) { setFormError('Content must be at least 10 characters.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/forum', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({ title: '', content: '', category: 'General', tags: '' });
        setPage(1);
        loadPosts();
        loadStats();
      } else setFormError(data.error);
    } catch { setFormError('Failed to create post.'); }
    setSubmitting(false);
  };

  const votePost = async (id, type) => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await fetch(`/api/forum/${id}/vote`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p._id === id ? { ...p, score: data.score, upvoteCount: data.upvoteCount, downvoteCount: data.downvoteCount, userVote: data.userVote } : p));
        if (activePost?._id === id) setActivePost(prev => ({ ...prev, score: data.score, upvoteCount: data.upvoteCount, downvoteCount: data.downvoteCount, userVote: data.userVote }));
      }
    } catch {}
  };

  const addComment = async () => {
    if (!commentText.trim() || !activePost) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/forum/${activePost._id}/comment`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ content: commentText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setActivePost(prev => ({ ...prev, comments: [...(prev.comments || []), data.comment] }));
        setCommentText('');
      }
    } catch {}
    setCommentSubmitting(false);
  };

  const upvoteComment = async (commentId) => {
    if (!user || !activePost) return;
    try {
      const res = await fetch(`/api/forum/${activePost._id}/comment/${commentId}/upvote`, {
        method: 'POST', credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setActivePost(prev => ({
          ...prev,
          comments: prev.comments.map(c => c._id === commentId ? { ...c, upvoteCount: data.upvoteCount, upvoted: data.upvoted } : c),
        }));
      }
    } catch {}
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/forum/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) { setActivePost(null); loadPosts(); loadStats(); }
    } catch {}
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/forum/${activePost._id}/comment/${commentId}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setActivePost(prev => ({ ...prev, comments: prev.comments.filter(c => c._id !== commentId) }));
      }
    } catch {}
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const fmt = (d) => { const now = Date.now(); const diff = now - new Date(d).getTime(); if (diff < 60000) return 'just now'; if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`; if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`; return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); };
  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";

  // Post Detail View
  if (activePost) {
    const p = activePost;
    return (
      <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>
        <nav className="glass shadow-sm sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setActivePost(null)} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
              <ArrowLeft size={16} /> Back to Forum
            </button>
            <ThemeToggle />
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 pt-6">
          {postLoading ? (
            <div className="text-center py-16"><p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p></div>
          ) : (
            <>
              {/* Post */}
              <div className="card p-6 mb-6">
                <div className="flex gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <button onClick={() => votePost(p._id, 'up')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: p.userVote === 'up' ? 'rgba(52,199,89,0.15)' : 'var(--color-surface)', border: `1px solid ${p.userVote === 'up' ? 'var(--color-success)' : 'var(--color-border)'}` }}>
                      <ArrowUp size={14} style={{ color: p.userVote === 'up' ? 'var(--color-success)' : 'var(--color-text-tertiary)' }} />
                    </button>
                    <span className="text-sm font-bold font-mono" style={{ color: (p.score || 0) > 0 ? 'var(--color-success)' : (p.score || 0) < 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}>
                      {p.score || 0}
                    </span>
                    <button onClick={() => votePost(p._id, 'down')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: p.userVote === 'down' ? 'rgba(255,59,48,0.15)' : 'var(--color-surface)', border: `1px solid ${p.userVote === 'down' ? 'var(--color-danger)' : 'var(--color-border)'}` }}>
                      <ArrowDown size={14} style={{ color: p.userVote === 'down' ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {p.isPinned && <Pin size={12} style={{ color: 'var(--color-accent)' }} />}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${catColors[p.category] || '#6B7280'}15`, color: catColors[p.category] || '#6B7280' }}>{p.category}</span>
                    </div>
                    <h1 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{p.title}</h1>
                    <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap" style={{ color: 'var(--color-text-primary)' }}>{p.content}</p>

                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tags.map((t, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>#{t}</span>)}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: 'var(--color-accent)' }}>
                          {p.userAvatar ? <img src={p.userAvatar} alt="" className="w-full h-full rounded-full object-cover" /> : p.userName?.[0]?.toUpperCase()}
                        </div>
                        {p.userName}
                      </div>
                      <span><Clock size={10} className="inline" /> {fmt(p.createdAt)}</span>
                      <span><Eye size={10} className="inline" /> {p.views} views</span>
                      <span><MessageSquare size={10} className="inline" /> {p.comments?.length || 0} comments</span>
                      {user && (user._id === p.userId?.toString() || user.isAdmin) && (
                        <button onClick={() => deletePost(p._id)} className="flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: 'var(--color-danger)' }}>
                          <Trash2 size={10} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Comment */}
              {user ? (
                <div className="card p-4 mb-6">
                  <textarea value={commentText} onChange={e => setCommentText(e.target.value)} rows={3}
                    placeholder="Write a comment..."
                    className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
                  <div className="flex justify-end mt-3">
                    <button onClick={addComment} disabled={!commentText.trim() || commentSubmitting}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all"
                      style={{ background: !commentText.trim() ? 'var(--color-border)' : 'var(--color-accent)', opacity: commentSubmitting ? 0.7 : 1 }}>
                      <Send size={12} /> {commentSubmitting ? 'Posting...' : 'Comment'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card p-4 mb-6 text-center">
                  <button onClick={() => navigate('/login')} className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>Sign in to comment</button>
                </div>
              )}

              {/* Comments */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  <MessageSquare size={14} /> {p.comments?.length || 0} Comments
                </h3>
                {(!p.comments || p.comments.length === 0) ? (
                  <div className="card p-8 text-center">
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>No comments yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {p.comments.map(c => (
                      <div key={c._id} className="card p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: 'var(--color-accent)' }}>
                            {c.userAvatar ? <img src={c.userAvatar} alt="" className="w-full h-full rounded-full object-cover" /> : c.userName?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{c.userName}</span>
                              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{fmt(c.createdAt)}</span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>{c.content}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button onClick={() => upvoteComment(c._id)} className="flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-70"
                                style={{ color: c.upvoted ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}>
                                <ThumbsUp size={10} fill={c.upvoted ? 'var(--color-accent)' : 'none'} /> {c.upvoteCount || 0}
                              </button>
                              {user && (user._id === c.userId?.toString() || user.isAdmin) && (
                                <button onClick={() => deleteComment(c._id)} className="text-[10px] transition-opacity hover:opacity-70" style={{ color: 'var(--color-danger)' }}>Delete</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Forum List View
  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>
      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>Discussion Forum</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Community Forum</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {stats ? `${stats.totalPosts} discussions · ${stats.totalComments} comments` : 'Loading...'}
            </p>
          </div>
          {user && (
            <button onClick={() => setShowForm(true)} className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
              <Plus size={14} /> New Post
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: category === c ? (c === 'All' ? 'var(--color-accent)' : `${catColors[c] || '#6B7280'}20`) : 'var(--color-surface)',
                color: category === c ? (c === 'All' ? 'white' : catColors[c] || '#6B7280') : 'var(--color-text-secondary)',
                border: `1px solid ${category === c ? (c === 'All' ? 'var(--color-accent)' : `${catColors[c]}40`) : 'var(--color-border)'}`,
              }}>
              {c}
              {stats && c !== 'All' && (() => { const s = stats.categories?.find(x => x._id === c); return s ? ` (${s.count})` : ''; })()}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="card p-4 mb-6">
          <div className="flex gap-3 items-center">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search discussions..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </form>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl text-xs outline-none"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Upvoted</option>
              <option value="most-commented">Most Discussed</option>
            </select>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-16"><p style={{ color: 'var(--color-text-secondary)' }}>Loading discussions...</p></div>
        ) : posts.length === 0 ? (
          <div className="card p-12 text-center">
            <MessageSquare size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
            <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>No discussions yet</p>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>Start a conversation with the community!</p>
            {user && <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"><Plus size={14} /> Create First Post</button>}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(p => (
              <div key={p._id} className="card p-5 transition-all hover:scale-[1.003] cursor-pointer"
                style={p.isPinned ? { borderColor: 'var(--color-accent)' } : {}}
                onClick={() => loadPost(p._id)}>
                <div className="flex gap-4">
                  {/* Vote */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => votePost(p._id, 'up')} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: p.userVote === 'up' ? 'rgba(52,199,89,0.12)' : 'transparent' }}>
                      <ArrowUp size={13} style={{ color: p.userVote === 'up' ? 'var(--color-success)' : 'var(--color-text-tertiary)' }} />
                    </button>
                    <span className="text-xs font-bold font-mono" style={{ color: (p.score||0) > 0 ? 'var(--color-success)' : (p.score||0) < 0 ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }}>
                      {p.score || 0}
                    </span>
                    <button onClick={() => votePost(p._id, 'down')} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: p.userVote === 'down' ? 'rgba(255,59,48,0.12)' : 'transparent' }}>
                      <ArrowDown size={13} style={{ color: p.userVote === 'down' ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {p.isPinned && <Pin size={10} style={{ color: 'var(--color-accent)' }} />}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${catColors[p.category] || '#6B7280'}12`, color: catColors[p.category] || '#6B7280' }}>
                        {p.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: 'var(--color-text-primary)' }}>{p.title}</h3>
                    <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {p.content?.substring(0, 200)}{p.content?.length > 200 ? '...' : ''}
                    </p>

                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {p.tags.slice(0, 4).map((t, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{ background: 'var(--color-surface)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white" style={{ background: 'var(--color-accent)' }}>
                          {p.userAvatar ? <img src={p.userAvatar} alt="" className="w-full h-full rounded-full object-cover" /> : p.userName?.[0]?.toUpperCase()}
                        </div>
                        {p.userName}
                      </div>
                      <span>{fmt(p.createdAt)}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={9} /> {p.commentCount}</span>
                      <span className="flex items-center gap-1"><Eye size={9} /> {p.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-xl text-xs font-medium"
              style={{ background: 'var(--color-surface)', color: page === 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', border: '1px solid var(--color-border)', opacity: page === 1 ? 0.5 : 1 }}>
              Previous
            </button>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>{page} / {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="px-4 py-2 rounded-xl text-xs font-medium"
              style={{ background: 'var(--color-surface)', color: page === pages ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)', border: '1px solid var(--color-border)', opacity: page === pages ? 0.5 : 1 }}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}>
                  <MessageSquare size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Start a Discussion</h2>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Share knowledge with the community</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="What's your question or topic?"
                  className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>

              <div>
                <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Content *</label>
                <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={6}
                  placeholder="Describe your question, share your experience, or start a discussion..."
                  className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
                <p className="text-[10px] mt-1" style={{ color: form.content.length < 10 ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }}>
                  {form.content.length}/5000 (min 10)
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Tags</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="arrays, dp, google (comma separated)"
                  className={inputClass} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>

              {formError && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm font-medium"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                  Cancel
                </button>
                <button onClick={createPost} disabled={submitting}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: 'var(--color-accent)', opacity: submitting ? 0.7 : 1 }}>
                  <Send size={14} /> {submitting ? 'Posting...' : 'Post Discussion'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}