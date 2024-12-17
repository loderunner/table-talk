import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
} from '@headlessui/react';
import { useCallback, useState } from 'react';
import { useLocation } from 'wouter';

import { defaultSettings, useSettings } from './SettingsProvider';

export default function Settings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useSettings();
  const [ollamaURL, setOllamaURL] = useState(settings?.ollama?.url ?? '');

  const onSave = useCallback(() => {
    setSettings({
      ollama: {
        url: ollamaURL,
      },
    });
    setLocation('/');
  }, [ollamaURL, setLocation, setSettings]);

  return (
    <form className="p-4">
      <Fieldset className="space-y-8">
        <Legend className="text-lg font-bold">Ollama</Legend>
        <Field>
          <Label className="block">Endpoint URL</Label>
          <Input
            className="block"
            name="ollama_endpoint_url"
            value={ollamaURL}
            placeholder={defaultSettings.ollama.url}
            onChange={(e) => setOllamaURL(e.target.value)}
          />
        </Field>
      </Fieldset>
      <div className="flex justify-end gap-4">
        <Button
          className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          onClick={() => setLocation('/')}
        >
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </form>
  );
}
