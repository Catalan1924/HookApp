import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard/home', label: 'Discover', icon: '🏠' },
    { path: '/dashboard/surprise', label: 'Surprise', icon: '🎲' },
    { path: '/dashboard/likes', label: 'Matches', icon: '❤️' },
    { path: '/dashboard/messages', label: 'Chat', icon: '💬' },
    { path: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <>
      {showNotifications && (
        <div className="fixed inset-0 bg-black/70 z-50">
          <div className="max-w-md mx-auto bg-gradient-to-b from-[#1A1A2E] to-[#16213E] min-h-screen">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <button onClick={() => setShowNotifications(false)} className="text-white text-xl">&larr;</button>
              <h2 className="text-white font-semibold text-lg">Notifications</h2>
              <div className="w-8" />
            </div>
            <div className="p-4 text-center text-gray-400 py-12">
              <p>Notifications will appear here</p>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-gray-900 border-t border-gray-800 px-4 py-2">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'text-[#FF3E6E]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
          <NotificationBell onClick={() => setShowNotifications(true)} />
        </div>
      </nav>
    </>
  );
}
