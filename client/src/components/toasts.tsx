import React from 'react';
import { Snackbar } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { toastsAtom, removeToastAtom } from '../state/app.state';

export function Toasts() {
  const [toasts] = useAtom(toastsAtom);
  const removeToast = useSetAtom(removeToastAtom);

  return (
    <>
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
    </>
  );
}
