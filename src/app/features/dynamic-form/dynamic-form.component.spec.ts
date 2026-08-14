import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormComponent } from './dynamic-form.component';
import { FormStateService } from '../../core/services/form-state.service';
import { FormSchema } from '../../core/models/form-schema.model';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let formStateService: FormStateService;

  const TEST_SCHEMA: FormSchema = {
    id: 'test-schema',
    title: 'Test Schema',
    sections: [
      {
        id: 'section-a',
        title: 'Section A',
        fields: [{ id: 1, label: 'Field A', type: 'text' }]
      },
      {
        id: 'section-b',
        title: 'Section B',
        fields: [{ id: 2, label: 'Field B', type: 'text' }]
      },
      {
        id: 'section-c',
        title: 'Section C',
        fields: [{ id: 3, label: 'Field C', type: 'long-text' }]
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    formStateService = TestBed.inject(FormStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop forwarding value changes from a section after navigating away from it', () => {
    formStateService.setSchema(TEST_SCHEMA);
    fixture.detectChanges();

    const sectionAControl = component.getControl(1);
    expect(sectionAControl).not.toBeNull();

    const updateFieldValueSpy = spyOn(formStateService, 'updateFieldValue');

    formStateService.nextSection();
    fixture.detectChanges();

    sectionAControl!.setValue('stale value');

    expect(updateFieldValueSpy).not.toHaveBeenCalledWith(1, 'stale value');
  });

  it('should still forward value changes for the currently active section', () => {
    formStateService.setSchema(TEST_SCHEMA);
    fixture.detectChanges();

    const updateFieldValueSpy = spyOn(formStateService, 'updateFieldValue');

    component.getControl(1)!.setValue('active value');

    expect(updateFieldValueSpy).toHaveBeenCalledWith(1, 'active value');
  });

  it('should render a textarea for long-text fields and forward its value', () => {
    formStateService.setSchema(TEST_SCHEMA);
    formStateService.goToSection(2);
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea.form-control');
    expect(textarea).not.toBeNull();

    const updateFieldValueSpy = spyOn(formStateService, 'updateFieldValue');
    component.getControl(3)!.setValue('a long answer');

    expect(updateFieldValueSpy).toHaveBeenCalledWith(3, 'a long answer');
  });
});
