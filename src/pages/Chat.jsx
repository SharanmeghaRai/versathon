import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchRequests, fetchMessages, sendChatMessage } from "../utils/dataService";
import { ChatIcon } from "../components/Icons";

export default function Chat() {
  const { currentUser, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const targetReqId = searchParams.get("requestId");

  const [acceptedExchanges, setAcceptedExchanges] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExchanges() {
      if (!currentUser) return;
      setLoading(true);
      const reqs = await fetchRequests(currentUser.uid);
      const all = [...reqs.received, ...reqs.sent].filter((r) => r.status === "accepted");
      setAcceptedExchanges(all);

      if (targetReqId) {
        const found = all.find((r) => r.id === targetReqId);
        if (found) setSelectedChat(found);
        else if (all.length > 0) setSelectedChat(all[0]);
      } else if (all.length > 0) {
        setSelectedChat(all[0]);
      }
      setLoading(false);
    }
    loadExchanges();
  }, [currentUser, targetReqId]);

  useEffect(() => {
    async function loadChatMessages() {
      if (!selectedChat) return;
      const msgs = await fetchMessages(selectedChat.id);
      setMessages(msgs);
    }
    loadChatMessages();
    const interval = setInterval(loadChatMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const payload = {
      chatId: selectedChat.id,
      senderId: currentUser.uid,
      senderName: profile?.name || "Student",
      text: newMessage.trim(),
      createdAt: Date.now(),
    };

    setNewMessage("");
    await sendChatMessage(payload);
    const updated = await fetchMessages(selectedChat.id);
    setMessages(updated);
  }

  function getPartnerName(chat) {
    return chat.fromId === currentUser.uid ? chat.toName : chat.fromName;
  }

  function getPartnerSkills(chat) {
    if (chat.fromId === currentUser.uid) {
      return `Learning ${chat.skillWanted} • Teaching ${chat.skillOffered}`;
    }
    return `Teaching ${chat.skillWanted} • Learning ${chat.skillOffered}`;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Skill Exchange Chat</h1>
          <p className="text-sm text-ink/60">Coordinate your learning sessions with connected peers.</p>
        </div>
        <Link
          to="/sessions"
          className="text-xs sm:text-sm font-medium px-4 py-2 rounded-full bg-sand border border-mist hover:bg-white text-ink"
        >
          View Sessions →
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink/50">Loading conversations...</div>
      ) : acceptedExchanges.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mist p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-sand flex items-center justify-center text-coral mb-4">
            <ChatIcon className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-xl text-ink mb-2">No active chats yet</h2>
          <p className="text-sm text-ink/60 mb-6">
            Chat unlocks as soon as a skill exchange request is accepted. Discover students with matching skills and connect!
          </p>
          <Link
            to="/discover"
            className="inline-block px-6 py-3 rounded-full bg-coral text-white font-medium hover:bg-coral/90"
          >
            Discover Students
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6 bg-white border border-mist rounded-2xl overflow-hidden shadow-sm min-h-[550px]">
          {/* Conversation sidebar */}
          <div className="md:col-span-4 border-r border-mist bg-sand/30 flex flex-col">
            <div className="p-4 border-b border-mist font-display font-semibold text-sm text-ink/70">
              Active Exchanges ({acceptedExchanges.length})
            </div>
            <div className="overflow-y-auto divide-y divide-mist flex-1">
              {acceptedExchanges.map((chat) => {
                const partner = getPartnerName(chat);
                const isSelected = selectedChat?.id === chat.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left p-4 flex items-start gap-3 ${
                      isSelected ? "bg-white border-l-4 border-l-coral shadow-sm" : "hover:bg-sand/60"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                      {partner[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-ink truncate">{partner}</p>
                      <p className="text-xs text-ink/60 truncate mt-0.5">{getPartnerSkills(chat)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main chat window */}
          <div className="md:col-span-8 flex flex-col h-[550px]">
            {selectedChat ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-mist flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-coral text-white flex items-center justify-center font-display font-bold">
                      {getPartnerName(selectedChat)[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-ink text-sm sm:text-base">
                        {getPartnerName(selectedChat)}
                      </h2>
                      <p className="text-xs text-ink/60">{getPartnerSkills(selectedChat)}</p>
                    </div>
                  </div>
                  <Link
                    to={`/sessions?new=true&partner=${encodeURIComponent(getPartnerName(selectedChat))}&skill=${encodeURIComponent(selectedChat.skillWanted)}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-ink text-white hover:bg-ink/90 font-medium"
                  >
                    + Schedule Session
                  </Link>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-sand/10">
                  {messages.length === 0 ? (
                    <div className="text-center py-16 text-sm text-ink/40">
                      No messages yet. Say hello and set up a time to practice!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === currentUser.uid;
                      const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <span className="text-[11px] text-ink/40 mb-1 px-1">{isMe ? "You" : msg.senderName}</span>
                          <div
                            className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? "bg-ink text-white rounded-tr-none shadow-sm"
                                : "bg-white border border-mist text-ink rounded-tl-none shadow-sm"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span className={`block text-[10px] text-right mt-1 ${isMe ? "text-white/60" : "text-ink/40"}`}>
                              {timeStr}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input box */}
                <form onSubmit={handleSend} className="p-3 border-t border-mist bg-white flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${getPartnerName(selectedChat)}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-mist bg-sand/20 focus:outline-none focus:ring-2 focus:ring-coral/30 text-sm"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-coral text-white font-medium text-sm hover:bg-coral/90 shadow-sm"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-ink/40 text-sm">
                Select a conversation on the left to start chatting.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
