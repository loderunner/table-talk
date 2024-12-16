/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useState } from 'react';

import { useSettings } from './SettingsContext';
import { useAsyncEffect } from './useAsyncEffect';

type OllamaState = {
  status: string;
  downloaded?: number;
  total?: number;
};

const Context = createContext<OllamaState>({ status: '' });

type Props = {
  children: ReactNode;
};

export function OllamaProvider({ children }: Props) {
  const [, , settings] = useSettings();
  const [status, setStatus] = useState('');
  const [completed, setCompleted] = useState<number>();
  const [total, setTotal] = useState<number>();

  useAsyncEffect(async () => {
    ollama.setEndpointURL(settings.ollama.url);
    const unsubscribe = await ollama.pull('llama3.2:1b', (p) => {
      console.log('progress', p);
      setStatus(p.status);
      setCompleted(p.completed);
      setTotal(p.total);
    });

    return async () => {
      await unsubscribe();
    };
  }, [settings.ollama.url]);

  return (
    <Context value={{ status, downloaded: completed, total }}>
      {children}
    </Context>
  );
}

export function useOllama() {
  return useContext(Context);
}
