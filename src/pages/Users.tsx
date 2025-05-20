import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import UserList from '../components/admin/UserList';
import UserForm from '../components/admin/UserForm';
import { User } from '../types/User';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchUsers = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setUsers([
          {
            id: '1',
            name: 'Admin',
            email: 'admin@example.com',
            cpf: '12345678900',
            role: 'admin',
            active: true,
          },
          {
            id: '2',
            name: 'Dr. Carlos Silva',
            email: 'carlos@example.com',
            cpf: '98765432100',
            role: 'dentist',
            active: true,
          },
          {
            id: '3',
            name: 'Ana Auxiliar',
            email: 'ana@example.com',
            cpf: '11122233344',
            role: 'auxiliary',
            active: true,
          },
          {
            id: '4',
            name: 'Maria Recepção',
            email: 'maria@example.com',
            cpf: '55566677788',
            role: 'reception',
            active: true,
          },
          {
            id: '5',
            name: 'João Inatvo',
            email: 'joao@example.com',
            cpf: '99988877766',
            role: 'dentist',
            active: false,
          },
        ]);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Erro ao carregar usuários');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleAddUser = (userData: User) => {
    // In a real app, this would be an API call
    setUsers([...users, userData]);
    setShowForm(false);
    toast.success('Usuário adicionado com sucesso');
  };

  const handleUpdateUser = (updatedUser: User) => {
    // In a real app, this would be an API call
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    toast.success('Usuário atualizado com sucesso');
  };

  const handleDeleteUser = (id: string) => {
    // Prevent deleting yourself
    if (id === currentUser?.id) {
      toast.error('Você não pode excluir sua própria conta');
      return;
    }

    // Confirmation
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      // In a real app, this would be an API call
      setUsers(users.filter(user => user.id !== id));
      toast.success('Usuário excluído com sucesso');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <p className="mt-1 text-sm text-gray-500">
            Adicione e gerencie os usuários do sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Novo Usuário
        </button>
      </div>

      {showForm && (
        <UserForm 
          onSubmit={handleAddUser}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      <UserList 
        users={users}
        onDelete={handleDeleteUser}
        onUpdate={handleUpdateUser}
      />
    </div>
  );
};

export default Users;