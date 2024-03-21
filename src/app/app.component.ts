import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit{
  title = 'user-management-frontend';
  @ViewChild('header', { static: false }) headerElement?: ElementRef;
  @ViewChild('footer', { static: false }) footerElement?: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Check if ViewChild elements are initialized and not undefined
    if (this.headerElement?.nativeElement && this.footerElement?.nativeElement) {
      // Use Renderer2 to get the actual heights of header and footer elements
      const headerHeight = this.headerElement.nativeElement.offsetHeight;
      const footerHeight = this.footerElement.nativeElement.offsetHeight;

      // Now you can use these heights as needed, such as adjusting the main content height
      const mainContent = document.querySelector('.dash-main');
      if (mainContent) {
        this.renderer.setStyle(mainContent, 'min-height', `calc(100vh - ${headerHeight + footerHeight}px)`);
      }
    }
  }
}
