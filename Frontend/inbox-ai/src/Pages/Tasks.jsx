import React, { useState, useEffect } from "react";
import { Task } from "@/entities/Task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Plus,
  Calendar,
  User,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
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

  const filteredTasks = tasks.filter(task => {
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

  const priorityColors = {
    low: "bg-blue-50 text-blue-600 border-blue-200",
    medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
    high: "bg-orange-50 text-orange-600 border-orange-200",
    urgent: "bg-red-50 text-red-600 border-red-200"
  };

  const statusColors = {
    todo: "bg-slate-50 text-slate-600 border-slate-200",
    in_progress: "bg-blue-50 text-blue-600 border-blue-200",
    completed: "bg-green-50 text-green-600 border-green-200",
    cancelled: "bg-red-50 text-red-600 border-red-200"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
              <p className="text-slate-500 mt-1">
                {filteredTasks.length} tasks extracted from messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 hover:bg-slate-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="all">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="todo">
              To Do ({tasks.filter(t => t.status === "todo").length})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress ({tasks.filter(t => t.status === "in_progress").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({tasks.filter(t => t.status === "completed").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid gap-4">
              {Array(5).fill(0).map((_, i) => (
                <Card key={i} className="bg-white/60 backdrop-blur-sm animate-pulse">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
                        <div className="h-3 bg-slate-200 rounded w-32" />
                      </div>
                      <div className="h-6 bg-slate-200 rounded w-16" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => handleStatusChange(task.id, 
                                task.status === "completed" ? "todo" : "completed"
                              )}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                task.status === "completed" 
                                  ? "bg-green-500 border-green-500 text-white" 
                                  : "border-slate-300 hover:border-green-500"
                              }`}
                            >
                              {task.status === "completed" && (
                                <CheckSquare className="w-3 h-3" />
                              )}
                            </button>
                            <CardTitle className={`text-lg ${
                              task.status === "completed" ? "line-through text-slate-500" : "text-slate-900"
                            }`}>
                              {task.title}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs px-2 py-1 ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </Badge>
                            <Badge className={`text-xs px-2 py-1 ${statusColors[task.status]}`}>
                              {task.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            {task.due_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Due {format(new Date(task.due_date), "MMM d")}</span>
                              </div>
                            )}
                            {task.assignee && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{task.assignee}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>From message</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.priority === "urgent" && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {task.status === "in_progress" && (
                            <Clock className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-slate-500">
                    AI will automatically extract tasks from your messages.
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