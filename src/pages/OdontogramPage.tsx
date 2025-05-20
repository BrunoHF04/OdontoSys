import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Patient } from '../types/Patient';
import { ToothData } from '../types/Odontogram';
import Odontogram from '../components/odontogram/Odontogram';
import toast from 'react-hot-toast';

const OdontogramPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [odontogramData, setOdontogramData] = useState<Record<string, ToothData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock patient data
        setPatient({
          id,
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
        console.error('Error fetching data:', error);
        toast.error('Erro ao carregar dados do odontograma');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleSaveOdontogram = async (data: Record<string, ToothData>) => {
    // In a real app, this would be an API call
    setIsSaving(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOdontogramData(data);
      toast.success('Odontograma salvo com sucesso');
    } catch (error) {
      console.error('Error saving odontogram:', error);
      toast.error('Erro ao salvar odontograma');
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to={`/patients/${patient.id}`}
            className="mr-3 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Odontograma</h1>
            <p className="text-sm text-gray-500">
              Paciente: {patient.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleSaveOdontogram(odontogramData)}
          className={`btn btn-primary flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <Odontogram
        patientId={patient.id}
        initialData={odontogramData}
        onSave={setOdontogramData}
      />
    </div>
  );
};

export default OdontogramPage;