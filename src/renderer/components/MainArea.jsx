import React, { useState } from 'react';

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

  const handleOpenBrowser = () => {
    if (!selectedPlatform) return;

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
            <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <span>⏳</span>
              Waiting for Login
            </h3>
            <p className="text-sm text-yellow-800 mb-3">
              A browser window has been opened. Please complete the following steps:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800 mb-4">
              <li>Enter your username and password in the browser</li>
              <li>Complete any 2FA/verification if required</li>
              <li>Make sure you're fully logged in</li>
              <li>Come back here and click "Extract Cookies"</li>
            </ol>
            <button
              onClick={async () => {
                setIsExtracting(true);
                try {
                  // Trigger extraction via IPC
                  const { ipcRenderer } = window.require('electron');
                  const result = await ipcRenderer.invoke('extract-cookies');

                  if (result.success) {
                    onExtractComplete({
                      platform: selectedPlatform.id,
                      platformName: selectedPlatform.name,
                      accountName: accountName || 'Unnamed Account',
                      data: result.data,
                    });
                  } else {
                    // Handle extraction failure
                    alert('Failed to extract cookies: ' + (result.error || 'Unknown error'));
                  }
                } catch (error) {
                  console.error('Extract cookies error:', error);
                  alert('Error extracting cookies: ' + error.message);
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
          </div>
        )}
      </div>
    </div>
  );
}

export default MainArea;
