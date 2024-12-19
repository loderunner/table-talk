import { MessagePortMain } from 'electron';

import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';
import { Ollama } from 'ollama';
import { OllamaProvider, createOllama } from 'ollama-ai-provider';
import { z } from 'zod';

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

Perform the best SQL query that best answers the user's request If the query is
a SELECT, use \`select\`. Otherwise, use
\`execute\`. Respond with a complete SQL query. Use JOINs if needed. Avoid subqueries.

Answer the user's request using the results from the tool call. Do not explain the
query, nor any SQL details. Answer in natural language.`,
  };
}

export async function generate(
  port: MessagePortMain,
  { model, messages }: GenerateArgs,
) {
  try {
    port.start();
    const schema = sqlite.getSchema() ?? '';

    const stream = streamText({
      model: provider(model),
      messages: [systemSQLMessage(schema), ...messages],
      tools: {
        select: {
          type: 'function',
          description:
            'Run the SQL query against the database and return the rows.',
          parameters: z
            .object({
              sql: z.string().describe('the SQL statement to execute.'),
              // params: z
              //   .array()
              //   .describe('The parameters to bind to the query'),
            })
            .strict(),
          execute: async ({ sql }) => sqlite.select(sql) ?? 'No data.',
        },
        execute: {
          type: 'function',
          description:
            'Execute the SQL statement against the database. No return data.',
          parameters: z
            .object({
              sql: z.string().describe('the SQL statement to execute.'),
            })
            .strict(),
          execute: async ({ sql }) => sqlite.execute(sql) ?? 'No data.',
        },
        // pragma: {
        //   type: 'function',
        //   description:
        //     'Execute the SQLite pragma against the database and return its result. Example usage: `pragma("cache_size = 32000")`',
        //   parameters: z.object({
        //     pragma: z.string().describe('the pragma to execute'),
        //   }),
        //   execute: async ({ pragma }) => sqlite.pragma(pragma) ?? 'No data.',
        // },
      },
      maxSteps: 10,
      temperature: 1,
    });

    const explainRes = stream.toDataStreamResponse();

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
        console.log(new TextDecoder().decode(chunk));
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
