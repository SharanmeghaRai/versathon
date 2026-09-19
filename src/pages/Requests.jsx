import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchRequests,
  updateExchangeRequestStatus,
} from "../utils/dataService";
import RequestCard from "../components/RequestCard";

export default function Requests() {
  const { currentUser } = useAuth();
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("received");
  const [actionNotice, setActionNotice] = useState("");

  async function load() {
    if (!currentUser) return;
    setLoading(true);
    const data = await fetchRequests(currentUser.uid);
    setReceived(data.received);
    setSent(data.sent);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [currentUser]);

  async function handleUpdateStatus(request, status) {
    await updateExchangeRequestStatus(request.id, status, request);
    setActionNotice(
      status === "accepted"
        ? `Request accepted! You can now start chatting with ${request.fromName}.`
        : `Request marked as declined.`
    );
    setTimeout(() => setActionNotice(""), 4000);
    await load();
  }

  const list = tab === "received" ? received : sent;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Skill Exchange Requests</h1>
          <p className="text-sm text-ink/60 mt-1">
            Review requests sent to you and track the status of invitations you sent to peers.
          </p>
        </div>
        <Link
          to="/discover"
          className="text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full bg-coral text-white hover:bg-coral/90 self-start shadow-sm"
        >
          + Find More Peers
        </Link>
      </div>

      {actionNotice && (
        <div className="mb-6 p-4 rounded-xl text-sm font-medium bg-green-50 border border-green-200 text-green-800">
          {actionNotice}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-mist pb-4">
        <button
          onClick={() => setTab("received")}
          className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
            tab === "received"
              ? "bg-ink text-white shadow-sm"
              : "bg-white border border-mist text-ink/70 hover:text-ink"
          }`}
        >
          Received ({received.length})
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
            tab === "sent"
              ? "bg-ink text-white shadow-sm"
              : "bg-white border border-mist text-ink/70 hover:text-ink"
          }`}
        >
          Sent ({sent.length})
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-20 text-ink/50">Loading requests...</div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mist p-12 text-center max-w-md mx-auto">
          <p className="text-3xl mb-2">📬</p>
          <h3 className="font-display font-bold text-lg text-ink">
            No {tab} requests yet
          </h3>
          <p className="text-xs text-ink/60 mt-1 mb-6">
            {tab === "received"
              ? "Make sure your profile lists the skills you can teach so peers can find you!"
              : "Explore the Discover tab to find campus students and send your first request."}
          </p>
          <Link
            to="/discover"
            className="px-6 py-2.5 rounded-full bg-ink text-white text-xs font-semibold hover:bg-ink/90"
          >
            Explore Discover
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              direction={tab}
              onAccept={() => handleUpdateStatus(req, "accepted")}
              onDecline={() => handleUpdateStatus(req, "declined")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
