import { TestBed } from '@angular/core/testing';

import { AuthUserGuardGuard } from './auth-user-guard.guard';

describe('AuthUserGuardGuard', () => {
  let guard: AuthUserGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthUserGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
