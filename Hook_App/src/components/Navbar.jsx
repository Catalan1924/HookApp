import React from 'react';
import { HomeIcon, HeartIcon, ChatBubbleLeftRightIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (typeof onNavigate === 'function') {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Hook App</h1>
        <div className="space-x-4 flex">
          <button aria-label="Home" onClick={() => handleNavigate('/dashboard/home')} className="hover:text-gray-300">
            <HomeIcon className="h-6 w-6" />
          </button>
          <button aria-label="Likes" onClick={() => handleNavigate('/dashboard/likes')} className="hover:text-gray-300">
            <HeartIcon className="h-6 w-6" />
          </button>
          <button aria-label="Messages" onClick={() => handleNavigate('/dashboard/messages')} className="hover:text-gray-300">
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </button>
          <button aria-label="Profile" onClick={() => handleNavigate('/dashboard/profile')} className="hover:text-gray-300">
            <UserIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
