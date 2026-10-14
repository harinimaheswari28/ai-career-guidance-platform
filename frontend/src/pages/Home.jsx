import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Compass,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  ChevronDown,
  Star,
  BookOpen
} from 'lucide-react';
import api from '../services/api';

export const Home = () => {
  const [featuredCareers, setFeaturedCareers] = useState([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/careers');
        if (res.data && res.data.careers) {
          setFeaturedCareers(res.data.careers.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured careers:', err);
      } finally {
        setLoadingCareers(false);
      }
    };
    fetchFeatured();
  }, []);

  const faqs = [
    {
      q: 'How does the AI Career Guidance recommendation engine work?',
      a: 'The platform evaluates your answers across 8 assessment dimensions (technical, logical, communication, problem-solving, creativity, work preferences, work environment, and education) along with your declared skills and interests. It calculates multi-factor compatibility scores (0–100%) against industry-standard requirements for 12+ tech careers without relying on opaque black-box APIs.'
    },
    {
      q: 'Is this assessment scientifically certified?',
      a: 'This assessment is an algorithmic educational guidance tool designed specifically for Computer Science & Engineering students to organize their curriculum and skill development. It is not an officially certified clinical or psychiatric psychometric test.'
    },
    {
      q: 'Can I track my progress along the career learning roadmaps?',
      a: 'Yes! Every recommended career includes a 5 to 7-stage learning roadmap. You can mark individual milestones and practical projects as completed, and your progress percentage will be permanently saved to your profile.'
    },
    {
      q: 'Are the recommended courses free or paid?',
      a: 'We catalog verified courses from leading academic and industry providers like Harvard edX, MIT OpenCourseWare, freeCodeCamp, Meta, Google, and Coursera. Each course is clearly labeled with its provider, difficulty level, and whether it is free or paid.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'var(--bg-gradient-hero)',
          padding: '5rem 0 4.5rem 0',
          borderBottom: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '0.825rem',
              fontWeight: 700,
              color: 'var(--primary)',
              marginBottom: '1.5rem'
            }}
          >
            <Sparkles size={16} />
            <span>AI-Driven Guidance for Computer Science Engineers</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}
          >
            Discover Your Future Career
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto'
            }}
          >
            Navigate modern technology career paths with algorithmic assessment scoring, compatibility evaluations, personalized step-by-step learning roadmaps, and verified course recommendations.
          </p>

          <div className="flex items-center justify-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/careers" className="btn btn-secondary btn-lg">
              <Compass size={18} /> Explore 12+ Careers
            </Link>
          </div>

          {/* Highlights pills */}
          <div
            className="flex items-center justify-center gap-6"
            style={{ marginTop: '3rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
              <span>Rule-Based Compatibility Algorithm</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
              <span>Full-Stack Interactive Roadmaps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
              <span>Zero Black-Box AI Hallucinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-6" style={{ textAlign: 'center' }}>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>12+</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>Tech Career Paths</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From Full Stack to AI & Cloud</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>8</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>Assessment Domains</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aptitude, logic & preferences</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.02em' }}>60+</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>Roadmap Stages</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>With practical projects & tasks</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ec4899', letterSpacing: '-0.02em' }}>100%</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>Deterministic Rules</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Honest transparent calculations</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '5rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Step-by-Step Flow</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              How CareerAI Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Four structured steps to guide you from foundational learning to industry-ready mastery.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="card" style={{ position: 'relative' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: 'var(--primary-light)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem'
              }}>1</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Complete Assessment
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Answer questions spanning technical coding, logical reasoning, problem-solving, and work environment preferences.
              </p>
            </div>

            <div className="card" style={{ position: 'relative' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: 'var(--accent-light)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem'
              }}>2</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Receive Ranked Matches
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                The Python engine evaluates skill matches, missing prerequisites, and assigns compatibility scores from 0 to 100%.
              </p>
            </div>

            <div className="card" style={{ position: 'relative' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: 'var(--success-bg)', color: 'var(--success)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem'
              }}>3</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Follow Your Roadmap
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Execute step-by-step milestones with curated practical exercises, mini-projects, and a portfolio capstone.
              </p>
            </div>

            <div className="card" style={{ position: 'relative' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: '#fce7f3', color: '#db2777',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem'
              }}>4</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Track & Achieve
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Monitor your weekly activity, unlock earned milestone badges, and compare top career options side by side.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Career Paths */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Industry Disciplines</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Featured Career Paths
              </h2>
            </div>
            <Link to="/careers" className="btn btn-outline btn-sm">
              View All 12 Careers <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {featuredCareers.map((c) => (
              <div key={c.id} className="card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{c.category}</span>
                    <span className="badge badge-gray">{c.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {c.description.slice(0, 130)}...
                  </p>
                </div>
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Required Skills:
                    </span>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                      {(c.required_skills || []).slice(0, 3).map((sk) => (
                        <span key={sk} className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link to={`/careers/${c.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    View Career Roadmap <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Identified Sample Testimonials */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Student Experience</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Student Success Stories
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              (Representative college project user feedback)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center gap-1" style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>
                <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                "The skills assessment pinpointed my gap in relational databases, which was preventing me from landing full-stack internships. Following the Flask + MySQL roadmap stages gave me the exact portfolio project I needed."
              </p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Rahul Sharma</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Final Year CSE Student</div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-1" style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>
                <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                "I was torn between Data Science and Backend Engineering. The side-by-side career comparison clearly mapped out the required mathematics vs server engineering trade-offs, helping me confidently choose Cloud Engineering."
              </p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Priya Venkatesh</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3rd Year IT Undergraduate</div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-1" style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>
                <Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" /><Star size={16} fill="#f59e0b" />
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                "Unlike sites with generic marketing blurbs, every roadmap has real mini-projects and verified course links from Harvard and freeCodeCamp. It organized our entire final semester preparation."
              </p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Anand K.</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Software Engineering Junior</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Got Questions?</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: '1.25rem', cursor: 'pointer' }}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {faq.q}
                  </h4>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openFaq === idx ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      color: 'var(--primary)'
                    }}
                  />
                </div>
                {openFaq === idx && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          color: '#ffffff',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to Accelerate Your Tech Career?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
            Take the 10-minute skills assessment today and get your personalized career compatibility score and roadmap.
          </p>
          <Link to="/register" className="btn btn-secondary btn-lg" style={{ color: 'var(--primary)' }}>
            Start Your Skills Assessment <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
