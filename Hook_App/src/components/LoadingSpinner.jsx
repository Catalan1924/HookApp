import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E]">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-[#FF3E6E] rounded-full animate-spin mb-4" />
      <p className="text-gray-400">{text}</p>
    </div>
  );
}
