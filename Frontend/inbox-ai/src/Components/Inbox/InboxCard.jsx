import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Facebook, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';

const platformIcons = {
  gmail: { icon: Mail, color: 'text-red-500' },
  whatsapp: { icon: MessageCircle, color: 'text-green-500' },
  slack: { icon: Bot, color: 'text-purple-500' },
  facebook: { icon: Facebook, color: 'text-blue-600' },
};

const tagColors = {
    Urgent: "bg-red-100 text-red-700",
    Refund: "bg-amber-100 text-amber-700",
    Bug: "bg-purple-100 text-purple-700",
    Shipping: "bg-blue-100 text-blue-700"
}

export default function InboxCard({ message, onSelect }) {
  const PlatformIcon = platformIcons[message.platform]?.icon || Mail;
  const platformColor = platformIcons[message.platform]?.color || 'text-slate-500';

  return (
    <motion.div
      onClick={onSelect}
      className={`w-full bg-white p-4 rounded-xl shadow-sm border ${message.is_awaiting_reply ? 'border-blue-200' : 'border-slate-100'}`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
            <AvatarImage src={message.customer_avatar} />
            <AvatarFallback className="bg-slate-200 text-slate-600">
              {message.customer_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow">
            <PlatformIcon className={`w-4 h-4 ${platformColor}`} />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800 truncate">
              {message.customer_name}
            </h3>
            <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
              {new Date(message.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-sm text-slate-500 truncate mt-0.5">
            {message.content_preview}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            {message.tags?.map(tag => (
              <Badge key={tag} className={`text-xs px-2 py-0.5 ${tagColors[tag] || 'bg-slate-100 text-slate-600'}`}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

InboxCard.Skeleton = function Skeleton() {
  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-3/5 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-4/5"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-4 bg-slate-200 rounded-full w-16"></div>
            <div className="h-4 bg-slate-200 rounded-full w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};