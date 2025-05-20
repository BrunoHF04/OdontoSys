export interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  cpf: string;
  phone: string;
  email: string;
  address: Address;
  observations: string;
}