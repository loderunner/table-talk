import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
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
          SQL Chatbot
        </h1>
        <div className="flex gap-2">
          {status === 'success' || (
            <OllamaIcon className="size-7 animate-pulse" />
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
