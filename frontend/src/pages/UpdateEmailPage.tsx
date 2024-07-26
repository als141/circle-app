import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UpdateEmailPage: React.FC = () => {
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', content: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const user = auth.currentUser;
    if (!user || !user.email) return;

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      setMessage({ type: 'success', content: 'メールアドレスが正常に更新されました。' });
    } catch (error) {
      setMessage({ type: 'error', content: 'メールアドレスの更新に失敗しました。パスワードを確認してください。' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">メールアドレス変更</h1>
      {message && (
        <Alert variant={message.type === 'error' ? "destructive" : "default"} className="mb-4">
          <AlertDescription>{message.content}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newEmail" className="block mb-2">新しいメールアドレス</label>
          <Input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="currentPassword" className="block mb-2">現在のパスワード</label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">メールアドレスを更新</Button>
      </form>
    </div>
  );
};

export default UpdateEmailPage;