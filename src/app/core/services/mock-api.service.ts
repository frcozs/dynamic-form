import { Injectable } from '@angular/core';
import { Observable, defer, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { FormSchema } from '../models/form-schema.model';
import SCHEMAS_DATA from '../mocks/schemas.json';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private readonly schemas: FormSchema[] = SCHEMAS_DATA as FormSchema[];

  getSchemas(): Observable<FormSchema[]> {
    return this.simulateRequest({
      result: this.schemas,
      minDelayMs: 400,
      maxDelayMs: 700,
      failureRate: 0.1,
      errorMessage: '[MockAPI] HTTP 500: Error loading schemas'
    });
  }

  saveQuestionResponse(
    requestId: string,
    questionId: number,
    value: unknown
  ): Observable<{ success: boolean }> {
    return this.simulateRequest({
      result: { success: true },
      minDelayMs: 600,
      maxDelayMs: 1000,
      failureRate: 0.15,
      errorMessage: `[MockAPI] HTTP 500: Error saving question ID: ${questionId}`
    });
  }

  private simulateRequest<T>(config: {
    result: T;
    minDelayMs: number;
    maxDelayMs: number;
    failureRate: number;
    errorMessage: string;
  }): Observable<T> {
    return defer(() => {
      const randomDelay = Math.floor(Math.random() * (config.maxDelayMs - config.minDelayMs + 1)) + config.minDelayMs;
      const shouldFail = Math.random() < config.failureRate;

      return of(null).pipe(
        delay(randomDelay),
        mergeMap(() => {
          if (shouldFail) {
            return throwError(() => new Error(config.errorMessage));
          }
          return of(config.result);
        })
      );
    });
  }
}