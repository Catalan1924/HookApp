import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../lib/api/profiles';

export default function UserProfile({ profileId, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  async function loadProfile() {
    try {
      const data = await getProfile(profileId);
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-gray-400 py-12">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {onBack && (
        <button onClick={onBack} className="text-white mb-4 text-xl">&larr; Back</button>
      )}

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {/* Profile header */}
        <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-white/30 mx-auto mb-4 flex items-center justify-center text-4xl text-white">
            {profile.name?.charAt(0) || '?'}
          </div>
          <h2 className="text-2xl font-bold text-white">{profile.name || 'Anonymous'}</h2>
          {profile.age && <p className="text-white/80">{profile.age} years old</p>}
          {profile.university && <p className="text-white/60 text-sm">{profile.university}</p>}
        </div>

        {/* Bio */}
        <div className="p-6">
          <h3 className="text-white font-semibold mb-2">About</h3>
          <p className="text-gray-300">{profile.bio || 'No bio yet'}</p>
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-white font-semibold mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, i) => (
                <span key={i} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {profile.photos && profile.photos.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-white font-semibold mb-2">Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {profile.photos.map((photo, i) => (
                <div key={i} className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                  <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
