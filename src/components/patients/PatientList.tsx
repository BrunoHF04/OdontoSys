import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Edit, Trash2, User, Search } from 'lucide-react';
import { Patient } from '../../types/Patient';

interface PatientListProps {
  patients: Patient[];
  onDelete: (id: string) => void;
}

const PatientList = ({ patients, onDelete }: PatientListProps) => {
  const [sortField, setSortField] = useState<keyof Patient>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSort = (field: keyof Patient) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.cpf.toLowerCase().includes(searchLower) ||
      patient.phone.toLowerCase().includes(searchLower)
    );
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return '';
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {sortedPatients.length === 0 ? (
        <div className="bg-white p-6 text-center rounded-lg shadow-sm">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum paciente encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente outros termos de busca.' : 'Comece adicionando um novo paciente.'}
          </p>
        </div>
      ) : (
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
                  onClick={() => handleSort('birthDate')}
                >
                  <div className="flex items-center">
                    Data de Nascimento
                    {sortField === 'birthDate' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="table-header px-6 py-3">
                  CPF
                </th>
                <th scope="col" className="table-header px-6 py-3">
                  Telefone
                </th>
                <th scope="col" className="table-header px-6 py-3 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <td className="table-cell font-medium text-gray-900">{patient.name}</td>
                  <td className="table-cell">{formatDate(patient.birthDate)}</td>
                  <td className="table-cell">{formatCPF(patient.cpf)}</td>
                  <td className="table-cell">{formatPhone(patient.phone)}</td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patients/${patient.id}/edit`);
                        }}
                        className="text-gray-500 hover:text-cyan-600"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(patient.id);
                        }}
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
      )}
    </div>
  );
};

export default PatientList;