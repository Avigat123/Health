import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Droplet, Scan, Activity, Syringe, AlertCircle, Award, Heart, Receipt, File } from 'lucide-react';

const CATEGORY_STYLES = {
  'Prescription':       { cls: 'badge-prescription', icon: FileText,     color: '#a78bfa' },
  'Blood Test':         { cls: 'badge-blood',         icon: Droplet,      color: '#f87171' },
  'X-Ray':              { cls: 'badge-xray',          icon: Scan,         color: '#60a5fa' },
  'MRI/CT Scan':        { cls: 'badge-mri',           icon: Activity,     color: '#34d399' },
  'Vaccination':        { cls: 'badge-vaccination',   icon: Syringe,      color: '#fbbf24' },
  'Allergy Record':     { cls: 'badge-allergy',       icon: AlertCircle,  color: '#fb923c' },
  'Medical Certificate':{ cls: 'badge-certificate',   icon: Award,        color: '#22d3ee' },
  'ECG':                { cls: 'badge-ecg',           icon: Heart,        color: '#f472b6' },
  'Invoice':            { cls: 'badge-invoice',       icon: Receipt,      color: '#94a3b8' },
  'Other':              { cls: 'badge-other',         icon: File,         color: '#94a3b8' },
};

export function CategoryBadge({ category }) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['Other'];
  const Icon = style.icon;
  return (
    <span className={`badge ${style.cls}`}>
      <Icon size={10} />
      {category}
    </span>
  );
}

export default function RecordCard({ record, index = 0 }) {
  const navigate = useNavigate();
  const style = CATEGORY_STYLES[record.category] || CATEGORY_STYLES['Other'];
  const Icon = style.icon;
  const date = new Date(record.recordDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => navigate(`/records/${record._id}`)}
      className="glass card-hover"
      style={{ padding: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      {/* Accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${style.color}, transparent)`,
        borderRadius: '16px 16px 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        {/* Icon */}
        <div style={{
          width: 42, height: 42, borderRadius: 10, flexShrink: 0,
          background: `rgba(${hexToRgb(style.color)}, 0.12)`,
          border: `1px solid rgba(${hexToRgb(style.color)}, 0.25)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={style.color} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h3 style={{
              fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
            }}>
              {record.title}
            </h3>
            <CategoryBadge category={record.category} />
          </div>

          {(record.doctorName || record.hospitalName) && (
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.3rem' }}>
              {record.doctorName && `Dr. ${record.doctorName}`}
              {record.doctorName && record.hospitalName && ' · '}
              {record.hospitalName}
            </p>
          )}

          {record.aiSummary && (
            <p style={{
              fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', marginBottom: '0.5rem',
            }}>
              {record.aiSummary}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>{date}</span>
            {record.aiTags?.slice(0, 2).map(tag => (
              <span key={tag} style={{
                fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 4,
                background: 'rgba(71,85,105,0.3)', color: '#64748b',
              }}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '148, 163, 184';
}
