import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Appointment } from '../../types/Appointment';
import { User } from '../../types/User';
import { Patient } from '../../types/Patient';

interface AppointmentFormProps {
  initialValues?: Appointment;
  onSubmit: (appointment: Appointment) => void;
  onCancel: () => void;
  dentists: User[];
  patients: Patient[];
}

const AppointmentForm = ({ initialValues, onSubmit, onCancel, dentists, patients }: AppointmentFormProps) => {
  const [formData, setFormData] = useState<Omit<Appointment, 'id'> & { id?: string }>({
    patientId: '',
    patientName: '',
    dentistId: '',
    dentistName: '',
    date: '',
    time: '',
    duration: 30,
    status: 'scheduled',
    type: 'consultation',
    notes: '',
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

    if (name === 'patientId') {
      const patient = patients.find(p => p.id === value);
      setFormData(prev => ({
        ...prev,
        patientId: value,
        patientName: patient?.name || '',
      }));
    } else if (name === 'dentistId') {
      const dentist = dentists.find(d => d.id === value);
      setFormData(prev => ({
        ...prev,
        dentistId: value,
        dentistName: dentist?.name || '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Paciente é obrigatório';
    }

    if (!formData.dentistId) {
      newErrors.dentistId = 'Dentista é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const appointmentData: Appointment = {
        id: formData.id || crypto.randomUUID(),
        patientId: formData.patientId,
        patientName: formData.patientName,
        dentistId: formData.dentistId,
        dentistName: formData.dentistName,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        status: formData.status,
        type: formData.type,
        notes: formData.notes,
      };

      onSubmit(appointmentData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Editar Consulta' : 'Nova Consulta'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                Paciente <span className="text-red-500">*</span>
              </label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className={`mt-1 form-select ${errors.patientId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Selecione um paciente</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
              )}
            </div>

            <div>
              <label htmlFor="dentistId" className="block text-sm font-medium text-gray-700">
                Dentista <span className="text-red-500">*</span>
              </label>
              <select
                id="dentistId"
                name="dentistId"
                value={formData.dentistId}
                onChange={handleChange}
                className={`mt-1 form-select ${errors.dentistId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Selecione um dentista</option>
                {dentists.map(dentist => (
                  <option key={dentist.id} value={dentist.id}>
                    {dentist.name}
                  </option>
                ))}
              </select>
              {errors.dentistId && (
                <p className="mt-1 text-sm text-red-600">{errors.dentistId}</p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`mt-1 form-input ${errors.date ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Horário <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`mt-1 form-input ${errors.time ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duração (minutos)
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 form-select"
              >
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1 hora e 30 minutos</option>
                <option value="120">2 horas</option>
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Tipo de Consulta
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 form-select"
              >
                <option value="consultation">Consulta</option>
                <option value="cleaning">Limpeza</option>
                <option value="treatment">Tratamento</option>
                <option value="surgery">Cirurgia</option>
                <option value="emergency">Emergência</option>
              </select>
            </div>

            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 form-input"
                placeholder="Observações adicionais sobre a consulta..."
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
              {isEditing ? 'Salvar Alterações' : 'Agendar Consulta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;