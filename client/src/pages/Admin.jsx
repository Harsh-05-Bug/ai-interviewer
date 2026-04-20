import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ArrowLeft, Users, BarChart3, Shield, Activity, Archive, Settings, ToggleLeft, ToggleRight, Trash2, Ban, UserCheck, Search, Lock, Key, Mail, Bell, Send, X, Check, AlertTriangle, User, Eye, MessageSquare } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)' }}>{theme==='dark'?<Sun size={14} style={{color:'var(--color-warning)'}}/>:<Moon size={14} style={{color:'var(--color-text-secondary)'}}/>}</button>;
}

const TABS = [
  { id:'dashboard', label:'Dashboard', icon:BarChart3 },
  { id:'users', label:'Users', icon:Users },
  { id:'features', label:'Features', icon:Settings },
  { id:'notifications', label:'Notify', icon:Bell },
  { id:'activity', label:'Activity', icon:Activity },
  { id:'security', label:'Security', icon:Shield },
  { id:'archived', label:'Archived', icon:Archive },
];

export default function Admin() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('dashboard');

  // Dashboard
  const [dash, setDash] = useState(null);
  const [dashLoading, setDashLoading] = useState(true);

  // Users
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersPages, setUsersPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersStatus, setUsersStatus] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Features
  const [features, setFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [featureCode, setFeatureCode] = useState('');
  const [featureError, setFeatureError] = useState('');
  const [featureSaved, setFeatureSaved] = useState(false);

  // Notifications
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState('info');
  const [notifTarget, setNotifTarget] = useState('all');
  const [notifUserId, setNotifUserId] = useState('');
  const [notifUserSearch, setNotifUserSearch] = useState('');
  const [notifUsers, setNotifUsers] = useState([]);
  const [notifSending, setNotifSending] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState('');
  const [notifError, setNotifError] = useState('');
  const [sentNotifs, setSentNotifs] = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);

  // Activity
  const [logs, setLogs] = useState([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [logsCat, setLogsCat] = useState('all');
  const [logsLoading, setLogsLoading] = useState(false);

  // Security
  const [secCurrentCode, setSecCurrentCode] = useState('');
  const [secNewCode, setSecNewCode] = useState('');
  const [secCodeError, setSecCodeError] = useState('');
  const [secCodeSuccess, setSecCodeSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [newPass1, setNewPass1] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [passCode, setPassCode] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameCode, setUsernameCode] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');

  // Archived
  const [archived, setArchived] = useState([]);
  const [archLoading, setArchLoading] = useState(false);

  // Personal message modal from users tab
  const [msgModal, setMsgModal] = useState(null);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSending, setMsgSending] = useState(false);

  useEffect(() => { if (tab === 'dashboard') loadDashboard(); }, [tab]);
  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, usersPage, usersStatus]);
  useEffect(() => { if (tab === 'features') loadFeatures(); }, [tab]);
  useEffect(() => { if (tab === 'notifications') loadNotifs(); }, [tab]);
  useEffect(() => { if (tab === 'activity') loadLogs(); }, [tab, logsPage, logsCat]);
  useEffect(() => { if (tab === 'archived') loadArchived(); }, [tab]);

  const api = async (url, opts = {}) => { const r = await fetch(url, { credentials: 'include', ...opts }); return r.json(); };

  const loadDashboard = async () => { setDashLoading(true); const d = await api('/api/admin-panel/dashboard'); if (d.success) setDash(d.dashboard); setDashLoading(false); };
  const loadUsers = async () => {
    setUsersLoading(true);
    const p = new URLSearchParams({ page: usersPage, limit: 20 });
    if (usersSearch) p.set('search', usersSearch);
    if (usersStatus) p.set('status', usersStatus);
    const d = await api(`/api/admin-panel/users?${p}`);
    if (d.success) { setUsers(d.users); setUsersTotal(d.total); setUsersPages(d.pages); }
    setUsersLoading(false);
  };
  const loadUserDetail = async (id) => { setDetailLoading(true); const d = await api(`/api/admin-panel/users/${id}`); if (d.success) setUserDetail(d); setDetailLoading(false); };
  const toggleBlock = async (id) => { const d = await api(`/api/admin-panel/users/${id}/block`, { method: 'POST' }); if (d.success) { loadUsers(); if (userDetail?.user?._id === id) loadUserDetail(id); } };
  const deleteUser = async () => {
    setDeleteError('');
    if (!deleteCode || deleteCode.length !== 8) { setDeleteError('Enter 8-digit code.'); return; }
    const d = await api(`/api/admin-panel/users/${deleteModal._id}/delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secretCode: deleteCode, reason: deleteReason }) });
    if (d.success) { setDeleteModal(null); setDeleteCode(''); setDeleteReason(''); loadUsers(); setUserDetail(null); setSelectedUser(null); }
    else setDeleteError(d.error);
  };
  const loadFeatures = async () => { setFeaturesLoading(true); const d = await api('/api/admin-panel/features'); if (d.success) setFeatures(d.features); setFeaturesLoading(false); };
  const toggleFeature = (key) => { setFeatures(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f)); setFeatureSaved(false); };
  const saveFeatures = async () => {
    setFeatureError('');
    if (!featureCode || featureCode.length !== 8) { setFeatureError('Enter 8-digit secret code.'); return; }
    const d = await api('/api/admin-panel/features', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ features, secretCode: featureCode }) });
    if (d.success) { setFeatureSaved(true); setFeatureCode(''); setTimeout(() => setFeatureSaved(false), 3000); }
    else setFeatureError(d.error);
  };
  const loadNotifs = async () => { setNotifsLoading(true); const d = await api('/api/admin-panel/notifications'); if (d.success) setSentNotifs(d.notifications); setNotifsLoading(false); };
  const sendNotification = async () => {
    setNotifError(''); setNotifSuccess('');
    if (!notifTitle.trim() || !notifMsg.trim()) { setNotifError('Title and message required.'); return; }
    setNotifSending(true);
    const url = notifTarget === 'all' ? '/api/admin-panel/notify/all' : `/api/admin-panel/notify/user/${notifUserId}`;
    const d = await api(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: notifTitle, message: notifMsg, type: notifType }) });
    if (d.success) { setNotifSuccess(notifTarget === 'all' ? 'Sent to all users!' : 'Sent to user!'); setNotifTitle(''); setNotifMsg(''); loadNotifs(); }
    else setNotifError(d.error);
    setNotifSending(false);
  };
  const deleteNotif = async (id) => { await api(`/api/admin-panel/notifications/${id}`, { method: 'DELETE' }); loadNotifs(); };
  const searchNotifUsers = async () => {
    if (!notifUserSearch.trim()) return;
    const d = await api(`/api/admin-panel/users?search=${notifUserSearch}&limit=5`);
    if (d.success) setNotifUsers(d.users);
  };
  const sendPersonalMsg = async () => {
    if (!msgTitle.trim() || !msgBody.trim()) return;
    setMsgSending(true);
    const d = await api(`/api/admin-panel/notify/user/${msgModal._id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: msgTitle, message: msgBody, type: 'personal' }) });
    if (d.success) { setMsgModal(null); setMsgTitle(''); setMsgBody(''); alert('Message sent!'); }
    setMsgSending(false);
  };
  const loadLogs = async () => {
    setLogsLoading(true);
    const p = new URLSearchParams({ page: logsPage, limit: 30 });
    if (logsCat !== 'all') p.set('category', logsCat);
    const d = await api(`/api/admin-panel/activity?${p}`);
    if (d.success) { setLogs(d.logs); setLogsTotal(d.total); }
    setLogsLoading(false);
  };
  const changeSecretCode = async () => {
    setSecCodeError(''); setSecCodeSuccess('');
    if (secNewCode.length !== 8) { setSecCodeError('Must be exactly 8 digits.'); return; }
    const d = await api('/api/admin-panel/change-secret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentCode: secCurrentCode, newCode: secNewCode }) });
    if (d.success) { setSecCodeSuccess('Secret code changed!'); setSecCurrentCode(''); setSecNewCode(''); }
    else setSecCodeError(d.error);
  };
  const sendOTP = async () => {
    setOtpSending(true); setPassError('');
    const d = await api('/api/admin-panel/send-otp', { method: 'POST' });
    if (d.success) setOtpSent(true);
    else setPassError(d.error);
    setOtpSending(false);
  };
  const changePassword = async () => {
    setPassError(''); setPassSuccess(''); setPassLoading(true);
    if (!newPass1 && !newPass2) { setPassError('Enter at least one new password.'); setPassLoading(false); return; }
    const d = await api('/api/admin-panel/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ otp: otpVal, newPass1: newPass1 || undefined, newPass2: newPass2 || undefined, secretCode: passCode }) });
    if (d.success) { setPassSuccess(d.message); setOtpSent(false); setOtpVal(''); setNewPass1(''); setNewPass2(''); setPassCode(''); }
    else setPassError(d.error);
    setPassLoading(false);
  };
  const changeUsername = async () => {
    setUsernameError(''); setUsernameSuccess('');
    if (!newUsername.trim() || newUsername.length < 3) { setUsernameError('Min 3 characters.'); return; }
    if (!usernameCode || usernameCode.length !== 8) { setUsernameError('Enter 8-digit code.'); return; }
    const d = await api('/api/admin-panel/change-username', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newUsername, secretCode: usernameCode }) });
    if (d.success) { setUsernameSuccess('Username changed!'); setNewUsername(''); setUsernameCode(''); }
    else setUsernameError(d.error);
  };
  const loadArchived = async () => { setArchLoading(true); const d = await api('/api/admin-panel/archived'); if (d.success) setArchived(d.archived); setArchLoading(false); };
  const permDelete = async (id) => {
    const code = prompt('Enter 8-digit secret code:');
    if (!code) return;
    const d = await api(`/api/admin-panel/archived/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secretCode: code }) });
    if (d.success) loadArchived(); else alert(d.error);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '-';
  const fmtFull = (d) => d ? new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '-';
  const inp = "w-full px-4 py-3 rounded-xl text-sm outline-none";
  const inpS = { background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)' };
  const typeColors = { info:'#0071E3', warning:'#F59E0B', success:'#10B981', alert:'#EF4444', personal:'#8B5CF6' };

  if (!user?.isAdmin) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--color-bg-primary)' }}>
      <div className="text-center">
        <Shield size={48} className="mx-auto mb-4" style={{ color:'var(--color-danger)' }} />
        <h1 className="text-xl font-bold mb-2" style={{ color:'var(--color-text-primary)' }}>Access Denied</h1>
        <button onClick={() => nav('/')} className="text-sm font-medium" style={{ color:'#00F0B5' }}>Go Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background:'var(--color-bg-primary)' }}>
      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => nav('/')} className="flex items-center gap-2 text-sm" style={{ color:'var(--color-text-secondary)' }}><ArrowLeft size={16}/> Home</button>
          <div className="flex items-center gap-2"><Shield size={16} style={{ color:'#00F0B5' }} /><span className="text-sm font-bold" style={{ color:'var(--color-text-primary)' }}>Admin Panel</span></div>
          <div className="flex items-center gap-2">
  <ThemeToggle />
  <button onClick={async()=>{await fetch('/api/auth/logout',{method:'POST',credentials:'include'});window.location.href='/login';}} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{color:'#EF4444',border:'1px solid rgba(239,68,68,0.3)'}}>Logout</button>
</div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap"
              style={{ background: tab===t.id ? '#00F0B5' : 'var(--color-surface)', color: tab===t.id ? '#0a0a0a' : 'var(--color-text-secondary)', border: `1px solid ${tab===t.id ? '#00F0B5' : 'var(--color-border)'}` }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* ═══ DASHBOARD ═══ */}
        {tab === 'dashboard' && (dashLoading ? <p className="text-center py-16 text-sm" style={{ color:'var(--color-text-tertiary)' }}>Loading...</p> : dash && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[{l:'Total Users',v:dash.users.total,c:'#00F0B5'},{l:'Verified',v:dash.users.verified,c:'#10B981'},{l:'New Today',v:dash.users.newToday,c:'#F59E0B'},{l:'Blocked',v:dash.users.blocked,c:'#EF4444'},
                {l:'Total Sessions',v:dash.sessions.total,c:'#0071E3'},{l:'Today',v:dash.sessions.today,c:'#8B5CF6'},{l:'This Week',v:dash.sessions.week,c:'#06B6D4'},{l:'Completed',v:dash.sessions.completed,c:'#10B981'}
              ].map(s => (<div key={s.l} className="card p-4"><p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{color:'var(--color-text-tertiary)'}}>{s.l}</p><p className="text-2xl font-bold" style={{color:s.c}}>{s.v}</p></div>))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="card p-4">
                <p className="text-xs font-bold mb-3" style={{color:'var(--color-text-primary)'}}>Content</p>
                <div className="space-y-2 text-sm">
                  {[['Posts',dash.content.posts],['Reviews',dash.content.reviews],['Study Groups',dash.content.studyGroups],['Archived',dash.users.archived]].map(([l,v])=>(
                    <div key={l} className="flex justify-between"><span style={{color:'var(--color-text-tertiary)'}}>{l}</span><span style={{color:'var(--color-text-primary)'}}>{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="card p-4">
                <p className="text-xs font-bold mb-3" style={{color:'var(--color-text-primary)'}}>Feature Usage (7d)</p>
                <div className="space-y-2">{(dash.featureUsage||[]).slice(0,6).map(f=>(<div key={f._id} className="flex items-center gap-2"><div className="flex-1 h-2 rounded-full overflow-hidden" style={{background:'var(--color-surface)'}}><div className="h-full rounded-full" style={{width:`${Math.min(100,(f.count/Math.max(...dash.featureUsage.map(x=>x.count),1))*100)}%`,background:'#00F0B5'}}/></div><span className="text-[10px] w-16 text-right" style={{color:'var(--color-text-tertiary)'}}>{f._id}</span><span className="text-[10px] w-8 text-right font-mono" style={{color:'var(--color-text-secondary)'}}>{f.count}</span></div>))}</div>
              </div>
              <div className="card p-4">
                <p className="text-xs font-bold mb-3" style={{color:'var(--color-text-primary)'}}>Recent Activity</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">{(dash.recentActivity||[]).slice(0,8).map((a,i)=>(<div key={i} className="flex items-center gap-2 text-[10px] py-1" style={{borderBottom:'1px solid var(--color-border)'}}><span className="px-1 py-0.5 rounded text-[8px]" style={{background:'rgba(0,240,181,0.1)',color:'#00F0B5'}}>{a.category}</span><span style={{color:'var(--color-text-secondary)'}}>{a.userName} — {a.action}</span></div>))}</div>
              </div>
            </div>
          </div>
        ))}

        {/* ═══ USERS ═══ */}
        {tab === 'users' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              <form onSubmit={e=>{e.preventDefault();setUsersPage(1);loadUsers();}} className="flex-1 min-w-[200px] relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'var(--color-text-tertiary)'}}/>
                <input value={usersSearch} onChange={e=>setUsersSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inpS}/>
              </form>
              <select value={usersStatus} onChange={e=>{setUsersStatus(e.target.value);setUsersPage(1);}} className="px-3 py-2.5 rounded-xl text-xs" style={inpS}>
                <option value="">All</option><option value="verified">Verified</option><option value="unverified">Unverified</option><option value="blocked">Blocked</option>
              </select>
              <span className="text-xs self-center" style={{color:'var(--color-text-tertiary)'}}>{usersTotal} users</span>
            </div>
            {usersLoading ? <p className="text-center py-8 text-sm" style={{color:'var(--color-text-tertiary)'}}>Loading...</p> : (
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u._id} className="card p-4 flex items-center gap-3 cursor-pointer hover:scale-[1.003] transition-all" onClick={()=>{setSelectedUser(u);loadUserDetail(u._id);}}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{background:u.isBlocked?'#EF4444':u.isAdmin?'#F59E0B':'#00F0B5'}}>
                      {u.avatar?<img src={u.avatar} className="w-full h-full rounded-full object-cover" alt=""/>:u.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate" style={{color:'var(--color-text-primary)'}}>{u.name}</p>
                        {u.isAdmin&&<span className="text-[8px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 font-bold">ADMIN</span>}
                        {u.isBlocked&&<span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold">BLOCKED</span>}
                      </div>
                      <p className="text-[11px] truncate" style={{color:'var(--color-text-tertiary)'}}>{u.email}</p>
                    </div>
                    <div className="hidden md:block text-right"><p className="text-xs" style={{color:'var(--color-text-secondary)'}}>{u.sessionCount} sessions</p><p className="text-[10px]" style={{color:'var(--color-text-tertiary)'}}>Avg: {u.avgScore}%</p></div>
                    <div className="hidden md:block text-right"><p className="text-[10px]" style={{color:'var(--color-text-tertiary)'}}>Joined {fmt(u.createdAt)}</p></div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={e=>{e.stopPropagation();setMsgModal(u);setMsgTitle('');setMsgBody('');}} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(139,92,246,0.1)'}} title="Message"><MessageSquare size={11} style={{color:'#8B5CF6'}}/></button>
                      <button onClick={e=>{e.stopPropagation();toggleBlock(u._id);}} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:u.isBlocked?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)'}} title={u.isBlocked?'Unblock':'Block'}>
                        {u.isBlocked?<UserCheck size={11} style={{color:'#10B981'}}/>:<Ban size={11} style={{color:'#EF4444'}}/>}
                      </button>
                      <button onClick={e=>{e.stopPropagation();setDeleteModal(u);setDeleteCode('');setDeleteReason('');setDeleteError('');}} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(239,68,68,0.1)'}} title="Delete"><Trash2 size={11} style={{color:'#EF4444'}}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {usersPages>1&&(<div className="flex items-center justify-center gap-2 mt-4"><button onClick={()=>setUsersPage(p=>Math.max(1,p-1))} disabled={usersPage===1} className="px-3 py-1.5 rounded-lg text-xs" style={{...inpS,opacity:usersPage===1?0.5:1}}>Prev</button><span className="text-xs font-mono" style={{color:'var(--color-text-secondary)'}}>{usersPage}/{usersPages}</span><button onClick={()=>setUsersPage(p=>Math.min(usersPages,p+1))} disabled={usersPage===usersPages} className="px-3 py-1.5 rounded-lg text-xs" style={{...inpS,opacity:usersPage===usersPages?0.5:1}}>Next</button></div>)}

            {/* User Detail Modal */}
            {selectedUser&&(
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)'}}>
                <div className="card p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{background:selectedUser.isBlocked?'#EF4444':'#00F0B5'}}>{selectedUser.name?.[0]?.toUpperCase()}</div>
                      <div><p className="text-sm font-bold" style={{color:'var(--color-text-primary)'}}>{selectedUser.name}</p><p className="text-[11px]" style={{color:'var(--color-text-tertiary)'}}>{selectedUser.email}</p></div>
                    </div>
                    <button onClick={()=>{setSelectedUser(null);setUserDetail(null);}}><X size={16} style={{color:'var(--color-text-tertiary)'}}/></button>
                  </div>
                  {detailLoading?<p className="text-center py-8 text-sm" style={{color:'var(--color-text-tertiary)'}}>Loading...</p>:userDetail&&(
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {[{l:'Sessions',v:userDetail.stats.totalSessions},{l:'Avg',v:`${userDetail.stats.avgScore}%`},{l:'Best',v:`${userDetail.stats.bestScore}%`},{l:'Posts',v:userDetail.stats.totalPosts},{l:'Reviews',v:userDetail.stats.totalReviews},{l:'Done',v:userDetail.stats.completedSessions}].map(s=>(
                          <div key={s.l} className="p-2.5 rounded-lg text-center" style={{background:'var(--color-surface)',border:'1px solid var(--color-border)'}}><p className="text-lg font-bold" style={{color:'#00F0B5'}}>{s.v}</p><p className="text-[9px]" style={{color:'var(--color-text-tertiary)'}}>{s.l}</p></div>
                        ))}
                      </div>
                      <div className="p-3 rounded-lg text-xs space-y-1" style={{background:'var(--color-surface)',border:'1px solid var(--color-border)'}}>
                        {[['Phone',userDetail.user.phone],['College',userDetail.user.college],['Company',userDetail.user.currentCompany],['Location',userDetail.user.location],['Skills',userDetail.user.skills?.join(', ')],['Joined',fmt(userDetail.user.createdAt)]].map(([l,v])=>(
                          <p key={l} style={{color:'var(--color-text-tertiary)'}}>{l}: <strong style={{color:'var(--color-text-secondary)'}}>{v||'-'}</strong></p>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={()=>{setMsgModal(selectedUser);setMsgTitle('');setMsgBody('');}} className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5" style={{background:'rgba(139,92,246,0.1)',color:'#8B5CF6',border:'1px solid rgba(139,92,246,0.2)'}}><MessageSquare size={11}/> Message</button>
                        <button onClick={()=>toggleBlock(selectedUser._id)} className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5" style={{background:selectedUser.isBlocked?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',color:selectedUser.isBlocked?'#10B981':'#EF4444',border:`1px solid ${selectedUser.isBlocked?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}`}}>{selectedUser.isBlocked?<><UserCheck size={11}/> Unblock</>:<><Ban size={11}/> Block</>}</button>
                        <button onClick={()=>{setDeleteModal(selectedUser);setDeleteCode('');setDeleteReason('');setDeleteError('');}} className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5" style={{background:'rgba(239,68,68,0.1)',color:'#EF4444',border:'1px solid rgba(239,68,68,0.2)'}}><Trash2 size={11}/> Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ FEATURES ═══ */}
        {tab === 'features' && (
          <div className="card p-6">
            <h3 className="text-sm font-bold mb-1" style={{color:'var(--color-text-primary)'}}>Feature Toggles</h3>
            <p className="text-xs mb-6" style={{color:'var(--color-text-tertiary)'}}>Enable/disable features. Requires 8-digit secret code.</p>
            <div className="space-y-3">
              {features.map(f=>(<div key={f.key} className="flex items-center justify-between p-3 rounded-xl" style={{background:'var(--color-surface)',border:'1px solid var(--color-border)'}}><div><p className="text-sm font-medium" style={{color:'var(--color-text-primary)'}}>{f.name}</p><p className="text-[10px]" style={{color:'var(--color-text-tertiary)'}}>{f.key}</p></div><button onClick={()=>toggleFeature(f.key)}>{f.enabled?<ToggleRight size={28} style={{color:'#00F0B5'}}/>:<ToggleLeft size={28} style={{color:'var(--color-text-tertiary)'}}/>}</button></div>))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <input value={featureCode} onChange={e=>setFeatureCode(e.target.value)} placeholder="8-digit code" maxLength={8} className="px-4 py-2.5 rounded-xl text-sm outline-none font-mono tracking-widest w-40 text-center" style={inpS}/>
              <button onClick={saveFeatures} className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{background:'#00F0B5',color:'#0a0a0a'}}>Save</button>
              {featureSaved&&<span className="text-xs flex items-center gap-1" style={{color:'#10B981'}}><Check size={12}/> Saved!</span>}
            </div>
            {featureError&&<p className="text-xs mt-2" style={{color:'var(--color-danger)'}}>{featureError}</p>}
          </div>
        )}

        {/* ═══ NOTIFICATIONS ═══ */}
        {tab === 'notifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4"><Bell size={16} style={{color:'#00F0B5'}}/><h3 className="text-sm font-bold" style={{color:'var(--color-text-primary)'}}>Send Notification</h3></div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button onClick={()=>setNotifTarget('all')} className="flex-1 py-2 rounded-lg text-xs font-medium" style={{background:notifTarget==='all'?'#00F0B5':'var(--color-surface)',color:notifTarget==='all'?'#0a0a0a':'var(--color-text-secondary)',border:`1px solid ${notifTarget==='all'?'#00F0B5':'var(--color-border)'}`}}>All Users</button>
                  <button onClick={()=>setNotifTarget('user')} className="flex-1 py-2 rounded-lg text-xs font-medium" style={{background:notifTarget==='user'?'#8B5CF6':'var(--color-surface)',color:notifTarget==='user'?'#fff':'var(--color-text-secondary)',border:`1px solid ${notifTarget==='user'?'#8B5CF6':'var(--color-border)'}`}}>Single User</button>
                </div>
                {notifTarget==='user'&&(
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input value={notifUserSearch} onChange={e=>setNotifUserSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchNotifUsers()} placeholder="Search user..." className={inp} style={inpS}/>
                      <button onClick={searchNotifUsers} className="px-3 py-2 rounded-lg text-xs" style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',color:'var(--color-text-secondary)'}}>Find</button>
                    </div>
                    {notifUsers.length>0&&(<div className="space-y-1 mb-2">{notifUsers.map(u=>(<button key={u._id} onClick={()=>{setNotifUserId(u._id);setNotifUsers([]);setNotifUserSearch(u.name);}} className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs" style={{background:notifUserId===u._id?'rgba(139,92,246,0.1)':'var(--color-surface)',border:`1px solid ${notifUserId===u._id?'rgba(139,92,246,0.3)':'var(--color-border)'}`}}><span style={{color:'var(--color-text-primary)'}}>{u.name}</span><span style={{color:'var(--color-text-tertiary)'}}>{u.email}</span></button>))}</div>)}
                  </div>
                )}
                <select value={notifType} onChange={e=>setNotifType(e.target.value)} className="px-3 py-2.5 rounded-xl text-xs" style={inpS}>
                  <option value="info">Info (blue)</option><option value="success">Success (green)</option><option value="warning">Warning (yellow)</option><option value="alert">Alert (red)</option><option value="personal">Personal (purple)</option>
                </select>
                <input value={notifTitle} onChange={e=>setNotifTitle(e.target.value)} placeholder="Title" className={inp} style={inpS}/>
                <textarea value={notifMsg} onChange={e=>setNotifMsg(e.target.value)} placeholder="Message..." rows={3} className={inp} style={{...inpS,resize:'vertical'}}/>
                <button onClick={sendNotification} disabled={notifSending} className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{background:'#00F0B5',color:'#0a0a0a',opacity:notifSending?0.7:1}}><Send size={14}/> {notifSending?'Sending...':'Send Notification'}</button>
                {notifSuccess&&<p className="text-xs" style={{color:'#10B981'}}>{notifSuccess}</p>}
                {notifError&&<p className="text-xs" style={{color:'var(--color-danger)'}}>{notifError}</p>}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-bold mb-4" style={{color:'var(--color-text-primary)'}}>Sent Notifications</h3>
              {notifsLoading?<p className="text-sm" style={{color:'var(--color-text-tertiary)'}}>Loading...</p>:sentNotifs.length===0?<p className="text-sm" style={{color:'var(--color-text-tertiary)'}}>No notifications sent yet.</p>:(
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {sentNotifs.map(n=>(<div key={n._id} className="p-3 rounded-lg" style={{background:'var(--color-surface)',border:'1px solid var(--color-border)'}}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{background:typeColors[n.type]||'#0071E3'}}/>
                        <span className="text-xs font-semibold" style={{color:'var(--color-text-primary)'}}>{n.title}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{background:`${typeColors[n.type]}15`,color:typeColors[n.type]}}>{n.isGlobal?'ALL':'Personal'}</span>
                      </div>
                      <button onClick={()=>deleteNotif(n._id)}><Trash2 size={10} style={{color:'var(--color-text-tertiary)'}}/></button>
                    </div>
                    <p className="text-[11px] mb-1" style={{color:'var(--color-text-secondary)'}}>{n.message}</p>
                    <p className="text-[9px]" style={{color:'var(--color-text-tertiary)'}}>{fmtFull(n.createdAt)} · Read by {n.readBy?.length||0}</p>
                  </div>))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ ACTIVITY ═══ */}
        {tab === 'activity' && (
          <div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {['all','auth','interview','forum','review','studyroom','admin','profile','other'].map(c=>(<button key={c} onClick={()=>{setLogsCat(c);setLogsPage(1);}} className="px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap" style={{background:logsCat===c?'#00F0B5':'var(--color-surface)',color:logsCat===c?'#0a0a0a':'var(--color-text-secondary)',border:`1px solid ${logsCat===c?'#00F0B5':'var(--color-border)'}`}}>{c}</button>))}
            </div>
            {logsLoading?<p className="text-center py-8 text-sm" style={{color:'var(--color-text-tertiary)'}}>Loading...</p>:(
              <div className="card p-4"><div className="space-y-1">{logs.map((l,i)=>(<div key={i} className="flex items-center gap-3 py-2 text-xs" style={{borderBottom:'1px solid var(--color-border)'}}><span className="px-1.5 py-0.5 rounded text-[8px] font-medium w-16 text-center" style={{background:'rgba(0,240,181,0.08)',color:'#00F0B5'}}>{l.category}</span><span className="font-medium w-24 truncate" style={{color:'var(--color-text-primary)'}}>{l.userName}</span><span className="flex-1 truncate" style={{color:'var(--color-text-secondary)'}}>{l.action}</span><span className="text-[10px] w-20 text-right" style={{color:'var(--color-text-tertiary)'}}>{fmtFull(l.createdAt)}</span></div>))}{logs.length===0&&<p className="text-center py-8 text-sm" style={{color:'var(--color-text-tertiary)'}}>No logs.</p>}</div></div>
            )}
          </div>
        )}

        {/* ═══ SECURITY ═══ */}
        {tab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Change Username */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4"><User size={16} style={{color:'#06B6D4'}}/><h3 className="text-sm font-bold" style={{color:'var(--color-text-primary)'}}>Change Admin Username</h3></div>
              <div className="space-y-3">
                <input value={newUsername} onChange={e=>setNewUsername(e.target.value)} placeholder="New username" className={inp} style={inpS}/>
                <input value={usernameCode} onChange={e=>setUsernameCode(e.target.value)} placeholder="8-digit secret code" maxLength={8} className={inp+" font-mono tracking-widest text-center"} style={inpS}/>
                <button onClick={changeUsername} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{background:'#06B6D4',color:'#fff'}}>Update Username</button>
              </div>
              {usernameError&&<p className="text-xs mt-2" style={{color:'var(--color-danger)'}}>{usernameError}</p>}
              {usernameSuccess&&<p className="text-xs mt-2" style={{color:'#10B981'}}>{usernameSuccess}</p>}
            </div>

            {/* Change Secret Code */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4"><Key size={16} style={{color:'#F59E0B'}}/><h3 className="text-sm font-bold" style={{color:'var(--color-text-primary)'}}>Change Secret Code</h3></div>
              <div className="space-y-3">
                <input value={secCurrentCode} onChange={e=>setSecCurrentCode(e.target.value)} placeholder="Current code" maxLength={8} className={inp+" font-mono tracking-widest text-center"} style={inpS}/>
                <input value={secNewCode} onChange={e=>setSecNewCode(e.target.value)} placeholder="New 8-digit code" maxLength={8} className={inp+" font-mono tracking-widest text-center"} style={inpS}/>
                <button onClick={changeSecretCode} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{background:'#F59E0B',color:'#0a0a0a'}}>Update Code</button>
              </div>
              {secCodeError&&<p className="text-xs mt-2" style={{color:'var(--color-danger)'}}>{secCodeError}</p>}
              {secCodeSuccess&&<p className="text-xs mt-2" style={{color:'#10B981'}}>{secCodeSuccess}</p>}
            </div>

            {/* Change Passwords */}
            <div className="card p-6 md:col-span-2">
              <div className="flex items-center gap-2 mb-4"><Lock size={16} style={{color:'#EF4444'}}/><h3 className="text-sm font-bold" style={{color:'var(--color-text-primary)'}}>Change Admin Passwords</h3></div>
              <p className="text-xs mb-4" style={{color:'var(--color-text-tertiary)'}}>Change Password 1 only, Password 2 only, or both. Requires email OTP + secret code.</p>
              {!otpSent?(
                <button onClick={sendOTP} disabled={otpSending} className="px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2" style={{background:'#EF4444',color:'#fff',opacity:otpSending?0.7:1}}><Mail size={14}/> {otpSending?'Sending...':'Send OTP to Email'}</button>
              ):(
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{color:'var(--color-text-tertiary)'}}>6-Digit OTP</label>
                      <input value={otpVal} onChange={e=>setOtpVal(e.target.value)} placeholder="OTP from email" maxLength={6} className={inp+" font-mono tracking-widest text-center"} style={inpS}/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{color:'var(--color-text-tertiary)'}}>8-Digit Secret Code</label>
                      <input value={passCode} onChange={e=>setPassCode(e.target.value)} placeholder="Secret code" maxLength={8} className={inp+" font-mono tracking-widest text-center"} style={inpS}/>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{color:'var(--color-text-tertiary)'}}>New Password 1 <span style={{color:'var(--color-text-tertiary)'}}>(leave blank to keep same)</span></label>
                      <input type="password" value={newPass1} onChange={e=>setNewPass1(e.target.value)} placeholder="New password 1" className={inp} style={inpS}/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{color:'var(--color-text-tertiary)'}}>New Password 2 <span style={{color:'var(--color-text-tertiary)'}}>(leave blank to keep same)</span></label>
                      <input type="password" value={newPass2} onChange={e=>setNewPass2(e.target.value)} placeholder="New password 2" className={inp} style={inpS}/>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={changePassword} disabled={passLoading} className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{background:'#EF4444',color:'#fff',opacity:passLoading?0.7:1}}>{passLoading?'Changing...':'Change Password(s)'}</button>
                    <button onClick={()=>{setOtpSent(false);setPassError('');}} className="px-4 py-2.5 rounded-xl text-xs" style={{color:'var(--color-text-tertiary)',border:'1px solid var(--color-border)'}}>Cancel</button>
                  </div>
                </div>
              )}
              {passError&&<p className="text-xs mt-2" style={{color:'var(--color-danger)'}}>{passError}</p>}
              {passSuccess&&<p className="text-xs mt-2" style={{color:'#10B981'}}>{passSuccess}</p>}
            </div>

            {/* Security Info */}
            <div className="card p-6 md:col-span-2">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle size={16} style={{color:'#F59E0B'}}/><h3 className="text-sm font-bold" style={{color:'var(--color-text-primary)'}}>Security Info</h3></div>
              <div className="text-xs space-y-1.5" style={{color:'var(--color-text-tertiary)'}}>
                <p>• Secret code is required for: delete user, change features, permanent delete.</p>
                <p>• Password change requires: email OTP + secret code + at least one new password.</p>
                <p>• You can change Password 1 only, Password 2 only, or both at once.</p>
                <p>• Passwords saved to database override .env values.</p>
                <p>• Username change takes effect on next login.</p>
                <p>• All admin actions are logged with timestamp.</p>
                <p>• Blocked users get 403 error on every request.</p>
                <p>• OTP expires in 10 minutes.</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ARCHIVED ═══ */}
        {tab === 'archived' && (
          archLoading?<p className="text-center py-8 text-sm" style={{color:'var(--color-text-tertiary)'}}>Loading...</p>:archived.length===0?(
            <div className="card p-12 text-center"><Archive size={40} className="mx-auto mb-4" style={{color:'var(--color-text-tertiary)'}}/><p className="font-medium" style={{color:'var(--color-text-primary)'}}>No archived users</p><p className="text-sm" style={{color:'var(--color-text-secondary)'}}>Deleted users appear here.</p></div>
          ):(
            <div className="space-y-2">{archived.map(a=>(<div key={a._id} className="card p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{background:'rgba(239,68,68,0.1)',color:'#EF4444'}}>{a.name?.[0]?.toUpperCase()}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate" style={{color:'var(--color-text-primary)'}}>{a.name}</p><p className="text-[10px]" style={{color:'var(--color-text-tertiary)'}}>{a.email} · {a.totalSessions} sessions · Avg {a.avgScore}%</p></div>
              <div className="text-right"><p className="text-[10px]" style={{color:'var(--color-text-tertiary)'}}>Deleted {fmt(a.deletedAt)}</p><p className="text-[10px]" style={{color:'var(--color-text-tertiary)'}}>{a.reason&&`Reason: ${a.reason}`}</p></div>
              <button onClick={()=>permDelete(a._id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(239,68,68,0.1)'}}><Trash2 size={11} style={{color:'#EF4444'}}/></button>
            </div>))}</div>
          )
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)'}}>
          <div className="card p-6 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-4"><AlertTriangle size={18} style={{color:'#EF4444'}}/><h3 className="font-semibold" style={{color:'var(--color-text-primary)'}}>Delete User</h3></div>
            <p className="text-xs mb-1" style={{color:'var(--color-text-secondary)'}}>Deleting <strong>{deleteModal.name}</strong> ({deleteModal.email})</p>
            <p className="text-[10px] mb-4" style={{color:'var(--color-text-tertiary)'}}>Data will be archived. Enter 8-digit secret code.</p>
            <div className="space-y-3">
              <input value={deleteReason} onChange={e=>setDeleteReason(e.target.value)} placeholder="Reason (optional)" className={inp} style={inpS}/>
              <input value={deleteCode} onChange={e=>setDeleteCode(e.target.value)} placeholder="8-digit code" maxLength={8} className={inp+" font-mono tracking-widest text-center"} style={inpS}/>
              {deleteError&&<p className="text-xs" style={{color:'var(--color-danger)'}}>{deleteError}</p>}
              <div className="flex gap-2">
                <button onClick={()=>setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{background:'var(--color-surface)',color:'var(--color-text-secondary)',border:'1px solid var(--color-border)'}}>Cancel</button>
                <button onClick={deleteUser} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{background:'#EF4444',color:'#fff'}}>Delete & Archive</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Message Modal */}
      {msgModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)'}}>
          <div className="card p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><MessageSquare size={16} style={{color:'#8B5CF6'}}/><h3 className="font-semibold" style={{color:'var(--color-text-primary)'}}>Message {msgModal.name}</h3></div>
              <button onClick={()=>setMsgModal(null)}><X size={16} style={{color:'var(--color-text-tertiary)'}}/></button>
            </div>
            <div className="space-y-3">
              <input value={msgTitle} onChange={e=>setMsgTitle(e.target.value)} placeholder="Subject" className={inp} style={inpS}/>
              <textarea value={msgBody} onChange={e=>setMsgBody(e.target.value)} placeholder="Your message..." rows={3} className={inp} style={{...inpS,resize:'vertical'}}/>
              <button onClick={sendPersonalMsg} disabled={msgSending} className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{background:'#8B5CF6',color:'#fff',opacity:msgSending?0.7:1}}><Send size={14}/> {msgSending?'Sending...':'Send Message'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
