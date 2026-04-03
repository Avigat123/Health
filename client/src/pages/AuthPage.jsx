import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Loader, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = await login(form.email, form.password);
      if (res.success) { toast.success('Welcome back!'); navigate('/dashboard'); }
      else toast.error(res.message);
    } else {
      if (!form.name.trim()) return toast.error('Name is required');
      const res = await register(form.name, form.email, form.password);
      if (res.success) { toast.success('Account created!'); navigate('/dashboard'); }
      else toast.error(res.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }} className="hero-bg">
      {/* Background orbs */}
      <div style={{ position:'fixed',top:'20%',left:'10%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(8,145,178,0.08),transparent)',pointerEvents:'none' }} />
      <div style={{ position:'fixed',bottom:'20%',right:'10%',width:250,height:250,borderRadius:'50%',background:'radial-gradient(circle,rgba(129,140,248,0.08),transparent)',pointerEvents:'none' }} />

      <motion.div
        initial={{ opacity:0, y:30, scale:0.97 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.4 }}
        className="glass"
        style={{ width:'100%', maxWidth:420, padding:'2.5rem 2rem' }}
      >
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#0891b2,#0e7490)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem' }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{ fontSize:'1.5rem',fontWeight:800,color:'#f1f5f9' }}>
            Health<span className="gradient-text">Vault</span>
          </h1>
          <p style={{ fontSize:'0.82rem',color:'#64748b',marginTop:'0.25rem' }}>Your secure health record locker</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display:'flex',background:'rgba(15,23,42,0.8)',borderRadius:10,padding:'0.25rem',marginBottom:'2rem',border:'1px solid rgba(51,65,85,0.4)' }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex:1,padding:'0.55rem',borderRadius:8,border:'none',cursor:'pointer',
              fontSize:'0.85rem',fontWeight:600,transition:'all 0.2s',
              background: mode===m ? 'linear-gradient(135deg,#0891b2,#0e7490)' : 'transparent',
              color: mode===m ? 'white' : '#64748b',
            }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity:0, x: mode==='login'?-10:10 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.2 }}
            onSubmit={handleSubmit}
            style={{ display:'flex',flexDirection:'column',gap:'1rem' }}
          >
            {mode === 'register' && (
              <div>
                <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>Full Name</label>
                <div style={{ position:'relative' }}>
                  <User size={16} style={{ position:'absolute',left:'0.85rem',top:'50%',transform:'translateY(-50%)',color:'#475569' }} />
                  <input
                    id="reg-name"
                    type="text" placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm({...form, name:e.target.value})}
                    className="input-field"
                    style={{ paddingLeft:'2.5rem' }}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute',left:'0.85rem',top:'50%',transform:'translateY(-50%)',color:'#475569' }} />
                <input
                  id="auth-email"
                  type="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  className="input-field"
                  style={{ paddingLeft:'2.5rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute',left:'0.85rem',top:'50%',transform:'translateY(-50%)',color:'#475569' }} />
                <input
                  id="auth-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder={mode==='register' ? 'At least 6 characters' : 'Your password'}
                  value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  className="input-field"
                  style={{ paddingLeft:'2.5rem', paddingRight:'2.75rem' }}
                  minLength={mode==='register' ? 6 : undefined}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute',right:'0.85rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#475569',cursor:'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="auth-submit" type="submit" disabled={loading} className="btn-primary" style={{ justifyContent:'center',marginTop:'0.5rem',padding:'0.75rem' }}>
              {loading
                ? <><Loader size={16} style={{animation:'spin 0.8s linear infinite'}} /> Processing...</>
                : mode === 'login' ? 'Sign In' : 'Create Account'
              }
            </button>
          </motion.form>
        </AnimatePresence>

        <p style={{ textAlign:'center',fontSize:'0.78rem',color:'#475569',marginTop:'1.25rem' }}>
          {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode==='login'?'register':'login')}
            style={{ background:'none',border:'none',color:'#0891b2',cursor:'pointer',fontSize:'0.78rem',fontWeight:600 }}>
            {mode==='login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </motion.div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
