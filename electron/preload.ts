import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

import type { ProgressResponse } from 'ollama';

function setEndpointURL(url: string) {
  ipcRenderer.invoke('ollama.setEndpointURL', url);
}

async function pull(model: string, onProgress?: ProgressEventHandler) {
  const id = await ipcRenderer.invoke('ollama.pull', model);

  const subscription = (
    _event: IpcRendererEvent,
    progress: ProgressResponse,
  ) => {
    onProgress?.(progress);
  };
  ipcRenderer.on(`ollama.pull.progress::${id}`, subscription);

  return () => {
    ipcRenderer.removeListener(`ollama.pull.progress::${id}`, subscription);
    ipcRenderer.invoke(`ollama.pull.abort::${id}`);
  };
}

export type ProgressEventHandler = (progress: ProgressResponse) => void;

const ollamaBridge = {
  setEndpointURL,
  pull,
};

export type Ollama = typeof ollamaBridge;

contextBridge.exposeInMainWorld('ollama', ollamaBridge);
