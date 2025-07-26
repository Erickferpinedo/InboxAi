import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Facebook, Bot } from 'lucide-react';

// Bootstrap-friendly color map
const platformIcons = {
  gmail: { icon: Mail, color: 'text-danger' },
  whatsapp: { icon: MessageCircle, color: 'text-success' },
  slack: { icon: Bot, color: 'text-primary' },
  facebook: { icon: Facebook, color: 'text-primary' },
};

// Use Bootstrap badge color classes
const tagColors = {
  Urgent: "bg-danger bg-opacity-10 text-danger",
  Refund: "bg-warning bg-opacity-10 text-warning",
  Bug: "bg-primary bg-opacity-10 text-primary",
  Shipping: "bg-info bg-opacity-10 text-info"
};

export default function InboxCard({ message, onSelect }) {
  const PlatformIcon = platformIcons[message.platform]?.icon || Mail;
  const platformColor = platformIcons[message.platform]?.color || 'text-secondary';

  return (
    <motion.div
      onClick={onSelect}
      className={`w-100 bg-white p-3 rounded shadow-sm border ${message.is_awaiting_reply ? 'border-primary' : 'border-light'} mb-3 inboxcard-hover`}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex align-items-start gap-3">
        {/* Avatar as colored circle with initial */}
        <div style={{ position: 'relative' }}>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-semibold shadow"
            style={{
              width: 48,
              height: 48,
              background: '#e2e8f0', // light gray
              color: '#64748b',       // slate
              fontSize: 22,
            }}
          >
            {message.customer_name?.charAt(0)}
          </div>
          <div
            className="rounded-circle shadow d-flex align-items-center justify-content-center bg-white"
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 24,
              height: 24,
              padding: 2,
            }}
          >
            <PlatformIcon className={platformColor} size={16} />
          </div>
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="fs-6 fw-bold mb-0 text-truncate" style={{ color: "#1e293b", maxWidth: 160 }}>
              {message.customer_name}
            </h3>
            <span className="text-muted small ms-2 flex-shrink-0">
              {new Date(message.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="mb-1 text-secondary text-truncate" style={{ maxWidth: 250 }}>
            {message.content_preview}
          </p>
          <div className="d-flex align-items-center flex-wrap mt-1">
            {message.tags?.map(tag => (
              <span
                key={tag}
                className={`badge rounded-pill me-2 mb-1 ${tagColors[tag] || 'bg-light text-secondary'}`}
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton loader for Bootstrap version
InboxCard.Skeleton = function Skeleton() {
  return (
    <div className="w-100 bg-white p-3 rounded shadow-sm border border-light mb-3">
      <div className="d-flex align-items-start gap-3">
        <div className="rounded-circle bg-light" style={{ width: 48, height: 48 }}></div>
        <div className="flex-grow-1">
          <div className="bg-light rounded mb-2" style={{ height: 16, width: "60%" }}></div>
          <div className="bg-light rounded mb-2" style={{ height: 12, width: "80%" }}></div>
          <div className="d-flex gap-2 mt-2">
            <div className="bg-light rounded-pill" style={{ height: 16, width: 48 }}></div>
            <div className="bg-light rounded-pill" style={{ height: 16, width: 48 }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
