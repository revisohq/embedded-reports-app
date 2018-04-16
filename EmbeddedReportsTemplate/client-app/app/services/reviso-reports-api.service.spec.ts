import { TestBed, inject } from '@angular/core/testing';

import { RevisoReportsApiService } from './reviso-reports-api.service';

describe('RevisoReportsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevisoReportsApiService]
    });
  });

  it('should be created', inject([RevisoReportsApiService], (service: RevisoReportsApiService) => {
    expect(service).toBeTruthy();
  }));
});
