import { MessagePortMain } from 'electron';

import { createOpenAI } from '@ai-sdk/openai';
import {
  CoreMessage,
  createDataStreamResponse,
  generateText,
  streamText,
} from 'ai';
import { RunResult } from 'better-sqlite3';
import { Ollama } from 'ollama';
import { OllamaProvider, createOllama } from 'ollama-ai-provider';

import * as sqlite from './sqlite';

type ResolveType<T> = T extends Promise<infer U> ? U : never;

let client: Ollama = new Ollama();
let provider: OllamaProvider = createOllama();

export function setEndpointURL(url: string) {
  client = new Ollama({ host: url });
  provider = createOpenAI({
    baseURL: `${url}/v1`,
    apiKey: 'ollama',
    compatibility: 'strict',
  });
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

function systemSQLMessage(schema: string): CoreMessage {
  return {
    role: 'system',
    content: `Given the following SQL schema:

\`\`\`sql
${schema}
\`\`\`

Respond with the SQL query that best answers the user's request. Use JOIN if
needed. Avoid subqueries. Respond only with SQL. Do not use markdown. Do not use
plain language.`,
  };
}

function systemExplainMessage(schema: string): CoreMessage {
  return {
    role: 'system',
    content: `Given the following SQL schema:

\`\`\`sql
${schema}
\`\`\`

Answer the user's question in plain language. Do not give SQL-related details.
Do not explain the query. Respond with Markdown.`,
  };
}

function userQueryMessage(query: string, results: any): CoreMessage {
  return {
    role: 'user',
    content: `## Query

\`\`\`sql
${query}
\`\`\`

## Results

\`\`\`
${JSON.stringify(results)}
\`\`\``,
  };
}

export async function generate(
  port: MessagePortMain,
  { model, messages }: GenerateArgs,
) {
  try {
    port.start();
    const schema = sqlite.getSchema() ?? '';

    const query = await generateText({
      model: provider(model),
      messages: [systemSQLMessage(schema), ...messages],
    });

    let res: unknown[] | RunResult | sqlite.SQLError;
    if (query.text.startsWith('SELECT')) {
      res = sqlite.select(query.text);
    } else {
      res = sqlite.execute(query.text);
    }

    const explainRes = createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeMessageAnnotation({ query: query.text });
        dataStream.writeMessageAnnotation({ results: res as any });

        const textStream = streamText({
          model: provider(model),
          messages: [
            systemExplainMessage(schema),
            ...messages.slice(0, -1),
            userQueryMessage(query.text, res),
            messages.at(-1)!,
          ],
        });

        textStream.mergeIntoDataStream(dataStream);
      },
    });

    port.postMessage({
      type: 'response',
      response: {
        status: explainRes.status,
        statusText: explainRes.statusText,
        headers: [...explainRes.headers.entries()],
        hasBody: explainRes.body !== null,
      },
    });

    if (explainRes.body !== null) {
      const body = explainRes.body;
      for await (const chunk of body) {
        port.postMessage({ type: 'chunk', chunk });
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    port.close();
  }
}
