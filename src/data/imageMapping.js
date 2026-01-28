/**
 * Image mapping configuration
 * Maps user queries to specific image files for each model
 */

export const IMAGE_MAPPING = {
  // Ice cream related queries
  "ice cream": {
    dalle3: "/sample-images/dalle3/ice-cream.png",
    imagen3: "/sample-images/imagen3/ice-cream.png",
  },

  // Sunset related queries
  sunset: {
    dalle3: "/sample-images/dalle3/sunset.png",
    imagen3: "/sample-images/imagen3/sunset.png",
  },
  "beautiful sunset": {
    dalle3: "/sample-images/dalle3/sunset.png",
    imagen3: "/sample-images/imagen3/sunset.png",
  },

  // Mountain related queries
  mountain: {
    dalle3: "/sample-images/dalle3/mountain.png",
    imagen3: "/sample-images/imagen3/mountain.png",
  },
  "snow mountain": {
    dalle3: "/sample-images/dalle3/mountain.png",
    imagen3: "/sample-images/imagen3/mountain.png",
  },

  // Cat related queries
  cat: {
    dalle3: "/sample-images/dalle3/cat.png",
    imagen3: "/sample-images/imagen3/cat.png",
  },
  "cute cat": {
    dalle3: "/sample-images/dalle3/cat.png",
    imagen3: "/sample-images/imagen3/cat.png",
  },

  // Dog related queries
  dog: {
    dalle3: "/sample-images/dalle3/dog.png",
    imagen3: "/sample-images/imagen3/dog.png",
  },
  puppy: {
    dalle3: "/sample-images/dalle3/dog.png",
    imagen3: "/sample-images/imagen3/dog.png",
  },
};

/**
 * Get image paths for a given query
 * @param {string} query - User's search query
 * @returns {object|string} Object containing image paths for each model, or 'NO_MAPPING' if not found
 */
export const getImagesForQuery = (query) => {
  if (!query) {
    return "NO_MAPPING";
  }

  // Normalize query (lowercase, trim)
  const normalizedQuery = query.toLowerCase().trim();

  // Check for exact match
  if (IMAGE_MAPPING[normalizedQuery]) {
    return IMAGE_MAPPING[normalizedQuery];
  }

  // Check if query contains any of the mapped keywords
  for (const [key, value] of Object.entries(IMAGE_MAPPING)) {
    if (normalizedQuery.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return 'NO_MAPPING' instead of default
  return "NO_MAPPING";
};

/**
 * Check if images exist for a query
 * @param {string} query - User's search query
 * @returns {boolean}
 */
export const hasImagesForQuery = (query) => {
  if (!query) return false;

  const normalizedQuery = query.toLowerCase().trim();

  // Check exact match
  if (IMAGE_MAPPING[normalizedQuery]) {
    return true;
  }

  // Check if query contains any mapped keywords
  return Object.keys(IMAGE_MAPPING).some((key) =>
    normalizedQuery.includes(key.toLowerCase())
  );
};

/**
 * Get all available queries
 * @returns {array} Array of all mapped queries
 */
export const getAvailableQueries = () => {
  return Object.keys(IMAGE_MAPPING);
};
