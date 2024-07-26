// src/components/TextRewriter.tsx

import React, { useState } from 'react';
import { rewriteText, RewriteResponse } from '../../api/rewrite';

const TextRewriter: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>('');
  const [rewrittenText, setRewrittenText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: RewriteResponse = await rewriteText(originalText);
      setRewrittenText(response.rewritten);
    } catch (err) {
      setError('Failed to rewrite text. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-rewriter">
      <h2>Text Rewriter</h2>
      <textarea
        value={originalText}
        onChange={(e) => setOriginalText(e.target.value)}
        placeholder="Enter text to rewrite"
        rows={5}
        cols={50}
      />
      <button onClick={handleRewrite} disabled={isLoading || !originalText}>
        {isLoading ? 'Rewriting...' : 'Rewrite'}
      </button>
      {error && <p className="error">{error}</p>}
      {rewrittenText && (
        <div className="rewritten-text">
          <h3>Rewritten Text:</h3>
          <p>{rewrittenText}</p>
        </div>
      )}
    </div>
  );
};

export default TextRewriter;