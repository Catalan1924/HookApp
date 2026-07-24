import { useState, useEffect, lazy, Suspense } from "react";
import { Home, Heart, MessageCircle, User, Plus, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { AuthScreen } from "./components/AuthScreen";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { DiscoverFeed } from "./components/DiscoverFeed";
import { MatchesTab } from "./components/MatchesTab";
import { DMsTab } from "./components/DMsTab";
import { ProfileTab } from "./components/ProfileTab";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider, useToast } from "./components/Toast";
import { LoadingSpinner } from "./components/LoadingSkeleton";
import { getUnreadCount } from "../lib/api/notifications";
import { supabase } from "../lib/supabase";

// ── Lazy-loaded overlays ──
const PostScreen = lazy(() => import("./components/PostScreen").then(m => ({ default: m.PostScreen })));
const ChatScreen = lazy(() => import("./components/ChatScreen").then(m => ({ default: m.ChatScreen })));
const SurpriseMeetup = lazy(() => import("./components/SurpriseMeetup").then(m => ({ default: m.SurpriseMeetup })));
const UserProfile = lazy(() => import("./components/UserProfile").then(m => ({ default: m.UserProfile })));
const StoryViewer = lazy(() => import("./components/StoryViewer").then(m => ({ default: m.StoryViewer })));
const NotificationsPanel = lazy(() => import("./components/NotificationsPanel").then(m => ({ default: m.NotificationsPanel })));
const BlockReportModal = lazy(() => import("./components/BlockReportModal").then(m => ({ default: m.BlockReportModal })));

type Tab = "discover" | "matches" | "dms" | "profile";

interface ChatTarget {
  userId: string
  userName: string
  userAvatar: string
}

const LEFT_TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number; color?: string; fill?: string; strokeWidth?: number }> }[] = [
  { id: "discover", label: "Discover", Icon: Home },
  { id: "matches",  label: "Matches",  Icon: Heart },
];

const RIGHT_TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number; color?: string; fill?: string; strokeWidth?: number }> }[] = [
  { id: "dms",     label: "DMs",     Icon: MessageCircle },
  { id: "profile", label: "Profile", Icon: User },
];

function MainTabs() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState<Tab>("discover");
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [chatTarget, setChatTarget] = useState<ChatTarget | null>(null);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);
  const [storyViewer, setStoryViewer] = useState<{ stories: any[]; index: number } | null>(null);
  const [blockReport, setBlockReport] = useState<{ name: string; id: string } | null>(null);

  // Poll unread notifications count
  useEffect(() => {
    if (!user) return
    getUnreadCount(user.id).then(setUnreadCount).catch(() => {})
    const iv = setInterval(() => {
      getUnreadCount(user.id).then(setUnreadCount).catch(() => {})
    }, 30000)
    return () => clearInterval(iv)
  }, [user])

  const handleViewProfile = (userId: string) => setViewingProfile(userId);
  const handleSendMessage = (userId: string) => {
    setViewingProfile(null);
    handleOpenChat(userId, '', '');
  };
  const handleOpenChat = (userId: string, userName?: string, userAvatar?: string) => {
    setChatTarget({ userId, userName: userName || '', userAvatar: userAvatar || '' });
  };
  const handleSaveProfile = (name: string) => setSavedProfiles((prev) => prev.includes(name) ? prev : [...prev, name]);
  const handleOpenStoryViewer = (stories: any[], idx: number) => setStoryViewer({ stories, index: idx });

  const handleBlock = async (userId: string) => {
    if (!user) return
    const { error } = await supabase
      .from('blocks')
      .insert({ blocker_id: user.id, blocked_id: userId } as any)
    if (error) {
      showToast('Could not block user. Try again.', 'error')
    } else {
      showToast('User blocked successfully', 'success')
    }
  }

  const handleReport = async (userId: string, reason: string) => {
    if (!user) return
    const { error } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        reported_user_id: userId,
        context_type: 'profile',
        reason,
        status: 'pending',
      } as any)
    if (error) {
      showToast('Could not submit report. Try again.', 'error')
    } else {
      showToast('Report submitted. Thank you! 🙏', 'success')
    }
  }

  const showNav = !viewingProfile && !postOpen && !chatTarget && !surpriseOpen;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ width: 390, height: "100dvh", maxHeight: "100dvh", margin: "0 auto", fontFamily: "Nunito Sans, sans-serif", background: "#fdfcfb" }}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {postOpen ? (
            <motion.div
              key="post-screen"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <Suspense fallback={<LoadingOverlay />}>
                <PostScreen onClose={() => setPostOpen(false)} onPost={() => setPostOpen(false)} />
              </Suspense>
            </motion.div>
          ) : chatTarget ? (
            <motion.div
              key="chat-overlay"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <Suspense fallback={<LoadingOverlay />}>
                <ChatScreen
                  userId={chatTarget.userId}
                  partnerName={chatTarget.userName}
                  partnerAvatar={chatTarget.userAvatar}
                  onBack={() => setChatTarget(null)}
                  onViewProfile={handleViewProfile}
                />
              </Suspense>
            </motion.div>
          ) : viewingProfile ? (
            <motion.div
              key="profile-view"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <Suspense fallback={<LoadingOverlay />}>
                <UserProfile
                  userId={viewingProfile}
                  onBack={() => setViewingProfile(null)}
                  onSendMessage={handleSendMessage}
                  onOpenChat={handleOpenChat}
                  onBlockReport={(name, id) => setBlockReport({ name, id })}
                />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {tab === "discover" && (
                <DiscoverFeed
                  onViewProfile={handleViewProfile}
                  onSurprise={() => setSurpriseOpen(true)}
                  onOpenStories={handleOpenStoryViewer}
                  onBlockReport={(name, id) => setBlockReport({ name, id })}
                />
              )}
              {tab === "matches" && <MatchesTab onOpenChat={handleOpenChat} onViewProfile={handleViewProfile} />}
              {tab === "dms" && <DMsTab onViewProfile={handleViewProfile} />}
              {tab === "profile" && (
                <ProfileTab
                  savedFromSurprise={savedProfiles}
                  onViewProfile={handleViewProfile}
                  onSendMessage={handleSendMessage}
                  onOpenChat={handleOpenChat}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      {showNav && (
        <nav
          className="flex-shrink-0 flex items-center border-t relative"
          style={{
            borderColor: "rgba(139,26,46,0.08)",
            background: "rgba(253,252,251,0.97)",
            backdropFilter: "blur(12px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
          role="tablist"
          aria-label="Main navigation"
        >
          {/* Left tabs */}
          <div className="flex flex-1">
            {LEFT_TABS.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  role="tab"
                  aria-selected={active}
                  aria-label={label}
                  className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 relative"
                >
                  {active && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-x-2 top-1 bottom-1 rounded-2xl"
                      style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <Icon size={20} fill={active ? "white" : "none"} color={active ? "white" : "#b08088"} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-[10px] font-bold tracking-wide" style={{ color: active ? "white" : "#b08088", fontFamily: "Nunito, sans-serif" }}>
                      {label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center post button */}
          <div className="flex-shrink-0 flex flex-col items-center px-2 relative">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setPostOpen(true)}
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
              style={{
                background: "linear-gradient(135deg,#8B1A2E,#C0395A)",
                boxShadow: "0 6px 24px rgba(139,26,46,0.45)",
              }}
              aria-label="Create post"
            >
              <Plus size={26} color="white" strokeWidth={2.5} />
            </motion.button>
            <span className="text-[10px] font-bold mt-1.5 tracking-wide" style={{ color: "#b08088", fontFamily: "Nunito, sans-serif" }}>
              Post
            </span>
          </div>

          {/* Right tabs */}
          <div className="flex flex-1">
            {RIGHT_TABS.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  role="tab"
                  aria-selected={active}
                  aria-label={label}
                  className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 relative"
                >
                  {active && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-x-2 top-1 bottom-1 rounded-2xl"
                      style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <div className="relative">
                      <Icon size={20} fill={active ? "white" : "none"} color={active ? "white" : "#b08088"} strokeWidth={active ? 2.5 : 1.8} />
                      {id === "dms" && unreadCount > 0 && (
                        <span
                          className="absolute -top-1.5 -right-3 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-black text-white px-1"
                          style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold tracking-wide" style={{ color: active ? "white" : "#b08088", fontFamily: "Nunito, sans-serif" }}>
                      {label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Notifications bell */}
          <div className="absolute top-0 right-0 -mt-6 mr-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotifsOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md relative"
              style={{ background: "white", border: "1.5px solid rgba(139,26,46,0.12)" }}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
              <Bell size={14} style={{ color: "#8B1A2E" }} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-black text-white"
                  style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>
          </div>
        </nav>
      )}

      {/* Surprise overlay */}
      {surpriseOpen && (
        <Suspense fallback={null}>
          <SurpriseMeetup onClose={() => setSurpriseOpen(false)} onSaveProfile={handleSaveProfile} />
        </Suspense>
      )}

      {/* Story viewer */}
      {storyViewer && (
        <Suspense fallback={null}>
          <StoryViewer
            stories={storyViewer.stories}
            initialIndex={storyViewer.index}
            onClose={() => setStoryViewer(null)}
            onViewProfile={handleViewProfile}
          />
        </Suspense>
      )}

      {/* Notifications panel */}
      <Suspense fallback={null}>
        <NotificationsPanel
          open={notifsOpen}
          onClose={() => setNotifsOpen(false)}
          onViewProfile={handleViewProfile}
        />
      </Suspense>

      {/* Block/Report modal */}
      {blockReport && (
        <Suspense fallback={null}>
          <BlockReportModal
            open={!!blockReport}
            onClose={() => setBlockReport(null)}
            targetName={blockReport.name}
            targetId={blockReport.id}
            onBlock={handleBlock}
            onReport={handleReport}
          />
        </Suspense>
      )}
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ background: '#fdfcfb' }}>
      <LoadingSpinner text="Loading..." />
    </div>
  )
}

function AuthGate() {
  const { user, profile, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh" style={{ background: "#fdfcfb" }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-5xl"
          aria-label="Loading"
        >
          💘
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onComplete={() => {}} />;
  }

  // Check if profile needs onboarding (no full_name set)
  if (!showOnboarding && profile && !profile.full_name) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(true)} />;
  }

  return <MainTabs />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AuthGate />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
