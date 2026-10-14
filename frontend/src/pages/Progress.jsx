import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Brain,
  Award,
  Compass,
  BookOpen,
  Target,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import EmptyState from '../components/EmptyState';

export const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/progress');
      if (res.data) {
        setProgressData(res.data);
      }
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <p style={{ color: 'var(--text-secondary)' }}>Compiling milestone achievements...</p>
      </div>
    );
  }

  const {
    assessment_history = [],
    recommendations = [],
    completed_steps_count = 0,
    completed_courses_count = 0,
    completed_goals_count = 0,
    goals = [],
    badges = []
  } = progressData || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Milestone Progress & Achievements
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Verifiable record of your completed assessments, roadmap achievements, and unlocked badges.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="card">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Assessments Taken
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {assessment_history.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluations recorded</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Roadmap Milestones
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {completed_steps_count}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed roadmap stages</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Target Goals Achieved
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>
            {completed_goals_count}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Goals finished</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Earned Badges
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ec4899', marginTop: '0.25rem' }}>
            {badges.filter((b) => b.unlocked).length} / {badges.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Achievement badges</div>
        </div>
      </div>

      {/* Milestone Badges Showcase */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Milestone Achievement Badges
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Badges unlock based strictly on your recorded database milestones.
        </p>

        <div className="grid grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: badge.unlocked ? 'var(--bg-card)' : 'var(--bg-tertiary)',
                border: `1px solid ${badge.unlocked ? 'var(--primary)' : 'var(--border-color)'}`,
                boxShadow: badge.unlocked ? '0 4px 12px var(--primary-glow)' : 'none',
                opacity: badge.unlocked ? 1 : 0.6,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: badge.unlocked ? 'var(--primary-light)' : 'var(--border-subtle)',
                  color: badge.unlocked ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Award size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {badge.title}
              </h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {badge.description}
              </p>
              <span className={`badge ${badge.unlocked ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: '0.65rem' }}>
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment History Table */}
      <div className="card" style={{ padding: '2rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Assessment Evaluation History
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Review prior assessment submissions and score progressions
            </p>
          </div>
          <Link to="/assessment" className="btn btn-outline btn-sm">
            Retake Assessment
          </Link>
        </div>

        {assessment_history.length === 0 ? (
          <EmptyState
            title="No Assessments Completed"
            description="Complete your first skills assessment to start building your aptitude history."
            actionText="Take Assessment"
            actionLink="/assessment"
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Attempt #</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date Completed</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Overall Score</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Top Section</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {assessment_history.map((att, idx) => {
                  const secScores = att.section_scores || {};
                  const topEntry = Object.entries(secScores).sort((a, b) => b[1] - a[1])[0];
                  return (
                    <tr key={att.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {att.completed_at ? att.completed_at.slice(0, 10) : 'Recent'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-purple" style={{ fontWeight: 700 }}>
                          {att.total_score}%
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>
                        {topEntry ? `${topEntry[0].replace('_', ' ')} (${topEntry[1]}%)` : 'Balanced'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Link
                          to="/assessment/result"
                          state={{ result: att }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          View Breakdown
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
