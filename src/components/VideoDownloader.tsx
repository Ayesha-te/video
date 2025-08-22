import React, { useState } from 'react';
import { VideoService } from '../services/videoService';
import type { Message } from '../types';
import UrlInput from './UrlInput';
import MessageDisplay from './MessageDisplay';
import PlatformInfo from './PlatformInfo';

const VideoDownloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleDownloadRequest = async (url: string) => {
    setIsLoading(true);
    setMessage({ type: 'info', text: 'Processing your request...' });

    try {
      const platform = VideoService.detectPlatform(url);
      const response = await VideoService.downloadVideo({ url, platform });

      if (response.success && response.downloadUrl && response.filename) {
        setMessage({
          type: 'success',
          text: `Video ready for download from ${response.platform}!`
        });

        // Simulate the download process
        try {
          await VideoService.simulateDownload(response.downloadUrl, response.filename);
          setTimeout(() => {
            setMessage({
              type: 'success',
              text: 'Download completed successfully!'
            });
          }, 1000);
        } catch (downloadError) {
          setMessage({
            type: 'error',
            text: 'Failed to download the file. Please try again.'
          });
        }
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Failed to process the video'
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      setMessage({
        type: 'error',
        text: 'Network error occurred. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Social Video Downloader
            </h1>
            <p className="text-gray-600">
              Download videos from Instagram, TikTok, Facebook, and Twitter
            </p>
          </div>

          <PlatformInfo />

          <UrlInput onSubmit={handleDownloadRequest} isLoading={isLoading} />

          <MessageDisplay message={message} />
        </div>
      </div>

    
    </div>
  );
};

export default VideoDownloader;