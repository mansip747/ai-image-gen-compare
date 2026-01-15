import React, { useState, useEffect } from "react";
import {
  getPromptHistory,
  deletePromptHistory,
  clearAllHistory,
} from "../../db/database";
import "./Sidebar.scss";

const Sidebar = ({ isOpen, toggleSidebar, onSelectPrompt, refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load history on mount and when refreshTrigger changes
  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  const loadHistory = async () => {
    try {
      const data = await getPromptHistory();
      setHistory(data);
      console.log("📚 History loaded:", data.length, "items");
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deletePromptHistory(id);
      await loadHistory(); // Reload after delete
      console.log("🗑️ Deleted item:", id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllHistory();
      setHistory([]);
      setShowClearConfirm(false);
      console.log("🗑️ Cleared all history");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const handleSelectPrompt = (item) => {
    onSelectPrompt(item);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h3>History</h3>
          <button className="close-btn" onClick={toggleSidebar}>
            <span className="icon">{isOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {isOpen && (
          <>
            <div className="sidebar-actions">
              <button
                className="clear-all-btn"
                onClick={() => setShowClearConfirm(true)}
                disabled={history.length === 0}
              >
                Clear All
              </button>
            </div>

            <div className="history-list">
              {history.length === 0 ? (
                <div className="empty-state">
                  <p>No history yet</p>
                  <span>Your prompts will appear here</span>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="history-item"
                    onClick={() => handleSelectPrompt(item)}
                  >
                    <div className="history-content">
                      <p className="prompt-text">{item.prompt}</p>
                      <span className="timestamp">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(item.id, e)}
                      aria-label="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Clear All History?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleClearAll}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
