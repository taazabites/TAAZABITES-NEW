

// Generic API caller for our Netlify function
const callApi = async (action: string, payload?: any) => {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload: payload || {} }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Use the error message from the serverless function, or a default one
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // Re-throw the error so it can be caught by the component
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred during the API call.');
  }
};


export const generateMealPlan = async (
  dietaryPreference: string[],
  healthGoal: string,
  dislikes: string,
  nutritionalGoals: string
) => {
  return callApi('generateMealPlan', { dietaryPreference, healthGoal, dislikes, nutritionalGoals });
};

export const generateFaqContent = async () => {
    return callApi('generateFaqContent');
};

export const generateAiSearchResults = async (query: string) => {
    const data = await callApi('generateAiSearchResults', { query });
    return data.result; // The serverless function wraps string results in an object
};

export const generateHeroCopy = async () => {
    return callApi('generateHeroCopy');
};

export const generateMetaDescription = async () => {
    return callApi('generateMetaDescription');
};

export const generateWorkoutSuggestion = async (healthGoal: string) => {
    const data = await callApi('generateWorkoutSuggestion', { healthGoal });
    return data.result; // The serverless function wraps string results in an object
};
