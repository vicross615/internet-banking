import { TestBed, inject } from '@angular/core/testing';

import { AirtimeDataService } from './airtime-data.service';

describe('AirtimeDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirtimeDataService]
    });
  });

  it('should be created', inject(
    [AirtimeDataService],
    (service: AirtimeDataService) => {
      expect(service).toBeTruthy();
    }
  ));
});
