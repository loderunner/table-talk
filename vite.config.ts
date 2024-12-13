import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import electron from 'vite-plugin-electron/simple';
import tsconfigPaths from 'vite-tsconfig-paths';
import Unfonts from 'unplugin-fonts/vite';

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
      },
    }),
  ],
});
