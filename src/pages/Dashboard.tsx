import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ClipboardList, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Appointment } from '../types/Appointment';

interface DashboardCounts {
  totalPatients: number;
  upcomingAppointments: number;
  pendingTreatments: number;
  recentPatients: {
    id: string;
    name: string;
    lastVisit: string;
  }[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<DashboardCounts>({
    totalPatients: 0,
    upcomingAppointments: 0,
    pendingTreatments: 0,
    recentPatients: []
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setCounts({
          totalPatients: 48,
          upcomingAppointments: 12,
          pendingTreatments: 8,
          recentPatients: [
            { id: '1', name: 'Ana Silva', lastVisit: '2023-07-15' },
            { id: '2', name: 'Carlos Pereira', lastVisit: '2023-07-14' },
            { id: '3', name: 'Mariana Costa', lastVisit: '2023-07-12' },
            { id: '4', name: 'Roberto Santos', lastVisit: '2023-07-10' },
          ]
        });

        // Mock today's appointments
        setTodayAppointments([
          {
            id: '1',
            patientId: '1',
            patientName: 'João Silva',
            dentistId: '1',
            dentistName: 'Dr. Carlos Silva',
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            duration: 30,
            status: 'scheduled',
            type: 'consultation',
            notes: 'Primeira consulta'
          },
          {
            id: '2',
            patientId: '2',
            patientName: 'Maria Oliveira',
            dentistId: '2',
            dentistName: 'Dra. Ana Santos',
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            duration: 60,
            status: 'confirmed',
            type: 'treatment',
            notes: 'Tratamento de canal'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: Appointment['type']) => {
    switch (type) {
      case 'consultation':
        return 'Consulta';
      case 'cleaning':
        return 'Limpeza';
      case 'treatment':
        return 'Tratamento';
      case 'surgery':
        return 'Cirurgia';
      case 'emergency':
        return 'Emergência';
      default:
        return type;
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bem-vindo(a), {user?.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Resumo da clínica e próximas atividades</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center">
          <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-cyan-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Pacientes</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{counts.totalPatients}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <Calendar className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Consultas Agendadas</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{counts.upcomingAppointments}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <ClipboardList className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tratamentos Pendentes</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{counts.pendingTreatments}</p>
          </div>
        </div>
      </div>

      {/* Recent patients */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Pacientes Recentes</h3>
          <Link
            to="/patients"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-500 flex items-center"
          >
            Ver todos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {counts.recentPatients.map(patient => (
              <li key={patient.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="avatar">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">Última visita: {formatDate(patient.lastVisit)}</p>
                  </div>
                </div>
                <Link
                  to={`/patients/${patient.id}`}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm 
                    leading-4 font-medium rounded-md text-cyan-700 bg-cyan-100 hover:bg-cyan-200 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Detalhes
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Today's appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Consultas de Hoje</h3>
          <Link
            to="/appointments"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-500 flex items-center"
          >
            Ver agenda completa
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {todayAppointments.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-6 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sem consultas para hoje</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há consultas agendadas para o dia de hoje.
            </p>
            <div className="mt-6">
              <Link
                to="/appointments"
                className="btn btn-primary"
              >
                Agendar Nova Consulta
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.time} - {getTypeLabel(appointment.type)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Paciente: {appointment.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dentista: {appointment.dentistName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;