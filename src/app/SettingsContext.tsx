/* eslint-disable react-refresh/only-export-components */
import newDeepmerge from '@fastify/deepmerge';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

const deepmerge = newDeepmerge();

type DeepPartial<T> = T extends object
  ? Partial<{ [K in keyof T]: DeepPartial<T[K]> }>
  : T;

type Settings = {
  sqlite?: { filename: string };
  ollama: {
    url: string;
  };
};

type SettingsContext = [
  DeepPartial<Settings>,
  Dispatch<SetStateAction<DeepPartial<Settings>>>,
  Settings,
];

export const defaultSettings: Settings = {
  ollama: {
    url: 'http://localhost:11434',
  },
};

const Context = createContext<SettingsContext>([
  {},
  () => {},
  { ...defaultSettings },
]);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DeepPartial<Settings>>({});
  return (
    <Context
      value={[
        settings,
        (s) => setSettings(s),
        deepmerge(settings, defaultSettings) as Settings,
      ]}
    >
      {children}
    </Context>
  );
}

export function useSettings() {
  return useContext(Context);
}
