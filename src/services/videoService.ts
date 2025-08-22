import type { VideoDownloadRequest, VideoDownloadResponse, SocialPlatform } from '../types';

// Platform detection by domain only, no regex
export class VideoService {
  static detectPlatform(url: string): SocialPlatform {
    if (url.includes('instagram.com') || url.includes('instagr.am')) return 'instagram';
    if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'tiktok';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    return 'unknown';
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return this.detectPlatform(url) !== 'unknown';
    } catch {
      return false;
    }
  }

  static async downloadVideo(request: VideoDownloadRequest): Promise<VideoDownloadResponse> {
    if (!this.validateUrl(request.url)) {
      return {
        success: false,
        error: 'Invalid URL or unsupported platform'
      };
    }

    // Instagram (logic unchanged)
    if (request.platform === 'instagram') {
      const apiUrl = `https://instagram120.p.rapidapi.com/api/instagram/links`;
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': 'e8fef07c75msh1b2da2c865f16aap17c528jsn730ceab3d426',
          'x-rapidapi-host': 'instagram120.p.rapidapi.com'
        },
        body: JSON.stringify({ url: request.url })
      };

      try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        const entry = Array.isArray(data) ? data[0] : data;

        if (entry && entry.urls && Array.isArray(entry.urls) && entry.urls[0]?.url) {
          const downloadUrl = entry.urls[0].url;
          const filename = `video_${Date.now()}_instagram.mp4`;
          return {
            success: true,
            downloadUrl,
            filename,
            platform: request.platform
          };
        } else {
          return {
            success: false,
            error: 'No downloadable video found in API response'
          };
        }
      } catch (err) {
        return {
          success: false,
          error: 'API request failed'
        };
      }
    }

    // TikTok (UPDATED)
    if (request.platform === 'tiktok') {
      const apiUrl = `https://tiktok-video-no-watermark2.p.rapidapi.com/?url=${encodeURIComponent(request.url)}&hd=1`;
      const options: RequestInit = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'e8fef07c75msh1b2da2c865f16aap17c528jsn730ceab3d426',
          'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(apiUrl, options);
        const result = await response.json();

        // The TikTok API response is { code, msg, processed_time, data }
        const data = result.data;

        // Priority: HD no watermark, then SD no watermark, then watermark
        if (data && data.hdplay) {
          const downloadUrl = data.hdplay;
          const filename = `video_${Date.now()}_tiktok_hd.mp4`;
          return {
            success: true,
            downloadUrl,
            filename,
            platform: request.platform
          };
        } else if (data && data.play) {
          const downloadUrl = data.play;
          const filename = `video_${Date.now()}_tiktok.mp4`;
          return {
            success: true,
            downloadUrl,
            filename,
            platform: request.platform
          };
        } else if (data && data.wmplay) {
          const downloadUrl = data.wmplay;
          const filename = `video_${Date.now()}_tiktok_watermark.mp4`;
          return {
            success: true,
            downloadUrl,
            filename,
            platform: request.platform
          };
        } else {
          return {
            success: false,
            error: 'No downloadable video found in TikTok API response'
          };
        }
      } catch (err) {
        return {
          success: false,
          error: 'API request failed'
        };
      }
    }

    // Facebook (unchanged)
    if (request.platform === 'facebook') {
  const apiUrl = `https://facebook17.p.rapidapi.com/api/facebook/links`;
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-key': 'e8fef07c75msh1b2da2c865f16aap17c528jsn730ceab3d426',
      'x-rapidapi-host': 'facebook17.p.rapidapi.com'
    },
    body: JSON.stringify({ url: request.url })
  };

  try {
    const response = await fetch(apiUrl, options);
    const data = await response.json();

    // The best video links are in data[0].urls array (HD and SD)
    if (Array.isArray(data) && data[0]?.urls && Array.isArray(data[0].urls)) {
      // Prefer HD if available, fallback to SD
      const hd = data[0].urls.find((item: any) => item.subName === 'HD' && item.url);
      const sd = data[0].urls.find((item: any) => item.subName === 'SD' && item.url);
      const downloadUrl = hd?.url || sd?.url;
      const filename = `video_${Date.now()}_facebook.mp4`;
      if (downloadUrl) {
        return {
          success: true,
          downloadUrl,
          filename,
          platform: request.platform
        };
      } else {
        return {
          success: false,
          error: 'No downloadable HD or SD video found in Facebook API response'
        };
      }
    } else {
      return {
        success: false,
        error: 'No downloadable video found in Facebook API response'
      };
    }
  } catch (err) {
    return {
      success: false,
      error: 'API request failed'
    };
  }
}

    // Twitter logic could go here...

    // Default: unsupported platform
    return {
      success: false,
      error: 'Platform not supported by this API'
    };
  }

  static async simulateDownload(downloadUrl: string, filename: string): Promise<void> {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}