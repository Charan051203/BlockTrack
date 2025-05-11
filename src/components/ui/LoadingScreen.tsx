import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary-500 text-white rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7"
          >
            <rect width="18" height="12" x="3" y="8" rx="2" />
            <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
            <path d="M12 12v4" />
            <path d="M8 12v4" />
            <path d="M16 12v4" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-primary-600">BlockTrack</span>
      </div>
      
      <div className="w-16 h-16 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin"></div>
      
      <p className="mt-6 text-neutral-600 text-lg">Loading Supply Chain Data...</p>
    </div>
  );
};

export default LoadingScreen;