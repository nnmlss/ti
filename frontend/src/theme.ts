import { createTheme } from '@mui/material/styles';

const baseTheme = createTheme();

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default MUI primary blue
      dark: '#48486A', // Your custom primary light color
    },
    secondary: {
      main: '#f50057', // Default MUI secondary pink
    },
  },
  typography: {
    fontFamily: 'comfortaa, sans-serif',
    h1: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '40px',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '32px',
      },
    },
    h2: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '32px',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '28px',
      },
    },
    h3: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '28px',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '24px',
      },
    },
    h4: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '24px',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '20px',
      },
    },
    h5: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '20px',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
    h6: {
      fontFamily: 'comfortaalight, sans-serif',
      fontSize: '16px',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: '15px',
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
