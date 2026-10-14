import React from 'react';
import { Sparkles, Target, Compass, Award, Database, Code, CheckCircle2 } from 'lucide-react';

export const About = () => {
  return (
    <div style={{ padding: '4rem 0', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Project Mission</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            About the AI Career Guidance Platform
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto' }}>
            An engineering initiative designed to bridge the gap between academic Computer Science curricula and industry job role requirements.
          </p>
        </div>

        {/* Mission & Objectives Cards */}
        <div className="grid grid-cols-2 gap-8" style={{ marginBottom: '4rem' }}>
          <div className="card">
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'var(--primary-light)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'
            }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Project Mission
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Engineering students often struggle with choice overload when deciding between emerging fields such as Cloud Engineering, Machine Learning, Full Stack, and Cybersecurity. Our mission is to provide an objective, data-informed guidance platform that replaces guesswork with transparent matching algorithms and structured, actionable roadmaps.
            </p>
          </div>

          <div className="card">
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'var(--accent-light)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'
            }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Core Objectives
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                <span>Evaluate multi-dimensional aptitude across 8 specialized domains.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                <span>Provide rule-based matching with transparent rationale and skill gaps.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                <span>Deliver structured progressive roadmaps with practical capstones.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                <span>Maintain strict student data security and role-based controls.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technology Architecture */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Full-Stack Technical Architecture
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>
                <Code size={18} /> Frontend Client
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Built with React 18 and Vite for rapid development. Uses React Router for single-page routing, Axios for API calls, Recharts for dashboard analytics, and Lucide React for consistent icons.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: 'var(--accent)', fontWeight: 700 }}>
                <Sparkles size={18} /> Backend & Recommendation Engine
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Powered by Python Flask. Uses Flask-JWT-Extended for token authentication, secure password hashing (PBKDF2), and a multi-factor recommendation engine written in pure Python.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: 'var(--success)', fontWeight: 700 }}>
                <Database size={18} /> Relational Database
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Normalized relational schema designed for MySQL 8.0 with foreign key cascades, unique constraints, and indexed lookups. Managed through Flask-SQLAlchemy ORM.
              </p>
            </div>
          </div>
        </div>

        {/* Guidance Philosophy */}
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Educational Guidance Philosophy
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Our recommendation engine calculates compatibility scores based on actual skill proficiencies, assessment section performances, and declared goals. We deliberately avoid black-box external AI hallucinations to ensure every recommendation is verifiable, predictable, and fully explainable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
