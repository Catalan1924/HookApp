import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUnreadCount } from '../lib/api/notifications';

export default function NotificationBell({ onClick }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  async function loadUnreadCount() {
    try {
      const count = await getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (err) {
      // Silently fail
    }
  }

  return (
    <button onClick={onClick} className="relative text-gray-400 hover:text-white">
      <span className="text-xl">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#FF3E6E] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
