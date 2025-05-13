import { atom, selector, DefaultValue } from 'recoil';
import { Alert } from './alert';
import type { Toast } from './toast';

export const recoilAlerts = atom<Alert[]>({
    key: 'recoilAlerts',
    default: [],
});

export const recoilAddAlert = selector<Alert>({
    key: 'recoilAddAlert',  // must be unique
    get: () => {
        // no-op getter; use set only
        throw new Error('recoilAddAlert is write-only');
    },
    set: ({ get, set }, newAlert) => {
        if (newAlert instanceof DefaultValue) return;
        const current = get(recoilAlerts);
        set(recoilAlerts, [...current, newAlert]);
    },
});

export const recoilRemoveAlert = selector<string>({
    key: 'recoilRemoveAlert',  // must be unique
    get: () => {
        // no-op getter; use set only
        throw new Error('recoilRemoveAlert is write-only');
    },
    set: ({ get, set }, uuid) => {
        if (uuid instanceof DefaultValue) return;
        const current = get(recoilAlerts);
        set(recoilAlerts, current.filter(alert => alert.uuid !== uuid));
    },
});

/**
 * An atom holding the current list of toast‐alerts.
 */
export const recoilToasts = atom<Toast[]>({
    key: 'recoilToasts',
    default: [],
});

/**
 * Write‐only selector to push a new toast onto the list,
 * then automatically remove it after 3s.
 */
export const recoilAddToast = selector<Toast>({
    key: 'recoilAddToast',
    get: () => {
        throw new Error('recoilAddToast is write‐only');
    },
    set: ({ get, set }, newToast) => {
        if (newToast instanceof DefaultValue) return;

        const current = get(recoilToasts);
        set(recoilToasts, [...current, newToast]);

        // schedule automatic removal in 3 seconds
        window.setTimeout(() => {
            set(recoilRemoveToast, newToast.uuid);
        }, 3000);
    },
});

/**
 * Write‐only selector to remove a toast by its UUID.
 */
export const recoilRemoveToast = selector<string>({
    key: 'recoilRemoveToast',
    get: () => {
        throw new Error('recoilRemoveToast is write‐only');
    },
    set: ({ get, set }, uuid) => {
        if (uuid instanceof DefaultValue) return;

        const current = get(recoilToasts);
        set(
            recoilToasts,
            current.filter((toast) => toast.uuid !== uuid)
        );
    },
});

