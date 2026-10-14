import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Layers,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav">
      <div className="container flex items-center justify-between" style={{ height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px var(--primary-glow)',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Career<span style={{ color: 'var(--primary)' }}>AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="flex items-center gap-6 nav-desktop">
          <Link
            to="/"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive('/') ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'var(--transition)',
            }}
          >
            Home
          </Link>
          <Link
            to="/about"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive('/about') ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'var(--transition)',
            }}
          >
            About
          </Link>
          <Link
            to="/careers"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive('/careers') ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'var(--transition)',
            }}
          >
            Explore Careers
          </Link>
          <Link
            to="/courses"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive('/courses') ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'var(--transition)',
            }}
          >
            Courses
          </Link>
          <Link
            to="/compare"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive('/compare') ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'var(--transition)',
            }}
          >
            Compare
          </Link>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="btn btn-secondary btn-sm nav-dashboard-btn">
                <Layers size={16} />
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline btn-sm">
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                className="flex items-center gap-2"
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  textDecoration: 'none'
                }}
                title="Profile & Settings"
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                title="Log Out"
                style={{ padding: '0.5rem' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', padding: '0.45rem' }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)' }}
          >
            About
          </Link>
          <Link
            to="/careers"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Explore Careers
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Courses
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Compare Careers
          </Link>
          {isAuthenticated && (
            <>
              <hr style={{ borderColor: 'var(--border-subtle)' }} />
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: 'var(--primary)' }}
              >
                Student Dashboard
              </Link>
              <Link
                to="/assessment"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: 'var(--text-primary)' }}
              >
                Skills Assessment
              </Link>
              <Link
                to="/progress"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: 'var(--text-primary)' }}
              >
                Progress & Milestones
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: 600, color: 'var(--text-primary)' }}
              >
                Profile & Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, color: 'var(--primary)' }}
                >
                  Admin Control Center
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
