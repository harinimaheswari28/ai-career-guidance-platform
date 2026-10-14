import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data) {
        setMessage(res.data.message);
        if (res.data.reset_token) {
          setResetToken(res.data.reset_token);
        }
        toast.success('Reset token generated.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to process password reset.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4rem 1rem', background: 'var(--bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Reset Password
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Enter your email to receive a password reset authorization token.
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            <p style={{ fontWeight: 600 }}>{message}</p>
            {resetToken && (
              <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generated Reset Token:</span>
                <code style={{ display: 'block', fontSize: '0.8rem', wordBreak: 'break-all', marginTop: '0.2rem', color: 'var(--primary)' }}>
                  {resetToken}
                </code>
                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  Proceed to Reset Password
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            {loading ? 'Processing...' : 'Send Reset Instructions'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ResetPassword = () => {
  const [token, setToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || '';
  });
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useNotification();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        new_password: newPassword
      });
      if (res.data) {
        toast.success(res.data.message);
        navigate('/login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Password reset failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4rem 1rem', background: 'var(--bg-primary)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '1rem' }}>
          Set New Password
        </h1>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="form-group">
            <label className="form-label">Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste security token"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
