/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                'primary': '#191A1F',
                'secondary': '#1F1F27',
                'primary-button': '#FFFFFF',
                'secondary-text': '#BFBFBF'
            }
        }
    },
    plugins: []
};