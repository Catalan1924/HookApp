import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSurpriseProfile, acceptSurprise, skipSurprise } from '../lib/api/surprise';

export default function SurpriseMeetup() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadRandomProfile();
  }, []);

  async function loadRandomProfile() {
    setLoading(true);
    setMatched(false);
    try {
      const data = await getSurpriseProfile(user.id);
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  const handleAccept = async () => {
    try {
      await acceptSurprise(user.id, profile.id);
      setMatched(true);
    } catch (err) {
      console.error('Failed to accept:', err);
    }
  };

  const handleSkip = async () => {
    try {
      await skipSurprise(user.id, profile.id);
      loadRandomProfile();
    } catch (err) {
      console.error('Failed to skip:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E]">
        <div className="text-white text-xl">Finding someone special...</div>
      </div>
    );
  }

  if (matched) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E] p-6">
        <div className="bg-green-500/20 border border-green-500 rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">It's a Match!</h2>
          <p className="text-gray-300 mb-6">You matched with {profile?.name || 'someone'}</p>
          <button
            onClick={loadRandomProfile}
            className="bg-[#FF3E6E] hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Try Another
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E] p-6">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No more profiles right now</p>
          <button
            onClick={loadRandomProfile}
            className="bg-[#FF3E6E] hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E] p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mx-auto mb-6 flex items-center justify-center text-4xl text-white">
          {profile.name?.charAt(0) || '?'}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{profile.name || 'Anonymous'}</h2>
        {profile.age && <p className="text-gray-300 mb-2">{profile.age} years old</p>}
        {profile.bio && <p className="text-gray-400 mb-6">{profile.bio}</p>}
        
        <div className="flex justify-center space-x-6">
          <button
            onClick={handleSkip}
            className="bg-gray-700 hover:bg-gray-600 p-4 rounded-full text-2xl text-white"
          >
            &#10005;
          </button>
          <button
            onClick={handleAccept}
            className="bg-pink-500 hover:bg-pink-600 p-4 rounded-full text-2xl text-white"
          >
            &#10084;
          </button>
        </div>
      </div>
    </div>
  );
}
