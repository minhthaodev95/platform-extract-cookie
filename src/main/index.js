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
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    title: 'Platform Cookie Extractor',
  });

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    // Try multiple ports for Vite dev server (dynamic port support)
    const ports = [5180, 5181, 5182, 5183, 5184];
    const loadDevServer = async () => {
      for (const port of ports) {
        try {
          const url = `http://localhost:${port}`;
          await mainWindow.loadURL(url);
          console.log(`✅ Connected to Vite dev server on port ${port}`);
          mainWindow.webContents.openDevTools();
          return;
        } catch (error) {
          console.log(`❌ Port ${port} not available, trying next...`);
        }
      }
      console.error('❌ Could not connect to Vite dev server on any port');
      // Show error dialog to user
      const { dialog } = require('electron');
      dialog.showErrorBox(
        'Dev Server Not Found',
        'Could not connect to Vite dev server. Make sure it is running.'
      );
    };
    loadDevServer();
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
  console.log('========================================');
  console.log('Extract cookies IPC handler called');
  console.log('========================================');

  try {
    if (!browserManager) {
      console.error('❌ No browser instance running');
      return { success: false, error: 'No browser instance running. Please open the browser first.' };
    }

    console.log('✓ Browser manager exists');

    // Check if logged in
    console.log('Checking if user is logged in...');
    const isLoggedIn = await browserManager.isLoggedIn();
    console.log(`Login check result: ${isLoggedIn}`);

    if (!isLoggedIn) {
      console.error('❌ User not logged in or no cookies found');
      return {
        success: false,
        error: 'No cookies found. Please make sure you are fully logged in to the platform.',
      };
    }

    console.log('✓ User is logged in, extracting data...');

    // Extract data
    const result = await browserManager.extractData();

    if (!result.success) {
      console.error('❌ Data extraction failed:', result.error);
      return result;
    }

    console.log('✓ Data extraction successful');
    console.log(`Extracted ${result.data.cookies.length} cookies`);

    // Close browser after extraction
    console.log('Closing browser...');
    await browserManager.close();
    browserManager = null;
    console.log('✓ Browser closed');

    console.log('========================================');
    console.log('Extraction completed successfully!');
    console.log('========================================');

    return {
      success: true,
      data: result.data,
      message: `Extracted ${result.data.cookies.length} cookies successfully!`,
    };
  } catch (error) {
    console.error('========================================');
    console.error('❌ Extract cookies error:', error);
    console.error('========================================');
    return { success: false, error: error.message };
  }
});

// Close browser manually without extracting
ipcMain.handle('close-browser', async () => {
  console.log('Close browser IPC handler called');
  try {
    if (!browserManager) {
      return { success: false, error: 'No browser instance running' };
    }

    console.log('Closing browser...');
    await browserManager.close();
    browserManager = null;
    console.log('✓ Browser closed successfully');

    return { success: true, message: 'Browser closed successfully' };
  } catch (error) {
    console.error('❌ Error closing browser:', error);
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
