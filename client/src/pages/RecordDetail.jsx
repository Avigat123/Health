import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Trash2, Sparkles, Share2, RefreshCw,
  Calendar, Stethoscope, Building2, FileText, Tag, Loader, AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CategoryBadge } from '../components/RecordCard';
import ShareModal from '../components/ShareModal';

// Detect image vs PDF from both saved fileType AND url/title extension (fallback for old records)
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;
const PDF_EXT   = /\.pdf(\?.*)?$/i;

const isImageFile = (record) =>
  record.fileType === 'image' ||
  IMAGE_EXT.test(record.fileUrl || '') ||
  IMAGE_EXT.test(record.title || '');

const isPdfFile = (record) =>
  record.fileType === 'pdf' ||
  PDF_EXT.test(record.fileUrl || '') ||
  PDF_EXT.test(record.title || '');

export default function RecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => { fetchRecord(); }, [id]);

  const fetchRecord = async () => {
    try {
      const { data } = await api.get(`/records/${id}`);
      setRecord(data);
    } catch { toast.error('Record not found'); navigate('/records'); }
    setLoading(false);
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const { data } = await api.post(`/records/${id}/regenerate-ai`);
      setRecord(data);
      toast.success('AI analysis refreshed!');
    } catch { toast.error('Failed to regenerate'); }
    setRegenerating(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this record? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/records/${id}`);
      toast.success('Record deleted');
      navigate('/records');
    } catch { toast.error('Failed to delete'); setDeleting(false); }
  };

  if (loading) return (
    <div className="page-container" style={{ display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!record) return null;

  const date = new Date(record.recordDate).toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' });

  return (
    <div className="page-container">
      <div className="content-wrapper" style={{ paddingTop:'2rem', maxWidth:720 }}>
        {/* Back */}
        <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} style={{ marginBottom:'1.5rem', display:'flex',alignItems:'center',gap:'0.75rem' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding:'0.5rem' }}><ArrowLeft size={18} /></button>
          <div style={{ flex:1,minWidth:0 }}>
            <h1 style={{ fontSize:'1.2rem',fontWeight:800,color:'#f1f5f9',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{record.title}</h1>
            <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.2rem' }}>
              <CategoryBadge category={record.category} />
              <span style={{ fontSize:'0.75rem',color:'#475569' }}>{date}</span>
            </div>
          </div>
          <div style={{ display:'flex',gap:'0.5rem',flexShrink:0 }}>
            <button onClick={() => setShareOpen(true)} className="btn-secondary" style={{ padding:'0.5rem 0.875rem' }}>
              <Share2 size={15} /> Share
            </button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger" style={{ padding:'0.5rem' }}>
              {deleting ? <Loader size={15} style={{animation:'spin 0.8s linear infinite'}} /> : <Trash2 size={15} />}
            </button>
          </div>
        </motion.div>

        {/* File preview */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }} className="glass" style={{ padding:'1.25rem',marginBottom:'1.25rem' }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.75rem' }}>
            <span style={{ fontSize:'0.82rem',fontWeight:600,color:'#94a3b8' }}>Document</span>
            <a href={record.fileUrl} target="_blank" rel="noreferrer" style={{ display:'flex',alignItems:'center',gap:'0.3rem',color:'#0891b2',fontSize:'0.78rem',textDecoration:'none' }}>
              Open <ExternalLink size={12} />
            </a>
          </div>
          {isImageFile(record) ? (
            <img src={record.fileUrl} alt={record.title} style={{ maxWidth:'100%',borderRadius:10,border:'1px solid rgba(51,65,85,0.4)' }} />
          ) : isPdfFile(record) ? (
            <div style={{ display:'flex',alignItems:'center',gap:'0.75rem',padding:'1rem',background:'rgba(15,23,42,0.5)',borderRadius:10,border:'1px solid rgba(51,65,85,0.4)' }}>
              <FileText size={24} color="#0891b2" />
              <div>
                <div style={{ fontSize:'0.875rem',fontWeight:600,color:'#e2e8f0' }}>{record.title}</div>
                <div style={{ fontSize:'0.75rem',color:'#475569' }}>PDF Document</div>
              </div>
              <a href={record.fileUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginLeft:'auto',padding:'0.45rem 0.875rem',fontSize:'0.78rem' }}>
                View PDF
              </a>
            </div>
          ) : (
            <div style={{ display:'flex',alignItems:'center',gap:'0.75rem',padding:'1rem',background:'rgba(15,23,42,0.5)',borderRadius:10,border:'1px solid rgba(51,65,85,0.4)' }}>
              <FileText size={24} color="#0891b2" />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'0.875rem',fontWeight:600,color:'#e2e8f0' }}>{record.title}</div>
                <div style={{ fontSize:'0.75rem',color:'#475569' }}>Medical Document</div>
              </div>
              <a href={record.fileUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding:'0.45rem 0.875rem',fontSize:'0.78rem' }}>
                Open File
              </a>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.15 }} className="glass" style={{ padding:'1.25rem',marginBottom:'1.25rem' }}>
          <h3 style={{ fontSize:'0.9rem',fontWeight:700,color:'#e2e8f0',marginBottom:'1rem' }}>Record Details</h3>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
            {[
              { icon:Calendar, label:'Date', value:date },
              { icon:Stethoscope, label:'Doctor', value:record.doctorName || '—' },
              { icon:Building2, label:'Hospital', value:record.hospitalName || '—' },
              { icon:FileText, label:'Diagnosis', value:record.diagnosis || '—' },
            ].map(({ icon:Icon, label, value }) => (
              <div key={label}>
                <div style={{ display:'flex',alignItems:'center',gap:'0.35rem',fontSize:'0.72rem',color:'#475569',marginBottom:'0.25rem' }}>
                  <Icon size={12} /> {label}
                </div>
                <div style={{ fontSize:'0.875rem',color:'#e2e8f0',fontWeight:500 }}>{value}</div>
              </div>
            ))}
          </div>
          {record.notes && (
            <div style={{ marginTop:'1rem',padding:'0.75rem',background:'rgba(15,23,42,0.5)',borderRadius:8,borderLeft:'3px solid rgba(8,145,178,0.5)' }}>
              <div style={{ fontSize:'0.72rem',color:'#475569',marginBottom:'0.25rem' }}>Notes</div>
              <div style={{ fontSize:'0.85rem',color:'#94a3b8' }}>{record.notes}</div>
            </div>
          )}
        </motion.div>

        {/* AI Analysis */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }} className="glass" style={{ padding:'1.25rem',border:'1px solid rgba(129,140,248,0.2)' }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem' }}>
            <div style={{ display:'flex',alignItems:'center',gap:'0.5rem' }}>
              <div style={{ width:28,height:28,borderRadius:8,background:'rgba(129,140,248,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Sparkles size={14} color="#818cf8" />
              </div>
              <h3 style={{ fontSize:'0.9rem',fontWeight:700,color:'#e2e8f0' }}>AI Analysis</h3>
            </div>
            <button onClick={handleRegenerate} disabled={regenerating} className="btn-secondary" style={{ fontSize:'0.75rem',padding:'0.35rem 0.75rem' }}>
              {regenerating ? <Loader size={13} style={{animation:'spin 0.8s linear infinite'}} /> : <RefreshCw size={13} />}
              Refresh
            </button>
          </div>

          {record.aiSummary ? (
            <p style={{ fontSize:'0.875rem',color:'#94a3b8',lineHeight:1.7,marginBottom:'1rem' }}>{record.aiSummary}</p>
          ) : (
            <p style={{ fontSize:'0.82rem',color:'#475569',fontStyle:'italic',marginBottom:'1rem' }}>No AI summary available. Click Refresh to generate.</p>
          )}

          {record.aiTags?.length > 0 && (
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:'0.35rem',fontSize:'0.72rem',color:'#475569',marginBottom:'0.5rem' }}>
                <Tag size={11} /> Tags
              </div>
              <div style={{ display:'flex',gap:'0.4rem',flexWrap:'wrap' }}>
                {record.aiTags.map(t => (
                  <span key={t} style={{ fontSize:'0.75rem',padding:'0.2rem 0.6rem',background:'rgba(71,85,105,0.3)',borderRadius:5,color:'#94a3b8',border:'1px solid rgba(71,85,105,0.4)' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
