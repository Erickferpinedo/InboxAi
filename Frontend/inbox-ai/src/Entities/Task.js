// src/Entities/Task.js

const sampleTasks = [
  {
    id: "1",
    title: "Reply to customer email",
    description: "Respond to John's question about order #1234",
    extracted_from_message: "msg-1",
    due_date: "2024-07-28T12:00:00Z",
    priority: "medium",
    status: "todo",
    assignee: "Erick"
  },
  {
    id: "2",
    title: "Schedule team meeting",
    description: "Coordinate a meeting with the support team",
    extracted_from_message: "msg-2",
    due_date: "2024-07-29T15:30:00Z",
    priority: "high",
    status: "in_progress",
    assignee: "Jane"
  }
];

// Export an object with async methods (to match your existing usage)
export const Task = {
  list: async (sortOrder = "-created_date") => {
    // Just return the sample data for now
    return sampleTasks;
  },
  update: async (taskId, updates) => {
    const task = sampleTasks.find(t => t.id === taskId);
    if (task) Object.assign(task, updates);
    return task;
  },
  delete: async (taskId) => {
    const idx = sampleTasks.findIndex(t => t.id === taskId);
    if (idx !== -1) sampleTasks.splice(idx, 1);
    return true;
  }
};
