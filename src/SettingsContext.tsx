/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import newDeepmerge from '@fastify/deepmerge';

const deepmerge = newDeepmerge();

type DeepPartial<T> = T extends object
  ? Partial<{ [K in keyof T]: DeepPartial<T[K]> }>
  : T;

type Settings = {
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
