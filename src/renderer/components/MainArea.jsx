import React, { useState } from 'react';

// Utility function to validate proxy URL
function validateProxyUrl(url) {
  if (!url) return { valid: false, error: 'Proxy URL is required when proxy is enabled' };

  // Check if URL starts with valid proxy protocols
  const validProtocols = ['http://', 'https://', 'socks4://', 'socks5://'];
  const hasValidProtocol = validProtocols.some(protocol => url.toLowerCase().startsWith(protocol));

  if (!hasValidProtocol) {
    return {
      valid: false,
      error: 'Proxy URL must start with http://, https://, socks4://, or socks5://'
    };
  }

  // Basic URL format check
  try {
    new URL(url);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: 'Invalid proxy URL format' };
  }
}

// Utility function to validate account name
function validateAccountName(name) {
  if (!name) return { valid: true }; // Optional field

  if (name.length > 50) {
    return { valid: false, error: 'Account name must be 50 characters or less' };
  }

  // Check for potentially dangerous characters
  const dangerousChars = /[<>\"'`]/;
  if (dangerousChars.test(name)) {
    return { valid: false, error: 'Account name contains invalid characters' };
  }

  return { valid: true };
}

function MainArea({
  selectedPlatform,
  onOpenBrowser,
  onExtractComplete,
  isLoading,
  browserStatus,
}) {
  const [accountName, setAccountName] = useState('');
  const [useProxy, setUseProxy] = useState(false);
  const [proxyUrl, setProxyUrl] = useState('');
  const [headless, setHeadless] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [extractionError, setExtractionError] = useState(null);

  const handleOpenBrowser = () => {
    if (!selectedPlatform) return;

    // Validate inputs
    const accountValidation = validateAccountName(accountName);
    if (!accountValidation.valid) {
      setValidationError(accountValidation.error);
      return;
    }

    if (useProxy) {
      const proxyValidation = validateProxyUrl(proxyUrl);
      if (!proxyValidation.valid) {
        setValidationError(proxyValidation.error);
        return;
      }
    }

    // Clear any previous validation errors
    setValidationError(null);

    const options = {
      accountName: accountName || 'Unnamed Account',
      proxy: useProxy ? proxyUrl : null,
      headless,
    };

    onOpenBrowser(selectedPlatform, options);
  };

  if (!selectedPlatform) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🍪</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Cookie Extractor
          </h2>
          <p className="text-gray-600 mb-6">
            Select a platform from the sidebar to get started
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Choose a platform from the left sidebar</li>
              <li>Click "Open Browser & Login"</li>
              <li>Complete the login process manually (including 2FA)</li>
              <li>Click "Extract Cookies" when logged in</li>
              <li>Export cookies in your preferred format</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Platform Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{selectedPlatform.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedPlatform.name}
              </h2>
              <p className="text-sm text-gray-500">{selectedPlatform.url}</p>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="p-4 rounded-lg mb-4 bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <span className="text-red-600">❌</span>
                <span className="font-medium text-red-800">{validationError}</span>
              </div>
            </div>
          )}

          {/* Status Indicator */}
          {browserStatus && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                browserStatus.status === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : browserStatus.status === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {browserStatus.status === 'opening' && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
                {browserStatus.status === 'opened' && <span className="text-green-600">🟢</span>}
                {browserStatus.status === 'error' && <span className="text-red-600">❌</span>}
                {browserStatus.status === 'success' && <span className="text-green-600">✅</span>}
                <span
                  className={`font-medium ${
                    browserStatus.status === 'error'
                      ? 'text-red-800'
                      : browserStatus.status === 'success'
                      ? 'text-green-800'
                      : 'text-blue-800'
                  }`}
                >
                  {browserStatus.message}
                </span>
              </div>
            </div>
          )}

          {/* Account Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name (optional)
            </label>
            <input
              type="text"
              className="input"
              placeholder="My Main Account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Give this account a name to identify it later
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useProxy}
                onChange={(e) => setUseProxy(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Use Proxy</span>
            </label>

            {useProxy && (
              <input
                type="text"
                className="input ml-6"
                placeholder="http://proxy:port or socks5://proxy:port"
                value={proxyUrl}
                onChange={(e) => setProxyUrl(e.target.value)}
                disabled={isLoading}
              />
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={headless}
                onChange={(e) => setHeadless(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Headless Mode</span>
              <span className="text-xs text-gray-500">(browser runs in background)</span>
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handleOpenBrowser}
            disabled={isLoading}
            className={`btn btn-primary w-full text-lg py-3 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Opening Browser...</span>
              </>
            ) : (
              <>
                <span>🌐</span>
                <span>Open Browser & Login</span>
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        {browserStatus?.status === 'opened' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            {/* Extraction Error */}
            {extractionError && (
              <div className="p-3 rounded-lg mb-4 bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">❌</span>
                  <span className="font-medium text-red-800">Failed to extract cookies: {extractionError}</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Browser is Open - Waiting for Login
                </h3>
                <p className="text-xs text-yellow-700">
                  The browser window will remain open until you extract cookies or manually close it.
                </p>
              </div>
            </div>
            <p className="text-sm text-yellow-800 mb-2 font-medium">
              Complete these steps in the browser window:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800 mb-4 pl-2">
              <li>Enter your username and password</li>
              <li>Complete any 2FA/verification if required</li>
              <li>Make sure you're fully logged in to {selectedPlatform.name}</li>
              <li>Return here and click the button below</li>
            </ol>
            <button
              onClick={async () => {
                setIsExtracting(true);
                setExtractionError(null); // Clear previous errors
                try {
                  // Trigger extraction via IPC
                  const result = await window.electronAPI.extractCookies();

                  if (result.success) {
                    onExtractComplete({
                      platform: selectedPlatform.id,
                      platformName: selectedPlatform.name,
                      accountName: accountName || 'Unnamed Account',
                      data: result.data,
                    });
                  } else {
                    // Handle extraction failure
                    setExtractionError(result.error || 'Unknown error');
                  }
                } catch (error) {
                  console.error('Extract cookies error:', error);
                  setExtractionError(error.message || 'Failed to extract cookies');
                } finally {
                  setIsExtracting(false);
                }
              }}
              disabled={isExtracting}
              className={`btn btn-success w-full flex items-center justify-center gap-2 ${
                isExtracting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isExtracting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Extracting Cookies...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>I'm Logged In - Extract Cookies Now</span>
                </>
              )}
            </button>

            {/* Close Browser Button */}
            <button
              onClick={async () => {
                try {
                  const result = await window.electronAPI.closeBrowser();
                  if (result.success) {
                    // Reset browser status
                    onExtractComplete(null); // This will trigger a refresh or you can add a separate callback
                    window.location.reload(); // Reload to reset the UI state
                  }
                } catch (error) {
                  console.error('Error closing browser:', error);
                }
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-red-300 text-red-700 hover:bg-red-50 transition-colors"
            >
              <span>❌</span>
              <span className="text-sm font-medium">Close Browser Without Extracting</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainArea;
