import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMessages, sendMessage } from '../lib/api/messages';

export default function ChatRoom({ thread, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [thread.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    try {
      const data = await getMessages(thread.id);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage(thread.id, user.id, newMessage);
      setNewMessage('');
      loadMessages();
    } catch (err) {
      console.error('Failed to send:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1A1A2E] to-[#16213E]">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-700">
        <button onClick={onBack} className="text-white mr-4 text-xl">&larr;</button>
        <h3 className="text-white font-semibold">Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No messages yet. Say hello!</div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  msg.sender_id === user.id
                    ? 'bg-[#FF3E6E] text-white rounded-br-sm'
                    : 'bg-gray-700 text-white rounded-bl-sm'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3E6E]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-[#FF3E6E] hover:bg-pink-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
