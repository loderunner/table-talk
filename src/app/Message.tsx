import * as ai from 'ai';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

type Props = {
  message: ai.Message;
};

function TextMessage({ message }: Props) {
  return (
    <Markdown
      className={`prose prose-high-contrast prose-code:before:content-none prose-code:after:content-none ${message.role === 'user' ? '!prose-invert' : ''}`}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre: (props) => <pre className="hljs" {...props} />,
      }}
    >
      {message.content}
    </Markdown>
  );
}

function ToolMessage({ message }: Props) {
  const invocation = message.toolInvocations![0];
  const md = `### SQL
${invocation.args.sql}

### Rows
${message.content}`;

  return (
    <pre
      className={`hljs prose prose-high-contrast prose-code:before:content-none prose-code:after:content-none`}
    >
      <code>{invocation.args.sql}</code>
    </pre>
  );
}

export default function Message({ message }: Props) {
  return (
    <div
      className={`${message.role === 'user' ? 'self-end text-end' : 'self-start text-start'} select-text rounded-lg px-4 py-2 ${
        message.role === 'user' ? 'bg-gray-900' : 'bg-gray-300'
      }`}
    >
      <TextMessage message={message} />
    </div>
  );
}
