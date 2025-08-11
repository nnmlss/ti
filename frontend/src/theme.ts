import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default MUI primary blue
      light: '#48486A', // Your custom primary light color
    },
    secondary: {
      main: '#f50057', // Default MUI secondary pink
    },
  },
  typography: {
    fontFamily: 'comfortaa, sans-serif',
  },
});
