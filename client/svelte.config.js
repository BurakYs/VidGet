import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {
        enableSourcemap: false
    },
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            $config: './src/config',
            $components: './src/components',
        }
    },
};

export default config;
