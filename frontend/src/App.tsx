import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { MainLayoutContainer } from '@containers/MainLayoutContainer';
import { useAppInitialization } from '@hooks/business/useAppInitialization';
import { theme } from './theme';
import AppRoutes from './AppRoutes';

function App() {
  useAppInitialization();

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <MainLayoutContainer>
            <AppRoutes />
          </MainLayoutContainer>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
