import { Pipe, PipeTransform } from '@angular/core';
import { FormSchema } from '../../core/models/form-schema.model';

@Pipe({
  name: 'schemaLabel',
  standalone: true
})
export class SchemaLabelPipe implements PipeTransform {
  transform(schema: FormSchema): string {
    return schema.shortLabel ?? schema.title;
  }
}
