import {
  getImagesForQuery,
  hasImagesForQuery as checkMapping,
} from "../data/imageMapping";

// Read from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api-main-poc.aiml.asu.edu";
const AUTH_STORAGE_KEY = "ai_image_projectWebToken";
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

// Generate random session ID (32 character hex string)
const generateSessionId = () => {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
};

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_STORAGE_KEY);
};

// Model configurations - ONLY 2 MODELS
export const MODELS = {
  DALLE3: {
    provider: "openai",
    name: "dalle3",
    displayName: "DALL-E 3",
  },
  IMAGEN3: {
    provider: "gcp-deepmind",
    name: "imagen3",
    displayName: "Imagen 3",
  },
};

/**
 * Simulate image generation with 2 second delay
 */
const simulateImageGeneration = (model, imagePath) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        model: model.name,
        displayName: model.displayName,
        success: true,
        imagePath: imagePath,
      });
    }, 4000); // 2 second delay
  });
};

// helper: base64 → data URL
const toDataUrl = (base64) => {
  if (!base64) return null;
  // if backend already returns a full data URL, just use it
  if (base64.startsWith("data:image")) return base64;
  // otherwise assume PNG and prepend the data URL header
  return `data:image/png;base64,${base64}`;
};

/**
 * Generate image based on query using mapping file
 */
export const generateImage = async (query, model) => {
  const sessionId = generateSessionId();
  const token = getAuthToken();
  console.log("token => ", token);

  if (!token) {
    throw new Error("Not authenticated: missing projectWebToken");
  }

  const body = {
    action: "query",
    endpoint: "image",
    session_id: sessionId,
    query: query,
    model_provider: model.provider,
    model_name: model.name,
    response_format: { type: "json" },
    request_source: "override_params",
  };

  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `HTTP error ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();

  const base64 = data?.response?.[0];

  if (!base64) {
    throw new Error("No image data in response");
  }

  const imageUrl = toDataUrl(base64);

  return {
    modelKey: model.name, // 'dalle3' / 'imagen3'
    imageUrl,
    raw: data,
  };
};

/**
 * Generate images from both models
 * Returns null if no mapping found (to prevent clearing existing images)
 */
export const generateImagesFromAllModels = async (query) => {
  const models = Object.values(MODELS);

  const results = await Promise.all(
    models.map((m) =>
      generateImage(query, m)
        .then((result) => ({ success: true, ...result }))
        .catch((err) => ({
          success: false,
          modelKey: m.name,
          error: err.message,
        })),
    ),
  );

  return results;
};

/**
 * Check if API is configured properly
 */
export const isApiConfigured = () => {
  return true; // Always true for mock version
};

/**
 * Check if images exist for a query (exported for use in components)
 */
export const hasImagesForQuery = (query) => {
  return checkMapping(query);
};

/**
 * Export configuration for debugging
 */
export const getConfig = () => {
  return {
    apiBaseUrl: API_BASE_URL,
    projectId: PROJECT_ID,
    modelCount: Object.keys(MODELS).length,
  };
};
