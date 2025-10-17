import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';

const Header = () => {
  const { user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userNavItems = [
    { path: '/inicio', label: 'Início'},
    { path: '/servicos', label: 'Serviços'},
    { path: '/meus-agendamentos', label: 'Meus Agendamentos'},
    { path: '/historico', label: 'Histórico'},
    { path: '/perfil', label: 'Perfil'}
  ];

  const organizerNavItems = [
    { path: '/inicio', label: 'Início'},
    { path: '/meus-servicos', label: 'Meus Serviços'},
    { path: '/agendamentos', label: 'Agendamentos'},
    { path: '/novo-servico', label: 'Novo Serviço'},
    { path: '/perfil', label: 'Perfil'}
  ];

  const navItems = isOrganizer ? organizerNavItems : userNavItems;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/inicio" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Conectando</h1>
              <p className="text-xs text-gray-500">Serviços Comunitários</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || user?.email?.split('@')[0]}</p>
                <p className="text-xs text-purple-600 font-medium">
                  {isOrganizer ? 'Organizador' : 'Usuário'}
                </p>
              </div>
              <Avatar className="w-9 h-9 bg-purple-500">
                <AvatarFallback className="bg-purple-500 text-white font-semibold">
                  {(user?.name || user?.email)?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
