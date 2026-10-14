import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Compass,
  Map,
  BookOpen,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  ExternalLink,
  Target,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import EmptyState from '../components/EmptyState';

export const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useNotification();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard');
      if (res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGoal = async (goalId) => {
    try {
      const res = await api.put(`/notifications/goals/${goalId}/toggle`);
      if (res.data) {
        toast.success(res.data.message);
        // Update local goal state
        setDashboardData((prev) => ({
          ...prev,
          learning_goals: prev.learning_goals.map((g) =>
            g.id === goalId ? res.data.goal : g
          )
        }));
      }
    } catch (err) {
      toast.error('Failed to update goal status.');
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    try {
      const res = await api.post('/notifications/goals', {
        title: newGoalTitle.trim(),
        target_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      });
      if (res.data && res.data.goal) {
        toast.success('Learning goal added!');
        setDashboardData((prev) => ({
          ...prev,
          learning_goals: [res.data.goal, ...(prev.learning_goals || [])]
        }));
        setNewGoalTitle('');
        setAddingGoal(false);
      }
    } catch (err) {
      toast.error('Failed to create learning goal.');
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
        <p style={{ color: 'var(--text-secondary)' }}>Preparing your personalized dashboard...</p>
      </div>
    );
  }

  const {
    welcome_message,
    profile_completion,
    latest_assessment_score,
    career_readiness,
    top_recommendations = [],
    recommended_courses = [],
    saved_careers = [],
    learning_goals = [],
    weekly_activity = []
  } = dashboardData || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Welcome */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 100%)',
          border: '1px solid var(--border-focus)',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
            Student Workspace
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {welcome_message || `Welcome back, ${user?.name}!`}
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '600px' }}>
            Track your skills assessments, evaluate algorithmic career compatibility, and complete roadmap milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/assessment" className="btn btn-primary">
            <Brain size={18} />
            {latest_assessment_score !== null ? 'Retake Assessment' : 'Take Skills Assessment'}
          </Link>
          <Link to="/careers" className="btn btn-secondary">
            <Compass size={18} /> Explore Careers
          </Link>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Profile Completion */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Profile Completion
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
              {profile_completion}%
            </span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {profile_completion >= 80 ? 'Complete' : 'In Progress'}
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${profile_completion}%` }} />
          </div>
          <Link to="/profile" style={{ display: 'block', marginTop: '0.6rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Update profile details &rarr;
          </Link>
        </div>

        {/* Latest Assessment Score */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Assessment Score
            </span>
            <Brain size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {latest_assessment_score !== null ? `${latest_assessment_score}%` : 'Not Taken'}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            {latest_assessment_score !== null ? 'Based on latest assessment attempt' : 'Take the 8-domain assessment'}
          </div>
        </div>

        {/* Career Readiness */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Career Readiness
            </span>
            <Award size={16} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {career_readiness}%
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${career_readiness}%`, background: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Composite aptitude & roadmap index
          </div>
        </div>

        {/* Saved Careers */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Bookmarked Paths
            </span>
            <Compass size={16} style={{ color: '#ec4899' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {saved_careers.length}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Active career paths in your tracker
          </div>
        </div>
      </div>

      {/* Two Column Grid: Top Recommendations + Activity Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
        {/* Top Career Recommendations */}
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Algorithmic Career Recommendations
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Ranked by rule-based multi-factor compatibility
              </p>
            </div>
            <Link to="/assessment" className="btn btn-outline btn-sm">
              Recalculate
            </Link>
          </div>

          {top_recommendations.length === 0 ? (
            <EmptyState
              title="No Career Matches Calculated Yet"
              description="Complete the skills assessment to generate your personalized compatibility scores."
              actionText="Take Skills Assessment"
              actionLink="/assessment"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {top_recommendations.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    padding: '1.15rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                        Rank #{rec.rank_order} Match
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {rec.career?.title || 'Career Path'}
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {rec.compatibility_score}%
                      </span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Compatibility</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {rec.match_reason}
                  </p>

                  <div className="flex items-center justify-between" style={{ marginTop: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '0.25rem' }}>
                      {(rec.matching_skills || []).slice(0, 3).map((sk) => (
                        <span key={sk} className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                          ✓ {sk}
                        </span>
                      ))}
                      {(rec.missing_skills || []).slice(0, 2).map((sk) => (
                        <span key={sk} className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>
                          + {sk}
                        </span>
                      ))}
                    </div>

                    <Link to={`/careers/${rec.career_id}`} className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem' }}>
                      View Roadmap <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Activity Chart & Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Recharts Activity Graph */}
          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Weekly Learning Activity
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Recorded study hours & roadmap milestones
                </p>
              </div>
              <Clock size={18} style={{ color: 'var(--primary)' }} />
            </div>

            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekly_activity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#purpleGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Learning Goals */}
          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Target Learning Goals
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Weekly milestones you set for yourself
                </p>
              </div>
              <button
                onClick={() => setAddingGoal(!addingGoal)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.65rem' }}
              >
                <Plus size={16} /> Add Goal
              </button>
            </div>

            {addingGoal && (
              <form onSubmit={handleCreateGoal} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="e.g. Master React Custom Hooks"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.85rem' }}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Save
                </button>
              </form>
            )}

            {learning_goals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active learning goals yet. Add one above!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {learning_goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => handleToggleGoal(g.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: g.is_completed ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {g.is_completed ? (
                        <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                      ) : (
                        <Circle size={16} style={{ color: 'var(--text-muted)' }} />
                      )}
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          textDecoration: g.is_completed ? 'line-through' : 'none',
                          color: g.is_completed ? 'var(--text-muted)' : 'var(--text-primary)'
                        }}
                      >
                        {g.title}
                      </span>
                    </div>
                    {g.target_date && (
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {g.target_date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Courses Row */}
      <div className="card">
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Curated Courses for Your Target Roles
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Verified offerings mapped directly to your missing competencies
            </p>
          </div>
          <Link to="/courses" className="btn btn-secondary btn-sm">
            View All Courses <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {recommended_courses.map((course) => (
            <div
              key={course.id}
              style={{
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {course.provider}
                  </span>
                  <span className={`badge ${course.is_free ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: '0.65rem' }}>
                    {course.is_free ? 'Free' : 'Verified'}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {course.title}
                </h4>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {course.duration} &bull; {course.difficulty}
                </div>
              </div>

              <a
                href={course.course_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', width: '100%' }}
              >
                Enroll Now <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
