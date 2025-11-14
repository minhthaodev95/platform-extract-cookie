/**
 * Platform configurations for cookie extraction
 * Each platform has specific URLs and login detection logic
 */

const PLATFORMS = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com',
    loginUrl: 'https://www.facebook.com/login',

    /**
     * Check if user is logged in to Facebook
     * @param {Page} page - Playwright page object
     */
    async isLoggedIn(page) {
      try {
        // Check for Facebook-specific cookies or elements
        const cookies = await page.context().cookies();
        const hasFacebookCookie = cookies.some(
          (cookie) => cookie.name === 'c_user' || cookie.name === 'xs'
        );

        if (hasFacebookCookie) {
          return true;
        }

        // Check for logged-in UI elements
        const loggedInElement = await page.$('[aria-label="Account"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    /**
     * Get login instructions
     */
    getInstructions() {
      return [
        'Enter your email/phone and password',
        'Complete any 2FA verification if required',
        'Wait for the main Facebook page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  twitter: {
    id: 'twitter',
    name: 'Twitter',
    url: 'https://twitter.com',
    loginUrl: 'https://twitter.com/i/flow/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasTwitterCookie = cookies.some(
          (cookie) => cookie.name === 'auth_token'
        );

        if (hasTwitterCookie) {
          return true;
        }

        const loggedInElement = await page.$('[data-testid="SideNav_AccountSwitcher_Button"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your username/email/phone',
        'Enter your password',
        'Complete any verification steps',
        'Wait for Twitter home page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  instagram: {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com',
    loginUrl: 'https://www.instagram.com/accounts/login/',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasInstagramCookie = cookies.some(
          (cookie) => cookie.name === 'sessionid'
        );

        if (hasInstagramCookie) {
          return true;
        }

        const loggedInElement = await page.$('a[href*="/direct/inbox/"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your username and password',
        'Complete any 2FA verification',
        'Click "Not Now" on save password prompts',
        'Wait for Instagram home page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com',
    loginUrl: 'https://www.linkedin.com/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasLinkedInCookie = cookies.some(
          (cookie) => cookie.name === 'li_at'
        );

        if (hasLinkedInCookie) {
          return true;
        }

        const loggedInElement = await page.$('.global-nav__me').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your email and password',
        'Complete any security verification',
        'Wait for LinkedIn feed to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    loginUrl: 'https://www.tiktok.com/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasTikTokCookie = cookies.some(
          (cookie) => cookie.name === 'sessionid' || cookie.name === 'sid_tt'
        );

        if (hasTikTokCookie) {
          return true;
        }

        const loggedInElement = await page.$('[data-e2e="profile-icon"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Choose your login method (email, phone, or QR code)',
        'Complete the login process',
        'Verify your account if needed',
        'Wait for TikTok main page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },
};

/**
 * Get platform configuration by ID
 * @param {string} platformId
 */
function getPlatform(platformId) {
  return PLATFORMS[platformId] || null;
}

/**
 * Get all available platforms
 */
function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

module.exports = {
  PLATFORMS,
  getPlatform,
  getAllPlatforms,
};
