import { MessagePortMain } from 'electron';

import { CoreMessage, streamText } from 'ai';
import { Ollama } from 'ollama';
import { OllamaProvider, createOllama } from 'ollama-ai-provider';

type ResolveType<T> = T extends Promise<infer U> ? U : never;

let client: Ollama = new Ollama();
let provider: OllamaProvider = createOllama();

export function setEndpointURL(url: string) {
  client = new Ollama({ host: url });
  provider = createOllama({ baseURL: `${url}/api` });
}

const _pullFunc = async () => client.pull({ model: '', stream: true });
export async function pull(port: MessagePortMain, model: string) {
  try {
    let it: ResolveType<ReturnType<typeof _pullFunc>> | undefined = undefined;
    const onAbort = () => {
      it?.abort();
    };
    port.once('message', onAbort);

    it = await client.pull({ model, stream: true });
    port.start();

    for await (const progress of it) {
      port.postMessage(progress);
    }
  } catch (error) {
    // ignore `AbortError`s
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      throw error;
    }
  } finally {
    port.close();
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
export async function generate(
  port: MessagePortMain,
  { model, messages }: GenerateArgs,
) {
  try {
    port.start();
    const stream = streamText({ model: provider(model), messages });
    const res = stream.toDataStreamResponse();

    port.postMessage({
      type: 'response',
      response: {
        status: res.status,
        statusText: res.statusText,
        headers: [...res.headers.entries()],
        hasBody: res.body !== null,
      },
    });

    if (res.body !== null) {
      const body = res.body;
      for await (const chunk of body) {
        port.postMessage({ type: 'chunk', chunk });
      }
    }
  } finally {
    port.close();
  }
}
