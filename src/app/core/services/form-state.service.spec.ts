import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { defer, of, throwError } from 'rxjs';

import { FormStateService } from './form-state.service';
import { MockApiService } from './mock-api.service';
import { FormSchema, SaveStatus } from '../models/form-schema.model';

describe('FormStateService', () => {
  let service: FormStateService;
  let mockApiServiceSpy: jasmine.SpyObj<MockApiService>;

  const TEST_SCHEMA: FormSchema = {
    id: 'test-schema',
    title: 'Test Schema',
    sections: []
  };

  beforeEach(() => {
    mockApiServiceSpy = jasmine.createSpyObj('MockApiService', ['getSchemas', 'saveQuestionResponse']);

    TestBed.configureTestingModule({
      providers: [{ provide: MockApiService, useValue: mockApiServiceSpy }]
    });
    service = TestBed.inject(FormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should debounce rapid edits to the same field into a single save with the final value', fakeAsync(() => {
    mockApiServiceSpy.saveQuestionResponse.and.returnValue(of({ success: true }));
    service.setSchema(TEST_SCHEMA);

    service.updateFieldValue(1, 'a');
    tick(100);
    service.updateFieldValue(1, 'ab');
    tick(100);
    service.updateFieldValue(1, 'abc');
    tick(500);

    expect(mockApiServiceSpy.saveQuestionResponse).toHaveBeenCalledTimes(1);
    expect(mockApiServiceSpy.saveQuestionResponse).toHaveBeenCalledWith(TEST_SCHEMA.id, 1, 'abc');
  }));

  it('should still save edits to two different fields made within the debounce window', fakeAsync(() => {
    mockApiServiceSpy.saveQuestionResponse.and.returnValue(of({ success: true }));
    service.setSchema(TEST_SCHEMA);

    service.updateFieldValue(1, 'value-a');
    tick(100);
    service.updateFieldValue(2, 'value-b');
    tick(500);

    expect(mockApiServiceSpy.saveQuestionResponse).toHaveBeenCalledTimes(2);
    expect(mockApiServiceSpy.saveQuestionResponse).toHaveBeenCalledWith(TEST_SCHEMA.id, 1, 'value-a');
    expect(mockApiServiceSpy.saveQuestionResponse).toHaveBeenCalledWith(TEST_SCHEMA.id, 2, 'value-b');
  }));

  it('should set status to Saved after a successful save', fakeAsync(() => {
    mockApiServiceSpy.saveQuestionResponse.and.returnValue(of({ success: true }));
    service.setSchema(TEST_SCHEMA);

    let latestStatus: SaveStatus | undefined;
    service.saveStatus$.subscribe(status => latestStatus = status);

    service.updateFieldValue(1, 'value');
    tick(500);

    expect(latestStatus).toBe(SaveStatus.Saved);
  }));

  it('should retry up to the configured count and set status to Error on persistent failure', fakeAsync(() => {
    let attempts = 0;
    mockApiServiceSpy.saveQuestionResponse.and.returnValue(defer(() => {
      attempts++;
      return throwError(() => new Error('fail'));
    }));
    service.setSchema(TEST_SCHEMA);

    let latestStatus: SaveStatus | undefined;
    service.saveStatus$.subscribe(status => latestStatus = status);

    service.updateFieldValue(1, 'value');
    tick(5000);

    // saveQuestionResponse is called once; retry resubscribes to the same
    // returned (defer-wrapped) observable for each attempt.
    expect(mockApiServiceSpy.saveQuestionResponse).toHaveBeenCalledTimes(1);
    expect(attempts).toBe(3);
    expect(latestStatus).toBe(SaveStatus.Error);
  }));
});
