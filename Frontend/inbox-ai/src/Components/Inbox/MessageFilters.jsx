import React from "react";
import { Mail, MessageSquare, Star, AlertCircle, Reply, Inbox } from "lucide-react";

export default function MessageFilters({ activeFilter, onFilterChange, messages }) {
  const getFilterCount = (filter) => {
    switch (filter) {
      case "all":         return messages.length;
      case "unread":      return messages.filter(m => !m.is_read).length;
      case "starred":     return messages.filter(m => m.is_starred).length;
      case "urgent":      return messages.filter(m => m.is_urgent).length;
      case "needs_reply": return messages.filter(m => m.needs_reply).length;
      case "gmail":       return messages.filter(m => m.platform === "gmail").length;
      case "slack":       return messages.filter(m => m.platform === "slack").length;
      case "linkedin":    return messages.filter(m => m.platform === "linkedin").length;
      default: return 0;
    }
  };

  const filters = [
    { id: "all", label: "All", icon: Inbox },
    { id: "unread", label: "Unread", icon: Mail },
    { id: "starred", label: "Starred", icon: Star },
    { id: "urgent", label: "Urgent", icon: AlertCircle },
    { id: "needs_reply", label: "Needs Reply", icon: Reply },
    { id: "gmail", label: "Gmail", icon: Mail },
    { id: "slack", label: "Slack", icon: MessageSquare },
    { id: "linkedin", label: "LinkedIn", icon: MessageSquare }
  ];

  return (
    <div className="d-flex flex-wrap gap-2 my-2">
      {filters.map((filter) => {
        const count = getFilterCount(filter.id);
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={`btn d-flex align-items-center gap-2 py-1 px-3 rounded-pill border
              ${isActive 
                ? "btn-primary text-white shadow-sm"
                : "btn-outline-secondary bg-white text-secondary"
              }`}
            style={{
              fontWeight: 500,
              fontSize: "0.98rem",
              transition: "all 0.12s"
            }}
          >
            <Icon size={16} />
            <span>{filter.label}</span>
            {count > 0 && (
              <span className={`badge rounded-pill ms-1
                ${isActive 
                  ? "bg-light text-primary" 
                  : "bg-secondary-subtle text-secondary"
                }`}
                style={{fontSize: "0.78em", fontWeight: 600}}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
