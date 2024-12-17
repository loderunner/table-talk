import { Button, Textarea } from '@headlessui/react';
import { useChat } from 'ai/react';
import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import Message from './Message';

import { GenerateResponse } from '@/electron/ollama';

async function fetchChat(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const onBody = async (chunk?: Uint8Array) => {
    try {
      if (chunk === undefined) {
        await writer.close();
        return;
      }
      await writer.write(chunk);
    } catch (error) {
      await writer.abort(error);
      throw error;
    }
  };

  let res: GenerateResponse;
  const body = init?.body;
  try {
    if (body === undefined || body === null) {
      res = await ollama.generate(
        'llama3.2:1b',
        JSON.parse(input.toString()).messages,
        onBody,
      );
    } else {
      res = await ollama.generate(
        'llama3.2:1b',
        JSON.parse(body.toString()).messages,
        onBody,
      );
    }
  } catch (error) {
    writer.abort(error);
    throw error;
  }

  return new Response(readable, res);
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      fetch: fetchChat,
    });
  const rows = useMemo(
    () =>
      // Limit maximum height to 8 rows
      Math.min(
        8,
        // Spread input string into array of characters for iteration
        [...input].reduce(
          // For each character, increment count only if it's a newline
          // Start count at 1 to account for the first row
          (count, char) => (char === '\n' ? count + 1 : count),
          1,
        ),
      ),
    [input],
  );

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    (e) => {
      if (e.code === 'Enter' && !e.shiftKey) {
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
      <div className="text-xl">Chat with your Database</div>
      <div className="flex-1 overflow-clip overflow-y-scroll" ref={ref}>
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <form className="flex items-end gap-4" onSubmit={handleSubmit}>
        <Textarea
          className="flex-grow resize-none"
          placeholder="Ask a question about your database..."
          disabled={isLoading}
          rows={rows}
          value={input}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}
