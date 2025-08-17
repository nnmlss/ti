import { Routes, Route } from 'react-router-dom';
import { HomePage } from './components/pages/HomePage';
import { AddSitePage } from './components/pages/AddSitePage';
import { EditSitePage } from './components/pages/EditSitePage';
import { SiteDetailPage } from './components/pages/SiteDetailPage';
import { ActivationRequest } from './components/pages/ActivationRequest';
import { CompleteActivation } from './components/pages/CompleteActivation';
import { AdminCreateAccounts } from './components/pages/AdminCreateAccounts';
import { Login } from './components/pages/Login';
import { Profile } from './components/pages/Profile';
import { ProtectedRouteContainer as ProtectedRoute } from './containers/ProtectedRouteContainer';
import { GlobalErrorNotificationContainer as GlobalErrorNotification } from './containers/GlobalErrorNotificationContainer';
import { NotFoundHandler } from './components/ui/NotFoundHandler';

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/add-site'
          element={
            <ProtectedRoute>
              <AddSitePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/edit-site/:id'
          element={
            <ProtectedRoute>
              <EditSitePage />
            </ProtectedRoute>
          }
        />
        <Route path='/site/:id' element={<SiteDetailPage />} />
        <Route path='/sites/:slug' element={<SiteDetailPage />} />

        {/* Auth Routes - standalone pages */}
        <Route path='/activate' element={<ActivationRequest />} />
        <Route path='/activate/:token' element={<CompleteActivation />} />
        <Route path='/adm1n' element={<Login />} />
        <Route
          path='/edit-profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/add-account'
          element={
            <ProtectedRoute requireSuperAdmin>
              <AdminCreateAccounts />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFoundHandler />} />
      </Routes>

      {/* Global Error Notification */}
      <GlobalErrorNotification />
    </>
  );
}
