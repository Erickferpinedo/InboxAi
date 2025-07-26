// src/Entities/SmartReply.js

const sampleSmartReplies = [
  {
    id: "sr1",
    message_id: "1",
    content: "To get a refund, please visit our returns portal at [link] and enter your order number.",
    intent: "Helpful",
    tone: "Friendly",
    status: "pending_review"
  },
  {
    id: "sr2",
    message_id: "2",
    content: "I'm so sorry to hear your package is late. I've looked into it and it's scheduled for delivery tomorrow.",
    intent: "Apologetic",
    tone: "Professional",
    status: "pending_review"
  }
];

export const SmartReply = {
  list: async (filter = {}) => {
    // Just return all sample replies for now
    return sampleSmartReplies.filter(r =>
      !filter.message_id || r.message_id === filter.message_id
    );
  },
  create: async (reply) => {
    const newReply = { ...reply, id: String(Date.now()) };
    sampleSmartReplies.push(newReply);
    return newReply;
  },
  update: async (id, updates) => {
    const idx = sampleSmartReplies.findIndex(r => r.id === id);
    if (idx !== -1) Object.assign(sampleSmartReplies[idx], updates);
    return sampleSmartReplies[idx];
  },
  delete: async (id) => {
    const idx = sampleSmartReplies.findIndex(r => r.id === id);
    if (idx !== -1) sampleSmartReplies.splice(idx, 1);
    return true;
  }
};
