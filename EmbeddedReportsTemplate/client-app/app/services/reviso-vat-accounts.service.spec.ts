import { TestBed, inject } from '@angular/core/testing';

import { RevisoVatAccountsService } from './reviso-vat-accounts.service';

describe('RevisoVatAccountsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevisoVatAccountsService]
    });
  });

  it('should be created', inject([RevisoVatAccountsService], (service: RevisoVatAccountsService) => {
    expect(service).toBeTruthy();
  }));
});
