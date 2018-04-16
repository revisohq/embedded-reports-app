import { TestBed, inject } from '@angular/core/testing';

import { QueryParametersService } from './query-parameters.service';

describe('QueryParametersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryParametersService]
    });
  });

  it('should be created', inject([QueryParametersService], (service: QueryParametersService) => {
    expect(service).toBeTruthy();
  }));
});
