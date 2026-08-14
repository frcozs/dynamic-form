import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { FormSummaryComponent } from './form-summary.component';
import { FormStateService } from '../../core/services/form-state.service';

describe('FormSummaryComponent', () => {
  let component: FormSummaryComponent;
  let fixture: ComponentFixture<FormSummaryComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSummaryComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSummaryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset state and navigate home on complete', () => {
    const formStateService = TestBed.inject(FormStateService);
    spyOn(formStateService, 'resetState');
    spyOn(router, 'navigate');

    component.onCompleteAndReset();

    expect(formStateService.resetState).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
