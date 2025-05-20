export interface Document {
  id: string;
  title: string;
  description: string;
  category: 'protocol' | 'form' | 'contract' | 'manual' | 'other';
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  lastModified: string;
  createdBy: {
    id: string;
    name: string;
  };
}