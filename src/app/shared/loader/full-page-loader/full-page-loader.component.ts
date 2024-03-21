import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-full-page-loader',
  templateUrl: './full-page-loader.component.html',
  styleUrls: ['./full-page-loader.component.css']
})
export class FullPageLoaderComponent implements OnInit {
  @Input() opacity: number = 1;

  @Input() customText: string | undefined | null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
