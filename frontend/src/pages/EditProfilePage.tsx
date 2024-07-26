import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  email: string;
  affiliation: string;
  grade: string;
}

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    firstNameKana: '',
    lastNameKana: '',
    email: '',
    affiliation: '',
    grade: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError('プロフィール情報の取得中にエラーが発生しました');
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        firstNameKana: profile.firstNameKana,
        lastNameKana: profile.lastNameKana,
        affiliation: profile.affiliation,
        grade: profile.grade,
      });
      navigate('/mypage');
    } catch (err) {
      console.error("Error updating profile:", err);
      setError('プロフィールの更新中にエラーが発生しました');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (!user) return <div>ログインしてください</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline" className="text-sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="lastName">姓</Label>
          <Input
            id="lastName"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="firstName">名</Label>
          <Input
            id="firstName"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastNameKana">セイ</Label>
          <Input
            id="lastNameKana"
            name="lastNameKana"
            value={profile.lastNameKana}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="firstNameKana">メイ</Label>
          <Input
            id="firstNameKana"
            name="firstNameKana"
            value={profile.firstNameKana}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div>
          <Label htmlFor="affiliation">所属（学部）</Label>
          <Input
            id="affiliation"
            name="affiliation"
            value={profile.affiliation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="grade">学年</Label>
          <Input
            id="grade"
            name="grade"
            value={profile.grade}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit">更新</Button>
      </form>
    </div>
  );
};

export default EditProfilePage;