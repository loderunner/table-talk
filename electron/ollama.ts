import { Ollama } from 'ollama';

import { mainWindow } from './main';

let client: Ollama = new Ollama();

export function setEndpointURL(url: string) {
  client = new Ollama({ host: url });
}

export function pull(model: string) {
  try {
    client.pull({ model, stream: true }).then(async (it) => {
      for await (const progress of it) {
        try {
          mainWindow?.webContents.send('ollama.pull.progress', progress);
        } catch (err) {
          if (err instanceof Error) {
            mainWindow?.webContents.send('ollama.error', err.message);
            return;
          }
          mainWindow?.webContents.send('ollama.error', String(err));
          return;
        }
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      mainWindow?.webContents.send('ollama.error', err.message);
      return;
    }
    mainWindow?.webContents.send('ollama.error', String(err));
  }
}
