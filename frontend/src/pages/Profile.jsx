import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Compass,
  Lock,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Save,
  Moon,
  Sun,
  ShieldAlert
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const Profile = () => {
  const { user, updateUserState, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useNotification();

  const [profileData, setProfileData] = useState({
    name: '',
    education_level: '',
    interests: '',
    bio: '',
    preferred_work_env: 'Remote & Hybrid',
    career_goals: '',
    notification_email: true,
    notification_in_app: true,
    theme_preference: 'light'
  });
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Account deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/profile');
      if (res.data) {
        const p = res.data.profile || {};
        setProfileData({
          name: res.data.user?.name || '',
          education_level: p.education_level || "Bachelor's in Computer Science",
          interests: p.interests || '',
          bio: p.bio || '',
          preferred_work_env: p.preferred_work_env || 'Remote & Hybrid',
          career_goals: p.career_goals || '',
          notification_email: p.notification_email !== false,
          notification_in_app: p.notification_in_app !== false,
          theme_preference: p.theme_preference || 'light'
        });
        setSkills(res.data.skills || []);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      toast.error('Unable to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/profile', profileData);
      if (res.data) {
        toast.success('Profile updated successfully!');
        updateUserState(res.data.user, res.data.profile);
      }
    } catch (err) {
      toast.error('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const res = await api.post('/profile/skills', {
        skill_name: newSkillName.trim(),
        proficiency_level: newSkillProficiency
      });
      if (res.data && res.data.skill) {
        toast.success(res.data.message);
        setSkills([...skills, res.data.skill]);
        setNewSkillName('');
      }
    } catch (err) {
      toast.error('Failed to add skill.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/profile/skills/${skillId}`);
      toast.success('Skill removed.');
      setSkills(skills.filter((s) => s.skill_id !== skillId));
    } catch (err) {
      toast.error('Failed to delete skill.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setChangingPass(true);
    try {
      const res = await api.post('/profile/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      if (res.data) {
        toast.success(res.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password.';
      toast.error(msg);
    } finally {
      setChangingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await api.delete('/profile/account');
      toast.success('Your account has been deleted.');
      logout();
    } catch (err) {
      toast.error('Failed to delete account.');
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

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
        <p style={{ color: 'var(--text-secondary)' }}>Loading your profile data...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Profile & Account Settings
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Manage your personal information, technical skills, notification preferences, and security.
        </p>
      </div>

      {/* Main Profile Information Form */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Personal Details & Education
        </h2>

        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-Only)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="form-input"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Education Level / Degree Program</label>
              <input
                type="text"
                value={profileData.education_level}
                onChange={(e) => setProfileData({ ...profileData, education_level: e.target.value })}
                placeholder="e.g. B.Tech Computer Science (3rd Year)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Work Environment</label>
              <select
                value={profileData.preferred_work_env}
                onChange={(e) => setProfileData({ ...profileData, preferred_work_env: e.target.value })}
                className="form-select"
              >
                <option value="Remote & Hybrid">Remote & Hybrid</option>
                <option value="Fully Remote">Fully Remote</option>
                <option value="On-Site Tech Campus">On-Site Tech Campus</option>
                <option value="Fast-Paced Startup">Fast-Paced Startup</option>
                <option value="Enterprise / Research Lab">Enterprise / Research Lab</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Tech Interests & Passions</label>
            <input
              type="text"
              value={profileData.interests}
              onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
              placeholder="e.g. Full Stack Web Development, Cloud Architectures, Machine Learning"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Bio / Summary</label>
            <textarea
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Tell us a little bit about your engineering interests and aspirations..."
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Career Goals</label>
            <textarea
              rows={2}
              value={profileData.career_goals}
              onChange={(e) => setProfileData({ ...profileData, career_goals: e.target.value })}
              placeholder="What role or dream engineering milestone do you want to achieve?"
              className="form-textarea"
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Details'}
          </button>
        </form>
      </div>

      {/* Technical Skills Inventory */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Technical & Soft Skills Portfolio
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Your declared skills are utilized directly by the Python recommendation engine to compute career match indexes.
        </p>

        {/* Existing Skills Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
          {skills.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No skills added yet. Add your technologies below to boost recommendation accuracy!
            </p>
          ) : (
            skills.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.skill_name}</span>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{s.proficiency_level}</span>
                <button
                  onClick={() => handleDeleteSkill(s.skill_id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.1rem'
                  }}
                  title="Remove skill"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">Add Technology / Skill</label>
            <input
              type="text"
              placeholder="e.g. React.js, Docker, MySQL, Python"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ width: '180px' }}>
            <label className="form-label">Proficiency</label>
            <select
              value={newSkillProficiency}
              onChange={(e) => setNewSkillProficiency(e.target.value)}
              className="form-select"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary" style={{ height: '42px' }}>
            <Plus size={16} /> Add Skill
          </button>
        </form>
      </div>

      {/* Security & Password */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Security & Password Change
        </h2>

        <form onSubmit={handleChangePassword} style={{ maxWidth: '480px' }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
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

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={changingPass} className="btn btn-secondary">
            <Lock size={16} /> {changingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="card" style={{ padding: '2rem', border: '1px solid var(--danger)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--danger)', marginBottom: '0.5rem' }}>
          Danger Zone
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Permanently delete your user account, stored assessment attempts, and roadmap progress from the database. This action is irreversible.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn btn-danger btn-sm"
        >
          <Trash2 size={16} /> Delete Account
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Confirm Account Deletion</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete your account? All assessment history and bookmarks will be erased immediately.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="btn btn-danger btn-sm"
              >
                {deletingAccount ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
