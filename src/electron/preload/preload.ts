import { contextBridge } from 'electron';

import dialogBridge from './dialog';
import ollamaBridge from './ollama';
import preferencesBridge from './preferences';
import sqliteBridge from './sqlite';

contextBridge.exposeInMainWorld('ollama', ollamaBridge);
contextBridge.exposeInMainWorld('preferences', preferencesBridge);
contextBridge.exposeInMainWorld('dialog', dialogBridge);
contextBridge.exposeInMainWorld('sqlite', sqliteBridge);

export type { Ollama } from './ollama';
export type { Dialog } from './dialog';
export type { Preferences } from './preferences';
export type { SQLite } from './sqlite';
