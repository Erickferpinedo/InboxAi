import React, { useState, useEffect } from 'react';
import { Message } from "../Entities/Message";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

import InboxCard from '../Components/Inbox/InboxCard';
import ThreadView from '../Components/Inbox/ThreadView';

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line
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

  const filters = ['All', 'Gmail', 'WhatsApp', 'Slack'];
  const sortOptions = ['Newest', 'Urgent', 'Awaiting Reply'];

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
    .filter((v, i, a) => a.findIndex(t => (t.thread_id === v.thread_id)) === i); // Unique threads

  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary position-relative">
      {/* ThreadView Overlay */}
      <AnimatePresence>
        {selectedThreadId && (
          <motion.div
            key="thread-view"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1055, // Higher than normal content, lower than modal
              background: 'rgba(255,255,255,1)'
            }}
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
      <div className="sticky-top bg-white bg-opacity-95 border-bottom px-4 pt-4 pb-2" style={{ zIndex: 10 }}>
        <h1 className="h4 fw-bold text-dark mb-4">Inbox</h1>
        {/* Search Bar */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} color="#94A3B8" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="form-control border-start-0"
              // You can implement search here
            />
          </div>
        </div>
        {/* Filters & Sort */}
        <div className="d-flex align-items-center justify-content-between pb-2">
          <div className="d-flex gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`btn btn-sm rounded-pill fw-semibold border 
                  ${activeFilter === filter
                    ? "btn-primary bg-primary text-white border-primary"
                    : "btn-light bg-white border-secondary text-secondary"
                  }`}
                style={{ minWidth: 70 }}
              >
                {filter}
              </button>
            ))}
          </div>
          {/* Sort Dropdown */}
          <div className="position-relative">
            <button
              onClick={() => setShowSort(s => !s)}
              className="btn btn-outline-secondary btn-sm d-flex align-items-center"
              type="button"
            >
              {sortOrder}
              <ChevronDown size={16} className="ms-1" />
            </button>
            {showSort && (
              <div className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm" style={{ minWidth: 150, zIndex: 1000 }}>
                {sortOptions.map(option => (
                  <button
                    key={option}
                    className={`dropdown-item text-start py-2 px-3 ${sortOrder === option ? 'active text-primary fw-bold' : ''}`}
                    onClick={() => {
                      setSortOrder(option);
                      setShowSort(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-grow-1 overflow-auto p-4">
        {isLoading ? (
          <div className="d-flex flex-column gap-3">
            {Array.from({ length: 5 }).map((_, i) =>
              InboxCard.Skeleton ? (
                <InboxCard.Skeleton key={i} />
              ) : (
                <div key={i} className="bg-white rounded-3 p-4 w-100 shadow-sm"></div>
              )
            )}
          </div>
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
