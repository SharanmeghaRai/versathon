import { Link } from "react-router-dom";
import { ChatIcon, CalendarIcon } from "./Icons";

export default function RequestCard({ request, direction, onAccept, onDecline }) {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
    declined: "bg-rose-100 text-rose-800 border-rose-200",
    completed: "bg-sky-100 text-sky-800 border-sky-200",
  };

  const isReceived = direction === "received";
  const otherPersonName = isReceived ? request.fromName : request.toName;

  return (
    <div className="bg-white rounded-2xl border border-mist p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-coral"></span>
            <p className="font-display font-bold text-lg text-ink">
              {otherPersonName}
            </p>
          </div>
          <p className="text-xs text-ink/50 mt-0.5">
            {isReceived ? "Received from peer" : "Sent by you"}
          </p>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${
            statusStyles[request.status] || "bg-mist text-ink"
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-sand/30 border border-mist/60 text-sm">
        <p className="text-ink/80 leading-relaxed">
          {isReceived ? (
            <>
              <span className="font-bold text-ink">{request.fromName}</span> wants to learn{" "}
              <span className="font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-md">
                {request.skillWanted}
              </span>{" "}
              from you, and can teach{" "}
              <span className="font-bold text-ink bg-ink/10 px-2 py-0.5 rounded-md">
                {request.skillOffered}
              </span>{" "}
              in exchange.
            </>
          ) : (
            <>
              You proposed to learn{" "}
              <span className="font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-md">
                {request.skillWanted}
              </span>{" "}
              from <span className="font-bold text-ink">{request.toName}</span>, offering to teach{" "}
              <span className="font-bold text-ink bg-ink/10 px-2 py-0.5 rounded-md">
                {request.skillOffered}
              </span>.
            </>
          )}
        </p>

        {request.message && (
          <p className="mt-3 text-xs italic text-ink/70 border-l-2 border-coral pl-3 py-0.5">
            "{request.message}"
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-2">
        {isReceived && request.status === "pending" ? (
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              ✓ Accept Request
            </button>
            <button
              onClick={onDecline}
              className="px-4 py-2 rounded-full border border-mist text-ink/70 text-xs font-medium hover:bg-sand transition-colors"
            >
              Decline
            </button>
          </div>
        ) : null}

        {request.status === "accepted" && (
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              to={`/chat?requestId=${request.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink text-white text-xs font-semibold hover:bg-ink/90 transition-colors shadow-sm"
            >
              <ChatIcon className="w-3.5 h-3.5" />
              <span>Open Chat</span>
            </Link>
            <Link
              to={`/sessions?new=true&partner=${encodeURIComponent(otherPersonName)}&skill=${encodeURIComponent(request.skillWanted)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sand border border-mist text-ink text-xs font-semibold hover:bg-white transition-colors"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-coral" />
              <span>Schedule Session</span>
            </Link>
          </div>
        )}

        {request.status === "pending" && !isReceived && (
          <span className="text-xs text-ink/50 italic">
            Waiting for {request.toName} to review your request...
          </span>
        )}
      </div>
    </div>
  );
}
