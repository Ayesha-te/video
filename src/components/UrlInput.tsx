import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import { VideoService } from '../services/videoService';

interface UrlInputProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);

  const validateInput = (inputUrl: string) => {
    if (!inputUrl.trim()) {
      setIsValidUrl(null);
      return;
    }

    const isValid = VideoService.validateUrl(inputUrl);
    setIsValidUrl(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && isValidUrl && !isLoading) {
      await onSubmit(url.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    validateInput(newUrl);
  };

  const getPlatformName = (url: string) => {
    if (!url.trim()) return '';
    const platform = VideoService.detectPlatform(url);
    return platform !== 'unknown' ? platform : '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="video-url" className="block text-sm font-medium text-gray-700">
          Video URL
        </label>
        <div className="relative">
          <input
            type="url"
            id="video-url"
            value={url}
            onChange={handleInputChange}
            placeholder="Paste Instagram, TikTok, Facebook, or Twitter video URL"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              isValidUrl === false ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {url.trim() && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValidUrl === true && (
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  {getPlatformName(url)}
                </span>
              )}
              {isValidUrl === false && (
                <span className="text-xs font-medium text-red-600">Invalid URL</span>
              )}
            </div>
          )}
        </div>
        {isValidUrl === false && (
          <p className="text-sm text-red-600">
            Please enter a valid video URL from Instagram, TikTok, Facebook, or Twitter
          </p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!url.trim() || isValidUrl === false || isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download Video
          </>
        )}
      </button>
    </form>
  );
};

export default UrlInput;