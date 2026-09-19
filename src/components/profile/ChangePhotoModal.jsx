import { useState, useRef } from "react";
import { CameraIcon } from "../Icons";

const PRESET_AVATARS = [
  { id: "av1", name: "Modern Dev", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" },
  { id: "av2", name: "Campus Coder", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" },
  { id: "av3", name: "Tech Lead", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80" },
  { id: "av4", name: "AI Explorer", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80" },
  { id: "av5", name: "UI Designer", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80" },
  { id: "av6", name: "Innovator", url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80" },
];

export default function ChangePhotoModal({ isOpen = true, onClose, currentPhoto, onSave }) {
  if (isOpen === false) return null;

  const [preview, setPreview] = useState(currentPhoto || "");
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Resize and optimize uploaded image via HTML Canvas
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
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
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Change Profile Photo</h2>
            <p className="text-xs text-slate-500">Upload an image or pick a campus preset</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Circular Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden relative group">
              {preview ? (
                <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-3xl select-none">
                  U
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Preview in your LinkedIn profile card</p>
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
              <span>{loading ? "Processing photo..." : "Upload from Device"}</span>
            </button>
          </div>

          {/* Preset Avatars */}
          <div>
            <p className="font-bold text-slate-700 uppercase tracking-wider mb-2 text-[11px]">
              Or Pick a Campus Avatar Preset:
            </p>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setPreview(av.url)}
                  className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all ${
                    preview === av.url
                      ? "border-[#0a66c2] ring-2 ring-[#0a66c2]/30 scale-105"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                  title={av.name}
                >
                  <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
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
                placeholder="https://example.com/avatar.jpg"
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
            {currentPhoto ? (
              <button
                type="button"
                onClick={handleRemove}
                className="text-rose-600 hover:underline font-semibold text-xs"
              >
                Remove Photo
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
                type="button"
                onClick={handleSave}
                className="px-6 py-2 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182] shadow-sm"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
