import { ipcMain } from 'electron';

import { CoreMessage, streamText } from 'ai';
import { Ollama, ProgressResponse } from 'ollama';
import { AbortableAsyncIterator } from 'ollama/src/utils.js';
import { OllamaProvider, createOllama } from 'ollama-ai-provider';

import { mainWindow } from './main';

let client: Ollama = new Ollama();
let provider: OllamaProvider = createOllama();

export function setEndpointURL(url: string) {
  client = new Ollama({ host: url });
  provider = createOllama({ baseURL: `${url}/api` });
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
      mainWindow?.webContents.send(`ollama.pull.error::${id}`, err.message);
      return;
    }
    mainWindow?.webContents.send(`ollama.pull.error::${id}`, String(err));
  } finally {
    ipcMain.off(`ollama.pull.abort::${id}`, onAbort);
  }
}

export type GenerateArgs = {
  model: Parameters<typeof provider>[0];
  messages: CoreMessage[];
};
export type GenerateResponse = {
  status: number;
  statusText: '';
  headers: [string, string][];
  hasBody: boolean;
};
export function generate(id: number, { model, messages }: GenerateArgs) {
  const stream = streamText({ model: provider(model), messages });
  const res = stream.toDataStreamResponse();

  mainWindow?.webContents.send(`ollama.generate.response::${id}`, {
    status: res.status,
    statusText: res.statusText,
    headers: [...res.headers.entries()],
    hasBody: res.body !== null,
  });

  if (res.body !== null) {
    const body = res.body;
    setImmediate(async () => {
      for await (const chunk of body) {
        mainWindow?.webContents.send(`ollama.generate.body::${id}`, chunk);
      }
      mainWindow?.webContents.send(`ollama.generate.end::${id}`);
    });
  } else {
    mainWindow?.webContents.send(`ollama.generate.end::${id}`);
  }
}
