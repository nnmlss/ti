import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRouteContainer as ProtectedRoute } from './containers/ProtectedRouteContainer';
import { GlobalErrorNotificationContainer as GlobalErrorNotification } from './containers/GlobalErrorNotificationContainer';
import { NotFoundHandler } from './components/ui/NotFoundHandler';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Lazy loaded page components
// Public pages - highest priority, load together
const HomePage = lazy(() => import('./containers/HomePageContainer').then(module => ({ default: module.HomePageContainer })));
const SiteDetailPage = lazy(() => import('./containers/SiteDetailPageContainer').then(module => ({ default: module.SiteDetailPageContainer })));

// Site management - authenticated users only
const AddSitePage = lazy(() => import('./containers/AddSitePageContainer').then(module => ({ default: module.AddSitePageContainer })));
const EditSitePage = lazy(() => import('./containers/EditSitePageContainer').then(module => ({ default: module.EditSitePageContainer })));

// Authentication flows - separate chunk
const Login = lazy(() => import('./containers/LoginContainer').then(module => ({ default: module.LoginContainer })));
const ActivationRequest = lazy(() => import('./containers/ActivationRequestContainer').then(module => ({ default: module.ActivationRequestContainer })));
const CompleteActivation = lazy(() => import('./containers/CompleteActivationContainer').then(module => ({ default: module.CompleteActivationContainer })));

// Admin pages - separate chunk for super admins only
const AdminCreateAccounts = lazy(() => import('./containers/AdminCreateAccountsContainer').then(module => ({ default: module.AdminCreateAccountsContainer })));
const Profile = lazy(() => import('./containers/ProfileContainer').then(module => ({ default: module.ProfileContainer })));

// Loading fallback component
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress />
  </Box>
);

export default function AppRoutes() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
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
          <Route path='/парапланер-старт/:slug' element={<SiteDetailPage />} />

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
      </Suspense>

      {/* Global Error Notification */}
      <GlobalErrorNotification />
    </>
  );
}
