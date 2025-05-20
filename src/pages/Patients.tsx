import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import PatientList from '../components/patients/PatientList';
import PatientForm from '../components/patients/PatientForm';
import { Patient } from '../types/Patient';
import toast from 'react-hot-toast';

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPatients = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setPatients([
          {
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
          },
          {
            id: '2',
            name: 'Carlos Pereira',
            birthDate: '1990-10-20',
            gender: 'male',
            cpf: '98765432100',
            phone: '11912345678',
            email: 'carlos@example.com',
            address: {
              street: 'Av. Paulista',
              number: '1000',
              complement: 'Sala 512',
              neighborhood: 'Bela Vista',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01310-100',
            },
            observations: '',
          },
          {
            id: '3',
            name: 'Mariana Costa',
            birthDate: '1978-03-08',
            gender: 'female',
            cpf: '11122233344',
            phone: '11955556666',
            email: 'mariana@example.com',
            address: {
              street: 'Rua Augusta',
              number: '789',
              complement: '',
              neighborhood: 'Consolação',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01305-000',
            },
            observations: 'Hipertensa, toma losartana',
          },
          {
            id: '4',
            name: 'Roberto Santos',
            birthDate: '1965-12-25',
            gender: 'male',
            cpf: '55566677788',
            phone: '11944443333',
            email: 'roberto@example.com',
            address: {
              street: 'Rua Oscar Freire',
              number: '456',
              complement: 'Casa',
              neighborhood: 'Jardins',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01426-000',
            },
            observations: 'Diabético tipo 2',
          },
        ]);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Erro ao carregar pacientes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  const handleAddPatient = (patientData: Patient) => {
    // In a real app, this would be an API call
    setPatients([...patients, patientData]);
    setShowForm(false);
    toast.success('Paciente adicionado com sucesso');
  };

  const handleDeletePatient = (id: string) => {
    // Confirmation
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      // In a real app, this would be an API call
      setPatients(patients.filter(patient => patient.id !== id));
      toast.success('Paciente excluído com sucesso');
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
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os registros de pacientes da clínica
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Novo Paciente
        </button>
      </div>

      {showForm && (
        <PatientForm 
          onSubmit={handleAddPatient}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      <PatientList 
        patients={patients}
        onDelete={handleDeletePatient}
      />
    </div>
  );
};

export default Patients;