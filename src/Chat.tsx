import { Button, Textarea } from '@headlessui/react';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
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
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
      <div className="text-xl">Chat with your Database</div>
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
                className={`inline-block select-text rounded-lg px-4 py-2 ${
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
          className="flex-grow resize-none"
          placeholder="Ask a question about your database..."
          disabled={loading}
          rows={rows}
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <Button onClick={send} disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
