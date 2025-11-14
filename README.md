# 🍪 Platform Cookie Extractor

A powerful macOS Electron app that helps you extract cookies and credentials from social media platforms using Playwright automation.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🌐 **Multi-Platform Support**: Facebook, Twitter, Instagram, LinkedIn, TikTok, and custom platforms
- 🔐 **Manual Login**: Complete control over the login process including 2FA
- 🍪 **Cookie Extraction**: Automatically extract cookies, localStorage, and sessionStorage
- 💾 **Multiple Export Formats**: JSON, Netscape, EditThisCookie, JavaScript
- 🎯 **Simple & Clean UI**: Intuitive interface built with React and TailwindCSS
- 🔒 **Local Storage**: All data stored securely on your machine
- 🎨 **Proxy Support**: Use proxy servers for each session
- 📊 **Session History**: Track and manage all your extraction sessions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- macOS (recommended) or Linux/Windows

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Development

```bash
# Start development server
npm run dev
```

This will start both the Vite dev server and Electron app.

### Build

```bash
# Build for macOS
npm run build
npm run build:mac
```

The built app will be in the `dist-electron` folder.

## 📖 How to Use

### 1. Select Platform

Click on any platform from the left sidebar (Facebook, Twitter, Instagram, LinkedIn, TikTok) or add a custom platform.

### 2. Configure Options

- **Account Name**: Give your account a name for easy identification
- **Use Proxy** (optional): Enter proxy URL if needed
- **Headless Mode** (optional): Run browser in background

### 3. Open Browser & Login

Click **"Open Browser & Login"** button. A browser window will open where you can:
- Enter your credentials manually
- Complete 2FA/verification
- Solve any captcas if present

### 4. Extract Cookies

Once you're logged in, return to the app and click **"I'm Logged In - Extract Cookies Now"**. The app will:
- Extract all cookies
- Capture localStorage and sessionStorage
- Save the session data

### 5. Export Data

From the **Recent Sessions** table at the bottom:
- Click **"Export"** on any session
- Choose your preferred format:
  - **JSON (Playwright/Puppeteer)**: Standard format for automation
  - **Netscape (cookies.txt)**: Compatible with curl, wget
  - **EditThisCookie**: For browser extensions
  - **JavaScript Object**: ES6 module export
- Select what to include (cookies, localStorage, sessionStorage, user agent)
- Save to your desired location

## 🏗️ Project Structure

```
platform-extract-cookie/
├── src/
│   ├── main/                   # Electron main process
│   │   └── index.js           # IPC handlers, window management
│   ├── renderer/              # React UI
│   │   ├── components/        # UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MainArea.jsx
│   │   │   ├── RecentSessions.jsx
│   │   │   └── ExportDialog.jsx
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # TailwindCSS styles
│   └── automation/            # Playwright automation
│       ├── BrowserManager.js  # Browser control logic
│       └── platforms/         # Platform-specific configs
│           └── index.js       # Platform definitions
├── package.json
├── vite.config.js             # Vite bundler config
└── tailwind.config.js         # TailwindCSS config
```

## 🛠️ Tech Stack

- **Electron** - Desktop app framework
- **React** - UI library
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **Playwright** - Browser automation
- **electron-store** - Persistent data storage

## 🔒 Security & Privacy

- ✅ All data is stored **locally** on your machine
- ✅ No data is sent to external servers
- ✅ Credentials are **never stored**, only cookies
- ✅ You have full control over the login process
- ⚠️ Use responsibly and only for accounts you own

## ⚠️ Disclaimer

This tool is intended for **personal use only** to manage your own accounts. Do not use it for:
- Unauthorized access to accounts
- Credential theft or phishing
- Violating platform Terms of Service
- Any malicious purposes

The developers are not responsible for misuse of this tool.

## 📝 Export Format Examples

### JSON (Playwright)
```json
{
  "cookies": [...],
  "localStorage": {...},
  "sessionStorage": {...},
  "url": "https://facebook.com",
  "userAgent": "Mozilla/5.0..."
}
```

### Netscape (cookies.txt)
```
# Netscape HTTP Cookie File
.facebook.com	TRUE	/	TRUE	1234567890	c_user	123456
.facebook.com	TRUE	/	TRUE	1234567890	xs	abc123...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Automation powered by [Playwright](https://playwright.dev/)
- UI styled with [TailwindCSS](https://tailwindcss.com/)

---

**Made with ❤️ for developers who need to manage multiple platform accounts**
