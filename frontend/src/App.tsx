import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { HomePage } from './pages/HomePage';
import { AddSitePage } from './pages/AddSitePage';
import { EditSitePage } from './pages/EditSitePage';

function AppContent() {
  const location = useLocation();
  
  return (
    <>
      <HomePage />
      <Routes>
        <Route path='/add-site' element={<AddSitePage />} />
        <Route path='/edit-site/:id' element={<EditSitePage />} />
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
