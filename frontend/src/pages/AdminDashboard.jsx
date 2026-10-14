import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Brain,
  Compass,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useNotification();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'careers', 'questions', 'courses'

  // New Career Form State
  const [newCareerTitle, setNewCareerTitle] = useState('');
  const [newCareerCategory, setNewCareerCategory] = useState('Web & Software Engineering');
  const [newCareerDesc, setNewCareerDesc] = useState('');
  const [newCareerDiff, setNewCareerDiff] = useState('Intermediate');
  const [creatingCareer, setCreatingCareer] = useState(false);

  // New Course Form State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseProvider, setNewCourseProvider] = useState('');
  const [newCourseUrl, setNewCourseUrl] = useState('');
  const [creatingCourse, setCreatingCourse] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      if (statsRes.data) {
        setStats(statsRes.data.stats);
        setRecentAssessments(statsRes.data.recent_assessments || []);
      }
      const usersRes = await api.get('/admin/users');
      if (usersRes.data) {
        setUsersList(usersRes.data.users || []);
      }
    } catch (err) {
      console.error('Failed to load admin records:', err);
      toast.error('Admin authorization required.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data) {
        toast.success(res.data.message);
        setUsersList(usersList.map((u) => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      toast.error('Failed to change user role.');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`);
      if (res.data) {
        toast.success(res.data.message);
        setUsersList(usersList.map((u) => u.id === userId ? { ...u, is_active: !u.is_active } : u));
      }
    } catch (err) {
      toast.error('Failed to update user status.');
    }
  };

  const handleCreateCareer = async (e) => {
    e.preventDefault();
    if (!newCareerTitle || !newCareerDesc) {
      toast.warning('Please provide career title and description.');
      return;
    }

    setCreatingCareer(true);
    try {
      const res = await api.post('/admin/careers', {
        title: newCareerTitle,
        category: newCareerCategory,
        description: newCareerDesc,
        difficulty: newCareerDiff
      });
      if (res.data) {
        toast.success('Career path created successfully!');
        setNewCareerTitle('');
        setNewCareerDesc('');
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create career.');
    } finally {
      setCreatingCareer(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseProvider || !newCourseUrl) {
      toast.warning('Title, provider, and course URL are required.');
      return;
    }

    setCreatingCourse(true);
    try {
      const res = await api.post('/admin/courses', {
        title: newCourseTitle,
        provider: newCourseProvider,
        course_url: newCourseUrl
      });
      if (res.data) {
        toast.success('Course created successfully!');
        setNewCourseTitle('');
        setNewCourseProvider('');
        setNewCourseUrl('');
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to create course.');
    } finally {
      setCreatingCourse(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <Shield size={48} style={{ color: 'var(--danger)', margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Access Required</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Your current account does not possess administrator credentials to view this control panel.
        </p>
      </div>
    );
  }

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
        <p style={{ color: 'var(--text-secondary)' }}>Loading admin statistics and records...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Admin Title */}
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <Shield size={22} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
              System Administrator Center
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
            Platform Administration & Management
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          >
            Users ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('careers')}
            className={`btn ${activeTab === 'careers' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          >
            Add Career
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          >
            Add Course
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between" style={{ color: 'var(--primary)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Registered Users</span>
              <Users size={18} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
              {stats.total_users}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats.total_students} Students</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between" style={{ color: 'var(--accent)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Assessments Taken</span>
              <Brain size={18} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
              {stats.total_assessments}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluations recorded</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between" style={{ color: 'var(--success)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Active Careers</span>
              <Compass size={18} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
              {stats.total_careers}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Specializations cataloged</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between" style={{ color: '#ec4899' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Verified Courses</span>
              <BookOpen size={18} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
              {stats.total_courses}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Curriculum items</div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Recent Student Assessment Submissions
          </h2>

          {recentAssessments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No student submissions recorded yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Score</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Submission Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssessments.map((a) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {a.user_name}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                        {a.user_email}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge badge-purple">{a.score}%</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                        {a.completed_at ? a.completed_at.slice(0, 16).replace('T', ' ') : 'Just now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Registered Users & Role Management
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Current Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {u.name}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-gray'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleUserRole(u.id, u.role)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Make {u.role === 'admin' ? 'Student' : 'Admin'}
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`btn ${u.is_active ? 'btn-ghost' : 'btn-outline'} btn-sm`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'careers' && (
        <div className="card" style={{ padding: '2rem', maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Add New Career Path Entry
          </h2>

          <form onSubmit={handleCreateCareer}>
            <div className="form-group">
              <label className="form-label">Career Title</label>
              <input
                type="text"
                placeholder="e.g. Site Reliability Engineer"
                value={newCareerTitle}
                onChange={(e) => setNewCareerTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={newCareerCategory}
                onChange={(e) => setNewCareerCategory(e.target.value)}
                className="form-select"
              >
                <option value="Web & Software Engineering">Web & Software Engineering</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Security & Infrastructure">Security & Infrastructure</option>
                <option value="Mobile Engineering">Mobile Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                value={newCareerDiff}
                onChange={(e) => setNewCareerDiff(e.target.value)}
                className="form-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows={3}
                placeholder="Comprehensive overview of role..."
                value={newCareerDesc}
                onChange={(e) => setNewCareerDesc(e.target.value)}
                required
                className="form-textarea"
              />
            </div>

            <button type="submit" disabled={creatingCareer} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={16} /> {creatingCareer ? 'Creating Career...' : 'Create Career Entry'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="card" style={{ padding: '2rem', maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Add New Verified Course
          </h2>

          <form onSubmit={handleCreateCourse}>
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Distributed Systems & Microservices"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course Provider</label>
              <input
                type="text"
                placeholder="e.g. MIT OpenCourseWare"
                value={newCourseProvider}
                onChange={(e) => setNewCourseProvider(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course URL</label>
              <input
                type="url"
                placeholder="https://ocw.mit.edu/..."
                value={newCourseUrl}
                onChange={(e) => setNewCourseUrl(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <button type="submit" disabled={creatingCourse} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={16} /> {creatingCourse ? 'Adding Course...' : 'Add Verified Course'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
