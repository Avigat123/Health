import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Trash2, Save, Phone, User, Droplet, Pill, Loader, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export default function EmergencyPage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    bloodGroup: user?.bloodGroup || '',
    allergies: user?.allergies?.join(', ') || '',
    currentMedications: user?.currentMedications?.join(', ') || '',
    emergencyContacts: user?.emergencyContacts || [],
  });
  const [saving, setSaving] = useState(false);
  const [newContact, setNewContact] = useState({ name:'',phone:'',relation:'' });

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', {
        bloodGroup: form.bloodGroup,
        allergies: form.allergies.split(',').map(a=>a.trim()).filter(Boolean),
        currentMedications: form.currentMedications.split(',').map(m=>m.trim()).filter(Boolean),
        emergencyContacts: form.emergencyContacts,
      });
      await refreshUser();
      toast.success('Emergency profile saved!');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return toast.error('Name and phone required');
    setForm(prev => ({ ...prev, emergencyContacts: [...prev.emergencyContacts, { ...newContact }] }));
    setNewContact({ name:'',phone:'',relation:'' });
  };

  const removeContact = (i) => {
    setForm(prev => ({ ...prev, emergencyContacts: prev.emergencyContacts.filter((_,idx)=>idx!==i) }));
  };

  // Emergency card preview
  const allergiesList = form.allergies.split(',').map(a=>a.trim()).filter(Boolean);
  const medsList = form.currentMedications.split(',').map(m=>m.trim()).filter(Boolean);

  return (
    <div className="page-container">
      <div className="content-wrapper" style={{ paddingTop:'2rem', maxWidth:760 }}>
        <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} style={{ marginBottom:'1.75rem' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.35rem' }}>
            <ShieldAlert size={22} color="#f87171" />
            <h1 style={{ fontSize:'1.4rem',fontWeight:800,color:'#f1f5f9' }}>Emergency Profile</h1>
          </div>
          <p style={{ color:'#64748b',fontSize:'0.82rem' }}>Critical information for emergency responders and doctors</p>
        </motion.div>

        {/* Emergency Card Preview */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          className="emergency-card" style={{ padding:'1.5rem',marginBottom:'1.5rem' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem',color:'#f87171',fontWeight:700,fontSize:'0.875rem' }}>
            <AlertTriangle size={16} /> EMERGENCY MEDICAL CARD
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1rem' }}>
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:'0.35rem',fontSize:'0.7rem',color:'#64748b',marginBottom:'0.25rem' }}>
                <Droplet size={11} /> Blood Group
              </div>
              <div style={{ fontSize:'1.5rem',fontWeight:900,color: form.bloodGroup ? '#f87171' : '#334155' }}>
                {form.bloodGroup || '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'0.7rem',color:'#64748b',marginBottom:'0.25rem' }}>Allergies</div>
              <div style={{ fontSize:'0.82rem',color: allergiesList.length ? '#fb923c' : '#334155' }}>
                {allergiesList.length ? allergiesList.join(', ') : 'None listed'}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'0.7rem',color:'#64748b',marginBottom:'0.25rem' }}>Current Medications</div>
              <div style={{ fontSize:'0.82rem',color: medsList.length ? '#fbbf24' : '#334155' }}>
                {medsList.length ? medsList.join(', ') : 'None listed'}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'0.7rem',color:'#64748b',marginBottom:'0.25rem' }}>Patient</div>
              <div style={{ fontSize:'0.875rem',fontWeight:600,color:'#e2e8f0' }}>{user?.name}</div>
            </div>
          </div>
        </motion.div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem' }} className="emergency-grid">
          {/* Blood Group */}
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }} className="glass" style={{ padding:'1.25rem' }}>
            <label style={{ fontSize:'0.82rem',fontWeight:600,color:'#94a3b8',marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:'0.35rem' }}>
              <Droplet size={13} color="#f87171" /> Blood Group
            </label>
            <div style={{ display:'flex',gap:'0.5rem',flexWrap:'wrap' }}>
              {BLOOD_GROUPS.map(bg => (
                <button key={bg} onClick={() => setForm({...form,bloodGroup:bg})} style={{
                  padding:'0.4rem 0.75rem',borderRadius:7,border:'1px solid',fontSize:'0.82rem',fontWeight:700,cursor:'pointer',
                  borderColor: form.bloodGroup===bg ? '#f87171' : 'rgba(51,65,85,0.4)',
                  background: form.bloodGroup===bg ? 'rgba(239,68,68,0.15)' : 'transparent',
                  color: form.bloodGroup===bg ? '#f87171' : '#64748b',
                }}>{bg}</button>
              ))}
            </div>
          </motion.div>

          {/* Allergies */}
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.25 }} className="glass" style={{ padding:'1.25rem' }}>
            <label style={{ fontSize:'0.82rem',fontWeight:600,color:'#94a3b8',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.35rem' }}>
              <AlertTriangle size={13} color="#fb923c" /> Allergies
            </label>
            <textarea
              className="input-field" rows={2} style={{ resize:'none',fontSize:'0.82rem' }}
              placeholder="Penicillin, Pollen, Shellfish..."
              value={form.allergies}
              onChange={e => setForm({...form,allergies:e.target.value})}
            />
            <p style={{ fontSize:'0.7rem',color:'#475569',marginTop:'0.3rem' }}>Separate with commas</p>
          </motion.div>

          {/* Medications */}
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }} className="glass" style={{ padding:'1.25rem',gridColumn:'span 2' }}>
            <label style={{ fontSize:'0.82rem',fontWeight:600,color:'#94a3b8',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:'0.35rem' }}>
              <Pill size={13} color="#fbbf24" /> Current Medications
            </label>
            <textarea
              className="input-field" rows={2} style={{ resize:'none',fontSize:'0.82rem' }}
              placeholder="Metformin 500mg, Aspirin 75mg..."
              value={form.currentMedications}
              onChange={e => setForm({...form,currentMedications:e.target.value})}
            />
            <p style={{ fontSize:'0.7rem',color:'#475569',marginTop:'0.3rem' }}>Separate with commas</p>
          </motion.div>
        </div>

        {/* Emergency Contacts */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }} className="glass" style={{ padding:'1.25rem',marginTop:'1.25rem' }}>
          <h3 style={{ fontSize:'0.9rem',fontWeight:700,color:'#e2e8f0',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.4rem' }}>
            <Phone size={15} color="#0891b2" /> Emergency Contacts
          </h3>

          {form.emergencyContacts.map((c,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem',background:'rgba(15,23,42,0.5)',borderRadius:8,marginBottom:'0.5rem' }}>
              <div style={{ width:34,height:34,borderRadius:'50%',background:'rgba(8,145,178,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <User size={16} color="#0891b2" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'0.875rem',fontWeight:600,color:'#e2e8f0' }}>{c.name}</div>
                <div style={{ fontSize:'0.75rem',color:'#64748b' }}>{c.phone} · {c.relation}</div>
              </div>
              <button onClick={() => removeContact(i)} style={{ background:'none',border:'none',color:'#475569',cursor:'pointer' }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {/* Add contact */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:'0.5rem',marginTop:'0.75rem' }}>
            {['name','phone','relation'].map(field => (
              <input key={field} className="input-field" placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                value={newContact[field]} onChange={e => setNewContact({...newContact,[field]:e.target.value})}
                style={{ fontSize:'0.8rem' }} />
            ))}
            <button onClick={addContact} className="btn-primary" style={{ padding:'0.625rem 0.875rem' }}>
              <Plus size={16} />
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }} style={{ marginTop:'1.5rem' }}>
          <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ width:'100%',justifyContent:'center',padding:'0.875rem' }}>
            {saving ? <><Loader size={16} style={{animation:'spin 0.8s linear infinite'}} /> Saving...</> : <><Save size={16} /> Save Emergency Profile</>}
          </button>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}.emergency-grid{grid-template-columns:1fr 1fr}@media(max-width:600px){.emergency-grid{grid-template-columns:1fr}}`}</style>
    </div>
  );
}
