import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { MockApiService } from './mock-api.service';

describe('MockApiService', () => {
  let service: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSchemas', () => {
    it('should resolve with the schema list when the simulated request succeeds', async () => {
      spyOn(Math, 'random').and.returnValue(0.5);

      const schemas = await firstValueFrom(service.getSchemas());

      expect(schemas.length).toBeGreaterThan(0);
    });

    it('should error when the simulated request fails', async () => {
      spyOn(Math, 'random').and.returnValue(0);

      await expectAsync(firstValueFrom(service.getSchemas())).toBeRejected();
    });
  });

  describe('saveQuestionResponse', () => {
    it('should resolve with success when the simulated request succeeds', async () => {
      spyOn(Math, 'random').and.returnValue(0.5);

      const result = await firstValueFrom(service.saveQuestionResponse('test-schema', 1, 'value'));

      expect(result).toEqual({ success: true });
    });

    it('should error when the simulated request fails', async () => {
      spyOn(Math, 'random').and.returnValue(0);

      await expectAsync(
        firstValueFrom(service.saveQuestionResponse('test-schema', 1, 'value'))
      ).toBeRejected();
    });
  });
});
