// src/components/ImageGrid/ImageGrid.jsx
import React from "react";
import { MODELS } from "../../services/imageApi";
import "./ImageGrid.scss";

const ImageGrid = ({ images, isGenerating, errors, lastPrompt }) => {
  const models = [
    { id: "dalle3", displayName: MODELS.DALLE3.displayName },
    { id: "imagen3", displayName: MODELS.IMAGEN3.displayName },
  ];

  const buildFilename = (modelId) => {
    if (!lastPrompt) {
      return `${modelId}-image.png`;
    }

    // Take first 10 characters of query
    const trimmed = lastPrompt.trim();
    const prefix = trimmed.slice(0, 10);

    // Replace spaces with hyphens and remove problematic characters
    const safeFragment = prefix
      .toLowerCase()
      .replace(/\s+/g, "-") // spaces -> hyphens
      .replace(/[^a-z0-9\-]/g, ""); // remove anything not alphanum or hyphen

    if (!safeFragment) {
      return `${modelId}-image.png`;
    }

    return `${modelId}_${safeFragment}.png`;
  };

  const renderImageContent = (modelId) => {
    if (isGenerating) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating...</p>
        </div>
      );
    }

    if (errors && errors[modelId]) {
      return (
        <div className="error-state">
          <p className="error-message">{errors[modelId]}</p>
        </div>
      );
    }

    const src = images?.[modelId];

    if (src) {
      return (
        <div className="image-wrapper">
          <img src={src} alt={`${modelId} output`} />
          <div className="image-overlay">
            <a
              href={src}
              download={buildFilename(modelId)}
              className="download-btn"
            >
              ⬇ Download
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="placeholder">
        <p>Image will appear here</p>
      </div>
    );
  };

  return (
    <div className="outputs-section">
      <h2>Generated Images</h2>
      <div className="models-grid">
        {models.map((m) => (
          <div key={m.id} className="model-card">
            <h3>{m.displayName}</h3>
            <div className="image-container">{renderImageContent(m.id)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
