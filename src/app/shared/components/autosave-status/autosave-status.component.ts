import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormStateService } from '../../../core/services/form-state.service';
import { SaveStatus } from '../../../core/models/form-schema.model';

@Component({
  selector: 'app-autosave-status',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './autosave-status.component.html',
  styleUrl: './autosave-status.component.scss'
})
export class AutosaveStatusComponent {
  private formStateService = inject(FormStateService);

  readonly SaveStatus = SaveStatus;
  readonly saveStatus$ = this.formStateService.saveStatus$;

  getStatusClass(status: SaveStatus): string {
    switch (status) {
      case SaveStatus.Saving: return 'status-saving';
      case SaveStatus.Saved: return 'status-saved';
      case SaveStatus.Error: return 'status-error';
      default: return '';
    }
  }
}