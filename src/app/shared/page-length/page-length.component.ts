import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-page-length',
  templateUrl: './page-length.component.html',
  styleUrls: ['./page-length.component.css']
})
export class PageLengthComponent {
  pageLengths?: number [];
  @Input()pageLength?: number;
  @Output() pageLengthChanged = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
    if (!this.pageLength) {
      this.pageLength = 10;
    }
    this.pageLengths = [10, 25, 50 , 100];
  }

  lengthChanged() {
    this.pageLengthChanged.emit(this.pageLength);
  }


}
