import react from '@vitejs/plugin-react-swc';
import Unfonts from 'unplugin-fonts/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import tsconfigPaths from 'vite-tsconfig-paths';

let firstStart = true;

export default defineConfig({
  plugins: [
    Unfonts({
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
        entry: 'electron/main.ts',
        onstart:
          process.env.NODE_ENV === 'development'
            ? ({ startup, reload }) => {
                if (firstStart) {
                  console.log('startup');
                  startup([
                    '.',
                    '--no-sandbox',
                    '--inspect=9229',
                    '--remote-debugging-port=9222',
                  ]);
                  firstStart = false;
                } else {
                  console.log('reload');
                  reload();
                }
              }
            : undefined,
        vite: {
          build: {
            sourcemap: true,
          },
        },
      },
      preload: {
        input: 'electron/preload.ts',
        vite: {
          build: {
            sourcemap: true,
          },
        },
      },
    }),
  ],
});
