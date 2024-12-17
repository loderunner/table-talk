import { ipcRenderer } from 'electron';

import { PartialSettings } from '@/app/SettingsProvider';

async function save(prefs: PartialSettings) {
  await ipcRenderer.invoke('preferences.save', prefs);
}

async function load(): Promise<PartialSettings> {
  return await ipcRenderer.invoke('preferences.load');
}

const preferencesBridge = {
  save,
  load,
};

export type Preferences = typeof preferencesBridge;

export default preferencesBridge;
