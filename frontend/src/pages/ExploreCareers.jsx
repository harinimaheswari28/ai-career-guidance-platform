import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Compass, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import EmptyState from '../components/EmptyState';

export const ExploreCareers = () => {
  const [careers, setCareers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedCareerIds, setSavedCareerIds] = useState(new Set());

  const { isAuthenticated } = useAuth();
  const { toast } = useNotification();

  useEffect(() => {
    fetchCareers();
    fetchCategories();
    if (isAuthenticated) {
      fetchSavedCareers();
    }
  }, [selectedCategory, selectedDifficulty]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/careers/categories');
      if (res.data && res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;

      const res = await api.get('/careers', { params });
      if (res.data && res.data.careers) {
        setCareers(res.data.careers);
      }
    } catch (err) {
      console.error('Failed to fetch careers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCareers = async () => {
    try {
      const res = await api.get('/careers/saved');
      if (res.data && res.data.saved_careers) {
        setSavedCareerIds(new Set(res.data.saved_careers.map((sc) => sc.career_id)));
      }
    } catch (err) {
      console.error('Failed to fetch saved careers:', err);
    }
  };

  const handleToggleSave = async (careerId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please log in to save career paths to your dashboard.');
      return;
    }

    try {
      const res = await api.post(`/careers/save/${careerId}`);
      if (res.data) {
        const isSaved = res.data.is_saved;
        setSavedCareerIds((prev) => {
          const next = new Set(prev);
          if (isSaved) next.add(careerId);
          else next.delete(careerId);
          return next;
        });
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to update saved career.');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCareers();
  };

  return (
    <div style={{ padding: '3rem 0', background: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Career Catalog</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Explore Technology Careers
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Browse curated Computer Science specializations, view required skills, inspect roadmap stages, and bookmark paths to your dashboard.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div
          className="card"
          style={{
            marginBottom: '2.5rem',
            padding: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            justifyContent: 'space-between',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 300px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search by career title, keywords, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search
                size={18}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
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
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Career Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{
              width: '40px', height: '40px',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading career catalog...</p>
          </div>
        ) : careers.length === 0 ? (
          <EmptyState
            title="No Careers Matched Your Query"
            description="Try clearing your search terms or selecting a different category filter."
            actionText="Reset Filters"
            onAction={() => { setSearch(''); setSelectedCategory(''); setSelectedDifficulty(''); }}
          />
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {careers.map((career) => {
              const isSaved = savedCareerIds.has(career.id);
              return (
                <div key={career.id} className="card flex flex-col justify-between" style={{ position: 'relative' }}>
                  <div>
                    {/* Header Badges & Save Toggle */}
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.85rem' }}>
                      <span className="badge badge-purple">{career.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-gray">{career.difficulty}</span>
                        <button
                          onClick={(e) => handleToggleSave(career.id, e)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isSaved ? 'var(--primary)' : 'var(--text-muted)',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title={isSaved ? 'Remove from saved' : 'Save career'}
                        >
                          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {career.title}
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {career.description.slice(0, 140)}...
                    </p>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Key Skills:
                      </span>
                      <div className="flex" style={{ flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                        {(career.required_skills || []).slice(0, 4).map((sk) => (
                          <span key={sk} className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <strong>Growth Outlook:</strong> {career.growth_outlook}
                    </div>
                    <Link to={`/careers/${career.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                      View Full Path & Roadmap <ArrowRight size={14} />
                    </Link>
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

export default ExploreCareers;
