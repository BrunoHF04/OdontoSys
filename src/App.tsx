import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import OdontogramPage from './pages/OdontogramPage';
import Appointments from './pages/Appointments';
import Documents from './pages/Documents';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/:id" element={<PatientDetail />} />
            <Route path="patients/:id/odontogram" element={<OdontogramPage />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="documents" element={<Documents />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white text-gray-900',
        }} 
      />
    </AuthProvider>
  );
}

export default App;