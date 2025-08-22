import React from 'react';
import { Instagram, MessageCircle, Facebook, Twitter } from 'lucide-react';

const PlatformInfo: React.FC = () => {
  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { name: 'TikTok', icon: MessageCircle, color: 'text-black' },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Supported Platforms</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {platforms.map(({ name, icon: Icon, color }) => (
          <div key={name} className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-sm font-medium text-gray-700">{name}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-3">
        Simply paste a video URL from any of these platforms and click download.
      </p>
    </div>
  );
};

export default PlatformInfo;