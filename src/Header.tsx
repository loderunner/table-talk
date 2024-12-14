import { Database, Sliders } from '@phosphor-icons/react';
import { Link } from 'wouter';

export default function Header() {
  return (
    <header className="bg-black p-4 text-white">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-1 text-3xl font-bold">
          <Database />
          SQL Chatbot
        </h1>
        <Link
          className="rounded-lg text-3xl"
          href="settings"
          aria-label="Settings"
        >
          <Sliders />
        </Link>
      </div>
    </header>
  );
}
