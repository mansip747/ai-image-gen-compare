import React from "react";
import "./PromptInput.scss";

const PromptInput = ({ prompt, setPrompt, onGenerate, isGenerating }) => {
  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      onGenerate();
    }
  };

  return (
    <div className="prompt-section">
      <div className="input-wrapper">
        <input
          type="text"
          className="prompt-input"
          placeholder="Enter your image prompt here..."
          value={prompt}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isGenerating}
        />
        <button
          className={`generate-btn ${isGenerating ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              <span className="button-text">Generating...</span>
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
