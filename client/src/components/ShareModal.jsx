import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Clock, Link2, QrCode, Copy, Check, Loader, Shield } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ShareModal({ records, onClose }) {
  const [step, setStep] = useState('config'); // config | result
  const [shareAll, setShareAll] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hours, setHours] = useState(24);
  const [maxUses, setMaxUses] = useState('');
  const [doctorNote, setDoctorNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/share/create', {
        shareAll,
        recordIds: shareAll ? [] : selectedIds,
        expiresInHours: hours,
        maxUses: maxUses ? Number(maxUses) : undefined,
        doctorNote,
      });
      setResult(data);
      setStep('result');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(result.shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass"
          style={{ width: '100%', maxWidth: 480, padding: '1.75rem', position: 'relative' }}
        >
          <button onClick={onClose} style={{ position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',color:'#64748b',cursor:'pointer' }}>
            <X size={20} />
          </button>

          {step === 'config' && (
            <>
              <div style={{ display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'1.5rem' }}>
                <Share2 size={20} color="#0891b2" />
                <h2 style={{ fontSize:'1.1rem',fontWeight:700,color:'#e2e8f0' }}>Share Records</h2>
              </div>

              {/* Share All / Selected */}
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ fontSize:'0.8rem',color:'#94a3b8',marginBottom:'0.5rem',display:'block' }}>What to share</label>
                <div style={{ display:'flex',gap:'0.5rem' }}>
                  {['All Records','Selected Only'].map((opt, i) => (
                    <button key={opt} onClick={() => setShareAll(i === 0)}
                      style={{
                        flex:1,padding:'0.6rem',borderRadius:8,border:'1px solid',fontSize:'0.82rem',fontWeight:500,cursor:'pointer',
                        borderColor: (i===0) === shareAll ? '#0891b2' : 'rgba(51,65,85,0.5)',
                        background: (i===0) === shareAll ? 'rgba(8,145,178,0.15)' : 'transparent',
                        color: (i===0) === shareAll ? '#22d3ee' : '#64748b',
                      }}>{opt}</button>
                  ))}
                </div>
              </div>

              {/* Expiry */}
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ fontSize:'0.8rem',color:'#94a3b8',marginBottom:'0.5rem',display:'block' }}>
                  <Clock size={12} style={{display:'inline',marginRight:4}} />Link expires in
                </label>
                <div style={{ display:'flex',gap:'0.5rem',flexWrap:'wrap' }}>
                  {[1,6,24,48,72].map(h => (
                    <button key={h} onClick={() => setHours(h)}
                      style={{
                        padding:'0.4rem 0.75rem',borderRadius:6,border:'1px solid',fontSize:'0.78rem',cursor:'pointer',
                        borderColor: hours===h ? '#0891b2' : 'rgba(51,65,85,0.5)',
                        background: hours===h ? 'rgba(8,145,178,0.15)' : 'transparent',
                        color: hours===h ? '#22d3ee' : '#64748b',
                      }}>{h}h</button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ fontSize:'0.8rem',color:'#94a3b8',marginBottom:'0.5rem',display:'block' }}>Note for doctor (optional)</label>
                <textarea
                  value={doctorNote}
                  onChange={e => setDoctorNote(e.target.value)}
                  placeholder="e.g. Please review my recent reports..."
                  className="input-field"
                  rows={2}
                  style={{ resize:'none',fontSize:'0.82rem' }}
                />
              </div>

              <button onClick={handleShare} disabled={loading} className="btn-primary" style={{ width:'100%',justifyContent:'center' }}>
                {loading ? <><Loader size={16} style={{animation:'spin 0.8s linear infinite'}} /> Generating...</> : <><QrCode size={16} /> Generate Link & QR Code</>}
              </button>
            </>
          )}

          {step === 'result' && result && (
            <>
              <div style={{ textAlign:'center',marginBottom:'1.5rem' }}>
                <div style={{ width:44,height:44,borderRadius:'50%',background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem' }}>
                  <Shield size={20} color="#34d399" />
                </div>
                <h2 style={{ fontSize:'1.05rem',fontWeight:700,color:'#e2e8f0' }}>Share Link Created!</h2>
                <p style={{ fontSize:'0.78rem',color:'#64748b',marginTop:'0.25rem' }}>Expires in {hours} hour{hours>1?'s':''}</p>
              </div>

              {/* QR Code */}
              <div style={{ display:'flex',justifyContent:'center',marginBottom:'1.25rem' }}>
                <div style={{ padding:'1rem',background:'white',borderRadius:12 }}>
                  <QRCodeSVG value={result.shareUrl} size={160} />
                </div>
              </div>

              {/* Link */}
              <div style={{ display:'flex',gap:'0.5rem',marginBottom:'1.5rem' }}>
                <div className="input-field" style={{ flex:1,fontSize:'0.75rem',color:'#64748b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                  {result.shareUrl}
                </div>
                <button onClick={copyLink} className="btn-primary" style={{ flexShrink:0,padding:'0.625rem 0.875rem' }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              <button onClick={onClose} className="btn-secondary" style={{ width:'100%',justifyContent:'center' }}>
                Done
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
