import { TestBed } from '@angular/core/testing';

import { MultipleEntityService } from './multiple-entity.service';

describe('MultipleEntityService', () => {
  let service: MultipleEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipleEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
