import { createTheme } from '@mui/material/styles';

const baseTheme = createTheme();

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
      fontSize: '2.5rem',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '2rem',
      },
    },
    h2: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '2rem',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '1.75rem',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '1.5rem',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '1.25rem',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '1rem',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '0.9rem',
      },
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
