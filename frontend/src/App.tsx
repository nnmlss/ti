import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { HomePage } from './pages/HomePage';
import { AddSitePage } from './pages/AddSitePage';
import { EditSitePage } from './pages/EditSitePage';
import { SiteDetailPage } from './pages/SiteDetailPage';

function AppContent() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/list' element={<HomePage />} />
        <Route path='/add-site' element={<HomePage />} />
        <Route path='/edit-site/:id' element={<HomePage />} />
        <Route path='/site/:id' element={<HomePage />} />
      </Routes>
      
      {/* Modal Routes - render on top of HomePage */}
      <Routes>
        <Route path='/add-site' element={<AddSitePage />} />
        <Route path='/edit-site/:id' element={<EditSitePage />} />
        <Route path='/site/:id' element={<SiteDetailPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
