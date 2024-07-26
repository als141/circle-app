import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from 'lucide-react';
import { useGroupName } from '../hooks/useGroupName';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  group?: string;
  description: string;
  attendanceRequired: boolean;
}

interface Attendee {
  id: string;
  name: string;
}

const MyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!auth.currentUser) return;

      const eventsQuery = query(collection(db, 'events'), where("createdBy", "==", auth.currentUser.uid));
      const eventSnapshot = await getDocs(eventsQuery);
      const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  const handleEventClick = async (event: Event) => {
    setSelectedEvent(event);
    const attendeesQuery = query(collection(db, 'users'), where("attendingEvents", "array-contains", event.id));
    const attendeesSnapshot = await getDocs(attendeesQuery);
    const attendeesList = attendeesSnapshot.docs.map(doc => ({ id: doc.id, name: `${doc.data().lastName} ${doc.data().firstName}` }));
    setAttendees(attendeesList);
    setIsDialogOpen(true);
  };

  const EventRow: React.FC<{ event: Event }> = ({ event }) => {
    const groupName = useGroupName(event.group || null);

    return (
      <TableRow key={event.id}>
        <TableCell>{event.name}</TableCell>
        <TableCell>{event.date}</TableCell>
        <TableCell>{event.time}</TableCell>
        <TableCell>{event.location}</TableCell>
        <TableCell>{groupName || '指定なし'}</TableCell>
        <TableCell>
          <Button onClick={() => handleEventClick(event)}>詳細</Button>
        </TableCell>
      </TableRow>
    );
  };

  const EventDetails: React.FC<{ event: Event | null }> = ({ event }) => {
    const groupName = useGroupName(event?.group || null);

    if (!event) return null;

    return (
      <>
        <p><strong>日付:</strong> {event.date}</p>
        <p><strong>時間:</strong> {event.time}</p>
        <p><strong>場所:</strong> {event.location}</p>
        <p><strong>グループ:</strong> {groupName || '指定なし'}</p>
        <p><strong>説明:</strong> {event.description}</p>
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" className="text-sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">自分が作成したイベント</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>イベント名</TableHead>
            <TableHead>日付</TableHead>
            <TableHead>時間</TableHead>
            <TableHead>場所</TableHead>
            <TableHead>グループ</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map(event => (
            <EventRow key={event.id} event={event} />
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EventDetails event={selectedEvent} />
          </div>
          <h3 className="text-lg font-semibold mt-4 mb-2">出席者一覧</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.map(attendee => (
                <TableRow key={attendee.id}>
                  <TableCell>{attendee.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>閉じる</Button>
            <Link to={`/edit-event/${selectedEvent?.id}`}>
              <Button>編集</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyEventsPage;