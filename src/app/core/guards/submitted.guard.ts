import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FormStateService } from '../services/form-state.service';

export const submittedGuard: CanActivateFn = (route): Observable<boolean | UrlTree> => {
  const formStateService = inject(FormStateService);
  const router = inject(Router);

  const schemaId = route.paramMap.get('schemaId');

  return formStateService.isSubmitted$.pipe(
    take(1),
    map(isSubmitted => isSubmitted ? true : router.createUrlTree(['/form', schemaId]))
  );
};
