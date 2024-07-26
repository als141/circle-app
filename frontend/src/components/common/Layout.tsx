import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, LogIn, UserPlus, User, LogOut, PlusCircle, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useCircle } from '../../CircleContext';

interface Circle {
  id: string;
  name: string;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCircles, setUserCircles] = useState<Circle[]>([]);
  const { activeCircle, setActiveCircle } = useCircle();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        fetchUserCircles(user.uid);
      } else {
        setUserCircles([]);
        setActiveCircle(null);
      }
    });

    return () => unsubscribe();
  }, [auth, setActiveCircle]);

  const fetchUserCircles = async (userId: string) => {
    try {
      const membershipsRef = collection(db, 'circleMemberships');
      const q = query(membershipsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const circles: Circle[] = [];
      for (const doc of querySnapshot.docs) {
        const circleDoc = await getDocs(query(collection(db, 'circles'), where("__name__", "==", doc.data().circleId)));
        if (!circleDoc.empty) {
          circles.push({ id: circleDoc.docs[0].id, name: circleDoc.docs[0].data().name });
        }
      }
      
      setUserCircles(circles);
      if (circles.length > 0 && !activeCircle) {
        setActiveCircle(circles[0]);
      }
    } catch (error) {
      console.error("Error fetching user circles: ", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setActiveCircle(null);
      navigate('/');
      window.location.reload();
    });
  };

  const handleCircleChange = (circle: Circle) => {
    setActiveCircle(circle);
    navigate('/');
  };

  const navItems = [
    { to: '/', icon: <Home className="mr-3 h-5 w-5" />, label: 'ダッシュボード' },
    { to: '/create-event', icon: <PlusCircle className="mr-3 h-5 w-5" />, label: 'イベント作成', authRequired: true },
    { to: '/join-circle', icon: <UserPlus className="mr-3 h-5 w-5" />, label: 'サークルに参加', authRequired: true },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item, index) => (
        (!item.authRequired || isLoggedIn) && (
          <Link 
            key={index} 
            to={item.to} 
            className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 ${location.pathname === item.to ? 'bg-gray-100' : ''}`}
            onClick={toggleSidebar}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      ))}
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* サイドバー（大画面用） */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg min-h-screen">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">メニュー</h2>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {renderNavItems()}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
                <LogIn className="mr-3 h-5 w-5" />
                ログイン
              </Link>
              <Link to="/register" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
                <UserPlus className="mr-3 h-5 w-5" />
                新規登録
              </Link>
            </>
          ) : (
            <>
              <Link to="/mypage" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100">
                <User className="mr-3 h-5 w-5" />
                マイページ
              </Link>
              <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100">
                <LogOut className="mr-3 h-5 w-5" />
                ログアウト
              </button>
            </>
          )}
        </nav>
      </div>

      {/* モバイル用サイドバー */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">メニュー</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="mt-5">
              {renderNavItems()}
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="block px-4 py-2 text-gray-600 hover:bg-gray-100" onClick={toggleSidebar}>
                    ログイン
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-gray-600 hover:bg-gray-100" onClick={toggleSidebar}>
                    新規登録
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/mypage" className="block px-4 py-2 text-gray-600 hover:bg-gray-100" onClick={toggleSidebar}>
                    マイページ
                  </Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100">
                    ログアウト
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md h-20">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
                <Menu className="h-6 w-6" />
              </Button>
              <Link to="/" className="text-2xl font-bold mr-4">サークル管理アプリ</Link>
              {isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-2">
                      {activeCircle ? activeCircle.name : 'サークルを選択'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {userCircles.map((circle) => (
                      <DropdownMenuItem key={circle.id} onSelect={() => handleCircleChange(circle)}>
                        {circle.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onSelect={() => navigate('/create-circle')}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      新しいサークルを作成
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <Link to={isLoggedIn ? "/mypage" : "/login"}>
              <div className="flex items-center">
                {isLoggedIn && <span className="mr-2 text-sm text-green-500">ログイン中</span>}
                <Avatar>
                  <AvatarImage src="/api/placeholder/40/40" alt="User" />
                  <AvatarFallback>{isLoggedIn ? "UN" : "ログイン"}</AvatarFallback>
                </Avatar>
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;