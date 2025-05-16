import { Alert, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAtom, useSetAtom } from 'jotai';
import { alertsAtom, removeAlertAtom } from '../state/app.state';
import { AlertLevel } from '../state/alert';

export function Alerts() {
  const [alerts] = useAtom(alertsAtom);
  const removeAlert = useSetAtom(removeAlertAtom);

  const severityMap: Record<AlertLevel, 'error' | 'warning' | 'info'> = {
    [AlertLevel.ERROR]: 'error',
    [AlertLevel.WARNING]: 'warning',
    [AlertLevel.INFO]: 'info',
  };

  return (
    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
      {alerts.map((a) => (
        <Alert
          key={a.uuid}
          severity={severityMap[a.level]}
          action={
            <IconButton size="small" onClick={() => removeAlert(a.uuid)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {a.message}
        </Alert>
      ))}
    </Box>
  );
}
