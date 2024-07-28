import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
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
    <header className="bg-white shadow-md h-16">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        <div className="flex items-center h-full">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-2">
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/" className="mr-4">
            <img src={logo} alt="サークル管理アプリ" className="h-10" /> {/* 画像を表示 */}
          </Link>
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
        <div className="flex items-center">
          {isLoggedIn ? (  // ログイン中の条件
            <Link to="/mypage" className="mr-2 text-sm">マイページ</Link>
          ) : (
            <Link to="/login" className="mr-2 text-sm">ログイン</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;