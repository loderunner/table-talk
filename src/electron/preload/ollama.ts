import { ipcRenderer } from 'electron';

import { CoreMessage } from 'ai';
import { ProgressResponse } from 'ollama';

import { GenerateResponse } from '@/electron/main/ollama';

async function setEndpointURL(url: string) {
  await ipcRenderer.invoke('ollama.setEndpointURL', url);
}

type ProgressEventHandler = (progress: ProgressResponse) => void;

async function pull(model: string, onProgress?: ProgressEventHandler) {
  const channel = new MessageChannel();
  const port = channel.port1;
  const onMessage = (event: MessageEvent<ProgressResponse>) => {
    onProgress?.(event.data);
  };
  const onClose = () => {
    port.removeEventListener('message', onMessage);
    port.removeEventListener('close', onClose);
  };
  port.addEventListener('message', onMessage);
  port.addEventListener('close', onClose);

  ipcRenderer.postMessage('ollama.pull', model, [channel.port2]);

  port.start();
  return () => {
    port.postMessage('abort');
    port.close();
  };
}

type GenerateMessage =
  | {
      type: 'response';
      response: GenerateResponse;
    }
  | {
      type: 'chunk';
      chunk: Uint8Array;
    };

async function generate(
  model: string,
  messages: CoreMessage[],
  onBody: (chunk?: Uint8Array) => void,
) {
  const channel = new MessageChannel();
  const port = channel.port1;

  const promise = new Promise<GenerateResponse>((resolve) => {
    const onResponse = (event: MessageEvent<GenerateMessage>) => {
      if (event.data.type !== 'response') {
        return;
      }
      resolve(event.data.response);
      port.removeEventListener('message', onResponse);
    };
    port.addEventListener('message', onResponse);
  });

  const onMessage = (event: MessageEvent<GenerateMessage>) => {
    if (event.data.type !== 'chunk') {
      return;
    }
    onBody(event.data.chunk);
  };
  port.addEventListener('message', onMessage);

  const onClose = () => {
    onBody();
    port.removeEventListener('message', onMessage);
    port.removeEventListener('close', onClose);
  };
  port.addEventListener('close', onClose);

  ipcRenderer.postMessage(
    'ollama.generate',
    {
      model,
      messages,
    },
    [channel.port2],
  );

  port.start();

  const res = await promise;

  if (!res.hasBody) {
    onBody();
    return res;
  }

  return res;
}

const ollamaBridge = {
  setEndpointURL,
  pull,
  generate,
};

export type Ollama = typeof ollamaBridge;

export default ollamaBridge;
