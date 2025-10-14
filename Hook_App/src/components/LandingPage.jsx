import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid'; // For playful icon

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E] p-4">
      <h1 className="text-5xl font-bold text-[#FF3E6E]">HookApp</h1>
      <p className="text-2xl mt-4 text-center">Connect. Chat. Meet.</p>
      <HeartIcon className="h-12 w-12 text-[#FF3E6E] animate-pulse mt-4" /> {/* Micro-interaction */}
      <button
        className="mt-8 bg-[#FF3E6E] px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        onClick={() => navigate('/onboard')}
      >
        Get Started - KSh 20
      </button>
    </div>
  );
};

export default LandingPage;