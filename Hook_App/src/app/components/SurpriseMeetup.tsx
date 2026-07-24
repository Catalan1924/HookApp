import { useState } from "react";
import { X, SkipForward, Flag, Video, VideoOff, Mic, MicOff, Send, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Stage = "start" | "finding" | "call" | "postcall";

interface SurpriseMeetupProps {
  onClose: () => void;
  onSaveProfile: (name: string) => void;
}

const MOCK_USER = {
  name: "Nia",
  uni: "Moi University",
  avatar: "https://images.unsplash.com/photo-1578866161340-b6c1b0070ac2?w=120&h=120&fit=crop&auto=format",
};

export function SurpriseMeetup({ onClose, onSaveProfile }: SurpriseMeetupProps) {
  const [stage, setStage] = useState<Stage>("start");
  const [muted, setMuted] = useState(true);
  const [videoOff, setVideoOff] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatLog, setChatLog] = useState<{ from: "me" | "them"; text: string }[]>([
    { from: "them", text: "Hey! 👋 Habari!" },
  ]);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimer, setControlsTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const startFinding = () => {
    setStage("finding");
    setTimeout(() => setStage("call"), 2500);
  };

  const handleScreenTap = () => {
    setShowControls(true);
    if (controlsTimer) clearTimeout(controlsTimer);
    const t = setTimeout(() => setShowControls(false), 2500);
    setControlsTimer(t);
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatLog((l) => [...l, { from: "me", text: chatMsg.trim() }]);
    setChatMsg("");
  };

  const endCall = () => setStage("postcall");
  const nextPerson = () => {
    setStage("finding");
    setChatLog([{ from: "them", text: "Sasa! 🔥" }]);
    setTimeout(() => setStage("call"), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" style={{ maxWidth: 390, margin: "0 auto" }}>
      {stage === "start" && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30" style={{ background: "radial-gradient(circle,#C0395A,transparent)" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full translate-x-1/3 translate-y-1/3 opacity-20" style={{ background: "radial-gradient(circle,#E6B422,transparent)" }} />
          <motion.div
            animate={{ rotate: [0, 15, -10, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="text-7xl mb-6 select-none"
          >
            🎭
          </motion.div>
          <h2 className="text-3xl font-black mb-2 text-center" style={{ fontFamily: "Nunito, sans-serif", lineHeight: 1.1 }}>
            Meet someone<br />new right now
          </h2>
          <p className="text-center text-white/60 mb-10 text-sm leading-relaxed max-w-xs">
            Get matched with a random verified campus student for a live video call. No awkward swiping.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startFinding}
            className="w-full py-4 rounded-2xl font-black text-white text-lg mb-4 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)", boxShadow: "0 8px 32px rgba(192,57,90,0.5)" }}
          >
            <Zap size={20} />
            Start Meetup
          </motion.button>
          <button onClick={onClose} className="text-white/40 text-sm">Not now</button>
        </motion.div>
      )}

      {stage === "finding" && (
        <div className="flex-1 flex flex-col items-center justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, #2a0a12, #0a0008)" }} />
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-[#C0395A]/30"
              style={{ width: 120 + i * 80, height: 120 + i * 80 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.4, ease: "easeInOut" }}
            />
          ))}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="relative z-10 text-5xl mb-6"
          >
            🔍
          </motion.div>
          <p className="relative z-10 text-xl font-black mb-2" style={{ fontFamily: "Nunito, sans-serif" }}>Finding someone…</p>
          <p className="relative z-10 text-white/40 text-sm mb-10">Searching verified students nearby</p>
          <button onClick={onClose} className="relative z-10 text-white/40 text-sm underline">Cancel</button>
        </div>
      )}

      {stage === "call" && (
        <div className="flex-1 relative" onClick={handleScreenTap}>
          <img
            src="https://images.unsplash.com/photo-1578866161340-b6c1b0070ac2?w=390&h=700&fit=crop&auto=format"
            alt="Remote user"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4))" }} />

          {/* User tag */}
          <div className="absolute top-5 left-4 flex items-center gap-2">
            <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 text-white text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {MOCK_USER.name} · {MOCK_USER.uni}
            </div>
          </div>

          {/* Self PiP */}
          <div className="absolute bottom-52 right-3 w-24 h-32 rounded-2xl overflow-hidden shadow-xl" style={{ border: "2px solid rgba(255,255,255,0.4)" }}>
            {videoOff ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/50">
                <VideoOff size={22} />
              </div>
            ) : (
              <img src="https://images.unsplash.com/photo-1606416132922-22ab37c1231e?w=96&h=128&fit=crop&auto=format" alt="Me" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 inset-x-0 flex justify-end gap-2 p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setMuted((v) => !v)} className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white">
                  {muted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button onClick={() => setVideoOff((v) => !v)} className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white">
                  {videoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
                <button className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-yellow-300">
                  <Flag size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat + actions */}
          <div className="absolute bottom-0 inset-x-0 pb-4 pt-16" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 60%, transparent)" }} onClick={(e) => e.stopPropagation()}>
            <div className="px-4 mb-3 max-h-24 overflow-y-auto flex flex-col gap-1.5">
              {chatLog.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <span
                    className="px-3 py-1.5 rounded-2xl text-sm text-white max-w-[70%]"
                    style={m.from === "me" ? { background: "linear-gradient(120deg,#8B1A2E,#C0395A)" } : { background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 mb-5">
              <input
                className="flex-1 bg-white/15 backdrop-blur-sm text-white placeholder-white/40 rounded-full px-4 py-2.5 text-sm outline-none border border-white/20"
                placeholder="Say something…"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
              />
              <button onClick={sendChat} className="rounded-full p-2.5 text-white" style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}>
                <Send size={16} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-10">
              <button onClick={nextPerson} className="flex flex-col items-center gap-1.5">
                <motion.div whileTap={{ scale: 0.88 }} className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg,#E6B422,#f0c840)" }}>
                  <SkipForward size={22} color="#1A1A1A" />
                </motion.div>
                <span className="text-white text-xs font-semibold">Next</span>
              </button>
              <button onClick={endCall} className="flex flex-col items-center gap-1.5">
                <motion.div whileTap={{ scale: 0.88 }} className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl" style={{ background: "linear-gradient(135deg,#EF4444,#dc2626)" }}>
                  <X size={26} color="white" />
                </motion.div>
                <span className="text-white text-xs font-semibold">End call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === "postcall" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, #2a0a12, #0a0008)" }} />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
            className="relative z-10 mb-1"
          >
            <img
              src={MOCK_USER.avatar}
              alt={MOCK_USER.name}
              className="w-28 h-28 rounded-full object-cover"
              style={{ border: "3px solid #C0395A", boxShadow: "0 0 32px rgba(192,57,90,0.5)" }}
            />
            <div className="absolute -bottom-1 -right-1 text-3xl">💘</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="relative z-10 text-center mt-4 mb-8">
            <h3 className="text-2xl font-black mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>{MOCK_USER.name}</h3>
            <p className="text-white/50 text-sm">{MOCK_USER.uni}</p>
            <p className="text-white/80 text-base mt-4 font-semibold">That felt like a connection 💫<br />Save {MOCK_USER.name}'s profile?</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="relative z-10 w-full flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { onSaveProfile(MOCK_USER.name); onClose(); }}
              className="w-full py-4 rounded-2xl font-black text-white text-base"
              style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)", boxShadow: "0 8px 24px rgba(192,57,90,0.4)" }}
            >
              💾 Save Profile
            </motion.button>
            <button onClick={onClose} className="w-full py-3.5 rounded-2xl font-semibold border border-white/20 text-white/50 text-sm">
              Discard
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
