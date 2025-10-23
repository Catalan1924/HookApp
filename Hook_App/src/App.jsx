import React, { useContext, useState } from 'react';
import LandingPage from './components/LandingPage';
import OnboardingForm from './components/OnboardingForm';
import PaymentModal from './components/PaymentModal';
import NavBar from './components/NavBar';
import ProfileCard from './components/ProfileCard';
import { UserProvider, UserContext } from './contexts/UserContext';

function MainApp() {
  const { user } = useContext(UserContext);
  const [showPayment, setShowPayment] = useState(false);

  // For demo, dummy matches
  const [matches, setMatches] = useState([
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
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!user) {
    return <LandingPage onGetStarted={() => setShowPayment(false)} />;
  }

  if (user && !user.isPaid) {
    return (
      <>
        <OnboardingForm onComplete={() => setShowPayment(true)} />
        {showPayment && <PaymentModal />}
      </>
    );
  }

  // User is paid, show main app
  const currentMatch = matches[currentIndex];

  const handleLike = () => {
    setCurrentIndex(i => (i + 1) % matches.length);
  };

  const handlePass = () => {
    setCurrentIndex(i => (i + 1) % matches.length);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-backgroundStart to-backgroundEnd text-textLight font-sans">
      <div className="flex-grow flex items-center justify-center p-4">
        {currentMatch ? (
          <ProfileCard profile={currentMatch} />
        ) : (
          <p>No more profiles</p>
        )}
      </div>
      <div className="flex justify-center space-x-10 mb-6">
        <button
          onClick={handlePass}
          aria-label="Pass"
          className="bg-gray-700 hover:bg-gray-600 p-4 rounded-full text-2xl"
        >
          &#10005;
        </button>
        <button
          onClick={handleLike}
          aria-label="Like"
          className="bg-primary hover:bg-pink-600 p-4 rounded-full text-2xl"
        >
          &#10084;
        </button>
      </div>
      <NavBar />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
