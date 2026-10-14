import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Brain,
  Compass,
  Map,
  BookOpen,
  GitCompare,
  TrendingUp,
  User,
  Shield,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skills Assessment', path: '/assessment', icon: Brain },
    { name: 'Explore Careers', path: '/careers', icon: Compass },
    { name: 'Course Library', path: '/courses', icon: BookOpen },
    { name: 'Career Comparison', path: '/compare', icon: GitCompare },
    { name: 'Progress & Badges', path: '/progress', icon: TrendingUp },
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Control', path: '/admin', icon: Shield });
  }

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        flexShrink: 0,
      }}
    >
      <div style={{ marginBottom: '1.25rem', paddingLeft: '0.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          Student Portal
        </p>
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                textDecoration: 'none',
                transition: 'var(--transition)',
              })}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </NavLink>
          );
        })}
      </nav>

      {/* User profile footer pill */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
          }}
        >
          <div className="flex items-center gap-2" style={{ overflow: 'hidden' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Student'}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                {isAdmin ? 'Administrator' : 'Student'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.3rem',
            }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
