import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useNavigateを追加
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react'; // ArrowLeftを追加
import { useAuth } from '../../hooks/useAuth';
import { useGroupName } from '../../hooks/useGroupName';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  group?: string;
  description: string;
  attendanceRequired: boolean;
  createdBy: string;
}

const EventDetailsPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate(); // navigateを定義
    const [event, setEvent] = useState<Event | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isAttending, setIsAttending] = useState(false);
    const { user } = useAuth();
    const groupName = useGroupName(event?.group || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'attend' | 'cancel' | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId || !user) return;

      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsBookmarked(userData.bookmarkedEvents?.includes(eventId) || false);
        setIsAttending(userData.attendingEvents?.includes(eventId) || false);
      }
    };

    fetchEventDetails();
  }, [eventId, user]);

  const handleAttendanceAction = (action: 'attend' | 'cancel') => {
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const confirmAttendanceAction = async () => {
    if (!user || !event) return;

    const userRef = doc(db, 'users', user.uid);
    try {
      if (dialogAction === 'attend') {
        await updateDoc(userRef, {
          attendingEvents: arrayUnion(event.id)
        });
        setIsAttending(true);
      } else {
        await updateDoc(userRef, {
          attendingEvents: arrayRemove(event.id)
        });
        setIsAttending(false);
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
    }
    setIsDialogOpen(false);
  };

  const handleBookmark = async () => {
    if (!user || !event) return;

    const userRef = doc(db, 'users', user.uid);
    if (isBookmarked) {
      await updateDoc(userRef, {
        bookmarkedEvents: arrayRemove(event.id)
      });
    } else {
      await updateDoc(userRef, {
        bookmarkedEvents: arrayUnion(event.id)
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  if (!event) return <div>Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
      <div className="flex justify-start">
        <Button variant="outline" className="text-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
        <CardTitle className="text-2xl">{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>{event.location}</span>
        </div>
        {groupName && (
          <div>
            <strong>グループ:</strong> {groupName}
          </div>
        )}
        <div>
          <strong>説明:</strong>
          <p>{event.description}</p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleBookmark} variant={isBookmarked ? "secondary" : "outline"}>
            <Star className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-yellow-400" : ""}`} />
            {isBookmarked ? "ブックマーク済み" : "ブックマーク"}
          </Button>
          {event.attendanceRequired && (
            <Button 
              onClick={() => handleAttendanceAction(isAttending ? 'cancel' : 'attend')} 
              variant={isAttending ? "secondary" : "outline"}
            >
              {isAttending ? "出席取消" : "出席する"}
            </Button>
          )}
          {event.createdBy === user?.uid && (
            <Link to={`/edit-event/${event.id}`}>
              <Button variant="outline">編集</Button>
            </Link>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'attend' ? '出席確認' : '出席取消確認'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'attend' 
                ? `${event.name}に出席しますか？`
                : `${event.name}の出席を取り消しますか？`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
            <Button onClick={confirmAttendanceAction}>確定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EventDetailsPage;