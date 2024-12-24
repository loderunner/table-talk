import { Button } from '@headlessui/react';
import { CaretDown } from '@phosphor-icons/react';
import { JSONValue } from 'ai';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

export type Props = {
  annotations: JSONValue[];
};

const MotionCaretDown = motion.create(CaretDown);

export default function Annotations({ annotations }: Props) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button
        className="mt-4 flex items-center gap-1 bg-transparent p-0 text-left text-xs text-gray-600 hover:bg-transparent"
        onClick={() => setShow(!show)}
      >
        <MotionCaretDown
          animate={{ rotate: show ? '180deg' : 0 }}
          transition={{ type: 'tween' }}
        />
        {show ? 'Hide query details' : 'Show query details'}
      </Button>
      <AnimatePresence>
        {show && (
          <motion.div
            className="flex flex-col overflow-auto"
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'initial' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {annotations
              .filter(
                (a): a is { query: string } =>
                  typeof a === 'object' && a !== null && 'query' in a,
              )
              .map((a, i) => (
                <Markdown
                  key={i}
                  className="prose prose-high-contrast mt-4 select-text overflow-hidden prose-code:before:content-none prose-code:after:content-none"
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: (props) => <pre className="hljs" {...props} />,
                  }}
                >
                  {`\`\`\`sql\n${a.query}\n\`\`\``}
                </Markdown>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
