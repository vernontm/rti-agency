import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'

import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Lazy load all pages for better performance
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))
const TrainingPage = lazy(() => import('./pages/TrainingPage'))
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const FormBuilderPage = lazy(() => import('./pages/admin/FormBuilderPage'))
const VideoManagementPage = lazy(() => import('./pages/admin/VideoManagementPage'))
const VideoSettingsPage = lazy(() => import('./pages/admin/VideoSettingsPage'))
const PendingUsersPage = lazy(() => import('./pages/admin/PendingUsersPage'))
const JobApplicationsPage = lazy(() => import('./pages/admin/JobApplicationsPage'))
const InboxPage = lazy(() => import('./pages/admin/InboxPage'))
const AdvisoriesManagementPage = lazy(() => import('./pages/admin/AdvisoriesManagementPage'))
const ArchivesPage = lazy(() => import('./pages/admin/ArchivesPage'))
const EducatorAreaPage = lazy(() => import('./pages/EducatorAreaPage'))
const AdvisoriesPage = lazy(() => import('./pages/AdvisoriesPage'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const JobsPage = lazy(() => import('./pages/JobsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

function App() {
  const { initialize, initialized } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/home" element={<LandingPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="training" element={<TrainingPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="educator-area" element={<EducatorAreaPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admin/forms" element={<FormBuilderPage />} />
            <Route path="admin/videos" element={<VideoManagementPage />} />
            <Route path="admin/video-settings" element={<VideoSettingsPage />} />
            <Route path="admin/pending-users" element={<PendingUsersPage />} />
            <Route path="admin/job-applications" element={<JobApplicationsPage />} />
            <Route path="admin/inbox" element={<InboxPage />} />
            <Route path="admin/file-manager" element={<AdvisoriesManagementPage />} />
            <Route path="admin/archives" element={<ArchivesPage />} />
            <Route path="documents" element={<AdvisoriesPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" toastOptions={{ style: { marginTop: '70px' } }} />
    </BrowserRouter>
  )
}

export default App
