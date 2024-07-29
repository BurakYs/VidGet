import type { Settings } from '$lib/types';
import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

const defaultSettings: Settings = {
  quickDownloadType: 'off',
  sendAnonymousData: true
};

const settingsStore = writable<Settings>(getSettings());

function getSettings(): Settings {
  if (!browser) return defaultSettings;

  const storedSettings: Settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify(defaultSettings));

  for (const k in defaultSettings) {
    const key = k as keyof Settings;
    if (!(key in storedSettings)) {
      // @ts-expect-error - later
      storedSettings[key] = defaultSettings[key];
    }
  }

  return storedSettings;
}

function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  const settings = get(settingsStore);
  settings[key] = value;
  settingsStore.set(settings);
  localStorage.setItem('settings', JSON.stringify(settings));
}

export { settingsStore as settings, setSetting };