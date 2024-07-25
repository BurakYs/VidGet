import autoAdapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    enableSourcemap: false
  },
  preprocess: vitePreprocess(),
  kit: {
    adapter: autoAdapter(),
    alias: {
      $config: './src/config',
      $components: './src/lib/components',
      $stores: './src/stores'
    }
  }
};

export default config;
