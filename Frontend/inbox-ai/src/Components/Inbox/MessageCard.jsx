import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Check,
  AlertCircle,
  Reply,
  Archive,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";

// platformIcon and platformColor come from props

export default function MessageCard({
  message,
  onClick,
  onAction,
  platformIcon: PlatformIcon,
  platformColor
}) {
  const handleAction = (action, e) => {
    e.stopPropagation();
    onAction(message.id, action);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-3 p-4 border shadow-sm mb-3 position-relative ${
        !message.is_read ? "border-primary" : "border-light"
      }`}
      style={{ cursor: "pointer", transition: "box-shadow 0.3s" }}
      onClick={onClick}
    >
      <div className="d-flex align-items-start justify-content-between">
        {/* Avatar & content */}
        <div className="d-flex align-items-start gap-3 flex-grow-1">
          {/* Avatar with fallback */}
          <div style={{ position: "relative" }}>
            {message.sender_avatar ? (
              <img
                src={message.sender_avatar}
                alt={message.sender_name}
                className="rounded-circle border border-white"
                style={{
                  width: 44,
                  height: 44,
                  objectFit: "cover",
                  background: "#e0e7ef",
                  fontSize: 22,
                }}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                style={{
                  width: 44,
                  height: 44,
                  background:
                    "linear-gradient(90deg, #6366f1 0%, #a21caf 100%)",
                  fontSize: 22,
                  border: "2px solid #fff",
                  textShadow: "0 1px 3px rgba(0,0,0,.10)",
                }}
              >
                {message.sender_name[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-grow-1 min-w-0">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className={`fw-semibold ${!message.is_read ? "text-dark" : "text-secondary"}`}>
                {message.sender_name}
              </span>
              <span
                className={`badge rounded-pill d-inline-flex align-items-center px-2 py-1 ${platformColor || "bg-secondary text-white"}`}
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                <PlatformIcon size={14} className="me-1" />
                {message.platform}
              </span>
              <span className="text-muted small ms-2">
                {format(new Date(message.created_date), "MMM d, h:mm a")}
              </span>
            </div>

            {message.subject && (
              <h3 className={`fs-6 mb-2 ${!message.is_read ? "fw-bold text-dark" : "text-secondary"}`}>
                {message.subject}
              </h3>
            )}

            <p className="mb-2 text-secondary small" style={{ lineHeight: 1.5 }}>
              {message.preview || (message.content?.substring(0, 150) + "...")}
            </p>

            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
              {message.is_urgent && (
                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle px-2 py-1 d-flex align-items-center" style={{ fontSize: 12 }}>
                  <AlertCircle size={14} className="me-1" />
                  Urgent
                </span>
              )}
              {message.needs_reply && (
                <span className="badge bg-warning bg-opacity-10 text-warning border border-warning-subtle px-2 py-1 d-flex align-items-center" style={{ fontSize: 12 }}>
                  <Reply size={14} className="me-1" />
                  Needs Reply
                </span>
              )}
              {message.labels?.map((label, idx) => (
                <span key={idx} className="badge bg-light text-secondary border border-secondary-subtle px-2 py-1" style={{ fontSize: 12 }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Star button and more actions */}
        <div className="d-flex align-items-center gap-2 ms-3 flex-shrink-0">
          {/* Star toggle */}
          <button
            className={`btn btn-link btn-sm p-0 m-0 lh-1 ${message.is_starred ? "text-warning" : "text-secondary"}`}
            onClick={e => handleAction("star", e)}
            tabIndex={-1}
            title="Star"
            type="button"
          >
            <Star size={18} fill={message.is_starred ? "#ffc107" : "none"} />
          </button>
          {/* Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-link btn-sm text-secondary p-0 ms-1 lh-1"
              type="button"
              id={`dropdownMenu-${message.id}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
              tabIndex={-1}
              title="More"
            >
              <MoreHorizontal size={18} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenu-${message.id}`}>
              <li>
                <button className="dropdown-item d-flex align-items-center" onClick={e => handleAction("read", e)}>
                  <Check size={14} className="me-2" /> Mark as Read
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center" onClick={e => handleAction("snooze", e)}>
                  <Clock size={14} className="me-2" /> Snooze
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center" onClick={e => handleAction("done", e)}>
                  <Check size={14} className="me-2" /> Mark as Done
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center" onClick={e => handleAction("archive", e)}>
                  <Archive size={14} className="me-2" /> Archive
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
