import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Upload, Brain, Share2, AlertTriangle, CheckCircle, ArrowRight, Lock, Zap, Clock } from 'lucide-react';

const features = [
  { icon: Upload,        color: '#0891b2', title: 'Smart Upload',         desc: 'Upload PDFs, X-rays, prescriptions. AI auto-classifies and extracts key data instantly.' },
  { icon: Brain,         color: '#818cf8', title: 'AI Summarization',     desc: "Gemini AI reads your reports and explains them in plain language you can actually understand." },
  { icon: Share2,        color: '#34d399', title: 'Secure Sharing',       desc: 'Generate QR codes and time-limited links. Share records with doctors in seconds.' },
  { icon: AlertTriangle, color: '#f87171', title: 'Emergency Access',     desc: 'Emergency profile with blood group, allergies, and medications always accessible.' },
  { icon: Zap,           color: '#fbbf24', title: 'Instant Search',       desc: 'Find any record instantly. Filter by category, date, doctor, or keyword.' },
  { icon: Lock,          color: '#a78bfa', title: 'Privacy First',        desc: 'JWT-secured accounts, encrypted storage, role-based access. Your data, your control.' },
];

const stats = [
  { value: '100%', label: 'Patient Controlled' },
  { value: 'AI',   label: 'Powered Analysis' },
  { value: '∞',    label: 'Record Storage' },
  { value: '24/7', label: 'Access Anywhere' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh' }} className="hero-bg">
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(2,8,23,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(51,65,85,0.3)',
        padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#0891b2,#0e7490)', display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Shield size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#e2e8f0' }}>
              Health<span className="gradient-text">Vault</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/auth')} className="btn-secondary">Sign In</button>
            <button onClick={() => navigate('/auth?mode=register')} className="btn-primary">Get Started <ArrowRight size={15} /></button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 1.5rem 4rem', textAlign: 'center' }}>
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration: 0.6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.3)',
            borderRadius: 999, padding: '0.35rem 1rem', fontSize: '0.78rem', fontWeight: 600,
            color: '#22d3ee', marginBottom: '1.75rem',
          }}>
            <Zap size={13} /> AI-Powered Health Record Management
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.25rem', color: '#f1f5f9' }}>
            Your Medical History,{' '}
            <span className="gradient-text">Always Accessible</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#64748b', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Store, organize, and share all your medical records securely. Let AI summarize your reports, detect drug interactions, and give doctors instant access when it matters most.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/auth?mode=register')} className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              Start for Free <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/auth')} className="btn-secondary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              Sign In
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.5 }}
          style={{ display:'flex', justifyContent:'center', gap:'2rem', marginTop:'4rem', flexWrap:'wrap' }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#22d3ee' }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
          <h2 style={{ textAlign:'center', fontSize:'clamp(1.75rem,4vw,2.5rem)', fontWeight:800, color:'#f1f5f9', marginBottom:'0.75rem' }}>
            Everything you need
          </h2>
          <p style={{ textAlign:'center', color:'#64748b', marginBottom:'3rem' }}>
            From smart uploads to emergency access — HealthVault has you covered.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.25rem' }}>
            {features.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.08, duration:0.4 }}
                className="glass card-hover"
                style={{ padding:'1.5rem' }}
              >
                <div style={{
                  width:44,height:44,borderRadius:12,marginBottom:'1rem',
                  background:`rgba(${hexToRgb(color)},0.12)`,border:`1px solid rgba(${hexToRgb(color)},0.25)`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize:'1rem',fontWeight:700,color:'#e2e8f0',marginBottom:'0.4rem' }}>{title}</h3>
                <p style={{ fontSize:'0.85rem',color:'#64748b',lineHeight:1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section style={{ padding:'3rem 1.5rem 5rem', textAlign:'center' }}>
        <motion.div
          initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          className="glass"
          style={{ maxWidth:600,margin:'0 auto',padding:'3rem 2rem',background:'rgba(8,145,178,0.06)',border:'1px solid rgba(8,145,178,0.25)' }}
        >
          <Shield size={42} color="#0891b2" style={{ marginBottom:'1rem' }} />
          <h2 style={{ fontSize:'1.75rem',fontWeight:800,color:'#f1f5f9',marginBottom:'0.75rem' }}>
            Take control of your health records
          </h2>
          <p style={{ color:'#64748b',marginBottom:'2rem',lineHeight:1.6 }}>
            Join thousands of patients who trust HealthVault to keep their medical history organized, secure, and always accessible.
          </p>
          <button onClick={() => navigate('/auth?mode=register')} className="btn-primary" style={{ fontSize:'1rem',padding:'0.875rem 2.5rem' }}>
            Create Free Account <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(51,65,85,0.3)',padding:'1.5rem',textAlign:'center' }}>
        <p style={{ fontSize:'0.8rem',color:'#334155' }}>
          © 2025 HealthVault · Built with ❤️ for better healthcare
        </p>
      </footer>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '148, 163, 184';
}
