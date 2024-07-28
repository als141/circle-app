const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface MakeEventResponse {
  event_suggestions: string;
}

const makeEvent = async (description: string, date: string, location: string, budget: string): Promise<MakeEventResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/make_event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, date, location, budget }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error making event:', error);
    throw error;
  }
};

export { makeEvent };