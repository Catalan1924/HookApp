import React from 'react';
import TinderCard from 'react-tinder-card';
import { HeartIcon, XIcon } from '@heroicons/react/24/solid';

const MainApp = () => {
  const profiles = [/* Array of mock profiles */ { name: 'Jane', age: 25, bio: 'Loves hiking', photo: 'url' }];

  return (
    <div className="p-4">
      <nav className="fixed bottom-0 w-full bg-gray-800 p-2 flex justify-around">
        <button>Home</button>
        <button>Matches</button>
        <button>Chat</button>
        <button>Profile</button>
      </nav>
      <div className="mt-20">
        {profiles.map((profile, index) => (
          <TinderCard key={index} className="relative">
            <div className="bg-gray-700 rounded-lg shadow-lg">
              <img src={profile.photo} alt="Profile" className="w-full h-64 object-cover lazyload" loading="lazy" />
              <h2>{profile.name}, {profile.age}</h2>
              <p>{profile.bio}</p>
              <div className="flex justify-center mt-4">
                <button className="bg-red-500 p-4 rounded-full mr-4"><XIcon className="h-6 w-6" /></button>
                <button className="bg-[#FF3E6E] p-4 rounded-full"><HeartIcon className="h-6 w-6" /></button>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default MainApp;