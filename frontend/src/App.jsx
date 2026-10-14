import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import ExploreCareers from './pages/ExploreCareers';
import CareerDetail from './pages/CareerDetail';
import Courses from './pages/Courses';
import CareerComparison from './pages/CareerComparison';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword, { ResetPassword } from './pages/ForgotPassword';
import AssessmentResult from './pages/AssessmentResult';
import NotFound from './pages/NotFound';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import AdminDashboard from './pages/AdminDashboard';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Website Flow */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/careers" element={<ExploreCareers />} />
                  <Route path="/careers/:id" element={<CareerDetail />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/compare" element={<CareerComparison />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/assessment/result" element={<AssessmentResult />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Protected Student Dashboard Flow */}
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/assessment" element={<Assessment />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
