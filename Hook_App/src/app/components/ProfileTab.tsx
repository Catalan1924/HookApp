import { useState } from "react";
import { Shield, Heart, Video, Users, Camera, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";

const LIKED_POSTS = [
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=140&h=140&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1655720348590-c739c860beed?w=140&h=140&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1619512673224-91cfb2688284?w=140&h=140&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1565490129165-bd6a24996c25?w=140&h=140&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1755705152604-af6804fb8932?w=140&h=140&fit=crop&auto=format",
];

const RECOMMENDATIONS = [
  { name: "Brian", uni: "KU", avatar: "https://images.unsplash.com/photo-1620829813573-7c9e1877706f?w=100&h=100&fit=crop&auto=format" },
  { name: "Kofi", uni: "Strathmore", avatar: "https://images.unsplash.com/photo-1694175271713-a6e2cc378980?w=100&h=100&fit=crop&auto=format" },
  { name: "Jomo", uni: "JKUAT", avatar: "https://images.unsplash.com/photo-1685538362266-9f09f6b6cab5?w=100&h=100&fit=crop&auto=format" },
  { name: "Seth", uni: "Moi", avatar: "https://images.unsplash.com/photo-1694175271713-a6e2cc378980?w=100&h=100&fit=crop&auto=format" },
];

interface ProfileTabProps {
  savedFromSurprise?: string[];
  onViewProfile: (userId: string) => void;
  onSendMessage: (userId: string) => void;
  onOpenChat?: (userId: string, userName?: string, userAvatar?: string) => void;
}

export function ProfileTab({ savedFromSurprise = [], onViewProfile, onSendMessage, onOpenChat }: ProfileTabProps) {
  const { profile, signOut } = useAuth();
  const [section, setSection] = useState<"liked" | "saved">("liked");

  const MY_PROFILE = {
    name: profile?.full_name || profile?.username || "You",
    uni: "Campus",
    age: profile?.age || 20,
    avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1578866161340-b6c1b0070ac2?w=180&h=180&fit=crop&auto=format",
    bio: profile?.bio || "CampusMatch student 💘",
    interests: profile?.interests || [],
    posts: 12,
    matches: 1,
    dms: 3,
  };

  return (
    <div className="flex-1 overflow-y-auto pb-8">
      {/* Full-bleed gradient hero */}
      <div className="relative pb-16 pt-10 px-4 text-white overflow-hidden" style={{ background: "linear-gradient(160deg,#6A1B2A 0%,#B5294A 55%,#E86A8F 100%)" }}>
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/3 translate-x-1/4 opacity-20" style={{ background: "radial-gradient(circle,white,transparent)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/4 opacity-15" style={{ background: "radial-gradient(circle,#E6B422,transparent)" }} />

        <div className="relative z-10 flex items-end gap-4">
          <div className="relative">
            <img
              src={MY_PROFILE.avatar}
              alt={MY_PROFILE.name}
              className="w-24 h-24 rounded-3xl object-cover shadow-2xl"
              style={{ border: "3px solid rgba(255,255,255,0.5)" }}
              loading="lazy"
            />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
              <Camera size={14} style={{ color: "#8B1A2E" }} />
            </button>
          </div>
          <div className="flex-1 pb-1">
            <h2 className="font-black text-2xl leading-tight" style={{ fontFamily: "Nunito, sans-serif" }}>
              {MY_PROFILE.name}, {MY_PROFILE.age}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={12} className="opacity-80" />
              <span className="text-sm font-semibold opacity-80">{MY_PROFILE.uni} ✓ Verified 💚</span>
            </div>
          </div>
          <button className="pb-1 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-bold">
            Edit
          </button>
        </div>

        <p className="relative z-10 text-sm text-white/75 mt-4 leading-relaxed">{MY_PROFILE.bio}</p>

        {/* Interests */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-3">
          {MY_PROFILE.interests.map((tag: string) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-sm text-white">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex mx-4 -mt-6 relative z-10 rounded-2xl overflow-hidden shadow-lg" style={{ background: "white", border: "1.5px solid rgba(139,26,46,0.1)" }}>
        {[
          { label: "Posts", value: MY_PROFILE.posts },
          { label: "Matches", value: MY_PROFILE.matches },
          { label: "DMs", value: MY_PROFILE.dms },
        ].map(({ label, value }, i) => (
          <div key={label} className={`flex-1 py-4 text-center ${i > 0 ? "border-l" : ""}`} style={i > 0 ? { borderColor: "rgba(139,26,46,0.08)" } : {}}>
            <p className="text-xl font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>{value}</p>
            <p className="text-xs text-muted-foreground font-semibold">{label}</p>
          </div>
        ))}
      </div>

      {/* Collections */}
      <div className="mx-4 mt-5">
        <div className="flex rounded-2xl overflow-hidden mb-4" style={{ background: "#f4f0f1" }}>
          {[
            { id: "liked" as const, label: "Liked Posts", icon: <Heart size={13} /> },
            { id: "saved" as const, label: "Saved Surprises", icon: <Video size={13} /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`flex-1 py-2.5 text-sm font-black flex items-center justify-center gap-1.5 transition-all rounded-2xl`}
              style={
                section === id
                  ? { background: "linear-gradient(135deg,#8B1A2E,#C0395A)", color: "white" }
                  : { color: "#8a7a7e" }
              }
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {section === "liked" && (
          <div className="grid grid-cols-3 gap-1.5">
            {LIKED_POSTS.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square rounded-2xl overflow-hidden bg-gray-100"
              >
                <img src={src} alt={`Liked post ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>
        )}

        {section === "saved" && (
          <div className="flex flex-col gap-3">
            {savedFromSurprise.length === 0 ? (
              <div className="text-center py-10">
                <motion.div animate={{ rotate: [0, 15, -10, 15, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} className="text-5xl mb-3 inline-block">
                  🎭
                </motion.div>
                <p className="font-bold text-muted-foreground mb-1" style={{ fontFamily: "Nunito, sans-serif" }}>No saved profiles yet</p>
                <p className="text-xs text-muted-foreground">Try a Surprise Meetup and save someone you clicked with!</p>
              </div>
            ) : (
              savedFromSurprise.map((name, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#f4f0f1" }}>
                  <img src="https://images.unsplash.com/photo-1578866161340-b6c1b0070ac2?w=80&h=80&fit=crop&auto=format" alt={name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                  <div className="flex-1">
                    <p className="font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>{name}</p>
                    <p className="text-xs text-muted-foreground">Saved from Surprise Meetup</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => onViewProfile(name)} className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}>
                      View
                    </button>
                    <button onClick={() => onOpenChat?.(name, name, '')} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#f0e8ea", color: "#8B1A2E" }}>
                      Message
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} style={{ color: "#8B1A2E" }} />
          <p className="text-sm font-black" style={{ color: "#8B1A2E", fontFamily: "Nunito, sans-serif" }}>People you might click with</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {RECOMMENDATIONS.map((rec) => (
            <motion.button
              key={rec.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewProfile(rec.name)}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl w-24"
              style={{ background: "white", border: "1.5px solid rgba(139,26,46,0.1)" }}
            >
              <img src={rec.avatar} alt={rec.name} className="w-14 h-14 rounded-2xl object-cover" loading="lazy" />
              <span className="text-xs font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>{rec.name}</span>
              <span className="text-[10px] text-muted-foreground">{rec.uni}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mx-4 mt-5 rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(139,26,46,0.08)" }}>
        {[
          { label: "Account", action: () => {} },
          { label: "Privacy", action: () => {} },
          { label: "Blocked Users", action: () => {} },
          { label: "Report History", action: () => {} },
          { label: "Log Out", action: () => signOut(), danger: true },
        ].map(({ label, action, danger }, i) => (
          <button
            key={label}
            onClick={action}
            className={`w-full flex items-center justify-between px-4 py-3.5 text-sm ${i > 0 ? "border-t" : ""}`}
            style={i > 0 ? { borderColor: "rgba(139,26,46,0.06)" } : {}}
          >
            <span className="flex items-center gap-2.5 font-semibold" style={{ color: danger ? "#EF4444" : "#1A1A1A", fontFamily: "Nunito Sans, sans-serif" }}>
              {label}
            </span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
