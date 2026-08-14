import { Injectable, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { 
  BehaviorSubject, 
  Observable, 
  Subject, 
  EMPTY, 
  combineLatest, 
  timer 
} from 'rxjs';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  groupBy,
  map,
  mergeMap,
  retry,
  catchError,
  tap
} from 'rxjs/operators';
import { FormSchema, QuestionSavePayload, SaveStatus } from '../models/form-schema.model';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {

  private readonly AUTO_SAVE_RETRY_COUNT = 2;
  private readonly AUTO_SAVE_RETRY_DELAY_MS = 2000;
  private readonly AUTO_SAVE_DEBOUNCE_MS = 400;

  private readonly destroyRef = inject(DestroyRef);
  private readonly mockApiService = inject(MockApiService);

  private readonly selectedSchemaSubject = new BehaviorSubject<FormSchema | null>(null);
  readonly selectedSchema$: Observable<FormSchema | null> = this.selectedSchemaSubject.asObservable();

  private readonly currentSectionIndexSubject = new BehaviorSubject<number>(0);
  readonly currentSectionIndex$: Observable<number> = this.currentSectionIndexSubject.asObservable();

  private readonly saveStatusSubject = new BehaviorSubject<SaveStatus>(SaveStatus.Idle);
  readonly saveStatus$: Observable<SaveStatus> = this.saveStatusSubject.asObservable();

  private readonly formDataSubject = new BehaviorSubject<Record<number, unknown>>({});
  readonly formData$: Observable<Record<number, unknown>> = this.formDataSubject.asObservable();

  private isSubmittedSubject = new BehaviorSubject<boolean>(false);
  readonly isSubmitted$ = this.isSubmittedSubject.asObservable();

  private isCurrentSectionValidSubject = new BehaviorSubject<boolean>(false);
  readonly isCurrentSectionValid$ = this.isCurrentSectionValidSubject.asObservable();

  private readonly questionAutoSaveQueue = new Subject<QuestionSavePayload>();

  readonly currentSection$ = combineLatest([
    this.selectedSchema$,
    this.currentSectionIndex$
  ]).pipe(
    map(([schema, index]) => schema?.sections[index] ?? null)
  );

  readonly isFirstSection$: Observable<boolean> = this.currentSectionIndex$.pipe(
    map(index => index === 0)
  );

  readonly isLastSection$: Observable<boolean> = combineLatest([
    this.selectedSchema$,
    this.currentSectionIndex$
  ]).pipe(
    map(([schema, index]) => {
      if (!schema) return true;
      return index === schema.sections.length - 1;
    })
  );

  constructor() {
    this.initAutoSavePipeline();
  }

  setSchema(schema: FormSchema): void {
    this.selectedSchemaSubject.next(schema);
    this.currentSectionIndexSubject.next(0);
    this.formDataSubject.next({});
    this.saveStatusSubject.next(SaveStatus.Idle);
  }

  nextSection(): void {
    const schema = this.selectedSchemaSubject.value;
    const currentIndex = this.currentSectionIndexSubject.value;
    if (schema && currentIndex < schema.sections.length - 1) {
      const nextIndex = currentIndex + 1;
      this.currentSectionIndexSubject.next(nextIndex);
    }
  }

  previousSection(): void {
    const schema = this.selectedSchemaSubject.value;
    const currentIndex = this.currentSectionIndexSubject.value;
    if (schema && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      this.currentSectionIndexSubject.next(prevIndex);
    }
  }

  goToSection(index: number): void {
    const schema = this.selectedSchemaSubject.value;
    if (schema && index >= 0 && index < schema.sections.length) {
      this.currentSectionIndexSubject.next(index);
    }
  }

  updateFieldValue(questionId: number, value: unknown): void {
    const currentData = this.formDataSubject.value;
    
    if (currentData[questionId] === value) {
      return;
    }

    const updatedData = { ...currentData, [questionId]: value };
    this.formDataSubject.next(updatedData);

    const schema = this.selectedSchemaSubject.value;
    if (!schema) return;

    this.questionAutoSaveQueue.next({
      requestId: schema.id,
      questionId,
      value
    });
  }

  private initAutoSavePipeline(): void {
    const debouncedQueue$ = this.debouncePerField(
      this.questionAutoSaveQueue.pipe(takeUntilDestroyed(this.destroyRef))
    );

    debouncedQueue$.pipe(
      tap(() => this.saveStatusSubject.next(SaveStatus.Saving)),
      concatMap(payload => this.saveWithRetry(payload))
    ).subscribe();
  }

  private debouncePerField(source$: Observable<QuestionSavePayload>): Observable<QuestionSavePayload> {
    return source$.pipe(
      groupBy(payload => payload.questionId),
      mergeMap(group$ => group$.pipe(
        debounceTime(this.AUTO_SAVE_DEBOUNCE_MS),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev.value) === JSON.stringify(curr.value))
      ))
    );
  }

  private saveWithRetry(payload: QuestionSavePayload): Observable<{ success: boolean }> {
    return this.mockApiService.saveQuestionResponse(
      payload.requestId,
      payload.questionId,
      payload.value
    ).pipe(
      retry({
        count: this.AUTO_SAVE_RETRY_COUNT,
        delay: (error, retryCount) => {
          this.saveStatusSubject.next(SaveStatus.Error);
          return timer(this.AUTO_SAVE_RETRY_DELAY_MS);
        }
      }),
      tap(() => this.saveStatusSubject.next(SaveStatus.Saved)),
      catchError(err => {
        this.saveStatusSubject.next(SaveStatus.Error);
        return EMPTY;
      })
    );
  }

  submitForm(): void {
    this.isSubmittedSubject.next(true);
  }

  resetState(): void {
    this.selectedSchemaSubject.next(null);
    this.currentSectionIndexSubject.next(0);
    this.formDataSubject.next({});
    this.saveStatusSubject.next(SaveStatus.Idle);
    this.isSubmittedSubject.next(false);
  }

  setSectionValidity(isValid: boolean): void {
    this.isCurrentSectionValidSubject.next(isValid);
  }
}