import { Component, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormStateService } from '../../core/services/form-state.service';
import { AutosaveStatusComponent } from '../../shared/components/autosave-status/autosave-status.component';
import { SectionNavComponent } from '../../shared/components/section-nav/section-nav.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-form-wizard',
  standalone: true,
  imports: [AsyncPipe, AutosaveStatusComponent, SectionNavComponent, DynamicFormComponent],
  templateUrl: './form-wizard.component.html',
  styleUrl: './form-wizard.component.scss'
})
export class FormWizardComponent {
  @Input() schemaId!: string;

  private formStateService = inject(FormStateService);
  private router = inject(Router);

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
    this.router.navigate(['/form', this.schemaId, 'summary']);
  }
}