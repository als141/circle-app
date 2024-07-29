import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCircle } from '../../CircleContext';
import { useGroupName } from '../../hooks/useGroupName';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Calendar, Clock, MapPin, Users, Trash, Edit } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  groupId?: string;
  description: string;
  attendanceRequired: boolean;
  createdBy: string;
}

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { activeCircle } = useCircle();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const groupName = useGroupName(event?.groupId || null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUserMember, setIsUserMember] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAttendDialogOpen, setIsAttendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (eventDoc.exists()) {
          const eventData = { id: eventDoc.id, ...eventDoc.data() } as Event;
          setEvent(eventData);
        } else {
          setError('イベントが見つかりません');
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError('イベント情報の取得中にエラーが発生しました');
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user || !activeCircle || !event) return;
  
      const membershipDoc = await getDoc(doc(db, 'circleMemberships', `${user.uid}_${activeCircle.id}`));
      if (membershipDoc.exists()) {
        const role = membershipDoc.data().role;
        setIsUserAdmin(role === 'admin');
        setIsUserMember(true);
      }
  
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsAttending(userData.attendingEvents?.includes(event.id) || false);
        setIsBookmarked(userData.bookmarkedEvents?.includes(event.id) || false);
      }
    };
  
    checkUserRole();
  }, [user, activeCircle, event]);

  const handleDelete = async () => {
    if (!eventId) return;
    try {
      await deleteDoc(doc(db, 'events', eventId));
      setDialogMessage('イベントが削除されました。');
      setIsDialogOpen(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError('イベントの削除中にエラーが発生しました');
    }
  };
  
  const handleEdit = () => {
    navigate(`/edit-event/${eventId}`);
  };
  
  const handleBookmark = async () => {
    if (!user || !eventId) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      if (isBookmarked) {
        await updateDoc(userRef, {
          bookmarkedEvents: arrayRemove(eventId)
        });
      } else {
        await updateDoc(userRef, {
          bookmarkedEvents: arrayUnion(eventId)
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error("Error updating bookmark:", err);
      setError('ブックマークの更新中にエラーが発生しました');
    }
  };
  
  const handleAttend = () => {
    setIsAttendDialogOpen(true);
  };
  
  const confirmAttendance = async () => {
    if (!user || !eventId) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      if (isAttending) {
        await updateDoc(userRef, {
          attendingEvents: arrayRemove(eventId)
        });
      } else {
        await updateDoc(userRef, {
          attendingEvents: arrayUnion(eventId)
        });
      }
      setIsAttending(!isAttending);
      setIsAttendDialogOpen(false);
    } catch (err) {
      console.error("Error updating attendance:", err);
      setError('出席状況の更新中にエラーが発生しました');
    }
  };
  
  const confirmDelete = async () => {
    if (!eventId) return;
    try {
      await deleteDoc(doc(db, 'events', eventId));
      setDialogMessage('イベントが削除されました。');
      setIsDeleteDialogOpen(false);
      setIsDialogOpen(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError('イベントの削除中にエラーが発生しました');
    }
  };

  const memoizedGroupName = useMemo(() => {
    return event ? groupName : null;
  }, [event, groupName]);

  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" className="text-sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
        {isUserMember && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className="flex items-center"
          >
            <Star className={`h-5 w-5 mr-1 ${isBookmarked ? 'fill-yellow-400' : ''}`} />
            {isBookmarked ? "ブックマーク済" : "ブックマーク"}
          </Button>
        )}
      </div>
      {event && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl font-bold">{event.name}</CardTitle>
              {memoizedGroupName && (
                <Badge variant="secondary" className="flex items-center px-2 py-1">
                  <Users className="w-4 h-4 mr-1" />
                  {memoizedGroupName}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-500" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                <span>{event.location}</span>
              </div>
              {event.attendanceRequired && (
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-gray-500" />
                  <span>出席必須</span>
                </div>
              )}
            </div>
            <p className="mt-4">{event.description}</p>
            {isUserMember && event.attendanceRequired && (
              <Button
                className="mt-4 w-full"
                variant={isAttending ? "secondary" : "default"}
                onClick={handleAttend}
              >
                {isAttending ? "出席取消" : "出席する"}
              </Button>
            )}
            {(isUserAdmin || event.createdBy === user?.uid) && (
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                  <Trash className="h-4 w-4 mr-2" />
                  削除
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
  
      <Dialog open={isAttendDialogOpen} onOpenChange={setIsAttendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAttending ? '出席取消確認' : '出席確認'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-semibold mb-2">{event?.name}</h3>
            <p><Calendar className="inline mr-2" />{event?.date}</p>
            <p><Clock className="inline mr-2" />{event?.time}</p>
            <p><MapPin className="inline mr-2" />{event?.location}</p>
            <p className="mt-2">{event?.description}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendDialogOpen(false)}>キャンセル</Button>
            <Button onClick={confirmAttendance}>確定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>イベント削除の確認</DialogTitle>
            <DialogDescription>
              本当にこのイベントを削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-semibold mb-2">{event?.name}</h3>
            <p><Calendar className="inline mr-2" />{event?.date}</p>
            <p><Clock className="inline mr-2" />{event?.time}</p>
            <p><MapPin className="inline mr-2" />{event?.location}</p>
            <p className="mt-2">{event?.description}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>キャンセル</Button>
            <Button variant="destructive" onClick={confirmDelete}>削除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventDetailsPage;