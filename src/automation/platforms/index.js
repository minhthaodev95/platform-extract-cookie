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

  youtube: {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    loginUrl: 'https://accounts.google.com/signin',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasYouTubeCookie = cookies.some(
          (cookie) => cookie.name === 'SSID' || cookie.name === 'APISID' || cookie.name === 'SID'
        );

        if (hasYouTubeCookie) {
          return true;
        }

        const loggedInElement = await page.$('#avatar-btn').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Sign in with your Google account',
        'Enter your email and password',
        'Complete any 2-step verification',
        'Wait for YouTube home page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  reddit: {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com',
    loginUrl: 'https://www.reddit.com/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasRedditCookie = cookies.some(
          (cookie) => cookie.name === 'reddit_session' || cookie.name === 'token_v2'
        );

        if (hasRedditCookie) {
          return true;
        }

        const loggedInElement = await page.$('#USER_DROPDOWN_ID').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your username and password',
        'Complete any verification steps',
        'Wait for Reddit home page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    url: 'https://www.pinterest.com',
    loginUrl: 'https://www.pinterest.com/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasPinterestCookie = cookies.some(
          (cookie) => cookie.name === '_auth' || cookie.name === '_pinterest_sess'
        );

        if (hasPinterestCookie) {
          return true;
        }

        const loggedInElement = await page.$('[data-test-id="header-profile"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your email and password',
        'Complete any verification if required',
        'Wait for Pinterest home feed to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  discord: {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com/app',
    loginUrl: 'https://discord.com/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasDiscordCookie = cookies.some(
          (cookie) => cookie.name === '__dcfduid' || cookie.name === '__sdcfduid'
        );

        if (hasDiscordCookie) {
          return true;
        }

        const loggedInElement = await page.$('[class*="sidebar"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your email and password',
        'Complete any 2FA verification',
        'Wait for Discord app to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  twitch: {
    id: 'twitch',
    name: 'Twitch',
    url: 'https://www.twitch.tv',
    loginUrl: 'https://www.twitch.tv/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasTwitchCookie = cookies.some(
          (cookie) => cookie.name === 'auth-token' || cookie.name === 'persistent'
        );

        if (hasTwitchCookie) {
          return true;
        }

        const loggedInElement = await page.$('[data-a-target="user-menu-toggle"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your username and password',
        'Complete any 2FA verification',
        'Wait for Twitch home page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  github: {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    loginUrl: 'https://github.com/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasGitHubCookie = cookies.some(
          (cookie) => cookie.name === 'user_session' || cookie.name === 'logged_in'
        );

        if (hasGitHubCookie) {
          return true;
        }

        const loggedInElement = await page.$('[data-target="react-app.embeddedData"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your username/email and password',
        'Complete any 2FA verification',
        'Wait for GitHub dashboard to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  amazon: {
    id: 'amazon',
    name: 'Amazon',
    url: 'https://www.amazon.com',
    loginUrl: 'https://www.amazon.com/ap/signin',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasAmazonCookie = cookies.some(
          (cookie) => cookie.name === 'session-id' || cookie.name === 'ubid-main'
        );

        if (hasAmazonCookie) {
          return true;
        }

        const loggedInElement = await page.$('#nav-link-accountList').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your email or phone number',
        'Enter your password',
        'Complete any verification steps',
        'Wait for Amazon home page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  netflix: {
    id: 'netflix',
    name: 'Netflix',
    url: 'https://www.netflix.com',
    loginUrl: 'https://www.netflix.com/login',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasNetflixCookie = cookies.some(
          (cookie) => cookie.name === 'NetflixId' || cookie.name === 'SecureNetflixId'
        );

        if (hasNetflixCookie) {
          return true;
        }

        const loggedInElement = await page.$('.profile-gate-container, .browse-container').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your email and password',
        'Select a profile if prompted',
        'Wait for Netflix browse page to load',
        'Return here and click "Extract Cookies"',
      ];
    },
  },

  google: {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com',
    loginUrl: 'https://accounts.google.com/signin',

    async isLoggedIn(page) {
      try {
        const cookies = await page.context().cookies();
        const hasGoogleCookie = cookies.some(
          (cookie) => cookie.name === 'SID' || cookie.name === 'SSID' || cookie.name === 'APISID'
        );

        if (hasGoogleCookie) {
          return true;
        }

        const loggedInElement = await page.$('a[aria-label*="Google Account"]').catch(() => null);
        return loggedInElement !== null;
      } catch (error) {
        return false;
      }
    },

    getInstructions() {
      return [
        'Enter your Google email',
        'Enter your password',
        'Complete any 2-step verification',
        'Wait for Google home page to load',
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
