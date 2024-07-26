import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface UserInfo {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  email: string;
  affiliation: string;
  grade: string;
}

interface CircleMembership {
  circleId: string;
  circleName: string;
  groupName: string;
  role: string;
  invitationCode: string;
}

const MyPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [circleMemberships, setCircleMemberships] = useState<CircleMembership[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserInfo(userDoc.data() as UserInfo);
          } else {
            setError("ユーザー情報が見つかりません。");
            return;
          }

          const membershipsRef = collection(db, 'circleMemberships');
          const q = query(membershipsRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          
          const memberships: CircleMembership[] = [];
          for (const membershipDoc of querySnapshot.docs) {
            const membershipData = membershipDoc.data();
            if (typeof membershipData.circleId === 'string') {
              const circleDoc = await getDoc(doc(db, 'circles', membershipData.circleId));
              if (circleDoc.exists()) {
                memberships.push({
                  circleId: circleDoc.id,
                  circleName: circleDoc.data().name,
                  groupName: membershipData.groupName || 'なし',
                  role: membershipData.role,
                  invitationCode: circleDoc.data().invitationCode || 'N/A'
                });
              }
            }
          }
          setCircleMemberships(memberships);
        } catch (err) {
          console.error("Error fetching user info:", err);
          setError("情報の取得中にエラーが発生しました。");
        }
      } else {
        setError("ユーザーがログインしていません。");
      }
    };

    fetchUserInfo();
  }, []);

  if (error) {
    return <div className="max-w-4xl mx-auto p-4">{error}</div>;
  }

  if (!userInfo) {
    return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">マイページ</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>個人情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">氏名:</p>
              <p>{userInfo.lastName} {userInfo.firstName}</p>
            </div>
            <div>
              <p className="font-semibold">メールアドレス:</p>
              <p>{userInfo.email}</p>
            </div>
            <div>
              <p className="font-semibold">所属:</p>
              <p>{userInfo.affiliation}</p>
            </div>
            <div>
              <p className="font-semibold">学年:</p>
              <p>{userInfo.grade}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/edit-profile">
              <Button variant="outline">プロフィールを編集</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>所属サークル</CardTitle>
        </CardHeader>
        <CardContent>
          {circleMemberships.length > 0 ? (
            <ul className="space-y-4">
              {circleMemberships.map((membership, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="font-semibold">{membership.circleName}</p>
                  <p>グループ: {membership.groupName}</p>
                  <p>ロール: {membership.role}</p>
                  <p>招待コード: {membership.invitationCode}</p>
                  {membership.role === 'admin' && (
                    <Link to={`/circle-management/${membership.circleId}`}>
                      <Button variant="outline" className="mt-2">管理者ページ</Button>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>所属しているサークルはありません。</p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Link to="/update-email">
          <Button variant="outline" className="w-full">メールアドレスを変更</Button>
        </Link>
        <Link to="/update-password">
          <Button variant="outline" className="w-full">パスワードを変更</Button>
        </Link>
      </div>
    </div>
  );
};

export default MyPage;