# 🚀 QUICK START GUIDE

## ⚡ TL;DR - Chạy App Ngay

```bash
# 1. Install dependencies (lần đầu tiên)
npm install
npx playwright install chromium

# 2. Run app
npm run dev
```

**App sẽ tự động mở sau 3-5 giây!** ✨

---

## 🔧 TROUBLESHOOTING

### ❌ App mở nhưng màn hình trắng?

**Nguyên nhân:** Vite đang chạy trên port không được Electron detect.

**Fix:**

1. **Check port Vite đang chạy:**
   ```
   [0]   ➜  Local:   http://localhost:XXXX/
   ```

2. **Nếu port không phải 5173-5177 hoặc 8181-8182:**
   - Kill app (Ctrl+C)
   - Kill process đang chiếm port 5173:
     ```bash
     lsof -ti:5173 | xargs kill -9
     ```
   - Run lại: `npm run dev`

3. **Hoặc update ports trong `src/main/index.js` line 33:**
   ```javascript
   const ports = [5173, 5174, 5175, 5176, 5177, 8181, 8182, 3000, YOUR_PORT_HERE];
   ```

---

### ❌ Electron không start?

**Check terminal output:**

```bash
[1] Electron main process started
[1] ✅ Connected to Vite dev server on port XXXX
```

**Nếu không thấy dòng "Connected":**
- Electron đang thử connect nhưng chưa tìm thấy Vite
- Đợi thêm 2-3 giây
- Hoặc restart: Ctrl+C → `npm run dev`

---

### ❌ Module not found errors?

```bash
npm install
```

---

### ❌ Playwright browser not installed?

```bash
npx playwright install chromium
```

---

## 📋 VERIFICATION CHECKLIST

Trước khi commit/PR, đảm bảo:

- [ ] `npm install` chạy thành công (no errors)
- [ ] `npm run dev` khởi động app
- [ ] Electron window mở (không màn hình trắng)
- [ ] UI hiển thị đầy đủ (sidebar, header, main area)
- [ ] Click "Facebook" → hiện form login
- [ ] Click "Open Browser & Login" → Playwright browser mở
- [ ] No console errors trong DevTools

---

## 🎯 EXPECTED BEHAVIOR

### 1. Terminal Output

```
[0] VITE v5.4.21  ready in XXX ms
[0] ➜  Local:   http://localhost:5175/
[1] Electron main process started
[1] ✅ Connected to Vite dev server on port 5175
```

### 2. Electron Window

- ✅ Window opens (1200x800)
- ✅ Title: "Platform Cookie Extractor"
- ✅ Header với 🍪 icon
- ✅ Sidebar với 5 platforms
- ✅ Main area với welcome message
- ✅ DevTools mở sẵn (có thể đóng)

### 3. No Errors

- ✅ No red errors trong terminal
- ✅ No errors trong DevTools console
- ✅ No blank screen

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: "Port in use"

```
Port 5173 is in use, trying another one...
```

**Solution:** This is NORMAL! Vite tự động chuyển sang port khác. App vẫn hoạt động.

---

### Issue: Warning about module type

```
Warning: Module type of ... postcss.config.js is not specified
```

**Solution:** IGNORED - đã rename thành `.cjs` files. Warning sẽ biến mất.

---

### Issue: Browser không mở khi click "Open Browser"

**Check:**
1. Playwright đã install? → `npx playwright install chromium`
2. Check console có errors?
3. Try với platform khác (Twitter, Instagram)

---

## 🎬 DEMO WORKFLOW

1. **Start app:** `npm run dev`
2. **Wait 3-5 seconds** → Electron window appears
3. **Click "Facebook"** trong sidebar
4. **Enter account name:** "Test Account"
5. **Click "Open Browser & Login"**
6. **Playwright browser opens** → Login manually
7. **After login** → Click "Extract Cookies Now"
8. **Check Recent Sessions** → Session appears
9. **Click "Export"** → Choose format → Save

---

## 💡 DEVELOPMENT TIPS

### Fast Reload
- Change React code → Auto reload
- Change main process code → Need restart (Ctrl+C → `npm run dev`)

### Debug Mode
- React: DevTools already open
- Main process: Add `console.log()` → check terminal

### Port Management
- Vite auto-increments ports: 5173 → 5174 → 5175...
- Electron checks ports: 5173-5177, 8181-8182, 3000
- Total range: **8 ports** to check

---

## ✅ FINAL CHECKLIST BEFORE PR

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Test dev mode
npm run dev
# → Wait for app to open
# → Click around to verify UI
# → Ctrl+C to stop

# 3. Test build
npm run build
# → Should complete without errors

# 4. Verify files
ls -la src/main/index.js
ls -la src/renderer/App.jsx
ls -la postcss.config.cjs
ls -la tailwind.config.cjs

# 5. Commit
git add -A
git commit -m "Your message"
git push
```

---

## 🆘 STILL NOT WORKING?

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 18+
   ```

2. **Clear cache:**
   ```bash
   rm -rf node_modules package-lock.json dist .vite
   npm install
   ```

3. **Check system:**
   ```bash
   npx playwright install-deps  # Install system dependencies
   ```

4. **Last resort - full reset:**
   ```bash
   git clean -fdx
   npm install
   npx playwright install chromium
   npm run dev
   ```

---

**Questions?** Check console errors first, then review code changes.

**Success indicator:** 🎉 Electron window với UI đầy đủ, không errors!
