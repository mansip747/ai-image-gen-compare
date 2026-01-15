import {
  getImagesForQuery,
  hasImagesForQuery as checkMapping,
} from "../data/imageMapping";

// Read from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api-main-poc.aiml.asu.edu";
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

// Generate random session ID (32 character hex string)
const generateSessionId = () => {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
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

/**
 * Generate image based on query using mapping file
 */
export const generateImage = async (query, model) => {
  try {
    console.log(
      `🎨 Generating image for "${query}" using ${model.displayName}...`
    );

    // Get image paths from mapping
    const imagePaths = getImagesForQuery(query);

    // Check if we got default images (meaning no mapping found)
    if (!imagePaths || imagePaths === "NO_MAPPING") {
      throw new Error("NO_MAPPING_FOUND");
    }

    const imagePath = imagePaths[model.name];

    if (!imagePath) {
      throw new Error(`Error for ${model.displayName}`);
    }

    // Simulate API call with 2 second delay
    const result = await simulateImageGeneration(model, imagePath);

    console.log(`✅ ${model.displayName} completed`);

    return result;
  } catch (error) {
    console.error(`❌ ${model.displayName} failed:`, error.message);
    throw error;
  }
};

/**
 * Generate images from both models
 * Returns null if no mapping found (to prevent clearing existing images)
 */
export const generateImagesFromAllModels = async (query) => {
  const models = Object.values(MODELS);

  console.log("🚀 Starting image generation for both models...");
  console.log("📝 Query:", query);

  // Check if mapping exists before proceeding
  if (!hasImagesForQuery(query)) {
    return null; // Return null to indicate no mapping found
  }

  // Generate images in parallel (both take 2 seconds)
  const promises = models.map((model) => generateImage(query, model));

  const results = await Promise.all(promises);

  console.log(`✅ Completed: All images generated`);

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
    hasAccessToken: !!ACCESS_TOKEN,
    modelCount: Object.keys(MODELS).length,
  };
};
