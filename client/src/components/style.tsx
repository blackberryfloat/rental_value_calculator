import React from 'react';
import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';

interface StyleProps {
  children: React.ReactNode[];
}

export function Style({ children }: StyleProps) {
  // styling
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        light: '#63a4ff',
        main: '#1976d2',
        dark: '#004ba0',
      },
      secondary: {
        light: '#ff5c8d',
        main: '#dc004e',
        dark: '#9a0036',
      },
      error: {
        light: '#e57373',
        main: '#f44336',
        dark: '#d32f2f',
      },
      warning: {
        light: '#ffb74d',
        main: '#ff9800',
        dark: '#f57c00',
      },
      info: {
        light: '#64b5f6',
        main: '#2196f3',
        dark: '#1976d2',
      },
      success: {
        light: '#81c784',
        main: '#4caf50',
        dark: '#388e3c',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
