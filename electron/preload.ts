import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

import { CoreMessage } from 'ai';
import type { ProgressResponse } from 'ollama';

import type { GenerateResponse } from '../electron/ollama';

let requestId = 0;

function setEndpointURL(url: string) {
  ipcRenderer.invoke('ollama.setEndpointURL', url);
}

async function pull(model: string, onProgress?: ProgressEventHandler) {
  const id = requestId++;

  const subscription = (
    _event: IpcRendererEvent,
    progress: ProgressResponse,
  ) => {
    onProgress?.(progress);
  };
  ipcRenderer.on(`ollama.pull.progress::${id}`, subscription);

  ipcRenderer.invoke('ollama.pull', id, model);

  return () => {
    ipcRenderer.removeListener(`ollama.pull.progress::${id}`, subscription);
    ipcRenderer.invoke(`ollama.pull.abort::${id}`);
  };
}

async function generate(
  model: string,
  messages: CoreMessage[],
  onBody: (chunk?: Uint8Array) => void,
) {
  const id = requestId++;

  const promise = new Promise<GenerateResponse>((resolve) => {
    ipcRenderer.once(
      `ollama.generate.response::${id}`,
      (_event: IpcRendererEvent, res: GenerateResponse) => {
        resolve(res);
      },
    );
  });

  const subscription = (_event: IpcRendererEvent, chunk: Uint8Array) => {
    onBody(chunk);
  };
  ipcRenderer.on(`ollama.generate.body::${id}`, subscription);

  ipcRenderer.once(`ollama.generate.end::${id}`, () => {
    onBody();
    ipcRenderer.removeListener(`ollama.generate.body::${id}`, subscription);
  });

  ipcRenderer.invoke('ollama.generate', id, {
    model,
    messages,
  });

  const res = await promise;

  if (!res.hasBody) {
    onBody();
    return res;
  }

  return res;
}

export type ProgressEventHandler = (progress: ProgressResponse) => void;

const ollamaBridge = {
  setEndpointURL,
  pull,
  generate,
};

export type Ollama = typeof ollamaBridge;

contextBridge.exposeInMainWorld('ollama', ollamaBridge);
