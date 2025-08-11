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
    h1: {
      fontFamily: 'comfortaalight, sans-serif',
    },
    h2: {
      fontFamily: 'comfortaalight, sans-serif',
    },
    h3: {
      fontFamily: 'comfortaalight, sans-serif',
    },
    h4: {
      fontFamily: 'comfortaalight, sans-serif',
    },
    h5: {
      fontFamily: 'comfortaalight, sans-serif',
    },
    h6: {
      fontFamily: 'comfortaalight, sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            '&.font-bold, &.font-strong': {
              fontFamily: 'comfortaabold, sans-serif',
            },
          },
          '&.MuiTypography-body2': {
            '&.font-bold, &.font-strong': {
              fontFamily: 'comfortaabold, sans-serif',
            },
          },
        },
      },
    },
  },
});
