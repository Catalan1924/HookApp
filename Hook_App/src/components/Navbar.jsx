import React from 'react';

const NavBar = ({ onNavigate }) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Hook App</h1>
        <div className="space-x-4">
          <button onClick={() => onNavigate('home')} className="hover:text-gray-300">Home</button>
          <button onClick={() => onNavigate('matches')} className="hover:text-gray-300">Matches</button>
          <button onClick={() => onNavigate('chat')} className="hover:text-gray-300">Messages</button>
          <button onClick={() => onNavigate('profile')} className="hover:text-gray-300">Profile</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
