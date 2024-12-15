import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as ollama from './ollama';

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

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join('dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  ipcMain.handle('ollama.setEndpointURL', (_event, url: string) => {
    ollama.setEndpointURL(url);
    ollama.pull('llama3.2:1b');
  });

  createWindow();
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
