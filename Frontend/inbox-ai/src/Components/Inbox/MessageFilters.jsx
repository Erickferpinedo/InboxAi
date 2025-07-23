import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MessageSquare, 
  Star, 
  AlertCircle,
  Reply,
  Inbox
} from "lucide-react";

export default function MessageFilters({ activeFilter, onFilterChange, messages }) {
  const getFilterCount = (filter) => {
    switch (filter) {
      case "all":
        return messages.length;
      case "unread":
        return messages.filter(m => !m.is_read).length;
      case "starred":
        return messages.filter(m => m.is_starred).length;
      case "urgent":
        return messages.filter(m => m.is_urgent).length;
      case "needs_reply":
        return messages.filter(m => m.needs_reply).length;
      case "gmail":
        return messages.filter(m => m.platform === "gmail").length;
      case "slack":
        return messages.filter(m => m.platform === "slack").length;
      case "linkedin":
        return messages.filter(m => m.platform === "linkedin").length;
      default:
        return 0;
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
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const count = getFilterCount(filter.id);
        const Icon = filter.icon;
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === filter.id
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                : "bg-white/60 text-slate-600 hover:bg-white/80 hover:text-slate-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{filter.label}</span>
            {count > 0 && (
              <Badge 
                className={`text-xs px-2 py-1 ${
                  activeFilter === filter.id 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}