import { Button, Textarea } from '@headlessui/react';
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEventHandler,
  KeyboardEventHandler,
} from 'react';
import Markdown from 'react-markdown';
import remarkGFM from 'remark-gfm';

export default function Chat() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);
  const [input, setInput] = useState('');
  const rows = useMemo(
    () =>
      Math.min(
        8,
        [...input].reduce(
          (count, char) => (char === '\n' ? count + 1 : count),
          1,
        ),
      ),
    [input],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        role: 'user',
        content: 'Show me all users who signed up in the last month.',
      },
      {
        role: 'assistant',
        content:
          "I've queried the database for users who signed up in the last month. Here's what I found:\n\nThere are 3 users who signed up in the last month:\n\n1. John Doe (john@example.com) - signed up on May 15, 2023\n2. Jane Smith (jane@example.com) - signed up on May 20, 2023\n3. Bob Johnson (bob@example.com) - signed up on May 25, 2023\n\nIs there anything specific you'd like to know about these users?",
      },
    ]);
  }, []);

  const onChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (e) => setInput(e.target.value),
    [],
  );
  const send = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setInput('');
    setLoading(false);
  }, []);
  const onKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    (e) => {
      if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send],
  );

  return (
    <div className="flex size-full flex-col gap-2">
      <div className="select-none text-2xl font-bold">
        Chat with your Database
      </div>
      <div className="flex-1 overflow-clip overflow-y-scroll">
        <div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block rounded-lg px-4 py-2 ${
                  message.role === 'user' ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              >
                <Markdown
                  className={`prose prose-high-contrast ${message.role === 'user' ? '!prose-invert' : ''}`}
                  remarkPlugins={[remarkGFM]}
                >
                  {message.content}
                </Markdown>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-4">
        <Textarea
          className="flex-grow resize-none rounded-lg border px-4 py-2 ring-gray-400 ring-offset-2 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400"
          placeholder="Ask a question about your database..."
          disabled={loading}
          rows={rows}
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <Button
          className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:bg-gray-600 disabled:text-gray-100"
          onClick={send}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
