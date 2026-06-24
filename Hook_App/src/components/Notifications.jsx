import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../lib/api/notifications';

export default function Notifications({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return '❤️';
      case 'match': return '🎉';
      case 'message': return '💬';
      case 'surprise': return '🎲';
      default: return '🔔';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50">
      <div className="max-w-md mx-auto bg-gradient-to-b from-[#1A1A2E] to-[#16213E] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-white text-xl">&larr;</button>
          <h2 className="text-white font-semibold text-lg">Notifications</h2>
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="text-[#FF3E6E] text-sm"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="p-4">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-4xl mb-4">🔔</div>
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl flex items-start space-x-3 cursor-pointer transition-colors ${
                    notification.read ? 'bg-gray-800/50' : 'bg-gray-800'
                  }`}
                  onClick={() => !notification.read && handleMarkRead(notification.id)}
                >
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                      {notification.content}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-[#FF3E6E] mt-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
