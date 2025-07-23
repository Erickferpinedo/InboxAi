import React, { useState, useEffect } from "react";
import { Message } from "@/entities/Message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare,
  ArrowRight,
  Clock,
  Star,
  Archive
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Threads() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
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
    if (!acc[threadId]) {
      acc[threadId] = [];
    }
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
      lastActivity: latestMessage.created_date
    };
  });

  // Sort threads by last activity
  threadList.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Threads</h1>
            <p className="text-slate-500 mt-1">
              {threadList.length} conversation threads
            </p>
          </div>
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="space-y-4">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="bg-white/60 backdrop-blur-sm animate-pulse">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-slate-200 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
                          <div className="h-3 bg-slate-200 rounded w-32" />
                        </div>
                      </div>
                      <div className="h-6 bg-slate-200 rounded w-16" />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {threadList.map((thread) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="relative">
                            <Avatar className="w-10 h-10 ring-2 ring-white/50">
                              <AvatarImage src={thread.latestMessage.sender_avatar} />
                              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                                {thread.latestMessage.sender_name[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {thread.messageCount > 1 && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-600 text-white text-xs rounded-full flex items-center justify-center">
                                {thread.messageCount}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className={`text-lg ${thread.unreadCount > 0 ? "text-slate-900" : "text-slate-700"}`}>
                                {thread.subject}
                              </CardTitle>
                              {thread.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  {thread.unreadCount} new
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-slate-500">
                                {thread.participants.length > 1 
                                  ? `${thread.participants.slice(0, 2).join(", ")}${thread.participants.length > 2 ? ` +${thread.participants.length - 2} more` : ""}`
                                  : thread.participants[0]
                                }
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500">
                                {format(new Date(thread.lastActivity), "MMM d, h:mm a")}
                              </span>
                            </div>
                            
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {thread.latestMessage.preview || thread.latestMessage.content?.substring(0, 120) + "..."}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {thread.latestMessage.is_starred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
              
              {threadList.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No conversation threads
                  </h3>
                  <p className="text-slate-500">
                    Start messaging across platforms to see your threads here.
                  </p>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}