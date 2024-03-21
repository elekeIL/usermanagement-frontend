import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input()
  customText:string;

  constructor() { }

  ngOnInit(): void {
  }

}
