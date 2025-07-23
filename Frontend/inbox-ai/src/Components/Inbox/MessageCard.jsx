import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
        !message.is_read ? "ring-2 ring-indigo-500/20" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <Avatar className="w-10 h-10 ring-2 ring-white/50">
            <AvatarImage src={message.sender_avatar} />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              {message.sender_name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${!message.is_read ? "text-slate-900" : "text-slate-700"}`}>
                {message.sender_name}
              </span>
              <Badge className={`text-xs px-2 py-1 ${platformColor}`}>
                <PlatformIcon className="w-3 h-3 mr-1" />
                {message.platform}
              </Badge>
              <span className="text-xs text-slate-500">
                {format(new Date(message.created_date), "MMM d, h:mm a")}
              </span>
            </div>
            
            {message.subject && (
              <h3 className={`text-sm mb-2 ${!message.is_read ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                {message.subject}
              </h3>
            )}
            
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {message.preview || message.content?.substring(0, 150) + "..."}
            </p>
            
            <div className="flex items-center gap-2 flex-wrap">
              {message.is_urgent && (
                <Badge className="bg-red-50 text-red-600 border-red-200 text-xs">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
              {message.needs_reply && (
                <Badge className="bg-amber-50 text-amber-600 border-amber-200 text-xs">
                  <Reply className="w-3 h-3 mr-1" />
                  Needs Reply
                </Badge>
              )}
              {message.labels?.map((label, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            className={`w-8 h-8 ${message.is_starred ? "text-yellow-500" : "text-slate-400"}`}
            onClick={(e) => handleAction("star", e)}
          >
            <Star className={`w-4 h-4 ${message.is_starred ? "fill-current" : ""}`} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => handleAction("read", e)}>
                <Check className="w-4 h-4 mr-2" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleAction("snooze", e)}>
                <Clock className="w-4 h-4 mr-2" />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleAction("done", e)}>
                <Check className="w-4 h-4 mr-2" />
                Mark as Done
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleAction("archive", e)}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}