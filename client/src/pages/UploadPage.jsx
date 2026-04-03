import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload, File, X, CheckCircle, Loader, Sparkles, Calendar,
  Stethoscope, Building2, FileText, ChevronDown, ArrowLeft
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Prescription','Blood Test','X-Ray','MRI/CT Scan',
  'Vaccination','Allergy Record','Medical Certificate','ECG','Invoice','Other'
];

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: '', category: '', doctorName: '', hospitalName: '',
    recordDate: new Date().toISOString().split('T')[0], notes: '', diagnosis: '',
  });
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((accepted) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setForm(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g,' ') }));
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxFiles: 1,
    accept: { 'image/*': ['.jpg','.jpeg','.png','.webp'], 'application/pdf': ['.pdf'] },
  });

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      const { data } = await api.post('/records/upload', fd);
      setResult(data);
      toast.success('Record uploaded and analyzed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null); setPreview(null); setResult(null);
    setForm({ title:'',category:'',doctorName:'',hospitalName:'',recordDate:new Date().toISOString().split('T')[0],notes:'',diagnosis:'' });
  };

  if (result) {
    return (
      <div className="page-container">
        <div className="content-wrapper" style={{ paddingTop:'2rem', maxWidth:600 }}>
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="glass" style={{ padding:'2.5rem', textAlign:'center' }}>
            <div style={{ width:64,height:64,borderRadius:'50%',background:'rgba(16,185,129,0.15)',border:'2px solid rgba(16,185,129,0.4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.25rem' }}>
              <CheckCircle size={32} color="#34d399" />
            </div>
            <h2 style={{ fontSize:'1.3rem',fontWeight:800,color:'#f1f5f9',marginBottom:'0.3rem' }}>Upload Successful!</h2>
            <p style={{ color:'#64748b',fontSize:'0.875rem',marginBottom:'1.5rem' }}>AI has analyzed and categorized your record</p>

            <div className="glass-light" style={{ padding:'1.25rem',textAlign:'left',marginBottom:'1.5rem' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.75rem' }}>
                <Sparkles size={15} color="#818cf8" />
                <span style={{ fontSize:'0.82rem',fontWeight:600,color:'#818cf8' }}>AI Analysis</span>
              </div>
              <div style={{ display:'flex',gap:'1rem',marginBottom:'0.75rem',flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:'0.7rem',color:'#475569' }}>Category</div>
                  <div style={{ fontSize:'0.875rem',fontWeight:600,color:'#22d3ee' }}>{result.category}</div>
                </div>
                {result.aiTags?.length > 0 && (
                  <div>
                    <div style={{ fontSize:'0.7rem',color:'#475569' }}>Tags</div>
                    <div style={{ display:'flex',gap:'0.3rem',flexWrap:'wrap' }}>
                      {result.aiTags.map(t => (
                        <span key={t} style={{ fontSize:'0.7rem',padding:'0.15rem 0.4rem',background:'rgba(71,85,105,0.3)',borderRadius:4,color:'#94a3b8' }}>#{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {result.aiSummary && (
                <p style={{ fontSize:'0.82rem',color:'#94a3b8',lineHeight:1.6,borderTop:'1px solid rgba(51,65,85,0.4)',paddingTop:'0.75rem' }}>{result.aiSummary}</p>
              )}
            </div>

            <div style={{ display:'flex',gap:'0.75rem',justifyContent:'center' }}>
              <button onClick={reset} className="btn-secondary">Upload Another</button>
              <button onClick={() => navigate(`/records/${result._id}`)} className="btn-primary">View Record</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper" style={{ paddingTop:'2rem', maxWidth:680 }}>
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'1.75rem', display:'flex',alignItems:'center',gap:'0.75rem' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding:'0.5rem' }}><ArrowLeft size={18} /></button>
          <div>
            <h1 style={{ fontSize:'1.4rem',fontWeight:800,color:'#f1f5f9' }}>Upload Medical Record</h1>
            <p style={{ color:'#64748b',fontSize:'0.82rem' }}>AI will auto-classify and summarize your document</p>
          </div>
        </motion.div>

        {/* Drop zone */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <div {...getRootProps()} className={`drop-zone ${isDragActive?'drag-over':''}`}
            style={{ padding:'2.5rem',textAlign:'center',marginBottom:'1.5rem' }}>
            <input {...getInputProps()} id="file-upload" />
            {file ? (
              <div>
                {preview ? (
                  <img src={preview} alt="preview" style={{ maxHeight:140,borderRadius:8,marginBottom:'0.75rem',maxWidth:'100%' }} />
                ) : (
                  <div style={{ width:56,height:56,borderRadius:12,background:'rgba(8,145,178,0.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem' }}>
                    <File size={28} color="#0891b2" />
                  </div>
                )}
                <p style={{ fontWeight:600,color:'#e2e8f0',fontSize:'0.9rem' }}>{file.name}</p>
                <p style={{ fontSize:'0.75rem',color:'#475569' }}>{(file.size/1024/1024).toFixed(2)} MB</p>
                <button onClick={(e)=>{e.stopPropagation();setFile(null);setPreview(null);}}
                  style={{ marginTop:'0.5rem',background:'none',border:'none',color:'#f87171',cursor:'pointer',fontSize:'0.78rem' }}>
                  <X size={13} style={{display:'inline',marginRight:3}} />Remove
                </button>
              </div>
            ) : (
              <div>
                <div style={{ width:56,height:56,borderRadius:16,background:'rgba(8,145,178,0.08)',border:'2px dashed rgba(8,145,178,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem' }}>
                  <Upload size={24} color="#0891b2" />
                </div>
                <p style={{ fontWeight:600,color:'#e2e8f0',marginBottom:'0.35rem' }}>
                  {isDragActive ? 'Drop it here!' : 'Drag & drop or click to upload'}
                </p>
                <p style={{ fontSize:'0.78rem',color:'#475569' }}>PDF, JPG, PNG, WEBP · Max 20MB</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="glass" style={{ padding:'1.5rem' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
            <div style={{ gridColumn:'span 2' }}>
              <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>
                <FileText size={12} style={{display:'inline',marginRight:4}} />Title
              </label>
              <input className="input-field" placeholder="e.g. Blood Test Report — Jan 2025"
                value={form.title} onChange={e => setForm({...form,title:e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>Category</label>
              <div style={{ position:'relative' }}>
                <select className="input-field" value={form.category} onChange={e => setForm({...form,category:e.target.value})}
                  style={{ appearance:'none',paddingRight:'2rem' }}>
                  <option value="">AI will auto-detect</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} style={{ position:'absolute',right:'0.75rem',top:'50%',transform:'translateY(-50%)',color:'#475569',pointerEvents:'none' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>
                <Calendar size={12} style={{display:'inline',marginRight:4}} />Record Date
              </label>
              <input type="date" className="input-field" value={form.recordDate} onChange={e => setForm({...form,recordDate:e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>
                <Stethoscope size={12} style={{display:'inline',marginRight:4}} />Doctor Name
              </label>
              <input className="input-field" placeholder="Dr. Smith" value={form.doctorName} onChange={e => setForm({...form,doctorName:e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>
                <Building2 size={12} style={{display:'inline',marginRight:4}} />Hospital / Clinic
              </label>
              <input className="input-field" placeholder="City Hospital" value={form.hospitalName} onChange={e => setForm({...form,hospitalName:e.target.value})} />
            </div>

            <div style={{ gridColumn:'span 2' }}>
              <label style={{ fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.4rem',display:'block' }}>Notes (optional)</label>
              <textarea className="input-field" rows={2} style={{ resize:'none' }} placeholder="Any additional notes..."
                value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} />
            </div>
          </div>

          <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'1.25rem',padding:'0.75rem',background:'rgba(129,140,248,0.06)',borderRadius:10,border:'1px solid rgba(129,140,248,0.15)' }}>
            <Sparkles size={15} color="#818cf8" />
            <p style={{ fontSize:'0.78rem',color:'#64748b' }}>
              AI will automatically classify, summarize, and tag this record after upload.
            </p>
          </div>

          <button onClick={handleUpload} disabled={uploading || !file} className="btn-primary"
            style={{ width:'100%',justifyContent:'center',marginTop:'1.25rem',padding:'0.875rem',opacity:(!file||uploading)?0.6:1 }}>
            {uploading
              ? <><Loader size={18} style={{animation:'spin 0.8s linear infinite'}} /> Uploading & Analyzing...</>
              : <><Upload size={16} /> Upload & Analyze with AI</>}
          </button>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
