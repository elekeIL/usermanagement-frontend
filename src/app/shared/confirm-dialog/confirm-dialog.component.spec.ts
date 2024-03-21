import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { TranslatePipe, TranslateModule } from '@ngx-translate/core';
import { TestModule } from 'dd-shared-lib';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let modalRefSpy: jasmine.Spy;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDialogComponent ],
      imports: [
        TestModule,
        TranslateModule,
        ModalModule.forRoot(),
      ],
      providers: [
        BsModalRef,
        TranslatePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modalRefSpy = spyOn(TestBed.inject(BsModalRef), 'hide');

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.close();
    expect(modalRefSpy).toHaveBeenCalled();
  });

  it('should call confirm', () => {
    const i18n = component.i18n;
    component.confirm();
    expect(modalRefSpy).toHaveBeenCalled();
  });

  it('should set dismissOnConfirm to false and close modal', () => {
    component.dismissOnConfirm = false;
    component.showLoadingOnConfirmClick = false;
    fixture.detectChanges();

    spyOn(component.onConfirmClicked, 'emit');

    component.confirm();
    expect(component.loading).toBeFalse();
    expect(component.onConfirmClicked.emit).toHaveBeenCalled();
  });
});
