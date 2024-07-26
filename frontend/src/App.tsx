import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircleProvider } from './CircleContext';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MyPage from './pages/MyPage';
import UpdateEmailPage from './pages/UpdateEmailPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import CreateEventPage from './pages/CreateEventPage';
import CreateCirclePage from './pages/circle/CreateCirclePage';
import JoinCirclePage from './pages/circle/JoinCirclePage';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import CircleManagementPage from './pages/CircleManagementPage'
import MyEventsPage from './pages/MyEventsPage';
import EditEventPage from './pages/EditEventPage';
import EventDetailsPage from './pages/event/EventDetailsPage';
import EditProfilePage from './pages/EditProfilePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CircleProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
            <Route path="/update-email" element={<ProtectedRoute><UpdateEmailPage /></ProtectedRoute>} />
            <Route path="/update-password" element={<ProtectedRoute><UpdatePasswordPage /></ProtectedRoute>} />
            <Route path="/email-verification" element={<EmailVerificationPage />} />
            <Route path="/event/:eventId" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
            <Route path="/create-event" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
            <Route path="/create-circle" element={<CreateCirclePage />} />
            <Route path="/edit-event/:eventId" element={<ProtectedRoute><EditEventPage /></ProtectedRoute>} />
            <Route path="/join-circle" element={<ProtectedRoute><JoinCirclePage /></ProtectedRoute>} />
            <Route path="/my-events" element={<ProtectedRoute><MyEventsPage /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/edit-event/:eventId" element={<ProtectedRoute><EditEventPage /></ProtectedRoute>} />
            <Route path="/circle-management/:circleId" element={
              <ProtectedRoute requiredRole="admin">
                <CircleManagementPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </CircleProvider>
    </AuthProvider>
  );
};

export default App;