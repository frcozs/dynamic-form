import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormStateService } from '../../core/services/form-state.service';
import { FormFieldSchema } from '../../core/models/form-schema.model';

@Component({
  selector: 'app-form-summary',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './form-summary.component.html',
  styleUrl: './form-summary.component.scss'
})
export class FormSummaryComponent {
  private formStateService = inject(FormStateService);
  private router = inject(Router);

  readonly summaryItems$ = combineLatest([
    this.formStateService.selectedSchema$,
    this.formStateService.formData$
  ]).pipe(
    map(([schema, formData]) => {
      if (!schema) return [];

      const allFields = schema.sections.reduce<FormFieldSchema[]>(
        (acc, section) => acc.concat(section.fields),
        []
      );

      return allFields.map(field => {
        const rawValue = formData[field.id];
        let formattedValue = '—';

        if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
          if (field.type === 'toggle') {
            formattedValue = rawValue ? 'Yes' : 'No';
          } else {
            formattedValue = String(rawValue);
          }
        }

        return {
          label: field.label,
          value: formattedValue
        };
      });
    })
  );

  onCompleteAndReset(): void {
    this.formStateService.resetState();
    this.router.navigate(['/']);
  }
}