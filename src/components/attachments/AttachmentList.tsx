import { useState } from 'react';
import { Paperclip, FileText, Image, File, Trash2, Download } from 'lucide-react';
import { Attachment } from '../../types/Attachment';

interface AttachmentListProps {
  patientId: string;
  attachments: Attachment[];
  onDelete: (id: string) => void;
}

const AttachmentList = ({ patientId, attachments, onDelete }: AttachmentListProps) => {
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  if (attachments.length === 0) {
    return (
      <div className="bg-white p-6 text-center rounded-lg shadow-sm">
        <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum anexo</h3>
        <p className="mt-1 text-sm text-gray-500">
          Adicione documentos, radiografias ou outros arquivos relevantes para o paciente.
        </p>
      </div>
    );
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image size={20} className="text-cyan-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileText size={20} className="text-red-500" />;
    } else {
      return <File size={20} className="text-gray-500" />;
    }
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

  const handleAttachmentClick = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {attachments.map((attachment) => (
            <li 
              key={attachment.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAttachmentClick(attachment)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getFileIcon(attachment.fileType)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{attachment.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.fileSize)} • {formatDate(attachment.uploadDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(attachment.id);
                    }}
                    className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download functionality would go here
                    }}
                    className="text-gray-500 hover:text-cyan-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              {attachment.description && (
                <p className="mt-1 text-xs text-gray-600 ml-8">{attachment.description}</p>
              )}
              {attachment.associatedTooth && (
                <div className="mt-1 ml-8">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 text-cyan-800">
                    Dente {attachment.associatedTooth}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Attachment Viewer Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                {getFileIcon(selectedAttachment.fileType)}
                <span className="ml-2">{selectedAttachment.fileName}</span>
              </h3>
              <button
                onClick={() => setSelectedAttachment(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {selectedAttachment.fileType.startsWith('image/') ? (
                <img 
                  src={selectedAttachment.fileUrl} 
                  alt={selectedAttachment.fileName}
                  className="max-w-full h-auto mx-auto"
                />
              ) : selectedAttachment.fileType === 'application/pdf' ? (
                <div className="w-full h-full min-h-[500px]">
                  <iframe 
                    src={selectedAttachment.fileUrl} 
                    className="w-full h-full"
                    title={selectedAttachment.fileName}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <File size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Este tipo de arquivo não pode ser visualizado no navegador.
                  </p>
                  <button
                    className="mt-4 btn btn-primary"
                    onClick={() => {
                      // Download functionality would go here
                    }}
                  >
                    <Download size={16} className="mr-2" />
                    Baixar arquivo
                  </button>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Tamanho:</span> {formatFileSize(selectedAttachment.fileSize)}</p>
                <p><span className="font-medium">Data de upload:</span> {formatDate(selectedAttachment.uploadDate)}</p>
                {selectedAttachment.description && (
                  <p><span className="font-medium">Descrição:</span> {selectedAttachment.description}</p>
                )}
                {selectedAttachment.associatedTooth && (
                  <p><span className="font-medium">Dente associado:</span> {selectedAttachment.associatedTooth}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentList;