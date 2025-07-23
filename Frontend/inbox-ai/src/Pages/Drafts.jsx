import React, { useState, useEffect } from "react";
import { AIDraft } from "@/entities/AIDraft";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, 
  Send, 
  Edit3, 
  Trash2, 
  RefreshCw,
  Sparkles,
  Clock,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    setIsLoading(true);
    try {
      const data = await AIDraft.list("-created_date");
      setDrafts(data);
    } catch (error) {
      console.error("Error loading drafts:", error);
    }
    setIsLoading(false);
  };

  const filteredDrafts = drafts.filter(draft => {
    switch (activeTab) {
      case "pending":
        return !draft.is_sent;
      case "sent":
        return draft.is_sent;
      default:
        return true;
    }
  });

  const handleSendDraft = async (draftId) => {
    try {
      await AIDraft.update(draftId, { is_sent: true });
      loadDrafts();
    } catch (error) {
      console.error("Error sending draft:", error);
    }
  };

  const handleDeleteDraft = async (draftId) => {
    try {
      await AIDraft.delete(draftId);
      loadDrafts();
    } catch (error) {
      console.error("Error deleting draft:", error);
    }
  };

  const toneColors = {
    professional: "bg-blue-50 text-blue-600 border-blue-200",
    casual: "bg-green-50 text-green-600 border-green-200",
    formal: "bg-purple-50 text-purple-600 border-purple-200",
    friendly: "bg-yellow-50 text-yellow-600 border-yellow-200",
    short: "bg-orange-50 text-orange-600 border-orange-200",
    long: "bg-indigo-50 text-indigo-600 border-indigo-200"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Drafts</h1>
              <p className="text-slate-500 mt-1">
                {filteredDrafts.length} drafts ready for review
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDrafts}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending ({drafts.filter(d => !d.is_sent).length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Sent ({drafts.filter(d => d.is_sent).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Drafts List */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i} className="bg-white/60 backdrop-blur-sm animate-pulse">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                        <div className="h-3 bg-slate-200 rounded w-24" />
                      </div>
                      <div className="h-6 bg-slate-200 rounded w-16" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredDrafts.map((draft) => (
                <motion.div
                  key={draft.id}
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
                            <CardTitle className="text-lg text-slate-900">
                              {draft.subject || "Reply Draft"}
                            </CardTitle>
                            <Badge className={`text-xs px-2 py-1 ${toneColors[draft.tone]}`}>
                              {draft.tone}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            To: {draft.recipient} • {format(new Date(draft.created_date), "MMM d, h:mm a")}
                          </p>
                          {draft.confidence_score && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-xs text-slate-500">
                                {Math.round(draft.confidence_score * 100)}% confidence
                              </span>
                            </div>
                          )}
                        </div>
                        <Badge 
                          className={`${draft.platform === "gmail" ? "bg-red-50 text-red-600" : "bg-purple-50 text-purple-600"}`}
                        >
                          {draft.platform}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed mb-4 line-clamp-3">
                        {draft.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs text-slate-500">
                            AI Generated
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!draft.is_sent ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-slate-600 hover:text-slate-900"
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSendDraft(draft.id)}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Send
                              </Button>
                            </>
                          ) : (
                            <Badge className="bg-green-50 text-green-600 border-green-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Sent
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="w-8 h-8 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {filteredDrafts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PenTool className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No drafts found
                  </h3>
                  <p className="text-slate-500">
                    AI will generate smart reply drafts as you receive messages.
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