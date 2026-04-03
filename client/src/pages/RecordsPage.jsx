import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import RecordCard from '../components/RecordCard';
import ChatBot from '../components/ChatBot';

const CATEGORIES = ['All','Prescription','Blood Test','X-Ray','MRI/CT Scan','Vaccination','Allergy Record','Medical Certificate','ECG','Invoice','Other'];

export default function RecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('-recordDate');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(fetchRecords, 300);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category, sort, limit: 50 });
      if (search) params.set('search', search);
      const { data } = await api.get(`/records?${params}`);
      setRecords(data.records);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="content-wrapper" style={{ paddingTop:'2rem' }}>
        {/* Header */}
        <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }}
          style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.75rem',flexWrap:'wrap',gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'1.4rem',fontWeight:800,color:'#f1f5f9' }}>Medical Records</h1>
            <p style={{ color:'#64748b',fontSize:'0.82rem' }}>{total} record{total!==1?'s':''} found</p>
          </div>
          <button onClick={() => navigate('/upload')} className="btn-primary">
            <Plus size={16} /> Upload New
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          className="glass" style={{ padding:'1rem 1.25rem',marginBottom:'1.5rem' }}>
          {/* Search */}
          <div style={{ position:'relative',marginBottom:'0.875rem' }}>
            <Search size={16} style={{ position:'absolute',left:'0.875rem',top:'50%',transform:'translateY(-50%)',color:'#475569' }} />
            <input
              id="records-search"
              className="input-field"
              placeholder="Search by title, doctor, hospital, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft:'2.5rem' }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display:'flex',gap:'0.4rem',overflowX:'auto',paddingBottom:'0.25rem' }} className="no-scrollbar">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding:'0.35rem 0.75rem',borderRadius:6,border:'1px solid',fontSize:'0.75rem',fontWeight:500,
                whiteSpace:'nowrap',cursor:'pointer',transition:'all 0.15s',
                borderColor: category===c ? '#0891b2' : 'rgba(51,65,85,0.4)',
                background: category===c ? 'rgba(8,145,178,0.15)' : 'transparent',
                color: category===c ? '#22d3ee' : '#64748b',
              }}>{c}</button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.75rem' }}>
            <SlidersHorizontal size={14} color="#475569" />
            <span style={{ fontSize:'0.75rem',color:'#475569' }}>Sort:</span>
            {[
              { value:'-recordDate', label:'Newest First' },
              { value:'recordDate', label:'Oldest First' },
              { value:'-createdAt', label:'Recently Added' },
            ].map(s => (
              <button key={s.value} onClick={() => setSort(s.value)} style={{
                padding:'0.3rem 0.6rem',borderRadius:5,border:'1px solid',fontSize:'0.72rem',cursor:'pointer',
                borderColor: sort===s.value ? '#0891b2' : 'rgba(51,65,85,0.3)',
                background: sort===s.value ? 'rgba(8,145,178,0.12)' : 'transparent',
                color: sort===s.value ? '#22d3ee' : '#475569',
              }}>{s.label}</button>
            ))}
          </div>
        </motion.div>

        {/* Records grid */}
        {loading ? (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1rem' }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} className="glass" style={{ padding:'1.25rem',height:140 }}>
                <div style={{ display:'flex',gap:'0.875rem' }}>
                  <div className="shimmer" style={{ width:42,height:42,borderRadius:10,flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div className="shimmer" style={{ height:14,width:'70%',marginBottom:'0.5rem' }} />
                    <div className="shimmer" style={{ height:12,width:'50%',marginBottom:'0.5rem' }} />
                    <div className="shimmer" style={{ height:12,width:'85%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : records.length ? (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1rem' }}>
            {records.map((r, i) => <RecordCard key={r._id} record={r} index={i} />)}
          </div>
        ) : (
          <div className="glass" style={{ padding:'4rem',textAlign:'center' }}>
            <Filter size={36} color="#1e3a5f" style={{ marginBottom:'1rem' }} />
            <p style={{ color:'#475569',marginBottom:'0.5rem',fontWeight:500 }}>No records found</p>
            <p style={{ color:'#334155',fontSize:'0.82rem' }}>
              {search || category !== 'All' ? 'Try adjusting your filters' : 'Upload your first medical record to get started'}
            </p>
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
}
