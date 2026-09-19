import { useState, useRef } from "react";
import { CameraIcon } from "../Icons";

const PRESET_BANNERS = [
  {
    id: "b1",
    name: "Classic Navy Tech",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-[#0a66c2] via-[#004182] to-[#002244]",
  },
  {
    id: "b2",
    name: "Modern Engineering",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-[#334155] via-[#1e293b] to-[#0f172a]",
  },
  {
    id: "b3",
    name: "Sunset Circuit",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-[#ff5a5f] via-[#e04047] to-[#8c1d22]",
  },
  {
    id: "b4",
    name: "Emerald Matrix",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-[#057642] via-[#045d34] to-[#01351d]",
  },
  {
    id: "b5",
    name: "Cyber Violet",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-[#7015a8] via-[#4c1d95] to-[#1e1b4b]",
  },
  {
    id: "b6",
    name: "Campus Learning Hub",
    url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-[#1e3a8a] via-[#172554] to-[#0f172a]",
  },
];

export default function ChangeBannerModal({ isOpen = true, onClose, currentBanner, onSave }) {
  if (isOpen === false) return null;

  const [preview, setPreview] = useState(currentBanner || "");
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Resize and optimize uploaded banner via HTML Canvas
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1200;
        const maxH = 450;
        let width = img.width;
        let height = img.height;

        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }
        if (height > maxH) {
          width = Math.round((width * maxH) / height);
          height = maxH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPreview(dataUrl);
        setLoading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    onSave(preview);
    onClose();
  }

  function handleRemove() {
    setPreview("");
    onSave("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Change Cover Photo / Background</h2>
            <p className="text-xs text-slate-500">Upload a custom banner or pick a campus theme</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Aspect Ratio Preview */}
          <div>
            <p className="font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Cover Preview:
            </p>
            <div className="w-full h-36 rounded-xl border border-slate-200 overflow-hidden shadow-inner relative bg-gradient-to-r from-[#0a66c2] to-[#002244]">
              {preview ? (
                <img
                  src={preview}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/70 font-semibold text-xs">
                  Default Campus Gradient Banner
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-[#0a66c2] bg-slate-50 hover:bg-blue-50/50 font-semibold text-slate-800 flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <CameraIcon className="w-4 h-4 text-[#0a66c2]" />
              <span>{loading ? "Optimizing image..." : "Upload Cover from Device"}</span>
            </button>
          </div>

          {/* Preset Banners */}
          <div>
            <p className="font-bold text-slate-700 uppercase tracking-wider mb-2 text-[11px]">
              Or Choose from Curated Campus Presets:
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {PRESET_BANNERS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setPreview(b.url)}
                  className={`h-16 rounded-lg overflow-hidden border-2 transition-all relative group text-left ${
                    preview === b.url
                      ? "border-[#0a66c2] ring-2 ring-[#0a66c2]/30 scale-[1.02]"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                  title={b.name}
                >
                  <img
                    src={b.url}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                    <span className="text-[10px] text-white font-bold leading-tight truncate">
                      {b.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Or Paste URL */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
              Or Paste an Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
              <button
                type="button"
                onClick={() => {
                  if (urlInput.trim()) setPreview(urlInput.trim());
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 text-xs"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {currentBanner ? (
              <button
                type="button"
                onClick={handleRemove}
                className="text-rose-600 hover:underline font-semibold text-xs"
              >
                Reset to Default
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSave}
                className="px-6 py-2 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182] shadow-sm"
              >
                Save Cover Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
