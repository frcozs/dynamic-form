import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';

import { schemaSelectedGuard } from './schema-selected.guard';
import { FormStateService } from '../services/form-state.service';
import { FormSchema } from '../models/form-schema.model';

describe('schemaSelectedGuard', () => {
  let formStateService: FormStateService;

  const TEST_SCHEMA: FormSchema = { id: 'software-request', title: 'Software Request', sections: [] };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    formStateService = TestBed.inject(FormStateService);
  });

  function runGuard(schemaId: string): Observable<boolean | UrlTree> {
    const route = { paramMap: convertToParamMap({ schemaId }) } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() =>
      schemaSelectedGuard(route, {} as unknown as RouterStateSnapshot)
    ) as Observable<boolean | UrlTree>;
  }

  it('should allow navigation when the active schema matches the route id', async () => {
    formStateService.setSchema(TEST_SCHEMA);

    const result = await firstValueFrom(runGuard('software-request'));

    expect(result).toBe(true);
  });

  it('should redirect to home when no schema has been selected', async () => {
    const result = await firstValueFrom(runGuard('software-request'));

    expect(result instanceof UrlTree).toBeTrue();
  });

  it('should redirect to home when a different schema is active', async () => {
    formStateService.setSchema(TEST_SCHEMA);

    const result = await firstValueFrom(runGuard('hardware-request'));

    expect(result instanceof UrlTree).toBeTrue();
  });
});
