import Dexie from 'dexie';

export const db = new Dexie('ImageGeneratorDB');

db.version(1).stores({
  prompts: '++id, prompt, timestamp, images'
});

// Helper functions
export const savePromptHistory = async (prompt, images) => {
  try {
    await db.prompts.add({
      prompt,
      images,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving prompt:', error);
  }
};

export const getPromptHistory = async () => {
  try {
    const history = await db.prompts
      .orderBy('timestamp')
      .reverse()
      .toArray();
    return history;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const deletePromptHistory = async (id) => {
  try {
    await db.prompts.delete(id);
  } catch (error) {
    console.error('Error deleting prompt:', error);
  }
};

export const clearAllHistory = async () => {
  try {
    await db.prompts.clear();
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};
