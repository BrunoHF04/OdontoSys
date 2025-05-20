import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Edit, Trash2, ArrowLeft, Tooth } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Patient } from '../types/Patient';
import { Attachment } from '../types/Attachment';
import { ToothData } from '../types/Odontogram';
import PatientForm from '../components/patients/PatientForm';
import AttachmentList from '../components/attachments/AttachmentList';
import AttachmentUpload from '../components/attachments/AttachmentUpload';
import toast from 'react-hot-toast';

const PatientDetail = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [odontogramData, setOdontogramData] = useState<Record<string, ToothData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'attachments'>('info');
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPatientData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock patient data
        setPatient({
          id: '1',
          name: 'Ana Silva',
          birthDate: '1985-05-15',
          gender: 'female',
          cpf: '12345678900',
          phone: '11987654321',
          email: 'ana@example.com',
          address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 45',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
          },
          observations: 'Alérgica a penicilina',
        });
        
        // Mock attachments
        setAttachments([
          {
            id: '1',
            patientId: '1',
            fileName: 'raio-x-panoramico.jpg',
            fileType: 'image/jpeg',
            fileSize: 1024 * 1024 * 2.5, // 2.5MB
            fileUrl: 'https://images.pexels.com/photos/3845983/pexels-photo-3845983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            uploadDate: '2023-06-15T10:30:00Z',
            description: 'Raio-X panorâmico inicial',
            associatedTooth: undefined,
          },
          {
            id: '2',
            patientId: '1',
            fileName: 'raio-x-dente-18.jpg',
            fileType: 'image/jpeg',
            fileSize: 1024 * 1024 * 1.8, // 1.8MB
            fileUrl: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            uploadDate: '2023-06-20T14:15:00Z',
            description: 'Raio-X periapical do elemento 18',
            associatedTooth: '18',
          },
          {
            id: '3',
            patientId: '1',
            fileName: 'ficha-anamnese.pdf',
            fileType: 'application/pdf',
            fileSize: 1024 * 512, // 512KB
            fileUrl: '#',
            uploadDate: '2023-06-10T09:00:00Z',
            description: 'Ficha de anamnese preenchida pelo paciente',
            associatedTooth: undefined,
          },
        ]);
        
        // Mock odontogram data
        setOdontogramData({
          '18': {
            sections: {
              'top': 'caries',
              'right': 'extraction'
            },
            notes: 'Extração recomendada'
          },
          '26': {
            sections: {
              'center': 'restoration'
            },
            notes: 'Restauração realizada em 15/06/2023'
          },
          '36': {
            sections: {
              'top': 'root-canal'
            },
            notes: 'Tratamento de canal iniciado'
          },
          '47': {
            sections: {
              'center': 'crown'
            },
            notes: 'Coroa instalada'
          }
        });
      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast.error('Erro ao carregar dados do paciente');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatientData();
  }, []);

  const handleUpdatePatient = (updatedPatient: Patient) => {
    // In a real app, this would be an API call
    setPatient(updatedPatient);
    setIsEditing(false);
    toast.success('Paciente atualizado com sucesso');
  };

  const handleDeletePatient = () => {
    // Confirmation
    if (window.confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
      // In a real app, this would be an API call
      toast.success('Paciente excluído com sucesso');
      navigate('/patients');
    }
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    // Confirmation
    if (window.confirm('Tem certeza que deseja excluir este anexo?')) {
      // In a real app, this would be an API call
      setAttachments(attachments.filter(a => a.id !== attachmentId));
      toast.success('Anexo excluído com sucesso');
    }
  };

  const handleAddAttachment = (newAttachment: Attachment) => {
    // In a real app, this would be an API call
    setAttachments([...attachments, newAttachment]);
    toast.success('Anexo adicionado com sucesso');
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white p-6 text-center rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">Paciente não encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          O paciente que você está procurando não existe ou foi removido.
        </p>
        <div className="mt-6">
          <Link to="/patients" className="btn btn-primary">
            Voltar para Lista de Pacientes
          </Link>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar para Detalhes do Paciente
          </button>
        </div>
        
        <PatientForm
          initialValues={patient}
          onSubmit={handleUpdatePatient}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/patients"
            className="mr-3 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-sm text-gray-500">
              CPF: {formatCPF(patient.cpf)} | Telefone: {formatPhone(patient.phone)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </button>
          <button
            onClick={handleDeletePatient}
            className="btn btn-danger flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`tab ${activeTab === 'info' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Informações
            </button>
            <button
              className={`tab ${activeTab === 'attachments' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('attachments')}
            >
              Anexos ({attachments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'info' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(patient.birthDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sexo</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {patient.gender === 'male' ? 'Masculino' : 
                       patient.gender === 'female' ? 'Feminino' : 'Outro'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CPF</p>
                    <p className="mt-1 text-sm text-gray-900">{formatCPF(patient.cpf)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="mt-1 text-sm text-gray-900">{formatPhone(patient.phone)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">E-mail</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.email || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Endereço</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Logradouro</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.address.street || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Número</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.address.number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Complemento</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.address.complement || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bairro</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.address.neighborhood || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cidade</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.address.city || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.address.state || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CEP</p>
                    <p className="mt-1 text-sm text-gray-900">{patient.address.zipCode || '-'}</p>
                  </div>
                </div>
              </div>

              {patient.observations && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Observações</h2>
                  <p className="text-sm text-gray-900">{patient.observations}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tratamentos e Registros</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    to={`/patients/${patient.id}/odontogram`}
                    className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mr-4">
                      <Tooth className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Odontograma</h3>
                      <p className="text-sm text-gray-500">Ver e editar odontograma do paciente</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/appointments"
                    className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Consultas</h3>
                      <p className="text-sm text-gray-500">Histórico e agendamento de consultas</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <AttachmentUpload
                patientId={patient.id}
                onUpload={handleAddAttachment}
              />

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Anexos
                </h3>
                <AttachmentList
                  patientId={patient.id}
                  attachments={attachments}
                  onDelete={handleDeleteAttachment}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;