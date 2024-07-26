import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'member';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { circleId } = useParams<{ circleId: string }>();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        setIsAuthorized(false);
        return;
      }

      if (requiredRole === 'admin' && circleId) {
        try {
          const membershipDoc = await getDoc(doc(db, 'circleMemberships', `${user.uid}_${circleId}`));
          if (membershipDoc.exists() && membershipDoc.data().role === 'admin') {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Error checking authorization:", error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuthorization();
  }, [user, requiredRole, circleId]);

  if (isAuthorized === null) {
    // 認証チェック中はローディング表示
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    // 未認証またはアクセス権限がない場合はリダイレクト
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;