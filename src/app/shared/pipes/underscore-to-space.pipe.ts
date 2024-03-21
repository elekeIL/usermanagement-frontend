import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'underscoreToSpace'
})
export class UnderscoreToSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value || !value.replace) {
      return;
    }
    return value.replace(/_/g, ' ');
  }

}
