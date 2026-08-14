import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormStateService } from '../../../core/services/form-state.service';

@Component({
  selector: 'app-section-nav',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './section-nav.component.html',
  styleUrl: './section-nav.component.scss'
})
export class SectionNavComponent {
  private formStateService = inject(FormStateService);

  readonly sectionNavItems$ = combineLatest([
    this.formStateService.selectedSchema$,
    this.formStateService.currentSectionIndex$
  ]).pipe(
    map(([schema, currentIndex]) => schema?.sections.map((section, index) => ({
      id: section.id,
      title: section.title,
      index,
      isActive: index === currentIndex
    })) ?? [])
  );

  onSelectSection(index: number): void {
    this.formStateService.goToSection(index);
  }
}
