import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { SchemaSelectionComponent } from './schema-selection.component';
import { MockApiService } from '../../core/services/mock-api.service';
import { FormSchema } from '../../core/models/form-schema.model';

describe('SchemaSelectionComponent', () => {
  let component: SchemaSelectionComponent;
  let fixture: ComponentFixture<SchemaSelectionComponent>;
  let mockApiServiceSpy: jasmine.SpyObj<MockApiService>;

  const TEST_SCHEMAS: FormSchema[] = [
    { id: 'software-request', title: 'Software Request', sections: [] },
    { id: 'hardware-request', title: 'Hardware Request', sections: [] }
  ];

  beforeEach(async () => {
    mockApiServiceSpy = jasmine.createSpyObj('MockApiService', ['getSchemas']);

    await TestBed.configureTestingModule({
      imports: [SchemaSelectionComponent],
      providers: [{ provide: MockApiService, useValue: mockApiServiceSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemaSelectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockApiServiceSpy.getSchemas.and.returnValue(of(TEST_SCHEMAS));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the available schemas on success', () => {
    mockApiServiceSpy.getSchemas.and.returnValue(of(TEST_SCHEMAS));
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.pill-btn');
    expect(buttons.length).toBe(2);
  });

  it('should show an error state and recover via retry', () => {
    mockApiServiceSpy.getSchemas.and.returnValues(
      throwError(() => new Error('load failed')),
      of(TEST_SCHEMAS)
    );
    fixture.detectChanges();

    const retryButton: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-retry');
    expect(retryButton).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.pill-btn').length).toBe(0);

    retryButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.pill-btn').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.btn-retry')).toBeNull();
    expect(mockApiServiceSpy.getSchemas).toHaveBeenCalledTimes(2);
  });
});
