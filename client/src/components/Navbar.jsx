import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LayoutDashboard, Upload, FolderOpen, AlertTriangle,
  GitBranch, LogOut, Menu, X, ChevronDown, Bell, User
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/records', label: 'Records', icon: FolderOpen },
  { to: '/timeline', label: 'Timeline', icon: GitBranch },
  { to: '/emergency', label: 'Emergency', icon: AlertTriangle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--nav-height)', zIndex: 100,
        background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(51,65,85,0.4)',
        display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem',
      }}
    >
      {/* Logo */}
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #0891b2, #0e7490)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={18} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0' }}>
          Health<span className="gradient-text">Vault</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, marginLeft: '1rem' }}
        className="hidden-mobile">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.85rem', borderRadius: 8, textDecoration: 'none',
              fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.15s ease',
              color: active ? '#22d3ee' : '#94a3b8',
              background: active ? 'rgba(8,145,178,0.12)' : 'transparent',
              borderBottom: active ? '2px solid #22d3ee' : '2px solid transparent',
            }}>
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Avatar dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(71,85,105,0.5)',
              borderRadius: 10, padding: '0.4rem 0.75rem', cursor: 'pointer', color: '#e2e8f0',
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0891b2, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: 'white',
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }} className="hidden-mobile">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} color="#64748b" />
          </button>

          <AnimatePresence>
            {avatarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  minWidth: 180, background: '#0f172a', borderRadius: 12,
                  border: '1px solid rgba(51,65,85,0.7)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  overflow: 'hidden', zIndex: 200,
                }}
                onMouseLeave={() => setAvatarOpen(false)}
              >
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div>
                </div>
                {[
                  { to: '/emergency', label: 'Emergency Profile', icon: AlertTriangle },
                ].map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to} onClick={() => setAvatarOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.65rem 1rem', textDecoration: 'none',
                    color: '#94a3b8', fontSize: '0.85rem', transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,41,59,0.8)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Icon size={15} />{label}
                  </Link>
                ))}
                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                  padding: '0.65rem 1rem', background: 'none', border: 'none',
                  color: '#f87171', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left',
                  borderTop: '1px solid rgba(51,65,85,0.4)',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="show-mobile"
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0,
              background: '#0f172a', borderBottom: '1px solid rgba(51,65,85,0.5)',
              zIndex: 99, overflow: 'hidden',
            }}
          >
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.85rem 1.5rem', textDecoration: 'none',
                color: location.pathname === to ? '#22d3ee' : '#94a3b8',
                borderBottom: '1px solid rgba(51,65,85,0.3)',
                background: location.pathname === to ? 'rgba(8,145,178,0.08)' : 'transparent',
              }}>
                <Icon size={18} /> {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </nav>
  );
}
