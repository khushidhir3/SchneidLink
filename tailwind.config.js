import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                schneider: {
                    50:  '#eafff0',
                    100: '#c5ffd6',
                    200: '#8cffad',
                    300: '#3DCD58', // Schneider Electric brand green
                    400: '#2db847',
                    500: '#1fa03a',
                    600: '#17802e',
                    700: '#126624',
                    800: '#0d4d1b',
                    900: '#083311',
                },
                dark: {
                    50:  '#f0f1f5',
                    100: '#d4d7e0',
                    200: '#a9afc2',
                    300: '#7e87a3',
                    400: '#535f85',
                    500: '#3a4570',
                    600: '#2d3559',
                    700: '#1F2640',
                    800: '#1A1F36', // Main dark bg
                    900: '#12152A',
                    950: '#0A0D1A',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
