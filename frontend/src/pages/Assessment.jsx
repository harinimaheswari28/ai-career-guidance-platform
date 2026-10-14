import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const { isAuthenticated } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/assessments/questions');
      if (res.data && res.data.questions) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      toast.error('Unable to load assessment questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: optionId
    }));
  };

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleNext = () => {
    if (!answers[String(currentQuestion.id)]) {
      toast.warning('Please select an option before moving to the next question.');
      return;
    }
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsReviewMode(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to submit your assessment and save recommendations.');
      navigate('/login');
      return;
    }

    if (answeredCount < totalQuestions) {
      toast.error(`Please answer all ${totalQuestions} questions before submitting.`);
      setIsReviewMode(false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/assessments/submit', { answers });
      if (res.data && res.data.result) {
        toast.success('Assessment scored successfully!');
        navigate('/assessment/result', { state: { result: res.data.result } });
      }
    } catch (err) {
      toast.error('Failed to submit assessment answers.');
    } finally {
      setSubmitting(false);
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
        <p style={{ color: 'var(--text-secondary)' }}>Loading interactive skills assessment...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>No questions currently active</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Please contact platform administrator.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 1rem 5rem 1rem', background: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Assessment Disclaimer Banner */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          <HelpCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>
            <strong>Educational Guidance Tool:</strong> This multi-factor assessment evaluates student technical aptitude, logical reasoning, and preferences to assist in academic and career roadmap planning. It is not an officially certified psychological test.
          </span>
        </div>

        {/* Progress Header */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <div>
              <span className="badge badge-purple" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {isReviewMode ? 'Review Mode' : `Domain: ${currentQuestion.section.replace('_', ' ')}`}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                Skills & Aptitude Assessment
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                {answeredCount} / {totalQuestions} Answered ({progressPercent}%)
              </span>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Question View or Review Screen */}
        {!isReviewMode ? (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span style={{ textTransform: 'capitalize' }}>{currentQuestion.section.replace('_', ' ')} Section</span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '2rem' }}>
              {currentQuestion.question_text}
            </h3>

            {/* Selectable Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[String(currentQuestion.id)] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    style={{
                      padding: '1.15rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0
                      }}
                    >
                      {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />}
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)' }}>
                      {opt.option_text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Previous and Next Navigation */}
            <div className="flex items-center justify-between" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="btn btn-secondary"
                style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <button
                onClick={handleNext}
                className="btn btn-primary"
              >
                {currentIndex === totalQuestions - 1 ? 'Review & Submit' : 'Next Question'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Review Mode View */
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Review Your Answers
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Ensure you are satisfied with your selected choices before calculating compatibility.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {questions.map((q, idx) => {
                const chosenOptId = answers[String(q.id)];
                const chosenOpt = q.options.find((o) => o.id === chosenOptId);
                return (
                  <div
                    key={q.id}
                    onClick={() => { setCurrentIndex(idx); setIsReviewMode(false); }}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Question {idx + 1} ({q.section})
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {chosenOpt ? chosenOpt.option_text : <span style={{ color: 'var(--danger)' }}>Not Answered</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                      Edit
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsReviewMode(false)}
                className="btn btn-secondary"
              >
                <ArrowLeft size={16} /> Back to Questions
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting || answeredCount < totalQuestions}
                className="btn btn-primary btn-lg"
              >
                {submitting ? 'Calculating Compatibility...' : 'Submit Assessment'} <Sparkles size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
