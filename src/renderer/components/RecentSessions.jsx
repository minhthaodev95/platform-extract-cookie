import React from 'react';

function RecentSessions({ sessions, onExport, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return diffDays + ' days ago';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getPlatformIcon = (platformId) => {
    const icons = {
      facebook: '📘',
      twitter: '🐦',
      instagram: '📸',
      linkedin: '💼',
      tiktok: '🎵',
    };
    return icons[platformId] || '🌐';
  };

  return (
    <div className="h-64">
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
          <span>📋</span>
          Recent Sessions
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {sessions.length}
          </span>
        </h2>
      </div>

      <div className="overflow-auto h-[calc(100%-3rem)]">
        {sessions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-sm">No sessions yet</p>
              <p className="text-xs mt-1">Extract some cookies to get started</p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 w-12">#</th>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3">Account</th>
                <th className="px-6 py-3">Cookies</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session, index) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getPlatformIcon(session.platform)}</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {session.platformName || session.platform}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{session.accountName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {session.data?.cookies?.length || 0} cookies
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(session.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onExport(session)}
                        className="text-primary hover:text-blue-700 font-medium transition-colors"
                        title="Export cookies"
                      >
                        💾 Export
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this session?')) {
                            onDelete(session.id);
                          }
                        }}
                        className="text-danger hover:text-red-700 font-medium transition-colors"
                        title="Delete session"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RecentSessions;
