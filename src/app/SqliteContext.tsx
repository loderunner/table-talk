/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useState } from 'react';

import { useSettings } from './SettingsProvider';
import { useAsyncEffect } from './useAsyncEffect';

type SQLiteState = {
  schema?: string;
  error?: string;
};

const Context = createContext<SQLiteState>({});

type Props = {
  children: ReactNode;
};

export function SQLiteProvider({ children }: Props) {
  const [, , settings] = useSettings();
  const [schema, setSchema] = useState<string>();
  const [error, setError] = useState<string>();

  useAsyncEffect(async () => {
    if (settings.sqlite?.filename === undefined) {
      return;
    }

    try {
      await sqlite.init(settings.sqlite?.filename);
      const schema = await sqlite.getSchema();
      setSchema(schema);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [settings.sqlite?.filename]);

  return <Context value={{ error, schema }}>{children}</Context>;
}

export function useOllama() {
  return useContext(Context);
}
