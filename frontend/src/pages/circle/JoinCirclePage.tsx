import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCircle } from '../../CircleContext';

interface Circle {
  id: string;
  name: string;
  description: string;
}

const JoinCirclePage: React.FC = () => {
  const [invitationCode, setInvitationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [circleToJoin, setCircleToJoin] = useState<Circle | null>(null);
  const navigate = useNavigate();
  const { setActiveCircle } = useCircle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
      setError('ログインしてください。');
      return;
    }

    try {
      // 招待コードでサークルを検索
      const circlesRef = collection(db, 'circles');
      const q = query(circlesRef, where("invitationCode", "==", invitationCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('無効な招待コードです。');
        return;
      }

      const circleDoc = querySnapshot.docs[0];
      const circleData = circleDoc.data();
      setCircleToJoin({
        id: circleDoc.id,
        name: circleData.name,
        description: circleData.description
      });

      // ユーザーが既にサークルのメンバーかチェック
      const membershipDoc = await getDocs(query(collection(db, 'circleMemberships'), 
                                                where("userId", "==", user.uid),
                                                where("circleId", "==", circleDoc.id)));

      if (!membershipDoc.empty) {
        setError('あなたは既にこのサークルのメンバーです。');
        return;
      }

      setIsConfirmDialogOpen(true);

    } catch (error) {
      console.error("Error checking circle: ", error);
      setError('サークル情報の確認に失敗しました。もう一度お試しください。');
    }
  };

  const confirmJoin = async () => {
    if (!circleToJoin || !auth.currentUser) return;

    try {
      const membershipRef = doc(db, 'circleMemberships', `${auth.currentUser.uid}_${circleToJoin.id}`);
      await setDoc(membershipRef, {
        userId: auth.currentUser.uid,
        circleId: circleToJoin.id,
        role: 'member',
        joinedAt: new Date()
      });

      setSuccess(`${circleToJoin.name}に正常に参加しました！`);
      setError(null);
      setIsConfirmDialogOpen(false);
      setActiveCircle({ id: circleToJoin.id, name: circleToJoin.name });

      // 少し待ってからダッシュボードにリダイレクト
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error("Error joining circle: ", error);
      setError('サークルへの参加に失敗しました。もう一度お試しください。');
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">サークルに参加</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4">
          <AlertTitle>成功</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="invitationCode">招待コード</Label>
          <Input
            id="invitationCode"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            required
            placeholder="招待コードを入力してください"
          />
        </div>
        <Button type="submit">サークル情報を確認</Button>
      </form>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>サークル参加の確認</DialogTitle>
            <DialogDescription>
              以下のサークルに参加します。よろしいですか？
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {circleToJoin && (
              <>
                <p><strong>サークル名:</strong> {circleToJoin.name}</p>
                <p><strong>説明:</strong> {circleToJoin.description}</p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>キャンセル</Button>
            <Button onClick={confirmJoin}>参加する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinCirclePage;