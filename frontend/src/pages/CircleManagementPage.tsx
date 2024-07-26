import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc, addDoc, query, where } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Member {
  id: string;
  name: string;
  role: string;
  groups: string[];
}

interface Group {
  id: string;
  name: string;
}

const CircleManagementPage: React.FC = () => {
  const { circleId } = useParams<{ circleId: string }>();
  const [circleName, setCircleName] = useState<string>('');
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCircleData = async () => {
      if (!circleId) {
        setError("サークルIDが指定されていません。");
        return;
      }

      try {
        // サークル情報の取得
        const circleDoc = await getDoc(doc(db, 'circles', circleId));
        if (circleDoc.exists()) {
          setCircleName(circleDoc.data().name);
          setInvitationCode(circleDoc.data().invitationCode || 'N/A');
        } else {
          setError("指定されたサークルが見つかりません。");
          return;
        }

        // メンバー情報の取得
        const membershipsQuery = query(collection(db, 'circleMemberships'), where("circleId", "==", circleId));
        const membershipsSnapshot = await getDocs(membershipsQuery);
        const membersData: Member[] = [];

        for (const membershipDoc of membershipsSnapshot.docs) {
          const userData = await getDoc(doc(db, 'users', membershipDoc.data().userId));
          if (userData.exists()) {
            membersData.push({
              id: userData.id,
              name: `${userData.data().lastName} ${userData.data().firstName}`,
              role: membershipDoc.data().role,
              groups: membershipDoc.data().groups || []
            });
          }
        }
        setMembers(membersData);

        // グループ情報の取得
        const groupsQuery = query(collection(db, 'groups'), where("circleId", "==", circleId));
        const groupsSnapshot = await getDocs(groupsQuery);
        const groupsData = groupsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setGroups(groupsData);

      } catch (err) {
        console.error("Error fetching circle data:", err);
        setError("サークル情報の取得中にエラーが発生しました。");
      }
    };

    fetchCircleData();
  }, [circleId]);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      const membershipQuery = query(
        collection(db, 'circleMemberships'),
        where("circleId", "==", circleId),
        where("userId", "==", memberId)
      );
      const membershipSnapshot = await getDocs(membershipQuery);
      if (!membershipSnapshot.empty) {
        const membershipDoc = membershipSnapshot.docs[0];
        await updateDoc(doc(db, 'circleMemberships', membershipDoc.id), { role: newRole });
        setMembers(members.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        ));
      }
    } catch (err) {
      console.error("Error updating role:", err);
      setError("ロールの更新中にエラーが発生しました。");
    }
  };

  const handleGroupToggle = async (memberId: string, groupId: string) => {
    try {
      const membershipQuery = query(
        collection(db, 'circleMemberships'),
        where("circleId", "==", circleId),
        where("userId", "==", memberId)
      );
      const membershipSnapshot = await getDocs(membershipQuery);
      if (!membershipSnapshot.empty) {
        const membershipDoc = membershipSnapshot.docs[0];
        const currentGroups = membershipDoc.data().groups || [];
        const updatedGroups = currentGroups.includes(groupId)
          ? currentGroups.filter((g: string) => g !== groupId)
          : [...currentGroups, groupId];
        
        await updateDoc(doc(db, 'circleMemberships', membershipDoc.id), { groups: updatedGroups });
        setMembers(members.map(member => 
          member.id === memberId ? { ...member, groups: updatedGroups } : member
        ));
      }
    } catch (err) {
      console.error("Error updating groups:", err);
      setError("グループの更新中にエラーが発生しました。");
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const newGroupRef = await addDoc(collection(db, 'groups'), {
        name: newGroupName,
        circleId: circleId
      });
      setGroups([...groups, { id: newGroupRef.id, name: newGroupName }]);
      setNewGroupName('');
    } catch (err) {
      console.error("Error adding group:", err);
      setError("グループの追加中にエラーが発生しました。");
    }
  };

  if (error) {
    return <div className="container mx-auto p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">サークル管理: {circleName}</h1>
      <p className="mb-4">招待コード: {invitationCode}</p>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <h2 className="text-xl font-semibold mb-2">メンバー一覧</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名前</TableHead>
            <TableHead>ロール</TableHead>
            <TableHead>グループ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map(member => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>
                <Select value={member.role} onValueChange={(value) => handleRoleChange(member.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="ロールを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理者</SelectItem>
                    <SelectItem value="member">メンバー</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {groups.map(group => (
                  <label key={group.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={member.groups.includes(group.id)}
                      onChange={() => handleGroupToggle(member.id, group.id)}
                    />
                    <span>{group.name}</span>
                  </label>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="text-xl font-semibold my-4">新しいグループの追加</h2>
      <div className="flex space-x-2">
        <Input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="新しいグループ名"
        />
        <Button onClick={handleAddGroup}>追加</Button>
      </div>
    </div>
  );
};

export default CircleManagementPage;