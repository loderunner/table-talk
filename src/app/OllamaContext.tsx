/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useState } from 'react';

import { useSettings } from './SettingsProvider';
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

  useAsyncEffect(async () => {
    ollama.setEndpointURL(settings.ollama.url);
    const unsubscribe = await ollama.pull('llama3.2:1b', (p) => {
      setStatus(p.status);
    });

    return async () => {
      await unsubscribe();
    };
  }, [settings.ollama.url]);

  return <Context value={{ status }}>{children}</Context>;
}

export function useOllama() {
  return useContext(Context);
}
