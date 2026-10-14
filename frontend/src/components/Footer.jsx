import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ShieldCheck, Award, Heart, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '4rem 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '3rem' }}>
          {/* Brand & Mission */}
          <div style={{ gridColumn: 'span 1' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Career<span style={{ color: 'var(--primary)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              An algorithmic career guidance platform designed for Computer Science and Engineering students. Discover strengths, explore industry career paths, and follow curated learning roadmaps.
            </p>
            <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <span>Full-Stack Engineering Project</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/careers" style={{ transition: 'var(--transition)' }}>Explore 12+ Careers</Link></li>
              <li><Link to="/assessment" style={{ transition: 'var(--transition)' }}>Skills Assessment</Link></li>
              <li><Link to="/courses" style={{ transition: 'var(--transition)' }}>Verified Courses</Link></li>
              <li><Link to="/compare" style={{ transition: 'var(--transition)' }}>Career Comparison</Link></li>
              <li><Link to="/dashboard" style={{ transition: 'var(--transition)' }}>Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Academic & Project Info */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              College Project
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/about">Project Mission & Objectives</Link></li>
              <li><a href="#how-it-works">Recommendation Engine Rules</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><span>React 18 + Flask + MySQL</span></li>
              <li><span>REST API Architecture</span></li>
            </ul>
          </div>

          {/* Contact & Disclaimer */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Important Notice
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Scores and career compatibility percentages are educational estimates provided for personal guidance and course planning. They do not constitute employment guarantees or clinical psychometric tests.
            </p>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>support@aicareer.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} AI Career Guidance Platform. Built for Computer Science & Engineering students.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by React, Python Flask & MySQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
