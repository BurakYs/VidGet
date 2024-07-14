import { writable } from 'svelte/store';

type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timeout?: number;
}

export const toasts = writable<Toast[]>([]);

export default function addToast(message: Toast['message'], config: Omit<Toast, 'id' | 'message'>) {
  const id = Math.random().toString(36).substring(2, 9);
  const type = config.type || 'info';
  const timeout = config.timeout ?? 5000;

  toasts.set([{ id, message, type }]);

  if (timeout <= 0) return;

  setTimeout(() => {
    toasts.update(allToasts => allToasts.filter(t => t.id !== id));
  }, timeout);
}