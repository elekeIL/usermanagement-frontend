import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount'
})
export class AmountPipe implements PipeTransform {


  transform(value: any, args?: any): any {
    if (value === null || value === undefined) {
      return value;
    }
    return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

}
