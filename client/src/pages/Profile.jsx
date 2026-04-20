import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Save, ArrowLeft, User, MapPin, Building, GraduationCap, Github, Linkedin, Phone, Plus, Trash2, Edit3, Check, X, LogOut, StickyNote, KeyRound, Shield, Eye, EyeOff, AlertTriangle, Trophy, Globe, Link2, CheckCircle2, XCircle } from 'lucide-react';

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

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [profile, setProfile] = useState({
    name: '', phone: '', college: '', graduationYear: '',
    currentCompany: '', github: '', linkedin: '', bio: '', skills: '', location: '',
  });
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePass, setDeletePass] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Leaderboard
  const [lbOptIn, setLbOptIn] = useState(false);
  const [lbDisplayName, setLbDisplayName] = useState('');
  const [lbUseReal, setLbUseReal] = useState(false);
  const [lbSaved, setLbSaved] = useState(false);

  // Public Profile
  const [username, setUsername] = useState('');
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');

  useEffect(() => { loadProfile(); loadNotes(); }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        const u = data.user;
        setProfile({
          name: u.name || '', phone: u.phone || '', college: u.college || '',
          graduationYear: u.graduationYear || '', currentCompany: u.currentCompany || '',
          github: u.github || '', linkedin: u.linkedin || '', bio: u.bio || '',
          skills: u.skills?.join(', ') || '', location: u.location || '',
        });
        setIsGoogleUser(!!u.googleId && !u.password);
        setLbOptIn(u.showOnLeaderboard || false);
        setLbDisplayName(u.displayName || '');
        setLbUseReal(u.useRealName || false);
        setUsername(u.username || '');
        setOriginalUsername(u.username || '');
        setIsPublicProfile(u.isPublicProfile || false);
      }
    } catch (err) { console.error('Failed to load profile:', err); }
    setLoading(false);
  };

  const loadNotes = async () => {
    try {
      const res = await fetch('/api/auth/notes', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setNotes(data.notes);
    } catch (err) { console.error('Failed to load notes:', err); }
  };

  const saveProfile = async () => {
    setSaving(true); setSaved(false); setSaveError('');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        updateUser({ name: profile.name, profileCompleted: true });
        setSaved(true); setTimeout(() => setSaved(false), 3000);
      } else setSaveError(data.error || 'Failed to save.');
    } catch (err) { setSaveError('Cannot connect: ' + err.message); }
    setSaving(false);
  };

  const changePassword = async () => {
    setPassError(''); setPassMsg('');
    if (!currentPass || !newPass) { setPassError('Both fields required.'); return; }
    if (newPass.length < 6) { setPassError('New password must be at least 6 characters.'); return; }
    if (newPass !== confirmPass) { setPassError('Passwords do not match.'); return; }
    setPassLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (data.success) {
        setPassMsg('Password changed!');
        setCurrentPass(''); setNewPass(''); setConfirmPass('');
        setTimeout(() => setPassMsg(''), 3000);
      } else setPassError(data.error);
    } catch { setPassError('Cannot connect to server.'); }
    setPassLoading(false);
  };

  const saveLbSettings = async (optIn, displayName, useReal) => {
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ showOnLeaderboard: optIn, displayName, useRealName: useReal }),
      });
      setLbSaved(true);
      setTimeout(() => setLbSaved(false), 2000);
    } catch {}
  };

  // Username check
  useEffect(() => {
    if (!username || username === originalUsername) {
      setUsernameAvailable(null);
      setUsernameError('');
      return;
    }
    const clean = username.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (clean !== username) {
      setUsername(clean);
      return;
    }
    if (clean.length < 3) {
      setUsernameAvailable(false);
      setUsernameError('Min 3 characters');
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameChecking(true);
      try {
        const res = await fetch(`/api/auth/check-username/${clean}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
        setUsernameError(data.available ? '' : 'Username taken');
      } catch {
        setUsernameError('Check failed');
      }
      setUsernameChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username, originalUsername]);

  const savePublicProfile = async () => {
    setUsernameSaving(true);
    setUsernameError('');
    try {
      const body = { isPublicProfile };
      if (username && username !== originalUsername) body.username = username;

      const res = await fetch('/api/auth/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setOriginalUsername(data.user.username || '');
        setUsername(data.user.username || '');
        setIsPublicProfile(data.user.isPublicProfile || false);
        setUsernameSaved(true);
        setTimeout(() => setUsernameSaved(false), 3000);
      } else {
        setUsernameError(data.error || 'Failed to save.');
      }
    } catch { setUsernameError('Cannot connect.'); }
    setUsernameSaving(false);
  };

  const deleteAccount = async () => {
    setDeleteError('');
    if (!isGoogleUser && !deletePass) { setDeleteError('Password required.'); return; }
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ password: deletePass }),
      });
      const data = await res.json();
      if (data.success) { await logout(); navigate('/'); }
      else setDeleteError(data.error);
    } catch { setDeleteError('Cannot connect to server.'); }
    setDeleteLoading(false);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setNotesLoading(true);
    try {
      const res = await fetch('/api/auth/notes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ content: newNote }),
      });
      const data = await res.json();
      if (data.success) { setNotes(data.notes); setNewNote(''); }
    } catch (err) { console.error(err); }
    setNotesLoading(false);
  };

  const updateNote = async (noteId) => {
    try {
      const res = await fetch(`/api/auth/notes/${noteId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json();
      if (data.success) { setNotes(data.notes); setEditingNote(null); }
    } catch (err) { console.error(err); }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      const res = await fetch(`/api/auth/notes/${noteId}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) setNotes(data.notes);
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };
  const set = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
      <p style={{ color: 'var(--color-text-secondary)' }}>Loading profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>
      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all hover:opacity-70"
              style={{ color: 'var(--color-danger)', border: '1px solid var(--color-border)' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'var(--color-accent)' }}>
            {profile.name ? profile.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{profile.name || 'Your Profile'}</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{user?.email}</p>
            {originalUsername && isPublicProfile && (
              <button onClick={() => navigate(`/u/${originalUsername}`)} className="text-xs flex items-center gap-1 mt-1 transition-opacity hover:opacity-70" style={{ color: 'var(--color-accent)' }}>
                <Globe size={10} /> yoursite.com/u/{originalUsername}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {[['profile', 'Profile', User], ['notes', 'Notes', StickyNote], ['security', 'Security', Shield]].map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: tab === key ? 'var(--color-accent)' : 'var(--color-surface)',
                color: tab === key ? 'white' : 'var(--color-text-secondary)',
                border: `1px solid ${tab === key ? 'var(--color-accent)' : 'var(--color-border)'}`,
              }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}><User size={12} className="inline mr-1" /> Full Name</label><input value={profile.name} onChange={e => set('name', e.target.value)} className={inputClass} placeholder="Your full name" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
              <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}><Phone size={12} className="inline mr-1" /> Phone</label><input value={profile.phone} onChange={e => set('phone', e.target.value)} className={inputClass} placeholder="+91 98765 43210" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
              <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}><MapPin size={12} className="inline mr-1" /> Location</label><input value={profile.location} onChange={e => set('location', e.target.value)} className={inputClass} placeholder="City, Country" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
              <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}><GraduationCap size={12} className="inline mr-1" /> College</label><input value={profile.college} onChange={e => set('college', e.target.value)} className={inputClass} placeholder="Your college" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
              <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}><GraduationCap size={12} className="inline mr-1" /> Graduation Year</label><input value={profile.graduationYear} onChange={e => set('graduationYear', e.target.value)} className={inputClass} placeholder="2025" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
              <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}><Building size={12} className="inline mr-1" /> Company</label><input value={profile.currentCompany} onChange={e => set('currentCompany', e.target.value)} className={inputClass} placeholder="Company (or Student)" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
              <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}><Github size={12} className="inline mr-1" /> GitHub</label><input value={profile.github} onChange={e => set('github', e.target.value)} className={inputClass} placeholder="https://github.com/username" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
              <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}><Linkedin size={12} className="inline mr-1" /> LinkedIn</label><input value={profile.linkedin} onChange={e => set('linkedin', e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/username" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
            </div>
            <div className="mt-5"><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Skills</label><input value={profile.skills} onChange={e => set('skills', e.target.value)} className={inputClass} placeholder="React, Node.js, Python" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
            <div className="mt-5"><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Bio</label><textarea value={profile.bio} onChange={e => set('bio', e.target.value)} rows={3} className={inputClass} placeholder="Tell us about yourself..." style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} /></div>
            {saveError && <div className="mt-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>{saveError}</div>}
            <div className="mt-8 flex items-center gap-3">
              <button onClick={saveProfile} disabled={saving} className="btn-primary px-8 py-3 text-sm font-semibold flex items-center gap-2" style={{ opacity: saving ? 0.7 : 1 }}><Save size={14} /> {saving ? 'Saving...' : 'Save Profile'}</button>
              {saved && <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-success)' }}><Check size={16} /> Saved!</span>}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {tab === 'notes' && (
          <div>
            <div className="card p-6 mb-6">
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={3} className={inputClass} placeholder="Write a note..."
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
              <div className="mt-3 flex justify-end">
                <button onClick={addNote} disabled={notesLoading || !newNote.trim()} className="btn-primary px-6 py-2.5 text-sm font-semibold flex items-center gap-2" style={{ opacity: notesLoading || !newNote.trim() ? 0.5 : 1 }}><Plus size={14} /> Add Note</button>
              </div>
            </div>
            {notes.length === 0 ? (
              <div className="card p-12 text-center">
                <StickyNote size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>No notes yet</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Write down interview tips, study plans, or anything.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.slice().reverse().map(note => (
                  <div key={note._id} className="card p-5">
                    {editingNote === note._id ? (
                      <div>
                        <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} className={inputClass}
                          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', resize: 'vertical' }} />
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => updateNote(note._id)} className="btn-primary px-4 py-2 text-xs flex items-center gap-1"><Check size={12} /> Save</button>
                          <button onClick={() => setEditingNote(null)} className="btn-secondary px-4 py-2 text-xs flex items-center gap-1"><X size={12} /> Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-primary)' }}>{note.content}</p>
                        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{new Date(note.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingNote(note._id); setEditContent(note.content); }} className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: 'var(--color-accent)' }}><Edit3 size={14} /></button>
                            <button onClick={() => deleteNote(note._id)} className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <div className="space-y-6">

            {/* Public Profile */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <Globe size={18} style={{ color: '#8b5cf6' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Public Profile</h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Share your profile and stats publicly</p>
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                {/* Username */}
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                    <Link2 size={12} className="inline mr-1" /> Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>@</span>
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      className={`${inputClass} pl-9 pr-10`}
                      placeholder="coderninja"
                      maxLength={30}
                      style={{ background: 'var(--color-surface)', border: `1px solid ${usernameError ? 'var(--color-danger)' : usernameAvailable === true ? 'var(--color-success)' : 'var(--color-border)'}`, color: 'var(--color-text-primary)' }}
                    />
                    {usernameChecking && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs animate-pulse" style={{ color: 'var(--color-text-tertiary)' }}>...</span>
                    )}
                    {!usernameChecking && usernameAvailable === true && username !== originalUsername && (
                      <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-success)' }} />
                    )}
                    {!usernameChecking && usernameAvailable === false && username !== originalUsername && (
                      <XCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-danger)' }} />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs" style={{ color: usernameError ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }}>
                      {usernameError || (username ? `yoursite.com/u/${username}` : 'Letters, numbers, dash, underscore · min 3')}
                    </p>
                    {usernameAvailable === true && username !== originalUsername && (
                      <span className="text-[10px] font-medium" style={{ color: 'var(--color-success)' }}>Available!</span>
                    )}
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Enable public profile</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Anyone with your link can see your stats & badges</p>
                  </div>
                  <button onClick={() => setIsPublicProfile(!isPublicProfile)}
                    className="w-12 h-7 rounded-full transition-all relative" style={{ background: isPublicProfile ? 'var(--color-success)' : 'var(--color-border)' }}>
                    <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" style={{ left: isPublicProfile ? '26px' : '4px' }} />
                  </button>
                </div>

                {/* Preview link */}
                {isPublicProfile && username && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <Globe size={14} style={{ color: '#8b5cf6' }} />
                    <span className="text-sm font-mono" style={{ color: '#8b5cf6' }}>yoursite.com/u/{username}</span>
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/u/${username}`); }}
                      className="ml-auto text-[10px] font-medium px-2 py-1 rounded-lg transition-all hover:opacity-70"
                      style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                      Copy
                    </button>
                  </div>
                )}

                {/* Save */}
                <div className="flex items-center gap-3">
                  <button onClick={savePublicProfile}
                    disabled={usernameSaving || (username !== originalUsername && (usernameAvailable === false || usernameChecking))}
                    className="btn-primary px-6 py-3 text-sm font-semibold flex items-center gap-2"
                    style={{ opacity: usernameSaving ? 0.7 : 1 }}>
                    <Save size={14} /> {usernameSaving ? 'Saving...' : 'Save Public Profile'}
                  </button>
                  {usernameSaved && <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-success)' }}><Check size={16} /> Saved!</span>}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-accent-light)' }}><KeyRound size={18} style={{ color: 'var(--color-accent)' }} /></div>
                <div><h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Change Password</h3><p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Update your account password</p></div>
              </div>
              {isGoogleUser ? (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Your account uses Google login. Password change is not available.</div>
              ) : (
                <div className="space-y-4 max-w-md">
                  <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Current Password</label><div className="relative"><input type={showCurrentPass ? 'text' : 'password'} value={currentPass} onChange={e => setCurrentPass(e.target.value)} className={`${inputClass} pr-12`} placeholder="••••••••" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /><button type="button" onClick={() => setShowCurrentPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }}>{showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
                  <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>New Password</label><div className="relative"><input type={showNewPass ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} className={`${inputClass} pr-12`} placeholder="Min 6 characters" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /><button type="button" onClick={() => setShowNewPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }}>{showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
                  <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Confirm Password</label><input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className={inputClass} placeholder="Repeat new password" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
                  {passError && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>{passError}</div>}
                  {passMsg && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(52,199,89,0.08)', border: '1px solid rgba(52,199,89,0.2)', color: 'var(--color-success)' }}>{passMsg}</div>}
                  <button onClick={changePassword} disabled={passLoading} className="btn-primary px-6 py-3 text-sm font-semibold flex items-center gap-2" style={{ opacity: passLoading ? 0.7 : 1 }}><KeyRound size={14} /> {passLoading ? 'Changing...' : 'Change Password'}</button>
                </div>
              )}
            </div>

            {/* Leaderboard Settings */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}><Trophy size={18} className="text-white" /></div>
                <div><h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Leaderboard</h3><p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Control how you appear on the public leaderboard</p></div>
              </div>
              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Show on leaderboard</p><p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Your scores will be visible publicly</p></div>
                  <button onClick={() => { setLbOptIn(!lbOptIn); saveLbSettings(!lbOptIn, lbDisplayName, lbUseReal); }}
                    className="w-12 h-7 rounded-full transition-all relative" style={{ background: lbOptIn ? 'var(--color-success)' : 'var(--color-border)' }}>
                    <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" style={{ left: lbOptIn ? '26px' : '4px' }} />
                  </button>
                </div>
                {lbOptIn && (
                  <>
                    <div>
                      <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Display Name</label>
                      <input value={lbDisplayName} onChange={e => setLbDisplayName(e.target.value)}
                        onBlur={() => saveLbSettings(lbOptIn, lbDisplayName, lbUseReal)}
                        className={inputClass} placeholder="e.g. CodeNinja99"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Appears on leaderboard instead of real name</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Use real name instead</p><p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Show "{profile.name}" on the leaderboard</p></div>
                      <button onClick={() => { setLbUseReal(!lbUseReal); saveLbSettings(lbOptIn, lbDisplayName, !lbUseReal); }}
                        className="w-12 h-7 rounded-full transition-all relative" style={{ background: lbUseReal ? 'var(--color-success)' : 'var(--color-border)' }}>
                        <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" style={{ left: lbUseReal ? '26px' : '4px' }} />
                      </button>
                    </div>
                    {lbSaved && <p className="text-xs font-medium" style={{ color: 'var(--color-success)' }}>Leaderboard settings saved!</p>}
                  </>
                )}
              </div>
            </div>

            {/* Delete Account */}
            <div className="card p-8" style={{ borderColor: 'rgba(255,59,48,0.2)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,59,48,0.1)' }}><AlertTriangle size={18} style={{ color: 'var(--color-danger)' }} /></div>
                <div><h3 className="font-semibold" style={{ color: 'var(--color-danger)' }}>Delete Account</h3><p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Permanently delete your account and all data</p></div>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>This action is irreversible. All your sessions, notes, and profile data will be permanently deleted.</p>
              {!showDeleteConfirm ? (
                <button onClick={() => setShowDeleteConfirm(true)} className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                  style={{ color: 'var(--color-danger)', border: '1px solid var(--color-danger)', background: 'transparent' }}>Delete My Account</button>
              ) : (
                <div className="max-w-md space-y-3">
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: 'var(--color-danger)' }}>Are you sure? This cannot be undone.</div>
                  {!isGoogleUser && (
                    <div><label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Enter password to confirm</label><input type="password" value={deletePass} onChange={e => setDeletePass(e.target.value)} className={inputClass} placeholder="Your password" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} /></div>
                  )}
                  {deleteError && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{deleteError}</p>}
                  <div className="flex gap-2">
                    <button onClick={deleteAccount} disabled={deleteLoading} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'var(--color-danger)', opacity: deleteLoading ? 0.7 : 1 }}>{deleteLoading ? 'Deleting...' : 'Yes, Delete Everything'}</button>
                    <button onClick={() => { setShowDeleteConfirm(false); setDeletePass(''); setDeleteError(''); }} className="btn-secondary px-6 py-2.5 text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}