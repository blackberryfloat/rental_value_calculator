import React from 'react';
import { AlertLevel, Alert as AlertState } from '../state/alert';
import { recoilRemoveAlert } from '../state/app.state';
import { useSetRecoilState } from 'recoil';
import MuiAlert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const severityMap: Record<AlertLevel, 'error' | 'warning' | 'info'> = {
  [AlertLevel.ERROR]: 'error',
  [AlertLevel.WARNING]: 'warning',
  [AlertLevel.INFO]: 'info',
};

export function Alert({ alert }: { alert: AlertState }) {
  const removeAlert = useSetRecoilState(recoilRemoveAlert);
  return (
    <MuiAlert
      key={alert.uuid}
      severity={severityMap[alert.level]}
      action={
        <IconButton size="small" onClick={() => removeAlert(alert.uuid)}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {alert.message}
    </MuiAlert>
  );
}
