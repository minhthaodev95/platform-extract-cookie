import React from 'react';

const PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    url: 'https://www.facebook.com',
    color: 'bg-blue-500',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    url: 'https://twitter.com',
    color: 'bg-sky-500',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    url: 'https://www.instagram.com',
    color: 'bg-pink-500',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    url: 'https://www.youtube.com',
    color: 'bg-red-600',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    url: 'https://www.linkedin.com',
    color: 'bg-blue-700',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    url: 'https://www.tiktok.com',
    color: 'bg-black',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🤖',
    url: 'https://www.reddit.com',
    color: 'bg-orange-500',
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '💬',
    url: 'https://discord.com/app',
    color: 'bg-indigo-600',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: '🎮',
    url: 'https://www.twitch.tv',
    color: 'bg-purple-600',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '⚙️',
    url: 'https://github.com',
    color: 'bg-gray-800',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    url: 'https://www.pinterest.com',
    color: 'bg-red-500',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '🛒',
    url: 'https://www.amazon.com',
    color: 'bg-yellow-600',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    icon: '🎬',
    url: 'https://www.netflix.com',
    color: 'bg-red-700',
  },
  {
    id: 'google',
    name: 'Google',
    icon: '🔍',
    url: 'https://www.google.com',
    color: 'bg-blue-600',
  },
];

function Sidebar({ selectedPlatform, onSelectPlatform }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Platforms
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelectPlatform(platform)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
              selectedPlatform?.id === platform.id
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="text-2xl">{platform.icon}</span>
            <span className="font-medium">{platform.name}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-all"
          onClick={() => {
            const url = prompt('Enter custom platform URL:');
            if (url) {
              const name = prompt('Enter platform name:');
              if (name) {
                onSelectPlatform({
                  id: 'custom-' + Date.now(),
                  name,
                  icon: '🌐',
                  url,
                  color: 'bg-gray-500',
                });
              }
            }
          }}
        >
          <span className="text-xl">+</span>
          <span className="text-sm font-medium">Add Custom</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
export { PLATFORMS };
