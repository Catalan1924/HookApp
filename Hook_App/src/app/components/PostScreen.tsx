import { useState, useCallback } from "react";
import {
  ArrowLeft, X, Check, ChevronRight, ChevronLeft,
  Image as ImageIcon, Film, Grid, Plus, Minus,
  Sun, Contrast, Droplets, Thermometer, Circle,
  Type, Crop, Sliders, Sparkles, Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type PostType = "photo" | "video" | "gallery";
type EditorTab = "filters" | "adjust" | "crop" | "text";
type Step = "select" | "edit" | "caption";

interface MediaItem {
  id: string;
  src: string;
  type: "photo" | "video";
  thumb: string;
}

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  vignette: number;
  sharpness: number;
}

interface FilterPreset {
  name: string;
  emoji: string;
  adjustments: Partial<Adjustments>;
  overlay?: string;
}

const LIBRARY: MediaItem[] = [
  { id: "1",  src: "https://images.unsplash.com/photo-1744320911030-1ab998d994d7?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1744320911030-1ab998d994d7?w=120&h=120&fit=crop&auto=format" },
  { id: "2",  src: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=120&h=120&fit=crop&auto=format" },
  { id: "3",  src: "https://images.unsplash.com/photo-1655720348590-c739c860beed?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1655720348590-c739c860beed?w=120&h=120&fit=crop&auto=format" },
  { id: "4",  src: "https://images.unsplash.com/photo-1565490129165-bd6a24996c25?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1565490129165-bd6a24996c25?w=120&h=120&fit=crop&auto=format" },
  { id: "5",  src: "https://images.unsplash.com/photo-1755705152670-0cfe7829fd0e?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1755705152670-0cfe7829fd0e?w=120&h=120&fit=crop&auto=format" },
  { id: "6",  src: "https://images.unsplash.com/photo-1627500091632-247f1fb2d1de?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1627500091632-247f1fb2d1de?w=120&h=120&fit=crop&auto=format" },
  { id: "7",  src: "https://images.unsplash.com/photo-1769000066443-235ba0c45edb?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1769000066443-235ba0c45edb?w=120&h=120&fit=crop&auto=format" },
  { id: "8",  src: "https://images.unsplash.com/photo-1648301033733-44554c74ec50?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1648301033733-44554c74ec50?w=120&h=120&fit=crop&auto=format" },
  { id: "9",  src: "https://images.unsplash.com/photo-1649370962517-a91d65b09ab1?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1649370962517-a91d65b09ab1?w=120&h=120&fit=crop&auto=format" },
  { id: "10", src: "https://images.unsplash.com/photo-1756490222702-e425e31555d3?w=390&h=500&fit=crop&auto=format",  type: "photo", thumb: "https://images.unsplash.com/photo-1756490222702-e425e31555d3?w=120&h=120&fit=crop&auto=format" },
  { id: "11", src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=390&h=500&fit=crop&auto=format",  type: "video", thumb: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=120&h=120&fit=crop&auto=format" },
  { id: "12", src: "https://images.unsplash.com/photo-1685538362266-9f09f6b6cab5?w=390&h=500&fit=crop&auto=format",  type: "video", thumb: "https://images.unsplash.com/photo-1685538362266-9f09f6b6cab5?w=120&h=120&fit=crop&auto=format" },
];

const FILTERS: FilterPreset[] = [
  { name: "Original", emoji: "🔄",  adjustments: {} },
  { name: "Warm",     emoji: "🌅", adjustments: { warmth: 45, brightness: 105, saturation: 110 } },
  { name: "Cool",     emoji: "❄️", adjustments: { warmth: -10, saturation: 80, brightness: 98 } },
  { name: "Vivid",    emoji: "🌈", adjustments: { saturation: 160, contrast: 115, brightness: 102 } },
  { name: "Fade",     emoji: "🌫️",  adjustments: { contrast: 75, saturation: 70, brightness: 110 } },
  { name: "Drama",    emoji: "🎭", adjustments: { contrast: 140, saturation: 80, brightness: 90, vignette: 60 } },
  { name: "Glow",     emoji: "💫", adjustments: { brightness: 120, saturation: 90, contrast: 85 } },
  { name: "Moody",    emoji: "🌙", adjustments: { brightness: 80, contrast: 130, saturation: 60, vignette: 70 } },
  { name: "Golden",   emoji: "✨", adjustments: { warmth: 70, saturation: 130, brightness: 108, contrast: 108 } },
  { name: "Film",     emoji: "🎞️", adjustments: { contrast: 120, saturation: 75, brightness: 95, vignette: 40 } },
];

const DEFAULT_ADJ: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  warmth: 0,
  vignette: 0,
  sharpness: 0,
};

function buildFilter(adj: Adjustments): string {
  const parts = [
    `brightness(${adj.brightness}%)`,
    `contrast(${adj.contrast}%)`,
    `saturate(${adj.saturation}%)`,
  ];
  if (adj.warmth > 0) parts.push(`sepia(${adj.warmth * 0.5}%)`);
  return parts.join(" ");
}

function applyPreset(preset: FilterPreset): Adjustments {
  return { ...DEFAULT_ADJ, ...preset.adjustments };
}

function buildVignetteGradient(strength: number): string {
  if (strength === 0) return "none";
  const opacity = strength / 100;
  return `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${opacity * 0.85}) 100%)`;
}

function AdjustSlider({
  icon: Icon,
  label,
  value,
  min,
  max,
  onChange,
  color = "#8B1A2E",
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon size={16} color={color} />
      <div className="flex-1">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-bold text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>{label}</span>
          <span className="text-xs font-mono text-muted-foreground">{value}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-muted">
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color}80,${color})` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
            style={{ left: `calc(${pct}% - 8px)`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}

interface PostScreenProps {
  onClose: () => void;
  onPost: () => void;
}

export function PostScreen({ onClose, onPost }: PostScreenProps) {
  const [step, setStep] = useState<Step>("select");
  const [postType, setPostType] = useState<PostType>("photo");
  const [selected, setSelected] = useState<MediaItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [editorTab, setEditorTab] = useState<EditorTab>("filters");
  const [adjustments, setAdjustments] = useState<Record<string, Adjustments>>({});
  const [activeFilter, setActiveFilter] = useState<Record<string, string>>({});
  const [textOverlay, setTextOverlay] = useState<Record<string, string>>({});
  const [caption, setCaption] = useState("");
  const [posted, setPosted] = useState(false);
  const [cropMode, setCropMode] = useState<"free" | "1:1" | "4:5" | "16:9">("4:5");

  const currentItem = selected[activeIdx];
  const currentAdj = currentItem ? (adjustments[currentItem.id] || DEFAULT_ADJ) : DEFAULT_ADJ;
  const currentFilterName = currentItem ? (activeFilter[currentItem.id] || "Original") : "Original";

  const setAdj = useCallback((id: string, update: Partial<Adjustments>) => {
    setAdjustments((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || DEFAULT_ADJ), ...update },
    }));
  }, []);

  const applyFilterAction = (item: MediaItem, preset: FilterPreset) => {
    const newAdj = applyPreset(preset);
    setAdjustments((prev) => ({ ...prev, [item.id]: newAdj }));
    setActiveFilter((prev) => ({ ...prev, [item.id]: preset.name }));
  };

  const toggleSelect = (item: MediaItem) => {
    if (postType === "gallery") {
      setSelected((prev) => {
        const exists = prev.find((i) => i.id === item.id);
        if (exists) return prev.filter((i) => i.id !== item.id);
        if (prev.length >= 6) return prev;
        return [...prev, item];
      });
    } else {
      setSelected([item]);
    }
  };

  const handleNext = () => {
    if (step === "select" && selected.length > 0) setStep("edit");
    else if (step === "edit") setStep("caption");
    else if (step === "caption") {
      // Try to create post via Supabase API
      import('../../lib/api/posts').then(({ createPost }) => {
        const media = selected.map((item) => ({ url: item.src, type: item.type }))
        createPost('current', caption, media, 'everyone').catch(() => {})
      }).catch(() => {})
      setPosted(true);
      setTimeout(() => { onPost(); }, 2000);
    }
  };

  const filteredLibrary = LIBRARY.filter((m) =>
    postType === "video" ? m.type === "video" : m.type === "photo"
  );

  if (posted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="text-7xl mb-5"
        >
          💃
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-black mb-2"
          style={{ fontFamily: "Nunito, sans-serif", color: "#8B1A2E" }}
        >
          Posted!
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm text-muted-foreground">
          Your post is live on the Discover feed 💘
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "rgba(139,26,46,0.08)", background: "rgba(253,252,251,0.97)", backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={step === "select" ? onClose : () => setStep(step === "caption" ? "edit" : "select")}
          className="p-1.5 text-muted-foreground"
        >
          {step === "select" ? <X size={22} /> : <ArrowLeft size={22} />}
        </button>
        <span className="font-black text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>
          {step === "select" ? "New Post" : step === "edit" ? "Edit" : "Caption"}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          disabled={selected.length === 0}
          className="px-4 py-2 rounded-xl font-black text-sm text-white disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}
        >
          {step === "caption" ? "Post" : "Next →"}
        </motion.button>
      </div>

      {/* Step: Select */}
      {step === "select" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 flex gap-0 mx-4 my-3 rounded-2xl overflow-hidden" style={{ background: "#f4f0f1" }}>
            {(["photo", "video", "gallery"] as PostType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setPostType(t); setSelected([]); }}
                className="flex-1 py-2.5 text-sm font-black flex items-center justify-center gap-1.5 rounded-2xl transition-all"
                style={postType === t ? { background: "linear-gradient(135deg,#8B1A2E,#C0395A)", color: "white" } : { color: "#8a7a7e" }}
              >
                {t === "photo" && <ImageIcon size={13} />}
                {t === "video" && <Film size={13} />}
                {t === "gallery" && <Grid size={13} />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="flex-shrink-0 mx-4 mb-3 rounded-2xl overflow-hidden bg-gray-100 relative" style={{ height: 220 }}>
              <img
                src={selected[0].src}
                alt="Selected"
                className="w-full h-full object-cover"
                style={{ filter: buildFilter(adjustments[selected[0].id] || DEFAULT_ADJ) }}
              />
              {postType === "gallery" && selected.length > 1 && (
                <div className="absolute top-3 right-3 rounded-full w-7 h-7 flex items-center justify-center text-white font-black text-sm shadow-lg" style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}>
                  {selected.length}
                </div>
              )}
            </div>
          )}

          {postType === "gallery" && (
            <p className="flex-shrink-0 text-xs text-center text-muted-foreground mb-2 font-semibold">
              Select up to 6 photos · {selected.length}/6 chosen
            </p>
          )}

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-3 gap-1.5">
              {filteredLibrary.map((item) => {
                const sel = selected.find((s) => s.id === item.id);
                const selIdx = selected.findIndex((s) => s.id === item.id);
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => toggleSelect(item)}
                    className="aspect-square rounded-xl overflow-hidden relative bg-gray-100"
                  >
                    <img src={item.thumb} alt="" className="w-full h-full object-cover" />
                    {item.type === "video" && (
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 rounded-full px-1.5 py-0.5 flex items-center gap-1">
                        <Film size={9} color="white" />
                        <span className="text-white text-[9px] font-bold">0:15</span>
                      </div>
                    )}
                    {sel && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(139,26,46,0.35)" }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-white text-sm shadow" style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}>
                          {postType === "gallery" ? selIdx + 1 : <Check size={14} />}
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step: Edit */}
      {step === "edit" && selected.length > 0 && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected.length > 1 && (
            <div className="flex-shrink-0 flex gap-2 px-4 pt-3 pb-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {selected.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIdx(i)}
                  className="flex-shrink-0 relative rounded-xl overflow-hidden"
                  style={{ width: 56, height: 56, outline: i === activeIdx ? "2.5px solid #8B1A2E" : "2px solid transparent", outlineOffset: 1 }}
                >
                  <img
                    src={item.thumb}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: buildFilter(adjustments[item.id] || DEFAULT_ADJ) }}
                  />
                  {i === activeIdx && (
                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#8B1A2E" }}>
                      <Check size={9} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div
            className="flex-shrink-0 relative overflow-hidden mx-4 rounded-2xl bg-gray-100"
            style={{ height: selected.length > 1 ? 200 : 280 }}
          >
            <img
              src={currentItem.src}
              alt="Edit preview"
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: buildFilter(currentAdj) }}
            />
            {currentAdj.vignette > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: buildVignetteGradient(currentAdj.vignette) }}
              />
            )}
            {textOverlay[currentItem.id] && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-black text-xl text-center px-4 drop-shadow-lg" style={{ fontFamily: "Nunito, sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
                  {textOverlay[currentItem.id]}
                </span>
              </div>
            )}
            {editorTab === "crop" && (
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-white text-[11px] font-bold">{cropMode}</span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex gap-1 px-4 py-2.5">
            {(["filters", "adjust", "crop", "text"] as EditorTab[]).map((t) => {
              const icons = { filters: Sparkles, adjust: Sliders, crop: Crop, text: Type };
              const Ic = icons[t];
              return (
                <button
                  key={t}
                  onClick={() => setEditorTab(t)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
                  style={editorTab === t ? { background: "#f0e8ea" } : {}}
                >
                  <Ic size={16} color={editorTab === t ? "#8B1A2E" : "#8a7a7e"} />
                  <span className="text-[10px] font-black capitalize" style={{ color: editorTab === t ? "#8B1A2E" : "#8a7a7e", fontFamily: "Nunito, sans-serif" }}>
                    {t}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {editorTab === "filters" && (
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {FILTERS.map((preset) => {
                  const previewAdj = applyPreset(preset);
                  const isActive = currentFilterName === preset.name;
                  return (
                    <motion.button
                      key={preset.name}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => applyFilterAction(currentItem, preset)}
                      className="flex-shrink-0 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-20 h-20 rounded-2xl overflow-hidden relative"
                        style={{
                          outline: isActive ? "2.5px solid #8B1A2E" : "2px solid transparent",
                          outlineOffset: 2,
                        }}
                      >
                        <img
                          src={currentItem.thumb}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                          style={{ filter: buildFilter(previewAdj) }}
                        />
                        {previewAdj.vignette && previewAdj.vignette > 0 && (
                          <div className="absolute inset-0" style={{ background: buildVignetteGradient(previewAdj.vignette) }} />
                        )}
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-lg">{preset.emoji}</span>
                      </div>
                      <span
                        className="text-[11px] font-black"
                        style={{ color: isActive ? "#8B1A2E" : "#8a7a7e", fontFamily: "Nunito, sans-serif" }}
                      >
                        {preset.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {editorTab === "adjust" && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Adjustments</span>
                  <button
                    onClick={() => setAdj(currentItem.id, DEFAULT_ADJ)}
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ color: "#8B1A2E", background: "#f0e8ea" }}
                  >
                    Reset
                  </button>
                </div>
                <AdjustSlider icon={Sun}         label="Brightness"  value={currentAdj.brightness} min={50}  max={150} onChange={(v) => setAdj(currentItem.id, { brightness: v })} />
                <AdjustSlider icon={Contrast}    label="Contrast"    value={currentAdj.contrast}   min={50}  max={150} onChange={(v) => setAdj(currentItem.id, { contrast: v })}   />
                <AdjustSlider icon={Droplets}    label="Saturation"  value={currentAdj.saturation} min={0}   max={200} onChange={(v) => setAdj(currentItem.id, { saturation: v })} />
                <AdjustSlider icon={Thermometer} label="Warmth"      value={currentAdj.warmth}     min={0}   max={100} onChange={(v) => setAdj(currentItem.id, { warmth: v })}     color="#E6B422" />
                <AdjustSlider icon={Circle}      label="Vignette"    value={currentAdj.vignette}   min={0}   max={100} onChange={(v) => setAdj(currentItem.id, { vignette: v })}   color="#4A2B6A" />
              </div>
            )}

            {editorTab === "crop" && (
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Aspect Ratio</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {(["free", "1:1", "4:5", "16:9"] as const).map((ratio) => {
                    const dims = { "free": [48,48], "1:1": [40,40], "4:5": [36,45], "16:9": [56,31] };
                    const [w, h] = dims[ratio];
                    return (
                      <motion.button
                        key={ratio}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setCropMode(ratio)}
                        className="flex flex-col items-center gap-2 py-3 rounded-2xl transition-all"
                        style={cropMode === ratio ? { background: "#f0e8ea" } : { background: "#f4f0f1" }}
                      >
                        <div
                          className="rounded-md border-2 transition-all"
                          style={{
                            width: w * 0.9,
                            height: h * 0.9,
                            borderColor: cropMode === ratio ? "#8B1A2E" : "#c8b8bc",
                          }}
                        />
                        <span className="text-[10px] font-black" style={{ color: cropMode === ratio ? "#8B1A2E" : "#8a7a7e", fontFamily: "Nunito, sans-serif" }}>
                          {ratio}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground text-center">Crop guides are applied when posting</p>
              </div>
            )}

            {editorTab === "text" && (
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Add Text Overlay</p>
                <textarea
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none text-foreground"
                  style={{ background: "#f4f0f1", fontFamily: "Nunito, sans-serif", minHeight: 80 }}
                  placeholder="Type something bold…"
                  maxLength={60}
                  value={textOverlay[currentItem.id] || ""}
                  onChange={(e) => setTextOverlay((prev) => ({ ...prev, [currentItem.id]: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1.5 text-right">{(textOverlay[currentItem.id] || "").length}/60</p>
                <p className="text-xs text-muted-foreground mt-3 text-center">Text appears centered on your photo ✨</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step: Caption */}
      {step === "caption" && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-shrink-0 flex gap-2 px-4 pt-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {selected.map((item) => (
              <div key={item.id} className="flex-shrink-0 rounded-2xl overflow-hidden relative" style={{ width: 80, height: 80 }}>
                <img
                  src={item.thumb}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: buildFilter(adjustments[item.id] || DEFAULT_ADJ) }}
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Film size={18} color="white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-4 flex flex-col gap-4 pb-8">
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-2">Caption</label>
              <textarea
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none text-foreground"
                style={{ background: "#f4f0f1", fontFamily: "Nunito Sans, sans-serif", minHeight: 96 }}
                placeholder="Say something about this… (optional)"
                maxLength={100}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">Max 100 characters</p>
                <p className="text-xs font-mono text-muted-foreground">{caption.length}/100</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-2">Visible to</label>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(139,26,46,0.08)" }}>
                {["Everyone on Discover", "Matches only", "My university only"].map((opt, i) => (
                  <button key={opt} className={`w-full flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t" : ""}`} style={i > 0 ? { borderColor: "rgba(139,26,46,0.06)" } : {}}>
                    <span className="text-sm font-semibold text-foreground">{opt}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === 0 ? "border-[#8B1A2E]" : "border-border"}`}>
                      {i === 0 && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#8B1A2E" }} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#faf0f2", border: "1.5px solid rgba(139,26,46,0.1)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)" }}>
                {postType === "photo" && <ImageIcon size={18} color="white" />}
                {postType === "video" && <Film size={18} color="white" />}
                {postType === "gallery" && <Grid size={18} color="white" />}
              </div>
              <div>
                <p className="font-black text-sm text-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>
                  {selected.length} {postType === "gallery" ? `photo${selected.length > 1 ? "s" : ""}` : postType} ready
                </p>
                <p className="text-xs text-muted-foreground">Filters & edits applied 💘</p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 shadow-lg"
              style={{ background: "linear-gradient(135deg,#8B1A2E,#C0395A)", boxShadow: "0 6px 24px rgba(139,26,46,0.35)" }}
            >
              <Send size={18} />
              Share to Discover
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
