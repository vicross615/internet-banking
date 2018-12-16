import { TestBed, inject } from '@angular/core/testing';

import { FileConverterService } from './file-converter.service';

describe('UploadServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileConverterService]
    });
  });

  it('should be created', inject([FileConverterService], (service: FileConverterService) => {
    expect(service).toBeTruthy();
  }));
});
