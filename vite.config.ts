import react from '@vitejs/plugin-react-swc';
import Unfonts from 'unplugin-fonts/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    svgr(),
    Unfonts({
      fontsource: {
        families: ['Sometype Mono Variable'],
      },
      custom: {
        families: [
          {
            name: 'Switzer',
            src: './src/assets/fonts/switzer/*.woff2',
            transform: (font) => ({ ...font, weight: '100 900' }),
          },
        ],
      },
    }),
    tsconfigPaths(),
    react(),
    electron({
      main: {
        entry: './src/electron/main.ts',
        onstart:
          process.env.NODE_ENV === 'development'
            ? ({ startup }) => {
                startup([
                  '.',
                  '--no-sandbox',
                  '--inspect=9229',
                  '--remote-debugging-port=9222',
                ]);
              }
            : undefined,
        vite: {
          build: {
            sourcemap: true,
          },
        },
      },
      preload: {
        input: './src/electron/preload.ts',
        onstart:
          process.env.NODE_ENV === 'development'
            ? ({ reload }) => {
                reload();
              }
            : undefined,
        vite: {
          build: {
            sourcemap: true,
          },
        },
      },
    }),
  ],
});
