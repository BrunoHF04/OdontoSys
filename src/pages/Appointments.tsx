import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Appointment } from '../types/Appointment';
import { User } from '../types/User';
import { Patient } from '../types/Patient';
import AppointmentList from '../components/appointments/AppointmentList';
import AppointmentForm from '../components/appointments/AppointmentForm';
import toast from 'react-hot-toast';

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dentists, setDentists] = useState<User[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock dentists data
        setDentists([
          {
            id: '1',
            name: 'Dr. Carlos Silva',
            email: 'carlos@example.com',
            cpf: '12345678900',
            role: 'dentist',
            active: true,
          },
          {
            id: '2',
            name: 'Dra. Ana Santos',
            email: 'ana@example.com',
            cpf: '98765432100',
            role: 'dentist',
            active: true,
          },
        ]);

        // Mock patients data
        setPatients([
          {
            id: '1',
            name: 'João Silva',
            birthDate: '1990-05-15',
            gender: 'male',
            cpf: '11122233344',
            phone: '11999998888',
            email: 'joao@example.com',
            address: {
              street: 'Rua A',
              number: '123',
              complement: '',
              neighborhood: 'Centro',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01234-567',
            },
            observations: '',
          },
          {
            id: '2',
            name: 'Maria Oliveira',
            birthDate: '1985-10-20',
            gender: 'female',
            cpf: '44455566677',
            phone: '11977776666',
            email: 'maria@example.com',
            address: {
              street: 'Rua B',
              number: '456',
              complement: 'Apto 123',
              neighborhood: 'Jardins',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '04567-890',
            },
            observations: '',
          },
        ]);

        // Mock appointments data
        setAppointments([
          {
            id: '1',
            patientId: '1',
            patientName: 'João Silva',
            dentistId: '1',
            dentistName: 'Dr. Carlos Silva',
            date: '2024-03-20',
            time: '09:00',
            duration: 30,
            status: 'scheduled',
            type: 'consultation',
            notes: 'Primeira consulta',
          },
          {
            id: '2',
            patientId: '2',
            patientName: 'Maria Oliveira',
            dentistId: '2',
            dentistName: 'Dra. Ana Santos',
            date: '2024-03-20',
            time: '10:00',
            duration: 60,
            status: 'confirmed',
            type: 'treatment',
            notes: 'Tratamento de canal',
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddAppointment = (appointmentData: Appointment) => {
    // In a real app, this would be an API call
    setAppointments([...appointments, appointmentData]);
    setShowForm(false);
    toast.success('Consulta agendada com sucesso');
  };

  const handleEditAppointment = (appointmentData: Appointment) => {
    // In a real app, this would be an API call
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentData.id ? appointmentData : appointment
    );
    setAppointments(updatedAppointments);
    setEditingAppointment(null);
    toast.success('Consulta atualizada com sucesso');
  };

  const handleDeleteAppointment = (id: string) => {
    // Confirmation
    if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
      // In a real app, this would be an API call
      setAppointments(appointments.filter(appointment => appointment.id !== id));
      toast.success('Consulta excluída com sucesso');
    }
  };

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    // In a real app, this would be an API call
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status } : appointment
    );
    setAppointments(updatedAppointments);
    toast.success('Status da consulta atualizado');
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
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as consultas e procedimentos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          Nova Consulta
        </button>
      </div>

      {(showForm || editingAppointment) && (
        <AppointmentForm
          initialValues={editingAppointment || undefined}
          onSubmit={editingAppointment ? handleEditAppointment : handleAddAppointment}
          onCancel={() => {
            setShowForm(false);
            setEditingAppointment(null);
          }}
          dentists={dentists}
          patients={patients}
        />
      )}

      <AppointmentList
        appointments={appointments}
        onEdit={(appointment) => setEditingAppointment(appointment)}
        onDelete={handleDeleteAppointment}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Appointments;