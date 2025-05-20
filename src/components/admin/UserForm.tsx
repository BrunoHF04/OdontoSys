import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { User } from '../../types/User';
import { validateCPF } from '../../utils/cpf';

interface UserFormProps {
  initialValues?: User;
  onSubmit: (user: User) => void;
  onCancel: () => void;
}

const UserForm = ({ initialValues, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState<Omit<User, 'id'> & { id?: string }>({
    name: '',
    email: '',
    cpf: '',
    role: 'reception',
    active: true,
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!initialValues;

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        password: '', // Don't populate password when editing
      });
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear the error when the field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const userData: User = {
        id: formData.id || crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf || '',
        role: formData.role,
        active: formData.active,
        // Only include password if it's provided (for editing) or required (for new users)
        ...(formData.password ? { password: formData.password } : {}),
      };
      
      onSubmit(userData);
      
      if (!isEditing) {
        // Reset form if adding a new user
        setFormData({
          name: '',
          email: '',
          cpf: '',
          role: 'reception',
          active: true,
          password: '',
        });
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 form-input ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 form-input ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
              CPF
            </label>
            <InputMask
              mask="999.999.999-99"
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className={`mt-1 form-input ${errors.cpf ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.cpf && (
              <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha {!isEditing && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditing ? "Deixe em branco para manter a senha atual" : ""}
              className={`mt-1 form-input ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Perfil <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 form-select"
            >
              <option value="admin">Administrador</option>
              <option value="dentist">Dentista</option>
              <option value="auxiliary">Auxiliar</option>
              <option value="reception">Recepção</option>
            </select>
          </div>

          <div className="flex items-center h-full pt-5">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleChange}
                  className="form-checkbox"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="active" className="font-medium text-gray-700">
                  Ativo
                </label>
                <p className="text-gray-500">Usuário pode acessar o sistema</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {isEditing ? 'Salvar Alterações' : 'Adicionar Usuário'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;