import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { useCircle } from '../../CircleContext';

const CreateCirclePage: React.FC = () => {
  const [circleName, setCircleName] = useState('');
  const [circleDescription, setCircleDescription] = useState('');
  const [groups, setGroups] = useState<string[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { setActiveCircle } = useCircle();

  const generateInvitationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmDialogOpen(true);
  };

  const createCircle = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('ログインしてください。');
      return;
    }

    try {
      const code = generateInvitationCode();
      
      // サークル情報を保存
      const circleDocRef = await addDoc(collection(db, 'circles'), {
        name: circleName,
        description: circleDescription,
        createdBy: user.uid,
        createdAt: new Date(),
        invitationCode: code
      });

      // サークルメンバーシップを作成（作成者を管理者として追加）
      await setDoc(doc(db, 'circleMemberships', `${user.uid}_${circleDocRef.id}`), {
        userId: user.uid,
        circleId: circleDocRef.id,
        role: 'admin',
        joinedAt: new Date()
      });

      // グループを作成
      for (const group of groups) {
        await addDoc(collection(db, 'groups'), {
          name: group,
          circleId: circleDocRef.id,
          createdAt: new Date()
        });
      }

      setInvitationCode(code);
      setActiveCircle({ id: circleDocRef.id, name: circleName });
    } catch (error) {
      console.error("Error creating circle: ", error);
      setError('サークルの作成に失敗しました。もう一度お試しください。');
    }
    setIsConfirmDialogOpen(false);
  };

  const addGroup = () => {
    if (newGroup.trim() !== '') {
      setGroups([...groups, newGroup.trim()]);
      setNewGroup('');
    }
  };

  const removeGroup = (indexToRemove: number) => {
    setGroups(groups.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">サークル作成</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {invitationCode ? (
        <div className="mb-4">
          <Alert>
            <AlertTitle>サークルが作成されました！</AlertTitle>
            <AlertDescription>
              招待コード: <strong>{invitationCode}</strong><br />
              このコードを他のメンバーに共有して、サークルに招待してください。
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/')} className="mt-4">ダッシュボードへ戻る</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="circleName">サークル名</Label>
            <Input
              id="circleName"
              value={circleName}
              onChange={(e) => setCircleName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="circleDescription">サークル説明</Label>
            <Textarea
              id="circleDescription"
              value={circleDescription}
              onChange={(e) => setCircleDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="newGroup">グループ追加（任意）</Label>
            <div className="flex space-x-2">
              <Input
                id="newGroup"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                placeholder="新しいグループ名"
              />
              <Button type="button" onClick={addGroup}>追加</Button>
            </div>
          </div>
          {groups.length > 0 && (
            <div>
              <Label>追加されたグループ</Label>
              <ul className="space-y-2">
                {groups.map((group, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{group}</span>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeGroup(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button type="submit">サークルを作成</Button>
        </form>
      )}

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>サークル作成の確認</DialogTitle>
            <DialogDescription>
              以下の内容でサークルを作成します。よろしいですか？
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p><strong>サークル名:</strong> {circleName}</p>
            <p><strong>説明:</strong> {circleDescription}</p>
            {groups.length > 0 && (
              <div>
                <strong>グループ:</strong>
                <ul className="list-disc list-inside">
                  {groups.map((group, index) => (
                    <li key={index}>{group}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>キャンセル</Button>
            <Button onClick={createCircle}>確定して作成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCirclePage;