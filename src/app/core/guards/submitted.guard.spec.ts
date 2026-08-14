import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';

import { submittedGuard } from './submitted.guard';
import { FormStateService } from '../services/form-state.service';

describe('submittedGuard', () => {
  let formStateService: FormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    formStateService = TestBed.inject(FormStateService);
  });

  function runGuard(schemaId: string): Observable<boolean | UrlTree> {
    const route = { paramMap: convertToParamMap({ schemaId }) } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() =>
      submittedGuard(route, {} as unknown as RouterStateSnapshot)
    ) as Observable<boolean | UrlTree>;
  }

  it('should allow navigation when the form has been submitted', async () => {
    formStateService.submitForm();

    const result = await firstValueFrom(runGuard('software-request'));

    expect(result).toBe(true);
  });

  it('should redirect back to the wizard when the form has not been submitted', async () => {
    const result = await firstValueFrom(runGuard('software-request'));

    expect(result instanceof UrlTree).toBeTrue();
  });
});
