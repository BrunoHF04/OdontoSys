import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Document } from '../../types/Document';
import { useAuth } from '../../hooks/useAuth';

interface DocumentUploadProps {
  onUpload: (document: Document) => void;
  onCancel: () => void;
}

const DocumentUpload = ({ onUpload, onCancel }: DocumentUploadProps) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Document['category']>('other');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!file) {
      newErrors.file = 'Arquivo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (!file || !user) return;
    
    setIsUploading(true);
    
    try {
      // In a real app, this would be an API call to upload the file
      // For now, we'll simulate it with a fake URL
      const fakeUrl = URL.createObjectURL(file);
      
      const newDocument: Document = {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        fileUrl: fakeUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        createdBy: {
          id: user.id,
          name: user.name
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpload(newDocument);
    } catch (error) {
      console.error('Error uploading document:', error);
      setErrors({ submit: 'Erro ao fazer upload do documento' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-dark-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-100">
          Novo Documento
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 form-input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Descrição
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 form-input"
              placeholder="Descrição opcional do documento..."
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Document['category'])}
              className="mt-1 form-select"
            >
              <option value="protocol">Protocolo</option>
              <option value="form">Formulário</option>
              <option value="contract">Contrato</option>
              <option value="manual">Manual</option>
              <option value="other">Outro</option>
            </select>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 
            ${dragActive ? 'border-cyan-500 bg-cyan-50/5' : 'border-dark-600'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="btn btn-secondary cursor-pointer">
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
              <p className="mt-2 text-sm text-gray-400">
                ou arraste e solte aqui
              </p>
              {errors.file && (
                <p className="mt-1 text-sm text-red-600">{errors.file}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-dark-800 rounded-lg">
                  <FileText className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`btn btn-primary ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Enviando...' : 'Enviar Documento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;