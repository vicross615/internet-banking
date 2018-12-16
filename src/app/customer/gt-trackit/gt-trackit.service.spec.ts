import { TestBed, inject } from '@angular/core/testing';

import { GtTrackitService } from './gt-trackit.service';

describe('GtTrackitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GtTrackitService]
    });
  });

  it('should be created', inject([GtTrackitService], (service: GtTrackitService) => {
    expect(service).toBeTruthy();
  }));
});
