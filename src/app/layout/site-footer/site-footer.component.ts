import { Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css']
})
export class SiteFooterComponent {
  year: number;
  ngOnInit(): void {
    this.year = new Date().getFullYear()
  }
}
