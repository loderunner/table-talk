import { ipcRenderer } from 'electron';

async function init(location: string): Promise<void> {
  return await ipcRenderer.invoke('sqlite.init', location);
}

async function getSchema(): Promise<string | undefined> {
  return await ipcRenderer.invoke('sqlite.getSchema');
}

const sqliteBridge = {
  init,
  getSchema,
};

export type SQLite = typeof sqliteBridge;

export default sqliteBridge;
