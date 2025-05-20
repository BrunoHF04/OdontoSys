import { useState } from 'react';
import { Calendar, Clock, User, UserCog, FileText, Check, X, Edit, Trash2 } from 'lucide-react';
import { Appointment } from '../../types/Appointment';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Appointment['status']) => void;
}

const AppointmentList = ({ appointments, onEdit, onDelete, onStatusChange }: AppointmentListProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedDate && appointment.date !== selectedDate) return false;
    if (selectedStatus && appointment.status !== selectedStatus) return false;
    return true;
  });

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-cyan-100 text-cyan-800';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Data
          </label>
          <input
            type="date"
            id="date-filter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Status
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-select"
          >
            <option value="">Todos</option>
            <option value="scheduled">Agendado</option>
            <option value="confirmed">Confirmado</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma consulta encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedDate || selectedStatus
                ? 'Tente ajustar os filtros de busca.'
                : 'Não há consultas agendadas.'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-full p-2 ${getStatusColor(appointment.status)}`}>
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {getTypeLabel(appointment.type)}
                      </h4>
                      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.duration} min
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(appointment)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(appointment.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    <span>Paciente: </span>
                    <span className="ml-1 text-gray-900">{appointment.patientName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserCog className="h-4 w-4 mr-2" />
                    <span>Dentista: </span>
                    <span className="ml-1 text-gray-900">{appointment.dentistName}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-4 flex items-start text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-2 mt-0.5" />
                    <p>{appointment.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </div>
                  <div className="flex space-x-2">
                    {appointment.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => onStatusChange(appointment.id, 'confirmed')}
                          className="btn btn-secondary flex items-center text-sm py-1"
                        >
                          <Check size={16} className="mr-1" />
                          Confirmar
                        </button>
                        <button
                          onClick={() => onStatusChange(appointment.id, 'cancelled')}
                          className="btn btn-danger flex items-center text-sm py-1"
                        >
                          <X size={16} className="mr-1" />
                          Cancelar
                        </button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => onStatusChange(appointment.id, 'completed')}
                        className="btn btn-primary flex items-center text-sm py-1"
                      >
                        <Check size={16} className="mr-1" />
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentList;