import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

export const toasts = writable<Toast[]>([]);

export function addToast(message: string, type: ToastType = 'info') {
    const id = Date.now();
    toasts.set([{ id, message, type }]);
    setTimeout(() => {
        toasts.update(allToasts => allToasts.filter(t => t.id !== id));
    }, 5000);
}