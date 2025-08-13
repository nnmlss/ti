import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePageContainer } from './containers/HomePageContainer';
import { AddSitePage } from './pages/AddSitePage';
import { EditSitePage } from './pages/EditSitePage';
import { SiteDetailPage } from './pages/SiteDetailPage';
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

      {/* Modal Routes - render on top of HomePage or standalone for 404 */}
      <Routes>
        <Route path='/' element={null} />
        <Route path='/add-site' element={<AddSitePage />} />
        <Route path='/edit-site/:id' element={<EditSitePage />} />
        <Route path='/site/:id' element={<SiteDetailPage />} />
        <Route path='*' element={<NotFoundHandler />} />
      </Routes>

      {/* Global Error Notification */}
      <GlobalErrorNotification />
    </>
  );
}
