import React from 'react';
import {
  AppBar,
  Box,
  createTheme,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useSetAtom } from 'jotai';
import { addToastAtom, updateUndoerAtom } from '../state/app.state';
import { Toasts } from './toasts';
import { Alerts } from './alerts';
import { Toast as ToastState, ToastCode } from '../state/toast';

interface StyleProps {
  children: React.ReactNode | React.ReactNode[];
}

export function Page({ children }: StyleProps) {
  const undoerHandler = useSetAtom(updateUndoerAtom);
  const addToast = useSetAtom(addToastAtom);

  const handleUndo = () => {
    undoerHandler('UNDO');
    addToast(ToastState.fromCode(ToastCode.UNDO));
  };

  const handleRedo = () => {
    undoerHandler('REDO');
    addToast(ToastState.fromCode(ToastCode.REDO));
  };

  // styling
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isMobile = useMediaQuery('(max-width: 600px)');
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
      <AppBar position="fixed" color="primary">
        {/* make the Toolbar a positioning context */}
        <Toolbar sx={{ position: 'relative' }}>
          <Typography
            variant="h6"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Rental Calculator
          </Typography>

          {!isMobile && (
            <>
              <IconButton color="inherit" onClick={handleUndo}>
                <UndoIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleRedo}>
                <RedoIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Alerts />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: 0,
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
        {/* spacer to push footer down */}
        <Box sx={{ flexGrow: 1 }} />
        <Box
          component="footer"
          sx={{
            mt: 'auto',
            py: 2,
            bgcolor: 'background.paper',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Blackberry Float
          </Typography>
        </Box>
      </Box>
      <Toasts />
    </ThemeProvider>
  );
}
