import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCircle } from '../CircleContext';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  group: string | null;
  description: string;
  attendanceRequired: boolean;
}

const EditEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { activeCircle } = useCircle();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [group, setGroup] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [attendanceRequired, setAttendanceRequired] = useState(false);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (eventDoc.exists()) {
          const eventData = { id: eventDoc.id, ...eventDoc.data() } as Event;
          setName(eventData.name || '');
          setDate(eventData.date || '');
          setTime(eventData.time || '');
          setLocation(eventData.location || '');
          setGroup(eventData.group || null);
          setDescription(eventData.description || '');
          setAttendanceRequired(eventData.attendanceRequired || false);
        } else {
          setError('イベントが見つかりません');
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError('イベント情報の取得中にエラーが発生しました');
      }
    };

    const fetchGroups = async () => {
      if (!activeCircle) return;

      try {
        const groupsQuery = query(collection(db, 'groups'), where('circleId', '==', activeCircle.id));
        const groupsSnapshot = await getDocs(groupsQuery);
        const groupsData = groupsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setGroups(groupsData);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError('グループ情報の取得中にエラーが発生しました');
      }
    };

    Promise.all([fetchEvent(), fetchGroups()]).then(() => setIsLoading(false));
  }, [eventId, activeCircle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;

    try {
      const updatedData: Partial<Event> = {
        name,
        date,
        time,
        location,
        description,
        attendanceRequired,
      };

      if (group !== null) {
        updatedData.group = group;
      } else {
        updatedData.group = null;
      }

      await updateDoc(doc(db, 'events', eventId), updatedData);
      navigate('/my-events');
    } catch (err) {
      console.error("Error updating event:", err);
      setError('イベントの更新中にエラーが発生しました');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-start mb-4">
      <Button variant="outline" className="text-sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
      </Button>
    </div>
      <h1 className="text-2xl font-bold mb-4">イベント編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">イベント名</Label>
          <Input
            id="name"
            value={name}

            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="date">日付</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">時間</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">場所</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="group">グループ (任意)</Label>
          <Select value={group || "no-group"} onValueChange={(value) => setGroup(value === "no-group" ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="グループを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-group">指定なし</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="attendanceRequired"
            checked={attendanceRequired}
            onCheckedChange={setAttendanceRequired}
          />
          <Label htmlFor="attendanceRequired">出席必須</Label>
        </div>
        <Button type="submit">更新</Button>
      </form>
    </div>
  );
};

export default EditEventPage;