// src/entities/AIDraft.js

// Sample/mock drafts for frontend development
const sampleDrafts = [
  {
    id: "1",
    message_id: "msg-1",
    platform: "gmail",
    recipient: "alice@email.com",
    subject: "Follow up",
    content: "Hi Alice, just following up on our last conversation.",
    tone: "professional",
    confidence_score: 0.95,
    is_sent: false,
    alternatives: [
      { content: "Hey Alice, just checking in!", tone: "casual" }
    ],
    created_date: "2024-07-23T17:42:00Z"
  }
];

// Export an AIDraft object with async methods
export const AIDraft = {
  list: async (sortOrder = "-created_date") => {
    // Returns the sample data for now
    return sampleDrafts;
  },
  update: async (draftId, updates) => {
    const draft = sampleDrafts.find(d => d.id === draftId);
    if (draft) Object.assign(draft, updates);
    return draft;
  },
  delete: async (draftId) => {
    const idx = sampleDrafts.findIndex(d => d.id === draftId);
    if (idx !== -1) sampleDrafts.splice(idx, 1);
    return true;
  }
};
