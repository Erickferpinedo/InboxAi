import React, { useState, useEffect } from "react";
import { AIDraft } from "../Entities/AIDraft";
import {
  PenTool,
  Send,
  Edit3,
  Trash2,
  RefreshCw,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// Just simple color mapping, you can tweak colors as needed
const toneStyles = {
  professional: "badge bg-primary-subtle text-primary-emphasis",
  casual: "badge bg-success-subtle text-success-emphasis",
  formal: "badge bg-purple-subtle text-purple-emphasis",
  friendly: "badge bg-warning-subtle text-warning-emphasis",
  short: "badge bg-orange-subtle text-orange-emphasis",
  long: "badge bg-info-subtle text-info-emphasis",
};

const platformStyles = {
  gmail: "badge bg-danger-subtle text-danger-emphasis",
  slack: "badge bg-purple-subtle text-purple-emphasis",
  outlook: "badge bg-primary-subtle text-primary-emphasis",
  linkedin: "badge bg-info-subtle text-info-emphasis",
  discord: "badge bg-dark-subtle text-dark-emphasis",
  teams: "badge bg-cyan-subtle text-cyan-emphasis",
};

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
    // eslint-disable-next-line
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

  const filteredDrafts = drafts.filter((draft) => {
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

  return (
    <div className="min-vh-100 d-flex flex-column bg-body-tertiary">
      {/* Header */}
      <div className="bg-white bg-opacity-90 border-bottom border-2 px-4 py-3 sticky-top">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center rounded-4" style={{ width: 40, height: 40, background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)" }}>
              <PenTool size={20} color="white" />
            </div>
            <div>
              <div className="fw-bold fs-5 text-dark">AI Drafts</div>
              <div className="text-secondary small">
                {filteredDrafts.length} drafts ready for review
              </div>
            </div>
          </div>
          <button
            onClick={loadDrafts}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "spinner-border spinner-border-sm me-2" : "me-2"} />
            Refresh
          </button>
        </div>
        {/* Tabs */}
        <ul className="nav nav-pills mb-2 bg-light rounded p-1 w-auto">
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              <Clock size={16} className="me-1" />
              Pending <span className="ms-1">({drafts.filter(d => !d.is_sent).length})</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link d-flex align-items-center ${activeTab === "sent" ? "active" : ""}`}
              onClick={() => setActiveTab("sent")}
            >
              <CheckCircle2 size={16} className="me-1" />
              Sent <span className="ms-1">({drafts.filter(d => d.is_sent).length})</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Drafts List */}
      <div className="flex-grow-1 overflow-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="d-flex flex-column gap-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3 p-4 w-100 shadow-sm mb-2">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <div className="placeholder-glow mb-2" style={{ height: "1.2rem", width: "120px" }} />
                      <div className="placeholder-glow" style={{ height: "1rem", width: "80px" }} />
                    </div>
                    <div className="placeholder-glow" style={{ height: "1.5rem", width: "60px" }} />
                  </div>
                  <div className="placeholder-glow mb-2" style={{ height: "1.2rem", width: "100%" }} />
                  <div className="placeholder-glow" style={{ height: "1.2rem", width: "75%" }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {filteredDrafts.map((draft) => (
                <motion.div
                  key={draft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="bg-white rounded-3 shadow-sm p-4 mb-2 border border-light">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex gap-2 align-items-center mb-2">
                          <span className="fw-bold fs-6">{draft.subject || "Reply Draft"}</span>
                          <span className={`${toneStyles[draft.tone] || "badge bg-secondary-subtle text-secondary-emphasis"}`}>
                            {draft.tone}
                          </span>
                        </div>
                        <div className="small text-secondary">
                          To: {draft.recipient} • {format(new Date(draft.created_date), "MMM d, h:mm a")}
                        </div>
                        {draft.confidence_score && (
                          <div className="d-flex align-items-center gap-2 mt-2">
                            <span className="d-inline-block rounded-circle bg-success" style={{ width: 8, height: 8 }} />
                            <span className="text-success small">{Math.round(draft.confidence_score * 100)}% confidence</span>
                          </div>
                        )}
                      </div>
                      <span className={`ms-3 ${platformStyles[draft.platform] || "badge bg-secondary-subtle text-secondary-emphasis"}`}>
                        {draft.platform}
                      </span>
                    </div>
                    <div className="mt-3 mb-4">
                      <div className="text-secondary small" style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                        {draft.content}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2 text-secondary small">
                        <Sparkles size={16} className="text-primary" />
                        <span>AI Generated</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {!draft.is_sent ? (
                          <>
                            <button
                              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                              // Edit functionality placeholder
                            >
                              <Edit3 size={16} /> Edit
                            </button>
                            <button
                              className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                              onClick={() => handleSendDraft(draft.id)}
                            >
                              <Send size={16} /> Send
                            </button>
                          </>
                        ) : (
                          <span className="d-flex align-items-center gap-1 badge bg-success-subtle text-success-emphasis px-2 py-1">
                            <CheckCircle2 size={12} /> Sent
                          </span>
                        )}
                        <button
                          className="btn btn-link btn-sm text-danger p-0"
                          aria-label="Delete"
                          onClick={() => handleDeleteDraft(draft.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredDrafts.length === 0 && (
                <div className="text-center py-5">
                  <div className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: 64, height: 64 }}>
                    <PenTool size={32} color="#A0AEC0" />
                  </div>
                  <div className="fs-6 fw-medium text-dark mb-1">
                    No drafts found
                  </div>
                  <div className="text-secondary">
                    AI will generate smart reply drafts as you receive messages.
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
