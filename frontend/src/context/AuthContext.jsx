import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai_career_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ai_career_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify session on load
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('ai_career_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            setProfile(res.data.profile);
            localStorage.setItem('ai_career_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing stale credentials.');
          localStorage.removeItem('ai_career_token');
          localStorage.removeItem('ai_career_user');
          setUser(null);
          setProfile(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.token) {
      const { token: jwtToken, user: userData, profile: profileData } = res.data;
      localStorage.setItem('ai_career_token', jwtToken);
      localStorage.setItem('ai_career_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      setProfile(profileData);
      return res.data;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data && res.data.token) {
      const { token: jwtToken, user: userData, profile: profileData } = res.data;
      localStorage.setItem('ai_career_token', jwtToken);
      localStorage.setItem('ai_career_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      setProfile(profileData);
      return res.data;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('ai_career_token');
      localStorage.removeItem('ai_career_user');
      setToken(null);
      setUser(null);
      setProfile(null);
    }
  };

  const updateUserState = (newUserData, newProfileData) => {
    if (newUserData) {
      setUser(newUserData);
      localStorage.setItem('ai_career_user', JSON.stringify(newUserData));
    }
    if (newProfileData) {
      setProfile(newProfileData);
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin,
        login,
        register,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
