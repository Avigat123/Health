import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileText, Droplet, Scan, Activity, Syringe,
  AlertCircle, Award, Heart, TrendingUp, Sparkles, Plus, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import RecordCard from '../components/RecordCard';
import ChatBot from '../components/ChatBot';
import ShareModal from '../components/ShareModal';

const CATEGORY_ICONS = {
  'Prescription': { icon: FileText, color: '#a78bfa' },
  'Blood Test': { icon: Droplet, color: '#f87171' },
  'X-Ray': { icon: Scan, color: '#60a5fa' },
  'MRI/CT Scan': { icon: Activity, color: '#34d399' },
  'Vaccination': { icon: Syringe, color: '#fbbf24' },
  'Allergy Record': { icon: AlertCircle, color: '#fb923c' },
  'Medical Certificate': { icon: Award, color: '#22d3ee' },
  'ECG': { icon: Heart, color: '#f472b6' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchInsight();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/records/stats');
      setStats(data);
    } catch {}
  };

  const fetchInsight = async () => {
    setInsightLoading(true);
    try {
      const { data } = await api.get('/ai/insight');
      setInsight(data.insight);
    } catch {}
    setInsightLoading(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-container">
      <div className="content-wrapper" style={{ paddingTop: '2rem' }}>
        {/* Header */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'2rem', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'#f1f5f9' }}>
              {greeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:'0.25rem' }}>
              Here's an overview of your health records
            </p>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
            <button onClick={() => setShareOpen(true)} className="btn-secondary">
              Share Records
            </button>
            <button onClick={() => navigate('/upload')} className="btn-primary">
              <Plus size={16} /> Upload Record
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {[
            { label:'Total Records', value: stats?.total ?? '—', icon: FileText, color:'#0891b2' },
            ...Object.entries(stats?.byCategory || {}).slice(0,3).map(([k,v]) => {
              const s = CATEGORY_ICONS[k._id] || { icon: FileText, color:'#64748b' };
              return { label: k._id || 'Other', value: k.count, icon: s.icon, color: s.color };
            }),
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.07 }} className="stat-card">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                <span style={{ fontSize:'0.75rem', color:'#475569', fontWeight:500 }}>{label}</span>
                <div style={{ width:30,height:30,borderRadius:8,background:`rgba(${hexToRgb(color)},0.12)`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Icon size={15} color={color} />
                </div>
              </div>
              <div style={{ fontSize:'1.75rem', fontWeight:800, color:'#f1f5f9' }}>{value}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }} className="dashboard-grid">
          {/* AI Health Insight */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }}
            className="glass" style={{ padding:'1.5rem', gridColumn: 'span 1' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
              <div style={{ width:32,height:32,borderRadius:10,background:'rgba(129,140,248,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Sparkles size={16} color="#818cf8" />
              </div>
              <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'#e2e8f0' }}>AI Health Insight</h2>
            </div>
            {insightLoading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {[80,60,70].map((w,i) => <div key={i} className="shimmer" style={{ height:14, width:`${w}%` }} />)}
              </div>
            ) : insight ? (
              <p style={{ fontSize:'0.875rem', color:'#94a3b8', lineHeight:1.7 }}>{insight}</p>
            ) : (
              <p style={{ fontSize:'0.85rem', color:'#475569', fontStyle:'italic' }}>
                Upload some records to get your personalized AI health insight.
              </p>
            )}
            <button onClick={() => navigate('/timeline')} className="btn-secondary" style={{ marginTop:'1rem', fontSize:'0.8rem', padding:'0.45rem 0.875rem' }}>
              View Timeline <ChevronRight size={13} />
            </button>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}
            className="glass" style={{ padding:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
              <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'#e2e8f0' }}>Record Categories</h2>
              <TrendingUp size={16} color="#0891b2" />
            </div>
            {stats?.byCategory?.length ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                {stats.byCategory.slice(0,5).map(({ _id: cat, count }) => {
                  const s = CATEGORY_ICONS[cat] || { icon: FileText, color:'#64748b' };
                  const pct = stats.total ? Math.round((count/stats.total)*100) : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.25rem' }}>
                        <span style={{ fontSize:'0.78rem', color:'#94a3b8' }}>{cat}</span>
                        <span style={{ fontSize:'0.78rem', color:'#64748b' }}>{count}</span>
                      </div>
                      <div style={{ height:5, background:'rgba(51,65,85,0.5)', borderRadius:999 }}>
                        <div style={{ width:`${pct}%`, height:'100%', borderRadius:999, background:s.color, transition:'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize:'0.85rem', color:'#475569', fontStyle:'italic' }}>No records yet.</p>
            )}
          </motion.div>
        </div>

        {/* Recent Records */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} style={{ marginTop:'2rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'1.05rem', fontWeight:700, color:'#e2e8f0' }}>Recent Records</h2>
            <button onClick={() => navigate('/records')} className="btn-secondary" style={{ fontSize:'0.8rem', padding:'0.4rem 0.875rem' }}>
              View All <ChevronRight size={13} />
            </button>
          </div>
          {stats?.recent?.length ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
              {stats.recent.map((r, i) => <RecordCard key={r._id} record={r} index={i} />)}
            </div>
          ) : (
            <div className="glass" style={{ padding:'3rem', textAlign:'center' }}>
              <Upload size={36} color="#1e3a5f" style={{ marginBottom:'1rem' }} />
              <p style={{ color:'#475569', marginBottom:'1rem' }}>No records yet. Upload your first medical document!</p>
              <button onClick={() => navigate('/upload')} className="btn-primary">
                <Plus size={16} /> Upload First Record
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      <ChatBot />

      <style>{`
        @media(max-width:768px){.dashboard-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1],16)}, ${parseInt(result[2],16)}, ${parseInt(result[3],16)}` : '148,163,184';
}
