import React from 'react';

const ProfileCard = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      <img
        src={profile.photos[0]}
        alt={profile.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{profile.name}, {profile.age}</h2>
      <p className="text-gray-600">{profile.bio}</p>
    </div>
  );
};

export default ProfileCard;
