import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormStateService } from '../../core/services/form-state.service';
import { AutosaveStatusComponent } from '../../shared/components/autosave-status/autosave-status.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-form-wizard',
  standalone: true,
  imports: [AsyncPipe, AutosaveStatusComponent, DynamicFormComponent],
  templateUrl: './form-wizard.component.html',
  styleUrl: './form-wizard.component.scss'
})
export class FormWizardComponent {
  private formStateService = inject(FormStateService);

  readonly selectedSchema$ = this.formStateService.selectedSchema$;
  readonly currentSection$ = this.formStateService.currentSection$;
  readonly isFirstSection$ = this.formStateService.isFirstSection$;
  readonly isLastSection$ = this.formStateService.isLastSection$;
  readonly isCurrentSectionValid$ = this.formStateService.isCurrentSectionValid$;

  onPrevious(): void {
    this.formStateService.previousSection();
  }

  onNext(): void {
    this.formStateService.nextSection();
  }

  onSubmit(): void {
    this.formStateService.submitForm();
  }
}