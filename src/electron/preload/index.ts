import { contextBridge } from 'electron';

import dialogBridge from './dialog';
import ollamaBridge from './ollama';
import preferencesBridge from './preferences';

contextBridge.exposeInMainWorld('ollama', ollamaBridge);
contextBridge.exposeInMainWorld('preferences', preferencesBridge);
contextBridge.exposeInMainWorld('dialog', dialogBridge);

export type { Ollama } from './ollama';
export type { Dialog } from './dialog';
export type { Preferences } from './preferences';
