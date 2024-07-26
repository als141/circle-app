import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [circleName, setCircleName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (userData: {
    studentId: string;
    lastName: string;
    firstName: string;
    lastNameKana: string;
    firstNameKana: string;
    affiliation: string;
    grade: string;
    email: string;
    password: string;
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      await sendEmailVerification(user);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        studentId: userData.studentId,
        lastName: userData.lastName,
        firstName: userData.firstName,
        lastNameKana: userData.lastNameKana,
        firstNameKana: userData.firstNameKana,
        affiliation: userData.affiliation,
        grade: userData.grade,
        email: userData.email,
        bookmarkedEvents: [],
        registeredEvents: []
      });

      if (invitationCode) {
        const circleDocRef = doc(db, 'circles', invitationCode);
        const circleDoc = await getDoc(circleDocRef);
        if (circleDoc.exists()) {
          setCircleName(circleDoc.data().name);
          // Add user to circle membership
          const membershipDocRef = doc(db, 'circleMemberships', `${user.uid}_${invitationCode}`);
          await setDoc(membershipDocRef, {
            userId: user.uid,
            circleId: invitationCode,
            role: 'member',
            groups: []
          });
        } else {
          setRegistrationMessage('無効な招待コードです。');
          return;
        }
      }

      setRegistrationMessage('登録成功。確認メールが送信されました。');
      navigate('/email-verification');
    } catch (error) {
      console.error("Error registering user: ", error);
      setRegistrationMessage('登録に失敗しました。');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">新規登録</h2>
        {registrationMessage && (
          <div className="text-center text-green-500">{registrationMessage}</div>
        )}
        <RegisterForm onSubmit={handleRegister} />
        <div>
          <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700">招待コード（任意）</label>
          <input
            id="invitationCode"
            name="invitationCode"
            type="text"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {circleName && (
          <div className="text-center text-green-500">
            サークル名: {circleName}
          </div>
        )}
        <div className="text-sm text-center">
          <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            既にアカウントをお持ちの方はこちら
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;