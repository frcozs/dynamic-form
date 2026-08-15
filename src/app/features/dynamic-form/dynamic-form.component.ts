import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, withLatestFrom } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormFieldSchema, FormSectionSchema } from '../../core/models/form-schema.model';
import { FormStateService } from '../../core/services/form-state.service';
import { requiredNotBlankValidator } from '../../core/validators/required-not-blank.validator';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private formStateService = inject(FormStateService);

  formGroup: FormGroup = this.fb.group({});
  readonly currentSection$ = this.formStateService.currentSection$;

  private readonly sectionRebuild$ = new Subject<void>();

  ngOnInit(): void {
    this.formStateService.currentSection$.pipe(
      withLatestFrom(this.formStateService.formData$),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([section, savedData]) => {
      if (section) {
        this.buildForm(section, savedData);
      }
    });
  }

  getControl(fieldId: number): AbstractControl | null {
    return this.formGroup.get(fieldId.toString());
  }

  getErrorMessage(fieldId: number): string {
    const errors = this.getControl(fieldId)?.errors;
    if (!errors) return '';
    if (errors['required']) return 'This field is required.';
    if (errors['min']) return 'Value cannot be negative.';
    return 'Invalid value.';
  }

  private buildForm(section: FormSectionSchema, savedData: Record<number, unknown>): void {
    this.sectionRebuild$.next();

    const group: Record<string, unknown> = {};

    section.fields.forEach((field: FormFieldSchema) => {
      const initialValue = savedData[field.id] !== undefined
        ? savedData[field.id]
        : field.default !== undefined ? field.default : (field.type === 'toggle' ? false : '');

      const validators: ValidatorFn[] = [];
      if (field.required) {
        validators.push(
          field.type === 'text' || field.type === 'long-text'
            ? requiredNotBlankValidator()
            : Validators.required
        );
      }
      if (field.type === 'number') {
        validators.push(Validators.min(0));
      }

      group[field.id] = [initialValue, validators];
    });

    this.formGroup = this.fb.group(group);
    this.formStateService.setSectionValidity(this.formGroup.valid);

    this.formGroup.statusChanges.pipe(
      takeUntil(this.sectionRebuild$),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(status => {
      this.formStateService.setSectionValidity(status === 'VALID');
    });

    this.subscribeToFormChanges(section);
  }

  private subscribeToFormChanges(section: FormSectionSchema): void {
    section.fields.forEach((field: FormFieldSchema) => {
      const control = this.formGroup.get(field.id.toString());

      if (control) {
        control.valueChanges.pipe(
          takeUntil(this.sectionRebuild$),
          takeUntilDestroyed(this.destroyRef),
          distinctUntilChanged()
        ).subscribe(value => {
          this.formStateService.updateFieldValue(field.id, value);
        });
      }
    });
  }
}