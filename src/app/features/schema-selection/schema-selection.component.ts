import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormSchema } from '../../core/models/form-schema.model';
import { MockApiService } from '../../core/services/mock-api.service';
import { FormStateService } from '../../core/services/form-state.service';

type SchemasState =
  | { status: 'loading' }
  | { status: 'success'; schemas: FormSchema[] }
  | { status: 'error' };

@Component({
  selector: 'app-schema-selection',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './schema-selection.component.html',
  styleUrl: './schema-selection.component.scss'
})
export class SchemaSelectionComponent {
  private mockApiService = inject(MockApiService);
  private formStateService = inject(FormStateService);

  private readonly reload$ = new BehaviorSubject<void>(undefined);

  readonly schemasState$: Observable<SchemasState> = this.reload$.pipe(
    switchMap(() => this.mockApiService.getSchemas().pipe(
      map((schemas): SchemasState => ({ status: 'success', schemas })),
      catchError(() => of<SchemasState>({ status: 'error' })),
      startWith<SchemasState>({ status: 'loading' })
    ))
  );

  selectedSchema: FormSchema | null = null;

  selectSchema(schema: FormSchema): void {
    this.selectedSchema = schema;
  }

  onStart(): void {
    if (this.selectedSchema) {
      this.formStateService.setSchema(this.selectedSchema);
    }
  }

  retry(): void {
    this.reload$.next();
  }
}