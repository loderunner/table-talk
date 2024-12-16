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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

app.on('ready', () => {
  ipcMain.handle('ollama.setEndpointURL', (_event, url: string) => {
    ollama.setEndpointURL(url);
  });
  ipcMain.handle('ollama.pull', (_event, id: number, model: string) => {
    ollama.pull(id, model);
    return id;
  });
  ipcMain.handle(
    'ollama.generate',
    (_event, id: number, args: ollama.GenerateArgs) => {
      ollama.generate(id, args);
    },
  );

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
