import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormStateService } from './core/services/form-state.service';
import { SchemaSelectionComponent } from './features/schema-selection/schema-selection.component';
import { FormWizardComponent } from './features/form-wizard/form-wizard.component';
import { FormSummaryComponent } from './features/form-summary/form-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe, 
    SchemaSelectionComponent, 
    FormWizardComponent, 
    FormSummaryComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private formStateService = inject(FormStateService);

  readonly selectedSchema$ = this.formStateService.selectedSchema$;
  readonly isSubmitted$ = this.formStateService.isSubmitted$;
}