import React, { useState } from 'react';

const EXPORT_FORMATS = [
  {
    id: 'json',
    name: 'JSON (Playwright/Puppeteer)',
    description: 'Standard JSON format compatible with most automation tools',
    extension: '.json',
  },
  {
    id: 'netscape',
    name: 'Netscape (cookies.txt)',
    description: 'Classic Netscape format used by curl, wget, etc.',
    extension: '.txt',
  },
  {
    id: 'editthiscookie',
    name: 'EditThisCookie Format',
    description: 'JSON format compatible with EditThisCookie extension',
    extension: '.json',
  },
  {
    id: 'javascript',
    name: 'JavaScript Object',
    description: 'ES6 module export for JavaScript projects',
    extension: '.js',
  },
];

function ExportDialog({ session, onConfirm, onCancel }) {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [includeCookies, setIncludeCookies] = useState(true);
  const [includeLocalStorage, setIncludeLocalStorage] = useState(true);
  const [includeSessionStorage, setIncludeSessionStorage] = useState(true);
  const [includeUserAgent, setIncludeUserAgent] = useState(false);

  const handleExport = () => {
    onConfirm(selectedFormat, null); // Path will be chosen in save dialog
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Export Cookies</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {/* Session Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {session.platform === 'facebook'
                  ? '📘'
                  : session.platform === 'twitter'
                  ? '🐦'
                  : session.platform === 'instagram'
                  ? '📸'
                  : session.platform === 'linkedin'
                  ? '💼'
                  : session.platform === 'tiktok'
                  ? '🎵'
                  : '🌐'}
              </span>
              <div>
                <h3 className="font-semibold text-gray-800 capitalize">
                  {session.platformName || session.platform} - {session.accountName}
                </h3>
                <p className="text-xs text-gray-500">{formatDate(session.createdAt)}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{session.data?.cookies?.length || 0}</span> cookies
            </div>
          </div>

          {/* Export Format */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Export Format</h3>
            <div className="space-y-2">
              {EXPORT_FORMATS.map((format) => (
                <label
                  key={format.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedFormat === format.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.id}
                    checked={selectedFormat === format.id}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{format.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{format.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Include</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCookies}
                  onChange={(e) => setIncludeCookies(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Cookies</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLocalStorage}
                  onChange={(e) => setIncludeLocalStorage(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Local Storage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSessionStorage}
                  onChange={(e) => setIncludeSessionStorage(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Session Storage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUserAgent}
                  onChange={(e) => setIncludeUserAgent(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">User Agent</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleExport} className="btn btn-primary flex items-center gap-2">
            <span>💾</span>
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportDialog;
