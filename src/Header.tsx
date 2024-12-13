import { Button } from '@headlessui/react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center">
          <h1 className="text-2xl font-bold">SQL Chatbot</h1>
        </a>
        <a href="/settings">
          <Button>
            <span>Settings</span>
          </Button>
        </a>
      </div>
    </header>
  );
}
