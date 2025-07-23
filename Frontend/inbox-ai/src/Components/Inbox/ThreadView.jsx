import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/entities/Message';
import { SmartReply } from '@/entities/SmartReply';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Paperclip, Smile, Bot, Edit, Copy, RotateCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';

const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
    {!isOwn && (
       <Avatar className="w-8 h-8">
            <AvatarImage src={message.customer_avatar} />
            <AvatarFallback>{message.customer_name?.charAt(0)}</AvatarFallback>
        </Avatar>
    )}
    <div
      className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
        isOwn ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-lg'
      }`}
    >
      <p className="text-sm">{message.full_content}</p>
    </div>
  </div>
);

const AIReplySuggestions = ({ onSelectReply }) => {
    const suggestions = [
        { intent: 'Helpful', text: 'To get a refund, please visit our returns portal at [link] and enter your order number. Let me know if you need help!' },
        { intent: 'Apologetic', text: 'I\'m so sorry to hear your package is late. I\'ve looked into it and can see it\'s scheduled for delivery tomorrow. Here is the tracking link: [link]' },
        { intent: 'Escalate', text: 'I understand this is frustrating. I\'m escalating this to my manager who will get back to you within 24 hours to resolve this.' }
    ];

    return (
        <div className="p-4 bg-slate-100/70 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
                <Bot className="w-5 h-5 text-blue-600"/>
                <h3 className="text-sm font-bold text-slate-800">Smart Replies</h3>
            </div>
            <div className="space-y-2">
                {suggestions.map((s, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => onSelectReply(s.text)}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400"
                    >
                        <Badge variant="outline" className="mb-1.5 border-blue-200 text-blue-700 bg-blue-50">{s.intent}</Badge>
                        <p className="text-sm text-slate-600">{s.text}</p>
                    </motion.div>
                ))}
                 <div className="flex justify-end gap-2 pt-2">
                    <button className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600"><RotateCw className="w-3 h-3"/>Regenerate</button>
                    <button className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600"><Edit className="w-3 h-3"/>Change Tone</button>
                </div>
            </div>
        </div>
    );
};


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

        // Create the new reply message
        const createdReply = await Message.create(newReply);
        
        // Update the messages list with the actual created message
        setMessages(prev => [...prev, createdReply]);
        
        // Clear the reply text
        setReplyText('');
        
        // Update the original message to mark it as not awaiting reply
        if (latestMessage.is_awaiting_reply) {
          await Message.update(latestMessage.id, { is_awaiting_reply: false });
          // Update the message in our local state too
          setMessages(prev => prev.map(msg => 
            msg.id === latestMessage.id 
              ? { ...msg, is_awaiting_reply: false }
              : msg
          ));
        }
        
      } catch (error) {
        console.error("Failed to send reply:", error);
        // Show error to user - could add a toast notification here
      }
      
      setIsSending(false);
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Loading conversation...</p>
        </div>
    );
  }
  
  if (messages.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <button onClick={onClose} className="absolute top-4 left-4 p-2">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <p>No messages found in this thread.</p>
        </div>
    );
  }

  const firstMessage = messages[0];

  return (
    <div className="h-full w-full flex flex-col bg-slate-50">
      <header className="flex items-center gap-2 p-3 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <button onClick={onClose} className="p-2">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={firstMessage.customer_avatar} />
          <AvatarFallback>{firstMessage.customer_name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-slate-900">{firstMessage.customer_name}</h2>
          <p className="text-xs text-slate-500">via {firstMessage.platform}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          msg.id && <MessageBubble key={msg.id} message={msg} isOwn={msg.customer_name === "Support Team"} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <AIReplySuggestions onSelectReply={(text) => setReplyText(text)} />

      <footer className="p-2 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-2">
          <button className="p-2 text-slate-500"><Paperclip className="w-5 h-5"/></button>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            rows="1"
            className="flex-1 bg-transparent focus:outline-none resize-none text-sm"
          />
          <button
            onClick={handleSendReply} 
            className="p-2 rounded-full bg-blue-600 text-white disabled:bg-blue-300" 
            disabled={!replyText.trim() || isSending}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}