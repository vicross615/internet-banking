import { TestBed, inject } from '@angular/core/testing';

import { AccountStatementService } from './account-statement.service';

describe('AccountStatementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountStatementService]
    });
  });

  it('should be created', inject([AccountStatementService], (service: AccountStatementService) => {
    expect(service).toBeTruthy();
  }));
});
