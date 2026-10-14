import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-ghost btn-sm ${className}`}
      style={{
        borderRadius: 'var(--radius-full)',
        padding: '0.45rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle color theme"
    >
      {isDark ? (
        <Sun size={18} style={{ color: '#f59e0b' }} />
      ) : (
        <Moon size={18} style={{ color: '#6366f1' }} />
      )}
    </button>
  );
};

export default ThemeToggle;
