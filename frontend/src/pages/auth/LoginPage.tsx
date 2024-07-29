import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('currentUser', JSON.stringify(userCredential.user));
      navigate('/');
    } catch (error) {
      console.error("Error logging in: ", error);
      alert('メールアドレスまたはパスワードが正しくありません');
    }
  };

  const handleLineLogin = () => {
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${import.meta.env.REACT_APP_LINE_CHANNEL_ID}&redirect_uri=${encodeURIComponent(import.meta.env.REACT_APP_LINE_CALLBACK_URL)}&state=${generateRandomState()}&scope=profile%20openid%20email`;
    window.location.href = lineLoginUrl;
  };
  
  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">ログイン</h2>
        <button onClick={handleLineLogin} className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
          LINEでログイン
        </button>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="block w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログイン
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">初めての方は <a href="/register" className="text-indigo-600 hover:text-indigo-900">こちら</a></p>
          <p className="text-sm text-gray-600">パスワードを忘れた場合は <a href="/reset-password" className="text-indigo-600 hover:text-indigo-900">こちら</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
