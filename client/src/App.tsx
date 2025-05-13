import React, { useEffect, useRef, useReducer } from 'react';
import './App.css';
import { Stack, Box, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { AppModel } from './state/app_model';
import PropertyCard from './components/property_card';
import { PropertyModel } from './state/property_model';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useMediaQuery } from "@mui/material";
import { handleStateChange, Undoer } from './state/undoer';
import { recoilAddToast, recoilAlerts, recoilToasts } from './state/app.state';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Toast } from './components/toast';
import { Alert } from './components/alert';
import { ToastCode, Toast as ToastState } from './state/toast';
import { Style } from './components/style';

function App() {
  const isMobile = useMediaQuery('(max-width: 600px)');

  // load state from local storage
  const modelRef = useRef<AppModel>(AppModel.load());
  // set up undo and redo functionality
  const [undoer, updateUndoer] = useReducer(handleStateChange, new Undoer<AppModel>(modelRef.current));

  const toasts = useRecoilValue(recoilToasts);
  const addToast = useSetRecoilState(recoilAddToast);
  const alerts = useRecoilValue(recoilAlerts);

  const handleUndo = () => {
    updateUndoer('UNDO');
    addToast(ToastState.fromCode(ToastCode.UNDO));
  };

  const handleRedo = () => {
    updateUndoer('REDO');
    addToast(ToastState.fromCode(ToastCode.REDO));
  };

  // persist state on every change
  useEffect(() => {
    undoer.current.save();
  }, [undoer.current]);

  // on mount, wire up Ctrl+Z / Ctrl+Y (or Cmd on Mac)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // navigator.platform is deprecated → detect Mac via userAgentData or userAgent
      const isMac =
        // modern API
        navigator.userAgent
          ?.toLowerCase()
          .includes('mac') ??
        // fallback
        /Mac/i.test(navigator.userAgent);
      const mod = isMac ? e.metaKey : e.ctrlKey;

      // undo: Ctrl/Cmd + Z
      if (mod && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();    // dispatch an “undo” action
      }
      // redo: Ctrl/Cmd + Y  OR  Ctrl/Cmd + Shift + Z
      if (mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        handleRedo();    // dispatch a “redo” action
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleAddProperty = () => {
    modelRef.current.addProperty(new PropertyModel({
      address: 'UNKNOWN',
      propertyPrice: 0,
      downPayment: 0,
      apr: 0,
      termYears: 0,
      propertyTax: 0,
      insuranceCost: 0,
      managementExpensePercent: 0,
      occupancyRatePercent: 0,
      revenueStreams: [],
    }));
    updateUndoer(modelRef.current);
  };

  return (
    <Style>
      {/* header with title and undo/redo */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rental Calculator
          </Typography>
          <IconButton edge="end" color="inherit" onClick={() => handleUndo()}>
            <UndoIcon />
          </IconButton>
          <IconButton edge="end" color="inherit" onClick={() => handleRedo()}>
            <RedoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* alerts below header, centered */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
        {alerts.map(a => (
          <Alert key={a.uuid} alert={a} />
        ))}
      </Box>

      <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Stack
          spacing={2}
          sx={{
            padding: 2,
            margin: isMobile ? '0 auto' : '20px',
            maxWidth: "100%",
            width: '100vw',
            height: '100vh',
            verticalAlign: 'top',
          }}
        >
          {
            modelRef.current.properties.map((property, idx) => {
              // remove a property from list and update undoer
              const handleRemove = () => {
                modelRef.current.removeProperty(idx);
                updateUndoer(modelRef.current);
              };

              // update a property's content in list and update undoer
              const handleUpdate = (p: PropertyModel) => {
                modelRef.current.updateProperty(idx, p);
                updateUndoer(modelRef.current);
              };

              // component to interact with property information
              // this is a memoized component to avoid unnecessary re-renders
              return (
                <PropertyCard
                  key={property.getCreatedAt()} // stable key
                  property={property}
                  remove={handleRemove}
                  update={handleUpdate}
                />
              );
            })
          }

          {/* Add new property button */}
          <Box
            component="span"
            onClick={handleAddProperty}
            sx={theme => ({
              display: 'block',
              width: '100%',
              py: 1,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: 'inherit',
              border: `2px solid ${theme.palette.divider}`,    // use divider for contrast
              color: theme.palette.text.primary,               // text contrasts with bg
              borderRadius: 1,
            })}
          >
            <AddCircleIcon fontSize="large" color="primary" />
          </Box>
        </Stack>
      </Box>
      {
        // toasts at the bottom right of the screen
        toasts.map((toast) => (
          <Toast toast={toast} key={toast.uuid} />
        ))
      }
    </Style>
  );
};

export default App;
