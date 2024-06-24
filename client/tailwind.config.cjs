/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                'primary': '#191A1F',
                'secondary': '#1F1F27',
                'primary-button': '#0077FF',
                'secondary-button': '#FFFFFF',
                'primary-text': '#FFFFFF',
                'secondary-text': '#9CA3AF'
            }
        }
    },
    plugins: [require('@tailwindcss/forms')]
};