import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCircle } from '../CircleContext';
import { ArrowLeft } from 'lucide-react';
import MakeEvent from '@/components/api/MakeEvent';

interface Group {
  id: string;
  name: string;
}

const CreateEventPage: React.FC = () => {
  const { activeCircle } = useCircle();
  const [groups, setGroups] = useState<Group[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('no_group');
  const [isAttendanceRequired, setIsAttendanceRequired] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      if (activeCircle) {
        try {
          const groupsQuery = query(collection(db, 'groups'), where("circleId", "==", activeCircle.id));
          const groupsSnapshot = await getDocs(groupsQuery);
          const groupsData = groupsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
          setGroups(groupsData);
        } catch (err) {
          console.error("Error fetching groups:", err);
          setError("グループの取得中にエラーが発生しました。");
        }
      }
    };

    fetchGroups();
  }, [activeCircle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!activeCircle) {
      setError("アクティブなサークルが選択されていません。");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("ログインしてください。");
      return;
    }

    try {
      await addDoc(collection(db, 'events'), {
        circleId: activeCircle.id,
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
        groupId: selectedGroup === 'no_group' ? null : selectedGroup,
        attendanceRequired: isAttendanceRequired,
        createdBy: user.uid,
        createdAt: new Date()
      });

      setIsConfirmDialogOpen(false);
      navigate('/');
    } catch (err) {
      console.error("Error adding event:", err);
      setError("イベントの作成中にエラーが発生しました。");
    }
  };

  if (error) {
    return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
  }

  if (!activeCircle) {
    return <Alert variant="destructive"><AlertDescription>アクティブなサークルが選択されていません。サークルを選択してください。</AlertDescription></Alert>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-start mb-4">
        <Button variant="outline" className="text-sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <h2 className="text-2xl font-bold mb-4">イベント作成</h2>
      <Alert className="mb-4">
        <AlertDescription>現在のアクティブサークル: {activeCircle?.name || 'なし'}</AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="eventName">イベント名</Label>
          <Input
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventDate">日付</Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventTime">時間</Label>
          <Input
            id="eventTime"
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventLocation">場所</Label>
          <Input
            id="eventLocation"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventDescription">説明</Label>
          <Textarea
            id="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="eventGroup">グループ (任意)</Label>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="グループを選択" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="no_group">指定なし</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="attendance-required"
            checked={isAttendanceRequired}
            onCheckedChange={setIsAttendanceRequired}
          />
          <Label htmlFor="attendance-required">出席登録が必要</Label>
        </div>
        <Button type="submit">イベントを作成</Button>
      </form>
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">AIによるイベント提案</h3>
        <MakeEvent />
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>イベント作成の確認</DialogTitle>
            <DialogDescription>
              以下の内容でイベントを作成します。よろしいですか？
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                イベント名
              </Label>
              <div className="col-span-3">
                {eventName}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                日付
              </Label>
              <div className="col-span-3">
                {eventDate}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                場所
              </Label>
              <div className="col-span-3">
                {eventLocation}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                説明
              </Label>
              <div className="col-span-3">
                {eventDescription}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group" className="text-right">
                グループ
              </Label>
              <div className="col-span-3">
                {selectedGroup === "no_group" ? "指定なし" : groups.find(group => group.id === selectedGroup)?.name}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendance-required" className="text-right">
                出席登録
              </Label>
              <div className="col-span-3">
                {isAttendanceRequired ? "必須" : "不要"}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirm}>確定して作成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEventPage;