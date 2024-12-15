import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

import type { ProgressResponse } from 'ollama';

function setEndpointURL(url: string) {
  ipcRenderer.invoke('ollama.setEndpointURL', url);
}

export type ProgressEventHandler = (progress: ProgressResponse) => void;

let subscriptionId = 0;
const ollamaBridge = {
  setEndpointURL,
  onProgress(handler: ProgressEventHandler) {
    const id = subscriptionId++;
    const subscription = (
      _event: IpcRendererEvent,
      progress: ProgressResponse,
    ) => {
      console.log('subscription', id);
      handler(progress);
    };

    ipcRenderer.on('ollama.pull.progress', subscription);

    return () => {
      console.log('unsubscribing', id);
      ipcRenderer.removeListener('ollama.pull.progress', subscription);
    };
  },
};

export type Ollama = typeof ollamaBridge;

contextBridge.exposeInMainWorld('ollama', ollamaBridge);
