import { atom } from 'jotai';
import { AppModel } from './app_model';
import { Undoer } from './undoer';
import { Alert } from './alert';
import { Toast } from './toast';

export const alertsAtom = atom<Alert[]>([]);

export const addAlertAtom = atom(null, (_get, set, newAlert: Alert) => {
  set(alertsAtom, (prev) => [...prev, newAlert]);
});

export const removeAlertAtom = atom(null, (_get, set, uuid: string) => {
  set(alertsAtom, (prev) => prev.filter((a) => a.uuid !== uuid));
});

const TOAST_DEL_TIMEOUT = 3000; // 3 seconds

export const toastsAtom = atom<Toast[]>([]);

export const addToastAtom = atom(null, (_get, set, newToast: Toast) => {
  set(toastsAtom, (prev) => [...prev, newToast]);
  // auto-expire
  setTimeout(() => {
    set(removeToastAtom, newToast.uuid);
  }, TOAST_DEL_TIMEOUT);
});

export const removeToastAtom = atom(null, (_get, set, uuid: string) => {
  set(toastsAtom, (prev) => prev.filter((t) => t.uuid !== uuid));
});

// undo‐redo state
export const undoerAtom = atom<Undoer<AppModel> | null>(null);
export const updateUndoerAtom = atom(
  null,
  (get, set, action: null | undefined | 'UNDO' | 'REDO' | AppModel) => {
    if (action === null || action === undefined) return;
    const u = get(undoerAtom);
    if (!u) return;

    // handle action
    if (action === 'UNDO') {
      u.undo();
    } else if (action === 'REDO') {
      u.redo();
    } else if (action instanceof AppModel) {
      u.addAction(action);
    }
    u.current.save();
    set(undoerAtom, u);
  },
);
