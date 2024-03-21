import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSpace'
})
export class CamelCaseToSpacePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value?.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

}
