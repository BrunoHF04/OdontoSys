export type ToothSection = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface ToothData {
  sections: Record<ToothSection, string>;
  notes: string;
}