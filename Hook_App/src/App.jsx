import React, { useContext, useState } from 'react';
import LandingPage from './components/LandingPage';
import OnboardingForm from './components/OnboardingForm';
import PaymentModal from './components/PaymentModal';
import NavBar from './components/Navbar';
import ProfileCard from './components/ProfileCard';
import Chat from './components/Chat';
import { UserProvider, UserContext } from './contexts/UserContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import EmailAuth from './components/EmailAuth';
import DiscoverFeed from './components/DiscoverFeed';
import SurpriseMeetup from './components/SurpriseMeetup';
import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import MatchesList from './components/MatchesList';
import UserProfile from './components/UserProfile';
import MyProfile from './components/MyProfile';
import Notifications from './components/Notifications';
import NotificationBell from './components/NotificationBell';
import ErrorBoundary from './components/ErrorBoundary';



function HomePage() {
  return <DiscoverFeed />;
}

function ChatPage() {
  const [selectedThread, setSelectedThread] = useState(null);
  const navigate = useNavigate();

  if (selectedThread) {
    return <ChatRoom thread={selectedThread} onBack={() => setSelectedThread(null)} />;
  }
  return <ChatList onSelectThread={setSelectedThread} />;
}


function LikesPage() {
  const navigate = useNavigate();
  return <MatchesList onChat={() => navigate('/dashboard/messages')} />;
}


function ProfilePage() {
  return <MyProfile />;
}

function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#16213E]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Not authenticated - show email auth
  if (!user) {
    return <EmailAuth onComplete={() => setShowOnboarding(true)} />;
  }

  // Authenticated but needs onboarding
  if (showOnboarding) {
    return <OnboardingForm onComplete={() => setShowOnboarding(false)} />;
  }

  return children;
}

function UserProfilePage() {
  const navigate = useNavigate();
  // You'd get the ID from the URL params using useParams()
  // For now, it's a placeholder
  return <UserProfile onBack={() => navigate(-1)} />;
}



function MainAppRouter() {
  const { user } = useContext(UserContext);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) {
    return <LandingPage onGetStarted={() => {}} />;
  }

  return (
    <div className="flex flex-col h-screen">
      {showNotifications && (
        <Notifications onClose={() => setShowNotifications(false)} />
      )}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/home" element={<HomePage />} />
          <Route path="/dashboard/likes" element={<LikesPage />} />
          <Route path="/dashboard/messages" element={<ChatPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/surprise" element={<SurpriseMeetup />} />
          <Route path="/profile/:id" element={<UserProfilePage />} />
        </Routes>
      </div>
      <NavBar />
    </div>
  );
}


export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <AuthGate>
            <MainAppRouter />
          </AuthGate>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
