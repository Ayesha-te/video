import React from 'react';
import VideoDownloader from './components/VideoDownloader';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <VideoDownloader />
      </div>
    </div>
  );
}

export default App;