import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Brain, ArrowLeft, Users, Plus, X, Send, Search, Lock, Unlock, Crown, LogOut, Copy, Check, BookOpen, Trash2, Clock, MessageSquare, UserPlus, Phone, PhoneOff, Mic, MicOff, Shield, Archive, UserMinus } from 'lucide-react';
import io from 'socket.io-client';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {theme === 'dark' ? <Sun size={16} style={{ color: 'var(--color-warning)' }} /> : <Moon size={16} style={{ color: 'var(--color-text-secondary)' }} />}
    </button>
  );
}

const TOPICS = ['All','DSA','System Design','Behavioral','Career','Frontend','Backend','Full Stack','DevOps','ML/AI','General'];
const DIFFS = ['Mixed','Beginner','Intermediate','Advanced'];
const topicColors = { DSA:'#F59E0B','System Design':'#10B981',Behavioral:'#F97316',Career:'#8B5CF6',Frontend:'#0071E3',Backend:'#EC4899','Full Stack':'#06B6D4',DevOps:'#EF4444','ML/AI':'#14B8A6',General:'#6B7280' };
const diffColors = { Beginner:'#10B981',Intermediate:'#F59E0B',Advanced:'#EF4444',Mixed:'#8B5CF6' };

const SOCKET_URL = 'http://localhost:5000';

function matchId(a, b) {
  if (!a || !b) return false;
  return a.toString() === b.toString();
}

export default function StudyGroups() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user?._id || user?.id || '';

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('All');
  const [search, setSearch] = useState('');
  const [myRooms, setMyRooms] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [stats, setStats] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [form, setForm] = useState({ name:'', description:'', maxMembers:10, topic:'General', difficulty:'Mixed', isPrivate:false, tags:'' });

  const [joinModal, setJoinModal] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const [activeRoom, setActiveRoom] = useState(null);
  const [roomLoading, setRoomLoading] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showShareQ, setShowShareQ] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [questions, setQuestions] = useState([]);
  const [searchingQ, setSearchingQ] = useState(false);

  const [showAdmin, setShowAdmin] = useState(false);

  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voiceUsers, setVoiceUsers] = useState([]);
  const socketRef = useRef(null);
  const peersRef = useRef({});
  const localStreamRef = useRef(null);

  const chatEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => { loadGroups(); loadStats(); }, [page, topic, myRooms]);

  useEffect(() => {
    if (activeRoom) {
      pollRef.current = setInterval(() => refreshRoom(activeRoom._id), 4000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeRoom?._id]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeRoom?.messages?.length]);

  useEffect(() => {
    return () => {
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
      if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
      Object.values(peersRef.current).forEach(pc => pc.close());
      peersRef.current = {};
    };
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (topic !== 'All') params.set('topic', topic);
      if (search) params.set('search', search);
      if (myRooms) params.set('mine', 'true');
      const res = await fetch(`/api/study-groups?${params}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) { setGroups(data.groups); setTotal(data.total); setPages(data.pages); }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const loadStats = async () => {
    try { const r = await fetch('/api/study-groups/meta/stats'); const d = await r.json(); if (d.success) setStats(d); } catch(e) { console.error(e); }
  };

  const loadRoom = async (id) => {
    setRoomLoading(true);
    try {
      const r = await fetch(`/api/study-groups/${id}`, { credentials: 'include' });
      const d = await r.json();
      if (d.success) setActiveRoom(d.group);
    } catch(e) { console.error(e); }
    setRoomLoading(false);
  };

  const refreshRoom = async (id) => {
    try {
      const r = await fetch(`/api/study-groups/${id}`, { credentials: 'include' });
      const d = await r.json();
      if (d.success) setActiveRoom(prev => prev && prev._id === d.group._id ? { ...d.group } : prev);
    } catch(e) {}
  };

  const createRoom = async () => {
    setCreateError('');
    if (!form.name || form.name.length < 3) { setCreateError('Name must be at least 3 characters.'); return; }
    setCreating(true);
    try {
      const r = await fetch('/api/study-groups', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }),
      });
      const d = await r.json();
      if (d.success) { setShowCreate(false); setForm({ name:'',description:'',maxMembers:10,topic:'General',difficulty:'Mixed',isPrivate:false,tags:'' }); loadGroups(); loadStats(); loadRoom(d.group._id); }
      else setCreateError(d.error || 'Failed to create.');
    } catch(e) { setCreateError('Network error: ' + e.message); }
    setCreating(false);
  };

  const joinRoom = async (id, code) => {
    setJoinError('');
    try {
      const r = await fetch(`/api/study-groups/${id}/join`, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({ joinCode: code || undefined }) });
      const d = await r.json();
      if (d.success) { setJoinModal(null); setJoinCode(''); loadRoom(id); loadGroups(); }
      else setJoinError(d.error || 'Failed to join.');
    } catch(e) { setJoinError('Network error.'); }
  };

  const leaveRoom = async () => {
    if (!activeRoom || !window.confirm('Leave this room?')) return;
    endVoiceCall();
    try {
      const r = await fetch(`/api/study-groups/${activeRoom._id}/leave`, { method:'POST', credentials:'include' });
      if ((await r.json()).success) { setActiveRoom(null); loadGroups(); }
    } catch(e) {}
  };

  const deleteRoom = async () => {
    if (!activeRoom || !window.confirm('Delete this room permanently?')) return;
    endVoiceCall();
    try {
      const r = await fetch(`/api/study-groups/${activeRoom._id}`, { method:'DELETE', credentials:'include' });
      if ((await r.json()).success) { setActiveRoom(null); loadGroups(); loadStats(); }
    } catch(e) {}
  };

  const sendMessage = async () => {
    if (!chatMsg.trim() || !activeRoom) return;
    setSending(true);
    try {
      const r = await fetch(`/api/study-groups/${activeRoom._id}/message`, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({ content: chatMsg.trim() }) });
      const d = await r.json();
      if (d.success) { setChatMsg(''); refreshRoom(activeRoom._id); }
      else if (d.error) alert(d.error);
    } catch(e) {}
    setSending(false);
  };

  const deleteMessage = async (msgId) => {
    try { await fetch(`/api/study-groups/${activeRoom._id}/message/${msgId}`, { method:'DELETE', credentials:'include' }); refreshRoom(activeRoom._id); } catch(e) {}
  };

  const kickMember = async (userId, userName) => {
    if (!window.confirm(`Remove ${userName} from this room?`)) return;
    try {
      const r = await fetch(`/api/study-groups/${activeRoom._id}/kick/${userId}`, { method:'POST', credentials:'include' });
      if ((await r.json()).success) refreshRoom(activeRoom._id);
    } catch(e) {}
  };

  const toggleChat = async () => {
    try {
      const r = await fetch(`/api/study-groups/${activeRoom._id}/toggle-chat`, { method:'POST', credentials:'include' });
      if ((await r.json()).success) refreshRoom(activeRoom._id);
    } catch(e) {}
  };

  const archiveRoom = async () => {
    if (!window.confirm('Close this room? No more chatting.')) return;
    endVoiceCall();
    try {
      const r = await fetch(`/api/study-groups/${activeRoom._id}/archive`, { method:'POST', credentials:'include' });
      if ((await r.json()).success) { setActiveRoom(null); loadGroups(); }
    } catch(e) {}
  };

  const transferOwnership = async (userId, userName) => {
    if (!window.confirm(`Transfer admin to ${userName}?`)) return;
    try {
      const r = await fetch(`/api/study-groups/${activeRoom._id}/transfer/${userId}`, { method:'POST', credentials:'include' });
      if ((await r.json()).success) refreshRoom(activeRoom._id);
    } catch(e) {}
  };

  const searchQuestions = async () => {
    if (!searchQ.trim()) return;
    setSearchingQ(true);
    try { const r = await fetch(`/api/questions?search=${searchQ}&limit=10`); const d = await r.json(); if (d.success) setQuestions(d.questions || []); } catch(e) {}
    setSearchingQ(false);
  };

  const shareQuestion = async (qId) => {
    try {
      const r = await fetch(`/api/study-groups/${activeRoom._id}/share-question`, { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({ questionId: qId }) });
      if ((await r.json()).success) { setShowShareQ(false); setSearchQ(''); setQuestions([]); refreshRoom(activeRoom._id); }
    } catch(e) {}
  };

  // Voice
  const startVoiceCall = async () => {
    if (!activeRoom || inCall) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      const socket = io(SOCKET_URL);
      socketRef.current = socket;
      socket.on('connect', () => { socket.emit('join-voice', activeRoom._id); });
      socket.on('voice-users', (users) => { setVoiceUsers(users); users.forEach(u => createPeer(u, stream, socket, true)); });
      socket.on('user-joined-voice', (u) => { setVoiceUsers(prev => [...prev.filter(x => x !== u), u]); createPeer(u, stream, socket, false); });
      socket.on('user-left-voice', (u) => { setVoiceUsers(prev => prev.filter(x => x !== u)); if (peersRef.current[u]) { peersRef.current[u].close(); delete peersRef.current[u]; } });
      socket.on('offer', async ({ from, offer }) => { const pc = peersRef.current[from] || createPC(from, stream, socket); await pc.setRemoteDescription(new RTCSessionDescription(offer)); const ans = await pc.createAnswer(); await pc.setLocalDescription(ans); socket.emit('answer', { to: from, answer: ans }); });
      socket.on('answer', async ({ from, answer }) => { const pc = peersRef.current[from]; if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer)); });
      socket.on('ice-candidate', async ({ from, candidate }) => { const pc = peersRef.current[from]; if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate)); });
      socket.on('call-ended', (u) => { if (peersRef.current[u]) { peersRef.current[u].close(); delete peersRef.current[u]; } setVoiceUsers(prev => prev.filter(x => x !== u)); });
      setInCall(true);
    } catch(err) { alert('Microphone access denied.'); }
  };

  const createPC = (u, stream, socket) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    peersRef.current[u] = pc;
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    pc.onicecandidate = (e) => { if (e.candidate) socket.emit('ice-candidate', { to: u, candidate: e.candidate }); };
    pc.ontrack = (e) => { const a = new Audio(); a.srcObject = e.streams[0]; a.play().catch(() => {}); };
    return pc;
  };

  const createPeer = async (u, stream, socket, initiator) => {
    const pc = createPC(u, stream, socket);
    if (initiator) { const offer = await pc.createOffer(); await pc.setLocalDescription(offer); socket.emit('offer', { to: u, offer }); }
  };

  const endVoiceCall = () => {
    if (socketRef.current && activeRoom) { socketRef.current.emit('end-call', activeRoom._id); socketRef.current.emit('leave-voice', activeRoom._id); socketRef.current.disconnect(); socketRef.current = null; }
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
    Object.values(peersRef.current).forEach(pc => pc.close());
    peersRef.current = {};
    setInCall(false); setMuted(false); setVoiceUsers([]);
  };

  const toggleMute = () => {
    if (localStreamRef.current) { const t = localStreamRef.current.getAudioTracks()[0]; if (t) { t.enabled = !t.enabled; setMuted(!t.enabled); } }
  };

  const copyCode = (code) => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (d) => { const now = Date.now(); const diff = now - new Date(d).getTime(); if (diff < 60000) return 'now'; if (diff < 3600000) return `${Math.floor(diff/60000)}m`; if (diff < 86400000) return `${Math.floor(diff/3600000)}h`; return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short' }); };

  const isMember = activeRoom?.members?.some(m => matchId(m.userId, uid));
  const isAdmin = activeRoom?.members?.find(m => matchId(m.userId, uid))?.role === 'admin';
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = "w-full px-4 py-3 rounded-xl text-sm outline-none";

  // ═══ ROOM DETAIL ═══
  if (activeRoom) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="sticky top-0 z-40 glass shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
            <button onClick={() => { setActiveRoom(null); endVoiceCall(); clearInterval(pollRef.current); }} className="flex items-center gap-2 text-sm flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
              <ArrowLeft size={16} /> Rooms
            </button>
            <div className="flex items-center gap-2 min-w-0 flex-1 mx-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${topicColors[activeRoom.topic]||'#6B7280'}15` }}>
                <Users size={14} style={{ color: topicColors[activeRoom.topic]||'#6B7280' }} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{activeRoom.name}</h2>
                <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {activeRoom.members?.length}/{activeRoom.maxMembers} · {activeRoom.topic}
                  {activeRoom.chatLocked && <span style={{ color: 'var(--color-danger)' }}> · 🔒 Locked</span>}
                  {activeRoom.status === 'archived' && <span style={{ color: 'var(--color-danger)' }}> · Closed</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isMember && (
                inCall ? (
                  <div className="flex items-center gap-1">
                    <button onClick={toggleMute} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: muted ? 'rgba(255,59,48,0.1)' : 'rgba(0,240,181,0.1)', border: `1px solid ${muted ? 'rgba(255,59,48,0.3)' : 'rgba(0,240,181,0.3)'}` }}>
                      {muted ? <MicOff size={12} style={{ color: 'var(--color-danger)' }} /> : <Mic size={12} style={{ color: '#00F0B5' }} />}
                    </button>
                    <button onClick={endVoiceCall} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)' }}>
                      <PhoneOff size={12} style={{ color: 'var(--color-danger)' }} />
                    </button>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,240,181,0.1)', color: '#00F0B5' }}>🟢 {voiceUsers.length + 1}</span>
                  </div>
                ) : (
                  <button onClick={startVoiceCall} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} title="Voice Call">
                    <Phone size={12} style={{ color: 'var(--color-text-tertiary)' }} />
                  </button>
                )
              )}
              {activeRoom.isPrivate && activeRoom.joinCode && isAdmin && (
                <button onClick={() => copyCode(activeRoom.joinCode)} className="flex items-center gap-1 text-[9px] font-mono px-2 py-1.5 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  {copied ? <Check size={9} /> : <Copy size={9} />} {activeRoom.joinCode}
                </button>
              )}
              {isAdmin && (
                <button onClick={() => setShowAdmin(!showAdmin)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: showAdmin ? 'rgba(0,240,181,0.1)' : 'var(--color-surface)', border: `1px solid ${showAdmin ? 'rgba(0,240,181,0.3)' : 'var(--color-border)'}` }}>
                  <Shield size={12} style={{ color: showAdmin ? '#00F0B5' : 'var(--color-text-tertiary)' }} />
                </button>
              )}
              {isMember && !isAdmin && (
                <button onClick={leaveRoom} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ border: '1px solid var(--color-border)' }}>
                  <LogOut size={11} style={{ color: 'var(--color-danger)' }} />
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
          {showAdmin && isAdmin && (
            <div className="max-w-5xl mx-auto px-4 pb-3">
              <div className="p-3 rounded-xl flex flex-wrap items-center gap-2" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider mr-2" style={{ color: '#00F0B5' }}>Admin</span>
                <button onClick={toggleChat} className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg" style={{ background: activeRoom.chatLocked ? 'rgba(255,59,48,0.08)' : 'rgba(0,240,181,0.08)', color: activeRoom.chatLocked ? 'var(--color-danger)' : '#00F0B5', border: `1px solid ${activeRoom.chatLocked ? 'rgba(255,59,48,0.2)' : 'rgba(0,240,181,0.2)'}` }}>
                  {activeRoom.chatLocked ? <><Unlock size={10} /> Unlock Chat</> : <><Lock size={10} /> Lock Chat</>}
                </button>
                <button onClick={archiveRoom} className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg" style={{ color: 'var(--color-danger)', border: '1px solid rgba(255,59,48,0.2)', background: 'rgba(255,59,48,0.05)' }}>
                  <Archive size={10} /> Close Room
                </button>
                <button onClick={deleteRoom} className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg" style={{ color: 'var(--color-danger)', border: '1px solid rgba(255,59,48,0.2)', background: 'rgba(255,59,48,0.05)' }}>
                  <Trash2 size={10} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex max-w-5xl mx-auto w-full" style={{ height: 'calc(100vh - 60px)' }}>
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
              {roomLoading ? (
                <div className="text-center py-16"><p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading...</p></div>
              ) : (!activeRoom.messages || activeRoom.messages.length === 0) ? (
                <div className="text-center py-16">
                  <MessageSquare size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>No messages yet. Say hello!</p>
                </div>
              ) : activeRoom.messages.map(msg => (
                <div key={msg._id} className={`flex gap-2.5 ${msg.userName === 'System' ? 'justify-center' : ''}`}>
                  {msg.userName === 'System' ? (
                    <div className="text-[10px] px-3 py-1 rounded-full" style={{ background: 'var(--color-surface)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border)' }}>{msg.content}</div>
                  ) : (
                    <>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: matchId(msg.userId, uid) ? '#00F0B5' : 'var(--color-accent)' }}>
                        {msg.userAvatar ? <img src={msg.userAvatar} alt="" className="w-full h-full rounded-full object-cover" /> : msg.userName?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 group">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold" style={{ color: matchId(msg.userId, uid) ? '#00F0B5' : 'var(--color-text-primary)' }}>{msg.userName}</span>
                          <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>{fmt(msg.createdAt)}</span>
                          {(matchId(msg.userId, uid) || isAdmin) && msg.userName !== 'System' && (
                            <button onClick={() => deleteMessage(msg._id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={9} style={{ color: 'var(--color-text-tertiary)' }} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed break-words" style={{ color: 'var(--color-text-secondary)' }}>{msg.content}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {activeRoom.status === 'archived' ? (
              <div className="px-4 py-3 text-center text-sm" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>This room has been closed.</div>
            ) : isMember ? (
              <div className="px-4 py-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                {activeRoom.chatLocked && !isAdmin ? (
                  <div className="text-center text-xs py-2" style={{ color: 'var(--color-danger)' }}>🔒 Chat locked by admin</div>
                ) : (
                  <div className="flex gap-2">
                    <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                    <button onClick={() => setShowShareQ(true)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                      <BookOpen size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                    </button>
                    <button onClick={sendMessage} disabled={!chatMsg.trim() || sending} className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: chatMsg.trim() ? '#00F0B5' : 'var(--color-surface)', border: `1px solid ${chatMsg.trim() ? '#00F0B5' : 'var(--color-border)'}` }}>
                      <Send size={14} style={{ color: chatMsg.trim() ? '#0a0a0a' : 'var(--color-text-tertiary)' }} />
                    </button>
                  </div>
                )}
              </div>
            ) : user ? (
              <div className="px-4 py-3 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button onClick={() => activeRoom.isPrivate ? setJoinModal(activeRoom) : joinRoom(activeRoom._id)} className="text-sm font-semibold px-6 py-2.5 rounded-xl" style={{ background: '#00F0B5', color: '#0a0a0a' }}>Join Room to Chat</button>
              </div>
            ) : (
              <div className="px-4 py-3 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/login')} className="text-sm font-medium" style={{ color: '#00F0B5' }}>Sign in to join</button>
              </div>
            )}
          </div>

          <div className="hidden md:block w-64 overflow-y-auto" style={{ borderLeft: '1px solid var(--color-border)' }}>
            <div className="p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Members ({activeRoom.members?.length})</h3>
              <div className="space-y-1.5">
                {activeRoom.members?.map(m => (
                  <div key={m.userId} className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: m.role === 'admin' ? '#F59E0B' : '#00F0B5' }}>
                      {m.userAvatar ? <img src={m.userAvatar} alt="" className="w-full h-full rounded-full object-cover" /> : m.userName?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs truncate flex-1" style={{ color: 'var(--color-text-primary)' }}>{m.userName}</span>
                    {m.role === 'admin' && <Crown size={9} style={{ color: '#F59E0B' }} />}
                    {isAdmin && !matchId(m.userId, uid) && (
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button onClick={() => kickMember(m.userId, m.userName)} title="Kick" className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(255,59,48,0.1)' }}>
                          <UserMinus size={8} style={{ color: 'var(--color-danger)' }} />
                        </button>
                        <button onClick={() => transferOwnership(m.userId, m.userName)} title="Make Admin" className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                          <Crown size={8} style={{ color: '#F59E0B' }} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {inCall && (
              <div className="p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#00F0B5' }}>🎙 Voice Call</h3>
                <p className="text-[11px] mb-2" style={{ color: 'var(--color-text-secondary)' }}>{voiceUsers.length + 1} in call</p>
                <div className="flex gap-2">
                  <button onClick={toggleMute} className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-medium py-1.5 rounded-lg" style={{ background: muted ? 'rgba(255,59,48,0.08)' : 'rgba(0,240,181,0.08)', color: muted ? 'var(--color-danger)' : '#00F0B5', border: `1px solid ${muted ? 'rgba(255,59,48,0.2)' : 'rgba(0,240,181,0.2)'}` }}>
                    {muted ? <><MicOff size={9} /> Muted</> : <><Mic size={9} /> On</>}
                  </button>
                  <button onClick={endVoiceCall} className="flex items-center justify-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,59,48,0.08)', color: 'var(--color-danger)', border: '1px solid rgba(255,59,48,0.2)' }}>
                    <PhoneOff size={9} /> End
                  </button>
                </div>
              </div>
            )}

            <div className="p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Shared ({activeRoom.sharedQuestions?.length || 0})</h3>
              {(!activeRoom.sharedQuestions || activeRoom.sharedQuestions.length === 0) ? (
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>No questions shared</p>
              ) : (
                <div className="space-y-2">
                  {activeRoom.sharedQuestions.map((q, i) => (
                    <div key={i} className="p-2.5 rounded-lg" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                      <p className="text-xs font-medium mb-1 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>{q.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${diffColors[q.difficulty]||'#6B7280'}15`, color: diffColors[q.difficulty]||'#6B7280' }}>{q.difficulty}</span>
                        <span className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>{q.addedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Info</h3>
              {activeRoom.description && <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{activeRoom.description}</p>}
              <div className="space-y-1.5 text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                <p>Topic: <strong style={{ color: 'var(--color-text-secondary)' }}>{activeRoom.topic}</strong></p>
                <p>Level: <strong style={{ color: 'var(--color-text-secondary)' }}>{activeRoom.difficulty}</strong></p>
                <p>{activeRoom.isPrivate ? '🔒 Private' : '🌐 Public'}</p>
                <p>Created: {fmt(activeRoom.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {showShareQ && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="card p-6 w-full max-w-md max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Share a Question</h3>
                <button onClick={() => { setShowShareQ(false); setQuestions([]); setSearchQ(''); }}><X size={16} style={{ color: 'var(--color-text-tertiary)' }} /></button>
              </div>
              <div className="flex gap-2 mb-4">
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchQuestions()} placeholder="Search questions..." className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                <button onClick={searchQuestions} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#00F0B5', color: '#0a0a0a' }}>Search</button>
              </div>
              {searchingQ ? <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-tertiary)' }}>Searching...</p> : (
                <div className="space-y-2">
                  {questions.map(q => (
                    <button key={q._id} onClick={() => shareQuestion(q._id)} className="w-full p-3 rounded-lg text-left" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{q.title}</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${diffColors[q.difficulty]||'#6B7280'}15`, color: diffColors[q.difficulty] }}>{q.difficulty}</span>
                        <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{q.topic}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {joinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="card p-6 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={18} style={{ color: '#F59E0B' }} />
                <div><h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Private Room</h3><p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Enter code for "{joinModal.name}"</p></div>
              </div>
              <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="Enter 6-digit code" maxLength={6} className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono text-center tracking-widest mb-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              {joinError && <p className="text-xs mb-3" style={{ color: 'var(--color-danger)' }}>{joinError}</p>}
              <div className="flex gap-3">
                <button onClick={() => { setJoinModal(null); setJoinCode(''); setJoinError(''); }} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>Cancel</button>
                <button onClick={() => joinRoom(joinModal._id, joinCode)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#00F0B5', color: '#0a0a0a' }}>Join</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══ ROOM LIST ═══
  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--color-bg-primary)' }}>
      <nav className="glass shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}><ArrowLeft size={16} /> Back</button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#00F0B5' }}><Users size={16} style={{ color: '#0a0a0a' }} /></div>
            <span className="font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>Study Rooms</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Study Rooms</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{stats ? `${stats.totalRooms} rooms · ${stats.totalMembers} members` : 'Practice together'}</p>
          </div>
          <div className="flex gap-2">
            {user && <button onClick={() => setMyRooms(!myRooms)} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: myRooms ? 'rgba(0,240,181,0.1)' : 'var(--color-surface)', color: myRooms ? '#00F0B5' : 'var(--color-text-secondary)', border: `1px solid ${myRooms ? 'rgba(0,240,181,0.3)' : 'var(--color-border)'}` }}>My Rooms</button>}
            {user && <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2" style={{ background: '#00F0B5', color: '#0a0a0a' }}><Plus size={14} /> Create Room</button>}
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {TOPICS.map(t => (
            <button key={t} onClick={() => { setTopic(t); setPage(1); }} className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap"
              style={{ background: topic === t ? (t === 'All' ? '#00F0B5' : `${topicColors[t]||'#6B7280'}15`) : 'var(--color-surface)', color: topic === t ? (t === 'All' ? '#0a0a0a' : topicColors[t]||'#6B7280') : 'var(--color-text-secondary)', border: `1px solid ${topic === t ? (t === 'All' ? '#00F0B5' : `${topicColors[t]}30`) : 'var(--color-border)'}` }}>{t}</button>
          ))}
        </div>

        <div className="card p-4 mb-6">
          <form onSubmit={e => { e.preventDefault(); setPage(1); loadGroups(); }} className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rooms..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          </form>
        </div>

        {loading ? (
          <div className="text-center py-16"><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading...</p></div>
        ) : groups.length === 0 ? (
          <div className="card p-12 text-center">
            <Users size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
            <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>No rooms yet</p>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>Create a room and invite friends!</p>
            {user && <button onClick={() => setShowCreate(true)} className="px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2" style={{ background: '#00F0B5', color: '#0a0a0a' }}><Plus size={14} /> Create First Room</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(g => {
              const userIn = g.members?.some(m => matchId(m.userId, uid));
              return (
                <div key={g._id} className="card p-5 transition-all hover:scale-[1.01] cursor-pointer"
                  onClick={() => { if (userIn || !g.isPrivate) loadRoom(g._id); else if (user) setJoinModal(g); else navigate('/login'); }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${topicColors[g.topic]||'#6B7280'}12`, color: topicColors[g.topic]||'#6B7280' }}>{g.topic}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${diffColors[g.difficulty]}12`, color: diffColors[g.difficulty] }}>{g.difficulty}</span>
                    </div>
                    {g.isPrivate ? <Lock size={12} style={{ color: 'var(--color-text-tertiary)' }} /> : <Unlock size={12} style={{ color: 'var(--color-text-tertiary)' }} />}
                  </div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{g.name}</h3>
                  {g.description && <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-text-tertiary)' }}>{g.description}</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1.5">
                        {g.members?.slice(0,4).map((m,i) => (
                          <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white border" style={{ background: i===0?'#F59E0B':'#00F0B5', borderColor:'var(--color-card-bg)' }}>{m.userName?.[0]?.toUpperCase()}</div>
                        ))}
                      </div>
                      <span className="text-[10px] ml-1" style={{ color: 'var(--color-text-tertiary)' }}>{g.memberCount}/{g.maxMembers}</span>
                    </div>
                    {userIn ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,240,181,0.1)', color: '#00F0B5', border: '1px solid rgba(0,240,181,0.2)' }}>Joined</span>
                    ) : g.isFull ? (
                      <span className="text-[10px] font-medium" style={{ color: 'var(--color-danger)' }}>Full</span>
                    ) : (
                      <span className="text-[10px] font-medium flex items-center gap-1" style={{ color: '#00F0B5' }}>{g.isPrivate ? <><Lock size={8} /> Private</> : <><UserPlus size={10} /> Join</>}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 rounded-xl text-xs font-medium" style={{ background:'var(--color-surface)', color:page===1?'var(--color-text-tertiary)':'var(--color-text-primary)', border:'1px solid var(--color-border)', opacity:page===1?0.5:1 }}>Prev</button>
            <span className="text-xs font-mono" style={{ color:'var(--color-text-secondary)' }}>{page}/{pages}</span>
            <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="px-4 py-2 rounded-xl text-xs font-medium" style={{ background:'var(--color-surface)', color:page===pages?'var(--color-text-tertiary)':'var(--color-text-primary)', border:'1px solid var(--color-border)', opacity:page===pages?0.5:1 }}>Next</button>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)' }}>
          <div className="card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'rgba(0,240,181,0.1)' }}><Users size={18} style={{ color:'#00F0B5' }} /></div>
                <div><h2 className="font-semibold" style={{ color:'var(--color-text-primary)' }}>Create Study Room</h2><p className="text-xs" style={{ color:'var(--color-text-tertiary)' }}>Invite friends to practice</p></div>
              </div>
              <button onClick={() => setShowCreate(false)}><X size={16} style={{ color:'var(--color-text-tertiary)' }} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color:'var(--color-text-tertiary)' }}>Room Name *</label>
                <input value={form.name} onChange={e => set('name',e.target.value)} placeholder="e.g., DSA Grind Squad" className={inp} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)' }} /></div>
              <div><label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color:'var(--color-text-tertiary)' }}>Description</label>
                <textarea value={form.description} onChange={e => set('description',e.target.value)} rows={2} placeholder="Focus area?" className={inp} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)', resize:'vertical' }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color:'var(--color-text-tertiary)' }}>Topic</label>
                  <select value={form.topic} onChange={e => set('topic',e.target.value)} className={inp} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)' }}>{TOPICS.filter(t=>t!=='All').map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color:'var(--color-text-tertiary)' }}>Difficulty</label>
                  <select value={form.difficulty} onChange={e => set('difficulty',e.target.value)} className={inp} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)' }}>{DIFFS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color:'var(--color-text-tertiary)' }}>Max Members</label>
                  <input type="number" value={form.maxMembers} onChange={e => set('maxMembers',e.target.value)} min={2} max={50} className={inp} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)' }} /></div>
                <div><label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color:'var(--color-text-tertiary)' }}>Privacy</label>
                  <button onClick={() => set('isPrivate',!form.isPrivate)} className="w-full px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{ background:form.isPrivate?'rgba(0,240,181,0.08)':'var(--color-surface)', border:`1px solid ${form.isPrivate?'rgba(0,240,181,0.3)':'var(--color-border)'}`, color:form.isPrivate?'#00F0B5':'var(--color-text-secondary)' }}>
                    {form.isPrivate ? <><Lock size={12} /> Private (PIN)</> : <><Unlock size={12} /> Public</>}
                  </button></div>
              </div>
              <div><label className="block text-[10px] font-medium mb-1.5 uppercase tracking-wider" style={{ color:'var(--color-text-tertiary)' }}>Tags</label>
                <input value={form.tags} onChange={e => set('tags',e.target.value)} placeholder="dsa, google (comma separated)" className={inp} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)' }} /></div>
              {createError && <div className="px-4 py-3 rounded-xl text-sm" style={{ background:'rgba(255,59,48,0.08)', border:'1px solid rgba(255,59,48,0.2)', color:'var(--color-danger)' }}>{createError}</div>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background:'var(--color-surface)', color:'var(--color-text-secondary)', border:'1px solid var(--color-border)' }}>Cancel</button>
                <button onClick={createRoom} disabled={creating} className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background:'#00F0B5', color:'#0a0a0a', opacity:creating?0.7:1 }}>
                  <Plus size={14} /> {creating ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {joinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)' }}>
          <div className="card p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={18} style={{ color:'#F59E0B' }} />
              <div><h3 className="font-semibold" style={{ color:'var(--color-text-primary)' }}>Private Room</h3><p className="text-xs" style={{ color:'var(--color-text-tertiary)' }}>Enter code for "{joinModal.name}"</p></div>
            </div>
            <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="Enter 6-digit code" maxLength={6} className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono text-center tracking-widest mb-3" style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)' }} />
            {joinError && <p className="text-xs mb-3" style={{ color:'var(--color-danger)' }}>{joinError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setJoinModal(null); setJoinCode(''); setJoinError(''); }} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background:'var(--color-surface)', color:'var(--color-text-secondary)', border:'1px solid var(--color-border)' }}>Cancel</button>
              <button onClick={() => joinRoom(joinModal._id, joinCode)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background:'#00F0B5', color:'#0a0a0a' }}>Join</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
