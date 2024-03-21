import {TestBed} from '@angular/core/testing';

import {OnPendingChanges, PendingChangesGuard} from './pending-changes.guard';

describe('PendingChangesGuard', () => {
  let guard: PendingChangesGuard;
  let mockComponent: MockComponent;
  let windowConfirmSPy: jasmine.Spy;


  class MockComponent implements OnPendingChanges {
    // Set this to the value you want to mock being returned from GuardedComponent
    returnValue: boolean;

    hasPendingChanges(): boolean {
      return this.returnValue;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [MockComponent]});
    guard = TestBed.inject(PendingChangesGuard);
    mockComponent = TestBed.get(MockComponent);
    windowConfirmSPy = spyOn(window, 'confirm');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should deactivate if no pending changes', () => {
    mockComponent.returnValue = false;
    let canDeactivate = guard.canDeactivate(mockComponent, null, null, null);
    expect(canDeactivate).toBeTruthy();
  });

  it('should deactivate if no pending changes', () => {
    mockComponent.returnValue = true;
    let canDeactivate = guard.canDeactivate(mockComponent, null, null, null);
    expect(windowConfirmSPy).toHaveBeenCalled();
  });
});
