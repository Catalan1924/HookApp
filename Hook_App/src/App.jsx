import React, { useContext, useState } from 'react';
import LandingPage from './components/LandingPage';
import OnboardingForm from './components/OnboardingForm';
import PaymentModal from './components/PaymentModal';
import NavBar from './components/Navbar';
import ProfileCard from './components/ProfileCard';
import Chat from './components/Chat';
import { UserProvider, UserContext } from './contexts/UserContext';
import { Routes, Route, useNavigate } from 'react-router-dom';

function HomePage() {
  const { user, setUser } = useContext(UserContext);
  const [showPayment, setShowPayment] = useState(false);

  // For demo, dummy matches
  const [matches, setMatches] = useState([
    {
      id: '1',
      name: 'Amina',
      age: 26,
      bio: 'Loves hiking and coffee.',
      photos: ['https://randomuser.me/api/portraits/women/68.jpg'],
      isPrivate: false
    },
    {
      id: '2',
      name: 'James',
      age: 29,
      bio: 'Tech geek and foodie.',
      photos: ['https://randomuser.me/api/portraits/men/45.jpg'],
      isPrivate: true
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!user) {
    return <LandingPage onGetStarted={() => setShowPayment(false)} />;
  }

  const currentMatch = matches[currentIndex];

  const handleLike = () => {
    setCurrentIndex(i => (i + 1) % matches.length);
  };

  const handlePass = () => {
    setCurrentIndex(i => (i + 1) % matches.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E] p-4">
      <div className="flex-grow flex items-center justify-center w-full">
        {currentMatch ? (
          <ProfileCard profile={currentMatch} />
        ) : (
          <p className="text-white">No more profiles</p>
        )}
      </div>
      <div className="flex justify-center space-x-10 mb-6">
        <button
          onClick={handlePass}
          aria-label="Pass"
          className="bg-gray-700 hover:bg-gray-600 p-4 rounded-full text-2xl text-white"
        >
          &#10005;
        </button>
        <button
          onClick={handleLike}
          aria-label="Like"
          className="bg-pink-500 hover:bg-pink-600 p-4 rounded-full text-2xl text-white"
        >
          &#10084;
        </button>
      </div>
    </div>
  );
}

function ChatPage() {
  const navigate = useNavigate();
  return <Chat onBack={() => navigate('/dashboard/home')} />;
}

function LikesPage() {
  const sampleMatches = [
    {
      id: '1',
      name: 'Amina',
      age: 26,
      bio: 'Loves hiking and coffee.',
      photos: ['https://randomuser.me/api/portraits/women/68.jpg']
    },
    {
      id: '2',
      name: 'James',
      age: 29,
      bio: 'Tech geek and foodie.',
      photos: ['https://randomuser.me/api/portraits/men/45.jpg']
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Likes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sampleMatches.map(m => (
          <ProfileCard key={m.id} profile={m} />
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user } = useContext(UserContext);
  if (!user) return <div className="p-6">Not signed in</div>;
  const profile = user.profile || { name: user.name || 'You', age: '', bio: user.bio || 'Your profile', photos: [user.avatar || 'https://via.placeholder.com/400'] };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <ProfileCard profile={profile} />
    </div>
  );
}

function MainAppRouter() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <LandingPage onGetStarted={() => {}} />;
  }

  return (
    <div className="flex flex-col h-screen">
      
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/home" element={<HomePage />} />
          <Route path="/dashboard/likes" element={<LikesPage />} />
          <Route path="/dashboard/messages" element={<ChatPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Routes>
      </div>
      <NavBar />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainAppRouter />
    </UserProvider>
  );
}
