import animate from 'tailwindcss-animate';
import tailwindcssReactAria from 'tailwindcss-react-aria-components';
import plugin from 'tailwindcss/plugin';

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e1e6f0',
          200: '#b6c1d6',
          300: '#8a9cbb',
          400: '#5e769f',
          500: '#12223A',
          600: '#101d33',
          700: '#0d1729',
          800: '#0a121f',
          900: '#070c14',
          950: '#04060a',
        },
        appBackground: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    animate,
    tailwindcssReactAria,
    plugin(function ({
      addUtilities,
    }: {
      addUtilities: (u: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        '.field-shadow': {
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '0.5rem',
          backgroundColor: '#fff',
          padding: '1.5rem 1.25rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      });
    }),
  ],
};
