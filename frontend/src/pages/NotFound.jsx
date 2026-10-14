import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      style={{
        padding: '6rem 1rem',
        textAlign: 'center',
        background: 'var(--bg-primary)',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Compass size={32} />
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        404
      </h1>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.75rem 0' }}>
        Page Not Found
      </h2>

      <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
        The career pathway or dashboard page you were looking for doesn't exist or has been relocated.
      </p>

      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
