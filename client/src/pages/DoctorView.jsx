import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, FileText, Droplet, Scan, Activity, Syringe, AlertCircle, Award, Heart,
  ExternalLink, AlertTriangle, Clock, Pill
} from 'lucide-react';
import api from '../services/api';
import { CategoryBadge } from '../components/RecordCard';

export default function DoctorView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchShared(); }, [token]);

  const fetchShared = async () => {
    try {
      const { data: res } = await api.get(`/share/access/${token}`);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to access records');
    }
    setLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#020817' }}>
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#020817',padding:'1rem' }}>
      <div className="glass" style={{ maxWidth:420,width:'100%',padding:'2.5rem',textAlign:'center' }}>
        <AlertTriangle size={42} color="#f87171" style={{ marginBottom:'1rem' }} />
        <h2 style={{ color:'#f1f5f9',fontWeight:700,marginBottom:'0.5rem' }}>Access Denied</h2>
        <p style={{ color:'#64748b',fontSize:'0.875rem' }}>{error}</p>
      </div>
    </div>
  );

  const { records, patient, share } = data;
  const allergies = patient?.allergies || [];
  const meds = patient?.currentMedications || [];

  return (
    <div style={{ minHeight:'100vh',background:'#020817',padding:'0 0 3rem' }}>
      {/* Header */}
      <div style={{ background:'rgba(15,23,42,0.9)',borderBottom:'1px solid rgba(51,65,85,0.4)',padding:'1rem 1.5rem',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)' }}>
        <div style={{ maxWidth:900,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.75rem' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'0.75rem' }}>
            <div style={{ width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#0891b2,#0e7490)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight:700,color:'#f1f5f9',fontSize:'1rem' }}>HealthVault — Doctor View</div>
              <div style={{ fontSize:'0.72rem',color:'#64748b' }}>Read-only shared access</div>
            </div>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.75rem',color:'#64748b',background:'rgba(8,145,178,0.08)',border:'1px solid rgba(8,145,178,0.2)',borderRadius:7,padding:'0.3rem 0.75rem' }}>
            <Clock size={12} /> Expires: {new Date(share.expiresAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'2rem 1.5rem' }}>
        {/* Patient summary */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="emergency-card" style={{ padding:'1.5rem',marginBottom:'1.5rem' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',color:'#f87171',fontWeight:700,fontSize:'0.82rem',marginBottom:'1rem' }}>
            <AlertTriangle size={14} /> PATIENT EMERGENCY SUMMARY
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'1rem' }}>
            <div>
              <div style={{ fontSize:'0.7rem',color:'#64748b',marginBottom:'0.25rem',display:'flex',alignItems:'center',gap:'0.25rem' }}>
                <Droplet size={10} /> Blood Group
              </div>
              <div style={{ fontSize:'1.5rem',fontWeight:900,color:'#f87171' }}>{patient?.bloodGroup || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize:'0.7rem',color:'#64748b',marginBottom:'0.25rem' }}>Allergies</div>
              <div style={{ fontSize:'0.85rem',color: allergies.length?'#fb923c':'#475569' }}>
                {allergies.length ? allergies.join(', ') : 'None'}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'0.7rem',color:'#64748b',marginBottom:'0.25rem',display:'flex',alignItems:'center',gap:'0.25rem' }}>
                <Pill size={10} /> Medications
              </div>
              <div style={{ fontSize:'0.85rem',color: meds.length?'#fbbf24':'#475569' }}>
                {meds.length ? meds.join(', ') : 'None'}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'0.7rem',color:'#64748b',marginBottom:'0.25rem' }}>Patient</div>
              <div style={{ fontSize:'0.875rem',fontWeight:600,color:'#e2e8f0' }}>{patient?.name}</div>
            </div>
          </div>
          {patient?.emergencyContacts?.length > 0 && (
            <div style={{ marginTop:'1rem',paddingTop:'0.75rem',borderTop:'1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontSize:'0.7rem',color:'#64748b',marginBottom:'0.4rem' }}>Emergency Contacts</div>
              <div style={{ display:'flex',gap:'0.75rem',flexWrap:'wrap' }}>
                {patient.emergencyContacts.map((c,i) => (
                  <div key={i} style={{ fontSize:'0.78rem',color:'#94a3b8' }}>
                    {c.name} ({c.relation}): <strong style={{ color:'#e2e8f0' }}>{c.phone}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {share.doctorNote && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
            className="glass-light" style={{ padding:'1rem',marginBottom:'1.25rem',borderLeft:'3px solid #0891b2' }}>
            <div style={{ fontSize:'0.72rem',color:'#0891b2',marginBottom:'0.25rem',fontWeight:600 }}>PATIENT NOTE</div>
            <p style={{ fontSize:'0.875rem',color:'#94a3b8' }}>{share.doctorNote}</p>
          </motion.div>
        )}

        {/* Records */}
        <h2 style={{ fontSize:'1rem',fontWeight:700,color:'#e2e8f0',marginBottom:'1rem' }}>
          Medical Records ({records.length})
        </h2>
        {records.length ? (
          <div style={{ display:'flex',flexDirection:'column',gap:'0.875rem' }}>
            {records.map((r,i) => (
              <motion.div key={r._id} initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}
                className="glass" style={{ padding:'1.25rem' }}>
                <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.35rem',flexWrap:'wrap' }}>
                      <h3 style={{ fontSize:'0.9rem',fontWeight:700,color:'#e2e8f0' }}>{r.title}</h3>
                      <CategoryBadge category={r.category} />
                    </div>
                    {(r.doctorName||r.hospitalName) && (
                      <p style={{ fontSize:'0.75rem',color:'#64748b',marginBottom:'0.35rem' }}>
                        {r.doctorName && `Dr. ${r.doctorName}`}{r.doctorName&&r.hospitalName&&' · '}{r.hospitalName}
                      </p>
                    )}
                    {r.aiSummary && (
                      <p style={{ fontSize:'0.82rem',color:'#94a3b8',lineHeight:1.5 }}>{r.aiSummary}</p>
                    )}
                    {r.aiTags?.length>0 && (
                      <div style={{ display:'flex',gap:'0.3rem',flexWrap:'wrap',marginTop:'0.5rem' }}>
                        {r.aiTags.map(t=>(
                          <span key={t} style={{ fontSize:'0.68rem',padding:'0.1rem 0.4rem',background:'rgba(71,85,105,0.3)',borderRadius:4,color:'#64748b' }}>#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.5rem',flexShrink:0 }}>
                    <span style={{ fontSize:'0.72rem',color:'#475569' }}>{new Date(r.recordDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    <a href={r.fileUrl} target="_blank" rel="noreferrer"
                      style={{ display:'flex',alignItems:'center',gap:'0.3rem',color:'#0891b2',fontSize:'0.75rem',textDecoration:'none' }}>
                      View <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass" style={{ padding:'2rem',textAlign:'center' }}>
            <p style={{ color:'#475569' }}>No records shared.</p>
          </div>
        )}
      </div>
    </div>
  );
}
