export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'consultation' | 'cleaning' | 'treatment' | 'surgery' | 'emergency';
  notes?: string;
}