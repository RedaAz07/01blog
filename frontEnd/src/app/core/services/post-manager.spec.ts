import { TestBed } from '@angular/core/testing';

import { PostManager } from './post-manager';

describe('PostManager', () => {
  let service: PostManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
