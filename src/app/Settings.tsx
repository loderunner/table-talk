import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from '@headlessui/react';
import { Folder } from '@phosphor-icons/react';
import { MouseEventHandler, useCallback, useState } from 'react';
import { useLocation } from 'wouter';

import { defaultSettings, useSettings } from './SettingsProvider';

export default function Settings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useSettings();
  const [ollamaURL, setOllamaURL] = useState(settings?.ollama?.url ?? '');
  const [sqliteFilename, setSQLiteFilename] = useState(
    settings?.sqlite?.filename ?? '',
  );

  const onOpen = useCallback<MouseEventHandler<HTMLButtonElement>>(async () => {
    const filename = await dialog.showOpenDialog();
    if (filename === undefined || filename.length < 1) {
      return;
    }
    setSQLiteFilename(filename[0]);
  }, []);

  const onSave = useCallback(() => {
    setSettings({
      sqlite: {
        filename: sqliteFilename,
      },
      ollama: {
        url: ollamaURL,
      },
    });
    setLocation('/');
  }, [ollamaURL, setLocation, setSettings, sqliteFilename]);

  return (
    <form className="p-4" onSubmit={onSave}>
      <Fieldset className="space-y-8">
        <Legend className="text-lg font-bold">SQLite</Legend>
        <Field>
          <Label className="block">Filename</Label>
          <div className="flex gap-2">
            <Input
              className="block w-128"
              name="sqlite_filename"
              value={sqliteFilename}
              placeholder="Enter path to SQLite database..."
              onChange={(e) => setSQLiteFilename(e.target.value)}
            />
            <Button
              className="bg-gray-300 text-gray-800 hover:bg-gray-400"
              onClick={onOpen}
            >
              <Folder className="-mx-1 size-6" />
            </Button>
          </div>
        </Field>
      </Fieldset>
      <Fieldset className="space-y-8">
        <Legend className="text-lg font-bold">Ollama</Legend>
        <Field>
          <Label className="block">Endpoint URL</Label>
          <Input
            className="block w-128"
            name="ollama_endpoint_url"
            value={ollamaURL}
            placeholder={defaultSettings.ollama.url}
            onChange={(e) => setOllamaURL(e.target.value)}
          />
        </Field>
      </Fieldset>
      <div className="mt-8 flex justify-end gap-4">
        <Button
          className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          onClick={() => setLocation('/')}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
