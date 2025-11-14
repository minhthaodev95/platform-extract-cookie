const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Session management
  getSessions: () => ipcRenderer.invoke('get-sessions'),
  saveSession: (sessionData) => ipcRenderer.invoke('save-session', sessionData),
  deleteSession: (sessionId) => ipcRenderer.invoke('delete-session', sessionId),
  exportSession: (data) => ipcRenderer.invoke('export-session', data),

  // Browser automation
  openBrowser: (data) => ipcRenderer.invoke('open-browser', data),
  extractCookies: () => ipcRenderer.invoke('extract-cookies'),
  closeBrowser: () => ipcRenderer.invoke('close-browser'),
});
