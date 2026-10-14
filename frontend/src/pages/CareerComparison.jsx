import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Compass
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import EmptyState from '../components/EmptyState';

export const CareerComparison = () => {
  const [allCareers, setAllCareers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([1, 2]); // default compare Full Stack & Frontend
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const { toast } = useNotification();

  useEffect(() => {
    fetchCareersList();
  }, []);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      runComparison();
    }
  }, [selectedIds]);

  const fetchCareersList = async () => {
    try {
      const res = await api.get('/careers');
      if (res.data && res.data.careers) {
        setAllCareers(res.data.careers);
        if (res.data.careers.length >= 2) {
          setSelectedIds([res.data.careers[0].id, res.data.careers[1].id]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch careers list:', err);
    } finally {
      setLoading(false);
    }
  };

  const runComparison = async () => {
    setLoading(true);
    try {
      const res = await api.post('/careers/compare', { career_ids: selectedIds });
      if (res.data && res.data.careers) {
        setComparisonData(res.data.careers);
      }
    } catch (err) {
      console.error('Failed to compare careers:', err);
      toast.error('Unable to fetch comparison data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCareer = (slotIndex, newId) => {
    const updated = [...selectedIds];
    updated[slotIndex] = parseInt(newId);
    setSelectedIds(updated);
  };

  const handleAddSlot = () => {
    if (selectedIds.length >= 3) {
      toast.info('You can compare a maximum of 3 careers simultaneously.');
      return;
    }
    // Pick first career id not already selected
    const available = allCareers.find((c) => !selectedIds.includes(c.id));
    if (available) {
      setSelectedIds([...selectedIds, available.id]);
    }
  };

  const handleRemoveSlot = (index) => {
    if (selectedIds.length <= 2) {
      toast.info('Please maintain at least 2 careers for comparison.');
      return;
    }
    const updated = selectedIds.filter((_, i) => i !== index);
    setSelectedIds(updated);
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Analytical Benchmark</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Side-by-Side Career Comparison
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Select up to 3 technology careers to evaluate differences in required skills, difficulty level, prerequisites, and learning roadmaps.
          </p>
        </div>

        {/* Career Selection Controls Bar */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
            {selectedIds.map((idVal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Slot {idx + 1}:
                </span>
                <select
                  value={idVal}
                  onChange={(e) => handleSelectCareer(idx, e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', minWidth: '200px' }}
                >
                  {allCareers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                {selectedIds.length > 2 && (
                  <button
                    onClick={() => handleRemoveSlot(idx)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger)', padding: '0.2rem 0.5rem' }}
                    title="Remove slot"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}

            {selectedIds.length < 3 && (
              <button onClick={handleAddSlot} className="btn btn-secondary btn-sm">
                + Add 3rd Career
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Comparing {selectedIds.length} roles
          </div>
        </div>

        {/* Comparison Table / Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '40px', height: '40px',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }} />
            <p style={{ color: 'var(--text-secondary)' }}>Comparing role metrics...</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${comparisonData.length}, minmax(0, 1fr))`,
              gap: '1.5rem',
            }}
          >
            {comparisonData.map((career) => (
              <div key={career.id} className="card flex flex-col justify-between" style={{ padding: '2rem' }}>
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{career.category}</span>
                    <span className="badge badge-gray">{career.difficulty}</span>
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {career.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {career.description}
                  </p>

                  {/* Growth & Education */}
                  <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Growth Outlook
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      {career.growth_outlook}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.6rem' }}>
                      Prerequisites
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {career.prerequisites || 'Standard Computer Science foundations.'}
                    </div>
                  </div>

                  {/* Required Technical Skills */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Required Technologies:
                    </div>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '0.35rem' }}>
                      {(career.required_skills || []).map((sk) => (
                        <span key={sk} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* User Skill Gap Analysis (if authenticated) */}
                  {isAuthenticated && (
                    <div style={{ marginBottom: '1.25rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Your Profile Match:
                      </div>
                      <div className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--success)', marginBottom: '0.25rem' }}>
                        <CheckCircle2 size={14} />
                        <span>Matched: {career.matched_skills?.length || 0} skills</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>
                        <AlertCircle size={14} />
                        <span>To Learn: {career.missing_skills?.length || 0} skills</span>
                      </div>
                    </div>
                  )}

                  {/* Core Responsibilities */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Key Responsibilities:
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {(career.typical_responsibilities || []).slice(0, 3).map((r, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-2">
                          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>&bull;</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={`/careers/${career.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  View Full Roadmap <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerComparison;
