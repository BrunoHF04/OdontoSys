import { useState, useEffect } from 'react';
import { Bell, Calendar, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Appointment } from '../../types/Appointment';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Appointment[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchNotifications = async () => {
      // Mock data
      setNotifications([
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
          notes: 'Primeira consulta'
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
          notes: 'Tratamento de canal'
        }
      ]);
    };

    fetchNotifications();
  }, []);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'consultation': 'Consulta',
      'cleaning': 'Limpeza',
      'treatment': 'Tratamento',
      'surgery': 'Cirurgia',
      'emergency': 'Emergência'
    };
    return types[type] || type;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 relative"
      >
        <span className="sr-only">Ver notificações</span>
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Notificações</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Nenhuma notificação no momento
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      to="/appointments"
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-cyan-500 mt-0.5" />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {getTypeLabel(notification.type)}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Paciente: {notification.patientName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(notification.date)} às {formatTime(notification.time)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Dentista: {notification.dentistName}
                          </p>
                        </div>
                        {notification.status === 'scheduled' && (
                          <div className="ml-3 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pendente
                            </span>
                          </div>
                        )}
                        {notification.status === 'confirmed' && (
                          <div className="ml-3 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Confirmado
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}

                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      to="/appointments"
                      className="block text-center text-sm font-medium text-cyan-600 hover:text-cyan-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Ver todas as consultas
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;