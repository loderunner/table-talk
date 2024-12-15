/* eslint-disable react-refresh/only-export-components */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useSettings } from './SettingsContext';

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
  console.log('rendering');
  const [, , settings] = useSettings();
  const [status, setStatus] = useState('');
  const [completed, setCompleted] = useState<number>();
  const [total, setTotal] = useState<number>();

  useEffect(() => {
    console.log('useEffect');
    const unsubscribe = ollama.onProgress((p) => {
      console.log('onProgress');
      setStatus(p.status);
      setCompleted(p.completed);
      setTotal(p.total);
    });

    ollama.setEndpointURL(settings.ollama.url);

    return () => {
      console.log('unsubscribe');
      unsubscribe();
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
