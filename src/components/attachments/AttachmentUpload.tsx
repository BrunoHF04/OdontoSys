import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Attachment } from '../../types/Attachment';

interface AttachmentUploadProps {
  patientId: string;
  onUpload: (attachment: Attachment) => void;
}

const AttachmentUpload = ({ patientId, onUpload }: AttachmentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [associatedSmile, setAssociatedSmile] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // In a real application, this would be an API call to upload the file
      // For now, we'll simulate it
      
      // Create a fake URL for demo purposes
      const fakeUrl = URL.createObjectURL(file);
      
      const newAttachment: Attachment = {
        id: crypto.randomUUID(),
        patientId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: fakeUrl,
        uploadDate: new Date().toISOString(),
        description,
        associatedSmile: associatedSmile || undefined
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpload(newAttachment);
      
      // Reset form
      setFile(null);
      setDescription('');
      setAssociatedSmile('');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setDescription('');
    setAssociatedSmile('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Adicionar Anexo
      </h3>
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 
            ${dragActive ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
                <span>Selecionar arquivo</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              ou arraste e solte aqui
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, PDF até 10MB
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center overflow-hidden">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
              onClick={handleCancel}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                className="mt-1 form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição opcional do arquivo..."
              />
            </div>
            
            <div>
              <label htmlFor="associated-tooth" className="block text-sm font-medium text-gray-700">
                Dente Associado (opcional)
              </label>
              <input
                type="text"
                id="associated-tooth"
                name="associated-tooth"
                className="mt-1 form-input"
                value={associatedSmile}
                onChange={(e) => setAssociatedSmile(e.target.value)}
                placeholder="Ex: 18"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`btn btn-primary ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Enviando...' : 'Enviar Arquivo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentUpload;