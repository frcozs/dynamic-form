export type FieldType = 'text' | 'number' | 'radio' | 'toggle';

export enum SaveStatus {
  Idle = 'idle',
  Saving = 'Saving...',
  Saved = 'Saved',
  Error = 'Error – retrying...'
}

export interface FormFieldSchema {
  id: number;
  label: string;
  type: FieldType;
  required?: boolean;
  default?: string | number | boolean;
  options?: string[];
}

export interface FormSectionSchema {
  id: string;
  title: string;
  fields: FormFieldSchema[];
}

export interface FormSchema {
  id: string;
  title: string;
  sections: FormSectionSchema[];
}

export interface QuestionSavePayload {
  requestId: string;
  questionId: number;
  value: unknown;
}