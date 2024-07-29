import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Star, MapPin, Clock, Users, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCircle } from '../CircleContext';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useGroupName } from '../hooks/useGroupName';
import TextRewriter from '@/components/api/TextRewriter';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  groupId?: string; // groupをgroupIdに変更
  description: string;
  attendanceRequired: boolean;
}

const Dashboard: React.FC = () => {
  const { activeCircle } = useCircle();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'attend' | 'cancel' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!activeCircle || !user) return;

      try {
        const eventsQuery = query(collection(db, 'events'), where("circleId", "==", activeCircle.id));
        const eventSnapshot = await getDocs(eventsQuery);
        const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(eventList);

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setBookmarkedEvents(userData.bookmarkedEvents || []);
          setAttendingEvents(userData.attendingEvents || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [activeCircle, user]);

  const handleBookmark = async (eventId: string) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    if (bookmarkedEvents.includes(eventId)) {
      await updateDoc(userRef, {
        bookmarkedEvents: arrayRemove(eventId)
      });
      setBookmarkedEvents(prev => prev.filter(id => id !== eventId));
    } else {
      await updateDoc(userRef, {
        bookmarkedEvents: arrayUnion(eventId)
      });
      setBookmarkedEvents(prev => [...prev, eventId]);
    }
  };

  const handleAttend = (event: Event) => {
    setSelectedEvent(event);
    setConfirmAction(attendingEvents.includes(event.id) ? 'cancel' : 'attend');
    setIsConfirmDialogOpen(true);
  };

  const confirmAttendance = async () => {
    if (!user || !selectedEvent) return;

    const userRef = doc(db, 'users', user.uid);
    try {
      if (confirmAction === 'attend') {
        await updateDoc(userRef, {
          attendingEvents: arrayUnion(selectedEvent.id)
        });
        setAttendingEvents(prev => [...prev, selectedEvent.id]);
      } else {
        await updateDoc(userRef, {
          attendingEvents: arrayRemove(selectedEvent.id)
        });
        setAttendingEvents(prev => prev.filter(id => id !== selectedEvent.id));
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
    setIsConfirmDialogOpen(false);
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const groupName = useGroupName(event.groupId || null); // groupをgroupIdに変更

    return (
      <Card 
        className="flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow duration-200"
        onClick={() => navigate(`/event/${event.id}`)}
      >
        <CardHeader className="flex-grow">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{event.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleBookmark(event.id); }}>
              <Star className={`h-5 w-5 ${bookmarkedEvents.includes(event.id) ? 'fill-yellow-400' : ''}`} />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            {groupName && (
              <Badge 
                variant="secondary" 
                className="flex items-center px-2 py-1 max-w-[calc(100%-40px)] overflow-hidden"
              >
                <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{groupName}</span>
              </Badge>
            )}
            <div className="w-8" /> {/* グループ名がない場合のスペース確保 */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {event.date}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {event.time}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              {event.location}
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          {event.attendanceRequired ? (
            <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); handleAttend(event); }}>
              {attendingEvents.includes(event.id) ? '出席取消' : '出席する'}
            </Button>
          ) : (
            <Badge variant="outline" className="w-full text-center py-1">出席登録不要</Badge>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <div className="space-x-2">
          <Link to="/my-events">
            <Button variant="outline">自分が作成したイベント</Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex justify-start mb-6">
          <TabsTrigger value="all" className="px-4 py-2">全て</TabsTrigger>
          <TabsTrigger value="attending" className="px-4 py-2">出席予定</TabsTrigger>
          <TabsTrigger value="bookmarked" className="px-4 py-2">ブックマーク</TabsTrigger>
        </TabsList>
        <Link to="/create-event">
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            新しいイベントを作成
          </Button>
        </Link>        
        <TabsContent value="all">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {events.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </TabsContent>
        <TabsContent value="attending">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {events.filter(event => attendingEvents.includes(event.id)).map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </TabsContent>
        <TabsContent value="bookmarked">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {events.filter(event => bookmarkedEvents.includes(event.id)).map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </TabsContent>
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-4">Text Rewriter Tool</h2>
          <TextRewriter />
        </div>
      </Tabs>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction === 'attend' ? '出席確認' : '出席取消確認'}</DialogTitle>
            <DialogDescription>
              {confirmAction === 'attend' 
                ? `${selectedEvent?.name}に出席しますか？` 
                : `${selectedEvent?.name}の出席を取り消しますか？`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedEvent && (
              <>
                <p><strong>日付:</strong> {selectedEvent.date}</p>
                <p><strong>時間:</strong> {selectedEvent.time}</p>
                <p><strong>場所:</strong> {selectedEvent.location}</p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>キャンセル</Button>
            <Button onClick={confirmAttendance}>確定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;