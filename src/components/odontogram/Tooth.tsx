import { ToothData, ToothSection } from '../../types/Odontogram';

interface ToothProps {
  id: string;
  data?: ToothData;
  onSectionClick: (toothId: string, section: ToothSection) => void;
  isSelected: boolean;
}

const Tooth = ({ id, data, onSectionClick, isSelected }: ToothProps) => {
  const getSectionClass = (section: ToothSection) => {
    const baseClasses = "tooth-section";
    const action = data?.sections[section];

    if (!action) return baseClasses;

    // For extraction, crown, and root-canal, we'll check if any section has these actions
    // and apply them to all sections
    const fullToothActions = ['extraction', 'crown', 'root-canal'];
    const hasFullToothAction = Object.values(data.sections).some(a => 
      fullToothActions.includes(a)
    );

    if (hasFullToothAction) {
      const fullAction = Object.values(data.sections).find(a => 
        fullToothActions.includes(a)
      );
      
      const actionClasses: Record<string, string> = {
        'extraction': 'marked-extraction',
        'crown': 'marked-crown',
        'root-canal': 'marked-root-canal',
      };

      return `${baseClasses} ${actionClasses[fullAction || '']}`;
    }

    // For caries and restoration, apply only to the specific section
    const actionClasses: Record<string, string> = {
      'caries': 'marked-caries',
      'restoration': 'marked-restoration',
    };

    return `${baseClasses} ${actionClasses[action] || ''}`;
  };

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      className={`tooth ${isSelected ? 'stroke-cyan-600 stroke-2' : ''}`}
    >
      {/* Center */}
      <path
        d="M 30,30 L 70,30 L 70,70 L 30,70 Z"
        className={getSectionClass('center')}
        onClick={() => onSectionClick(id, 'center')}
      />
      
      {/* Top (Occlusal) */}
      <path
        d="M 30,10 L 70,10 L 70,30 L 30,30 Z"
        className={getSectionClass('top')}
        onClick={() => onSectionClick(id, 'top')}
      />
      
      {/* Bottom */}
      <path
        d="M 30,70 L 70,70 L 70,90 L 30,90 Z"
        className={getSectionClass('bottom')}
        onClick={() => onSectionClick(id, 'bottom')}
      />
      
      {/* Left (Mesial) */}
      <path
        d="M 10,30 L 30,30 L 30,70 L 10,70 Z"
        className={getSectionClass('left')}
        onClick={() => onSectionClick(id, 'left')}
      />
      
      {/* Right (Distal) */}
      <path
        d="M 70,30 L 90,30 L 90,70 L 70,70 Z"
        className={getSectionClass('right')}
        onClick={() => onSectionClick(id, 'right')}
      />
    </svg>
  );
};

export default Tooth;