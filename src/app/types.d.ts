/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="unplugin-fonts/client" />

import type { Dialog, Ollama, Preferences } from '@/electron/preload';

export declare global {
  interface Window {
    ollama: Ollama;
    preferences: Preferences;
    dialog: Dialog;
  }

  const ollama: Ollama;
  const preferences: Preferences;
  const dialog: Dialog;
}
