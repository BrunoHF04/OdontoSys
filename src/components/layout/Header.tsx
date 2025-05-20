import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/users')) return 'Gerenciamento de Usuários';
    if (path.includes('/patients')) {
      if (path.includes('/odontogram')) return 'Odontograma';
      if (path.split('/').length > 2) return 'Detalhes do Paciente';
      return 'Pacientes';
    }
    if (path.includes('/appointments')) return 'Agenda';
    if (path.includes('/documents')) return 'Documentos';
    if (path.includes('/settings')) return 'Configurações';
    
    return 'Dashboard';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              {getPageTitle()}
            </h1>
            <p className="mt-1 text-sm text-gray-500 truncate">
              {getPageTitle() === 'Dashboard' ? 'Resumo da clínica e próximas atividades' : ''}
            </p>
          </div>

          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 
                    bg-white text-gray-900
                    placeholder-gray-400 
                    focus:outline-none focus:ring-1 
                    focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="Buscar paciente..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationDropdown />

            <div className="ml-4 flex items-center md:ml-6">
              <div className="avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;