/* eslint-disable @typescript-eslint/no-require-imports */

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
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', scale: '0.9' },
          '100%': { opacity: '1', scale: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1', scale: '1' },
          '100%': { opacity: '0', scale: '0.9' }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};