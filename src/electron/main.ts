import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as ollama from './ollama';
import * as preferences from './preferences';

import { PartialSettings } from '@/app/SettingsProvider';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 250,
    minWidth: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.mjs'),
    },
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

app.on('ready', () => {
  ipcMain.handle('ollama.setEndpointURL', (_event, url: string) => {
    ollama.setEndpointURL(url);
  });
  ipcMain.on('ollama.pull', (event, model: string) => {
    ollama.pull(event.ports[0], model);
  });
  ipcMain.on('ollama.generate', (event, args: ollama.GenerateArgs) => {
    ollama.generate(event.ports[0], args);
  });

  ipcMain.handle('preferences.save', (_event, prefs: PartialSettings) => {
    preferences.save(prefs);
  });
  ipcMain.handle('preferences.load', (_event) => {
    return preferences.load();
  });

  const window = createWindow();

  if (process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Load your file
    window.loadFile('dist/index.html');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
