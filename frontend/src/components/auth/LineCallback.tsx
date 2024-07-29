import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LineCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLineCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code) {
        setError('認証コードが見つかりません');
        return;
      }

      try {
        const response = await axios.post('/api/auth/line-callback', { code, state });
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          setError('ログインに失敗しました');
        }
      } catch (err) {
        setError('ログイン処理中にエラーが発生しました');
      }
    };

    handleLineCallback();
  }, [location, navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>LINEログイン処理中...</div>;
};

export default LineCallback;