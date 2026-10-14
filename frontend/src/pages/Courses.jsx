import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Star,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import EmptyState from '../components/EmptyState';

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedCourseIds, setSavedCourseIds] = useState(new Set());

  const { isAuthenticated } = useAuth();
  const { toast } = useNotification();

  useEffect(() => {
    fetchCourses();
    if (isAuthenticated) {
      fetchSavedCourses();
    }
  }, [selectedCategory, selectedDifficulty, freeOnly]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (freeOnly) params.is_free = true;

      const res = await api.get('/courses', { params });
      if (res.data && res.data.courses) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCourses = async () => {
    try {
      const res = await api.get('/courses/saved');
      if (res.data && res.data.saved_courses) {
        setSavedCourseIds(new Set(res.data.saved_courses.map((sc) => sc.course_id)));
      }
    } catch (err) {
      console.error('Failed to fetch saved courses:', err);
    }
  };

  const handleToggleSave = async (courseId) => {
    if (!isAuthenticated) {
      toast.info('Please log in to bookmark courses to your dashboard.');
      return;
    }

    try {
      const res = await api.post(`/courses/save/${courseId}`);
      if (res.data) {
        const isSaved = res.data.is_saved;
        setSavedCourseIds((prev) => {
          const next = new Set(prev);
          if (isSaved) next.add(courseId);
          else next.delete(courseId);
          return next;
        });
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update course bookmark.');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const categories = [
    'Web & Software Engineering',
    'Computer Science',
    'Data & Analytics',
    'Artificial Intelligence',
    'Security & Infrastructure',
    'Cloud & DevOps',
    'Design & Product',
    'Mobile Engineering',
    'Quality Assurance & Testing'
  ];

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Verified Curriculum</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Recommended Course Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Curated, verified educational courses from Harvard, edX, freeCodeCamp, Meta, Google, and Coursera to fulfill your roadmap skills.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div
          className="card"
          style={{
            marginBottom: '2.5rem',
            padding: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            justifyContent: 'space-between'
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 300px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search courses by title, topic, or provider..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Free Only</span>
            </label>
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{
              width: '40px', height: '40px',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading verified courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            title="No Courses Found"
            description="Try adjusting your filters or search terms."
            actionText="Reset Filters"
            onAction={() => { setSearch(''); setSelectedCategory(''); setSelectedDifficulty(''); setFreeOnly(false); }}
          />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {courses.map((course) => {
              const isSaved = savedCourseIds.has(course.id);
              return (
                <div key={course.id} className="card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {course.provider}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${course.is_free ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: '0.7rem' }}>
                          {course.is_free ? 'Free' : 'Verified'}
                        </span>
                        <button
                          onClick={() => handleToggleSave(course.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isSaved ? 'var(--primary)' : 'var(--text-muted)',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={isSaved ? 'Remove from bookmarks' : 'Bookmark course'}
                        >
                          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                      {course.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {course.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: '#f59e0b', fontWeight: 600 }}>
                        <Star size={14} fill="#f59e0b" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <a
                      href={course.course_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                    >
                      Enroll on Provider Platform <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
