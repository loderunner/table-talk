import { ipcMain } from 'electron';

import { Ollama, ProgressResponse } from 'ollama';
import { AbortableAsyncIterator } from 'ollama/src/utils.js';

import { mainWindow } from './main';

let client: Ollama = new Ollama();

export function setEndpointURL(url: string) {
  client = new Ollama({ host: url });
}

export async function pull(id: number, model: string) {
  const it: AbortableAsyncIterator<ProgressResponse> | undefined = undefined;
  function onAbort() {
    it?.abort();
  }
  ipcMain.handle(`ollama.pull.abort::${id}`, onAbort);

  try {
    const it = await client.pull({ model, stream: true });
    for await (const progress of it) {
      mainWindow?.webContents.send(`ollama.pull.progress::${id}`, progress);
    }
  } catch (err) {
    if (err instanceof Error) {
      mainWindow?.webContents.send(`ollama.error::${id}`, err.message);
      return;
    }
    mainWindow?.webContents.send(`ollama.error::${id}`, String(err));
  } finally {
    ipcMain.off(`ollama.pull.abort::${id}`, onAbort);
  }
}
