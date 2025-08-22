export interface VideoDownloadRequest {
  url: string;
  platform: SocialPlatform;
}

export interface VideoDownloadResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
  platform?: SocialPlatform;
}

export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'unknown';

export type MessageType = 'success' | 'error' | 'info' | 'warning';

export interface Message {
  type: MessageType;
  text: string;
}