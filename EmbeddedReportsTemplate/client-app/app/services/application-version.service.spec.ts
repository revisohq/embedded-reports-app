import { TestBed, inject } from '@angular/core/testing';

import { ApplicationVersionService } from './application-version.service';

describe('ApplicationVersionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationVersionService]
    });
  });

  it('should be created', inject([ApplicationVersionService], (service: ApplicationVersionService) => {
    expect(service).toBeTruthy();
  }));
});
