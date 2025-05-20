import { useState, useEffect } from 'react';
import { ToothData, ToothSection } from '../../types/Odontogram';
import Tooth from './Tooth';
import ToothActions from './ToothActions';

interface OdontogramProps {
  patientId: string;
  initialData?: Record<string, ToothData>;
  onSave: (data: Record<string, ToothData>) => void;
}

const Odontogram = ({ patientId, initialData = {}, onSave }: OdontogramProps) => {
  const [teethData, setTeethData] = useState<Record<string, ToothData>>(initialData);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<ToothSection | null>(null);
  const [isAdultMode, setIsAdultMode] = useState(true);
  
  // Define the tooth numbers for adult dentition
  const adultTeeth = {
    upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
    upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
    lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
    lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38]
  };

  // Define the tooth numbers for child dentition
  const childTeeth = {
    upperRight: [55, 54, 53, 52, 51],
    upperLeft: [61, 62, 63, 64, 65],
    lowerRight: [85, 84, 83, 82, 81],
    lowerLeft: [71, 72, 73, 74, 75]
  };

  // Use the appropriate set of teeth
  const teeth = isAdultMode ? adultTeeth : childTeeth;
  
  const handleToothClick = (toothId: string, section: ToothSection) => {
    setSelectedTooth(toothId);
    setSelectedSection(section);
  };
  
  const handleActionSelect = (action: string) => {
    if (!selectedTooth || !selectedSection) return;
    
    const updatedTeethData = { ...teethData };
    
    if (!updatedTeethData[selectedTooth]) {
      updatedTeethData[selectedTooth] = {
        sections: {},
        notes: ''
      };
    }
    
    // Toggle the action off if it's already applied
    if (updatedTeethData[selectedTooth].sections[selectedSection] === action) {
      delete updatedTeethData[selectedTooth].sections[selectedSection];
    } else {
      updatedTeethData[selectedTooth].sections[selectedSection] = action;
    }
    
    setTeethData(updatedTeethData);
    onSave(updatedTeethData);
  };
  
  const handleNotesChange = (notes: string) => {
    if (!selectedTooth) return;
    
    const updatedTeethData = { ...teethData };
    
    if (!updatedTeethData[selectedTooth]) {
      updatedTeethData[selectedTooth] = {
        sections: {},
        notes: notes
      };
    } else {
      updatedTeethData[selectedTooth].notes = notes;
    }
    
    setTeethData(updatedTeethData);
    onSave(updatedTeethData);
  };
  
  const handleCloseActions = () => {
    setSelectedTooth(null);
    setSelectedSection(null);
  };

  return (
    <div className="bg-dark-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Odontograma</h2>
        <div className="flex items-center">
          <span className="mr-3 text-sm text-gray-300">Dentição:</span>
          <div className="flex items-center space-x-1 p-1 bg-dark-700 rounded-lg">
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                isAdultMode ? 'bg-dark-600 text-cyan-400' : 'text-gray-300 hover:bg-dark-600'
              }`}
              onClick={() => setIsAdultMode(true)}
            >
              Adulto
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                !isAdultMode ? 'bg-dark-600 text-cyan-400' : 'text-gray-300 hover:bg-dark-600'
              }`}
              onClick={() => setIsAdultMode(false)}
            >
              Infantil
            </button>
          </div>
        </div>
      </div>

      {/* Upper teeth */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-8 gap-2">
          {teeth.upperRight.map((toothNumber) => (
            <div key={toothNumber} className="flex flex-col items-center">
              <div className="text-xs text-gray-400 mb-1">{toothNumber}</div>
              <Tooth 
                id={toothNumber.toString()} 
                data={teethData[toothNumber.toString()]} 
                onSectionClick={handleToothClick}
                isSelected={selectedTooth === toothNumber.toString()} 
              />
            </div>
          ))}
          {teeth.upperLeft.map((toothNumber) => (
            <div key={toothNumber} className="flex flex-col items-center">
              <div className="text-xs text-gray-400 mb-1">{toothNumber}</div>
              <Tooth 
                id={toothNumber.toString()} 
                data={teethData[toothNumber.toString()]} 
                onSectionClick={handleToothClick}
                isSelected={selectedTooth === toothNumber.toString()} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lower teeth */}
      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-2">
          {teeth.lowerRight.map((toothNumber) => (
            <div key={toothNumber} className="flex flex-col items-center">
              <Tooth 
                id={toothNumber.toString()} 
                data={teethData[toothNumber.toString()]} 
                onSectionClick={handleToothClick}
                isSelected={selectedTooth === toothNumber.toString()} 
              />
              <div className="text-xs text-gray-400 mt-1">{toothNumber}</div>
            </div>
          ))}
          {teeth.lowerLeft.map((toothNumber) => (
            <div key={toothNumber} className="flex flex-col items-center">
              <Tooth 
                id={toothNumber.toString()} 
                data={teethData[toothNumber.toString()]} 
                onSectionClick={handleToothClick}
                isSelected={selectedTooth === toothNumber.toString()} 
              />
              <div className="text-xs text-gray-400 mt-1">{toothNumber}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 border-t border-dark-700 pt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Legenda</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-400 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-300">Cárie</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-300">Extração</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-300">Restauração</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-300">Coroa</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-300">Tratamento de canal</span>
          </div>
        </div>
      </div>

      {/* Actions Modal */}
      {selectedTooth && selectedSection && (
        <ToothActions
          toothId={selectedTooth}
          section={selectedSection}
          currentAction={teethData[selectedTooth]?.sections[selectedSection] || ''}
          notes={teethData[selectedTooth]?.notes || ''}
          onActionSelect={handleActionSelect}
          onNotesChange={handleNotesChange}
          onClose={handleCloseActions}
        />
      )}
    </div>
  );
};

export default Odontogram;