import autoAdapter from '@sveltejs/adapter-auto';
import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    enableSourcemap: false
  },
  preprocess: vitePreprocess(),
  kit: {
    adapter: process.env.IS_NOT_MOBILE ? autoAdapter() : staticAdapter(),
    alias: {
      $config: './src/config',
      $components: './src/lib/components',
      $stores: './src/stores'
    }
  }
};

export default config;
