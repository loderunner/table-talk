import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';
import colors from 'tailwindcss/colors';

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  hex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Switzer', ...defaultTheme.fontFamily.sans],
      },
      typography: ({ theme }) => ({
        'high-contrast': {
          css: {
            '--tw-prose-body': colors.gray[900],
            '--tw-prose-headings': colors.black,
            '--tw-prose-lead': colors.gray[700],
            '--tw-prose-links': colors.black,
            '--tw-prose-bold': colors.black,
            '--tw-prose-counters': colors.gray[500],
            '--tw-prose-bullets': colors.gray[500],
            '--tw-prose-hr': colors.gray[50],
            '--tw-prose-quotes': colors.black,
            '--tw-prose-quote-borders': colors.gray[50],
            '--tw-prose-captions': colors.gray[500],
            '--tw-prose-kbd': colors.black,
            '--tw-prose-kbd-shadows': hexToRgb(colors.black),
            '--tw-prose-code': colors.black,
            '--tw-prose-pre-code': colors.gray[50],
            '--tw-prose-pre-bg': colors.gray[950],
            '--tw-prose-th-borders': colors.white,
            '--tw-prose-td-borders': colors.gray[50],
            '--tw-prose-invert-body': colors.white,
            '--tw-prose-invert-headings': colors.white,
            '--tw-prose-invert-lead': colors.white,
            '--tw-prose-invert-links': colors.white,
            '--tw-prose-invert-bold': colors.white,
            '--tw-prose-invert-counters': colors.white,
            '--tw-prose-invert-bullets': colors.gray[700],
            '--tw-prose-invert-hr': colors.gray[900],
            '--tw-prose-invert-quotes': colors.white,
            '--tw-prose-invert-quote-borders': colors.gray[900],
            '--tw-prose-invert-captions': colors.white,
            '--tw-prose-invert-kbd': colors.white,
            '--tw-prose-invert-kbd-shadows': hexToRgb(colors.white),
            '--tw-prose-invert-code': colors.white,
            '--tw-prose-invert-pre-code': colors.white,
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': colors.gray[700],
            '--tw-prose-invert-td-borders': colors.gray[900],
          },
        },
      }),
    },
  },
  plugins: [typography],
};
