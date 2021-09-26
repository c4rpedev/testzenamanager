import { TestBed } from '@angular/core/testing';

import { GetProvincesService } from './get-provinces.service';

describe('GetProvincesService', () => {
  let service: GetProvincesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetProvincesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
