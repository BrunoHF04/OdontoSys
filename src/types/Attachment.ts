export interface Attachment {
  id: string;
  patientId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
  description: string;
  associatedTooth?: string;
}