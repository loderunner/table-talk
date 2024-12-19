import { Database, Sliders } from '@phosphor-icons/react';
import { Link } from 'wouter';

import { useOllama } from './OllamaContext';

import OllamaIcon from '@/assets/svg/ollama.svg?react';

export default function Header() {
  const { status } = useOllama();
  return (
    <header className="bg-black p-4 text-white">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-1 text-3xl font-bold">
          <Database />
          TableTalk
          <span className="text-xl font-thin italic text-gray-400">
            {' — '}Your data has something to say.
          </span>
        </h1>
        <div className="flex gap-2">
          {status === 'success' || (
            <div className="group relative">
              <OllamaIcon className="size-7 animate-pulse" />
              <div className="invisible absolute left-1/2 top-2 z-10 max-w-24 -translate-x-1/2 translate-y-full rounded border border-gray-800 bg-gray-900 px-2 py-1 text-center font-mono text-xs opacity-95 shadow-xl group-hover:visible">
                {status}
              </div>
            </div>
          )}
          <Link
            className="rounded-lg text-3xl"
            href="settings"
            aria-label="Settings"
          >
            <Sliders />
          </Link>
        </div>
      </div>
    </header>
  );
}
