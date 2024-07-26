import React, { useState } from 'react';

interface RegisterFormProps {
  onSubmit: (userData: {
    studentId: string;
    lastName: string;
    firstName: string;
    lastNameKana: string;
    firstNameKana: string;
    affiliation: string;
    grade: string;
    email: string;
    password: string;
  }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [studentId, setStudentId] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastNameKana, setLastNameKana] = useState('');
  const [firstNameKana, setFirstNameKana] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [grade, setGrade] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    if (!agreedToTerms) {
      alert('利用規約に同意する必要があります');
      return;
    }
    onSubmit({
      studentId,
      lastName,
      firstName,
      lastNameKana,
      firstNameKana,
      affiliation,
      grade,
      email,
      password
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">学籍番号</label>
        <input
          id="studentId"
          name="studentId"
          type="text"
          required
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">姓</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">名</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="lastNameKana" className="block text-sm font-medium text-gray-700">姓（カナ）</label>
        <input
          id="lastNameKana"
          name="lastNameKana"
          type="text"
          required
          value={lastNameKana}
          onChange={(e) => setLastNameKana(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="firstNameKana" className="block text-sm font-medium text-gray-700">名（カナ）</label>
        <input
          id="firstNameKana"
          name="firstNameKana"
          type="text"
          required
          value={firstNameKana}
          onChange={(e) => setFirstNameKana(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">所属</label>
        <input
          id="affiliation"
          name="affiliation"
          type="text"
          required
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">学年</label>
        <input
          id="grade"
          name="grade"
          type="text"
          required
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">パスワード確認</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex items-center">
        <input
          id="agreedToTerms"
          name="agreedToTerms"
          type="checkbox"
          required
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-900">利用規約に同意します</label>
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          登録
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;