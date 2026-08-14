import { Routes } from '@angular/router';
import { schemaSelectedGuard } from './core/guards/schema-selected.guard';
import { submittedGuard } from './core/guards/submitted.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/schema-selection/schema-selection.component').then(m => m.SchemaSelectionComponent)
  },
  {
    path: 'form/:schemaId',
    loadComponent: () =>
      import('./features/form-wizard/form-wizard.component').then(m => m.FormWizardComponent),
    canActivate: [schemaSelectedGuard]
  },
  {
    path: 'form/:schemaId/summary',
    loadComponent: () =>
      import('./features/form-summary/form-summary.component').then(m => m.FormSummaryComponent),
    canActivate: [schemaSelectedGuard, submittedGuard]
  },
  { path: '**', redirectTo: '' }
];
