import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { User } from '../../types/User';
import UserForm from './UserForm';

interface UserListProps {
  users: User[];
  onDelete: (id: string) => void;
  onUpdate: (user: User) => void;
}

const UserList = ({ users, onDelete, onUpdate }: UserListProps) => {
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleSubmit = (user: User) => {
    onUpdate(user);
    setEditingUser(null);
    setIsFormOpen(false);
  };

  const roleLabels: Record<string, string> = {
    'admin': 'Administrador',
    'dentist': 'Dentista',
    'auxiliary': 'Auxiliar',
    'reception': 'Recepção'
  };

  return (
    <div>
      {isFormOpen && (
        <div className="mb-6">
          <UserForm 
            initialValues={editingUser || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingUser(null);
              setIsFormOpen(false);
            }}
          />
        </div>
      )}
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th 
                scope="col" 
                className="table-header px-6 py-3 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Nome
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="table-header px-6 py-3 cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  E-mail
                  {sortField === 'email' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="table-header px-6 py-3 cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">
                  Perfil
                  {sortField === 'role' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="table-header px-6 py-3 cursor-pointer"
                onClick={() => handleSort('active')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'active' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </th>
              <th scope="col" className="table-header px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="table-cell font-medium text-gray-900">{user.name}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                    {roleLabels[user.role] || user.role}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-gray-500 hover:text-cyan-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;