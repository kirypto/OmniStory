import { TestBed } from '@angular/core/testing';

import { SingleEntityService } from './single-entity.service';

describe('SingleEntityService', () => {
  let service: SingleEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
