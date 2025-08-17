import { Routes, Route } from 'react-router-dom';
import { HomePageContainer as HomePage } from './containers/HomePageContainer';
import { AddSitePageContainer as AddSitePage } from './containers/AddSitePageContainer';
import { EditSitePageContainer as EditSitePage } from './containers/EditSitePageContainer';
import { SiteDetailPageContainer as SiteDetailPage } from './containers/SiteDetailPageContainer';
import { ActivationRequestContainer as ActivationRequest } from './containers/ActivationRequestContainer';
import { CompleteActivationContainer as CompleteActivation } from './containers/CompleteActivationContainer';
import { AdminCreateAccountsContainer as AdminCreateAccounts } from './containers/AdminCreateAccountsContainer';
import { LoginContainer as Login } from './containers/LoginContainer';
import { ProfileContainer as Profile } from './containers/ProfileContainer';
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
