import { useState, useEffect } from 'react';
import { FileUp, Search, Filter } from 'lucide-react';
import DocumentList from '../components/documents/DocumentList';
import DocumentUpload from '../components/documents/DocumentUpload';
import { Document } from '../types/Document';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDocuments = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setDocuments([
          {
            id: '1',
            title: 'Protocolo de Biossegurança',
            description: 'Procedimentos e normas de biossegurança da clínica',
            category: 'protocol',
            fileUrl: 'https://example.com/docs/biosafety.pdf',
            fileName: 'protocolo-biosseguranca.pdf',
            fileType: 'application/pdf',
            fileSize: 2.5 * 1024 * 1024, // 2.5MB
            uploadDate: '2024-01-15T10:30:00Z',
            lastModified: '2024-01-15T10:30:00Z',
            createdBy: {
              id: '1',
              name: 'Admin'
            }
          },
          {
            id: '2',
            title: 'Termo de Consentimento - Clareamento',
            description: 'Formulário de consentimento para procedimento de clareamento dental',
            category: 'form',
            fileUrl: 'https://example.com/docs/consent-whitening.pdf',
            fileName: 'termo-consentimento-clareamento.pdf',
            fileType: 'application/pdf',
            fileSize: 1.2 * 1024 * 1024, // 1.2MB
            uploadDate: '2024-01-10T14:20:00Z',
            lastModified: '2024-01-10T14:20:00Z',
            createdBy: {
              id: '2',
              name: 'Dr. Carlos Silva'
            }
          },
          {
            id: '3',
            title: 'Manual de Procedimentos',
            description: 'Manual com procedimentos padrão da clínica',
            category: 'manual',
            fileUrl: 'https://example.com/docs/procedures.pdf',
            fileName: 'manual-procedimentos.pdf',
            fileType: 'application/pdf',
            fileSize: 5.8 * 1024 * 1024, // 5.8MB
            uploadDate: '2024-01-05T09:15:00Z',
            lastModified: '2024-01-05T09:15:00Z',
            createdBy: {
              id: '1',
              name: 'Admin'
            }
          }
        ]);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Erro ao carregar documentos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleAddDocument = (document: Document) => {
    setDocuments([...documents, document]);
    setShowUpload(false);
    toast.success('Documento adicionado com sucesso');
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Documento excluído com sucesso');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie documentos, protocolos e formulários da clínica
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn btn-primary flex items-center"
        >
          <FileUp className="mr-2 h-5 w-5" />
          Novo Documento
        </button>
      </div>

      {showUpload && (
        <DocumentUpload
          onUpload={handleAddDocument}
          onCancel={() => setShowUpload(false)}
        />
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="">Todas as categorias</option>
            <option value="protocol">Protocolos</option>
            <option value="form">Formulários</option>
            <option value="contract">Contratos</option>
            <option value="manual">Manuais</option>
            <option value="other">Outros</option>
          </select>
        </div>
      </div>

      <DocumentList
        documents={filteredDocuments}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
};

export default Documents;