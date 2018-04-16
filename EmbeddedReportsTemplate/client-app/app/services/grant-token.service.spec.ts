import { TestBed, inject } from '@angular/core/testing';

import { GrantTokenService } from './grant-token.service';

describe('GrantTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrantTokenService]
    });
  });

  it('should be created', inject([GrantTokenService], (service: GrantTokenService) => {
    expect(service).toBeTruthy();
  }));
});
