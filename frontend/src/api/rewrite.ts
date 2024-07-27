// src/api/rewrite.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface RewriteResponse {
  original_text: string;
  rewritten_text: string;
  tone: string;
}

export const rewriteText = async (text: string, tone: string): Promise<RewriteResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, tone }),
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