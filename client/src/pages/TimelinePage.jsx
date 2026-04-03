import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Loader, FileText, Droplet, Scan, Activity, Syringe, AlertCircle, Award, Heart, Receipt, File } from 'lucide-react';
import api from '../services/api';

const CATEGORY_ICONS = {
  'Prescription':        { icon: FileText,     color: '#a78bfa' },
  'Blood Test':          { icon: Droplet,      color: '#f87171' },
  'X-Ray':               { icon: Scan,         color: '#60a5fa' },
  'MRI/CT Scan':         { icon: Activity,     color: '#34d399' },
  'Vaccination':         { icon: Syringe,      color: '#fbbf24' },
  'Allergy Record':      { icon: AlertCircle,  color: '#fb923c' },
  'Medical Certificate': { icon: Award,        color: '#22d3ee' },
  'ECG':                 { icon: Heart,        color: '#f472b6' },
  'Invoice':             { icon: Receipt,      color: '#94a3b8' },
  'Other':               { icon: File,         color: '#94a3b8' },
};

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTimeline(); }, []);

  const fetchTimeline = async () => {
    try {
      const { data } = await api.get('/ai/timeline');
      setTimeline(data.timeline);
    } catch {}
    setLoading(false);
  };

  // Group by year-month
  const grouped = timeline.reduce((acc, r) => {
    const key = new Date(r.recordDate).toLocaleDateString('en-IN', { month:'long', year:'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className="content-wrapper" style={{ paddingTop:'2rem', maxWidth:700 }}>
        <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.35rem' }}>
            <GitBranch size={22} color="#0891b2" />
            <h1 style={{ fontSize:'1.4rem',fontWeight:800,color:'#f1f5f9' }}>Medical Timeline</h1>
          </div>
          <p style={{ color:'#64748b',fontSize:'0.82rem' }}>Your complete health history in chronological order</p>
        </motion.div>

        {loading ? (
          <div style={{ display:'flex',justifyContent:'center',padding:'3rem' }}><div className="spinner" /></div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="glass" style={{ padding:'3rem',textAlign:'center' }}>
            <GitBranch size={36} color="#1e3a5f" style={{ marginBottom:'1rem' }} />
            <p style={{ color:'#475569' }}>No records yet. Upload your first record to start your timeline.</p>
          </div>
        ) : (
          <div style={{ position:'relative', paddingLeft:'2.5rem' }}>
            {/* Vertical line */}
            <div className="timeline-line" style={{ left:'0.35rem', position:'absolute', top:0, bottom:0 }} />

            {Object.entries(grouped).map(([month, records], gi) => (
              <motion.div key={month} initial={{ opacity:0,x:-20 }} animate={{ opacity:1,x:0 }} transition={{ delay:gi*0.08 }}
                style={{ marginBottom:'2rem' }}>
                {/* Month header */}
                <div style={{
                  position:'relative', marginBottom:'1rem',
                  display:'inline-flex', alignItems:'center', gap:'0.5rem',
                  padding:'0.3rem 0.875rem', borderRadius:999,
                  background:'rgba(8,145,178,0.12)', border:'1px solid rgba(8,145,178,0.3)',
                  fontSize:'0.78rem', fontWeight:700, color:'#22d3ee',
                }}>
                  <div style={{
                    position:'absolute', left:'-2.15rem', width:14, height:14, borderRadius:'50%',
                    background:'#0891b2', border:'3px solid #020817',
                    boxShadow:'0 0 12px rgba(8,145,178,0.6)',
                  }} />
                  {month}
                </div>

                {/* Records */}
                <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem' }}>
                  {records.map((r, i) => {
                    const s = CATEGORY_ICONS[r.category] || CATEGORY_ICONS['Other'];
                    const Icon = s.icon;
                    return (
                      <motion.div key={r._id} initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                        transition={{ delay:(gi*0.08)+(i*0.04) }}
                        className="glass-light" style={{ padding:'1rem 1.25rem',position:'relative' }}>
                        <div style={{ display:'flex',alignItems:'flex-start',gap:'0.875rem' }}>
                          <div style={{
                            width:36,height:36,borderRadius:9,flexShrink:0,
                            background:`rgba(${hexToRgb(s.color)},0.12)`,
                            border:`1px solid rgba(${hexToRgb(s.color)},0.25)`,
                            display:'flex',alignItems:'center',justifyContent:'center',
                          }}>
                            <Icon size={17} color={s.color} />
                          </div>
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.5rem' }}>
                              <h3 style={{ fontSize:'0.875rem',fontWeight:600,color:'#e2e8f0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1 }}>{r.title}</h3>
                              <span style={{ fontSize:'0.68rem',color:'#475569',flexShrink:0 }}>
                                {new Date(r.recordDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                              </span>
                            </div>
                            {(r.doctorName||r.hospitalName) && (
                              <p style={{ fontSize:'0.72rem',color:'#475569',marginTop:'0.15rem' }}>
                                {r.doctorName && `Dr. ${r.doctorName}`}{r.doctorName&&r.hospitalName&&' · '}{r.hospitalName}
                              </p>
                            )}
                            {r.aiSummary && (
                              <p style={{ fontSize:'0.78rem',color:'#64748b',lineHeight:1.5,marginTop:'0.3rem',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' }}>
                                {r.aiSummary}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1],16)}, ${parseInt(result[2],16)}, ${parseInt(result[3],16)}` : '148,163,184';
}
