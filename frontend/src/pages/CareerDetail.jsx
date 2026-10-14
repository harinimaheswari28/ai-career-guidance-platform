import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Circle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  Award,
  Layers,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Brain
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import EmptyState from '../components/EmptyState';

export const CareerDetail = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [togglingStepId, setTogglingStepId] = useState(null);

  const { isAuthenticated } = useAuth();
  const { toast } = useNotification();

  useEffect(() => {
    fetchCareerDetail();
  }, [id]);

  const fetchCareerDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/careers/${id}`);
      if (res.data && res.data.career) {
        setCareer(res.data.career);
        setIsSaved(res.data.career.is_saved || false);
      }
    } catch (err) {
      console.error('Failed to load career details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to save this career path.');
      return;
    }
    try {
      const res = await api.post(`/careers/save/${career.id}`);
      if (res.data) {
        setIsSaved(res.data.is_saved);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update bookmark.');
    }
  };

  const handleToggleStep = async (stepId) => {
    if (!isAuthenticated) {
      toast.info('Log in to mark roadmap milestones and track your progress.');
      return;
    }

    setTogglingStepId(stepId);
    try {
      const res = await api.put(`/roadmaps/steps/${stepId}/toggle`);
      if (res.data) {
        toast.success(res.data.message);
        // Refresh career to update step states
        await fetchCareerDetail();
      }
    } catch (err) {
      toast.error('Failed to toggle step milestone.');
    } finally {
      setTogglingStepId(null);
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
        <p style={{ color: 'var(--text-secondary)' }}>Loading career path details...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <EmptyState
          title="Career Path Not Found"
          description="The career path you requested could not be located."
          actionText="Back to Explore Careers"
          actionLink="/careers"
        />
      </div>
    );
  }

  const roadmapSteps = career.roadmap?.steps || [];
  const completedStepsCount = roadmapSteps.filter((s) => s.is_completed).length;
  const roadmapPct = roadmapSteps.length > 0 ? Math.round((completedStepsCount / roadmapSteps.length) * 100) : 0;
  const userCompat = career.user_compatibility;

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/careers">Explore Careers</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{career.title}</span>
        </div>

        {/* Hero Header Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="flex items-center gap-3">
              <span className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                {career.category}
              </span>
              <span className="badge badge-gray" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                {career.difficulty}
              </span>
            </div>
            <button
              onClick={handleToggleSave}
              className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {isSaved ? 'Saved to Dashboard' : 'Save Career'}
            </button>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            {career.title}
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '840px', marginBottom: '2rem' }}>
            {career.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-6" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Growth Outlook
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {career.growth_outlook}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Education Requirement
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {career.education_req}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Learning Roadmap
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {roadmapSteps.length} Structured Stages
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Main Details & Sidebar Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Responsibilities & Projects */}
            <div className="card">
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Typical Core Responsibilities
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {(career.typical_responsibilities || []).map((resp, idx) => (
                  <li key={idx} className="flex items-center gap-3" style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>

              {career.example_projects && career.example_projects.length > 0 && (
                <>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    Example Real-World Projects
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {career.example_projects.map((proj, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-tertiary)',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: 'var(--text-primary)'
                        }}
                      >
                        &bull; {proj}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Skills Breakdown */}
            <div className="card">
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Required & Recommended Skills
              </h2>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Essential Technical Competencies
                </span>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {(career.required_skills || []).map((sk) => (
                    <span key={sk} className="badge badge-purple" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {career.preferred_skills && career.preferred_skills.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Preferred Additional Tools
                  </span>
                  <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {career.preferred_skills.map((sk) => (
                      <span key={sk} className="badge badge-blue" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {career.soft_skills && career.soft_skills.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Preferred Interpersonal Traits
                  </span>
                  <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {career.soft_skills.map((sk) => (
                      <span key={sk} className="badge badge-gray" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Learning Roadmap */}
            <div className="card">
              <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Personalized Step-by-Step Learning Roadmap
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Follow each stage progressively. Mark steps complete to update your profile readiness.
                  </p>
                </div>
                {isAuthenticated && (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {completedStepsCount} of {roadmapSteps.length} Completed ({roadmapPct}%)
                    </span>
                    <div className="progress-container" style={{ width: '140px', marginTop: '0.35rem' }}>
                      <div className="progress-bar" style={{ width: `${roadmapPct}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {roadmapSteps.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Roadmap stages are currently being finalized.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {roadmapSteps.map((step) => {
                    const isDone = step.is_completed;
                    return (
                      <div
                        key={step.id}
                        style={{
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.25rem',
                          background: isDone ? 'var(--success-bg)' : 'var(--bg-card)',
                          transition: 'var(--transition)'
                        }}
                      >
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                          <div className="flex items-center gap-3">
                            <span
                              style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: isDone ? 'var(--success)' : 'var(--primary-light)',
                                color: isDone ? '#ffffff' : 'var(--primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: '0.85rem'
                              }}
                            >
                              {step.stage_number}
                            </span>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {step.stage_title}
                            </h3>
                          </div>

                          <button
                            onClick={() => handleToggleStep(step.id)}
                            disabled={togglingStepId === step.id}
                            className={`btn ${isDone ? 'btn-ghost' : 'btn-outline'} btn-sm`}
                            style={{ fontSize: '0.8rem' }}
                          >
                            {isDone ? (
                              <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
                                <CheckCircle2 size={16} /> Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Circle size={16} /> Mark as Done
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Topics */}
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Core Study Topics:
                          </span>
                          <div className="flex" style={{ flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                            {(step.topics || []).map((top, tIdx) => (
                              <span key={tIdx} className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                                {top}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Practical exercises & Projects */}
                        {step.practical_exercises && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <strong>Hands-On Exercise:</strong> {step.practical_exercises}
                          </div>
                        )}
                        {step.mini_project && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            <strong>Stage Mini-Project:</strong> {step.mini_project}
                          </div>
                        )}
                        {step.capstone_project && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                            <strong>Capstone Project:</strong> {step.capstone_project}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Related Verified Courses */}
            {career.courses && career.courses.length > 0 && (
              <div className="card">
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  Recommended Verified Courses
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {career.courses.map((course) => (
                    <div
                      key={course.id}
                      style={{
                        padding: '1rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
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
                          <span className={`badge ${course.is_free ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: '0.7rem' }}>
                            {course.is_free ? 'Free Course' : 'Paid Certificate'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                          {course.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                          {course.duration} &bull; {course.difficulty}
                        </p>
                      </div>
                      <a
                        href={course.course_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Enroll on {course.provider.split('/')[0].trim()} <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Compatibility & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* User Compatibility Card */}
            {isAuthenticated && userCompat ? (
              <div className="card" style={{ border: '1px solid var(--border-focus)', background: 'var(--bg-card)' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  <Sparkles size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Your Compatibility
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {userCompat.compatibility_score}%
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Match Index</span>
                </div>

                <div className="progress-container" style={{ marginBottom: '1.25rem' }}>
                  <div className="progress-bar" style={{ width: `${userCompat.compatibility_score}%` }} />
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {userCompat.match_reason}
                </p>

                {userCompat.matching_skills && userCompat.matching_skills.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>
                      Matching Skills ({userCompat.matching_skills.length}):
                    </span>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
                      {userCompat.matching_skills.map((s) => (
                        <span key={s} className="badge badge-green" style={{ fontSize: '0.7rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {userCompat.missing_skills && userCompat.missing_skills.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)' }}>
                      Skills to Learn ({userCompat.missing_skills.length}):
                    </span>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
                      {userCompat.missing_skills.map((s) => (
                        <span key={s} className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <Link to="/assessment" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  Retake Skills Assessment
                </Link>
              </div>
            ) : !isAuthenticated ? (
              <div className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
                <Brain size={32} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  See Your Compatibility
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Sign in and complete the skills assessment to view your tailored compatibility score for {career.title}.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Log In or Register
                </Link>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
                <Brain size={32} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Assessment Pending
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Take the 10-minute assessment to compute your custom match score against {career.title}.
                </p>
                <Link to="/assessment" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Take Assessment Now
                </Link>
              </div>
            )}

            {/* Compare with Other Careers Card */}
            <div className="card">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Compare Career Options
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Benchmark {career.title} side-by-side with other roles to evaluate difficulty, prerequisites, and roadmap stages.
              </p>
              <Link to="/compare" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Open Career Comparison
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetail;
