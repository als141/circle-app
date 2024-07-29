import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, PlusCircle, UserPlus, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCircle } from '../../CircleContext';
import logo from '../../../public/logo.png';

interface HeaderProps {
  isLoggedIn: boolean;
  userCircles: { id: string; name: string; }[];
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userCircles, toggleSidebar }) => {
  const navigate = useNavigate();
  const { activeCircle, setActiveCircle } = useCircle();

  const handleCircleChange = (circle: { id: string; name: string; }) => {
    setActiveCircle(circle);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="Universe" className="h-12 w-auto" />
            </Link>
            {isLoggedIn && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  ダッシュボード
                </Link>
                <Link to="/events" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  イベント
                </Link>
                <Link to="/members" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  メンバー
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-2">
                      {activeCircle ? activeCircle.name : 'サークルを選択'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userCircles.map((circle) => (
                      <DropdownMenuItem key={circle.id} onSelect={() => handleCircleChange(circle)}>
                        {circle.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => navigate('/join-circle')}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      サークルに参加
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate('/create-circle')}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      新しいサークルを作成
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => navigate('/mypage')}>
                      マイページ
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate('/settings')}>
                      設定
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>ログアウト</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">ログイン</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="ml-2">新規登録</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;