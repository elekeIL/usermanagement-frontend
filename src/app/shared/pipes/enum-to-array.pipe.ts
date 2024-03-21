import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {

  transform(value: any, ...args: string[]): {key: string, value: string}[] {
    const result = [];
    const keys = Object.keys(value);
    const values:string[] = Object.values(value);
    const keysLength = keys.length;

    for (let i = 0; i < keysLength; i++) {
      result.push({ key: keys[i], value: values[i]});
    }

    return result.sort((a, b) => a.value < b.value ? -1 : 1);
  }

}
