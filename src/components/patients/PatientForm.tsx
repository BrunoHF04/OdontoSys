import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Patient } from '../../types/Patient';
import { validateCPF } from '../../utils/cpf';

interface PatientFormProps {
  initialValues?: Patient;
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
}

const PatientForm = ({ initialValues, onSubmit, onCancel }: PatientFormProps) => {
  const [formData, setFormData] = useState<Omit<Patient, 'id'> & { id?: string }>({
    name: '',
    birthDate: '',
    gender: 'male',
    cpf: '',
    phone: '',
    email: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    observations: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!initialValues;

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
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
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    
    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const patientData: Patient = {
        id: formData.id || crypto.randomUUID(),
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        cpf: formData.cpf || '',
        phone: formData.phone,
        email: formData.email || '',
        address: formData.address,
        observations: formData.observations || '',
      };
      
      onSubmit(patientData);
    }
  };

  return (
    <div className="bg-dark-800 shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-100 mb-4">
        {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-100 mb-3">
            Informações Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
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
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300">
                Data de Nascimento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className={`mt-1 form-input ${errors.birthDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 form-select"
              >
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-300">
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Telefone <span className="text-red-500">*</span>
              </label>
              <InputMask
                mask="(99) 99999-9999"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 form-input ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                E-mail
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
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-100 mb-3">
            Endereço
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-300">
                Rua/Avenida
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="mt-1 form-input"
              />
            </div>

            <div>
              <label htmlFor="address.number" className="block text-sm font-medium text-gray-300">
                Número
              </label>
              <input
                type="text"
                id="address.number"
                name="address.number"
                value={formData.address.number}
                onChange={handleChange}
                className="mt-1 form-input"
              />
            </div>

            <div>
              <label htmlFor="address.complement" className="block text-sm font-medium text-gray-300">
                Complemento
              </label>
              <input
                type="text"
                id="address.complement"
                name="address.complement"
                value={formData.address.complement}
                onChange={handleChange}
                className="mt-1 form-input"
              />
            </div>

            <div>
              <label htmlFor="address.neighborhood" className="block text-sm font-medium text-gray-300">
                Bairro
              </label>
              <input
                type="text"
                id="address.neighborhood"
                name="address.neighborhood"
                value={formData.address.neighborhood}
                onChange={handleChange}
                className="mt-1 form-input"
              />
            </div>

            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-300">
                Cidade
              </label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="mt-1 form-input"
              />
            </div>

            <div>
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-300">
                Estado
              </label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="mt-1 form-input"
              />
            </div>

            <div>
              <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-300">
                CEP
              </label>
              <InputMask
                mask="99999-999"
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                className="mt-1 form-input"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-100 mb-3">
            Observações
          </h3>
          <div>
            <textarea
              id="observations"
              name="observations"
              rows={4}
              value={formData.observations}
              onChange={handleChange}
              className="mt-1 form-input"
              placeholder="Informações adicionais sobre o paciente..."
            />
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
            {isEditing ? 'Salvar Alterações' : 'Adicionar Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;