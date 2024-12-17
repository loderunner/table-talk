/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="unplugin-fonts/client" />

import type { Ollama } from '@/electron/preload';

export declare global {
  interface Window {
    ollama: Ollama;
  }

  const ollama: Ollama;
}
