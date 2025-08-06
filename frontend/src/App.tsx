import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { HomePage } from './pages/HomePage';
import { AddSitePage } from './pages/AddSitePage';
import { EditSitePage } from './pages/EditSitePage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/add-site' element={<AddSitePage />} />
          <Route path='/edit-site/:id' element={<EditSitePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
