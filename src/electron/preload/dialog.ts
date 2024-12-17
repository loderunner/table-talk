import { OpenDialogOptions, ipcRenderer } from 'electron';

const dialogBridge = {
  showOpenDialog: (
    options?: OpenDialogOptions,
  ): Promise<string[] | undefined> =>
    ipcRenderer.invoke('dialog.showOpenDialog', options),
};

export type Dialog = typeof dialogBridge;

export default dialogBridge;
