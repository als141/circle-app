import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const EmailVerificationPage: React.FC = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsVerified(user.emailVerified);
      } else {
        // ユーザーがログインしていない場合はログインページにリダイレクト
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        setIsEmailSent(true);
        setError(null);
      } catch (error) {
        setError('認証メールの送信に失敗しました。しばらくしてからもう一度お試しください。');
      }
    }
  };

  const handleCheckVerification = () => {
    const user = auth.currentUser;
    if (user) {
      user.reload().then(() => {
        setIsVerified(user.emailVerified);
        if (user.emailVerified) {
          // 認証が完了したらダッシュボードにリダイレクト
          navigate('/');
        }
      });
    }
  };

  if (isVerified) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <Alert>
          <AlertTitle>メール認証が完了しました</AlertTitle>
          <AlertDescription>
            ダッシュボードに移動します。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">メール認証</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isEmailSent ? (
        <div className="mb-4">
          <p className="mb-2">認証メールを送信しました。メールを確認し、認証リンクをクリックしてください。</p>
          <Button onClick={handleCheckVerification}>認証状態を確認</Button>
        </div>
      ) : (
        <div className="mb-4">
          <p className="mb-2">アカウントを有効化するには、メール認証が必要です。</p>
          <Button onClick={handleSendVerificationEmail}>認証メールを送信</Button>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationPage;