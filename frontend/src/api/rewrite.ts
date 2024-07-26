// src/api/rewrite.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export interface RewriteResponse {
  original: string;
  rewritten: string;
}

export const rewriteText = async (text: string): Promise<RewriteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error rewriting text:', error);
    throw error;
  }
};