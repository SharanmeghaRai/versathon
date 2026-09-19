import { useState } from "react";

export default function AddCertificationModal({ isOpen, onClose, onAdd }) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [doesNotExpire, setDoesNotExpire] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !issuer.trim()) return;

    onAdd({
      id: "cert_" + Date.now(),
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim() || "Recent",
      expirationDate: doesNotExpire ? "No Expiration" : (expirationDate.trim() || "Present"),
      credentialId: credentialId.trim() || `ID-${Math.floor(100000 + Math.random() * 900000)}`,
      credentialUrl: credentialUrl.trim() || "#",
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add License or Certification</h2>
            <p className="text-xs text-slate-500">Showcase your verified technical credentials</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Certificate / License Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Meta Front-End Developer Specialization, AWS Cloud Practitioner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issuing Organization *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Coursera, AWS, Google Cloud, HackerRank, freeCodeCamp"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Date
              </label>
              <input
                type="text"
                placeholder="e.g. Jan 2025"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expiration Date
              </label>
              <input
                type="text"
                disabled={doesNotExpire}
                placeholder="e.g. Jan 2028"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={doesNotExpire}
              onChange={(e) => setDoesNotExpire(e.target.checked)}
              className="rounded text-[#0a66c2] focus:ring-[#0a66c2]"
            />
            <span>This credential does not expire</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Credential ID
              </label>
              <input
                type="text"
                placeholder="e.g. META-FE-984210"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Credential URL / Verification Link
              </label>
              <input
                type="url"
                placeholder="https://coursera.org/verify/..."
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182] shadow-sm"
            >
              Save Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
