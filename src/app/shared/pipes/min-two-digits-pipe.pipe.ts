import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'minTwoDigitsPipe'
})
export class MinTwoDigitsPipePipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return (value < 10 ? '0' : '') + value;
  }

}
