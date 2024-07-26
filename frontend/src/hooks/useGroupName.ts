import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const useGroupName = (groupId: string | null) => {
  const [groupName, setGroupName] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupName = async () => {
      if (!groupId) {
        setGroupName(null);
        return;
      }

      try {
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (groupDoc.exists()) {
          setGroupName(groupDoc.data().name);
        } else {
          setGroupName(null);
        }
      } catch (error) {
        console.error('Error fetching group name:', error);
        setGroupName(null);
      }
    };

    fetchGroupName();
  }, [groupId]);

  return groupName;
};