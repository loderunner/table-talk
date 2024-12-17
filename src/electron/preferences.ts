import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

import z from 'zod';

import { PartialSettings } from '@/app/SettingsProvider';

export function save(preferences: PartialSettings) {
  const userDataPath = app.getPath('userData');
  const preferencesPath = path.join(userDataPath, 'preferences.json');
  const preferencesData = JSON.stringify(preferences);
  fs.writeFileSync(preferencesPath, preferencesData);
}

const preferencesSchema = z
  .object({
    sqlite: z.object({
      filename: z.string(),
    }),
    ollama: z.object({
      url: z.string(),
    }),
  })
  .deepPartial() satisfies z.Schema<PartialSettings>;

export function load(): PartialSettings {
  const userDataPath = app.getPath('userData');
  const preferencesPath = path.join(userDataPath, 'preferences.json');
  const preferencesData = fs.readFileSync(preferencesPath).toString();
  const preferences = preferencesSchema.parse(JSON.parse(preferencesData));
  return preferences;
}
