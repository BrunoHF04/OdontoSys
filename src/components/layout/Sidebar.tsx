import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, UserPlus, Calendar, Settings, LogOut, FileText, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles: string[];
};

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
      allowedRoles: ['admin', 'dentist', 'auxiliary', 'reception'],
    },
    {
      name: 'Usuários',
      path: '/users',
      icon: <Users size={20} />,
      allowedRoles: ['admin'],
    },
    {
      name: 'Pacientes',
      path: '/patients',
      icon: <UserPlus size={20} />,
      allowedRoles: ['admin', 'dentist', 'auxiliary', 'reception'],
    },
    {
      name: 'Agenda',
      path: '/appointments',
      icon: <Calendar size={20} />,
      allowedRoles: ['admin', 'dentist', 'auxiliary', 'reception'],
    },
    {
      name: 'Documentos',
      path: '/documents',
      icon: <FileText size={20} />,
      allowedRoles: ['admin', 'dentist', 'auxiliary', 'reception'],
    },
    {
      name: 'Configurações',
      path: '/settings',
      icon: <Settings size={20} />,
      allowedRoles: ['admin'],
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.allowedRoles.includes(user?.role || '')
  );

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          bg-white shadow-lg
          transition-all duration-300 ease-in-out
          ${expanded ? 'w-64' : 'w-20'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="text-cyan-500"
                fill="currentColor"
                stroke="none"
              >
                <path d="M12 0C9.97 0 7.94 0.31 6.44 1C4.94 1.69 4 2.61 4 3.65V4.09C3.14 4.93 2 6.53 2 9.04C2 12.48 2.97 15.75 5.22 18C7.47 20.25 10.63 21.45 12 21.45C13.37 21.45 16.53 20.25 18.78 18C21.03 15.75 22 12.48 22 9.04C22 6.53 20.86 4.93 20 4.09V3.65C20 2.61 19.06 1.69 17.56 1C16.06 0.31 14.03 0 12 0ZM12 2C13.71 2 15.39 2.27 16.56 2.81C17.73 3.35 18 3.95 18 3.97C18 3.97 18 3.97 18 3.97V4C18 4.12 17.91 4.61 17.09 5.09C15.95 5.83 14.08 6 12 6C9.92 6 8.05 5.83 6.91 5.09C6.09 4.61 6 4.12 6 4V3.97C6 3.95 6.27 3.35 7.44 2.81C8.61 2.27 10.29 2 12 2ZM12 8C14.08 8 15.95 7.83 17.09 7.09C17.91 6.61 18 6.12 18 6V6.03C18 6.05 17.73 6.65 16.56 7.19C15.39 7.73 13.71 8 12 8C10.29 8 8.61 7.73 7.44 7.19C6.27 6.65 6 6.05 6 6.03V6C6 6.12 6.09 6.61 6.91 7.09C8.05 7.83 9.92 8 12 8Z"/>
              </svg>
              {expanded && <span className="ml-2 text-xl font-semibold text-gray-900">DentClinic</span>}
            </Link>
            <button 
              onClick={toggleSidebar}
              className="hidden lg:block p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100"
            >
              {expanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.path || 
                               (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${isActive 
                      ? 'bg-cyan-50 text-cyan-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${expanded ? '' : 'justify-center'}
                  `}
                >
                  <span className={`${expanded ? 'mr-3' : ''}`}>{item.icon}</span>
                  {expanded && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className={`flex ${expanded ? 'items-center' : 'flex-col items-center'}`}>
              <div className="avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              {expanded && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Sem perfil'}</p>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className={`
                mt-3 flex items-center w-full px-3 py-2 text-sm font-medium rounded-md
                text-gray-600 hover:bg-gray-50 hover:text-gray-900
                ${expanded ? '' : 'justify-center'}
              `}
            >
              <LogOut size={20} className={expanded ? 'mr-2' : ''} />
              {expanded && <span>Sair</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;