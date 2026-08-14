import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionNavComponent } from './section-nav.component';
import { FormStateService } from '../../../core/services/form-state.service';
import { FormSchema } from '../../../core/models/form-schema.model';

describe('SectionNavComponent', () => {
  let component: SectionNavComponent;
  let fixture: ComponentFixture<SectionNavComponent>;
  let formStateService: FormStateService;

  const TEST_SCHEMA: FormSchema = {
    id: 'test-schema',
    title: 'Test Schema',
    sections: [
      { id: 'section-a', title: 'Section A', fields: [] },
      { id: 'section-b', title: 'Section B', fields: [] }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionNavComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionNavComponent);
    component = fixture.componentInstance;
    formStateService = TestBed.inject(FormStateService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render one entry per section with the section titles', () => {
    formStateService.setSchema(TEST_SCHEMA);
    fixture.detectChanges();

    const items: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.section-nav-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent?.trim()).toBe('Section A');
    expect(items[1].textContent?.trim()).toBe('Section B');
  });

  it('should mark the current section as active', () => {
    formStateService.setSchema(TEST_SCHEMA);
    formStateService.goToSection(1);
    fixture.detectChanges();

    const items: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.section-nav-item');
    expect(items[0].classList.contains('active')).toBeFalse();
    expect(items[1].classList.contains('active')).toBeTrue();
  });

  it('should navigate to the clicked section regardless of current section validity', () => {
    formStateService.setSchema(TEST_SCHEMA);
    fixture.detectChanges();

    const items: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.section-nav-item');
    items[1].click();

    let currentIndex: number | undefined;
    formStateService.currentSectionIndex$.subscribe(index => currentIndex = index);
    expect(currentIndex).toBe(1);
  });
});
