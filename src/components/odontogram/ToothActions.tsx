import { useState } from 'react';
import { X } from 'lucide-react';
import { ToothSection } from '../../types/Odontogram';

interface ToothActionsProps {
  toothId: string;
  section: ToothSection;
  currentAction: string;
  notes: string;
  onActionSelect: (action: string) => void;
  onNotesChange: (notes: string) => void;
  onClose: () => void;
}

const ToothActions = ({
  toothId,
  section,
  currentAction,
  notes,
  onActionSelect,
  onNotesChange,
  onClose
}: ToothActionsProps) => {
  const [activeTab, setActiveTab] = useState<'actions' | 'notes'>('actions');
  const [notesValue, setNotesValue] = useState(notes);

  const sectionLabels: Record<ToothSection, string> = {
    'top': 'Oclusal',
    'bottom': 'Cervical',
    'left': 'Mesial',
    'right': 'Distal',
    'center': 'Central'
  };

  const handleNotesSubmit = () => {
    onNotesChange(notesValue);
  };

  const actions = [
    { id: 'caries', label: 'Cárie', color: 'bg-amber-400' },
    { id: 'extraction', label: 'Extração', color: 'bg-red-500' },
    { id: 'restoration', label: 'Restauração', color: 'bg-blue-500' },
    { id: 'crown', label: 'Coroa', color: 'bg-purple-500' },
    { id: 'root-canal', label: 'Tratamento de canal', color: 'bg-green-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Dente {toothId} - {sectionLabels[section]}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`tab ${activeTab === 'actions' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              Ações
            </button>
            <button
              className={`tab ${activeTab === 'notes' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Observações
            </button>
          </nav>
        </div>

        <div className="px-6 py-4">
          {activeTab === 'actions' ? (
            <div className="space-y-3">
              {actions.map(action => (
                <div key={action.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`action-${action.id}`}
                    name="tooth-action"
                    checked={currentAction === action.id}
                    onChange={() => onActionSelect(action.id)}
                    className="form-checkbox"
                  />
                  <label htmlFor={`action-${action.id}`} className="ml-3 flex items-center">
                    <div className={`w-4 h-4 ${action.color} rounded-sm mr-2`}></div>
                    <span className="text-sm text-gray-700">{action.label}</span>
                  </label>
                </div>
              ))}
              
              <div className="flex items-center mt-4">
                <input
                  type="radio"
                  id="action-none"
                  name="tooth-action"
                  checked={!currentAction}
                  onChange={() => onActionSelect('')}
                  className="form-checkbox"
                />
                <label htmlFor="action-none" className="ml-3 text-sm text-gray-700">
                  Nenhuma condição
                </label>
              </div>
            </div>
          ) : (
            <div>
              <textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                className="form-input w-full h-32"
                placeholder="Adicione observações específicas sobre este dente..."
              />
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={handleNotesSubmit}
                  className="btn btn-primary"
                >
                  Salvar observações
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToothActions;