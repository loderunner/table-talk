/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="unplugin-fonts/client" />

import type { Ollama, Preferences } from '@/electron/preload';

export declare global {
  interface Window {
    ollama: Ollama;
    preferences: Preferences;
  }

  const ollama: Ollama;
  const preferences: Preferences;
}
