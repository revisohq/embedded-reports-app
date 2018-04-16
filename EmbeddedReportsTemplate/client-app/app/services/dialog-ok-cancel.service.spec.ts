import { TestBed, inject } from '@angular/core/testing';

import { DialogOkCancelService } from './dialog-ok-cancel.service';

describe('DialogOkCancelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogOkCancelService]
    });
  });

  it('should be created', inject([DialogOkCancelService], (service: DialogOkCancelService<any>) => {
    expect(service).toBeTruthy();
  }));
});
