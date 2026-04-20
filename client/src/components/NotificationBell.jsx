import React, { useState, useEffect, useRef } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, AlertOctagon, MessageSquare } from 'lucide-react';

const typeConfig = {
  info: { color: '#0071E3', icon: Info, bg: 'rgba(0,113,227,0.1)' },
  success: { color: '#10B981', icon: CheckCircle, bg: 'rgba(16,185,129,0.1)' },
  warning: { color: '#F59E0B', icon: AlertTriangle, bg: 'rgba(245,158,11,0.1)' },
  alert: { color: '#EF4444', icon: AlertOctagon, bg: 'rgba(239,68,68,0.1)' },
  personal: { color: '#8B5CF6', icon: MessageSquare, bg: 'rgba(139,92,246,0.1)' },
};

export default function NotificationBell() {
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    loadNotifs();
    const t = setInterval(loadNotifs, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadNotifs = async () => {
    try {
      const res = await fetch('/api/admin-panel/my-notifications', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setNotifs(data.notifications);
        setUnread(data.unreadCount);
      }
    } catch {}
  };

  const markRead = async (id) => {
    try {
      await fetch(`/api/admin-panel/my-notifications/${id}/read`, { method: 'POST', credentials: 'include' });
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    for (const n of notifs.filter(n => !n.isRead)) {
      await markRead(n._id);
    }
  };

  const fmt = (d) => {
    const now = new Date();
    const date = new Date(d);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all hover:scale-105"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <Bell size={16} style={{ color: unread > 0 ? '#00F0B5' : 'var(--color-text-secondary)' }} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: '#EF4444' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto rounded-2xl shadow-2xl z-50"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
          <div className="sticky top-0 p-4 flex items-center justify-between"
            style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-medium px-2 py-1 rounded-lg"
                style={{ color: '#00F0B5', background: 'rgba(0,240,181,0.1)' }}>
                Mark all read
              </button>
            )}
          </div>

          {notifs.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={24} className="mx-auto mb-2" style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifs.map(n => {
                const cfg = typeConfig[n.type] || typeConfig.info;
                const Icon = cfg.icon;
                return (
                  <div key={n._id} onClick={() => !n.isRead && markRead(n._id)}
                    className="px-4 py-3 flex gap-3 cursor-pointer transition-all hover:opacity-80"
                    style={{ background: n.isRead ? 'transparent' : cfg.bg, borderBottom: '1px solid var(--color-border)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                      <Icon size={14} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{n.title}</p>
                        {!n.isRead && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />}
                      </div>
                      <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{n.message}</p>
                      <p className="text-[9px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{fmt(n.createdAt)} · from {n.sentBy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
