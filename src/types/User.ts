export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: 'admin' | 'dentist' | 'auxiliary' | 'reception';
  active: boolean;
  password?: string;
}