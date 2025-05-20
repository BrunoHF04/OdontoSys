import { useState } from 'react';
import { FileText, Download, Trash2, Calendar, User } from 'lucide-react';
import { Document } from '../../types/Document';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
}

const DocumentList = ({ documents, onDelete }: DocumentListProps) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'protocol': 'Protocolo',
      'form': 'Formulário',
      'contract': 'Contrato',
      'manual': 'Manual',
      'other': 'Outro'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'protocol': 'bg-cyan-100 text-cyan-800',
      'form': 'bg-purple-100 text-purple-800',
      'contract': 'bg-amber-100 text-amber-800',
      'manual': 'bg-blue-100 text-blue-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white p-6 text-center rounded-lg shadow-sm">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece adicionando um novo documento.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid gap-6 p-6">
        {documents.map((document) => (
          <div
            key={document.id}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white rounded-lg">
                  <FileText className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {document.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {document.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
                      {getCategoryLabel(document.category)}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(document.uploadDate)}
                    </span>
                    <span className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      {document.createdBy.name}
                    </span>
                    <span className="text-gray-500">
                      {formatFileSize(document.fileSize)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(document.fileUrl, '_blank')}
                  className="p-2 text-gray-400 hover:text-cyan-500 transition-colors"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(document.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;