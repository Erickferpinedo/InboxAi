import React, { useState, useEffect, useRef } from 'react';
import { Message } from "../../Entities/Message";
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Paperclip, Bot, Edit, RotateCw } from 'lucide-react';

// Intent Pill
function IntentPill({ intent }) {
  const map = {
    Helpful: "badge bg-primary bg-opacity-10 text-primary border border-primary me-2",
    Apologetic: "badge bg-warning bg-opacity-10 text-warning border border-warning me-2",
    Escalate: "badge bg-danger bg-opacity-10 text-danger border border-danger me-2"
  };
  return (
    <span className={map[intent] || "badge bg-secondary bg-opacity-10 text-secondary border border-secondary me-2"}>
      {intent}
    </span>
  );
}

// Message bubble: avatar as circle with initial, Bootstrap flex
function MessageBubble({ message, isOwn }) {
  return (
    <div className={`d-flex align-items-end gap-2 mb-2 ${isOwn ? 'justify-content-end' : 'justify-content-start'}`}>
      {!isOwn && (
        <div
          className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center shadow"
          style={{ width: 34, height: 34, fontWeight: 600, color: "#495057" }}
        >
          {message.customer_name?.charAt(0)}
        </div>
      )}
      <div
        className={`px-3 py-2 rounded-4 border ${isOwn
          ? 'bg-primary text-white rounded-end-1'
          : 'bg-white border-secondary-subtle text-dark rounded-start-1'
        }`}
        style={{ maxWidth: 350 }}
      >
        <span style={{ fontSize: 14 }}>{message.full_content}</span>
      </div>
    </div>
  );
}

// Suggestions, using pills
function AIReplySuggestions({ onSelectReply }) {
  const suggestions = [
    { intent: 'Helpful', text: 'To get a refund, please visit our returns portal at [link] and enter your order number. Let me know if you need help!' },
    { intent: 'Apologetic', text: 'I\'m so sorry to hear your package is late. I\'ve looked into it and can see it\'s scheduled for delivery tomorrow. Here is the tracking link: [link]' },
    { intent: 'Escalate', text: 'I understand this is frustrating. I\'m escalating this to my manager who will get back to you within 24 hours to resolve this.' }
  ];
  return (
    <div className="p-3 border-top bg-light">
      <div className="d-flex align-items-center gap-2 mb-2">
        <Bot size={20} className="text-primary" />
        <strong className="small">Smart Replies</strong>
      </div>
      <div className="d-flex flex-column gap-2">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border rounded-3 p-3 shadow-sm cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelectReply(s.text)}
          >
            <IntentPill intent={s.intent} />
            <span className="text-secondary small">{s.text}</span>
          </motion.div>
        ))}
        <div className="d-flex justify-content-end gap-2 pt-2">
          <button className="btn btn-link p-0 text-secondary small d-flex align-items-center gap-1">
            <RotateCw size={14} /> Regenerate
          </button>
          <button className="btn btn-link p-0 text-secondary small d-flex align-items-center gap-1">
            <Edit size={14} /> Change Tone
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ThreadView({ threadId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadThread = async () => {
      setIsLoading(true);
      try {
        const threadMessages = await Message.filter({ thread_id: threadId }, 'created_date');
        setMessages(threadMessages);
      } catch (error) {
        console.error("Error loading thread:", error);
      }
      setIsLoading(false);
    };
    loadThread();
  }, [threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async () => {
    if (!replyText.trim() || isSending) return;
    setIsSending(true);
    try {
      const latestMessage = messages[messages.length - 1];
      const newReply = {
        platform: latestMessage.platform,
        customer_name: "Support Team",
        customer_avatar: null,
        content_preview: replyText.substring(0, 50) + (replyText.length > 50 ? "..." : ""),
        full_content: replyText,
        thread_id: threadId,
        status: "open",
        tags: [],
        sentiment: "neutral",
        is_awaiting_reply: false,
      };
      const createdReply = await Message.create(newReply);
      setMessages(prev => [...prev, createdReply]);
      setReplyText('');
      if (latestMessage.is_awaiting_reply) {
        await Message.update(latestMessage.id, { is_awaiting_reply: false });
        setMessages(prev => prev.map(msg =>
          msg.id === latestMessage.id
            ? { ...msg, is_awaiting_reply: false }
            : msg
        ));
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <span className="text-secondary">Loading conversation...</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100">
        <button onClick={onClose} className="position-absolute top-0 start-0 btn btn-link p-2">
          <ArrowLeft size={28} className="text-secondary" />
        </button>
        <span>No messages found in this thread.</span>
      </div>
    );
  }

  const firstMessage = messages[0];

  return (
    <div className="h-100 w-100 d-flex flex-column bg-light">
      <header className="d-flex align-items-center gap-2 p-3 border-bottom bg-white bg-opacity-75" style={{ backdropFilter: "blur(7px)" }}>
        <button onClick={onClose} className="btn btn-link p-2">
          <ArrowLeft size={24} className="text-secondary" />
        </button>
        <div className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center shadow"
          style={{ width: 40, height: 40, fontWeight: 600, fontSize: 20, color: "#495057" }}>
          {firstMessage.customer_name?.charAt(0)}
        </div>
        <div>
          <div className="fw-bold text-dark">{firstMessage.customer_name}</div>
          <div className="text-muted small">via {firstMessage.platform}</div>
        </div>
      </header>

      <div className="flex-grow-1 overflow-auto p-4" style={{ minHeight: 0 }}>
        {messages.map((msg) => (
          msg.id && <MessageBubble key={msg.id} message={msg} isOwn={msg.customer_name === "Support Team"} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <AIReplySuggestions onSelectReply={setReplyText} />

      <footer className="p-2 border-top bg-white">
        <div className="d-flex align-items-center gap-2 bg-light rounded-3 p-2">
          <button className="btn p-2 text-secondary">
            <Paperclip size={20} />
          </button>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            rows={1}
            className="form-control border-0 bg-transparent flex-grow-1"
            style={{ resize: "none", minHeight: 36, fontSize: 15 }}
          />
          <button
            onClick={handleSendReply}
            className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
            disabled={!replyText.trim() || isSending}
            style={{ width: 38, height: 38 }}
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
