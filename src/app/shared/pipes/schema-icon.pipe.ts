import { Pipe, PipeTransform } from '@angular/core';

const SCHEMA_ICON_PATHS: Record<string, string> = {
  software: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
  hardware: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 3v2h8V5H8zm0 4v2h8V9H8zm0 4v2h8v-2H8z'
};

const GENERIC_ICON_PATH = 'M4 4h16v16H4V4zm2 2v12h12V6H6z';

@Pipe({
  name: 'schemaIcon',
  standalone: true
})
export class SchemaIconPipe implements PipeTransform {
  transform(label: string): string {
    return SCHEMA_ICON_PATHS[label?.toLowerCase()] ?? GENERIC_ICON_PATH;
  }
}
