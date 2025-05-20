// Previous imports remain the same...

const PatientDetail = () => {
  // Previous state and handlers remain the same...

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        {/* Previous header content remains the same */}
      </div>

      <div className="bg-dark-800 shadow-lg rounded-lg overflow-hidden">
        {/* Previous tabs and content structure remains the same */}
        
        {/* Update the treatment cards section */}
        <div className="border-t border-dark-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Tratamentos e Registros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to={`/patients/${patient.id}/odontogram`}
              className="bg-dark-700 p-6 rounded-lg hover:bg-dark-600 transition-colors flex items-center"
            >
              <div className="h-12 w-12 rounded-full bg-cyan-900 flex items-center justify-center mr-4">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 6c-1.7-2.3-3-3-6-3s-4.3.7-6 3c3 3 6 4.3 12 7.5 6-3.2 9-4.5 12-7.5-2.3-2.3-3-3-6-3s-4.3.7-6 3Z" />
                  <path d="M12 6v16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100">Odontograma</h3>
                <p className="text-sm text-gray-400">Ver e editar odontograma do paciente</p>
              </div>
            </Link>
            
            <Link
              to="/appointments"
              className="bg-dark-700 p-6 rounded-lg hover:bg-dark-600 transition-colors flex items-center"
            >
              <div className="h-12 w-12 rounded-full bg-amber-900 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100">Consultas</h3>
                <p className="text-sm text-gray-400">Histórico e agendamento de consultas</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;