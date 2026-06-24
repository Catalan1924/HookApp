import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getThreads } from '../lib/api/messages';

export default function ChatList({ onSelectThread }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadThreads();
  }, []);

  async function loadThreads() {
    try {
      const data = await getThreads(user.id);
      setThreads(data);
    } catch (err) {
      console.error('Failed to load threads:', err);
    } finally {
      setLoading(false);
    }
  }

  function getOtherParticipant(thread) {
    return thread.participant1_id === user.id 
      ? thread.profiles_threads_participant2_id_fkey 
      : thread.profiles_threads_participant1_id_fkey;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>
      
      {threads.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-lg">No conversations yet</p>
          <p className="text-sm mt-2">Match with someone to start chatting!</p>
        </div>
      )}

      <div className="space-y-2">
        {threads.map(thread => {
          const other = getOtherParticipant(thread);
          return (
            <button
              key={thread.id}
              onClick={() => onSelectThread(thread)}
              className="w-full flex items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                {other?.name?.charAt(0) || '?'}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-white font-medium truncate">{other?.name || 'Unknown'}</p>
                <p className="text-gray-400 text-sm truncate">
                  {thread.messages?.[0]?.content || 'No messages yet'}
                </p>
              </div>
              <div className="text-gray-500 text-xs ml-2">
                {new Date(thread.updated_at).toLocaleDateString()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
