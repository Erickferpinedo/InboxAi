// src/entities/Message.js

// Sample data for development:
const sampleMessages = [
  {
    id: "1",
    platform: "gmail",
    customer_name: "Jane Doe",
    customer_avatar: "",
    content_preview: "Hello, I have an issue with my order.",
    full_content: "Hello, I have an issue with my order. Could you please help?",
    thread_id: "thread-1",
    status: "open",
    snoozed_until: null,
    tags: ["Urgent"],
    sentiment: "neutral",
    is_awaiting_reply: true,
    created_date: "2024-07-23T17:42:00Z",
    sender_name: "Jane Doe",
    sender_avatar: "",
    subject: "Order issue",
    preview: "Hello, I have an issue with my order."
  }
  // Add more for testing if you want
];

// Export a Message object with async methods
export const Message = {
  list: async (sortOrder = "-created_date") => {
    // Return the sample messages
    return sampleMessages;
  }
};
