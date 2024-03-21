
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  @Input() header = 'Confirmation';
  @Input() body = 'Are you sure?';
  @Input() positiveButtonText = 'Proceed';
  @Input() dismissOnConfirm = true;
  @Input() showLoadingOnConfirmClick = true;
  @Output()
  onConfirmClicked = new EventEmitter();
  @Input() loading = false;

  constructor(
    public modalRef: BsModalRef,
  ) {
  }



  ngOnInit(): void {
  }

  onConfirm: any = () => {
  };

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (this.showLoadingOnConfirmClick) {
      this.loading = true;
    }
    this.onConfirm();
    this.onConfirmClicked.emit();
    if (this.dismissOnConfirm) {
      this.modalRef.hide();
    }
  }
}
