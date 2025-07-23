import React, { useState, useEffect } from 'react';
import { Message } from '@/entities/Message';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

import InboxCard from '../components/inbox/InboxCard';
import ThreadView from '../components/inbox/ThreadView';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    const data = await Message.list('-created_date');
    setMessages(data);
    setIsLoading(false);
  };
  
  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
  };

  const handleCloseThread = () => {
    setSelectedThreadId(null);
    loadMessages(); // Refresh inbox on close
  };
  
  const filteredMessages = messages
    .filter(m => activeFilter === 'All' || m.platform === activeFilter.toLowerCase())
    .sort((a, b) => {
        if (sortOrder === 'Urgent' && a.tags?.includes('Urgent') !== b.tags?.includes('Urgent')) {
            return a.tags?.includes('Urgent') ? -1 : 1;
        }
        if (sortOrder === 'Awaiting Reply' && a.is_awaiting_reply !== b.is_awaiting_reply) {
            return a.is_awaiting_reply ? -1 : 1;
        }
        return new Date(b.created_date) - new Date(a.created_date);
    })
    .filter((v, i, a) => a.findIndex(t => (t.thread_id === v.thread_id)) === i); // Get unique threads

  return (
    <div className="h-full w-full flex flex-col bg-slate-50">
      <AnimatePresence>
        {selectedThreadId && (
          <motion.div
            key="thread-view"
            className="absolute inset-0 z-10 bg-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ThreadView
              threadId={selectedThreadId}
              onClose={handleCloseThread}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-5 border-b border-slate-200/80 px-4 pt-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Inbox</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5"
          />
        </div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex gap-2">
            {['All', 'Gmail', 'WhatsApp', 'Slack'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
                  activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1 text-sm font-semibold text-slate-600">
            {sortOrder} <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <InboxCard.Skeleton key={i} />)
        ) : (
          <AnimatePresence>
            {filteredMessages.map(message => (
              <motion.div
                key={message.thread_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <InboxCard
                  message={message}
                  onSelect={() => handleSelectThread(message.thread_id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
