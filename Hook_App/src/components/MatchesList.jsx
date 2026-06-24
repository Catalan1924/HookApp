import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMatchedProfiles } from '../lib/api/matches';

export default function MatchesList({ onChat }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      const data = await getMatchedProfiles(user.id);
      setMatches(data);
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Your Matches</h2>
      
      {matches.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <div className="text-6xl mb-4">💔</div>
          <p className="text-lg">No matches yet</p>
          <p className="text-sm mt-2">Keep swiping to find your match!</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {matches.map(match => (
          <div
            key={match.id}
            className="bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-[#FF3E6E] transition-all cursor-pointer"
            onClick={() => onChat && onChat(match)}
          >
            <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-5xl text-white">
              {match.name?.charAt(0) || '?'}
            </div>
            <div className="p-3">
              <p className="text-white font-medium truncate">{match.name || 'Unknown'}</p>
              {match.age && <p className="text-gray-400 text-sm">{match.age} years</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
