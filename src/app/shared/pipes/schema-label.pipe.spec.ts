import { SchemaLabelPipe } from './schema-label.pipe';
import { FormSchema } from '../../core/models/form-schema.model';

describe('SchemaLabelPipe', () => {
  const pipe = new SchemaLabelPipe();

  it('should return shortLabel when present', () => {
    const schema: FormSchema = { id: 'a', title: 'Software Request', shortLabel: 'Software', sections: [] };
    expect(pipe.transform(schema)).toBe('Software');
  });

  it('should fall back to title when shortLabel is absent', () => {
    const schema: FormSchema = { id: 'a', title: 'Furniture Request', sections: [] };
    expect(pipe.transform(schema)).toBe('Furniture Request');
  });
});
