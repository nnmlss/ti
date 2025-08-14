import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePageContainer } from './containers/HomePageContainer';
import { AddSitePage } from './pages/AddSitePage';
import { EditSitePage } from './pages/EditSitePage';
import { SiteDetailPage } from './pages/SiteDetailPage';
import { ActivationRequest } from './pages/ActivationRequest';
import { CompleteActivation } from './pages/CompleteActivation';
import { AdminCreateAccounts } from './pages/AdminCreateAccounts';
import { Login } from './pages/Login';
import { GlobalErrorNotification } from './components/ui/GlobalErrorNotification';
import { NotFoundHandler } from './components/ui/NotFoundHandler';

export default function AppRoutes() {
  const location = useLocation();

  // Define valid routes
  const validRoutes = ['/', '/add-site', '/edit-site', '/site'];
  const isValidRoute = validRoutes.some((route) => {
    if (route === '/') return location.pathname === '/';
    return location.pathname.startsWith(route);
  });

  return (
    <>
      {/* HomePage only rendered for valid routes */}
      {isValidRoute && <HomePageContainer />}

      {/* Modal Routes - render on top of HomePage or standalone for auth/404 */}
      <Routes>
        <Route path='/' element={null} />
        <Route path='/add-site' element={<AddSitePage />} />
        <Route path='/edit-site/:id' element={<EditSitePage />} />
        <Route path='/site/:id' element={<SiteDetailPage />} />
        
        {/* Auth Routes - standalone pages */}
        <Route path='/activate' element={<ActivationRequest />} />
        <Route path='/activate/:token' element={<CompleteActivation />} />
        <Route path='/adm1n' element={<Login />} />
        <Route path='/admin/create-accounts' element={<AdminCreateAccounts />} />
        
        <Route path='*' element={<NotFoundHandler />} />
      </Routes>

      {/* Global Error Notification */}
      <GlobalErrorNotification />
    </>
  );
}
