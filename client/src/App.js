import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Interview from './pages/Interview';
import Report from './pages/Report';
import History from './pages/History';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Compiler from './pages/Compiler';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import QuestionBank from './pages/QuestionBank';
import AvatarInterview from './pages/AvatarInterview';
import Leaderboard from './pages/Leaderboard';
import SharedReport from './pages/SharedReport';
import PublicProfile from './pages/PublicProfile';
import CompanyReviews from './pages/CompanyReviews';
import Forum from './pages/Forum';
import StudyGroups from './pages/StudyGroups';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
      <span className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading...</span>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/compiler" element={<Compiler />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/shared/:sessionId" element={<SharedReport />} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="/reviews" element={<CompanyReviews />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/questions" element={<QuestionBank />} />
        <Route path="/history" element={<History />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
        <Route path="/study-rooms" element={<StudyGroups />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/avatar-interview" element={<ProtectedRoute><AvatarInterview /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;