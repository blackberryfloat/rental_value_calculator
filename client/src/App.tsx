import React, { useEffect, useRef, useReducer } from 'react';
import './App.css';
import {
  Stack,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Alert as MuiAlert,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useMediaQuery } from '@mui/material';
import { handleStateChange, Undoer } from './state/undoer';
import { Toast as ToastState, ToastCode } from './state/toast';
import { AppModel } from './state/app_model';
import PropertyCard from './components/property_card';
import { PropertyModel } from './state/property_model';
import { Style } from './components/style';

import { useAtom, useSetAtom } from 'jotai';
import {
  alertsAtom,
  addAlertAtom,
  removeAlertAtom,
  toastsAtom,
  addToastAtom,
  removeToastAtom,
} from './state/app.state';
import { AlertLevel } from './state/alert';

function App() {
  const isMobile = useMediaQuery('(max-width: 600px)');

  // load & undo/redo
  const modelRef = useRef<AppModel>(AppModel.load());
  const [undoer, updateUndoer] = useReducer(
    handleStateChange,
    new Undoer<AppModel>(modelRef.current),
  );

  // jotai atoms
  const [alerts] = useAtom(alertsAtom);
  const addAlert = useSetAtom(addAlertAtom);
  const removeAlert = useSetAtom(removeAlertAtom);

  const [toasts] = useAtom(toastsAtom);
  const addToast = useSetAtom(addToastAtom);
  const removeToast = useSetAtom(removeToastAtom);

  const severityMap: Record<AlertLevel, 'error' | 'warning' | 'info'> = {
    [AlertLevel.ERROR]: 'error',
    [AlertLevel.WARNING]: 'warning',
    [AlertLevel.INFO]: 'info',
  };

  const handleUndo = () => {
    updateUndoer('UNDO');
    addToast(ToastState.fromCode(ToastCode.UNDO));
  };
  const handleRedo = () => {
    updateUndoer('REDO');
    addToast(ToastState.fromCode(ToastCode.REDO));
  };

  useEffect(() => {
    undoer.current.save();
  }, [undoer.current]);

  const handleAddProperty = () => {
    const p = new PropertyModel({
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
    });
    modelRef.current.addProperty(p);
    updateUndoer(modelRef.current);
  };

  return (
    <Style>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Rental Calculator
          </Typography>
          <IconButton color="inherit" onClick={handleUndo}>
            <UndoIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleRedo}>
            <RedoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
        {alerts.map((a) => (
          <MuiAlert
            key={a.uuid}
            severity={severityMap[a.level]}
            action={
              <IconButton size="small" onClick={() => removeAlert(a.uuid)}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {a.message}
          </MuiAlert>
        ))}
      </Box>

      <Box sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Stack
          spacing={2}
          sx={{
            p: 2,
            m: isMobile ? '0 auto' : 2,
            width: '100%',
            height: '100%',
          }}
        >
          {modelRef.current.properties.map((property, idx) => {
            const handleRemove = () => {
              modelRef.current.removeProperty(idx);
              updateUndoer(modelRef.current);
            };
            const handleUpdate = (p: PropertyModel) => {
              modelRef.current.updateProperty(idx, p);
              updateUndoer(modelRef.current);
            };
            return (
              <PropertyCard
                key={property.getCreatedAt()}
                property={property}
                remove={handleRemove}
                update={handleUpdate}
              />
            );
          })}

          <Box
            component="span"
            onClick={handleAddProperty}
            sx={(t) => ({
              display: 'block',
              width: '100%',
              py: 1,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: 'inherit',
              border: `2px solid ${t.palette.divider}`,
              color: t.palette.text.primary,
              borderRadius: 1,
            })}
          >
            <AddCircleIcon fontSize="large" />
          </Box>
        </Stack>
      </Box>

      {toasts.map((t) => (
        <Snackbar
          key={t.uuid}
          open
          autoHideDuration={3000}
          onClose={() => removeToast(t.uuid)}
          message={t.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
      ))}
    </Style>
  );
}

export default App;
