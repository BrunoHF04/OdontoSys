/*
  # Initial Database Schema

  1. New Tables
    - `users`
      - System users (admin, dentists, auxiliary staff, reception)
      - Uses Supabase Auth for authentication
    - `patients`
      - Patient records with personal info and medical history
    - `appointments`
      - Dental appointments and scheduling
    - `odontogram`
      - Dental chart records
    - `attachments`
      - Patient-related files (x-rays, documents, etc)
    - `documents`
      - Clinic documents (protocols, forms, etc)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  cpf text UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'dentist', 'auxiliary', 'reception')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  birth_date date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  cpf text UNIQUE,
  phone text NOT NULL,
  email text,
  street text,
  number text,
  complement text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  observations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  dentist_id uuid NOT NULL REFERENCES users(id),
  date date NOT NULL,
  time time NOT NULL,
  duration integer NOT NULL DEFAULT 30,
  status text NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  type text NOT NULL CHECK (type IN ('consultation', 'cleaning', 'treatment', 'surgery', 'emergency')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Odontogram table
CREATE TABLE IF NOT EXISTS odontogram (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number text NOT NULL,
  section text NOT NULL CHECK (section IN ('top', 'bottom', 'left', 'right', 'center')),
  condition text NOT NULL CHECK (condition IN ('caries', 'extraction', 'restoration', 'crown', 'root-canal')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(patient_id, tooth_number, section)
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  file_url text NOT NULL,
  description text,
  associated_tooth text,
  uploaded_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('protocol', 'form', 'contract', 'manual', 'other')),
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  file_url text NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE odontogram ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Patients policies
CREATE POLICY "All authenticated users can view patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage patients"
  ON patients
  USING (auth.jwt() ->> 'role' IN ('admin', 'dentist', 'reception'));

-- Appointments policies
CREATE POLICY "All authenticated users can view appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dentists can manage their own appointments"
  ON appointments
  USING (
    auth.jwt() ->> 'role' = 'dentist' 
    AND dentist_id = auth.uid()
  );

CREATE POLICY "Admin and reception can manage all appointments"
  ON appointments
  USING (auth.jwt() ->> 'role' IN ('admin', 'reception'));

-- Odontogram policies
CREATE POLICY "All authenticated users can view odontogram"
  ON odontogram
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dentists can manage odontogram"
  ON odontogram
  USING (auth.jwt() ->> 'role' IN ('admin', 'dentist'));

-- Attachments policies
CREATE POLICY "All authenticated users can view attachments"
  ON attachments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage attachments"
  ON attachments
  USING (auth.jwt() ->> 'role' IN ('admin', 'dentist', 'auxiliary'));

-- Documents policies
CREATE POLICY "All authenticated users can view documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage documents"
  ON documents
  USING (auth.jwt() ->> 'role' = 'admin');

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();