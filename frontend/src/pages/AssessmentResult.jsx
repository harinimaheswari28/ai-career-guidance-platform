import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Compass,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import api from '../services/api';

export const AssessmentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);

  useEffect(() => {
    if (!result) {
      // Fetch latest attempt from backend
      const fetchLatest = async () => {
        try {
          const res = await api.get('/assessments/latest');
          if (res.data && res.data.attempt) {
            setResult(res.data.attempt);
          } else {
            navigate('/assessment');
          }
        } catch (err) {
          navigate('/assessment');
        } finally {
          setLoading(false);
        }
      };
      fetchLatest();
    }
  }, [result, navigate]);

  if (loading || !result) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div style={{
          width: '40px', height: '40px',
          border: '4px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem auto'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Compiling your assessment report...</p>
      </div>
    );
  }

  const { total_score, section_scores = {}, strengths = [], improvement_areas = [], suggested_next_steps = [] } = result;

  // Prepare chart data for section breakdown
  const chartData = Object.entries(section_scores).map(([key, val]) => ({
    section: key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    score: val
  }));

  return (
    <div style={{ padding: '3rem 1rem 5rem 1rem', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header Hero Banner */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)',
            border: '1px solid var(--border-focus)',
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}
        >
          <div
            style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem auto', boxShadow: '0 6px 16px var(--primary-glow)'
            }}
          >
            <Award size={28} />
          </div>

          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
            Aptitude Evaluation Report
          </span>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Assessment Completed
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 1.5rem auto' }}>
            Your responses have been processed through our recommendation engine. Career matches have been updated in your dashboard.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary)' }}>
              {total_score}%
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Overall Aptitude Index
            </span>
          </div>

          <div className="flex items-center justify-center gap-4" style={{ marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <Sparkles size={18} /> View Career Recommendations
            </Link>
            <Link to="/assessment" className="btn btn-secondary btn-lg">
              <RotateCcw size={18} /> Retake Assessment
            </Link>
          </div>
        </div>

        {/* Section Scores Chart */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Section-Wise Aptitude Breakdown
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Relative strengths across core software engineering domains
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="section"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${value}%`, 'Score']}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score >= 75 ? 'var(--primary)' : entry.score >= 60 ? 'var(--accent)' : 'var(--warning)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Improvement Areas Columns */}
        <div className="grid grid-cols-2 gap-8" style={{ marginBottom: '2.5rem' }}>
          {/* Strengths */}
          <div className="card">
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem', color: 'var(--success)' }}>
              <CheckCircle2 size={20} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Identified Strengths
              </h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {strengths.map((str, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--success-bg)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5
                  }}
                >
                  &bull; {str}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="card">
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem', color: 'var(--warning)' }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Areas for Improvement
              </h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {improvement_areas.map((imp, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--warning-bg)',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5
                  }}
                >
                  &bull; {imp}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggested Next Steps */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Recommended Actionable Next Steps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {suggested_next_steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3"
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)'
                }}
              >
                <span
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'var(--primary)', color: '#ffffff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.75rem', flexShrink: 0
                  }}
                >
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/careers" className="btn btn-primary">
              Explore Matched Career Roadmaps <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;
