import type { Theme } from '$lib/types';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultTheme = 'dark';

const themeStore = writable<Theme>(getTheme());

function getTheme() {
  if (!browser) return defaultTheme;

  const storedTheme = localStorage.getItem('theme') as Theme;
  const theme = storedTheme || defaultTheme;

  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);

  return theme;
}

function setTheme(theme: Lowercase<Theme>) {
  themeStore.set(theme);
  localStorage.setItem('theme', theme);

  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
}

export { themeStore as theme, setTheme };