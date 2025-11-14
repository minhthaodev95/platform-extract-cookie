const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const fs = require('fs').promises;
const BrowserManager = require('../automation/BrowserManager');
const { getPlatform } = require('../automation/platforms');

// Initialize electron-store for persistent data
const store = new Store();

let mainWindow;
let browserManager = null;

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    titleBarStyle: 'default',
    title: 'Platform Cookie Extractor',
  });

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ============================================
// IPC Handlers - Communication with renderer
// ============================================

// Get all sessions
ipcMain.handle('get-sessions', async () => {
  const sessions = store.get('sessions', []);
  return sessions;
});

// Save a new session
ipcMain.handle('save-session', async (event, sessionData) => {
  const sessions = store.get('sessions', []);
  const newSession = {
    id: Date.now().toString(),
    ...sessionData,
    createdAt: new Date().toISOString(),
  };
  sessions.unshift(newSession);
  store.set('sessions', sessions);
  return newSession;
});

// Delete a session
ipcMain.handle('delete-session', async (event, sessionId) => {
  const sessions = store.get('sessions', []);
  const filteredSessions = sessions.filter(s => s.id !== sessionId);
  store.set('sessions', filteredSessions);
  return true;
});

// Export session data to file
ipcMain.handle('export-session', async (event, { sessionId, format, exportPath }) => {
  try {
    const sessions = store.get('sessions', []);
    const session = sessions.find(s => s.id === sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    let content = '';
    let fileName = `${session.platform}_${session.accountName || 'unnamed'}_${Date.now()}`;

    switch (format) {
      case 'json':
        content = JSON.stringify(session.data, null, 2);
        fileName += '.json';
        break;

      case 'netscape':
        content = convertToNetscape(session.data.cookies);
        fileName += '.txt';
        break;

      case 'editthiscookie':
        content = JSON.stringify(session.data.cookies, null, 2);
        fileName += '.json';
        break;

      case 'javascript':
        content = `const cookies = ${JSON.stringify(session.data.cookies, null, 2)};\n\nexport default cookies;`;
        fileName += '.js';
        break;

      default:
        throw new Error('Unknown format');
    }

    // Show save dialog
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: path.join(exportPath || app.getPath('downloads'), fileName),
      filters: [
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (!canceled && filePath) {
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true, path: filePath };
    }

    return { success: false, canceled: true };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.message };
  }
});

// Helper: Convert cookies to Netscape format
function convertToNetscape(cookies) {
  let netscape = '# Netscape HTTP Cookie File\n';
  netscape += '# This is a generated file! Do not edit.\n\n';

  cookies.forEach(cookie => {
    const domain = cookie.domain || '';
    const flag = domain.startsWith('.') ? 'TRUE' : 'FALSE';
    const path = cookie.path || '/';
    const secure = cookie.secure ? 'TRUE' : 'FALSE';
    const expiration = cookie.expires || '0';
    const name = cookie.name || '';
    const value = cookie.value || '';

    netscape += `${domain}\t${flag}\t${path}\t${secure}\t${expiration}\t${name}\t${value}\n`;
  });

  return netscape;
}

// Open browser and extract cookies
ipcMain.handle('open-browser', async (event, { platform, options }) => {
  try {
    // Close existing browser if any
    if (browserManager) {
      await browserManager.close();
    }

    // Create new browser manager
    browserManager = new BrowserManager();

    // Get platform configuration
    const platformConfig = getPlatform(platform);
    if (!platformConfig) {
      return { success: false, error: 'Unknown platform' };
    }

    // Launch browser with options
    const result = await browserManager.launch({
      url: platformConfig.url,
      headless: options.headless || false,
      proxy: options.proxy || null,
    });

    if (result.success) {
      return {
        success: true,
        message: `Browser opened for ${platformConfig.name}. Please complete login manually.`,
        platform: platformConfig.name,
      };
    }

    return result;
  } catch (error) {
    console.error('Open browser error:', error);
    return { success: false, error: error.message };
  }
});

// Extract cookies from open browser
ipcMain.handle('extract-cookies', async () => {
  try {
    if (!browserManager) {
      return { success: false, error: 'No browser instance running' };
    }

    // Check if logged in
    const isLoggedIn = await browserManager.isLoggedIn();
    if (!isLoggedIn) {
      return {
        success: false,
        error: 'No cookies found. Please make sure you are logged in.',
      };
    }

    // Extract data
    const result = await browserManager.extractData();

    // Close browser after extraction
    await browserManager.close();
    browserManager = null;

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: `Extracted ${result.data.cookies.length} cookies successfully!`,
      };
    }

    return result;
  } catch (error) {
    console.error('Extract cookies error:', error);
    return { success: false, error: error.message };
  }
});

// Clean up browser on app quit
app.on('before-quit', async () => {
  if (browserManager) {
    await browserManager.close();
    browserManager = null;
  }
});

console.log('Electron main process started');
