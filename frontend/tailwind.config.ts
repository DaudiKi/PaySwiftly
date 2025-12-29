import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: {
                    50: '#FDFCFB',
                    100: '#FBF9F6',
                    200: '#F7F3ED',
                    300: '#F3EDE4',
                    400: '#EFE7DB',
                    500: '#EBE1D2',
                    600: '#D4C5B0',
                    700: '#BDA98E',
                    800: '#A68D6C',
                    900: '#8F714A',
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                blob: {
                    '0%, 100%': {
                        transform: 'translate(0, 0) scale(1)',
                    },
                    '33%': {
                        transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
