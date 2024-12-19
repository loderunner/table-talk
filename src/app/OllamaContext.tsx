/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useState } from 'react';

import { useSettings } from './SettingsProvider';
import { useAsyncEffect } from './useAsyncEffect';

export const model = 'llama3.2';

type OllamaState = {
  status?: string;
  error?: string;
};

const Context = createContext<OllamaState>({});

type Props = {
  children: ReactNode;
};

export function OllamaProvider({ children }: Props) {
  const [, , settings] = useSettings();
  const [status, setStatus] = useState<string>();
  const [error, setError] = useState<string>();

  useAsyncEffect(async () => {
    try {
      await ollama.setEndpointURL(settings.ollama.url);
      const unsubscribe = await ollama.pull(model, (p) => {
        setStatus(p.status);
      });

      return async () => {
        await unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [settings.ollama.url]);

  return <Context value={{ status, error }}>{children}</Context>;
}

export function useOllama() {
  return useContext(Context);
}
