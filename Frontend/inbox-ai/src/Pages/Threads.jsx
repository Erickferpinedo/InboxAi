import React, { useState, useEffect } from "react";
import { Message } from "../Entities/Message";
import { MessageSquare, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// Returns initials from a name
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function Threads() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await Message.list("-created_date");
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
    setIsLoading(false);
  };

  // Group messages by thread_id
  const threads = messages.reduce((acc, message) => {
    const threadId = message.thread_id || message.id;
    if (!acc[threadId]) acc[threadId] = [];
    acc[threadId].push(message);
    return acc;
  }, {});

  const threadList = Object.entries(threads).map(([threadId, threadMessages]) => {
    const latestMessage = threadMessages[0];
    const messageCount = threadMessages.length;
    const unreadCount = threadMessages.filter(m => !m.is_read).length;
    return {
      id: threadId,
      messages: threadMessages,
      latestMessage,
      messageCount,
      unreadCount,
      subject: latestMessage.subject || `Thread with ${latestMessage.sender_name}`,
      participants: [...new Set(threadMessages.map(m => m.sender_name))],
      lastActivity: latestMessage.created_date,
    };
  });

  threadList.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

  return (
    <div className="min-vh-100 d-flex flex-column bg-body-tertiary">
      {/* Header */}
      <div className="bg-white bg-opacity-95 border-bottom px-4 pt-4 pb-3 sticky-top" style={{ zIndex: 10 }}>
        <div className="d-flex align-items-center gap-3 mb-2">
          <div className="rounded-4 bg-primary bg-gradient d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
            <MessageSquare size={22} color="white" />
          </div>
          <div>
            <h2 className="h5 fw-bold text-dark mb-0">Threads</h2>
            <div className="text-secondary small mt-1">
              {threadList.length} conversation threads
            </div>
          </div>
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-grow-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="mb-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3 p-3 mb-3 shadow-sm d-flex align-items-center gap-3" style={{ opacity: 0.5 }}>
                  <div className="rounded-circle bg-secondary bg-opacity-25" style={{ width: 40, height: 40 }} />
                  <div className="flex-grow-1">
                    <div className="bg-secondary bg-opacity-25 rounded mb-2" style={{ width: 180, height: 16 }}></div>
                    <div className="bg-secondary bg-opacity-25 rounded" style={{ width: 120, height: 12 }}></div>
                  </div>
                  <div className="bg-secondary bg-opacity-25 rounded" style={{ width: 40, height: 24 }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {threadList.map((thread) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -2 }}
                >
                  <div
                    className="bg-white rounded-3 shadow-sm p-3 mb-3 border border-light d-flex align-items-start justify-content-between cursor-pointer"
                    style={{ transition: "box-shadow 0.2s" }}
                  >
                    <div className="d-flex align-items-start gap-3 flex-grow-1">
                      {/* Avatar */}
                      <div className="position-relative">
                        {thread.latestMessage.sender_avatar ? (
                          <img
                            src={thread.latestMessage.sender_avatar}
                            alt={getInitials(thread.latestMessage.sender_name)}
                            className="rounded-circle border"
                            style={{ width: 40, height: 40, objectFit: "cover" }}
                          />
                        ) : (
                          <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fs-6 border"
                            style={{ width: 40, height: 40 }}>
                            {getInitials(thread.latestMessage.sender_name)}
                          </div>
                        )}
                        {thread.messageCount > 1 && (
                          <span
                            className="position-absolute top-100 start-100 translate-middle badge rounded-pill bg-dark"
                            style={{ fontSize: 10, minWidth: 18, minHeight: 18 }}
                          >
                            {thread.messageCount}
                          </span>
                        )}
                      </div>
                      {/* Thread info */}
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className={`fw-bold fs-6 text-truncate ${thread.unreadCount > 0 ? "text-dark" : "text-secondary"}`}>
                            {thread.subject}
                          </span>
                          {thread.unreadCount > 0 && (
                            <span className="badge bg-danger bg-opacity-75 ms-1">{thread.unreadCount} new</span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-1 small text-muted">
                          <span className="text-truncate">
                            {thread.participants.length > 1
                              ? `${thread.participants.slice(0, 2).join(", ")}${thread.participants.length > 2 ? ` +${thread.participants.length - 2} more` : ""}`
                              : thread.participants[0]
                            }
                          </span>
                          <span>&bull;</span>
                          <span>
                            {format(new Date(thread.lastActivity), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <div className="small text-secondary text-truncate" style={{ maxWidth: 260 }}>
                          {thread.latestMessage.preview ||
                            (thread.latestMessage.content
                              ? thread.latestMessage.content.substring(0, 120) + "..."
                              : "")
                          }
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 ms-2">
                      {thread.latestMessage.is_starred && (
                        <Star size={18} color="#ECC94B" fill="#ECC94B" />
                      )}
                      <ArrowRight size={22} color="#94A3B8" />
                    </div>
                  </div>
                </motion.div>
              ))}
              {threadList.length === 0 && (
                <div className="text-center py-5">
                  <div className="mx-auto mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                    <MessageSquare size={32} color="#A0AEC0" />
                  </div>
                  <h3 className="fw-bold text-dark mb-2 fs-6">
                    No conversation threads
                  </h3>
                  <div className="text-secondary">
                    Start messaging across platforms to see your threads here.
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
