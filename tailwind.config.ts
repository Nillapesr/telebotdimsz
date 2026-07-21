import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f0ede8',
        foreground: '#1a1a1a',
        primary: '#ffd166',
        'primary-foreground': '#1a1a1a',
        border: '#1a1a1a',
      },
      fontFamily: {
        mono: ['Space Mono', 'Courier New', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        brutal: '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0, 0, 0, 1)',
      },
      animation: {
        'brutal-blink': 'brutal-blink 1.5s ease-in-out infinite',
      },
      keyframes: {
        'brutal-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
