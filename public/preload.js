const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;

const api = {
  onNewFile: (handleNewFile) => {
    ipcRenderer.on('new-file-click', async (_) => {
      handleNewFile();
    })
  },
  resetCurrentFile: () => {
    ipcRenderer.send('reset-current-file');
  },
  onFileOpen: (handleFileOpen) => {
    ipcRenderer.on('file-open-selected', async (_, filePath, fileName, content) => {
      handleFileOpen(filePath, fileName, content);
    });
  },
  confirmFileOpened: (filePath, content) => {
    ipcRenderer.send('update-open-file', filePath, content);
  },
  onFileUpload: (handleFileUpload) => {
    ipcRenderer.on('file-upload-selected', async (_, fileType, fileName, content) => {
      handleFileUpload(fileType, fileName, content);
    });
  },
  onFileDownload: (handleFileDownload) => {
    ipcRenderer.on('file-download-click', async (_, fileType) => {
      if (fileType === 'CSV') {
        handleFileDownload(fileType);
      } else {
        const content = await handleFileDownload(fileType);
        ipcRenderer.send('show-save-dialog', fileType, content);
      }
    });
  },
  onFileUpdate: (handleFileUpdate) => {
    ipcRenderer.on('has-unsaved-changes', (_, hasUnsavedChanges) => {
      handleFileUpdate(hasUnsavedChanges);
    });
  },
  onDirectorySelect: (handleDirectorySelect) => {
    ipcRenderer.send('show-directory-select-dialog');
    ipcRenderer.on('directory-selected', (_, filePath) => {
      handleDirectorySelect(filePath);
    });
  },
  onSaveFileClick: (handleSaveFile) => {
    ipcRenderer.on('file-save-click', () => {
      handleSaveFile(() => {});
    })
  },
  saveCurrentFile: (content) => {
    ipcRenderer.invoke('get-current-filepath').then((filePath) => {
      if (filePath === null) {
        ipcRenderer.send('show-save-dialog', 'SIM', content);
      } else {
        ipcRenderer.send('save-current-file', filePath, content);
      }
    });
  },
  onSaveConfirm: (callback) => {
    ipcRenderer.on('file-save-confirmed', callback);
  },
}
/*
  contextBridge exposes methods to the window object (accessed on a given API name).
  This is a security measure to prevent the renderer process from accessing the entire electron API.
 */
contextBridge.exposeInMainWorld('electronApi', api);