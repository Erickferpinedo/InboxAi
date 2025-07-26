import React, { useState, useEffect } from "react";
import { Task } from "../Entities/Task";
import { CheckSquare, Clock, AlertCircle, Plus, Calendar, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// Map priority/status to Bootstrap colors
const priorityColors = {
  low: "bg-primary bg-opacity-10 text-primary",
  medium: "bg-warning bg-opacity-10 text-warning",
  high: "bg-orange bg-opacity-10 text-orange", // You may need to define .text-orange/.bg-orange in your CSS or use a close Bootstrap color
  urgent: "bg-danger bg-opacity-10 text-danger",
};
const statusColors = {
  todo: "bg-secondary bg-opacity-10 text-secondary",
  in_progress: "bg-primary bg-opacity-10 text-primary",
  completed: "bg-success bg-opacity-10 text-success",
  cancelled: "bg-danger bg-opacity-10 text-danger",
};
const tabs = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await Task.list("-created_date");
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
    setIsLoading(false);
  };

  const filteredTasks = tasks.filter((task) => {
    switch (activeTab) {
      case "all":
        return true;
      case "todo":
        return task.status === "todo";
      case "in_progress":
        return task.status === "in_progress";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await Task.update(taskId, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-body-tertiary">
      {/* Header */}
      <div className="border-bottom px-4 pt-4 pb-3 bg-white bg-opacity-95 sticky-top" style={{ zIndex: 10 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-4 bg-primary bg-gradient d-flex align-items-center justify-content-center shadow" style={{ width: 40, height: 40 }}>
              <CheckSquare size={22} color="white" />
            </div>
            <div>
              <h2 className="h5 fw-bold text-dark mb-0">Tasks</h2>
              <div className="text-secondary small mt-1">
                {filteredTasks.length} tasks extracted from messages
              </div>
            </div>
          </div>
          <button
            className="d-flex align-items-center gap-1 btn btn-outline-primary btn-sm fw-semibold"
            onClick={() => {/* Add Task handler */}}
            type="button"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>

        {/* Tabs */}
        <div className="d-flex gap-2 mt-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`btn btn-sm fw-medium px-3 py-1 rounded-pill ${activeTab === tab.key ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key === "all" && ` (${tasks.length})`}
              {tab.key === "todo" && ` (${tasks.filter(t => t.status === "todo").length})`}
              {tab.key === "in_progress" && ` (${tasks.filter(t => t.status === "in_progress").length})`}
              {tab.key === "completed" && ` (${tasks.filter(t => t.status === "completed").length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-grow-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="mb-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3 p-4 mb-3 shadow-sm" style={{ opacity: 0.5 }}>
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <div className="bg-secondary bg-opacity-25 rounded w-50 mb-2" style={{ height: 16 }}></div>
                      <div className="bg-secondary bg-opacity-25 rounded w-25" style={{ height: 12 }}></div>
                    </div>
                    <div className="bg-secondary bg-opacity-25 rounded" style={{ width: 40, height: 24 }}></div>
                  </div>
                  <div className="bg-secondary bg-opacity-25 rounded w-100 mb-2" style={{ height: 16 }}></div>
                  <div className="bg-secondary bg-opacity-25 rounded w-75" style={{ height: 16 }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="bg-white rounded-3 shadow-sm p-4 mb-3 border border-light">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <button
                            onClick={() =>
                              handleStatusChange(
                                task.id,
                                task.status === "completed" ? "todo" : "completed"
                              )
                            }
                            className={`d-flex align-items-center justify-content-center rounded-circle border me-2
                              ${task.status === "completed"
                                ? "bg-success border-success text-white"
                                : "bg-white border-secondary text-secondary"
                              }`}
                            style={{ width: 28, height: 28 }}
                          >
                            {task.status === "completed" && <CheckSquare size={14} />}
                          </button>
                          <span className={`fw-bold fs-5 ${task.status === "completed" ? "text-decoration-line-through text-secondary" : "text-dark"}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className={`badge ${priorityColors[task.priority] || "bg-light text-secondary"} px-2 py-1 text-capitalize`}>
                            {task.priority}
                          </span>
                          <span className={`badge ${statusColors[task.status] || "bg-light text-secondary"} px-2 py-1 text-capitalize`}>
                            {task.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="text-secondary mb-2">{task.description}</div>
                        <div className="d-flex flex-wrap gap-3 small text-secondary">
                          {task.due_date && (
                            <span className="d-flex align-items-center gap-1">
                              <Calendar size={12} />
                              Due {format(new Date(task.due_date), "MMM d")}
                            </span>
                          )}
                          {task.assignee && (
                            <span className="d-flex align-items-center gap-1">
                              <User size={12} />
                              {task.assignee}
                            </span>
                          )}
                          <span className="d-flex align-items-center gap-1">
                            <MessageSquare size={12} />
                            From message
                          </span>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end gap-2">
                        {task.priority === "urgent" && <AlertCircle size={16} color="#F56565" />}
                        {task.status === "in_progress" && <Clock size={16} color="#4299E1" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-5">
                  <div className="mx-auto mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                    <CheckSquare size={32} color="#A0AEC0" />
                  </div>
                  <h3 className="fw-bold text-dark mb-2 fs-5">
                    No tasks found
                  </h3>
                  <div className="text-secondary">
                    AI will automatically extract tasks from your messages.
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
