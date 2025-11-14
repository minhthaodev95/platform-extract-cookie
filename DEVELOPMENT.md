# 🛠️ Development Guide

## Hướng Dẫn Phát Triển Chi Tiết

### Cài Đặt Môi Trường

```bash
# 1. Clone repository
git clone <your-repo-url>
cd platform-extract-cookie

# 2. Cài đặt dependencies
npm install

# 3. Cài đặt Playwright browsers
npx playwright install chromium

# Optional: Install all browsers (chromium, firefox, webkit)
npx playwright install
```

### Chạy Ứng Dụng

#### Development Mode

```bash
# Chạy app trong development mode với hot reload
npm run dev
```

Lệnh này sẽ:
1. Start Vite dev server tại `http://localhost:5173`
2. Tự động mở Electron app
3. Bật DevTools để debug
4. Hot reload khi code thay đổi

#### Production Build

```bash
# Build React app
npm run build

# Build macOS application
npm run build:mac
```

Output sẽ ở trong folder `dist-electron/`

### Cấu Trúc Project

```
platform-extract-cookie/
├── src/
│   ├── main/                          # Electron Main Process
│   │   └── index.js                  # Entry point, IPC handlers
│   │
│   ├── renderer/                     # React UI (Renderer Process)
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Platform selection sidebar
│   │   │   ├── MainArea.jsx         # Main content area
│   │   │   ├── RecentSessions.jsx   # Session history table
│   │   │   └── ExportDialog.jsx     # Export format dialog
│   │   ├── App.jsx                   # Main React component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # TailwindCSS styles
│   │
│   └── automation/                   # Playwright Automation
│       ├── BrowserManager.js         # Browser control class
│       └── platforms/
│           └── index.js              # Platform configurations
│
├── package.json                       # Dependencies & scripts
├── vite.config.js                    # Vite bundler config
├── tailwind.config.js                # TailwindCSS config
└── postcss.config.js                 # PostCSS config
```

### Workflow Phát Triển

#### 1. Thêm Platform Mới

Mở file `src/automation/platforms/index.js`:

```javascript
const PLATFORMS = {
  // ... existing platforms

  yourplatform: {
    id: 'yourplatform',
    name: 'Your Platform',
    url: 'https://yourplatform.com',
    loginUrl: 'https://yourplatform.com/login',

    async isLoggedIn(page) {
      // Logic để check user đã login chưa
      const cookies = await page.context().cookies();
      return cookies.some(c => c.name === 'session_cookie_name');
    },

    getInstructions() {
      return [
        'Step 1: Enter credentials',
        'Step 2: Complete 2FA',
        // ...
      ];
    },
  },
};
```

Sau đó update Sidebar component để hiển thị platform mới.

#### 2. Thêm Export Format Mới

Mở file `src/main/index.js`, tìm handler `export-session`:

```javascript
case 'your-format':
  content = convertToYourFormat(session.data.cookies);
  fileName += '.yourext';
  break;
```

Thêm format vào `src/renderer/components/ExportDialog.jsx`:

```javascript
const EXPORT_FORMATS = [
  // ... existing formats
  {
    id: 'your-format',
    name: 'Your Format Name',
    description: 'Description of your format',
    extension: '.yourext',
  },
];
```

#### 3. Customize UI

Styles được quản lý bởi TailwindCSS trong `src/renderer/index.css`.

Colors có thể customize trong `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#yourcolor',
      success: '#yourcolor',
      // ...
    },
  },
}
```

### IPC Communication

#### Renderer -> Main

```javascript
// In React component
const { ipcRenderer } = window.require('electron');

// Call handler
const result = await ipcRenderer.invoke('handler-name', data);
```

#### Main -> Renderer (Event)

```javascript
// In main/index.js
mainWindow.webContents.send('event-name', data);

// In React component
ipcRenderer.on('event-name', (event, data) => {
  console.log(data);
});
```

### Debugging

#### Debug Renderer Process (React)

1. App tự động mở DevTools trong dev mode
2. Hoặc nhấn `Cmd+Option+I` (macOS)
3. Console logs sẽ hiện trong DevTools

#### Debug Main Process (Electron)

1. Thêm `console.log()` trong `src/main/index.js`
2. Logs sẽ hiện trong terminal nơi bạn chạy `npm run dev`
3. Hoặc dùng VS Code debugger

#### Debug Playwright

```javascript
// In BrowserManager.js
await page.pause(); // Pause execution
await page.screenshot({ path: 'debug.png' }); // Take screenshot
```

### Testing Flow

1. **Start app**: `npm run dev`
2. **Select platform**: Click Facebook/Twitter/etc
3. **Configure**: Enter account name, proxy (optional)
4. **Open browser**: Click "Open Browser & Login"
5. **Login manually**: Complete login in opened browser
6. **Extract**: Click "I'm Logged In - Extract Cookies Now"
7. **Verify**: Check Recent Sessions table
8. **Export**: Click Export, select format, save file

### Common Issues

#### 1. Playwright Browser Không Mở

```bash
# Reinstall browsers
npx playwright install chromium --force
```

#### 2. Electron Không Start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Vite HMR Không Hoạt Động

- Check port 5173 không bị conflict
- Restart dev server

#### 4. Cookies Không Extract Được

- Đảm bảo đã login thành công trong browser
- Check browser console có errors
- Verify platform-specific cookies trong `platforms/index.js`

### Performance Tips

- Use headless mode cho batch operations
- Limit concurrent browser instances
- Clear old sessions periodically
- Use proxy rotation để tránh rate limits

### Security Considerations

- ⚠️ Không commit cookies/sessions vào git
- ⚠️ electron-store lưu plain text, cân nhắc encryption
- ⚠️ Validate input để tránh XSS trong proxy URL
- ⚠️ Review exported files trước khi share

### Building for Production

```bash
# Build và tạo DMG installer cho macOS
npm run build
npm run build:mac

# Output: dist-electron/Platform Cookie Extractor-1.0.0.dmg
```

### Next Steps

- [ ] Add encryption cho stored sessions
- [ ] Implement auto-update
- [ ] Add batch extraction mode
- [ ] Support Windows/Linux builds
- [ ] Add tests (Jest + Playwright Test)
- [ ] Improve error handling
- [ ] Add logging system

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📞 Support

Nếu gặp vấn đề, tạo issue trên GitHub repository.
