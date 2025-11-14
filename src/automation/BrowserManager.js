const { chromium, firefox, webkit } = require('playwright');

class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  /**
   * Launch browser and navigate to platform URL
   * @param {Object} options - Browser launch options
   * @param {string} options.url - Platform URL to navigate to
   * @param {boolean} options.headless - Run in headless mode
   * @param {string} options.proxy - Proxy server URL
   * @param {string} options.userAgent - Custom user agent
   */
  async launch(options = {}) {
    const {
      url,
      headless = false,
      proxy = null,
      userAgent = null,
      browserType = 'chromium',
    } = options;

    try {
      // Browser launch options
      const launchOptions = {
        headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled',
        ],
      };

      // Add proxy if provided
      if (proxy) {
        launchOptions.proxy = {
          server: proxy,
        };
      }

      // Select browser type
      let browserEngine;
      switch (browserType) {
        case 'firefox':
          browserEngine = firefox;
          break;
        case 'webkit':
          browserEngine = webkit;
          break;
        default:
          browserEngine = chromium;
      }

      // Launch browser
      this.browser = await browserEngine.launch(launchOptions);

      // Create context with options
      const contextOptions = {
        viewport: { width: 1280, height: 720 },
        userAgent:
          userAgent ||
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      };

      this.context = await this.browser.newContext(contextOptions);

      // Create page
      this.page = await this.context.newPage();

      // Navigate to URL
      if (url) {
        await this.page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        });
      }

      return {
        success: true,
        message: 'Browser launched successfully',
      };
    } catch (error) {
      console.error('Failed to launch browser:', error);
      await this.close();
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Extract cookies and storage data from the current page
   */
  async extractData() {
    console.log('Starting data extraction...');

    if (!this.page || !this.context) {
      console.error('Browser not initialized');
      throw new Error('Browser not initialized');
    }

    try {
      // Check if page is still valid
      if (this.page.isClosed()) {
        throw new Error('Browser page was closed');
      }

      console.log('Extracting cookies...');
      // Get cookies
      const cookies = await this.context.cookies();
      console.log(`Extracted ${cookies.length} cookies`);

      console.log('Extracting localStorage...');
      // Get localStorage
      const localStorage = await this.page.evaluate(() => {
        const data = {};
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          data[key] = window.localStorage.getItem(key);
        }
        return data;
      });
      console.log(`Extracted ${Object.keys(localStorage).length} localStorage items`);

      console.log('Extracting sessionStorage...');
      // Get sessionStorage
      const sessionStorage = await this.page.evaluate(() => {
        const data = {};
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          data[key] = window.sessionStorage.getItem(key);
        }
        return data;
      });
      console.log(`Extracted ${Object.keys(sessionStorage).length} sessionStorage items`);

      // Get current URL
      const currentUrl = this.page.url();
      console.log(`Current URL: ${currentUrl}`);

      // Get user agent
      const userAgent = await this.page.evaluate(() => navigator.userAgent);

      console.log('Data extraction completed successfully');
      return {
        success: true,
        data: {
          cookies,
          localStorage,
          sessionStorage,
          url: currentUrl,
          userAgent,
          extractedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Failed to extract data:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Wait for user to complete login (manual detection)
   * @param {number} timeout - Maximum wait time in milliseconds
   */
  async waitForLogin(timeout = 300000) {
    // 5 minutes default
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    try {
      // Wait for navigation or timeout
      // This is a simple implementation - you can enhance it with platform-specific checks
      await this.page.waitForLoadState('networkidle', { timeout });

      return {
        success: true,
        message: 'Login completed',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if user is logged in (platform-specific check can be added)
   */
  async isLoggedIn() {
    if (!this.page || !this.context || !this.browser) {
      console.log('Browser not initialized');
      return false;
    }

    try {
      // Check if browser is still connected
      if (!this.browser.isConnected()) {
        console.log('Browser not connected');
        return false;
      }

      // Check if page is still valid
      if (this.page.isClosed()) {
        console.log('Page is closed');
        return false;
      }

      // Get cookies
      const cookies = await this.context.cookies();
      console.log(`Found ${cookies.length} cookies`);

      // Check for meaningful cookies (not just empty cookies)
      const hasMeaningfulCookies = cookies.some(cookie =>
        cookie.value && cookie.value.length > 0
      );

      console.log(`Has meaningful cookies: ${hasMeaningfulCookies}`);
      return hasMeaningfulCookies;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  /**
   * Close the browser
   */
  async close() {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }

  /**
   * Get browser state
   */
  getState() {
    return {
      isRunning: this.browser !== null,
      hasPage: this.page !== null,
      currentUrl: this.page ? this.page.url() : null,
    };
  }
}

module.exports = BrowserManager;
