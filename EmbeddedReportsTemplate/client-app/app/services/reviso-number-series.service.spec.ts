import { TestBed, inject } from '@angular/core/testing';

import { RevisoNumberSeriesService } from './reviso-number-series.service';

describe('RevisoNumberSeriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevisoNumberSeriesService]
    });
  });

  it('should be created', inject([RevisoNumberSeriesService], (service: RevisoNumberSeriesService) => {
    expect(service).toBeTruthy();
  }));
});
