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

import { useAsyncEffect } from './useAsyncEffect';

const deepmerge = newDeepmerge();

type DeepPartial<T> = T extends object
  ? Partial<{ [K in keyof T]: DeepPartial<T[K]> }>
  : T;

export type Settings = {
  sqlite?: { filename: string };
  ollama: {
    url: string;
  };
};

export type PartialSettings = DeepPartial<Settings>;

type SettingsContext = [
  PartialSettings,
  Dispatch<SetStateAction<PartialSettings>>,
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

let settingsPromise: Promise<PartialSettings> | undefined = undefined;
export function loadSettings(): Promise<PartialSettings> {
  if (settingsPromise === undefined) {
    settingsPromise = preferences.load().catch(() => ({}));
  }
  return settingsPromise;
}

type Props = {
  initialSettings: PartialSettings;
  children: ReactNode;
};

export default function SettingsProvider({ children, initialSettings }: Props) {
  const [settings, setSettings] =
    useState<DeepPartial<Settings>>(initialSettings);
  useAsyncEffect(() => preferences.save(settings), [settings]);
  return (
    <Context
      value={[
        settings,
        setSettings,
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
